import axios from "axios";
import { load } from "cheerio";
import fs from 'fs';

export default async function handler(req: any, res: any) {
  res.send('Started BRC-NEWS Processor')
  const { data } = await axios.get('https://team-reptile.com/category/bomb-rush-cyberfunk/');
  const $ = load(data);
  const txtFileName = "news.txt";
  const jsonFileName = "news.json";
  const jsonFileContents = [];
  
  // Loop through article

  const articles = $('.post')
  console.log(`Processing ${articles.length} news articles...`);


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

    const data = {
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
    }
    jsonFileContents.push(data);
    
    // Prepare TXT file
    await fs.promises.writeFile(txtFileName, '');
    await fs.promises.appendFile(txtFileName, `Post Id: ${postId}\n`);
    await fs.promises.appendFile(txtFileName, `Heading: ${heading}\n`);
    await fs.promises.appendFile(txtFileName, `URL: ${articleUrl}\n`);
    await fs.promises.appendFile(txtFileName, `Publish Date: ${datePublished}\n`);
    await fs.promises.appendFile(txtFileName, `Publish Time: ${timePublished}\n`);
    await fs.promises.appendFile(txtFileName, `Author: ${author}\n`);
    await fs.promises.appendFile(txtFileName, `Image Url: ${imgUrl}\n`);
    await fs.promises.appendFile(txtFileName, `Image Caption: ${imgCaption}\n`);
    await fs.promises.appendFile(txtFileName, `Youtube Video Url: ${youtubeVideoUrl}\n`);
    await fs.promises.appendFile(txtFileName, `Content: ${pgs}\n\n`);

  }

    const jsonData = JSON.stringify(jsonFileContents, null, 2); // Optional: pretty print with 2 spaces

    // Write the JSON array to the file asynchronously
    await fs.promises.writeFile(jsonFileName, jsonData + '\n');

}