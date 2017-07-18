'use strict';

let finder = require('fs-finder'),
    _ = require('lodash'),
    routes = [];

function loadRoutesData(routeStorage) {
     let routes = _.flatten(finder.from('src/models').findFiles("route.js").reduce((storage, file)=> {
        storage.push(require(file));
        return storage;
    }, routeStorage));
    // routes.push(require('./common-rest-routes'));
    return routes;
}
/**
 * @exports routes
 */
module.exports = loadRoutesData(routes);