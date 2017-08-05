var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var reports = require('./routes/reports');
var clients = require('./routes/clients');
var movies = require('./routes/movies');
var orders = require('./routes/orders');
var categories = require('./routes/categories');
var directors = require('./routes/directors');
var app = express();
var Connection= require('tedious').Connection;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var cors= require('cors');
app.use(cors());
var config={
    userName:'tal',
    password:'HilaHila1',
    server:'talhila.database.windows.net',
    requestTimeout:30000,
    options:{encrypt: true, database:'talHila' }
}

app.use('/', index);
app.use('/clients', clients);
app.use('/movies', movies);
app.use('/orders', orders);
app.use('/reports', reports);
app.use('/categories', categories);
app.use('/directors', directors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
