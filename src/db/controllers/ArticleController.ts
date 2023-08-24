import { ArticleModel } from "../models";
import dbConnect from "../db";

export const getArticles = async (limit: number) => {
  await dbConnect();
  return await ArticleModel.find().limit(limit);
}

export const getArticleById = async (id: any) => {
  await dbConnect();
  return await ArticleModel.findById(id);
}

export const getRandomArticle = async () => {
  await dbConnect();
  const count = await ArticleModel.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  return await ArticleModel.findOne().skip(randomIndex);
}

export const saveArticles = async (articles: any, shouldUpdate: boolean) => {
  await dbConnect();

  for (const article of articles) {
    const existingArticle = await ArticleModel.findOne({postId: article.postId});
    if (!existingArticle) {
      const newArticle = new ArticleModel(article);
      try {
        await newArticle.save();
        console.log(`Saved new article with _id: ${newArticle._id}`);
      } catch(err) {
        console.error(`Error saving article with postId: ${article.postId}`, err);
      }
    } else if (existingArticle && shouldUpdate) {
      console.log(`Found existing article post ${article.postId} and will update`);
      existingArticle.heading = article.heading;
      existingArticle.articleUrl = article.articleUrl;
      existingArticle.videoUrl = article.videoUrl;
      existingArticle.imageCaption = article.imageCaption;
      existingArticle.content = article.content;
      await existingArticle.save();
    } else {
      console.log(`Found existing article post ${article.postId}`);
    }
  }
}