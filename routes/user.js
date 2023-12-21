const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {validEmailPass} = require("../middleware/admin");
const {User,Course}=require('../db');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const secretKey="SECRET"
const mongoose = require('mongoose'); 
// User Routes
router.post('/signup', async(req, res) => {
    // Implement user signup logic
    const {username,password}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser= await User.create(({username,password:hashedPassword}));
        if(!newUser){
            res.status(500).send("Error signing up User");
        }else{
            res.status(200).send("User  created successfully");
        }
});

router.post('/signin', async(req, res) => {
    // Implement admin signup logic
    const{username,password}=req.body;
    const findUser= await User.findOne({username});
    if(!findUser || !( bcrypt.compare(password, findUser.password))){
        res.status(411).json({msg:"user doesnot exists in.Please signup"});
    }else{
        const myToken=jwt.sign({username},secretKey);
        res.status(200).json({token:myToken});
}
});

router.get('/courses', async(req, res) => {
    // Implement listing all courses logic
    const courses=await Course.find({});
    if(!courses){
        res.status(500).send("Error finding courses");
    }else{
    res.status(200).json({course:[courses]});
    }
});
router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    try {
        // Implement course purchase logic
        const courseId = req.params.courseId;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).send("Invalid courseId format");
        }

        const course = await Course.findOne({ _id:new mongoose.Types.ObjectId(courseId) });

        if (!course) {
            return res.status(500).send("Error finding course");
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.user.username },
            {
                $push: {
                    purchasedCourses:new mongoose.Types.ObjectId(course._id.toString())
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).send("Error updating user");
        }

        res.status(200).send("Course purchased successfully");
    } catch (error) {
        console.error("Error in /courses/:courseId route:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic

    const token=req.headers.authorization;
    if(token){
        const decoded=jwt.decode(token)
        const user=await User.findOne({username:decoded.username}).populate("purchasedCourses");
        res.status(200).json({purchasedCourses:user.purchasedCourses});
    }
    else{
        res.status(500).send("Error finding purchased courses");
    }
   
});

module.exports = router;