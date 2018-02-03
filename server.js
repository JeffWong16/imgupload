const express = require('express');
const config = require('./config')
const multer = require('multer');
const md5 = require('md5');
const path = require('path');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const app = express();
const ip = require('ip');
const addr = config.ip||ip.address();
const chalk = require('chalk');
const Sequelize = require('sequelize');
const sequelize = require('./database/start');
const Image = require('./database/image');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        callback(null,  `gdb${Date.now().toString().slice(7,12)}${md5(file.originalname).slice(0,10)}${path.extname(file.originalname)}`);
    }
});

var upload = multer({ storage: Storage }).array('imgfile',40);

app.post("/upload", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.json({
                result:'error'
            });
        }
        Image.create({
          imgUrl: req.files[0].filename,
          baseUrl: config.baseUrl,
        }).then(()=> {
          console.log('已保存');
        })
        return res.json({
            result:'success',
            path:`http://${addr}:2000/images/${req.files[0].filename}`,
            webpPath: `http://${addr}:2000/minnify/images/${req.files[0].filename}`
        });
    });
});

app.use('/minify', (req, res) => {
  sharp(req.originalUrl.replace('/minify', '.'))
    .webp()
    .toBuffer((err, data, info) => {
      if (err) {
        es.json({error: '找不到图片'});
        return;
      }
      res.set({
        'Content-Type': 'image/webp',
        'Content-Length': data.length,
      });
      res.send(data);
    });
});

app.use('/images',express.static('images'))
app.use('/',express.static('public'))

app.listen(2000, function (a) {
    console.log(`open ${chalk.blue(`http://${addr}:2000`)} to upload pictures`);
});
