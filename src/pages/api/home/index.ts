export default async function handler(req: any, res: any) {
  res.send(process?.env?.BASE_URL);
}


