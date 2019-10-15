'use strict';

//3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Required middleware and modules
const notFound = require('./middleware/404');
const errorHandler = require('./middleware/500');

const app = express();

//Routes
const categoryRouter = require('./routes/categories');
const businessRouter = require('./routes/businesses');
const eventRouter = require('./routes/events');
const subscriptionRouter = require('./routes/subscriptions');


//Run Middlewate
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.use(eventRouter);
app.use(categoryRouter);
app.use(businessRouter);
app.use(subscriptionRouter);
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});


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

