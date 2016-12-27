var sourceMap = require('source-map');
var fs = require('fs');



fs.readFile('./sourcemap.js', 'utf8', function (err, data) {
    var smc = new sourceMap.SourceMapConsumer(data);

    console.log(smc.originalPositionFor({
        line: parseInt(process.argv[2]),
        column: parseInt(process.argv[3])
    }));
});
