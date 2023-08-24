import { getArticleById, getRandomArticle } from "@/db/controllers/ArticleController";
const ObjectId = require('mongoose').Types.ObjectId;

export default async function handler(req: any, res: any) {
  const id = req?.query?.id;
  if (req?.query?.id?.toLowerCase() === 'random') return res.send(await getRandomArticle());
  if (!ObjectId.isValid(id)) { return res.send(`Invalid ObjectID`) };
  const article = await getArticleById(id);
  if (!article) return res.status(404).send('Article Not Found');
  return res.send(article);
}