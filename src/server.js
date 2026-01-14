import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'



const app = express()
// IF THERE IS ENV PORT IN ENV THEN USE THAT ELSE 5000
const PORT = process.env.PORT || 5000

//Get the File Path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//Get the dir name from the file path
const __dirname = dirname(__filename)

//MIDDLEWARE
app.use(express.json()) //to parse json data from req body
//Seves the HTML file from the /public dir
//Tells expresss to serve all files from the public folder as static assets / file. any req for the css files will be resolved to the public dir.


app.use(express.static(path.join(__dirname, '../public')))

//Serving up the HTML File from the /public dir
app.get('/',(req,res)=>{
    //goto dirname, append public, append index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})



//Routes
 app.use('/auth',authRoutes)
 app.use('/todos',todoRoutes)



app.listen(PORT,()=>{
    console.log(`server has started on port: ${PORT}`);
    
})