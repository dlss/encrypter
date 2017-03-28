(function () {
    'use strict';

    exports.configs = {
        encryptListConfigFile: "encryptlist.txt",
        ignoreConfigFile: ".gitignore",
        en_suffix: "_encrypt",
        encryptReg: /.*_encrypt$/,
        nonEncryptReg: "*[^_encrypt]$",
        // log info
        modelName: "[Encrypter] ",
        loggerFile: "encrypter.log"
    }

    exports.symbol = {
        newLine: "\r\n",
    };
})();