import express from "express";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/auth",authRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to my app!!");
    //added exclamation to see the changes reflected
})

app.listen(8000,()=>{
    console.log("server stated at port 8000")
})