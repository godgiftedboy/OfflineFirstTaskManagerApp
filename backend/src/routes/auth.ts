import { Router } from "express";

const authRouter = Router();

authRouter.get("/",(req,res)=>{
    res.send("hello from auht Router");
})

export default authRouter;