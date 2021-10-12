const { words } = {
  words: [
    {
      wordId: 0,
      sentenceId: 0,
      prevKoreanText: 'string',
      prevTranslatedText: 'string',
      originalKoreanText: 'string',
      originalTranslatedText: 'string',
      perfectVoiceUri: 'asdfasdf',
      importance: 'string',
      isBookmark: true,
      relatedSentences: [
        {
          sentenceId: 0,
          unitIndex: 0,
          contentId: 0,
          koreanText: 'ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ',
          translatedText: 'asdfasdfasdf',
        },
      ],
    },
  ],
};

console.log(words[0].relatedSentences[0].koreanText);
