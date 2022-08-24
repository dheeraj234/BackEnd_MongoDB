const express= require('express');
const app= express();
const multer= require('multer');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const routeurls= require('./routes/routes')
const cors = require('cors')
const imageModel=require('./models/imageUpload')
const fs= require('fs');
dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS,()=>{console.log("database connected");})
app.use(express.json());
app.use(cors())
app.use('/app',routeurls);
const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage});

app.get("/",async(req,res)=>{
    const allData= await  imageModel.find()
    res.json(allData)
})

app.post('/',upload.single('testImage'),(req,res)=>{
    const saveImage= new imageModel({
        name:req.body.name,
        image:{
            data:fs.readFileSync("uploads/"+req.file.filename),
            contentType:"image/png"
        }
    })
    saveImage.save()
    .then((res)=>console.log('image is saved'))
    .catch((err)=>{console.log(err,"err has occur")})

    res.send("image is saveed")
})

app.listen(3001,()=>{
    "port no 3001"
});
