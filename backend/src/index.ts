import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { setupWebSocket } from './utils/ws';
import userRouter from "./routes/user";
import communityRouter from "./routes/community";
import postRouter from './routes/post';
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import tagRouter from './routes/tag';
import collaborateRouter from './routes/collaboration';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = createServer(app);

// CORS configuration
app.use(cors({
  origin:  'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(204).send();
});

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/community", communityRouter);
app.use("/api/tags", tagRouter);
app.use("/api/posts", postRouter);

const port = process.env.PORT || 3000;

console.log("database:", process.env.DATABASE_URL);



// Initialize WebSocket
setupWebSocket(server);
app.use("/api/collaborate", collaborateRouter)

// Make wsServer available globally


server.listen(port, () => {
  console.log(`Server and websocket is running on http://localhost:${port}`);
  console.log(`CORS configured for origin: http://localhost:5173`);
});