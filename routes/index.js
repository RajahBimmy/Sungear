var express = require('express');
var router = express.Router();

const dataTest = require('../public/javascripts/test/dataTest');
const VisGene = require('../public/javascripts/backend/visGeneServer');

/* GET home page. */
router.get('/', function(req, res, next) {
    var args = [ "--version", "-data_dir", "data/" ];
    var visApp = VisGene.main(args);
    res.render('index', { title: 'Sungear'});
});

module.exports = router;