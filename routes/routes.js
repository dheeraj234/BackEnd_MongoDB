const express= require('express');
const router= express.Router()
const SignUpModel= require('../models/signUpModels')

router.post('/signup', async (request,response)=>{
    // const signedUpUser= new signUpTemplateCopy({
    //     fullName:request.body.fullName,
    //     username:request.body.username,
    //     email:request.body.email,
    //     password:request.body.password
    // })
    const userData= await SignUpModel.findOne({email:request.body.email});
    console.log("awer",userData,request.body);
if(!userData.email){
    signedUpUser.save()
    .then(data=>{console.log(data); response.json(data)})
    .catch(err=>{response.json(err)})
}
else{
    response.status(401).send('user already exists')
}
})

module.exports= router