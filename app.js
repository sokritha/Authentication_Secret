//jshint esversion:6
require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB");
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Create Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

// Create Model
const User = new mongoose.model("User", userSchema);



app.route("/")
    .get((req, res)=>{
        res.render("home")
    });

app.route("/login")
    .get((req, res)=>{
        res.render("login")
    })
    .post((req, res)=>{
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}, (err, foundUser)=>{
            if (err){
                console.log(err);
            }else{
                if (foundUser){
                    if (foundUser.password === password){
                        res.render("secrets");
                    }
                }
            }
        })
    });

app.route("/register")
    .get((req, res)=>{
        res.render("register");
    })
    .post((req, res)=>{
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })

        newUser.save(err=>{
            if(err){
                console.log(err);
            }else{
                res.render("secrets")
            }

        });
    });


app.listen(3000, ()=>{
    console.log("Server has started on port 3000.")
})