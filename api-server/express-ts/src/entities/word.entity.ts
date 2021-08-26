export interface Word {
  wordId?: number;
  sentenceId?: number;
  prevKoreanText?: string;
  prevTranslatedText?: string;
  originalKoreanText?: string;
  originalTranslatedText?: string;
  perfectVoiceUri?: string;
  importance?: string;
  createdAt?: string;
  modifiedAt?: string;
}
