const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const paymentsRouter = require('./routes/payments');

const corsOptions = {
  origin: 'https://localhost:3002', // Ensure this matches your React app's URL
  credentials: true,
};

const app = express();

// Security: Use helmet to set secure headers
app.use(helmet());

// Enable CORS with credentials
app.use(cors(corsOptions));

// Set up cookie parser
app.use(cookieParser());

// Logging and parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Route handling
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/payments', paymentsRouter);

// 404 and error handling
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message });
});

// Load SSL credentials
const privateKey = fs.readFileSync('C:/Users/hoque/payments-portal/api/server.key', 'utf8');
const certificate = fs.readFileSync('C:/Users/hoque/payments-portal/api/server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start HTTPS server
const httpsPort = 3001;
https.createServer(credentials, app).listen(httpsPort, () => {
  console.log(`HTTPS Server running on port ${httpsPort}`);
});

module.exports = app;
