import express from 'express'
// import db from '../db.js'
import prisma from '../prismaClient.js'


const router = express.Router()

//Get all todos for logged-in-user
router.get('/',async (req,res)=>{
    // const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    // const todos = getTodos.all(req.userId)
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })

    res.json(todos)
})

//Create a new todo
router.post('/',async (req,res)=>{
      const {task} = req.body
    //   const insertTodos = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    //   const result = insertTodos.run(req.userId, task)
        const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)
    //   res.json({id: result.lastInsertRowid, task , completed: 0})
})

//update a todo -- we check id in db before change
router.put('/:id',async (req,res)=>{
    const { completed } = req.body
    const { id } = req.params
    // const { page } = req.query

    // const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')

    // updateTodo.run(completed,id)
    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })
    res.json(updatedTodo)
    // res.json({message: "Todo Completed"})
})


//DELETE
router.delete('/:id',async (req,res)=>{
    const {id} = req.params
    const userId = req.userId
    // const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    // deleteTodo.run(id,userId)
        await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })
    res.send({message:"Todo DELETED"})
})

export default router