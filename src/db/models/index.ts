import { getModelForClass } from "@typegoose/typegoose";
import { Article } from "./Article";

export const ArticleModel = getModelForClass(Article);