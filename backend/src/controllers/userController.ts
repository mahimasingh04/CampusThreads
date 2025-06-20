import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient

const prisma = new PrismaClient(); 



export const registerController = async(req : Request, res: Response): Promise<void> => {


    try{
      
      const { email, name, password } = req.body;
       const user = await prisma.user.findUnique({
        where: { email },
    });
    if(user) {
         res.status(400).json({ message: "User already exists" });
         return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
             data : {
                email ,
                name ,
                password : hashedPassword
             }
        })
         res.status(201).json({
          success: true,
          message: "User created successfully",
          user: newUser,
      });
        
  }catch(error) {
     res.status(500).json({
        success: false,
        message: error,
      });
    }

}

export const signinController = async(req : Request, res: Response) : Promise<void> => {
    try {
       const {email,  password} = req.body

       const userExists = await prisma.user.findUnique ({
        where : {email} 
       })
      if(!userExists) {
          res.status(200).json({
           
            success : false,
            message : "User doesnt exists , please Signup "
        }
        )
        return;
      }

      const checkPassword = await bcrypt.compare(password, userExists?.password || "" );
      if(!checkPassword) {
         res.status(401).json({
            success : false,
            message : "Incorrect Credentials "
        })
        return;
      }

      const token = generateToken(userExists?.id || "")
      const userData = {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email
      };
       res
      .status(200)
      .cookie("tokenInfo", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "user logged in successfully",
        token,
        user : userData
      });
    }catch(error) {
          console.error(error);
         res.status(500).json({
            success: false,
            message: error,
          });
        
    }
    
}


export  const logoutController =  async(req : Request, res:  Response) => {
    try {
      return res.status(200).cookie("tokenInfo", "").json({
        success: true,
        message: "logout successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "logout failed",
      });
    }
  }


export const profileSetup = async(req: Request,res: Response) : Promise<void> => {
   try {
    const userId = req.userId
    const {name , college ,bio , location, Github , linkedIn, Portfolio, Twitter}= req.body
    if(!userId) {
      res.status(411).json({message :"you are not authenticated"})
      return;
    }

    const profile = await prisma.user.update({
      where : {
        id : userId
      },
      data: {
        name ,
        college,
        bio,
        location, 
        Github,
        linkedIn ,
        Portfolio  ,
        Twitter,
      }
    })

    res.status(200).json({
      message: "user profile completed",
      data: profile
    })
  
   }catch(Error) {
     res.status(500).json({ 
            status: "error",
            message: 'Internal server error ' 
        });
   }
}

