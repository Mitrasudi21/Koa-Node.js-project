/* global._ = require('lodash')
global.path = require('path');
global.fs = require('fs');
global.moment = require('moment');*/

/* eslint no-console: 0 */

global.koaApp = {};
global.isProductionMode = false;
koaApp.isClientMode = true;

const port = process.env.PORT || 5000;
const DEVELOPMENT_BASEPATH = `http://localhost:${port}`;
const PRODUCTION_BASEPATH = "https://test.com";


koaApp.appDisplayName = "APP";
koaApp.basePath = isProductionMode?PRODUCTION_BASEPATH:DEVELOPMENT_BASEPATH;
koaApp.serverBasePath = PRODUCTION_BASEPATH;
koaApp.cutOffDateInLong = 1531765800000;
const server = require("./server");

server.listen(port, () => console.log(`API server started on ${port}`));
