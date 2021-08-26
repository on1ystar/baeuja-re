export interface Sentence {
  sentenceId?: number;
  learning_unit_index?: number;
  contentsId?: number;
  koreanText?: string;
  translatedText?: string;
  perfectVoiceUri?: string;
  isConversation?: boolean;
  isFamousLine?: boolean;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  modifiedAt?: string;
}
