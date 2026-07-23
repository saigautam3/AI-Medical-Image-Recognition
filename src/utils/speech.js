let currentUtterance = null;

export const speakText = (text, onStart, onEnd, onError) => {
  if ('speechSynthesis' in window) {
    // Cancel any active reading
    window.speechSynthesis.cancel();
    
    // Clean text by stripping markdown symbols and links for cleaner listening
    const cleanText = text
      .replace(/[*#`_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Load voices
    const getVoicesAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a premium English voice (like Google UK English Male/Female, Apple voice, or Microsoft)
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))) ||
                            voices.find(v => v.lang.startsWith('en')) ||
                            voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for clear medical terminology pronunciation
      utterance.pitch = 1.0;
      
      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;
      if (onError) utterance.onerror = onError;
      
      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = getVoicesAndSpeak;
    } else {
      getVoicesAndSpeak();
    }
  } else {
    if (onError) onError(new Error("Speech synthesis not supported in this browser"));
  }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const pauseSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};
