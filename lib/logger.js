﻿// logger.js.
// logger
(function () {
    'use strict';

    var path = require('path');
    var fileHelper = require('./fileHelper');
    var cons = require('./const');

    var rootFolder = "logs";
    var defaultLogFileExt = ".log";
    var undefined = "undefined";

    var formatDate = function (date, style) {
        var y = date.getFullYear();
        var M = "0" + (date.getMonth() + 1);
        M = M.substring(M.length - 2);
        var d = "0" + date.getDate();
        d = d.substring(d.length - 2);
        var h = "0" + date.getHours();
        h = h.substring(h.length - 2);
        var m = "0" + date.getMinutes();
        m = m.substring(m.length - 2);
        var s = "0" + date.getSeconds();
        s = s.substring(s.length - 2);

        return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('hh', h).replace('mm', m).replace('ss', s);
    };

    //get time string as UTC
    var getCurrentTime = function () {
        return "[" + new Date().toLocaleString() + "]";
    };

    // logs/2017-03-09
    var getDefaultLogFolder = function () {
        return (rootFolder + "/" + formatDate(new Date(), "yyyy-MM-dd"));
    };
    // 12.log
    var getDefaultLogFileName = function () {
        return formatDate(new Date(), "hh") + defaultLogFileExt;
    };

    var inLogConsole = function (info, useTimePrefix) {
        if (useTimePrefix === false) {
            console.log(info);
        }
        else {
            console.log(getCurrentTime(), info);
        }
    };

    var inLogFile = function (info, fileName, folder, useTimePrefix, isNewLine) {
        var message = info;
        var logFileName = fileName;
        var logFolder = folder;

        if (useTimePrefix === true) {
            message = getCurrentTime() + message;
        }
        if (isNewLine === true) {
            message += cons.symbol.newLine;
        }
        
        if (fileName == null) {
            logFileName = getDefaultLogFileName();
        }
        if (logFolder == null) {
            logFolder = getDefaultLogFolder();
        }
        
        var fullPath = path.join(logFolder, logFileName);

        fileHelper.appendFileSync(fullPath, message);

    };
    //---------------------------------------upper is internal------------------------------------------------
    var logFile = function (info, fileName, folder, useTimePrefix, isNewLine) {
        inLogFile(info, fileName, folder, useTimePrefix, isNewLine);
    };

    var logConsole = function (info, useTimePrefix) {
        inLogConsole(info, useTimePrefix);
    };
    //---------------------------------------upper is common------------------------------------------------
    var encryptLog = function (info, type) {
        if (type == 1) {
            logFile(cons.configs.modelName + info, cons.configs.loggerFile, null, true, true);
        } else if (type === 2) {
            logConsole(cons.configs.modelName + info, true);
        } else {
            logFile(cons.configs.modelName + info, cons.configs.loggerFile, null, true, true);
            logConsole(cons.configs.modelName + info, true);
        }
    }

    module.exports = {
        logFile: logFile,
        logConsole: logConsole,
        // special log funs
        encryptLog: encryptLog
    };

})();



