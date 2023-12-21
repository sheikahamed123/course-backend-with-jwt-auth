
const jwt = require("jsonwebtoken");
const secretKey="SECRET"
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const userAuth=req.headers.authorization;
    if(userAuth){
        const token=userAuth
        jwt.verify(token,secretKey,(err,user)=>{
          if(err){
            res.status(401).json({
                error:"Error in token"
            })
          }
          else{
            req.user=user;
            next();
          }
        })
    }
    else{
        res.status(411).json({
            msg:"You are not authorized to access this route"
        })
    }
}

module.exports = userMiddleware;