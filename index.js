import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import isURL from "is-url";
import {v5 as uuidv5} from "uuid";
import  Request from "request";
import fs from "fs"
import { url } from "inspector";
import { render } from "ejs";

// sample stored data 
// [url, shortened_url, [variant_1, label, no_of_visit, variant_2, label, no_of_visit]]

var db = [
    [
      'https://google.com',
      '9a4cda5b-12b5-5e03-822a-7d33af73bcf0',
      [
        '9a4cda5b-12b5-5e03-822a-7d33af73bcf0__0',
        "Kuala Lumpur",
        0,
        '9a4cda5b-12b5-5e03-822a-7d33af73bcf0__1',
        "Sepang",
        0
      ]
    ],
    [
      'https://github.com/uuidjs/uuid#readme',
      '3ceee16d-aa56-5920-9be1-7729bc7fcb28',
      [
        '3ceee16d-aa56-5920-9be1-7729bc7fcb28__0',
        "Kulim",
        0,
        '3ceee16d-aa56-5920-9be1-7729bc7fcb28__1',
        "Hi-Tech",
        0,
        '3ceee16d-aa56-5920-9be1-7729bc7fcb28__2',
        "Wow",
        0
      ]
    ]
  ]



const __dirname  = dirname(fileURLToPath(import.meta.url))

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
var user_url = ""
var quantity = ""
var url_labels = ""

function verifyURL(req, res, next){
    console.log("Inside VerifyURl")
    console.log(req.body)
    url_labels = req.body.label
    user_url = req.body.user_url
    quantity = req.body.quantity
    next();

    // var url = unescape(buf.toString(encoding).slice(9));
    // console.log("INSIDE verifyURL")
    // console.log(req.body)
    // console.log(buf);
    // console.log(url)
    // console.log("Is the URL Valid:", isURL(url))
    

}

app.use(verifyURL)
app.use(express.static("public"))



app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html")

    res.render(__dirname + "/views/index.ejs")
})

app.post("/shorten_url", (req, res) =>{


    console.log("INSIDE POSTT!!")
    console.log(user_url)
    console.log(url_labels)
    console.log(isURL(user_url))
    console.log(quantity)
    
    if (isURL(user_url) == true ){
        
        var url_instance = []
        var uuid = uuidv5(user_url, uuidv5.URL)
        for(let i=0; i<quantity ; i++){
            url_instance.push(uuid.concat("__",i),url_labels[i], 0)
            
        }
        
        var db_temp = [user_url, uuid, url_instance];
        db.push(db_temp)
        console.log(url_instance)
        // res.send("<h1>HIII</h1>")
        res.render(__dirname + "/views/shorten_url.ejs", { user_url: user_url, quantity: quantity,  url_instance : url_instance})   

    }else{
        
        res.render(__dirname + "/views/index.ejs")

    }

})

app.post("/define_url", (req,res) =>{
    console.log("Inside define URL")
    console.log(url_labels)
    console.log(db)
    console.log(db.indexOf(url_labels[0]))

    // update shortened urls labels
    for (let i=0; i<db.length; i++){
        if(url_labels[0].includes(db[i][1])){
            for (let j=0; j<url_labels.length; i++){

            }
        }

    }
    res.send("<h1>HIII</h1>")
    // res.send()
})

app.post("/test_uuid", (req, res) => {
    console.log("THIS IS PREM")
    var uuid_test = req.body.uuid
    var redirect = "/shorten_url/" + uuid_test
    res.redirect(redirect)

})

app.get("/shorten_url/:uuid", (req, res) =>{
    console.log("PREM")
    console.log(req.body)

    var valid_url = false;

    for ( var i=0; i< db.length; i++){
        var user_uuid = req.params.uuid
        console.log("THIS")
        console.log(user_uuid)
        if(user_uuid.includes(db[i][1])){
            console.log("LENGTH")
            console.log(db[i][2].length)
            for (var j=0; j< db[i][2].length; j = j+3){
                // increase the no. of url visits
                if (user_uuid == db[i][2][j]){
                    db[i][2][j+2] = db[i][2][j+2] +1
                }
                console.log("ok done")
            }
            console.log(db)
            var ori_url = db[i][0];
            console.log(ori_url)

            res.redirect(ori_url)
            valid_url = true
        } 
    }

    if (valid_url == false){
        res.redirect(404,"/");
    }

   

})


app.get("/test_link", (req, res) => {

    res.render(__dirname + "/views/test_link.ejs")
})

app.get("/visit_history", (req, res) => {
    console.log(db)
    res.render(__dirname + "/views/visit_history.ejs", {db : db})
})





//Just added this to check on the DB
app.get("/url_traffic", (req, res) => {
    
    res.json(db)
   
})

app.listen(port, () =>{
    console.log(`Listening on port ${port}.`)
})


