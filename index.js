#!/usr/bin/env node
'use strict';

//---------//
// Imports //
//---------//

const through2 = require('through2')
  , colorize = require('./colorize');


//------//
// Init //
//------//

const colorizeObj = colorize.obj;


//------//
// Main //
//------//

process.stdin
  .pipe(
    through2((chunk, enc, cb) => {
      try {
        const obj = JSON.parse(chunk.toString());
        cb(null, colorizeObj(obj));
      }
      catch (e) {
        cb(e);
      }
    })
  )
  .pipe(process.stdout);
