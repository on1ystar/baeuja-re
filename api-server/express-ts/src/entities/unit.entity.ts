export class Unit {
  constructor(
    readonly unit_index?: number,
    readonly content_id?: number,
    readonly youtube_url?: string,
    readonly start_time?: string,
    readonly end_time?: string,
    readonly thumbnail_uri?: string,
    readonly created_at?: string,
    readonly modified_at?: string
  ) {}
}
