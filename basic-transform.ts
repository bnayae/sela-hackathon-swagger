import * as ts from 'typescript';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { analyze } from './analyzer';
const main = require('./package.json').main;

const tsconfig = process.argv[2] || './tsconfig.json';
const outputPath = process.argv[3] || './swagger.json';

const config = ts.readConfigFile(resolve(__dirname, tsconfig), ts.sys.readFile).config;

const program = ts.createProgram([main], {
    options: config
});

const results = analyze(program);

writeFileSync(resolve(__dirname, outputPath), JSON.stringify(results));