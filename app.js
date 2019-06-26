const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
var json = require('./assets/example_1.json');

//mongoose Setup
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/assets');

var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection error"));
db.once('open', function (callback) {
  console.log('Connection Succeded');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));
app.set('view engine', 'ejs');

app.post('/capax_save', function (req, res) {
  var serialNumber = req.body.exampleserailNumber;
  var sapCode = req.body.exampleSapCode;
  var materialCode = req.body.exampleMaterialCode;
  var materialQuantity = req.body.exampleMaterialQuantity;
  var poDate = req.body.examplepoDate;
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
    "receiveDate": receiveDate,
    "model": model,
    "modelDesp": modelDesp,
    "summit": summit
  }
  db.collection('Capax').insertOne(json, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
    res.redirect("/capax");
  });
})
var datas = [];
app.post('/capax_search', function (req, res) {
  var serialnum = req.body.exampleserailNumber_c
  console.log(serialnum);
  db.collection('Capax').findOne({ "serialNumber": serialnum })
    .then(function (result) {
      console.log(result);
      datas = result;
      res.redirect('/c');
    })
})

const collectionchunks = db.collection('uploads.chunks')

app.post('/retrive', function (req, res) {
  var json;
  collectionchunks.distinct('data')
    .then(function (results) {
      var text = results.toString('utf-8');
      json = JSON.parse(text);
      db.collection('Capax').insertOne(json, function (err, collection) {
        if (err) throw err
        console.log('Record insterted');
        res.redirect('/');
      })
    })
})
app.post('/capax_del', function (req, res) {
  db.collection('Capax').deleteOne({ "serialNumber": serialnum })
    .then(function (result) {
      console.log("Deleted");
      res.redirect('/search_c');
    })
})

app.get('/c', function (req, res) {
  res.render('search_c', {
    exampleserailNumber: datas.serialNumber,
    exampleSapCode: datas.sapCode,
    exampleMaterialCode: datas.materialCode,
    exampleMaterialQuantity: datas.materialQuantity,
    examplepoNumber: datas.poNum,
    examplepoDate: datas.poDate,
    exampleInvoiceDate: datas.invoiceDate,
    exampleInvoiceNumber: datas.invoiceNumber,
    exampleRecieveDate: datas.receiveDate,
    exampleModel: datas.model,
    exampleModelDescp: datas.modelDesp,
    exampleUpdateSummit: datas.summit
  });
})

app.post('/capax_ed', function (req, res) {
  res.redirect('/capax_edit');
})
app.get('/capax_edit', function (req, res){
  res.render('capax_edit', {
    exampleserailNumber: datas.serialNumber,
    exampleSapCode: datas.sapCode,
    exampleMaterialCode: datas.materialCode,
    exampleMaterialQuantity: datas.materialQuantity,
    examplepoNumber: datas.poNum,
    examplepoDate: datas.poDate,
    exampleInvoiceDate: datas.invoiceDate,
    exampleInvoiceNumber: datas.invoiceNumber,
    exampleRecieveDate: datas.receiveDate,
    exampleModel: datas.model,
    exampleModelDescp: datas.modelDesp,
    exampleUpdateSummit: datas.summit
  });
})

app.post('/capax_editsave', function (req, res){
  //Wil save the edited data here, I will continue here
})
app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/capax', (req, res) => res.render('capax'));
app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/search_c', (req, res) => res.render('search_c'));
app.get('/search_r', (req, res) => res.render('search_r'));
app.get('/r'), (req, res) => res.render('r');

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