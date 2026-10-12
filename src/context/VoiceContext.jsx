import { createContext, useContext } from "react";

const VoiceContext = createContext(null);

export const VoiceProvider = ({ children }) => {
  const speakFeedback = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any overlapping speech queues
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VoiceContext.Provider value={{ speakFeedback }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoiceFeedback = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    // Graceful fallback if a component is rendered outside the provider
    return { speakFeedback: (text) => console.log(`Voice Fallback: ${text}`) };
  }
  return context;
};