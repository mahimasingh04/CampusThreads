import express, { Request, Response } from 'express';
import { createServer } from 'http';
import userRouter from "./routes/user";
import communityRouter from "./routes/community";
import postRouter from './routes/post';
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/community", communityRouter);
app.use("/api/post", postRouter);
app.use("/api/:communityId", postRouter);

const port = process.env.PORT || 3000;

console.log("database:", process.env.DATABASE_URL);



// Initialize WebSocket


// Make wsServer available globally


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});