import axios from "axios";
import { load } from "cheerio";
import fs from 'fs';
import { saveArticles } from "@/db/controllers/ArticleController";

/**
 * Scrapes the Team Reptile website for Bomb Rush Cyberfunk News Articles
 * NOTE: is liable to break if website structure changes
 * 
 */
export default async function handler(req: any, res: any) {
  res.send('Started BRC-NEWS Processor')
  const { data } = await axios.get('https://team-reptile.com/category/bomb-rush-cyberfunk/');
  const $ = load(data);
  const jsonFileName = `brcapi-news-${new Date().toISOString()}.json` // TODO: upload file to drive to store as BackUps
  const jsonFileContents = [];
  const shouldUpdate = req && req.query && req.query.update === 'true';

  // Scrape Article Data
  const articles = $('.post');
  console.log(`Processing ${articles.length} news articles... Updating: ${shouldUpdate}`);
  for (const child of articles) {
    const postId = $(child).attr('id')?.replace('post-', '').trim();
    const heading = $(child).find('header > h1 > a').text().trim()
    const articleUrl = $(child).find('header > h1 > a').attr('href')?.trim();
    const datePublished = $(child).find('header > div.entry-meta > a > time.entry-date').text().trim();
    const timePublished = $(child).find('header > div.entry-meta > a').attr('title')?.trim();
    const author = $(child).find('header > div.entry-meta > span.by-author > span.author > a.url').text().trim();
    const imgUrl = $(child).find('div.entry-content > figure.wp-block-image > a').attr('href')?.trim();
    const imgCaption = $(child).find('div.entry-content > figure.wp-block-image > figcaption').text().trim();
    const youtubeVideoUrl = $(child).find('div.entry-content > figure.wp-block-embed > div > span > iframe').attr('src')?.trim();
    const paragraphs = $(child).find('div.entry-content > p')
    const normalizedParagraphs = paragraphs.map((index, paragraph) =>
      $(paragraph).text().replace(/<br\s*\/?>/g, '\n')
    ).get();
    const pgs: string[] = [];
    normalizedParagraphs.forEach(p => p !== "" && pgs.push(p.trim()));

    // Save data into Prepared Object
    jsonFileContents.push({
      postId: postId,
      heading: heading,
      articleUrl: articleUrl,
      publishDate: datePublished,
      publishTime: timePublished,
      author: author,
      imageUrl: imgUrl,
      imageCaption: imgCaption,
      videoUrl: youtubeVideoUrl,
      content: pgs
    });
  }

    // Save to Mongo
    await saveArticles(jsonFileContents, shouldUpdate);
    console.log(`Finished processing articles.`);

    // Save to file and upload as a BackUp.
    await fs.promises.writeFile(jsonFileName, JSON.stringify(jsonFileContents, null, 2) + '\n');
    //TODO: Call to media-library goes here
    //console.log(`Finished Uploading Backup.`);
    //TODO: Delete the file locally
    //Handle any file deletion errors

}