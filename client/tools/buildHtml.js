import fs from 'fs';
import colors from 'colors';

/*eslint-disable no-console */

var copydir = require('copy-dir');

copydir('./public', './prod', function(err){
  if(err){
    console.log(err);
  } else {
    console.log('HTML and CSS copied'.green); 
  }
});




