const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
var fs = require('fs');
var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyAX6nl15R1Vm5ofZi5j3b8_aqdECFKTKi8",
    authDomain: "assets-management-f7361.firebaseapp.com",
    databaseURL: "https://assets-management-f7361.firebaseio.com",
    projectId: "assets-management-f7361",
    storageBucket: "",
    messagingSenderId: "662080556439",
    appId: "1:662080556439:web:8f6c873bee5384e1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// var messagesRef = firebase.database().ref('Revenue Details');
// messagesRef.on("value", function (data) {
//     dat_r = JSON.stringify(data);
//     console.log(dat_r);
// });
// var messagesRef = firebase.database().ref('Capax Details');
// messagesRef.on("value", function (data) {
//     dat_c = JSON.stringify(data);
//     console.log(dat_c);
// });

//mongoose Setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/assets');

var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection error"));
db.once('open', function (callback){
  console.log('Connection Succeded');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));
app.set('view engine', 'ejs');

app.get('/capax', (req, res) => res.render('capax'));

app.post('/capax_save', function (req, res){
  var serialNumber = req.body.exampleserailNumber; 
  var sapCode = req.body.exampleSapCode; 
  var materialCode = req.body.exampleMaterialCode; 
  var materialQuantity = req.body.exampleMaterialQuantity;
  var poDate = req.body.exampleexamplepoDate;
  var poNum = req.body.examplepoNumber;
  var invoiceDate = req.body.exampleInvoiceDate;
  var invoiceNumber = req.body.exampleInvoiceNumber;
  var receiveDate = req.body.exampleRecieveDate;
  var model = req.body.exampleModel;
  var modelDesp = req.body.exampleModelDescp;
  var summit = req.body.exampleUpdateSummit; 

  var data = { 
   "serialNumber": serialNumber,
   "sapCode": sapCode,
   "materialCode": materialCode,
   "materialQuantity": materialQuantity, 
   "poDate": poDate,
   "poNum": poNum,
   "invoiceDate": invoiceDate,
   "invoiceNumber": invoiceNumber,
   "receiveDate":receiveDate,
   "model": model,
   "modelDesp":modelDesp,
   "summit":summit
} 

res.json(data);
db.collection('Capax Assets Details').insertOne(data,function(err, collection){ 
  if (err) throw err; 
  console.log("Record inserted Successfully"); 
   console.log(collection);     
}); 
})


app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));

app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/search_c', (req, res) => res.render('search_c'));
app.get('/search_r', (req, res) => res.render('search_r'));

// app.get("/check/:id", (req, res) => {
//     fs.writeFile("file.txt", (req.params.id), function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });
//     res.send(req.params.id);
// })



// HEROKU
// app.listen(process.env.PORT, process.env.IP, () => console.log("Server started ..."))

// LOCAL
app.listen(port, () => console.log(`Example app listening on port ${port}!`))