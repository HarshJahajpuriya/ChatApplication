module.exports.authenticate = (req, res, next)=>{
    if(req.session.user){
        next();
    }else {
        res.status(403).json({message: "Unauthorized access! Please Login..."})
    }
}