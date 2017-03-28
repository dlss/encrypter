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

    var inArg = args['p.in'] || map['p.in'];
    if (!(inArg && inArg.indexOf('encryptlist.txt') >= 0)) {
        cmd += cloneArg(args, map, 'p.in', 'in');
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

var getFileListSync = function (configFile) {
    var files = [];

    var filePaths = fileHelper.readAllLinesSync(configFile);
    for (var i = 0; i < filePaths.length; i++) {
        if (!fileHelper.isNullLineOrCommentLine(filePaths[i])) {

            var stat = fs.lstatSync(filePaths[i]);
            if (stat.isDirectory()) {           // process dir
                if (!isInIgnoreList(filePaths[i])) {
                    fileHelper.readDirFilesSync(filePaths[i], files, true);
                }
            } else {    // process file
                files.push(filePaths[i]);
            }
        }
    }

    logger.encryptLog(util.format("Read file list config file: '%s'", configFile), 1);
    return files;
};

var ignoreConfigLines = fileHelper.readAllLinesSync(path.join(process.cwd(), cons.configs.ignoreConfigFile));
ignoreConfigLines.push('.git/');
ignoreConfigLines.push('.gitignore');


var isInIgnoreList = function (file) {

    if (cons.configs.encryptReg.test(file)) {
        return true;
    }

    if (cons.configs.ignoreConfigFile == '') {
        return false;
    }

    for (var i = 0; i < ignoreConfigLines.length; i++) {
        if (!fileHelper.isNullLineOrCommentLine(ignoreConfigLines[i])) {
            if (ignoreConfigLines[i].indexOf(cons.configs.nonEncryptReg) < 0) {
                if (file.search(ignoreConfigLines[i]) >= 0) {
                    return true;
                }
            }
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

    var fileArg = argv['p.in'] || argMap['p.in'];
    // If need be processed files is configed in 'encryptlist.txt'
    if (fileArg && fileArg.indexOf(cons.configs.encryptListConfigFile) >= 0) {

        var files = getFileListSync(fileArg);
        for (var j = 0; j < files.length; j++) {
            if (!isInIgnoreList(files[j].path)) {
                var cmd1 = cmd;
                cmd1 += ' -in ' + "\"" + files[j].path + "\"";
                cmd1 += ' -out ' + "\"" + files[j].path + cons.configs.en_suffix + "\"";
                executeCMD(cmd1, callback);
            }
        }
    } else {
        if (!fileArg || fileArg == '' || !isInIgnoreList(fileArg)) {
            executeCMD(cmd, callback);
        }
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

    var fileArg = argv['p.in'] || argMap['p.in'];
    // If need be processed files is configed in 'encryptlist.txt'
    if (fileArg && fileArg.indexOf(cons.configs.encryptListConfigFile) >= 0) {
        var files = getFileListSync(fileArg);

        for (var j = 0; j < files.length; j++) {
            if (!isInIgnoreList(files[j].path)) {
                var cmd1 = cmd;
                cmd1 += ' -in ' + "\"" + files[j].path + cons.configs.en_suffix + "\"";
                cmd1 += ' -out ' + "\"" + files[j].path + "\"";
                executeCMD(cmd1, callback);
            }
        }
    } else {
        if (!fileArg || fileArg == '' || !isInIgnoreList(fileArg)) {
            executeCMD(cmd, callback);
        }
    }

    var message = util.format("Totally process:%s files", counter);
    logger.encryptLog(message, 3);
};

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};