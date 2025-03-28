import express from "express";

const app = express();

app.get("/",(req,res)=>{
    res.send("Welcome to my app!!");
    //added exclamation to see the changes reflected
})

app.listen(8000,()=>{
    console.log("server stated at port 8000")
})