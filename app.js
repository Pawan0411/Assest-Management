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
var atob = require('atob');

const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/assets';
mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.log.bind(console, "Connection error"));
db.once('open', function (callback) {
  console.log('Connection Succeded');
})

// Create mongo connection
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

app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  console.log("Uploaded")
  console.log(JSON.stringify(req.file))
  res.redirect('/');
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

app.get("/u", (req, res) => {
  res.render("u.ejs")
})
app.get("/r", (req, res) => {
  res.render("r.ejs")
})
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
  db.collection('Capax').insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
    res.redirect("/capax");
  });
})
var datas = [];
var serialnum;
app.post('/capax_search', function (req, res) {
  serialnum = req.body.exampleserailNumber_c
  db.collection('Capax').findOne({ "serialNumber": serialnum })
    .then(function (result) {
      console.log(result);
      datas = result;
      
      res.redirect('/c');
    })

})

app.post('/capax_del', function (req, res) {
  db.collection('Capax').deleteOne({ "serialNumber": datas.serialNumber })
    .then(function (results) {
      console.log("Deleted Succesfully");
      res.redirect('/c');
    })
})

app.post('/capax_edit', function (req, res){
  res.redirect('/capax');
  console.log(datas.serialNumber);
  // res.render('/capax', { exampleserailNumber: serialnum });
})
const collectionChunks = db.collection('uploads.chunks');

app.post('/retrive', function (req, res) {
  var json;
  collectionChunks.distinct("data")
    .then(function (results) {
      console.log(results);
      var text = results.toString('utf-8');//binaryto string
      console.log("START")
      try {
        json = JSON.parse(text);
        console.log("DONE")
        db.collection('Capax').insertOne(json, function (err, collection) {
          if (err) {
            console.log("ERROR_SS")
            console.log(err);
          }
          else {
            console.log("Record inserted")
            res.redirect('/');
          }
        })
      } catch (err) {
        console.error(err)
      }
    })

});

app.get('/c', function (req, res) {
  // console.log(datas.sapCode); //WOrking
  // var se = datas.serialNumber;
  res.render('search_c', { exampleserailNumber: datas.serialNumber,
    exampleSapCode : datas.sapCode });
})

app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/capax', (req, res) => res.render('capax'));
app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/search_c', (req, res) => res.render('search_c'));
app.get('/search_r', (req, res) => res.render('search_r'));

// HEROKU
// app.listen(process.env.PORT, process.env.IP, () => console.log("Server started ..."))

// LOCAL
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// var fs = require('fs');
// var firebase = require('firebase');
// var firebaseConfig = {
//     apiKey: "AIzaSyAX6nl15R1Vm5ofZi5j3b8_aqdECFKTKi8",
//     authDomain: "assets-management-f7361.firebaseapp.com",
//     databaseURL: "https://assets-management-f7361.firebaseio.com",
//     projectId: "assets-management-f7361",
//     storageBucket: "",
//     messagingSenderId: "662080556439",
//     appId: "1:662080556439:web:8f6c873bee5384e1"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

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


// app.get("/check/:id", (req, res) => {
//     fs.writeFile("file.txt", (req.params.id), function (err) {
//         if (err) {
//             return console.log(err);
//         }

//         console.log("The file was saved!");
//     });
//     res.send(req.params.id);
// })

