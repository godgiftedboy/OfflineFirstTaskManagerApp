import express from "express";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";

const app = express();

app.use(express.json());
app.use("/auth",authRouter);
app.use("/tasks",taskRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to my app!!");
    //added exclamation to see the changes reflected
})

app.listen(8000,()=>{
    console.log("server stated at port 8000")
})