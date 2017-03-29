require('shelljs/global');

var fs = require('fs');
var path = require('path');
var util = require('util');
var cons = require('./const');
var logger = require('./logger');
var fileHelper = require('./fileHelper');

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

    var cmd = util.format("\"%s\" -1 %s", args['ep'] || map['ep'], type);
    cmd += cloneArg(args, map, 'p.alt', 'alt');
    cmd += cloneArg(args, map, 'p.key', 'key');
    cmd += cloneArg(args, map, 'p.iv', 'iv');
    cmd += cloneArg(args, map, 'p.ver', 'ver');
    cmd += cloneArg(args, map, 'p.str', 'str');

    var pathArg = args['path'] || map['path'];
    if (!(pathArg)) {
        cmd += cloneArg(args, map, 'p.file', 'file');
        cmd += cloneArg(args, map, 'p.out', 'out');
    }

    return cmd;
}

var executeCMD = function (cmdStr, callback) {
    counter++;
    logger.encryptLog(util.format("Exec command: '%s'", cmdStr), 1);

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

    logger.encryptLog(util.format("Read parameter config file: '%s'", configFile), 1);
    //logger.encryptLog(util.format(argMap, configFile), 1);
    return argMap;
};

var ignoreList = [];
var getIgnoreListSync = function () {

    for (var i = 0; i < cons.configs.ignoreConfigFiles.length; i++) {

        var configFile = path.join(process.cwd(), cons.configs.ignoreConfigFiles[i]);
        if (fs.existsSync(configFile)) {
            logger.encryptLog(util.format("Read ignore list from config file: '%s'", configFile), 1);

            var lines = fileHelper.readAllLinesSync(configFile);
            for (var j = 0; j < lines.length; j++) {
                if (!fileHelper.isNullLineOrCommentLine(lines[j])) {
                    ignoreList.push(lines[j]);
                }
            }
        }
    }

    logger.encryptLog(util.format("ignore list: '%s'", ignoreList), 1);
};

var isInIgnoreList = function (file) {
    //if (cons.configs.encryptReg.test(file)) {
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

function encrypt(program, callback) {
    var argv = program;
    var argMap = {};
    var configArg = program['config'];
    var cmd = "";

    // read other parameters from config file
    if (configArg) {
        argMap = readParameterListSync(configArg);
    }
    cmd = getEncryptCMD(argv, argMap, '-en');
    getIgnoreListSync();

    var pathArg = argv['path'] || argMap['path'];
    // If process a path
    if (pathArg) {

        var enPath = pathArg;
        if (!path.isAbsolute(pathArg)) {
            if (pathArg === '.') enPath = process.cwd();
            else enPath = path.join(process.cwd(), pathArg);
        }

        logger.encryptLog(util.format("Process path: '%s'", enPath), 1);
        var files = fileHelper.getAllFiles(enPath);
        for (var j = 0; j < files.length; j++) {
            if (!isInIgnoreList(files[j].path)) {
                var cmd1 = cmd;
                cmd1 += ' -file ' + "\"" + files[j].path + "\"";
                cmd1 += ' -out ' + "\"" + files[j].path + cons.configs.en_suffix + "\"";
                executeCMD(cmd1, callback);
            }
        }
    } else {    // process a file or string
        executeCMD(cmd, callback);
    }

    var message = util.format("Totally process:%s files", counter);
    logger.encryptLog(message, 3);
};

function decrypt(program, callback) {
    var argv = program;
    var argMap = {};
    var configArg = program['config'];
    var cmd = "";

    // read other parameters from config file
    if (configArg) {
        argMap = readParameterListSync(configArg);
    }
    cmd = getEncryptCMD(argv, argMap, '-de');
    getIgnoreListSync();

    var pathArg = argv['path'] || argMap['path'];
    // If process a path
    if (pathArg) {

        var enPath = pathArg;
        if (!path.isAbsolute(pathArg)) {
            if (pathArg === '.') enPath = process.cwd();
            else enPath = path.join(process.cwd(), pathArg);
        }

        logger.encryptLog(util.format("Process path: '%s'", enPath), 1);
        var files = fileHelper.getAllFiles(enPath);
        for (var j = 0; j < files.length; j++) {
            if (!isInIgnoreList(files[j].path)) {
                var cmd1 = cmd;
                cmd1 += ' -file ' + "\"" + files[j].path + cons.configs.en_suffix + "\"";
                cmd1 += ' -out ' + "\"" + files[j].path  + "\"";
                executeCMD(cmd1, callback);
            }
        }
    } else {    // process a file or string
        executeCMD(cmd, callback);
    }

    var message = util.format("Totally process:%s files", counter);
    logger.encryptLog(message, 3);
};

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};