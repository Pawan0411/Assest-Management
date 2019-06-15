const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
var requirejs = require('requirejs');

requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: "/js",

    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/js"));

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index')); 
app.get('/index', (req, res) => res.render('index'));
app.get('/capax',(req,res) => res.render('capax'));
app.get('/revenue',(req,res) => res.render('revenue'));
app.get('/search_c',(req, res) => res.render('search_c'));
app.get('/search_r',(req, res) => res.render('search_r'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`))