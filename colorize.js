'use strict';


//---------//
// Imports //
//---------//

const chalk = require('chalk')
  , fp = require('lodash/fp')
  , utils = require('./utils');


//------//
// Init //
//------//

const keyColor = chalk.white
  , valColor = chalk.blue
  , braceColor = chalk.yellow
  , bracketColor = chalk.yellow
  , indent = '  '
  , stripKeyQuotes = true
  , nl = '\n'
  , wrapText = utils.wrapText;


//------//
// Main //
//------//

const capIteratee = fp.curry((cap, fn) =>
  fp.curryN(fn.length, (iteratee, ...args) =>
    fn.apply(null, [fp.ary(cap, iteratee)].concat(args))
  )
);

const repeat = fp.curry((b, a) => fp.repeat(a, b));

const wrapStr = (str, wrap) => wrap + str + wrap;

const isDefined = fp.negate(fp.isUndefined)
  , getOpeningBrace = () => braceColor('{')
  , getClosingBrace = () => braceColor('}')
  , getEmptyObject = () => braceColor('{}')
  , getOpeningBracket = () => bracketColor('[')
  , getClosingBracket = () => bracketColor(']')
  , getEmptyArray = () => bracketColor('[]')
  , getIndent = repeat(indent)
  , isLadenArray = fp.allPass(fp.isArray, fp.size)
  , isLadenPlainObject = fp.allPass(fp.isPlainObject, fp.size)
  , reduceWithKey = capIteratee(3, fp.reduce.convert({ cap: false }))
  , keyToStr = key => {
    if (!stripKeyQuotes) key = wrapStr(key, '"');
    return isDefined(key)
      ? key + ': '
      : '';
  }
  , valToStr = (val, level, extra) => {
    val = wrapText('' + val, (level * indent.length) + extra + 1);
    if (fp.isString(val)) {
      val = wrapStr(val, '"');
      extra += 1;
    }
    // if (fp.includes('\n', val)) val = val.replace(new RegExp(nl, 'g'), nl + getIndent(level) + fp.repeat(extra, ' '));
    return valColor(val);
  };

let keyStr;

function colorize(res, level, val, key) {
  if (fp.isArray(val)) {
    if (isLadenArray(val)) {
      res += getIndent(level) + getOpeningBracket() + nl;
      level += 1;
      res += fp.reduce(
        (innerRes, innerVal) => colorize(innerRes, level, innerVal)
        , ''
        , val
      );
      level -= 1;
      res += getIndent(level) + getClosingBracket() + nl;
    } else {
      res += getEmptyArray();
    }
  } else if (fp.isPlainObject(val)) {
    if (isLadenPlainObject(val)) {
      res += getIndent(level) + getOpeningBrace() + nl;
      level += 1;
      res += reduceWithKey(
        (innerRes, innerVal, innerKey) => innerRes + colorize(innerRes, level, innerVal, innerKey)
        , ''
        , val
      );
      level -= 1;
      res += getIndent(level) + getClosingBrace() + nl;
    } else {
      res += getEmptyObject();
    }
  } else if (fp.isFunction(val)) {
    res = keyColor(keyToStr(key)) + valColor(
        '<Function> ' + (fp.allPass([fp.isString, fp.size], val.name))
          ? val.name
          : ''
      );
  } else {
    keyStr = keyToStr(key);
    res = getIndent(level) + keyColor(keyStr) + valToStr(val, level, keyStr.length) + nl;
  }

  return res;
}

const colorizeObj = obj => colorize('', 0, obj);

module.exports = {
  obj: colorizeObj
};
