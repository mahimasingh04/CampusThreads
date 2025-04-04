import express, { Request, Response } from 'express';

import userRouter from "./routes/user";
import communityRouter from "./routes/community";
import postRouter from './routes/post';
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/community", communityRouter);
app.use("/api/post", postRouter);
app.use("/api/:communityId", postRouter);

const port = process.env.PORT || 3000;

console.log("databse:" , process.env.DATABASE_URL)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});