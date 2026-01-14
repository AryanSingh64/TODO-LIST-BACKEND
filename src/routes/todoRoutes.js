import express from 'express'
import db from '../db.js'


const router = express.Router()

//Get all todos for logged-in-user
router.get('/',(req,res)=>{

})

//Create a new todo
router.post('/',(req,res)=>{

})

//update a todo -- we check id in db before change
router.put('/:id',(req,res)=>{

})


//DELETE
router.delete('/:id',(req,res)=>{

})

export default router