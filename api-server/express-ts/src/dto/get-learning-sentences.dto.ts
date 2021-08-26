// class
export interface GetLearningSentencesDTO {
  sentenceId: number;
  unitId: number;
  contentId: number;
  koreanText: string;
  translatedText: string;
  perfectVoiceUri: string;
  isConversation: string;
  isFamousLine: string;
  startTime: string;
  endTime: string;
}

// {
//     success: boolean;
//     unit: {
//         unitId: number;
//         contentsId: number;
//         youtubeUrl: string;
//         startTime: string;
//         endTime: string;
//     }
//     sentences: [
//         {
//             sentenceId: number;
//             koreanText: string;
//             translatedText: string;
//             perfectVoiceUri: string;
//             startTime: string;
//             endTime: string;
//             isBookmark: boolean;
//             words: [
//                 {
//                     wordId: number;
//                     prevKoreanText: string;
//                     prevTranslatedText: string;
//                     originalKoreanText: string;
//                     originalTranslatedText: string;
//                     isBookmark: boolean;
//                 }
//             ]
//         }
//     ]
// }
