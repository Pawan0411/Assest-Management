const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
var fs = require('fs');
var firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyDMXaX8AR8MKDoZohHewzphFERUEubVm0Y",
    authDomain: "assests-managment.firebaseapp.com",
    databaseURL: "https://assests-managment.firebaseio.com",
    projectId: "assests-managment",
    storageBucket: "assests-managment.appspot.com",
    messagingSenderId: "429074630365",
    appId: "1:429074630365:web:62f74225288877aa"
};

firebase.initializeApp(firebaseConfig);
var dat_c;
var dat_r;
var newDate = new Date();
fs.exists("/UltraTect_assets", function (exists) {
    console.log("file exists ? " + exists);
    if (!exists) {
        fs.mkdir("/UltraTect_assets/revenue", (err) => {
            if (err) throw err
        });
    }else{
        var messagesRef = firebase.database().ref('Revenue Details');
        messagesRef.on("value", function (data) {
            dat_r = JSON.stringify(data);
            console.log(dat_r);
            fs.writeFile('/UltraTect_assets/revenue/Output-' + newDate.getDate().toString() + "-" +
                (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
                dat_r, (err) => {
                    if (err) throw err;
                })
        
        });
    }
    if (!exists) {
        fs.mkdir("C:/UltraTect_assets/capax", (err) => {
            if (err) throw err
        });
    }else{
        var messagesRef = firebase.database().ref('Capax Details');
        messagesRef.on("value", function (data) {
            dat_c = JSON.stringify(data);
            console.log(dat_c);
            fs.writeFile('C:/UltraTect_assets/capax/Output-' + newDate.getDate().toString() + "-" +
                (newDate.getMonth() + 1).toString() + "-" + newDate.getFullYear().toString() + ".json",
                dat_c, (err) => {
                    if (err) throw err;
                })
        
        });
    }
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
app.listen(process.env.PORT, process.env.IP, () => console.log("Server started ..."))

// LOCAL
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))