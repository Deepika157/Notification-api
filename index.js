
const express= require("express");
const body_parser= require("body-parser");
const axios= require("axios");
require('dotenv').config();

const app= express().use(body_parser.json());

const token= process.env.TOKEN;
const mytoken= process.env.MYTOKEN;

app.listen(8000 || process.env.PORT,()=>{
       
  console.log("webhook is listening");
});

app.get("/webhooks", (req,res)=>{
   
    let node= req.query["hub.mode"];
    let challenge= req.query["hub.challenge"];
    let token= req.query["hub.verify_token"];
    
    console.log(mytoken, "tokennnnn")
    console.log(node, token, ">>>>>>>>")
    if(node && token){
        if(node== "subscribe" && token== mytoken){
            console.log("running")

             res.status(200).send(challenge);
        }
        else{
            console.log(" not running")

            res.status(403);
        }
    }
});

app.post("/webhooks", (req,res)=>{
    
    let body_para= req.body;
    
    console.log(JSON.stringify(body_para, null, 2));
     
    if(body_para.object){
        if(body_para.entry &&
           body_para.entry[0].changes &&
           body_para.entry[0].changes[0].value.message &&
           body_para.entry[0].changes[0].value.message[0] ){
                
           let phone_no_id= req.body.entry[0].changes[0].value.metadata.phone_number_id;
           let from= req.body.entry[0].changes[0].value.messages[0].from;
           let msg_body= req.body.entry[0].changes[0].value.messages[0].text.body;

           axios({
              method:"POST",
              url:"https://graph.facebook.com/v18.0/"+phone_no_id+"/messages?access_token="+token,
              data:{
                messaging_product: "whatsapp",
                to: from,
                template: {
                    "name": "hello_world",
                    "language": {
                        "code": "en_US"
                    }
               }
               
            },
            headers:{
                "Content-Type": "application/json"

            }
           });

           res.sendStatus(200);
           }
           else{
                  
            res.sendStatus(404);
           }
    }
});