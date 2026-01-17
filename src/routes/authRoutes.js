// Handling Authentication Functionalities
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import db from '../db.js'
import prisma from '../prismaClient.js'


const router = express.Router()


router.post('/register',async (req,res)=>{
        const {username, password} = req.body
    // save the username and an irreversibly encrypted password
    // save gilgamesh@gmail.com | aklsdjfasdf.asdf..qwe..q.we...qwe.qw.easd


        //encrypt the password
        const hashedPassword = bcrypt.hashSync(password, 8)
        console.log(hashedPassword);

        try{
            // const insertUser = db.prepare(`INSERT INTO users (username, password)VALUES (?, ?)`)
            // const result = insertUser.run(username, hashedPassword)
            const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })



            //now that we have a suer i want to add their first todo for them
            const defaultTodo = `Hello, Add your first todo!`
            // const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)VALUES(?, ?)`)
            // insertTodo.run(result.lastInsertRowid, defaultTodo)
            await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

            //create a token
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
            res.status(201).json({token})
        } catch (err){
            console.log(err.message)
            res.sendStatus(503)
        }


        // res.sendStatus(201) -> we can run only one
        
})

router.post('/login',async (req,res)=>{
    //we get the usr email, and we look up the password associated with that email in the database, but we get it back and see it's encrypted which means that we cannot compare it to the one the user jsut used trying to login
    //so what we can to do, is again , one way encrypt the password the user just entered


    const {username, password} = req.body

    try{
        // const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        // const user = getUser.get(username)
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(!user) {return res.status(404).send({message: "User Not Found!!!"})}


    //chk pass is valid
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if(!passwordIsValid) {
            return res.status(401).send({message:"Invalid Password BITCH"})
        }
        console.log(user);
        
        //then we have a succesful auth

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET,{expiresIn: '24h'})
        res.json({token})
    }catch(err){
        console.log(err.message);
        res.sendStatus(503)
        
    }

})


export default router
