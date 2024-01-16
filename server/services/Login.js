const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;
const JWT_SIGN_SECRET_ADMIN = process.env.JWT_SIGN_SECRET_ADMIN;




function checkIsLogin (token , isAdmin=false){
    if(isAdmin){
        if(jwt.verify(token, JWT_SIGN_SECRET_ADMIN)){
            return jwt.verify(token, JWT_SIGN_SECRET_ADMIN);
        }
        else{
            return false;
        }  
    }
    else{
        if(jwt.verify(token, JWT_SIGN_SECRET)){
            return jwt.verify(token, JWT_SIGN_SECRET);
        }
        else{
            return false;
        }   

    }
}


module.exports = checkIsLogin;
