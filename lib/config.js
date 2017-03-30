// config.js.
// Define constant
(function () {
    'use strict';

    module.exports = {
        ignoreConfigFiles: [".gitignore", "encrypt.ignore"],
        en_suffix: "", //"_encrypt",
        encryptReg: /.*_encrypt$/,
        // log info
        moduleName: "encrypter"
    };
})();
