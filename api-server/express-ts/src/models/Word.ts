export class Word {
  wordId: number;
  sentenceId: number | undefined;
  originalKoreanText: string | undefined;
  originalTranslatedText: string | undefined;
  koreanText: string | undefined;
  translatedText: string | undefined;
  perfectVoiceUri: string | undefined;
  importance: string | undefined;
  createdAt: string | undefined;
  modifiedAt: string | undefined;
  constructor(
    word_id: number,
    sentence_id?: number,
    original_korean_text?: string,
    original_translated_text?: string,
    korean_text?: string,
    translated_text?: string,
    perfect_voice_uri?: string,
    importance?: string,
    created_at?: string,
    modified_at?: string
  ) {
    this.wordId = word_id;
    this.sentenceId = sentence_id;
    this.originalKoreanText = original_korean_text;
    this.originalTranslatedText = original_translated_text;
    this.koreanText = korean_text;
    this.translatedText = translated_text;
    this.perfectVoiceUri = perfect_voice_uri;
    this.importance = importance;
    this.createdAt = created_at;
    this.modifiedAt = modified_at;
  }
}
