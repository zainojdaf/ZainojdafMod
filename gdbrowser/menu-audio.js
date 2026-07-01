const MENU_AUDIO_KEY = 'gdbrowserMenuAudioPos';
const MENU_LOOP_SRC = '../assets/music/menuLoop.mp3';
let menuAudio = null;
let menuAudioStarted = false;
let menuAudioPosition = parseFloat(localStorage.getItem(MENU_AUDIO_KEY) || '0') || 0;

function createMenuAudio() {
    if (menuAudioStarted) return;
    if (!MENU_LOOP_SRC) return;
    menuAudio = document.createElement('audio');
    menuAudio.src = MENU_LOOP_SRC;
    menuAudio.loop = true;
    menuAudio.volume = 0.5;
    menuAudio.preload = 'auto';
    menuAudio.currentTime = menuAudioPosition;
    menuAudio.addEventListener('canplay', () => {
        if (!menuAudioStarted) {
            menuAudio.play().catch(() => {
                // user interaction may be required
            });
            menuAudioStarted = true;
        }
    });
    menuAudio.addEventListener('timeupdate', () => {
        localStorage.setItem(MENU_AUDIO_KEY, String(menuAudio.currentTime));
    });
    document.body.appendChild(menuAudio);
}

function restartMenuAudio() {
    if (!menuAudio) {
        createMenuAudio();
        return;
    }
    menuAudioPosition = parseFloat(localStorage.getItem(MENU_AUDIO_KEY) || '0') || 0;
    menuAudio.currentTime = menuAudioPosition;
    menuAudio.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
    createMenuAudio();
});

window.addEventListener('pageshow', () => {
    restartMenuAudio();
});

window.addEventListener('focus', () => {
    restartMenuAudio();
});

window.addEventListener('beforeunload', () => {
    if (menuAudio) {
        localStorage.setItem(MENU_AUDIO_KEY, String(menuAudio.currentTime));
    }
});
