import { UUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";

export interface AuthRequest extends Request{
    user?: UUID;
    token? : string;


}

export const auth = async(req: AuthRequest,res: Response,next: NextFunction)=>{
    try {
            //get the header
    
            const token = req.header('x-auth-token');
            if(!token){
                 res.status(401).json({message: "UnAuthorized Access"});
                 return
            }
    
            //verify if token is valid
            const verified = jwt.verify(token,"passwordKey");
            if(!verified){
                res.status(401).json({message: "Token verification failed"});
                 return
            }
    
            //get user data if token is valid
    
            const verifiedToken = verified as {id: UUID};
    
            const user = db.select().from(users).where(eq(users.id,verifiedToken.id));
    
            //if no user, return false  
            if(!user){
                res.status(401).json({message: "User Not Found"});
                 return
            }

            req.user = verifiedToken.id;
            req.token = token;
    
            next();
        } catch (error) {
            res.status(500).json(false);
            
        }

}