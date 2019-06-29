const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
var flash = require('connect-flash');
var session = require('express-session')
var cookieparser = require('cookie-parser')

app.use(cookieparser('secret123'));
app.use(session({
  secret: "secret123",
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

/**
 * Mongoose Setup
 */
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/assets';
mongoose.connect(mongoURI);


var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection error"));
db.once('open', function (callback) {
  console.log('Connection Succeded');
})

/**
 * Import File Setup
 */

const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

var Schema = mongoose.Schema;
var capaxSchema = new Schema({ name: Object }, { strict: false });
var Capax = mongoose.model('Capax', capaxSchema);


app.post('/upload', upload.single('file'), (req, res) => {
  req.flash('exporty_err', 'Error Occured');
  req.flash('database', 'Error Ocurred');
  const chunks = [];
  const readStream = gfs.createReadStream(req.file.id);
  readStream.on("data", function (chunk) {
    chunks.push(chunk);
  });
  readStream.on("end", function () {
    Buffer.concat(chunks)
    let json = chunks.toString('utf-8')
    var data = new Capax({ json });
    data.save()
    res.redirect('/')
  })
});

app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));
app.set('view engine', 'ejs');

/**
 * Capax
 */

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
    if (err) {
      console.log('error ocuured');
      res.send(req.flash('submit_err'));
    }
    else {
      console.log("Record inserted Successfully");
      res.redirect("/capax");
    }
  });
})

var datas = [];
var length;
app.post('/capax_search', function (req, res) {
  if (!datas == []) {
    datas = [];
  }
  var serialnum = req.body.exampleserailNumber_c
  req.flash("retrive_err", "No data found");
  req.flash("succes_err", "Some error ocuured");
  req.flash("del_err", "Please retrive the data first")
  req.flash("edit_er", "Please retrive the data first")
  req.flash('delete_s', 'Deleted Succcessfully');
  db.collection('Capax').find({ 'serialNumber': serialnum }).toArray((err, docs) => {
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
        del_id: docs[i]._id
      });
    }

    res.redirect('/c');
  });

})

/**
 * Add import data to mongoose database
 */
const collectionchunks = db.collection('uploads.chunks')

app.post('/retrive', function (req, res) {
  var json;
  collectionchunks.find({}, { sort: { '_id': -1 } })
    .toArray(function (err, docs) {
      var dat = []
      dat.push({
        id: docs[0]._id
      });
      console.log(dat[0].id);
      var id = dat[0].id;
      collectionchunks.findOne({ '_id': id }, function (err, collection) {
        if (err) throw err
        var text = collection.data.toString('utf-8');
        console.log(text.replace(/\s/, ''));
        var tex = text.replace(/\s/, '');
        json = JSON.parse(tex);
        db.collection('Capax').insertMany(json, function (err, collection) {
          if (err) {
            console.log(err);
            res.send(req.flash('database'));
          } else {
            console.log('Record insterted');
            res.redirect('/');
          }
        })
      })
    })
})

app.post('/export', function (req, res) {
  db.collection('Capax').find().toArray(function (err, docs) {
    if (err) throw err
    console.log(docs);
    fs.writeFile('Output.json', JSON.stringify(docs), function (err) {
      if (err) {
        console.log(err);

        res.send(req.flash('export_err'));
      } else {
        console.log('Saved');
        res.redirect('/');
      }
    });
  })
})


app.post('/capax_his', function (req, res) {
  req.flash('prev_err', 'No data found');
  req.flash('next_err', 'No data found');
  req.flash('delete_suc', 'Deleted Successfully')
  var i;
  var rec = [];
  for (i = 0; i < length; i++) {
    rec.push({
      serialNumber: datas[i].serialNumber,
      sapCode: datas[i].sapCode,
      materialCode: datas[i].materialCode,
      materialQuantity: datas[i].materialQuantity,
      poDate: datas[i].poDate,
      poNum: datas[i].poNum,
      invoiceDate: datas[i].invoiceDate,
      invoiceNumber: datas[i].invoiceNumber,
      receiveDate: datas[i].receiveDate,
      model: datas[i].model,
      modelDesp: datas[i].modelDesp,
      summit: datas[i].summit,
      del_id: datas[i].del_id
    })
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_err'));
  }
  else {
    res.render('capax_his', {
      exampleserailNumber: rec[0].serialNumber,
      exampleSapCode: rec[0].sapCode,
      exampleMaterialCode: rec[0].materialCode,
      exampleMaterialQuantity: rec[0].materialQuantity,
      examplepoNumber: rec[0].poNum,
      examplepoDate: rec[0].poDate,
      exampleInvoiceDate: rec[0].invoiceDate,
      exampleInvoiceNumber: rec[0].invoiceNumber,
      exampleRecieveDate: rec[0].receiveDate,
      exampleModel: rec[0].model,
      exampleModelDescp: rec[0].modelDesp,
      exampleUpdateSummit: rec[0].summit
    });
  }
})
var rec = [];
var j = 0;
app.get('/next', function (req, res) {
  if (!rec == []) {
    rec = [];
  }
  var i;

  for (i = 0; i < length; i++) {
    rec.push({
      serialNumber: datas[i].serialNumber,
      sapCode: datas[i].sapCode,
      materialCode: datas[i].materialCode,
      materialQuantity: datas[i].materialQuantity,
      poDate: datas[i].poDate,
      poNum: datas[i].poNum,
      invoiceDate: datas[i].invoiceDate,
      invoiceNumber: datas[i].invoiceNumber,
      receiveDate: datas[i].receiveDate,
      model: datas[i].model,
      modelDesp: datas[i].modelDesp,
      summit: datas[i].summit,
      del_id: datas[i].del_id
    })
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_err'));
  }
  else {
    console.log(j);
    j++;
    console.log(j);
    if (j == length) {
      console.log('No data found');
      j--;
      res.send(req.flash('next_err'));
    } else {
      console.log(rec[j]);
      res.render('capax_his', {
        exampleserailNumber: rec[j].serialNumber,
        exampleSapCode: rec[j].sapCode,
        exampleMaterialCode: rec[j].materialCode,
        exampleMaterialQuantity: rec[j].materialQuantity,
        examplepoNumber: rec[j].poNum,
        examplepoDate: rec[j].poDate,
        exampleInvoiceDate: rec[j].invoiceDate,
        exampleInvoiceNumber: rec[j].invoiceNumber,
        exampleRecieveDate: rec[j].receiveDate,
        exampleModel: rec[j].model,
        exampleModelDescp: rec[j].modelDesp,
        exampleUpdateSummit: rec[j].summit
      });

    }
  }
})

app.get('/prev', function (req, res) {
  if (!rec == []) {
    rec = [];
  }
  if (j == 0) {
    console.log('No data')
    res.send(req.flash('prev_err'));
  } else {
    var i;
    for (i = 0; i < length; i++) {
      rec.push({
        serialNumber: datas[i].serialNumber,
        sapCode: datas[i].sapCode,
        materialCode: datas[i].materialCode,
        materialQuantity: datas[i].materialQuantity,
        poDate: datas[i].poDate,
        poNum: datas[i].poNum,
        invoiceDate: datas[i].invoiceDate,
        invoiceNumber: datas[i].invoiceNumber,
        receiveDate: datas[i].receiveDate,
        model: datas[i].model,
        modelDesp: datas[i].modelDesp,
        summit: datas[i].summit,
        del_id: datas[i].del_id
      })
    }
    if (rec == null) {
      console.log('No data Found');
      res.send(req.flash('retrive_err'));
    }
    else {
      console.log(j);
      j--;
      console.log(j);
      console.log(rec[j]);
      res.render('capax_his', {
        exampleserailNumber: rec[j].serialNumber,
        exampleSapCode: rec[j].sapCode,
        exampleMaterialCode: rec[j].materialCode,
        exampleMaterialQuantity: rec[j].materialQuantity,
        examplepoNumber: rec[j].poNum,
        examplepoDate: rec[j].poDate,
        exampleInvoiceDate: rec[j].invoiceDate,
        exampleInvoiceNumber: rec[j].invoiceNumber,
        exampleRecieveDate: rec[j].receiveDate,
        exampleModel: rec[j].model,
        exampleModelDescp: rec[j].modelDesp,
        exampleUpdateSummit: rec[j].summit
      });
    }
  }
})

app.get('/c', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_err'));
  }
  else {
    res.render('capax_se', {
      exampleserailNumber_c: rec.c_serialnum,
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
  if (rec == null) {
    console.log('Please Retrive the data first');
    res.send(req.flash('del_er'));
  }
  else {
    db.collection('Capax').deleteOne({ '_id': rec.del_id })
      .then(function (results) {
        res.send(req.flash('delete_s'));
        console.log('Deleted SuccessFully');
        res.redirect('/c');
      })
  }
})

app.get('/capax_dl', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('Please Retrive the data first');
    res.send(req.flash('del_er'));
  }
  else {
    db.collection('Capax').deleteOne({ '_id': rec.del_id })
      .then(function (results) {
        res.send(req.flash('delete_suc'));
        console.log('Deleted SuccessFully');
        res.redirect('/capax_dl');
      })
  }
})

var data_ed;
app.post('/capax_edit', function (req, res) {
  console.log(req.body)
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('Please Retrive the data first');
    res.send(req.flash('edit_err'));
  }
  else {
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
  }
})

app.post('/editc_save', function (req, res) {
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
    res.redirect('/search_c');
  })
})

/**
 * Revenue
 */

app.post('/revenue_save', function (req, res) {
  var serialNumber = req.body.exampleserailNumber;
  var sapCode = req.body.exampleSapCode;
  var materialCode = req.body.exampleMaterialCode;
  var materialQuantity = req.body.exampleMaterialQuantity;
  var poDate = req.body.examplepoDate;
  var poNum = req.body.examplepoNumber;
  var invoiceDate = req.body.exampleInvoiceDate;
  var receiveDate = req.body.exampleRecieveDate;
  var model = req.body.exampleModel;
  var modelDesp = req.body.exampleModelDescp;

  var data = {
    "serialNumber": serialNumber,
    "sapCode": sapCode,
    "materialCode": materialCode,
    "materialQuantity": materialQuantity,
    "poDate": poDate,
    "poNum": poNum,
    "invoiceDate": invoiceDate,
    "receiveDate": receiveDate,
    "model": model,
    "modelDesp": modelDesp,

  }
  db.collection('Revenue').insertOne(data, function (err, collection) {
    if (err) {
      console.log('error ocuured');
      res.send(req.flash('submit_err'));
    }
    else {
      console.log("Record inserted Successfully");
      res.redirect("/revenue");
    }
  });
})

var datas = [];
var length;
app.post('/revenue_search', function (req, res) {
  if (!datas == []) {
    datas = [];
  }
  var serialnum = req.body.exampleserailNumber_r
  console.log(serialnum);
  req.flash("retrive_er", "No data found");
  req.flash("succes_er", "Some error ocuured");
  req.flash("del_er", "Please retrive the data first")
  req.flash("edit_e", "Please retrive the data first")
  req.flash('delete_sc', 'Deleted Succcessfully');
  db.collection('Revenue').find({ 'serialNumber': serialnum }).toArray((err, docs) => {
    if (err) throw err

    length = docs.length;
    console.log(length);
    var i;
    for (i = 0; i < length; i++) {
      datas.push({
        r_serialnum: serialnum,
        serialNumber: docs[i].serialNumber,
        sapCode: docs[i].sapCode,
        materialCode: docs[i].materialCode,
        materialQuantity: docs[i].materialQuantity,
        poDate: docs[i].poDate,
        poNum: docs[i].poNum,
        invoiceDate: docs[i].invoiceDate,
        receiveDate: docs[i].receiveDate,
        model: docs[i].model,
        modelDesp: docs[i].modelDesp,
        del_id: docs[i]._id
      });
    }

    res.redirect('/r');
  });

})

app.get('/r', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_er'));
  }
  else {
    res.render('revenue_se', {
      exampleserailNumber_r: rec.r_serialnum,
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

app.post('/revenue_del', function (req, res) {
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('Please Retrive the data first');
    res.send(req.flash('del_er'));
  }
  else {
    db.collection('Revenue').deleteOne({ '_id': rec.del_id })
      .then(function (results) {
        res.send(req.flash('delete_sc'));
        console.log('Deleted SuccessFully');
        res.redirect('/r');
      })
  }
})

app.post('/revenue_edit', function (req, res) {
  console.log(req.body)
  var i;
  var rec = [];
  for (i = (length - 1); i < length; i++) {
    rec = datas[i];
  }
  if (rec == null) {
    console.log('Please Retrive the data first');
    res.send(req.flash('edit_er'));
  }
  else {
    res.render('revenue_edit', {
      exampleserailNumber: rec.serialNumber,
      exampleSapCode: rec.sapCode,
      exampleMaterialCode: rec.materialCode,
      exampleMaterialQuantity: rec.materialQuantity,
      examplepoNumber: rec.poNum,
      examplepoDate: rec.poDate,
      exampleInvoiceDate: rec.invoiceDate,
      exampleRecieveDate: rec.receiveDate,
      exampleModel: rec.model,
      exampleModelDescp: rec.modelDesp,
    });
  }
})

app.post('/revenue_his', function (req, res) {
  req.flash('prev_err', 'No data found');
  req.flash('next_err', 'No data found');
  req.flash('delete_suc', 'Deleted Successfully')
  var i;
  var rec = [];
  for (i = 0; i < length; i++) {
    rec.push({
      serialNumber: datas[i].serialNumber,
      sapCode: datas[i].sapCode,
      materialCode: datas[i].materialCode,
      materialQuantity: datas[i].materialQuantity,
      poDate: datas[i].poDate,
      poNum: datas[i].poNum,
      invoiceDate: datas[i].invoiceDate,
      receiveDate: datas[i].receiveDate,
      model: datas[i].model,
      modelDesp: datas[i].modelDesp,
      del_id: datas[i].del_id
    })
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_er'));
  }
  else {
    res.render('revenue_his', {
      exampleserailNumber: rec[0].serialNumber,
      exampleSapCode: rec[0].sapCode,
      exampleMaterialCode: rec[0].materialCode,
      exampleMaterialQuantity: rec[0].materialQuantity,
      examplepoNumber: rec[0].poNum,
      examplepoDate: rec[0].poDate,
      exampleInvoiceDate: rec[0].invoiceDate,
      exampleRecieveDate: rec[0].receiveDate,
      exampleModel: rec[0].model,
      exampleModelDescp: rec[0].modelDesp,
    });
  }
})
var rec = [];
var j = 0;
app.get('/next', function (req, res) {
  if (!rec == []) {
    rec = [];
  }
  var i;

  for (i = 0; i < length; i++) {
    rec.push({
      serialNumber: datas[i].serialNumber,
      sapCode: datas[i].sapCode,
      materialCode: datas[i].materialCode,
      materialQuantity: datas[i].materialQuantity,
      poDate: datas[i].poDate,
      poNum: datas[i].poNum,
      invoiceDate: datas[i].invoiceDate,
      receiveDate: datas[i].receiveDate,
      model: datas[i].model,
      modelDesp: datas[i].modelDesp,
      del_id: datas[i].del_id
    })
  }
  if (rec == null) {
    console.log('No data Found');
    res.send(req.flash('retrive_er'));
  }
  else {
    console.log(j);
    j++;
    console.log(j);
    if (j == length) {
      console.log('No data found');
      j--;
      res.send(req.flash('next_er'));
    } else {
      console.log(rec[j]);
      res.render('revenue_his', {
        exampleserailNumber: rec[j].serialNumber,
        exampleSapCode: rec[j].sapCode,
        exampleMaterialCode: rec[j].materialCode,
        exampleMaterialQuantity: rec[j].materialQuantity,
        examplepoNumber: rec[j].poNum,
        examplepoDate: rec[j].poDate,
        exampleInvoiceDate: rec[j].invoiceDate,
        exampleRecieveDate: rec[j].receiveDate,
        exampleModel: rec[j].model,
        exampleModelDescp: rec[j].modelDesp,
      });

    }
  }
})

app.get('/prev', function (req, res) {
  if (!rec == []) {
    rec = [];
  }
  if (j == 0) {
    console.log('No data')
    res.send(req.flash('prev_er'));
  } else {
    var i;
    for (i = 0; i < length; i++) {
      rec.push({
        serialNumber: datas[i].serialNumber,
        sapCode: datas[i].sapCode,
        materialCode: datas[i].materialCode,
        materialQuantity: datas[i].materialQuantity,
        poDate: datas[i].poDate,
        poNum: datas[i].poNum,
        invoiceDate: datas[i].invoiceDate,
        receiveDate: datas[i].receiveDate,
        model: datas[i].model,
        modelDesp: datas[i].modelDesp,
        del_id: datas[i].del_id
      })
    }
    if (rec == null) {
      console.log('No data Found');
      res.send(req.flash('retrive_er'));
    }
    else {
      console.log(j);
      j--;
      console.log(j);
      console.log(rec[j]);
      res.render('revenue_his', {
        exampleserailNumber: rec[j].serialNumber,
        exampleSapCode: rec[j].sapCode,
        exampleMaterialCode: rec[j].materialCode,
        exampleMaterialQuantity: rec[j].materialQuantity,
        examplepoNumber: rec[j].poNum,
        examplepoDate: rec[j].poDate,
        exampleInvoiceDate: rec[j].invoiceDate,
        exampleRecieveDate: rec[j].receiveDate,
        exampleModel: rec[j].model,
        exampleModelDescp: rec[j].modelDesp,
      });
    }
  }
})


app.post('/editr_save', function (req, res) {
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
  db.collection('Revenue').insertOne(data_ed, function (err, collection) {
    if (err) throw err
    console.log('Record Inserted');
    res.redirect('/search_r');
  })
})


app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/capax', (req, res) => res.render('capax'));
app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/search_c', (req, res) => res.render('search_c'));
app.get('/search_r', (req, res) => res.render('search_r'));
app.get('/import_cap', (req, res) => res.render('import_cap'))



// LOCAL
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// HEROKU
app.listen(process.env.PORT, process.env.IP, () => console.log("Server started ..."))