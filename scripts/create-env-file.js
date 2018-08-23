/* 
    This file generates a REACT_APP_BUILD_TIME variable in the .env file at the root of the project
    That variable is used to show the last build time in the UI. Especially handy when working with ServiceWorker cache.//#endregion 
*/

var fs = require('fs');
var path = require('path');
var format = require('date-fns/format');
var file = path.resolve(__dirname, '../.env');

function writeEnvFile(content) {
    var date = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var stream = fs.createWriteStream(file);
    stream.once('open', function(fd) {
        stream.write((content || '') + '\nREACT_APP_BUILD_TIME=' + date);
        stream.end();
    });
}

fs.readFile(file, 'utf8', function(error, contents) {   
    if (error && error.code === 'ENOENT') {
        writeEnvFile();
    } else {
        // Remove the REACT_APP_BUILD_TIME line + any empty remaining line
        var strippedContent = contents.replace(/^.*REACT_APP_BUILD_TIME=.*$/mg, '').replace(/^\s*[\r\n]/gm, '');

        writeEnvFile(strippedContent);
    }
});