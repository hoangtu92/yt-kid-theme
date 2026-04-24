/**
 *
 * @param text
 * @param currentLang
 * @returns {Promise<unknown>}
 */
function speak(text, currentLang) {
    return new Promise((resolve, reject) => {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === currentLang);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang; // or 'vi-VN'
        utterance.voice = voice;

        speechSynthesis.speak(utterance);

        utterance.onend = resolve;
        utterance.onerror = reject;
    })
}

/**
 *
 * @param timeout
 * @returns {Promise<unknown>}
 */
function waitForEndSafe(timeout = 1000) {
    return new Promise((resolve) => {
        let done = false;

        const timer = setTimeout(() => {
            if (!done) {
                done = true;
                resolve();
            }
        }, timeout);

        recognition.addEventListener("end", function handler() {
            if (done) return;

            done = true;
            clearTimeout(timer);
            recognition.removeEventListener("end", handler);
            resolve();
        });
    });
}

/**
 *
 * @param text
 * @returns {Promise<void>}
 */
async function handleFinalResult(text) {
    // 👉 luôn sync lang trước khi start lại
    recognition.lang = await getLanguage();

    // 👉 dừng mic trước
    if (isRunning) {
        recognition.abort();
        await delay(200);
    }

    await searchVideo(text);
}

/**
 *
 * @returns {Promise<void>}
 */
async function startVoiceSearch (){
    await initRecognition();

    // 👉 nếu đang chạy → abort
    if (isRunning || isStarting) {
        recognition.abort();
        await waitForEndSafe();
    }

    let lang = await getLanguage();

    await initParticle();

    await speak(translate[lang]["what_to_watch"], lang);

    await delay(400); // 🔥 fix miss voice

    recognition.lang = lang;

    try {
        isStarting = true;
        recognition.start();
    } catch (e) {
        isStarting = false;
        console.warn("Start failed:", e);
    }
}

/**
 *
 * @returns {Promise<void>}
 */
async function initRecognition() {

    if(recognition) return;

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = function (e){
        isRunning = true;
        isStarting = false;
    }
    recognition.onend = function (e){
        isRunning = false;
        isStarting = false;

        setTimeout(() => {
            destroyParticles();
        }, 2000)
    }

    recognition.onresult = async (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                final += transcript;
            } else {
                interim += transcript;
            }
        }

        // 🔥 LIVE text (updates while speaking)
        if (interim) {
            updateText(interim);
        }

        // ✅ FINAL text (stable)
        if (final) {
            updateText(final);

            await handleFinalResult(final);
        }

    };

    recognition.onerror = async (err) => {

        if (isRunning) {
            recognition.abort();
            await delay(200);
        }

        const lang = await getLanguage();

        const fallback = translate[lang]["default_search"];

        updateText(fallback);

        await speak(translate[lang]["cannot_hear_you"], lang);

        await delay(400);

        await searchVideo(fallback);
    }
}
