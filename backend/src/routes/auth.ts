import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response, Router } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";

const authRouter = Router();

interface SignUpBody{
    name: string,
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

        if(!existingUser.length){
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


authRouter.get("/",(req,res)=>{
    res.send("hello from auht Router");
})

export default authRouter;