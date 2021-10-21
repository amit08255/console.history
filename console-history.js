/**
 * Console History v1.5.1
 * console-history.js
 *
 * Licensed under the MIT License.
 * https://git.io/console
 */

'use strict'

/* Allow only one instance of console-history.js */
if (typeof console.history !== 'undefined') {
  throw new Error('Only one instance of console-history.js can run at a time.')
}

/* Store the original log functions. */
console._log = console.log
console._info = console.info
console._warn = console.warn
console._error = console.error
console._debug = console.debug

/* Declare our console history variable. */
console.history = []

/* Redirect all calls to the collector. */
console.log = function () { return console._intercept('log', arguments) }
console.info = function () { return console._intercept('info', arguments) }
console.warn = function () { return console._intercept('warn', arguments) }
console.error = function () { return console._intercept('error', arguments) }
console.debug = function () { return console._intercept('debug', arguments) }

/* Give the developer the ability to intercept the message before letting
   console-history access it. */
console._intercept = function (type, args) {
  // Your own code can go here, but the preferred method is to override this
  // function in your own script, and add the line below to the end or
  // begin of your own 'console._intercept' function.
  // REMEMBER: Use only underscore console commands inside _intercept!
  console._collect(type, args)
}

/* Define the main log catcher. */
console._collect = function (type, args) {
  // WARNING: When debugging this function, DO NOT call a modified console.log
  // function, all hell will break loose.
  // Instead use the original console._log functions.

  // All the arguments passed to any function, even when not defined
  // inside the function declaration, are stored and locally available in
  // the variable called 'arguments'.
  //
  // The arguments of the original console.log functions are collected above,
  // and passed to this function as a variable 'args', since 'arguments' is
  // reserved for the current function.

  // Collect the timestamp of the console log.
  var time = new Date().toUTCString()

  // Make sure the 'type' parameter is set. If no type is set, we fall
  // back to the default log type.
  if (!type) type = 'log'

  // To ensure we behave like the original console log functions, we do not
  // output anything if no arguments are provided.
  if (!args || args.length === 0) return

  // Act normal, and just pass all original arguments to
  // the origial console function :)
  console['_' + type].apply(console, args)

  // Get stack trace information. By throwing an error, we get access to
  // a stack trace. We then go up in the trace tree and filter out
  // irrelevant information.
  var stack = false
  try { throw Error('') } catch (error) {
    // The lines containing 'console-history.js' are not relevant to us.
    var stackParts = error.stack.split('\n')
    stack = []
    for (var i = 0; i < stackParts.length; i++) {
      if (stackParts[i].indexOf('console-history.js') > -1 ||
      stackParts[i].indexOf('console-history.min.js') > -1 ||
      stackParts[i] === 'Error') {
        continue
      }
      stack.push(stackParts[i].trim())
    }
  }

  if(console.history.length > 2500){
      console.log("\nClearing console.log history");
      console.history = [];
  }

  // Add the log to our history.
  console.history.push({ type: type, timestamp: time, arguments: args, stack: stack })
}

function downloadJSON(objArr) {
    //Convert JSON Array to string.
    let json = JSON.stringify(objArr, null, 4);
    //Convert JSON string to BLOB.
    json = [json];
    let blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

    //Check the Browser.
    let isIE = false || !!document.documentMode;
    if (isIE) {
        window.navigator.msSaveBlob(blob1, "logs.txt");
    } else {
        let url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob1);
        let a = document.createElement("a");
        a.download = "logs.txt";
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

if(window && !window.exportLogs){
    window.exportLogs = function(){
        return console.history;
    }
}

if(window && !window.exportLogsFile){
    window.exportLogsFile = function(){
        downloadJSON(console.history);
    }
}

if(window){
    window.onError = function(message, source, lineno, colno, error) {
        console.error(message, error);
    }

    window.onunhandledrejection = function(event){
        console.error(event.reason);
    }
}
