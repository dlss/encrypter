#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var nodelib = require('dlss_nodelib');
var config = require('./../config');
var index = require('./../index');
var logger = nodelib.logger;

var packageJsonPath = null;
try {
    fs.accessSync(path.join(__dirname, '../../package.json'), fs.F_OK);
    packageJsonPath = '../../package.json';
} catch (e) {
    packageJsonPath = '../../../package.json';
}
var packageJson = require(packageJsonPath);

function collect(val, memo) {
    memo.push(val);
    return memo;
}

function callback(error) {
    if (error) {
        logger.log(error.message || error,3,config.moduleName);
        logger.log('Process exited with error code 1.',3,config.moduleName);
        process.exit(1);
    } else {
        logger.log('Process finished successfully.',3,config.moduleName);
        process.exit(0);
    }
}

var cwd = path.resolve('.');
program
    .version(packageJson.version)
    .usage('[command] [options]');

program.command('en')
    .description('Encrypt a file or text')
    .option('--config <file>', 'other parameters config file')
    // require
    .option('--ep <path>', 'Set encrypt tool path')
    .option('--p.alg <alg>', 'Set alg')
    .option('--p.key <key>', 'Set key')
    .option('--p.iv <iv>', 'Set iv')
    .option('--p.encode <encode>', 'Set encode')
    .option('--files <files>', 'encrypt files, split with;').option('--ignore <files>', 'ignore config file list, split with;')
    // option
    .option('--p.ver <digit>', 'Set 0:no info,1:output')
    .action(function (command) {
        index.encryptAndDecrypt(command,'en',callback);
    });

program.command('de')
    .description('Decrypt a file or text')
    .option('--config <file>', 'other parameters config file')
    // require
    .option('--ep <path>', 'Set encrypt tool path')
    .option('--p.alg <alg>', 'Set alg')
    .option('--p.key <key>', 'Set key')
    .option('--p.iv <iv>', 'Set iv')
    .option('--p.encode <encode>', 'Set encode')
    .option('--files <files>', 'encrypt files, split with;').option('--ignore <files>', 'ignore config file list, split with;')
    // option
    .option('--p.ver <digit>', 'Set 0:no info,1:output')
    .action(function (command) {
        index.encryptAndDecrypt(command,'de',callback);
    });


// If the user types an unknown sub-command, just display the help.
var subCmd = process.argv.slice(2, 3)[0];
var cmds = _.map(program.commands, '_name');
cmds = cmds.concat(['--version', '-V']);

if (!_.includes(cmds, subCmd)) {
    program.help();
} else {
    program.parse(process.argv);
}
