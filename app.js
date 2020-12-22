var express = require('express');    //Express Web Server 
//var http = require('http'),
//var    inspect = require('util').inspect;
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var bodyParser = require('body-parser');

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
*/
/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload').post(function (req, res, next) {
    //var name = req.params.abc;
    //console.log("abc value" + name);
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        //console.log("field: " + fieldname);
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream('D:\\temp\\nodeJS\\' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            console.log("Upload Finished of " + filename);
            res.redirect('back');           //where to go next
        });
    });
    let formData = new Map();
    req.busboy.on('field', function (fieldname, val) {
        formData.set(fieldname, val);
        console.log(formData); // Map { 'name' => 'hi', 'number' => '4' }
        // here you can do 
        console.log(formData.get('abc')); //  'hi'
    });
    req.busboy.on("finish", function () {


        //formData.get('number') //  '4'

        // any other logic with formData here

        //res.end();
    });
});
app.get('/test/:filename', function (req, res) {
    var filename = "";
    filename = req.params.filename;
    render(req.params.filename + ".html", null, function (err, data) {
        res.send(data);
        //callback(null, data);
    });
    //var indexRouter = require('./routes/' + filename);
    //app.use('/', indexRouter);
    /*    res.render(filename+".html", {
            game: 'Final Fantasy VII',
            category: '<p><b>Characters:</b></p>',
            characters: ['Cloud', 'Aerith', 'Tifa', 'Barret']
        });
    */
});
function render(filename, params, callback) {
    console.log(filename);
    fs.readFile("./public/" + filename, 'utf8', function (err, data) {
        if (err) return callback(err);
        for (var key in params) {
            data = data.replace('{' + key + '}', params[key]);
        }
        callback(null, data); // 用 callback 傳回結果V
    });
}
var server = app.listen(3030, function () {
    console.log('Listening on port %d', server.address().port);
});