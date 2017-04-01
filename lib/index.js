require('shelljs/global');

var fs = require('fs');
var path = require('path');
var util = require('util');
var nodelib = require('dlss_nodelib');
var config = require('./config');
var logger = nodelib.logger;
var fileHelper = nodelib.fileHelper;

var counter = 0;    // processed file counter;

var cloneArg = function (argv, map, key, alias) {
    if (argv[key]) {
        if (alias) {
            return ' -' + alias + ' ' + "\"" + argv[key] + "\"";
        } else {
            return ' -' + key + ' ' + "\"" + argv[key] + "\"";
        }
    } else if (map[key]) {
        if (alias) {
            return ' -' + alias + ' ' + "\"" + map[key] + "\"";
        } else {
            return ' -' + key + ' ' + "\"" + map[key] + "\"";
        }
    }
    return '';
}

var getEncryptCMD = function (args, map, type) {
    var cmd = util.format("\"%s\" -1 -%s", args['ep'] || map['ep'], type);
    cmd += cloneArg(args, map, 'p.alg', 'alg');
    cmd += cloneArg(args, map, 'p.key', 'key');
    cmd += cloneArg(args, map, 'p.iv', 'iv');
    cmd += cloneArg(args, map, 'p.ver', 'ver');
    cmd += ' -encode \"unicode\"';
    return cmd;
}

var executeCMD = function (cmdStr, callback) {
    counter++;
    logger.log(util.format("Exec command: '%s'", cmdStr), 1, config.moduleName);

    exec(cmdStr, function (code, stdout, stderr) {
        callback(stderr)
    });
};

var readParameterListSync = function (configFile) {
    var lines = fileHelper.readAllLinesSync(configFile);

    var argMap = {};
    for (var i = 0; i < lines.length; i++) {
        if (!fileHelper.isNullLineOrCommentLine(lines[i])) {
            var out = /(.*)=(.*)/.exec(lines[i]);
            argMap[out[1]] = out[2];
        }
    }

    logger.log(util.format("Read parameter config file: '%s'", configFile), 1, config.moduleName);
    //logger.log(util.format(argMap, configFile), 1, config.moduleName);
    return argMap;
};

var ignoreList = [];
var getIgnoreListSync = function (ignoreFiles) {

    if (ignoreFiles) {
        var ignoreConfigFiles = ignoreFiles.split(';');
        for (var i = 0; i < ignoreConfigFiles.length; i++) {

            var configFile = ignoreConfigFiles[i];
            if (!path.isAbsolute(configFile)) {
                configFile = path.join(process.cwd(), ignoreConfigFiles[i]);
            }

            if (fs.existsSync(configFile)) {
                logger.log(util.format("Read ignore list from config file: '%s'", configFile), 1, config.moduleName);

                var lines = fileHelper.readAllLinesSync(configFile);
                for (var j = 0; j < lines.length; j++) {
                    if (!fileHelper.isNullLineOrCommentLine(lines[j])) {
                        ignoreList.push(lines[j]);
                    }
                }
            } else {
                logger.log(util.format("Not exsit ignore config file: '%s'", configFile), 1, config.moduleName);
            }
        }
    }

    logger.log(util.format("ignore list: '%s'", ignoreList), 1, config.moduleName);
};

var isInIgnoreList = function (file) {
    //if (config.encryptReg.test(file)) {
    //    return true;
    //}

    for (var i = 0; i < ignoreList.length; i++) {
        var reg = new RegExp(ignoreList[i]);
        if (reg.test(file)) {
            //if (file.search(ignoreList[i]) >= 0) {
            return true;
        }
    }

    return false;
};

function encryptAndDecrypt(program, type, callback) {
    var argv = program;
    var argMap = {};
    var configArg = program['config'];
    var cmd = "";
    // read other parameters from config file
    if (configArg) {
        argMap = readParameterListSync(configArg);
    }
    cmd = getEncryptCMD(argv, argMap, type);

    var pathArg = argv['files'] || argMap['files'];

    getIgnoreListSync(argv['ignore'] || argMap['ignore']);

    var pathList = pathArg.split(';');
    for (var i = 0; i < pathList.length; i++) {

        var enPath = pathList[i];
        if (!path.isAbsolute(enPath)) {
            if (enPath === '.') enPath = process.cwd();
            else enPath = path.join(process.cwd(), enPath);
        }

        logger.log(util.format("Process path: '%s'", enPath), 1, config.moduleName);
        if (fs.existsSync(enPath)) {

            var states = fs.statSync(enPath);
            if (states.isFile()) {
                executeCMD(util.format('%s -file \"%s\" -out \"%s\"', cmd, file, file + config.en_suffix), callback);
            } else {
                fileHelper.getAllFiles(enPath, function (file) {
                    var states = fs.statSync(file);
                    if (states.isFile()) {
                        executeCMD(util.format('%s -file \"%s\" -out \"%s\"', cmd, file, file + config.en_suffix), callback);
                    }

                }, isInIgnoreList);
            }
        } else {
            logger.log(util.format("Not exist '%s'", enPath), 1, config.moduleName);
        }
    }

    var message = util.format("Totally process:%s files", counter);
    logger.log(message, 3, config.moduleName);
};

module.exports = {
    encryptAndDecrypt: encryptAndDecrypt,
};