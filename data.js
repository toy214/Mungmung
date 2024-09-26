const data = {
    categories: [
      {
        id: 'korean_alphabet',
        name: 'Korean Alphabet',
        lessons: [
          {
            id: 'consonants',
            name: 'Consonants',
            words: [
              { word: 'ㄱ', pronunciation: 'g/k', example: '가방 (bag)' },
              { word: 'ㄴ', pronunciation: 'n', example: '나무 (tree)' },
              { word: 'ㄷ', pronunciation: 'd/t', example: '다리 (bridge)' },
              // Add the rest of the cosonants 
            ],
          },
          {
            id: 'vowels',
            name: 'Vowels',
            words: [
              { word: 'ㅏ', pronunciation: 'a', example: '사과 (apple)' },
              { word: 'ㅑ', pronunciation: 'ya', example: '야구 (baseball)' },
              { word: 'ㅓ', pronunciation: 'eo', example: '서울 (Seoul)' },
              // Add rest of the vowels
            ],
          },
        ],
      },
      {
        id: 'common_phrases',
        name: 'Common Phrases',
        lessons: [
          {
            id: 'greetings',
            name: 'Greetings',
            words: [
              { word: '안녕하세요', pronunciation: 'annyeong haseyo', meaning: 'Hello' },
              { word: '감사합니다', pronunciation: 'gamsahamnida', meaning: 'Thank you' },
              { word: '죄송합니다', pronunciation: 'joesonghamnida', meaning: 'Sorry' },
              // Add more greetings!
            ],
          },
          {
            id: 'basic_conversation',
            name: 'Basic Conversation',
            words: [
              { word: '이름이 뭐예요?', pronunciation: 'ireumi mwoyeyo?', meaning: 'What is your name?' },
              { word: '저는 학생이에요.', pronunciation: 'jeoneun haksaeng-ieyo', meaning: 'I am a student.' },
              // Add more conversation phrases in the future!
            ],
          },
        ],
      },
    ],
  };
  
  export default data;
  
