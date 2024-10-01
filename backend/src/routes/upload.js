const express = require("express");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest : 'uploads/'})

const app = express()

app.post('/profile', upload.single('avatar'), function (req, res,next){

})
