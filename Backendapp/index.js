// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes/userroutes")

dotenv.config();   
     
const app = express(); 
app.use(cors());
app.use(express.json());
 
app.set('view engine', 'ejs') 
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

mongoose.connect(process.env.MONGO_URI)
.then(()=>{ 
    console.log("mongoDb conected successfully");
})  
.catch((error)=>{
    console.log("Error in connectivity is", error);
})

// Routes
app.use("/api", routes ); 
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  