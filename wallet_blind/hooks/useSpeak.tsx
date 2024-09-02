import Tts from 'react-native-tts';

function useSpeak() {
  return {
    speak: (text: string) => Tts.speak(text),
    stop: () => Tts.stop(),
  };
}

export {useSpeak};
