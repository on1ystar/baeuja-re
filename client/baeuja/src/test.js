const exampleSentences = {
  sentences: [
    {
      sentenceId: 1,
      contentId: 1,
      unitIndex: 1,
      koreanText: '낮에는 따사로운 인간적인 여자',
      translatedText: 'A warm, humane woman during the day.',
      koreanInText: '낮',
      translationInText: 'day',
    },
    {
      sentenceId: 6,
      contentId: 1,
      unitIndex: 2,
      koreanText: '낮에는 너만큼 따사로운 그런 사나이',
      translatedText: 'Such a guy as warm as you are during the day.',
      koreanInText: '낮',
      translationInText: 'day',
    },
  ],
};

exampleSentences.sentences.map((sentence) => {
  sentence.koreanInText;
});
