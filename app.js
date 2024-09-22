import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

const lessonPlans = [
  {
    category: 'Greetings',
    lessons: [
      {
        lesson: 'Basic Greetings',
        words: [
          { word: '안녕하세요.', meaning: 'Hello' },
          { word: '잘 지내세요?', meaning: 'How are you?' },
          { word: '안녕히 가세요.', meaning: 'Goodbye (when someone is leaving)' },
          { word: '안녕히 계세요.', meaning: 'Goodbye (when you are leaving)' },
          { word: '여보세요.', meaning: 'Hello (on the phone)' },
        ],
      },
      {
        lesson: 'Farewells',
        words: [
          { word: '안녕히 가세요.', meaning: 'Goodbye (when someone is leaving)' },
          { word: '안녕히 계세요.', meaning: 'Goodbye (when you are leaving)' },
          { word: '다음에 봐요.', meaning: 'See you next time' },
          { word: '조심히 가세요.', meaning: 'Take care' },
        ],
      },
    ],
  },
  {
    category: 'Numbers',
    lessons: [
      {
        lesson: 'Basic Numbers',
        words: [
          { word: '일.', meaning: 'One' },
          { word: '이.', meaning: 'Two' },
          { word: '삼.', meaning: 'Three' },
          { word: '사.', meaning: 'Four' },
          { word: '오.', meaning: 'Five' },
          { word: '육.', meaning: 'Six' },
          { word: '칠.', meaning: 'Seven' },
          { word: '팔.', meaning: 'Eight' },
          { word: '구.', meaning: 'Nine' },
          { word: '십.', meaning: 'Ten' },
        ],
      },
    ],
  },
];

export default function App() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFrontPage, setIsFrontPage] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const currentCategory = lessonPlans[currentCategoryIndex];
  const currentLesson = currentCategory.lessons[currentLessonIndex];
  const currentWord = currentLesson.words[currentWordIndex];

  const handleSpeakWord = useCallback(() => {
    Speech.speak(currentWord.word, { language: 'ko' });
  }, [currentWord.word]);

  const handleNextWord = useCallback(() => {
    if (currentWordIndex < currentLesson.words.length - 1) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCompletedWords((prevCount) => prevCount + 1);
    } else {
      if (currentLessonIndex < currentCategory.lessons.length - 1) {
        setCurrentLessonIndex((prevIndex) => prevIndex + 1);
        setCurrentWordIndex(0);
        setCompletedWords(0);
      } else if (currentCategoryIndex < lessonPlans.length - 1) {
        alert('Category Complete! Moving to the next category.');
        setCurrentCategoryIndex((prevIndex) => prevIndex + 1);
        setCurrentLessonIndex(0);
        setCurrentWordIndex(0);
        setCompletedWords(0);
      } else {
        alert('Congratulations! You have completed all lessons.');
      }
    }
  }, [currentWordIndex, currentLessonIndex, currentCategoryIndex]);

  const handleExitToMainMenu = () => {
    setIsFrontPage(true);
    setCurrentCategoryIndex(0);
    setCurrentLessonIndex(0);
    setCurrentWordIndex(0);
    setCompletedWords(0);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      {isFrontPage ? (
        <View style={styles.welcomePage}>
          <Text style={styles.welcomeTitle}>Welcome to the Korean Learning App!</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setIsFrontPage(false)}>
            <Text style={styles.startButtonText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
      ) : isMenuOpen ? (
        <View style={styles.menu}>
          {lessonPlans.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuButton}
              onPress={() => {
                setCurrentCategoryIndex(index);
                setIsMenuOpen(false);
              }}>
              <Text style={styles.menuButtonText}>{category.category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={toggleModal} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Select a Lesson</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExitToMainMenu} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit to Main Menu</Text>
          </TouchableOpacity>

          <Modal visible={isModalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select a Lesson</Text>
              <FlatList
                data={currentCategory.lessons}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setCurrentLessonIndex(index);
                      toggleModal();
                    }}>
                    <Text style={styles.modalButtonText}>{item.lesson}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.wordCard}>
          <Text style={styles.wordText}>{currentWord.word}</Text>
          <Text style={styles.meaningText}>{currentWord.meaning}</Text>
          <ProgressBar
            progress={(completedWords + 1) / currentLesson.words.length}
            color="#03a9f4"
            style={styles.progressBar}
          />
          <TouchableOpacity onPress={handleSpeakWord} style={styles.pronounceButton}>
            <Text style={styles.pronounceButtonText}>Pronounce</Text>
          </TouchableOpacity>
          <Text style={styles.progressText}>
            Word {completedWords + 1} of {currentLesson.words.length}
          </Text>
          <TouchableOpacity onPress={handleNextWord} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleExitToMainMenu} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit to Main Menu</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  menu: {
    width: '100%',
  },
  menuButton: {
    padding: 15,
    backgroundColor: '#03a9f4',
    marginVertical: 5,
    borderRadius: 10,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  wordCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  wordText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  pronounceButton: {
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  pronounceButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  progressBar: {
    width: '100%',
    marginVertical: 10,
  },
  progressText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  exitButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  exitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: '#03a9f4',
    marginVertical: 5,
    borderRadius: 10,
    width: '80%',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '50%',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
