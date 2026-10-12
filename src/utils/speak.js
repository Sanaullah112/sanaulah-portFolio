/**
 * speak.js
 * Reusable voice feedback utility using the Browser Speech Synthesis API.
 * Usage: speak('Resume uploaded successfully.')
 */

let voicesCache = [];

const loadVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  voicesCache = window.speechSynthesis.getVoices();
};

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const isEnabledByDefault = () => {
  const stored = localStorage.getItem('voice_feedback_enabled');
  return stored === null ? true : stored === 'true';
};

export const setVoiceFeedbackEnabled = (enabled) => {
  localStorage.setItem('voice_feedback_enabled', String(enabled));
};

export const isVoiceFeedbackEnabled = () => isEnabledByDefault();

export const speak = (text, { rate = 1, pitch = 1, volume = 1 } = {}) => {
  try {
    if (!text) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (!isEnabledByDefault()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    const englishVoice = voicesCache.find((v) => v.lang?.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;

    // Don't cancel — let utterances queue instead of killing the new one
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis failed:', err);
  }
};

export const speakSuccess = (action) => speak(`${action} successfully.`);
export const speakError = (message = 'Something went wrong.') => speak(message);

export default speak;
