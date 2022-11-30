import jwt from 'jsonwebtoken';
import config from './config.js';

export const generateToken =(user)=>{
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        },
        config.JWT_SECRET
    );
};

export const isAuth =(req,res,next)=>{
    const bearerToken = req.headers.authorization;    
    if(!bearerToken){                                           // Verifica si hay token  
        res.status(401).send({message:'Token is not supplied'});
    }else{                                                      
        const token  = bearerToken.slice(7, bearerToken.length);// Obtiene el Token del bearerToken
        jwt.verify(token, config.JWT_SECRET, (err,data)=>{      // Compara Token con  la palabra secreta. 
            if(err){
                res.status(401).send({message: 'Invalid Token'})
            }else{
                req.user = data                                 // data es el jwt codificado
                next()  // El handler es correcto sigue con el proceso
            }
        })
    }

}

export const isAdmin =(req,res, next)=>{
    if(req.user && req.user.isAdmin){
        next();
}else{
    res.status(401).send({message: 'Token is no valid for admin user'})
}
}