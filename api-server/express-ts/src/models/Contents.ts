export class Contents {
  contentsId: number;
  classification: string | undefined;
  title: string | undefined;
  artist: string | undefined;
  director: string | undefined;
  description: string | undefined;
  thumbnailUri: string | undefined;
  createdAt: string | undefined;
  modifiedAt: string | undefined;
  constructor(
    contents_id: number,
    classification?: string,
    title?: string,
    artist?: string,
    director?: string,
    description?: string,
    thumbnail_uri?: string,
    created_at?: string,
    modified_at?: string
  ) {
    this.contentsId = contents_id;
    this.classification = classification;
    this.title = title;
    this.artist = artist;
    this.director = director;
    this.description = description;
    this.thumbnailUri = thumbnail_uri;
    this.createdAt = created_at;
    this.modifiedAt = modified_at;
  }
}
