var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var cors = require('cors');
const dbOperation = require('./weddingManagement');

app.use(cors());
app.use(bodyParser.json());

app.get("/Guests", (req, res) => {
    dbOperation.getAllDataInDB().then((snap) => {
        let allData = [];
      snap.forEach((project) => {
        allData.push(project.val());
      })
      res.json(allData);
      // console.log(allData);
      return allData;
    }).catch((error) => {
        console.log(error);
      });
   });

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("Application Run At http://%s:%s",host,port)
})