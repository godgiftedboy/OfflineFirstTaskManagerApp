import { Router } from "express";
import { db } from "../db";
import { NewTask, tasks } from "../db/schema";
import { auth, AuthRequest } from "../middleware/auth";

const taskRouter = Router();

taskRouter.post('/',auth, async(req: AuthRequest,res)=>{
    try {
        //create a new task
        req.body = { ...req.body, uid: req.user };
        const newTask: NewTask = req.body;

        const [task] = await db.insert(tasks).values(newTask).returning();

        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
        
    }

})

export default taskRouter;