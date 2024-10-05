import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Voice from 'react-native-voice';
import * as Speech from 'expo-speech';
import * as MediaLibrary from 'expo-media-library'; // Removed expo-permissions, now using expo-media-library
import data from './data';

export default function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const currentCategory = data.categories[currentCategoryIndex];
  const currentLesson = currentCategory.lessons[currentLessonIndex];
  const currentWord = currentLesson.words[currentWordIndex];

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    requestSpeechRecognitionPermission();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const requestSpeechRecognitionPermission = async () => {
    try {
      // Request microphone permission directly with MediaLibrary
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need microphone permissions to make this work!');
        return;
      }
      console.log('Microphone permission granted.');
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const onSpeechResults = (e) => {
    setRecognizedText(e.value[0]);
    setIsListening(false);
  };

  const onSpeechError = (e) => {
    console.error('Speech recognition error:', e.error);
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('ko-KR'); // Start listening in Korean
    } catch (e) {
      console.error('Error starting speech recognition:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping speech recognition:', e);
    }
  };

  const handleSpeakWord = (word) => {
    Speech.speak(word.word, { language: 'ko' });
  };

  const handleNextWord = () => {
    if (currentWordIndex < currentLesson.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setRecognizedText('');
    } else if (currentLessonIndex < currentCategory.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentWordIndex(0);
      setRecognizedText('');
    } else if (currentCategoryIndex < data.categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentLessonIndex(0);
      setCurrentWordIndex(0);
      setRecognizedText('');
    } else {
      alert("You've reached the end of the lessons!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentCategory.name}</Text>
      <Text style={styles.lessonName}>{currentLesson.name}</Text>
      <Text style={styles.word}>{currentWord.word}</Text>
      <Text style={styles.pronunciation}>{currentWord.pronunciation}</Text>
      {currentWord.example && <Text style={styles.example}>{currentWord.example}</Text>}
      <TouchableOpacity onPress={() => handleSpeakWord(currentWord)}>
        <Text style={styles.button}>Speak "{currentWord.word}"</Text>
      </TouchableOpacity>

      <Button
        title={isListening ? "Stop Listening" : "Start Listening"}
        onPress={isListening ? stopListening : startListening}
      />

      <Text style={styles.text}>Recognized Text: {recognizedText}</Text>
      <Button title="Next Word" onPress={handleNextWord} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  lessonName: {
    fontSize: 20,
    marginBottom: 10,
  },
  word: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pronunciation: {
    fontSize: 20,
    color: '#555',
    marginBottom: 20,
  },
  example: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
});
