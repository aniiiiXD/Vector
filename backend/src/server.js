const express = require("express");
const app = express();
import auth from "./auth/auth";
const uploadRoutes = require('./routes/upload');
const verifyRoutes = require('./routes/verify');

app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/verify', verifyRoutes);

const users = []; 
const docs = []; 

app.get("/me" , auth , (req,res)=>{

    const entry = req.headers.authentication ; 

    if(entry){
        //fetch all the documents after going through the CID 
    } else {
        console.log("Kal ana beteee")
    }
    

})


app.post("/signup" , (req,res)=>{
    //sign up 
})

app.post("/signin" , (req,res)=>{

})
