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

var dat_c;
var dat_r;
var newDate = new Date();
var messagesRef = firebase.database().ref('Revenue Details');
messagesRef.on("value", function (data) {
    dat_r = JSON.stringify(data);
    console.log(dat_r);
    // fs.writeFile('data/Output-rev' + newDate.getDate().toString() + "-" +
    //     (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
    //     dat_r, (err) => {
    //         if (err) throw err;
    //     })

});
var messagesRef = firebase.database().ref('Capax Details');
messagesRef.on("value", function (data) {
    dat_c = JSON.stringify(data);
    console.log(dat_c);
    // fs.writeFile('data/Output-cap' + newDate.getDate().toString() + "-" +
    //     (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
    //     dat_c, (err) => {
    //         if (err) throw err;
    //     })

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/css"));

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));
app.get('/index', (req, res) => res.render('index'));
app.get('/capax', (req, res) => res.render('capax'));
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