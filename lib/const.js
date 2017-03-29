(function () {
    'use strict';

    exports.configs = {
        ignoreConfigFiles: [".gitignore", "encrypt.ignore"],
        en_suffix: "", //"_encrypt",
        encryptReg: /.*_encrypt$/,
        // log info
        modelName: "[Encrypter] ",
        loggerFile: "encrypter.log"
    }

    exports.symbol = {
        newLine: "\r\n",
    };
})();