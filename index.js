'use strict';
let PORT = process.env.PORT || 3000;

require('./src/server').start(PORT);