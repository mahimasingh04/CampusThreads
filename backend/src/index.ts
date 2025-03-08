import express, { Request, Response } from 'express';

import userRouter from "./routes/user";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

app.use("/api/user", userRouter);


const port = process.env.PORT || 3000;




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});