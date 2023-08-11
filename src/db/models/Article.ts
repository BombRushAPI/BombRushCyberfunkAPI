import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({schemaOptions: {collection: "Article", versionKey: false, timestamps: true}})
export class Article {

  @prop()
  postId: string;

  @prop()
  heading: string;

  @prop()
  articleUrl: string;

  @prop()
  publishDate: string;

  @prop()
  publishTime: string;

  @prop()
  imageUrl: string;

  @prop()
  imageCaption: string;

  @prop()
  videoUrl: string;

  @prop({ default: [] })
  content: string[];

}