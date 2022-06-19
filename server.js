"use strict"

var 
    express = require("express"),   
    path = require("path"),
    app = express(),
    http = require('http'),
    mongoose = require('mongoose');

mongoose.connect('mongodb+srv://struth:Saket@123@cluster0.2rhzrx9.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected...");
});

const staticPath = path.join(__dirname,"/public");
app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/', function (req, res) {
    res.send("hello..");
});

app.get('/getUsers', function (req, res) {
    db.collection('sparkbank').find({}).toArray(function (err, sparkbank) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(sparkbank);
        }
    });
});


app.post('/insertUser', function(req, res){
    var jsonData = JSON.parse(req.body.mydata);

    db.collection('history').insertOne(jsonData, function(err, records) {
        if(err){
            console.log(err);
        }
        else{
            res.end('User saved');
        }
    })
});

app.put('/updateUser', function(req, res){
    var jsonDataUpdate = JSON.parse(req.body.updatedata);
    var FromId = {email: jsonDataUpdate.idFrom};
    var ToId = {email: jsonDataUpdate.idTo};
    var Frombalance = {$set:{balance: jsonDataUpdate.blFrom}};
    var Tobalance = {$set:{balance: jsonDataUpdate.blTo}};
    
    db.collection('sparkbank').updateOne(FromId,Frombalance, function(err, records) {
        if(err){
            console.log(err);
        }
        else{
            db.collection('sparkbank').updateOne(ToId,Tobalance, function(err, records) {
                if(err){
                    console.log(err);
                }
                else{
                    res.end('User Updated');
                }
            })
        }
    })
});

app.get('/getHistory', function (req, res) {
    db.collection('history').find({}).toArray( function (err, history) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(history);
        }
    });
});

http.createServer(app).listen(8000);

