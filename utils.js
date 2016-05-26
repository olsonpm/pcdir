'use strict';


//---------//
// Imports //
//---------//

const wordWrap = require('word-wrap')
  , fp = require('lodash/fp');


//------//
// Init //
//------//

const VIEW_WIDTH = 120
  , isDefined = fp.negate(fp.isUndefined)
  , myWordWrap = fp.curry((opts, str) => wordWrap(str, opts));

//------//
// Main //
//------//

const wrapText = (str, multiLineLeftIndent) => {
  multiLineLeftIndent = (isDefined(multiLineLeftIndent))
    ? multiLineLeftIndent
    : 2;

  const wrapWidth = VIEW_WIDTH - multiLineLeftIndent
    , lines = fp.flow(
        fp.split('\n')
        , fp.map(
          fp.flow(
            myWordWrap({ width: wrapWidth, indent: '', amendOrphan: true })
            , fp.split('\n')
          )
        )
        , fp.flatten
      )(str)
    , firstLine = lines.shift();

  return fp.flow(
    fp.map(fp.flow(
      fp.concat(fp.repeat(multiLineLeftIndent, ' '))
      , fp.join('')
    ))
    , fp.concat(firstLine)
    , fp.join('\n')
  )(lines);
};


//---------//
// Exports //
//---------//

module.exports = {
  wrapText: wrapText
};
