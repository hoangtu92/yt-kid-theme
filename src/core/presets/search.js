// src/core/presets/search.js

export const searchPresets = {
    "vi-VN": [
        { type: "action", action: "switchLanguage", targetLang: "en-US", icon: "dad.gif" },

        { type: "search", query: "Nhạc thiếu nhi", icon: "music.gif" },
        { type: "search", query: "Hoạt hình", icon: "video.gif" },
        { type: "search", query: "Học nói, học viết", icon: "abc.gif" },
        { type: "search", query: "Học vẽ, tô màu", icon: "painting.gif" },
        { type: "search", query: "trò chơi, sáng tạo", icon: "children.gif" },

        { type: "action", action: "voiceRecognition", icon: "podcast.gif" }
    ],

    "en-US": [
        { type: "action", action: "switchLanguage", targetLang: "vi-VN", icon: "mom.gif" },

        { type: "search", query: "Kids songs", icon: "music_1.gif" },
        { type: "search", query: "Disney, cartoon, 3D animated", icon: "video_1.gif" },
        { type: "search", query: "learn English, learn to speak", icon: "abc_1.gif" },
        { type: "search", query: "Painting, color, drawing", icon: "painting_1.gif" },
        { type: "search", query: "outdoor, fun game", icon: "children_1.gif" },

        { type: "action", action: "voiceRecognition", icon: "podcast.gif" }
    ]
};
