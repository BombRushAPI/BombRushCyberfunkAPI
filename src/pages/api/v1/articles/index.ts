import { getArticles } from "@/db/controllers/ArticleController";

export default async function handler(req: any, res: any) {
  res.send(await getArticles(req?.query?.limit));
}