var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// var middleware = require('./middleware/parameter');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const feedRouter = require('./routes/feed');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/likes');
const fplistRouter = require('./routes/fplist');
const sharepostRouter = require('./routes/shareposts');
const deleteRouter = require('./routes/delete');
const updateRouter = require('./routes/update');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '15mb', extended: true, parameterLimit: 1000000}))
app.use(bodyParser.urlencoded({limit: '15mb', extended: false, parameterLimit: 1000000}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fanspage-feed', feedRouter);
app.use('/fanspage-comment', commentRouter);
app.use('/fanspage-list', fplistRouter);
app.use('/fanspage-sharepost', sharepostRouter);
app.use('/fanspage-delete', deleteRouter);
app.use('/fanspage-update', updateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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