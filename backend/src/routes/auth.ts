import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
const authRouter = Router();

interface SignUpBody{
    name: string,
    email: string,
    password: string,
};

interface LoginBody{
    email: string,
    password: string,
};

authRouter.post("/signup",
    async (req: Request<{},{}, SignUpBody>, res: Response)=>{
    try {
        //get req body 
        const {name, email, password} = req.body;
        //check if user already exists
        const existingUser =  await db.select().from(users).where(eq(users.email, email));

        if(existingUser.length!=0){
             res.status(400).json({"message":"User already exists"})
             return
        }
        

        //create a new user and store it in db

        const hashedPassword = await bcryptjs.hash(password,8);

        const newUser : NewUser= {
            name, //shorthand for name: name
            email: email,
            password: hashedPassword,
        } 
        //destructured the list to get only a user
        //as it return the list of users.
        const [user] = await db.insert(users).values(newUser).returning();

        res.status(201).json(user);

        
    } catch (error) {
        res.status(500).json({error:error});
        
    }
})


authRouter.post("/login",
    async (req: Request<{},{}, LoginBody>, res: Response)=>{
    try {
        //get req body 
        const {email, password} = req.body;
        //check if user exists
        const [existingUser] =  await db.select().from(users).where(eq(users.email, email));

        if(!existingUser){
             res.status(400).json({"message":"User doesn't exists"})
             return
        }
        //compare the password
        const isMatch = await bcryptjs.compare(password,existingUser.password);

        if(!isMatch){
            res.status(401).json({"message":"Invalid creds"});
            return
        }
        const token = jwt.sign({id: existingUser.id},"passwordKey")
        res.status(200).json({token,...existingUser});        
    } catch (error) {
        res.status(500).json({error:error});
        
    }
})

authRouter.post('/isTokenValid',async(req,res)=>{
    try {
        //get the header

        const token = req.header('x-auth-token');
        if(!token){
             res.json(false);
             return
        }

        //verify if token is valid
        const verified = jwt.verify(token,"passwordKey");
        if(!verified){
             res.json(false);
             return
        }

        //get user data if token is valid

        const verifiedToken = verified as {id: string};

        const user = db.select().from(users).where(eq(users.id,verifiedToken.id));

        //if no user, return false  
        if(!user){
             res.json(false);
             return
        }

        res.json(true);
    } catch (error) {
        res.status(500).json(false);
        
    }
})


authRouter.get("/",(req,res)=>{
    res.send("hello from auht Router");
})

export default authRouter;