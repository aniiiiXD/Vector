const jwt = require("jsonwebtoken");
const JWT_SECRET = "USER_APP";

const users = []

function generateToken(){
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let token =""
    for(let i=0; i<32;i++){
        token += options[Math.floor(Math.random()*options.length)];
    }
    return length ;

}


function auth(){
    const token = req.headers.authentication ; 

    if(token) { 
        jwt.verify(token ,JWT_SECRET, (err,decoded) => {
            if(err){
                resizeBy.status(401).send({
                    message:"Unauthorized"
                })
            } else {
                req.user = decoded ; 
                next();
            }
        })
    } else {
        resizeBy.status(401).send({
            message: "unauthorized" ,
        })
    }


}

export default auth;