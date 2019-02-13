import * as ts from 'typescript';
import { resolve, dirname } from 'path';
import { writeFileSync } from 'fs';
import { analyze } from './analyzer';

const packagejson = process.argv[2] || '../demo/package.json';
const tsconfig = process.argv[3] || '../demo/tsconfig.json';
const outputPath = process.argv[4] || '../swagger.json';

const main = require(resolve(__dirname, packagejson)).main;

const config = ts.readConfigFile(resolve(__dirname, tsconfig), ts.sys.readFile).config;

const host = ts.createCompilerHost(config);
const program = ts.createProgram([resolve(dirname(resolve(__dirname, packagejson)), main)], {
    options: config
});

const results = analyze(host, program);

writeFileSync(resolve(__dirname, outputPath), JSON.stringify(results));