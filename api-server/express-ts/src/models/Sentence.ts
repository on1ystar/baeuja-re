export class Sentence {
  sentence_id: number;
  learning_unit_id: number | undefined;
  contents_id: number | undefined;
  korean_text: string | undefined;
  translated_text: string | undefined;
  perfect_voice_uri: string | undefined;
  is_conversation: string | undefined;
  is_famous_line: string | undefined;
  start_time: string | undefined;
  end_time: string | undefined;
  created_at: string | undefined;
  modified_at: string | undefined;
  constructor(
    sentence_id: number,
    learning_unit_id?: number,
    contents_id?: number,
    korean_text?: string,
    translated_text?: string,
    perfect_voice_uri?: string,
    is_conversation?: string,
    is_famous_line?: string,
    start_time?: string,
    end_time?: string,
    created_at?: string,
    modified_at?: string
  ) {
    this.sentence_id = sentence_id;
    this.learning_unit_id = learning_unit_id;
    this.contents_id = contents_id;
    this.korean_text = korean_text;
    this.translated_text = translated_text;
    this.perfect_voice_uri = perfect_voice_uri;
    this.is_conversation = is_conversation;
    this.is_famous_line = is_famous_line;
    this.start_time = start_time;
    this.end_time = end_time;
    this.created_at = created_at;
    this.modified_at = modified_at;
  }
}
