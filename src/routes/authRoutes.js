// Handling Authentication Functionalities
import express, { json } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()


router.post('/register',(req,res)=>{
        const {username, password} = req.body



        //encrypt the password
        const hashedPassword = bcrypt.hashSync(password, 8)
        console.log(hashedPassword);

        try{
            const insertUser = db.prepare(`INSERT INTO users (username, password)VALUES (?, ?)`)
            const result = insertUser.run(username, hashedPassword)


            //now that we have a suer i want to add their first todo for them
            const defaultTodo = `Hello, Add your first todo!`
            const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)VALUES(?, ?)`)
            insertTodo.run(result.lastInsertRowid, defaultTodo)

            //create a token
            const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
            res.json({token})
        } catch (err){
            console.log(err.message)
            res.sendStatus(503)
        }


        // res.sendStatus(201) -> we can run only one
        
})

router.post('/login',(req,res)=>{
    //we get the usr email, and we look up the password associated with that email in the database, but we get it back and see it's encrypted which means that we cannot compare it to the one the user jsut used trying to login
    //so what we can to do, is again , one way encrypt the password the user just entered


})


export default router
