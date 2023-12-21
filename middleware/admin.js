// Middleware for handling auth
const zod=require('zod');
const jwt=require('jsonwebtoken');
const secretKey="SECRET"
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const authHeader = req.headers.authorization;

    if (authHeader) {
     const token = authHeader;
   
     jwt.verify(token, secretKey, (err, user) => {
       if (err) {
      return res.status(401).json({ error: "err in token " });
       }
       req.user = user;
       next();
     });
   } else {
  res.status(411).json({msg:"You are not authorized to access this route"});
   }
}

function validEmailPass(req,res,next){
    const {username,password}=req.body;
    const userSchema=zod.string().min(6).max(25);
    const passwordSchema=zod.string().min(6,{message:"password must be atleast 6 characters long"})
    try{
        userSchema.safeParse(username);
        passwordSchema.safeParse(password);
        next();
    }
    catch(err){
        res.status(422).json({error:err.errors,msg:"Invalid email or password"});
    }
    }


    module.exports = {adminMiddleware,validEmailPass};