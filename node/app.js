const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http')
const models = require('./models');
const app = express();
const config = require('./config/index')

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(bodyParser.json({
    strict: false
}));

app.use(bodyParser.urlencoded({ extended: true }));

// routes definition
app.use('/', require('./routes/stories'));

// catch 404 errors and forward to error Handler
app.use(function(req, res, next) {
    console.log(' in app 404 ------------------------')
    var err = new Error('Not found');
    err.status = 404;
    next(err);
})

// error handler
app.use(function(err, req, res, next,) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    console.log('======error in error handler when next() is called======', err)
    // render the error page
    if (err.type == 'entity.parse.failed') {
        return Promise.reject();
    }
    res.status(err.status || 500);
    // next();
    res.render('error');
});


/**
 * Start the server
 */

var server;
models.sequelize.sync()
  .then(function () {
    server = app.listen(config.SERVER_PORT, () => {
      console.log('App initialized ON db port ' + config.DB_PORT);
      console.log('App initialized and listening on port ' + config.SERVER_PORT);
    });
  })
  .catch((err) => console.error('Error ocurred while starting the server', err));

process.on('SIGINT', function () {
  console.log('Stopping server');
  // process.exit();
  server.close();
});
  
process.on('unhandledRejection', (reason, promise) => {
  console.log('Stopping server');
  // process.exit();
  server.close();
});
