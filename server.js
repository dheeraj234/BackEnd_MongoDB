const express= require('express');
const app= express();
const multer= require('multer');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const routeurls= require('./routes/routes')
const cors = require('cors')
const imageModel=require('./models/imageUpload')
const fs= require('fs');
const path = require('path')
// const axios= require('axios');
const SignUpModel= require('./models/signUpModels')
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
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload=multer({storage:storage});

app.get("/",async(req,res)=>{
    console.log('hit');
    const allData= await  imageModel.find()
    res.json(allData)
})

app.post('/',upload.single('testImage'),(req,res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    var final_img = {
        username:req.body.username,
        name:req.body.name,
        contentType:req.file.mimetype,
        image:new Buffer.from(encode_img,'base64')
    };
    imageModel.create(final_img,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log(result.img.Buffer);
            console.log("Saved To database");
            console.log(final_img.contentType);
            console.log(final_img.image)
            res.contentType(final_img.contentType);
            res.send(final_img.image);
        }
    })
    // const saveImage= new imageModel({
    //     name:req.body.name,
    //     image:{
    //         data:fs.readFileSync("uploads/"+req.file.filename),
    //         contentType:"image/jpeg"
    //     }
    // })
    // saveImage.save()
    // .then((res)=>console.log(res))
    // .catch((err)=>{console.log(err,"err has occur")})

    // res.send("image is saveed")
})

app.get('/image' , (req,res)=>{

    console.log("Image Conteolelr")
    let file = './uploads/testImage-1661486883078';

    res.sendFile(file)

})

app.post('/login',async(req,res)=>{
    console.log("Login COntroller",req.body)
    try{ 
       const email=req.body.credentials.username;
        const password=req.body.credentials.password;

        const useremail= await SignUpModel.findOne({email:email});
        console.log(useremail);
        if(useremail.password===password){
            res.status(200).json({
                msg:"AUTH SUCESS",
                fullname:useremail.fullName,
                username:useremail.username
        })
        }
         
        // res.send(useremail);
    }
    catch(error){
        console.log(error);
    }
})

app.listen(3001,()=>{
    "port no 3001"
});
