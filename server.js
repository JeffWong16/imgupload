const express = require('express');
const config = require('./config')
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const ip = require('ip');
const addr = config.ip||ip.address();
const chalk = require('chalk');
app.use(bodyParser.json());
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        callback(null,  `gdb${Date.now().toString().slice(7,12)}${file.originalname}`);
    }
});

var upload = multer({ storage: Storage }).array('imgfile',40); 

app.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.json({
                result:'error'
            });
        }
      
        return res.json({
            result:'success',
            path:`http://${addr}:2000/images/${req.files[0].filename}`
        });
    });
});
app.use('/images',express.static('images'))
app.use('/',express.static('public'))

app.listen(2000, function (a) {
    console.log(`open ${chalk.blue(`http://${addr}:2000`)} to upload pictures`);
});