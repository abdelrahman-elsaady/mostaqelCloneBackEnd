
const jwt=require('jsonwebtoken')

const util=require('util')

async function author(req, res, next){
    let {authorization}=req.headers

    if(!authorization){

        res.status(401).json({message: 'Unauthorized'})

        return 
    
    }
    try{

        let decoded=await util.promisify(jwt.verify)(authorization,process.env.SECRET)
         console.log(decoded);
        
        req.id=decoded.id
        req.role=decoded.role
        next()
    }

    catch(err){
        res.status(401).json({message: 'Invalid token'})
    }
    

 }

  function restrictTo(...role){

    return function (req, res, next){
         console.log(req.role);
        if(!role.includes(req.role) ){
           res.status(403).json({message: 'you do not have permission'})
            return
        }
        
        next()
        
 }
 }



    module.exports={author,restrictTo};