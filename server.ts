// server.ts
import express, { Request, Response } from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define a custom route with TypeScript types for req and res
  server.get('/hello', (req: Request, res: Response) => {
    res.send('Hello from custom Express server with TypeScript!');
  });

  // Handle all other routes with Next.js
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(3000, (err?: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
