const express = require("express");
const {PORT} = require("./config");
const rootRouter=require("./routes")
const core = require("cors");


const app = express();


app.use(express.json());
app.use(core());
//`Route use /api/vi/...  transfer at rootRouter 
app.use("/api/v1", rootRouter);



app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).send("Something went wrong");
})




app.listen(PORT,()=>console.log(`http://localhost:3000/api/v1/user`));
