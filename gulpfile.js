//GLOBAL.serverPort = 8081;
//
//GLOBAL.wwwPath = './www';
//GLOBAL.deployPath = '../../WebAppsNodeService/8080-StaticContent/www/apps/real_estate_slicks/';
//
//var pkg = require('./package.json');
//GLOBAL.banner = '' +
//    '\n/**************************************************************************************' +
//    '\n *' +
//    '\n * \t' + pkg.name + ' - ' + pkg.version +
//    '\n * \tA WebOps Project ' +
//    '\n * \tCreated by: ' + pkg.author +
//    '\n * ' +
//    '\n * \tCompiled On : ' + (new Date()).toUTCString() +
//    '\n * ' +
//    '\n **************************************************************************************/\n\n\n',


    require('require-dir')('./gulp-tasks');