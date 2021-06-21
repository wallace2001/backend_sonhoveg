require("dotenv").config();
import express from 'express';
import { router } from './router';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

app.use(express.json());
app.use(cors());

const server = createServer(app);
const io = new Server(server);

app.use( async(req: any, res, next) => {
  req.io = io;
  return next();
});

app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")));
app.use(router);

export { io, server, app }