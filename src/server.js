'use strict';

//3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Required middleware and modules
const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

//Routes
const eventRouter = require('./routes/events');
const categoryRouter = require('./routes/categories');
const businessRouter = require('./routes/businesses');
const subscriptionRouter = require('./routes/subscriptions');
const authRouter = require('./routes/auth');

const app = express();

//Swagger
const expressSwagger = require('express-swagger-generator')(app);
const URL = process.env.DEPLOY_URL || 'localhost:3000';


const options = {
  swaggerDefinition: {
    info: {
      description: 'Desc Placeholder',
      title: 'Event Grove',
      version: '1.0.0',
    },
    host: URL,
    basePath: '/',
    produces: [
      'application/json',
      'application/xml',
    ],
    schemes: ['https', 'http'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT Bearer Token',
      },
      BASIC: {
        type: 'basic',
        in: 'header',
        name: 'Authorization',
        description: 'Username and Password in base64',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/**/*.js'], //Path to the API handle folder
};

expressSwagger(options);

//Run Middlewate
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(eventRouter);
app.use(categoryRouter);
app.use(businessRouter);
app.use(subscriptionRouter);
app.use(authRouter);

//Route to populate businesses in db, disabled 
// app.get('/addbiz', require('../docs/mockBiz'));

//Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (PORT) => {
    app.listen(PORT, () => {
      console.log(`🍻 I know that you came to party baby, baby, baby, baby on port ${PORT} 🍻`);
    });
  },
};

