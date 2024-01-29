const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET;
const JWT_SIGN_SECRET_ADMIN = process.env.JWT_SIGN_SECRET_ADMIN;




function CheckIsLogin(token){  
    try{
        return jwt.verify(token, 'pouet');  
    }
    catch (err){
        return false;
    }
}

function getPayloadData(token){
    try{
        return jwt.decode(token);
    }
    catch (err){
        return false;
    }
}

module.exports = {
    CheckIsLogin,
    getPayloadData,
}
