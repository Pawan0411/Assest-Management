const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;

var flash = require('connect-flash');
var session = require('express-session')
var cookieparser = require('cookie-parser')

app.use(cookieparser('secret123'));
app.use(session({
  secret : "secret123",
  saveUninitialized : true,
  resave: true
}));
app.use(flash());
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
  console.log(summit);

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
  db.collection('Capax').insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
    res.redirect("/capax");
  });
})
var datas = [];
var length;
app.post('/capax_search', function (req, res) {
  var serialnum = req.body.exampleserailNumber_c
  req.flash("data_err", "No data found");
  req.flash("succes_err","Some error ocuured");
  db.collection('Capax').find({ 'serialNumber': serialnum }).toArray(function (err, docs) {
    if (err) throw err
   
      length = docs.length;
      console.log(length);
      var i;
      for (i = 0; i < length; i++) {
        datas.push({
          c_serialnum: serialnum,
          serialNumber: docs[i].serialNumber,
          sapCode: docs[i].sapCode,
          materialCode: docs[i].materialCode,
          materialQuantity: docs[i].materialQuantity,
          poDate: docs[i].poDate,
          poNum: docs[i].poNum,
          invoiceDate: docs[i].invoiceDate,
          invoiceNumber: docs[i].invoiceNumber,
          receiveDate: docs[i].receiveDate,
          model: docs[i].model,
          modelDesp: docs[i].modelDesp,
          summit: docs[i].summit,
          del_id : docs[i]._id
        });
      }
    
    res.redirect('/c');
  });

})

app.post('/capax_his', function (req, res) {
 
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

app.get('/c', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('data_err'));
    
  }
   else {

  res.render('capax_se', {
    exampleserailNumber_c : rec.c_serialnum,
    exampleserailNumber: rec.serialNumber,
    exampleSapCode: rec.sapCode,
    exampleMaterialCode: rec.materialCode,
    exampleMaterialQuantity: rec.materialQuantity,
    examplepoNumber: rec.poNum,
    examplepoDate: rec.poDate,
    exampleInvoiceDate: rec.invoiceDate,
    exampleInvoiceNumber: rec.invoiceNumber,
    exampleRecieveDate: rec.receiveDate,
    exampleModel: rec.model,
    exampleModelDescp: rec.modelDesp,
    exampleUpdateSummit: rec.summit
  
});
   }
  })
app.post('/capax_del', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  console.log(rec.del_id)
    db.collection('Capax').deleteOne({'_id': rec.del_id})
    .then(function (results){
      console.log('Deleted SuccessFully');
      res.redirect('/c');
    })
})


var data_ed;
app.post('/capax_edit', function (req, res) {
  console.log(req.body)
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  
  res.render('capax_edit', {
    exampleserailNumber: rec.serialNumber,
    exampleSapCode: rec.sapCode,
    exampleMaterialCode: rec.materialCode,
    exampleMaterialQuantity: rec.materialQuantity,
    examplepoNumber: rec.poNum,
    examplepoDate: rec.poDate,
    exampleInvoiceDate: rec.invoiceDate,
    exampleInvoiceNumber: rec.invoiceNumber,
    exampleRecieveDate: rec.receiveDate,
    exampleModel: rec.model,
    exampleModelDescp: rec.modelDesp,
    exampleUpdateSummit: rec.summit
  });

})

app.post('/edit_save', function (req, res) {
  console.log(req.body)
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


  data_ed = {
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
  db.collection('Capax').insertOne(data_ed, function (err, collection) {
    if (err) throw err
    console.log('Record Inserted');
    res.redirect('/c');
  })
})
app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/capax', (req, res) => res.render('capax'));
app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/search_c', (req, res) => res.render('search_c'));
app.get('/search_r', (req, res) => res.render('search_r'));
app.get('/r'), (req, res) => res.render('r');


// LOCAL
app.listen(port, () => console.log(`Example app listening on port ${port}!`))