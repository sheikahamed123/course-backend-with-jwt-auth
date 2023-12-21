const { Router } = require("express");
const {adminMiddleware,validEmailPass} = require("../middleware/admin");
const router = Router();
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {Admin,Course}=require('../db');
const zod=require('zod');
const secretKey="SECRET"


// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const {username,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newAdmin=new Admin({username:username,password:hashedPassword})
    .save().then((admin)=>{
        res.status(200).json({
            msg:"admin created successful"
        })
    })

});

router.post('/signin',async (req, res) => {
    // Implement admin signup logic
    try{
        const {username,password}=req.body;
        const admin=await Admin.findOne({username});
        if(!admin || !bcrypt.compare(password,admin.password)){
            res.status(411).json({
                msg:"Not a valid admin"
            })
        }
        else{
            const token=jwt.sign({username},secretKey);
            res.status(200).json({token:token});
        }

    }
    catch(err){
        res.status(500).json({msg:"Error in signin"});

    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    // Implement course creation logic
    const { title, description, price, imageLink,published }=req.body;
    const newCourse =await Course.create({ title, description, price, imageLink,published });
    if(!newCourse){
        res.status(411).json({msg:"Error in  creating Course"});
    }else{
        res.status(200).json({msg:"Course created successful",_id:newCourse._id});
    }
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const courses=await Course.find();
    if(!courses){
        res.status(411).json({msg:"Error in  fetching Course"});
    }else{
        res.status(200).json({courses:[{courses}]});
    }
});

module.exports = router;