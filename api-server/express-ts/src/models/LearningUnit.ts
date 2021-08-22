export class LearningUnit {
  learningUnitId: number;
  contentsId: number;
  youtubeUrl: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  thumbnailUri: string | undefined;
  createdAt: string | undefined;
  modifiedAt: string | undefined;
  constructor(
    learning_unit_id: number,
    contents_id: number,
    youtube_url?: string,
    start_time?: string,
    end_time?: string,
    thumbnail_uri?: string,
    created_at?: string,
    modified_at?: string
  ) {
    this.learningUnitId = learning_unit_id;
    this.contentsId = contents_id;
    this.youtubeUrl = youtube_url;
    this.startTime = start_time;
    this.endTime = end_time;
    this.thumbnailUri = thumbnail_uri;
    this.createdAt = created_at;
    this.modifiedAt = modified_at;
  }
}
