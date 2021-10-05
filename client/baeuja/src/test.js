// let englishSentence;
// let resultEnglishWords = [];
// let englishResult = [];

// const currentSentence = {
//   koreanText: '낮에는 따사로운 인간적인 여자',
//   translatedText: 'A warm, humane woman during the day.',
//   words: [
//     {
//       wordId: 1,
//       sentenceId: 1,
//       prevKoreanText: '낮',
//       prevTranslatedText: 'day',
//       originalKoreanText: '낮',
//       originalTranslatedText: 'day',
//     },
//     {
//       wordId: 2,
//       sentenceId: 1,
//       prevKoreanText: '여자',
//       prevTranslatedText: 'woman',
//       originalKoreanText: '여자',
//       originalTranslatedText: 'woman',
//     },
//   ],
// };

// englishSentence = currentSentence.translatedText.toLowerCase();

// for (let i = 0; i < currentSentence.words.length; i++) {
//   resultEnglishWords.push(currentSentence.words[i].prevTranslatedText);
// }

// resultEnglishWords.forEach((word) => {
//   const idx = englishSentence.indexOf(word);
//   englishSentence =
//     englishSentence.slice(0, idx) +
//     `<Text>${word}</Text>` +
//     englishSentence.slice(idx + word.length);
// });
// englishSentence = englishSentence.split(`<Text>`);
// englishSentence = englishSentence.split(`</Text>`);

// console.log(englishSentence);

// // englishResult.push(englishSentence);

// // console.log(englishSentence);

// // let sentence = 'A warm, humane woman during the day day.';
// // ['day', 'woman'].forEach((word) => {
// //   const idx = sentence.indexOf(word);
// //   sentence = sentence.slice(0, idx) + `<Text>${word}<Text>` + sentence.slice(idx + word.length);
// // });
// // console.log(sentence);

console.log('.'.indexOf('woman'));
