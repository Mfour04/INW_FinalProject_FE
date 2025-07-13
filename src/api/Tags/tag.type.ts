export interface Tag {
  tagId: string;
  name: string;
};

export type TagName = Omit<Tag, 'tagId'>

export type Tags = {
    success: boolean,
    message: string,
    data: Tag[]
}