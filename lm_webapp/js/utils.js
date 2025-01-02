/*  File:utils.js - lm_webapp
    Various generic library functions
*/

"use strict";

// Ensure lib and utils are defined
var lib = lib || {};
var utils = utils || {};

lib.mFillDataList = function(elInput, itemlist) {
    /*  Make the dropdown list from a list [,,,]
        Takes a text input field and add the dropdown list
        Rev 201125 to remove existing list
    */
    if (elInput.tagName !== "INPUT") {
        debugger; // an error The Containing "INPUT" element was not given as argument.
    }
    if (elInput.itemlist === JSON.stringify(itemlist)) return; // No change
    elInput.itemlist = JSON.stringify(itemlist);

    elInput.autocomplete = 'off'; // Stop remembering old values
    elInput.removeAttribute('list'); // Remove previous list
    var datalist = document.createElement('datalist');
    datalist.id = elInput.id + 'list';
    var oldlist = document.getElementById(datalist.id);
    if (oldlist) oldlist.remove(); // Remove existing list
    itemlist.forEach(function(item) {
        // Create a new <option> element.
        var option = document.createElement('option');
        // Set the value using the item in the JSON array.
        option.value = item;
        // Add the <option> element to the <datalist>.
        datalist.appendChild(option);
    });
    elInput.appendChild(datalist);
    elInput.setAttribute('list', datalist.id);
    elInput.addEventListener('focus', function(){this.select();});  //Autoselect all when focussing
};

// Extension of vector operations
Array.prototype.add = function(b) {
    var a = this,
        c = [];
    if (Array.isArray(b)) {
        if (a.length !== b.length) {
            throw "Array lengths do not match.";
        } else {
            for (var i = 0; i < a.length; i++) {
                c[i] = a[i] + b[i];
            }
        }
    } else if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] + b;
        }
    }
    return c;
};

Array.prototype.div = function(b) {
    var a = this,
        c = [];
    if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] / b;
        }
    }
    return c;
};

Array.prototype.sub = function(b) {
    var a = this,
        c = [];
    if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === undefined) a[i] = 0;
            c[i] = a[i] - b;
        }
    }
    return c;
};

Array.prototype.mean = function() {
    var a = this, sum = 0;
    for (var i = 0; i < a.length; i++) {
        sum += a[i];
    }
    return sum / a.length;
};

Array.prototype.max = function() {
    var a = this;
    var y = a[0];
    for (var i = 0; i < a.length; i++) {
        if (a[i] > y) y = a[i];
    }
    return y;
};

Array.prototype.min = function() {
    var a = this;
    var y = a[0];
    for (var i = 0; i < a.length; i++) {
        if (a[i] < y) y = a[i];
    }
    return y;
};

Array.prototype.mult = function(b) {
    var a = this,
        c = [];
    if (typeof b === 'number') {
        for (var i = 0; i < a.length; i++) {
            c[i] = a[i] * b;
        }
    }
    return c;
};

Number.prototype.norm = function(range) {
    // Normalize to percentage
    var x = this;
    var y = 100 * (x - range[0]) / (range[1] - range[0]);
    return y;
};

Number.prototype.unnorm = function(range) {
    // Unnormalize from percentage
    var x = this;
    var y = range[0] + ((range[1] - range[0]) * x) / 100;
    return Number(y);
};

String.prototype.replaceAll = function(search, replace) {
    // Replace all occurrences of <search> with <replace> in the string
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
};

Object.prototype.size = function() {
    return Object.keys(this).length;
};

utils.mInt2ByteArray = function(num) {
    // Convert a 32-bit integer to 4 bytes
    var result = [
        (num >> 24) & 0xff,
        (num >> 16) & 0xff,
        (num >> 8) & 0xff,
        num & 0xff
    ];
    return result;
};

utils.ByteArray2Long = function(b) {
    var data = ((b[0] << 24)) | (b[1] << 16) | (b[2] << 8) | (b[3]);
    return data;
};

utils.String2Array = function(string) {
    // Split the input string by commas to create an array of substrings
    var arr = string.split(',');

    // Use the map function to convert each substring to a number
    // The Number function handles conversion from string to number, including removing leading zeros
    var numArray = arr.map(Number);

    return numArray;
};

utils.Array2String = function(array) {
    try {
        return array.join(',');
    } catch (error) {
        console.warn('Input is not a valid array or typed array');
        return '';
    }
};

utils.ByteArray2String=function bin2String(array) {
  var result = "";
  for (const char of array) {
    result += String.fromCharCode(char);
  }
  return result;
}
utils.String2ByteArrayg=function String2Bin(str) {
  var a = [];
  for (var i = 0; i < str.length; i++) {
    a.push(str.charCodeAt(i))
  }
  return a;
}

utils.ObjectCopy = function(src, dst) {
    // First level copy of the object
    var l = Object.keys(src);
    for (var i = 0; i < l.length; i++) {
        src[l[i]] = dst[l[i]];
    }
};

utils.GetDataFileName = function(newfile) {
    var datafile = location.hash.replace('#', '').replaceAll('.txt', '');
    if (newfile) {
        datafile = newfile.replaceAll('.txt', '');
    } else {
        if (datafile.length < 3) datafile = 'data';
    }
    datafile = datafile.replaceAll('.txt', '');
    location.hash = datafile;
    return datafile + '.txt';
};

function Timeout(seconds, callername) {
    // Returns true and resets the timer on 'seconds' since last reset
    if (!callername) {
        if (typeof arguments.callee !== 'undefined') {
            callername = window[arguments.callee.caller.name];
        } else {
            callername = window;
        }
    }
    if (typeof callername.tick === 'undefined') {
        callername.tick = performance.now();
    }
    var dt = parseInt((performance.now() - callername.tick) / 1000);
    if (dt > seconds) { // Timeout
        callername.tick = performance.now();
        return true;
    } else {
        return false;
    }
}

function GetSeconds() {
    return (new Date().getTime()) / 1000;
}

utils.Location = function(param, value) {
    /**
     * URL Parameter Manipulation Utility
     *
     * This utility function allows you to get and set search parameters in the URL's query string
     * without triggering a page reload. It works by using the `URLSearchParams` API and the
     * `window.history.replaceState` method.
     *
     * @param {string} param - The name of the parameter to get or set.
     * @param {string} [value] - The new value to set for the parameter. If not provided, the
     *   function will retrieve the current value of the parameter.
     * @returns {string} - The current value of the parameter after the operation.
     *
     * Usage:
     * - To get the value of a parameter: `const value = utils.Location('paramName');`
     * - To set the value of a parameter: `utils.Location('paramName', 'paramValue');`
     *
     * Note: Changes to URL parameters will not trigger a page reload, so use `location.reload`
     * if a full refresh is required.
     */
    var qstr = decodeURIComponent(location.search);
    var hash = decodeURIComponent(window.location.hash);
    var urlParams = new URLSearchParams(qstr);

    if (typeof value !== 'undefined') {
        if (value) {
            urlParams.set(param, value);
        } else {
            urlParams.delete(param);
        }

        var str = '?' + urlParams.toString() + hash; // Preserve hash
        window.history.replaceState(null, '', str);
    } else {
        value = urlParams.get(param);
    }

    return value;
};

utils.persistDetailsState = function() {
    const detailsElements = document.querySelectorAll('details');
    for (let i = 0; i < detailsElements.length; i++) {
        const details = detailsElements[i];
        var storedState = localStorage.getItem("details" + i);
        if (storedState === 'false') details.open = false;
        else if (storedState === 'true') details.open = true;
        details.ontoggle = function() { // This comes AFTER the open event triggered details.open
            const isOpen = details.open;
            localStorage.setItem("details" + i, isOpen);
        };
    }
};

function debounce(func, delay) {
    if (typeof func.timeout !== 'undefined') {
        clearTimeout(func.timeout);
    }
    func.timeout = setTimeout(func, delay);
}

function bytesToStringSimple(byteArray) {
  return String.fromCharCode(...byteArray);
}
function bytesToStringPrintable(byteArray) {
  let result = "";
  for (const byte of byteArray) {
    if (byte < 32 || byte > 126) { // Check for non-printable range (excluding space)
      result += `<${byte}>`;
    } else {
      result += String.fromCharCode(byte);
    }
  }
  
  result = result.replaceAll(/<10>/g, '\n').replaceAll(/<13>/g, '\n');
  
  // Replace Windows-style line endings (CRLF) with single LF
 
  result = result.replace(/\n+/g, '\n');
  
  return result;
}


function jWatchDog(idx, reset) {
  // Initialize static properties  
  if (!jWatchDog.watchDogCounters) {
    jWatchDog.watchDogCounters = [10, 10, 10, 10];
    jWatchDog.WATCHDOG_TIMEOUT = [50, 10, 10, 10];
  }

  if (reset) {
    jWatchDog.watchDogCounters[idx] = jWatchDog.WATCHDOG_TIMEOUT[idx];
    return true;
  } else {
    if (jWatchDog.watchDogCounters[idx] > 0) {
      jWatchDog.watchDogCounters[idx]--;
    }
    return jWatchDog.watchDogCounters[idx] > 0;
  }
}

function isValidCVariableName(str) {
  // Regular expression for C-like variable name validation (allows unions)
  const regex = /^[a-zA-Z_\.][a-zA-Z0-9_\.]*$/;
  
  return regex.test(str);
}

function formatAsBinary(inByte) {
    let s = "B ";
    for (let b = 15; b >= 0; b--) { // Loop for 16-bit byte (assuming inByte is a 16-bit integer)
        s += (inByte & (1 << b)) ? '1' : '0'; // Check if the bit is set using bitwise AND and left shift
        if (b % 4 === 0 && b !== 0) s += "|"; // Add separator after every 4 bits except the last group
    }
    return s;
}
 