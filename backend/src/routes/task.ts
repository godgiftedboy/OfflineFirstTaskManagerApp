import { eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db";
import { NewTask, tasks } from "../db/schema";
import { auth, AuthRequest } from "../middleware/auth";

const taskRouter = Router();

taskRouter.post('/',auth, async(req: AuthRequest,res)=>{
    try {
        //create a new task
        req.body = { ...req.body,dueAt: new Date(req.body.dueAt), uid: req.user };
        const newTask: NewTask = req.body;

        const [task] = await db.insert(tasks).values(newTask).returning();

        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
        
    }

})


taskRouter.get('/',auth, async(req: AuthRequest,res)=>{
    try {
        const allTasks = await db.select().from(tasks).where(eq(tasks.uid,req.user!));

        res.status(200).json(allTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});  
    }
})

taskRouter.delete('/',auth, async(req: AuthRequest,res)=>{
    try {
        const {taskId}:{taskId: string} = req.body;

        await db.delete(tasks).where(eq(tasks.id,taskId));

        res.status(200).json(true);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});  
    }
})

taskRouter.post("/sync", auth, async (req: AuthRequest, res) => {
    try {
      // req.body = { ...req.body, dueAt: new Date(req.body.dueAt), uid: req.user };
      const tasksList = req.body;
  
      const filteredTasks: NewTask[] = [];
  
      for (let t of tasksList) {
        t = {
          ...t,
          dueAt: new Date(t.dueAt),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          uid: req.user,
        };
        filteredTasks.push(t);
      }
  
      const pushedTasks = await db
        .insert(tasks)
        .values(filteredTasks)
        .returning();
    //fileredTasks is list but we were passing object before on insert values.
    //drizzle with automatically recognize the list/object whenever passed.

    
  
      res.status(201).json(pushedTasks);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  });


export default taskRouter;