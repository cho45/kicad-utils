/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 307);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(24)
  , hide      = __webpack_require__(11)
  , redefine  = __webpack_require__(12)
  , ctx       = __webpack_require__(25)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(49)('wks')
  , uid        = __webpack_require__(31)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(1)
  , IE8_DOM_DEFINE = __webpack_require__(87)
  , toPrimitive    = __webpack_require__(21)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(30)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(19);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7)
  , createDesc = __webpack_require__(28);
module.exports = __webpack_require__(6) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , hide      = __webpack_require__(11)
  , has       = __webpack_require__(10)
  , SRC       = __webpack_require__(31)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(24).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(45)
  , defined = __webpack_require__(19);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , defined = __webpack_require__(19)
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(46)
  , createDesc     = __webpack_require__(28)
  , toIObject      = __webpack_require__(14)
  , toPrimitive    = __webpack_require__(21)
  , has            = __webpack_require__(10)
  , IE8_DOM_DEFINE = __webpack_require__(87)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(10)
  , toObject    = __webpack_require__(9)
  , IE_PROTO    = __webpack_require__(62)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(3);

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0)
  , core    = __webpack_require__(24)
  , fails   = __webpack_require__(3);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(25)
  , IObject  = __webpack_require__(45)
  , toObject = __webpack_require__(9)
  , toLength = __webpack_require__(8)
  , asc      = __webpack_require__(209);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(13);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

if(__webpack_require__(6)){
  var LIBRARY             = __webpack_require__(32)
    , global              = __webpack_require__(2)
    , fails               = __webpack_require__(3)
    , $export             = __webpack_require__(0)
    , $typed              = __webpack_require__(58)
    , $buffer             = __webpack_require__(85)
    , ctx                 = __webpack_require__(25)
    , anInstance          = __webpack_require__(38)
    , propertyDesc        = __webpack_require__(28)
    , hide                = __webpack_require__(11)
    , redefineAll         = __webpack_require__(39)
    , toInteger           = __webpack_require__(30)
    , toLength            = __webpack_require__(8)
    , toIndex             = __webpack_require__(34)
    , toPrimitive         = __webpack_require__(21)
    , has                 = __webpack_require__(10)
    , same                = __webpack_require__(93)
    , classof             = __webpack_require__(47)
    , isObject            = __webpack_require__(4)
    , toObject            = __webpack_require__(9)
    , isArrayIter         = __webpack_require__(77)
    , create              = __webpack_require__(35)
    , getPrototypeOf      = __webpack_require__(17)
    , gOPN                = __webpack_require__(36).f
    , getIterFn           = __webpack_require__(79)
    , uid                 = __webpack_require__(31)
    , wks                 = __webpack_require__(5)
    , createArrayMethod   = __webpack_require__(23)
    , createArrayIncludes = __webpack_require__(50)
    , speciesConstructor  = __webpack_require__(82)
    , ArrayIterators      = __webpack_require__(81)
    , Iterators           = __webpack_require__(42)
    , $iterDetect         = __webpack_require__(54)
    , setSpecies          = __webpack_require__(37)
    , arrayFill           = __webpack_require__(80)
    , arrayCopyWithin     = __webpack_require__(102)
    , $DP                 = __webpack_require__(7)
    , $GOPD               = __webpack_require__(16)
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Map     = __webpack_require__(105)
  , $export = __webpack_require__(0)
  , shared  = __webpack_require__(49)('metadata')
  , store   = shared.store || (shared.store = new (__webpack_require__(108)));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(31)('meta')
  , isObject = __webpack_require__(4)
  , has      = __webpack_require__(10)
  , setDesc  = __webpack_require__(7).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(3)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = false;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(89)
  , enumBugKeys = __webpack_require__(63);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(30)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(1)
  , dPs         = __webpack_require__(90)
  , enumBugKeys = __webpack_require__(63)
  , IE_PROTO    = __webpack_require__(62)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(60)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(65).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(89)
  , hiddenKeys = __webpack_require__(63).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(2)
  , dP          = __webpack_require__(7)
  , DESCRIPTORS = __webpack_require__(6)
  , SPECIES     = __webpack_require__(5)('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(12);
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f
  , has = __webpack_require__(10)
  , TAG = __webpack_require__(5)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , defined = __webpack_require__(19)
  , fails   = __webpack_require__(3)
  , spaces  = __webpack_require__(67)
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(11)(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(25)
  , call        = __webpack_require__(100)
  , isArrayIter = __webpack_require__(77)
  , anObject    = __webpack_require__(1)
  , toLength    = __webpack_require__(8)
  , getIterFn   = __webpack_require__(79)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18)
  , TAG = __webpack_require__(5)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * KiCAD internal unit:
 *	length: mil (1/1000 inch)
 *	angles: decidegree (1/10 degrees)
 */
function DECIDEG2RAD(deg) {
    return deg * Math.PI / 1800;
}
exports.DECIDEG2RAD = DECIDEG2RAD;
function RAD2DECIDEG(rad) {
    return rad * 1800 / Math.PI;
}
exports.RAD2DECIDEG = RAD2DECIDEG;
function NORMALIZE_ANGLE_POS(angle) {
    while (angle < 0) {
        angle += 3600;
    }while (angle >= 3600) {
        angle -= 3600;
    }return angle;
}
exports.NORMALIZE_ANGLE_POS = NORMALIZE_ANGLE_POS;
function RotatePoint(p, angle) {
    angle = NORMALIZE_ANGLE_POS(angle);
    if (angle === 0) {
        return p;
    }
    if (angle === 900) {
        var _ref = [p.y, -p.x];
        p.x = _ref[0];
        p.y = _ref[1];
    } else if (angle == 1800) {
        var _ref2 = [-p.x, -p.y];
        p.x = _ref2[0];
        p.y = _ref2[1];
    } else if (angle == 2700) {
        var _ref3 = [-p.y, p.x];
        p.x = _ref3[0];
        p.y = _ref3[1];
    } else {
        var fangle = DECIDEG2RAD(angle);
        var sinus = Math.sin(fangle);
        var cosinus = Math.cos(fangle);
        var rx = p.y * sinus + p.x * cosinus;
        var ry = p.y * cosinus - p.x * sinus;
        p.x = rx;
        p.y = ry;
    }
    return p;
}
exports.RotatePoint = RotatePoint;
function RotatePointWithCenter(p, center, angle) {
    var t = {
        x: p.x - center.x,
        y: p.y - center.y
    };
    RotatePoint(t, angle);
    p.x = t.x + center.x;
    p.y = t.y + center.y;
    return p;
}
exports.RotatePointWithCenter = RotatePointWithCenter;
function MM2MIL(mm) {
    return mm / 0.0254;
}
exports.MM2MIL = MM2MIL;
function MIL2MM(mil) {
    return mil * 0.0254;
}
exports.MIL2MM = MIL2MM;
function ReadDelimitedText(s) {
    var match = s.match(/"((?:\\"|[^"])+)"/);
    if (!match) return "";
    var inner = match[1];
    return inner.replace(/\\([\\"])/g, function (_, c) {
        return c;
    });
}
exports.ReadDelimitedText = ReadDelimitedText;

var Transform = function () {
    function Transform() {
        var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var x2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var y2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
        var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

        _classCallCheck(this, Transform);

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.tx = tx;
        this.ty = ty;
    }
    // default in KiCAD


    _createClass(Transform, [{
        key: "clone",
        value: function clone() {
            return new Transform(this.x1, this.x2, this.y1, this.y2, this.tx, this.ty);
        }
    }, {
        key: "translate",
        value: function translate(tx, ty) {
            return Transform.translate(tx, ty).multiply(this);
        }
    }, {
        key: "scale",
        value: function scale(sx, sy) {
            return Transform.scale(sx, sy).multiply(this);
        }
    }, {
        key: "rotate",
        value: function rotate(radian) {
            return Transform.rotate(radian).multiply(this);
        }
    }, {
        key: "multiply",
        value: function multiply(b) {
            var a = this;
            return new Transform(a.x1 * b.x1 + a.x2 * b.y1, a.x1 * b.x2 + a.x2 * b.y2, a.y1 * b.x1 + a.y2 * b.y1, a.y1 * b.x2 + a.y2 * b.y2, a.tx * b.x1 + a.ty * b.y1 + b.tx, a.tx * b.x2 + a.ty * b.y2 + b.ty);
        }
    }, {
        key: "transformCoordinate",
        value: function transformCoordinate(p) {
            var x = this.x1 * p.x + this.y1 * p.y + this.tx;
            var y = this.x2 * p.x + this.y2 * p.y + this.ty;
            return new Point(x, y);
        }
    }, {
        key: "mapAngles",
        value: function mapAngles(angle1, angle2) {
            var angle = void 0,
                delta = void 0;
            var x = void 0,
                y = void 0,
                t = void 0;
            var swap = 0;
            delta = angle2 - angle1;
            if (delta >= 1800) {
                angle1 -= 1;
                angle2 += 1;
            }
            x = Math.cos(DECIDEG2RAD(angle1));
            y = Math.sin(DECIDEG2RAD(angle1));
            t = x * this.x1 + y * this.y1;
            y = x * this.x2 + y * this.y2;
            x = t;
            angle1 = Math.round(RAD2DECIDEG(Math.atan2(y, x)));
            x = Math.cos(DECIDEG2RAD(angle2));
            y = Math.sin(DECIDEG2RAD(angle2));
            t = x * this.x1 + y * this.y1;
            y = x * this.x2 + y * this.y2;
            x = t;
            angle2 = Math.round(RAD2DECIDEG(Math.atan2(y, x)));
            angle1 = NORMALIZE_ANGLE_POS(angle1);
            angle2 = NORMALIZE_ANGLE_POS(angle2);
            if (angle2 < angle1) angle2 += 3600;
            if (angle2 - angle1 > 1800) {
                angle = angle1;
                angle1 = angle2;
                angle2 = angle;
                angle1 = NORMALIZE_ANGLE_POS(angle1);
                angle2 = NORMALIZE_ANGLE_POS(angle2);
                if (angle2 < angle1) angle2 += 3600;
                swap = 1;
            }
            if (delta >= 1800) {
                angle1 += 1;
                angle2 -= 1;
            }
            return [angle1, angle2, swap];
        }
    }], [{
        key: "default",
        value: function _default() {
            return new Transform(1, 0, 0, -1, 0, 0);
        }
    }, {
        key: "identify",
        value: function identify() {
            return new Transform(1, 0, 0, 1, 0, 0);
        }
    }, {
        key: "translate",
        value: function translate(tx, ty) {
            return new Transform(1, 0, 0, 1, tx, ty);
        }
    }, {
        key: "scale",
        value: function scale(sx, sy) {
            return new Transform(sx, 0, 0, sy, 0, 0);
        }
    }, {
        key: "rotate",
        value: function rotate(radian) {
            var s = Math.sin(radian);
            var c = Math.cos(radian);
            return new Transform(c, s, -s, c, 0, 0);
        }
    }]);

    return Transform;
}();

exports.Transform = Transform;

var Point = function () {
    function Point() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        _classCallCheck(this, Point);

        this.x = x;
        this.y = y;
    }

    _createClass(Point, null, [{
        key: "add",
        value: function add(p1, p2) {
            return {
                x: p1.x + p2.x,
                y: p1.y + p2.y
            };
        }
    }, {
        key: "sub",
        value: function sub(p1, p2) {
            return {
                x: p1.x - p2.x,
                y: p1.y - p2.y
            };
        }
    }, {
        key: "isZero",
        value: function isZero(p) {
            return p.x === 0 && p.y === 0;
        }
    }]);

    return Point;
}();

exports.Point = Point;

var Rect = function () {
    function Rect(pos1x, pos1y, pos2x, pos2y) {
        _classCallCheck(this, Rect);

        this.pos1 = new Point(pos1x, pos1y);
        this.pos2 = new Point(pos2x, pos2y);
    }

    _createClass(Rect, [{
        key: "getWidth",
        value: function getWidth() {
            return this.pos2.x - this.pos1.x;
        }
    }, {
        key: "getHeight",
        value: function getHeight() {
            return this.pos2.y - this.pos1.y;
        }
    }, {
        key: "normalize",
        value: function normalize() {
            var _ref4 = [Math.min(this.pos1.x, this.pos2.x), Math.min(this.pos1.y, this.pos2.y), Math.max(this.pos1.x, this.pos2.x), Math.max(this.pos1.y, this.pos2.y)];
            this.pos1.x = _ref4[0];
            this.pos1.y = _ref4[1];
            this.pos2.x = _ref4[2];
            this.pos2.y = _ref4[3];

            return this;
        }
    }, {
        key: "merge",
        value: function merge(o) {
            return new Rect(Math.min(this.pos1.x, o.pos1.x, this.pos2.x, o.pos2.x), Math.min(this.pos1.y, o.pos1.y, this.pos2.y, o.pos2.y), Math.max(this.pos1.x, o.pos1.x, this.pos2.x, o.pos2.x), Math.max(this.pos1.y, o.pos1.y, this.pos2.y, o.pos2.y));
        }
    }, {
        key: "inflate",
        value: function inflate(n) {
            this.pos1.x -= n;
            this.pos1.y -= n;
            this.pos2.x += n;
            this.pos2.y += n;
            return this;
        }
    }, {
        key: "width",
        get: function get() {
            return this.getWidth();
        }
    }, {
        key: "height",
        get: function get() {
            return this.getHeight();
        }
    }]);

    return Rect;
}();

exports.Rect = Rect;

var Color = function () {
    // max 255 int
    function Color(r, g, b) {
        _classCallCheck(this, Color);

        this.r = r;
        this.g = g;
        this.b = b;
    }

    _createClass(Color, [{
        key: "toCSSColor",
        value: function toCSSColor() {
            return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        }
    }]);

    return Color;
}();
// common/colors.cpp 


Color.BLACK = new Color(0, 0, 0);
Color.DARKDARKGRAY = new Color(72, 72, 72);
Color.DARKGRAY = new Color(132, 132, 132);
Color.LIGHTGRAY = new Color(194, 194, 194);
Color.WHITE = new Color(255, 255, 255);
Color.LIGHTYELLOW = new Color(255, 255, 194);
Color.DARKBLUE = new Color(0, 0, 72);
Color.DARKGREEN = new Color(0, 72, 0);
Color.DARKCYAN = new Color(0, 72, 72);
Color.DARKRED = new Color(72, 0, 0);
Color.DARKMAGENTA = new Color(72, 0, 72);
Color.DARKBROWN = new Color(72, 72, 0);
Color.BLUE = new Color(0, 0, 132);
Color.GREEN = new Color(0, 132, 0);
Color.CYAN = new Color(0, 132, 132);
Color.RED = new Color(132, 0, 0);
Color.MAGENTA = new Color(132, 0, 132);
Color.BROWN = new Color(132, 132, 0);
Color.LIGHTBLUE = new Color(0, 0, 194);
Color.LIGHTGREEN = new Color(0, 194, 0);
Color.LIGHTCYAN = new Color(0, 194, 194);
Color.LIGHTRED = new Color(194, 0, 0);
Color.LIGHTMAGENTA = new Color(194, 0, 194);
Color.YELLOW = new Color(194, 194, 0);
Color.PUREBLUE = new Color(0, 0, 255);
Color.PUREGREEN = new Color(0, 255, 0);
Color.PURECYAN = new Color(0, 255, 255);
Color.PURERED = new Color(255, 0, 0);
Color.PUREMAGENTA = new Color(255, 0, 255);
Color.PUREYELLOW = new Color(255, 255, 0);
exports.Color = Color;

var ColorDefinition = function (_Color) {
    _inherits(ColorDefinition, _Color);

    function ColorDefinition(c, name, light) {
        _classCallCheck(this, ColorDefinition);

        var _this = _possibleConstructorReturn(this, (ColorDefinition.__proto__ || Object.getPrototypeOf(ColorDefinition)).call(this, c.r, c.g, c.b));

        _this.name = name;
        _this.light = light;
        return _this;
    }

    return ColorDefinition;
}(Color);

ColorDefinition.BLACK = new ColorDefinition(Color.BLACK, "Black", Color.DARKDARKGRAY);
ColorDefinition.DARKDARKGRAY = new ColorDefinition(Color.DARKDARKGRAY, "Gray 1", Color.DARKGRAY);
ColorDefinition.DARKGRAY = new ColorDefinition(Color.DARKGRAY, "Gray 2", Color.LIGHTGRAY);
ColorDefinition.LIGHTGRAY = new ColorDefinition(Color.LIGHTGRAY, "Gray 3", Color.WHITE);
ColorDefinition.WHITE = new ColorDefinition(Color.WHITE, "White", Color.WHITE);
ColorDefinition.LIGHTYELLOW = new ColorDefinition(Color.LIGHTYELLOW, "L.Yellow", Color.WHITE);
ColorDefinition.DARKBLUE = new ColorDefinition(Color.DARKBLUE, "Blue 1", Color.BLUE);
ColorDefinition.DARKGREEN = new ColorDefinition(Color.DARKGREEN, "Green 1", Color.GREEN);
ColorDefinition.DARKCYAN = new ColorDefinition(Color.DARKCYAN, "Cyan 1", Color.CYAN);
ColorDefinition.DARKRED = new ColorDefinition(Color.DARKRED, "Red 1", Color.RED);
ColorDefinition.DARKMAGENTA = new ColorDefinition(Color.DARKMAGENTA, "Magenta 1", Color.MAGENTA);
ColorDefinition.DARKBROWN = new ColorDefinition(Color.DARKBROWN, "Brown 1", Color.BROWN);
ColorDefinition.BLUE = new ColorDefinition(Color.BLUE, "Blue 2", Color.LIGHTBLUE);
ColorDefinition.GREEN = new ColorDefinition(Color.GREEN, "Green 2", Color.LIGHTGREEN);
ColorDefinition.CYAN = new ColorDefinition(Color.CYAN, "Cyan 2", Color.LIGHTCYAN);
ColorDefinition.RED = new ColorDefinition(Color.RED, "Red 2", Color.LIGHTRED);
ColorDefinition.MAGENTA = new ColorDefinition(Color.MAGENTA, "Magenta 2", Color.LIGHTMAGENTA);
ColorDefinition.BROWN = new ColorDefinition(Color.BROWN, "Brown 2", Color.YELLOW);
ColorDefinition.LIGHTBLUE = new ColorDefinition(Color.LIGHTBLUE, "Blue 3", Color.PUREBLUE);
ColorDefinition.LIGHTGREEN = new ColorDefinition(Color.LIGHTGREEN, "Green 3", Color.PUREGREEN);
ColorDefinition.LIGHTCYAN = new ColorDefinition(Color.LIGHTCYAN, "Cyan 3", Color.PURECYAN);
ColorDefinition.LIGHTRED = new ColorDefinition(Color.LIGHTRED, "Red 3", Color.PURERED);
ColorDefinition.LIGHTMAGENTA = new ColorDefinition(Color.LIGHTMAGENTA, "Magenta 3", Color.PUREMAGENTA);
ColorDefinition.YELLOW = new ColorDefinition(Color.YELLOW, "Yellow 3", Color.PUREYELLOW);
ColorDefinition.PUREBLUE = new ColorDefinition(Color.PUREBLUE, "Blue 4", Color.WHITE);
ColorDefinition.PUREGREEN = new ColorDefinition(Color.PUREGREEN, "Green 4", Color.WHITE);
ColorDefinition.PURECYAN = new ColorDefinition(Color.PURECYAN, "Cyan 4", Color.WHITE);
ColorDefinition.PURERED = new ColorDefinition(Color.PURERED, "Red 4", Color.WHITE);
ColorDefinition.PUREMAGENTA = new ColorDefinition(Color.PUREMAGENTA, "Magenta 4", Color.WHITE);
ColorDefinition.PUREYELLOW = new ColorDefinition(Color.PUREYELLOW, "Yellow 4", Color.WHITE);
exports.ColorDefinition = ColorDefinition;
var Fill;
(function (Fill) {
    Fill["NO_FILL"] = "N";
    Fill["FILLED_SHAPE"] = "F";
    Fill["FILLED_WITH_BG_BODYCOLOR"] = "f";
})(Fill = exports.Fill || (exports.Fill = {}));
var TextHjustify;
(function (TextHjustify) {
    TextHjustify["LEFT"] = "L";
    TextHjustify["CENTER"] = "C";
    TextHjustify["RIGHT"] = "R";
})(TextHjustify = exports.TextHjustify || (exports.TextHjustify = {}));
var TextVjustify;
(function (TextVjustify) {
    TextVjustify["TOP"] = "T";
    TextVjustify["CENTER"] = "C";
    TextVjustify["BOTTOM"] = "B";
})(TextVjustify = exports.TextVjustify || (exports.TextVjustify = {}));
var PinOrientation;
(function (PinOrientation) {
    PinOrientation["RIGHT"] = "R";
    PinOrientation["LEFT"] = "L";
    PinOrientation["UP"] = "U";
    PinOrientation["DOWN"] = "D";
})(PinOrientation = exports.PinOrientation || (exports.PinOrientation = {}));
var TextAngle;
(function (TextAngle) {
    TextAngle[TextAngle["HORIZ"] = 0] = "HORIZ";
    TextAngle[TextAngle["VERT"] = 900] = "VERT";
})(TextAngle = exports.TextAngle || (exports.TextAngle = {}));
var PinType;
(function (PinType) {
    PinType["INPUT"] = "I";
    PinType["OUTPUT"] = "O";
    PinType["BIDI"] = "B";
    PinType["TRISTATE"] = "T";
    PinType["PASSIVE"] = "P";
    PinType["UNSPECIFIED"] = "U";
    PinType["POWER_IN"] = "W";
    PinType["POWER_OUT"] = "w";
    PinType["OPENCOLLECTOR"] = "C";
    PinType["OPENEMITTER"] = "E";
    PinType["NC"] = "N";
})(PinType = exports.PinType || (exports.PinType = {}));
;
var PinAttribute;
(function (PinAttribute) {
    PinAttribute["NONE"] = "~";
    PinAttribute["INVERTED"] = "I";
    PinAttribute["CLOCK"] = "C";
    PinAttribute["LOWLEVEL_IN"] = "L";
    PinAttribute["LOWLEVEL_OUT"] = "V";
    PinAttribute["FALLING_EDGE"] = "F";
    PinAttribute["NONLOGIC"] = "X";
    PinAttribute["INVISIBLE"] = "N";
})(PinAttribute = exports.PinAttribute || (exports.PinAttribute = {}));
var SheetSide;
(function (SheetSide) {
    SheetSide["RIGHT"] = "R";
    SheetSide["TOP"] = "T";
    SheetSide["BOTTOM"] = "B";
    SheetSide["LEFT"] = "L";
})(SheetSide = exports.SheetSide || (exports.SheetSide = {}));
var Net;
(function (Net) {
    Net["INPUT"] = "I";
    Net["OUTPUT"] = "O";
    Net["BIDI"] = "B";
    Net["TRISTATE"] = "T";
    Net["UNSPECIFIED"] = "U";
})(Net = exports.Net || (exports.Net = {}));

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(14)
  , toLength  = __webpack_require__(8)
  , toIndex   = __webpack_require__(34);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 52 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4)
  , cof      = __webpack_require__(18)
  , MATCH    = __webpack_require__(5)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(5)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide     = __webpack_require__(11)
  , redefine = __webpack_require__(12)
  , fails    = __webpack_require__(3)
  , defined  = __webpack_require__(19)
  , wks      = __webpack_require__(5);

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(2)
  , $export           = __webpack_require__(0)
  , redefine          = __webpack_require__(12)
  , redefineAll       = __webpack_require__(39)
  , meta              = __webpack_require__(29)
  , forOf             = __webpack_require__(44)
  , anInstance        = __webpack_require__(38)
  , isObject          = __webpack_require__(4)
  , fails             = __webpack_require__(3)
  , $iterDetect       = __webpack_require__(54)
  , setToStringTag    = __webpack_require__(40)
  , inheritIfRequired = __webpack_require__(68);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , hide   = __webpack_require__(11)
  , uid    = __webpack_require__(31)
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(32)|| !__webpack_require__(3)(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete __webpack_require__(2)[K];
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(24)
  , LIBRARY        = __webpack_require__(32)
  , wksExt         = __webpack_require__(88)
  , defineProperty = __webpack_require__(7).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(49)('keys')
  , uid    = __webpack_require__(31);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(18);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4)
  , anObject = __webpack_require__(1);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(25)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isObject       = __webpack_require__(4)
  , setPrototypeOf = __webpack_require__(66).set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(30)
  , defined   = __webpack_require__(19);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ }),
/* 71 */
/***/ (function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(30)
  , defined   = __webpack_require__(19);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(32)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(12)
  , hide           = __webpack_require__(11)
  , has            = __webpack_require__(10)
  , Iterators      = __webpack_require__(42)
  , $iterCreate    = __webpack_require__(74)
  , setToStringTag = __webpack_require__(40)
  , getPrototypeOf = __webpack_require__(17)
  , ITERATOR       = __webpack_require__(5)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(35)
  , descriptor     = __webpack_require__(28)
  , setToStringTag = __webpack_require__(40)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(11)(IteratorPrototype, __webpack_require__(5)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(53)
  , defined  = __webpack_require__(19);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(42)
  , ITERATOR   = __webpack_require__(5)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(7)
  , createDesc      = __webpack_require__(28);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(47)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(42);
module.exports = __webpack_require__(24).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(34)
  , toLength = __webpack_require__(8);
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(43)
  , step             = __webpack_require__(103)
  , Iterators        = __webpack_require__(42)
  , toIObject        = __webpack_require__(14);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(73)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(1)
  , aFunction = __webpack_require__(13)
  , SPECIES   = __webpack_require__(5)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(25)
  , invoke             = __webpack_require__(52)
  , html               = __webpack_require__(65)
  , cel                = __webpack_require__(60)
  , global             = __webpack_require__(2)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(18)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , macrotask = __webpack_require__(83).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(18)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(2)
  , DESCRIPTORS    = __webpack_require__(6)
  , LIBRARY        = __webpack_require__(32)
  , $typed         = __webpack_require__(58)
  , hide           = __webpack_require__(11)
  , redefineAll    = __webpack_require__(39)
  , fails          = __webpack_require__(3)
  , anInstance     = __webpack_require__(38)
  , toInteger      = __webpack_require__(30)
  , toLength       = __webpack_require__(8)
  , gOPN           = __webpack_require__(36).f
  , dP             = __webpack_require__(7).f
  , arrayFill      = __webpack_require__(80)
  , setToStringTag = __webpack_require__(40)
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ }),
/* 86 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(3)(function(){
  return Object.defineProperty(__webpack_require__(60)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(10)
  , toIObject    = __webpack_require__(14)
  , arrayIndexOf = __webpack_require__(50)(false)
  , IE_PROTO     = __webpack_require__(62)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(7)
  , anObject = __webpack_require__(1)
  , getKeys  = __webpack_require__(33);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(14)
  , gOPN      = __webpack_require__(36).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(33)
  , gOPS     = __webpack_require__(51)
  , pIE      = __webpack_require__(46)
  , toObject = __webpack_require__(9)
  , IObject  = __webpack_require__(45)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 93 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction  = __webpack_require__(13)
  , isObject   = __webpack_require__(4)
  , invoke     = __webpack_require__(52)
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt
  , $trim     = __webpack_require__(41).trim
  , ws        = __webpack_require__(67)
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat
  , $trim       = __webpack_require__(41).trim;

module.exports = 1 / $parseFloat(__webpack_require__(67) + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(18);
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ }),
/* 99 */
/***/ (function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(13)
  , toObject  = __webpack_require__(9)
  , IObject   = __webpack_require__(45)
  , toLength  = __webpack_require__(8);

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(34)
  , toLength = __webpack_require__(8);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if(__webpack_require__(6) && /./g.flags != 'g')__webpack_require__(7).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(55)
});

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(106);

// 23.1 Map Objects
module.exports = __webpack_require__(57)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(7).f
  , create      = __webpack_require__(35)
  , redefineAll = __webpack_require__(39)
  , ctx         = __webpack_require__(25)
  , anInstance  = __webpack_require__(38)
  , defined     = __webpack_require__(19)
  , forOf       = __webpack_require__(44)
  , $iterDefine = __webpack_require__(73)
  , step        = __webpack_require__(103)
  , setSpecies  = __webpack_require__(37)
  , DESCRIPTORS = __webpack_require__(6)
  , fastKey     = __webpack_require__(29).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(106);

// 23.2 Set Objects
module.exports = __webpack_require__(57)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var each         = __webpack_require__(23)(0)
  , redefine     = __webpack_require__(12)
  , meta         = __webpack_require__(29)
  , assign       = __webpack_require__(92)
  , weak         = __webpack_require__(109)
  , isObject     = __webpack_require__(4)
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(57)('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefineAll       = __webpack_require__(39)
  , getWeak           = __webpack_require__(29).getWeak
  , anObject          = __webpack_require__(1)
  , isObject          = __webpack_require__(4)
  , anInstance        = __webpack_require__(38)
  , forOf             = __webpack_require__(44)
  , createArrayMethod = __webpack_require__(23)
  , $has              = __webpack_require__(10)
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN     = __webpack_require__(36)
  , gOPS     = __webpack_require__(51)
  , anObject = __webpack_require__(1)
  , Reflect  = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(8)
  , repeat   = __webpack_require__(69)
  , defined  = __webpack_require__(19);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(33)
  , toIObject = __webpack_require__(14)
  , isEnum    = __webpack_require__(46).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(47)
  , from    = __webpack_require__(114);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(44);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * imported from:
 * eeschema/lib_text.cpp
 * eeschema/lib_rectangle.cpp
 * eeschema/lib_polyline.cpp
 * eeschema/lib_pin.cpp
 * eeschema/lib_field.cpp
 * eeschema/lib_draw_item.cpp
 * eeschema/lib_circle.cpp
 * eeschema/lib_arc.cpp
 */
var kicad_common_1 = __webpack_require__(48);

var Library = function () {
    _createClass(Library, null, [{
        key: "load",
        value: function load(content) {
            var lines = content.split(/\n/);
            var lib = new this();
            lib.parse(lines);
            return lib;
        }
    }]);

    function Library() {
        _classCallCheck(this, Library);

        this.components = [];
    }

    _createClass(Library, [{
        key: "parse",
        value: function parse(lines) {
            var version = lines.shift();
            var LIBRARY_HEADER = "EESchema-LIBRARY Version ";
            var SUPPORTED_VERSION = 2.3;
            if (!version || version.indexOf(LIBRARY_HEADER) !== 0) {
                throw "unknwon library format";
            }
            this.version = Number(version.slice(LIBRARY_HEADER.length));
            if (this.version > SUPPORTED_VERSION) {
                throw "library format version is greater than supported version: " + this.version + '>' + SUPPORTED_VERSION;
            }
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line[0] === '#') continue;
                if (line === "") continue;
                var tokens = line.split(/ +/);
                if (tokens[0] === 'DEF') {
                    this.components.push(new LibComponent(tokens.slice(1)).parse(lines));
                } else {
                    throw 'unknown token ' + tokens[0];
                }
            }
        }
    }, {
        key: "findByName",
        value: function findByName(name) {
            var ret = this.components.find(function (i) {
                return i.name === name;
            });
            if (!ret) {
                return null;
            }
            return ret;
        }
    }]);

    return Library;
}();

exports.Library = Library;

var LibComponent = function () {
    function LibComponent(params) {
        _classCallCheck(this, LibComponent);

        this.name = params[0];
        this.reference = params[1];
        this.textOffset = Number(params[3]);
        this.drawPinnumber = params[4] === 'Y';
        this.drawPinname = params[5] === 'Y';
        this.unitCount = Number(params[6]);
        this.unitsLocked = params[7] === 'Y';
        this.optionFlag = params[8];
        this.fields = [];
    }

    _createClass(LibComponent, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line === 'ENDDEF') break;
                var tokens = line.split(/ +/);
                if (tokens[0] === 'DRAW') {
                    this.draw = new Draw().parse(lines);
                } else if (tokens[0] === 'ALIAS') {
                    this.aliases = tokens.slice(1);
                } else if (tokens[0] === 'F0') {
                    this.field = new Field0(tokens.slice(1));
                } else if (tokens[0].match(/^F\d+/)) {
                    this.fields.push(new FieldN(tokens.slice(1)));
                } else if (tokens[0] === '$FPLIST') {
                    this.fplist = [];
                    while ((line = lines.shift()) !== undefined) {
                        if (line === '$ENDFPLIST') break;
                        this.fplist.push(tokens[0]);
                    }
                } else {
                    throw 'unknown token ' + tokens[0];
                }
            }
            if (this.name[0] === "~") {
                this.name = this.name.slice(1);
                this.field.visibility = false;
            }
            return this;
        }
    }]);

    return LibComponent;
}();

exports.LibComponent = LibComponent;

var Field0 = function Field0(params) {
    _classCallCheck(this, Field0);

    this.reference = kicad_common_1.ReadDelimitedText(params[0]);
    this.posx = Number(params[1]);
    this.posy = Number(params[2]);
    this.textSize = Number(params[3]);
    this.textOrientation = params[4] === 'H' ? kicad_common_1.TextAngle.HORIZ : kicad_common_1.TextAngle.VERT;
    this.visibility = params[5] === 'V';
    this.hjustify = params[6];
    this.vjustify = params[7][0];
    this.italic = params[7][1] === "I";
    this.bold = params[7][2] === "B";
};

exports.Field0 = Field0;

var FieldN = function FieldN(params) {
    _classCallCheck(this, FieldN);

    this.name = kicad_common_1.ReadDelimitedText(params[0]);
    if (this.name === "~") this.name = "";
    this.posx = Number(params[1]);
    this.posy = Number(params[2]);
    this.textSize = Number(params[3]);
    this.textOrientation = params[4] === 'H' ? kicad_common_1.TextAngle.HORIZ : kicad_common_1.TextAngle.VERT;
    this.visibility = params[5] === 'V';
    this.hjustify = params[6];
    this.vjustify = params[7][0];
    this.italic = params[7][1] === "I";
    this.bold = params[7][2] === "B";
    this.fieldname = params[8];
};

exports.FieldN = FieldN;

var Draw = function () {
    function Draw() {
        _classCallCheck(this, Draw);

        this.objects = [];
    }

    _createClass(Draw, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line === 'ENDDRAW') break;
                var tokens = line.split(/ +/);
                if (tokens[0] === 'A') {
                    this.objects.push(new DrawArc(tokens.slice(1)));
                } else if (tokens[0] === 'C') {
                    this.objects.push(new DrawCircle(tokens.slice(1)));
                } else if (tokens[0] === 'P') {
                    this.objects.push(new DrawPolyline(tokens.slice(1)));
                } else if (tokens[0] === 'S') {
                    this.objects.push(new DrawSquare(tokens.slice(1)));
                } else if (tokens[0] === 'T') {
                    this.objects.push(new DrawText(tokens.slice(1)));
                } else if (tokens[0] === 'X') {
                    this.objects.push(new DrawPin(tokens.slice(1)));
                } else {
                    throw "unknown token " + tokens[0];
                }
            }
            return this;
        }
    }, {
        key: "getBoundingRect",
        value: function getBoundingRect() {
            var rect = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var o = _step.value;

                    var box = o.getBoundingBox();
                    if (!rect) {
                        rect = box;
                    } else {
                        rect = rect.merge(box);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return rect;
        }
    }]);

    return Draw;
}();

exports.Draw = Draw;

var DrawObject = function DrawObject() {
    _classCallCheck(this, DrawObject);
};

var DrawArc = function (_DrawObject) {
    _inherits(DrawArc, _DrawObject);

    function DrawArc(params) {
        _classCallCheck(this, DrawArc);

        var _this = _possibleConstructorReturn(this, (DrawArc.__proto__ || Object.getPrototypeOf(DrawArc)).call(this));

        _this.posx = Number(params[0]);
        _this.posy = Number(params[1]);
        _this.radius = Number(params[2]);
        _this.startAngle = Number(params[3]);
        _this.endAngle = Number(params[4]);
        _this.unit = Number(params[5]);
        _this.convert = Number(params[6]);
        _this.lineWidth = Number(params[7]);
        _this.fill = params[8] || kicad_common_1.Fill.NO_FILL;
        _this.startx = Number(params[9]);
        _this.starty = Number(params[10]);
        _this.endx = Number(params[11]);
        _this.endy = Number(params[12]);
        return _this;
    }

    _createClass(DrawArc, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            var ret = new kicad_common_1.Rect(0, 0, 0, 0);
            var arcStart = { x: this.startx, y: this.starty };
            var arcEnd = { x: this.endx, y: this.endy };
            var pos = { x: this.posx, y: this.posy };
            var normStart = kicad_common_1.Point.sub(arcStart, pos);
            var normEnd = kicad_common_1.Point.sub(arcEnd, pos);
            if (kicad_common_1.Point.isZero(normStart) || kicad_common_1.Point.isZero(normEnd) || this.radius === 0) {
                return ret;
            }
            var transform = new kicad_common_1.Transform();
            var startPos = transform.transformCoordinate(arcStart);
            var endPos = transform.transformCoordinate(arcEnd);
            var centerPos = transform.transformCoordinate(pos);

            var _transform$mapAngles = transform.mapAngles(this.startAngle, this.endAngle),
                _transform$mapAngles2 = _slicedToArray(_transform$mapAngles, 3),
                startAngle = _transform$mapAngles2[0],
                endAngle = _transform$mapAngles2[1],
                swap = _transform$mapAngles2[2];

            if (swap) {
                var _ref = [startPos.x, endPos.x];
                endPos.x = _ref[0];
                startPos.x = _ref[1];
                var _ref2 = [startPos.y, endPos.y];
                endPos.y = _ref2[0];
                startPos.y = _ref2[1];
            }
            var minX = Math.min(startPos.x, endPos.x);
            var minY = Math.min(startPos.y, endPos.y);
            var maxX = Math.max(startPos.x, endPos.x);
            var maxY = Math.max(startPos.y, endPos.y);
            /* Zero degrees is a special case. */
            if (this.startAngle === 0) maxX = centerPos.x + this.radius;
            /* Arc end angle wrapped passed 360. */
            if (startAngle > endAngle) endAngle += 3600;
            if (startAngle <= 900 && endAngle >= 900) maxY = centerPos.y + this.radius;
            if (startAngle <= 1800 && endAngle >= 1800) minX = centerPos.x - this.radius;
            if (startAngle <= 2700 && endAngle >= 2700) minY = centerPos.y - this.radius;
            if (startAngle <= 3600 && endAngle >= 3600) maxX = centerPos.x + this.radius;
            ret.pos1.x = minX;
            ret.pos1.y = minY;
            ret.pos2.x = maxX;
            ret.pos2.y = maxY;
            return ret;
        }
    }]);

    return DrawArc;
}(DrawObject);

exports.DrawArc = DrawArc;

var DrawCircle = function (_DrawObject2) {
    _inherits(DrawCircle, _DrawObject2);

    function DrawCircle(params) {
        _classCallCheck(this, DrawCircle);

        var _this2 = _possibleConstructorReturn(this, (DrawCircle.__proto__ || Object.getPrototypeOf(DrawCircle)).call(this));

        _this2.posx = Number(params[0]);
        _this2.posy = Number(params[1]);
        _this2.radius = Number(params[2]);
        _this2.unit = Number(params[3]);
        _this2.convert = Number(params[4]);
        _this2.lineWidth = Number(params[5]);
        _this2.fill = params[6] || kicad_common_1.Fill.NO_FILL;
        return _this2;
    }

    _createClass(DrawCircle, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            var transform = new kicad_common_1.Transform();
            var pos1 = transform.transformCoordinate({ x: this.posx - this.radius, y: this.posy - this.radius });
            var pos2 = transform.transformCoordinate({ x: this.posx + this.radius, y: this.posy + this.radius });
            return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
        }
    }]);

    return DrawCircle;
}(DrawObject);

exports.DrawCircle = DrawCircle;

var DrawPolyline = function (_DrawObject3) {
    _inherits(DrawPolyline, _DrawObject3);

    function DrawPolyline(params) {
        _classCallCheck(this, DrawPolyline);

        var _this3 = _possibleConstructorReturn(this, (DrawPolyline.__proto__ || Object.getPrototypeOf(DrawPolyline)).call(this));

        _this3.pointCount = Number(params[0]);
        _this3.unit = Number(params[1]);
        _this3.convert = Number(params[2]);
        _this3.lineWidth = Number(params[3]);
        _this3.points = params.slice(4, 4 + _this3.pointCount * 2).map(function (i) {
            return Number(i);
        });
        _this3.fill = params[4 + _this3.pointCount * 2] || kicad_common_1.Fill.NO_FILL;
        return _this3;
    }

    _createClass(DrawPolyline, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            var minx = void 0,
                maxx = void 0;
            var miny = void 0,
                maxy = void 0;
            minx = maxx = this.points[0];
            miny = maxy = this.points[1];
            for (var i = 2, len = this.points.length; i < len; i += 2) {
                var x = this.points[i];
                var y = this.points[i + 1];
                minx = Math.min(minx, x);
                maxx = Math.max(maxx, x);
                miny = Math.min(miny, y);
                maxy = Math.max(maxy, y);
            }
            var transform = new kicad_common_1.Transform();
            var pos1 = transform.transformCoordinate({ x: minx, y: miny });
            var pos2 = transform.transformCoordinate({ x: maxx, y: maxy });
            return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
        }
    }]);

    return DrawPolyline;
}(DrawObject);

exports.DrawPolyline = DrawPolyline;

var DrawSquare = function (_DrawObject4) {
    _inherits(DrawSquare, _DrawObject4);

    function DrawSquare(params) {
        _classCallCheck(this, DrawSquare);

        var _this4 = _possibleConstructorReturn(this, (DrawSquare.__proto__ || Object.getPrototypeOf(DrawSquare)).call(this));

        _this4.startx = Number(params[0]);
        _this4.starty = Number(params[1]);
        _this4.endx = Number(params[2]);
        _this4.endy = Number(params[3]);
        _this4.unit = Number(params[4]);
        _this4.convert = Number(params[5]);
        _this4.lineWidth = Number(params[6]);
        _this4.fill = params[7] || kicad_common_1.Fill.NO_FILL;
        return _this4;
    }

    _createClass(DrawSquare, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            var transform = new kicad_common_1.Transform();
            var pos1 = transform.transformCoordinate({ x: this.startx, y: this.starty });
            var pos2 = transform.transformCoordinate({ x: this.endx, y: this.endy });
            return new kicad_common_1.Rect(Math.min(pos1.x, pos2.x), Math.min(pos1.y, pos2.y), Math.max(pos1.x, pos2.x), Math.max(pos1.y, pos2.y));
        }
    }]);

    return DrawSquare;
}(DrawObject);

exports.DrawSquare = DrawSquare;

var DrawText = function (_DrawObject5) {
    _inherits(DrawText, _DrawObject5);

    function DrawText(params) {
        _classCallCheck(this, DrawText);

        var _this5 = _possibleConstructorReturn(this, (DrawText.__proto__ || Object.getPrototypeOf(DrawText)).call(this));

        _this5.angle = Number(params[0]);
        _this5.posx = Number(params[1]);
        _this5.posy = Number(params[2]);
        _this5.textSize = Number(params[3]);
        _this5.textType = Number(params[4]);
        _this5.unit = Number(params[5]);
        _this5.convert = Number(params[6]);
        if (params[7][0] === '"') {
            // quoted
            _this5.text = params[7].slice(1, -1).replace(/''/g, '"');
        } else {
            // not quoted
            _this5.text = params[7].replace(/~/g, ' ');
        }
        _this5.italic = params[8] === 'Italic';
        _this5.bold = Number(params[9]) > 0;
        _this5.hjustify = params[10];
        _this5.vjustify = params[11];
        return _this5;
    }

    _createClass(DrawText, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            // TODO
            return new kicad_common_1.Rect(this.posx - (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy - (this.angle !== 0 ? this.text.length * this.textSize : 0), this.posx + (this.angle === 0 ? this.text.length * this.textSize : 0), this.posy + (this.angle !== 0 ? this.text.length * this.textSize : 0));
        }
    }]);

    return DrawText;
}(DrawObject);

exports.DrawText = DrawText;

var DrawPin = function (_DrawObject6) {
    _inherits(DrawPin, _DrawObject6);

    function DrawPin(params) {
        _classCallCheck(this, DrawPin);

        var _this6 = _possibleConstructorReturn(this, (DrawPin.__proto__ || Object.getPrototypeOf(DrawPin)).call(this));

        _this6.name = params[0];
        _this6.num = params[1];
        _this6.posx = Number(params[2]);
        _this6.posy = Number(params[3]);
        _this6.length = Number(params[4]);
        _this6.orientation = params[5];
        _this6.nameTextSize = Number(params[6]);
        _this6.numTextSize = Number(params[7]);
        _this6.unit = Number(params[8]);
        _this6.convert = Number(params[9]);
        _this6.pinType = params[10];
        _this6.attributes = (params[11] || '').split('');
        _this6.visibility = _this6.attributes.every(function (i) {
            return i !== 'N';
        });
        return _this6;
    }

    _createClass(DrawPin, [{
        key: "getBoundingBox",
        value: function getBoundingBox() {
            // TODO
            return new kicad_common_1.Rect(this.posx - this.length, this.posy - this.length, this.posx + this.length, this.posy + this.length);
        }
    }]);

    return DrawPin;
}(DrawObject);

exports.DrawPin = DrawPin;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var kicad_common_1 = __webpack_require__(48);
var TextOrientationType;
(function (TextOrientationType) {
    TextOrientationType[TextOrientationType["HORIZ_LEFT"] = 0] = "HORIZ_LEFT";
    TextOrientationType[TextOrientationType["UP"] = 1] = "UP";
    TextOrientationType[TextOrientationType["HORIZ_RIGHT"] = 2] = "HORIZ_RIGHT";
    TextOrientationType[TextOrientationType["BOTTOM"] = 3] = "BOTTOM";
})(TextOrientationType = exports.TextOrientationType || (exports.TextOrientationType = {}));
;

var Schematic = function () {
    _createClass(Schematic, null, [{
        key: "load",
        value: function load(content) {
            var lines = content.split(/\n/);
            var sch = new this();
            sch.parse(lines);
            return sch;
        }
    }]);

    function Schematic() {
        _classCallCheck(this, Schematic);

        this.libs = [];
        this.items = [];
        this.parsed = false;
    }

    _createClass(Schematic, [{
        key: "parse",
        value: function parse(lines) {
            var version = lines.shift();
            var SCHEMATIC_HEADER = "EESchema Schematic File Version ";
            var SUPPORTED_VERSION = 2;
            if (!version || version.indexOf(SCHEMATIC_HEADER) !== 0) {
                throw "unknwon library format";
            }
            this.version = Number(version.slice(SCHEMATIC_HEADER.length));
            if (this.version > SUPPORTED_VERSION) {
                throw "schematic format version is greater than supported version: " + this.version + '>' + SUPPORTED_VERSION;
            }
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line[0] === '#') continue;
                if (!line) continue;
                if (line.indexOf("LIBS:") === 0) {
                    // should be skipped and see .pro file but it is parsed.
                    this.libs.push(line.slice(5));
                    continue;
                }
                var tokens = line.split(/ +/);
                if (tokens[0] === 'EELAYER') {
                    while ((line = lines.shift()) !== undefined) {
                        if (line === 'EELAYER END') break;
                        // skip this section
                    }
                } else if (tokens[0] === '$Descr') {
                    this.descr = new Descr(tokens.slice(1)).parse(lines);
                } else if (tokens[0] === '$Comp') {
                    this.items.push(new SchComponent().parse(lines));
                } else if (tokens[0] === '$Sheet') {
                    this.items.push(new Sheet().parse(lines));
                } else if (tokens[0] === '$Bitmap') {
                    this.items.push(new Bitmap().parse(lines));
                } else if (tokens[0] === 'Text') {
                    this.items.push(new Text(tokens.slice(1)).parse(lines));
                } else if (tokens[0] === 'Entry') {
                    this.items.push(new Entry(tokens.slice(1)).parse(lines));
                } else if (tokens[0] === 'Connection') {
                    this.items.push(new Connection(tokens.slice(1)).parse(lines));
                } else if (tokens[0] === 'NoConn') {
                    this.items.push(new NoConn(tokens.slice(1)).parse(lines));
                } else if (tokens[0] === 'Wire') {
                    this.items.push(new Wire(tokens.slice(1)).parse(lines));
                } else if (tokens[0] === '$EndSCHEMATC') {
                    this.parsed = true;
                } else {
                    throw 'unkown token ' + tokens[0];
                }
            }
        }
    }]);

    return Schematic;
}();

exports.Schematic = Schematic;

var SchItem = function SchItem() {
    _classCallCheck(this, SchItem);
};

exports.SchItem = SchItem;

var Sheet = function (_SchItem) {
    _inherits(Sheet, _SchItem);

    function Sheet() {
        _classCallCheck(this, Sheet);

        var _this = _possibleConstructorReturn(this, (Sheet.__proto__ || Object.getPrototypeOf(Sheet)).call(this));

        _this.sheetPins = [];
        return _this;
    }

    _createClass(Sheet, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line === '$EndSheet') break;
                var tokens = line.split(/\s+/);
                if (tokens[0] === 'S') {
                    this.posx = Number(tokens[1]);
                    this.posy = Number(tokens[2]);
                    this.sizex = Number(tokens[3]);
                    this.sizey = Number(tokens[4]);
                } else if (tokens[0] === 'U') {
                    this.timestamp = Number(tokens[1]);
                } else if (tokens[0].match(/F(\d)/)) {
                    var n = Number(RegExp.$1);
                    if (n === 0) {
                        this.sheetName = kicad_common_1.ReadDelimitedText(tokens[1]);
                        this.sheetNameSize = Number(tokens[2]);
                    } else if (n === 1) {
                        this.fileName = kicad_common_1.ReadDelimitedText(tokens[1]);
                        this.fileNameSize = Number(tokens[2]);
                    } else {
                        this.sheetPins.push(new SheetPin(n, tokens.slice(1)).parse(lines));
                    }
                }
            }
            return this;
        }
    }]);

    return Sheet;
}(SchItem);

exports.Sheet = Sheet;

var SchComponent = function (_SchItem2) {
    _inherits(SchComponent, _SchItem2);

    function SchComponent() {
        _classCallCheck(this, SchComponent);

        var _this2 = _possibleConstructorReturn(this, (SchComponent.__proto__ || Object.getPrototypeOf(SchComponent)).call(this));

        _this2.ar = {};
        _this2.fields = [];
        return _this2;
    }

    _createClass(SchComponent, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            var tabLines = [];
            while ((line = lines.shift()) !== undefined) {
                if (line === '$EndComp') break;
                if (line[0] === "\t") {
                    tabLines.push(line.substring(1));
                    continue;
                }
                var tokens = line.split(/\s+/);
                if (tokens[0] === 'L') {
                    this.name = tokens[1].replace(/~/g, ' ');
                    this.reference = tokens[2].replace(/~/g, ' ').replace(/^\s+|\s+$/g, '');
                    if (!this.reference) this.reference = "U";
                } else if (tokens[0] === 'U') {
                    this.unit = Number(tokens[1]);
                    this.convert = Number(tokens[2]);
                    this.timestamp = Number(tokens[3]);
                } else if (tokens[0] === 'P') {
                    this.posx = Number(tokens[1]);
                    this.posy = Number(tokens[2]);
                } else if (tokens[0] === 'AR') {
                    tokens.slice(1).reduce(function (r, i) {
                        var _i$split = i.split(/=/),
                            _i$split2 = _slicedToArray(_i$split, 2),
                            name = _i$split2[0],
                            value = _i$split2[1];

                        r[name] = value;
                        return r;
                    }, this.ar);
                } else if (tokens[0] === 'F') {
                    this.fields.push(new Field(tokens.slice(1)));
                }
            }
            var _oldPosAndUnit = tabLines.shift();
            if (!_oldPosAndUnit) {
                throw 'unexpected line';
            }
            var transform = tabLines.shift();
            if (!transform) {
                throw 'unexpected line';
            }
            var matrix = transform.split(/\s+/).slice(0, 4).map(function (i) {
                return Number(i);
            });
            matrix.push(this.posx, this.posy);
            this.transform = new (Function.prototype.bind.apply(kicad_common_1.Transform, [null].concat(_toConsumableArray(matrix))))();
            return this;
        }
    }]);

    return SchComponent;
}(SchItem);

exports.SchComponent = SchComponent;

var Field = function (_SchItem3) {
    _inherits(Field, _SchItem3);

    function Field(tokens) {
        _classCallCheck(this, Field);

        var _this3 = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this));

        var i = 0;
        _this3.number = Number(tokens[i++]);
        _this3.text = kicad_common_1.ReadDelimitedText(tokens[i++]);
        if (tokens[i + 1][0] === '"') {
            _this3.name = kicad_common_1.ReadDelimitedText(tokens[i++]);
        }
        _this3.angle = tokens[i++] === 'V' ? kicad_common_1.TextAngle.VERT : kicad_common_1.TextAngle.HORIZ;
        _this3.posx = Number(tokens[i++]);
        _this3.posy = Number(tokens[i++]);
        _this3.size = Number(tokens[i++]);
        _this3.visibility = Number(tokens[i++]) === 0;
        _this3.hjustify = tokens[i++];
        var char3 = tokens[i++];
        _this3.vjustify = char3[0];
        _this3.italic = char3[1] === 'I';
        _this3.bold = char3[2] === 'B';
        return _this3;
    }

    return Field;
}(SchItem);

exports.Field = Field;

var Descr = function () {
    function Descr(tokens) {
        _classCallCheck(this, Descr);

        this.pageType = tokens[0];
        this.width = Number(tokens[1]);
        this.height = Number(tokens[2]);
        this.orientation = Number(tokens[3] || 0);
    }

    _createClass(Descr, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line === '$EndDescr') break;
                var tokens = line.split(/\s+/);
                if (tokens[0] === 'Sheet') {
                    this.screenNumber = Number(tokens[1]);
                    this.numberOfScreens = Number(tokens[2]);
                } else if (tokens[0] === 'Title') {
                    this.title = tokens[1];
                } else if (tokens[0] === 'Date') {
                    this.date = tokens[1];
                } else if (tokens[0] === 'Rev') {
                    this.rev = tokens[1];
                } else if (tokens[0] === 'Comp') {
                    this.date = tokens[1];
                } else if (tokens[0] === 'Date') {
                    this.date = tokens[1];
                } else if (tokens[0] === 'Comment1') {
                    this.comment1 = tokens[1];
                } else if (tokens[0] === 'Comment2') {
                    this.comment2 = tokens[1];
                } else if (tokens[0] === 'Comment3') {
                    this.comment3 = tokens[1];
                } else if (tokens[0] === 'Comment4') {
                    this.comment4 = tokens[1];
                }
            }
            return this;
        }
    }]);

    return Descr;
}();

exports.Descr = Descr;

var Bitmap = function (_SchItem4) {
    _inherits(Bitmap, _SchItem4);

    function Bitmap() {
        _classCallCheck(this, Bitmap);

        return _possibleConstructorReturn(this, (Bitmap.__proto__ || Object.getPrototypeOf(Bitmap)).call(this));
    }

    _createClass(Bitmap, [{
        key: "parse",
        value: function parse(lines) {
            var line = void 0;
            while ((line = lines.shift()) !== undefined) {
                if (line === '$EndBitmap') break;
                var tokens = line.split(/ +/);
                if (tokens[0] === 'Pos') {
                    this.posx = Number(tokens[1]);
                    this.posy = Number(tokens[2]);
                } else if (tokens[0] === 'Scale') {
                    this.scale = Number(tokens[1]);
                } else if (tokens[0] === 'Data') {
                    var chunks = [];
                    while ((line = lines.shift()) !== undefined) {
                        if (line === 'EndData') break;
                        chunks.push(Uint8Array.from(line.replace(/^\s+|\s+$/g, '').split(/\s+/).map(function (hex) {
                            return parseInt(hex, 16);
                        })));
                    }
                    var size = chunks.reduce(function (r, i) {
                        return r + i.length;
                    }, 0);
                    this.data = new Uint8Array(size);
                    var offset = 0;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var chunk = _step.value;

                            this.data.set(chunk, offset);
                            offset += chunk.length;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                } else {
                    throw "unexpected token " + tokens[0];
                }
            }
            return this;
        }
    }, {
        key: "parseIHDR",

        // we need to parse png file to know image dimension
        value: function parseIHDR() {
            if (!this.isValidPNG) {
                throw "this is not a valid png file: invalid signature";
            }
            var IHDR = new DataView(this.data.buffer, Bitmap.PNG_SIGNATURE.length, 25);
            var size = IHDR.getUint32(0);
            var name = String.fromCharCode(IHDR.getUint8(4), IHDR.getUint8(5), IHDR.getUint8(6), IHDR.getUint8(7));
            if (name !== 'IHDR' || size !== 13) {
                throw "this is not a valid png file: invalid IHDR";
            }
            this.width = IHDR.getUint32(0x08);
            this.height = IHDR.getUint32(0x0c);
        }
    }, {
        key: "isValidPNG",
        get: function get() {
            var signature = String.fromCharCode.apply(String, _toConsumableArray(this.data.slice(0, Bitmap.PNG_SIGNATURE.length)));
            return signature === Bitmap.PNG_SIGNATURE;
        }
    }]);

    return Bitmap;
}(SchItem);

Bitmap.PNG_SIGNATURE = "\x89\x50\x4E\x47\x0D\x0A\x1A\x0A";
exports.Bitmap = Bitmap;

var Text = function (_SchItem5) {
    _inherits(Text, _SchItem5);

    function Text(tokens) {
        _classCallCheck(this, Text);

        var _this5 = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

        if (!tokens) return _possibleConstructorReturn(_this5);
        _this5.name1 = tokens[0];
        _this5.posx = Number(tokens[1]);
        _this5.posy = Number(tokens[2]);
        var orientationType = Number(tokens[3]);
        _this5.setOrientationType(orientationType);
        _this5.size = Number(tokens[4]);
        _this5.shape = tokens[5][0];
        _this5.italic = tokens[6] == "Italic";
        _this5.bold = Number(tokens[7]) !== 0;
        return _this5;
    }

    _createClass(Text, [{
        key: "setOrientationType",
        value: function setOrientationType(orientationType) {
            this.orientationType = orientationType;
            if (this.name1 === "GLabel") {
                if (orientationType === TextOrientationType.HORIZ_LEFT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.UP) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.BOTTOM) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else {
                    throw "invalid orientationType: " + orientationType;
                }
            } else if (this.name1 === 'HLabel') {
                if (orientationType === TextOrientationType.HORIZ_LEFT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.UP) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else if (orientationType === TextOrientationType.BOTTOM) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.CENTER;
                } else {
                    throw "invalid orientationType: " + orientationType;
                }
            } else {
                if (orientationType === TextOrientationType.HORIZ_LEFT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
                } else if (orientationType === TextOrientationType.UP) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.LEFT;
                    this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
                } else if (orientationType === TextOrientationType.HORIZ_RIGHT) {
                    this.orientation = kicad_common_1.TextAngle.HORIZ;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
                } else if (orientationType === TextOrientationType.BOTTOM) {
                    this.orientation = kicad_common_1.TextAngle.VERT;
                    this.hjustify = kicad_common_1.TextHjustify.RIGHT;
                    this.vjustify = kicad_common_1.TextVjustify.BOTTOM;
                } else {
                    throw "invalid orientationType: " + orientationType;
                }
            }
        }
    }, {
        key: "parse",
        value: function parse(lines) {
            var text = lines.shift();
            if (!text) throw "expected text line but not";
            this.text = text.replace(/\\n/g, "\n");
            return this;
        }
    }]);

    return Text;
}(SchItem);

exports.Text = Text;

var Wire = function (_SchItem6) {
    _inherits(Wire, _SchItem6);

    function Wire(tokens) {
        _classCallCheck(this, Wire);

        var _this6 = _possibleConstructorReturn(this, (Wire.__proto__ || Object.getPrototypeOf(Wire)).call(this));

        _this6.name1 = tokens[0];
        _this6.name2 = tokens[1];
        return _this6;
    }

    _createClass(Wire, [{
        key: "parse",
        value: function parse(lines) {
            var wire = lines.shift();
            if (!wire) throw "expected text wire but not";

            var _wire$substring$split = wire.substring(1).split(/\s+/).map(function (i) {
                return Number(i);
            });

            var _wire$substring$split2 = _slicedToArray(_wire$substring$split, 4);

            this.startx = _wire$substring$split2[0];
            this.starty = _wire$substring$split2[1];
            this.endx = _wire$substring$split2[2];
            this.endy = _wire$substring$split2[3];

            return this;
        }
    }, {
        key: "isBus",
        get: function get() {
            return this.name1[0] === 'B';
        }
    }]);

    return Wire;
}(SchItem);

exports.Wire = Wire;

var Entry = function (_SchItem7) {
    _inherits(Entry, _SchItem7);

    function Entry(tokens) {
        _classCallCheck(this, Entry);

        var _this7 = _possibleConstructorReturn(this, (Entry.__proto__ || Object.getPrototypeOf(Entry)).call(this));

        _this7.name1 = tokens[0];
        _this7.name2 = tokens[1];
        return _this7;
    }

    _createClass(Entry, [{
        key: "parse",
        value: function parse(lines) {
            var entry = lines.shift();
            if (!entry) throw "expected text entry but not";

            var _entry$substring$spli = entry.substring(1).split(/\s+/).map(function (i) {
                return Number(i);
            });

            var _entry$substring$spli2 = _slicedToArray(_entry$substring$spli, 4);

            this.posx = _entry$substring$spli2[0];
            this.posy = _entry$substring$spli2[1];
            this.sizex = _entry$substring$spli2[2];
            this.sizey = _entry$substring$spli2[3];

            this.sizex -= this.posx;
            this.sizey -= this.posy;
            return this;
        }
    }, {
        key: "isBus",
        get: function get() {
            return this.name1[0] === 'B';
        }
    }]);

    return Entry;
}(SchItem);

exports.Entry = Entry;

var Connection = function (_SchItem8) {
    _inherits(Connection, _SchItem8);

    function Connection(tokens) {
        _classCallCheck(this, Connection);

        var _this8 = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));

        _this8.name1 = tokens[0];
        _this8.posx = Number(tokens[1]);
        _this8.posy = Number(tokens[2]);
        return _this8;
    }

    _createClass(Connection, [{
        key: "parse",
        value: function parse(lines) {
            return this;
        }
    }]);

    return Connection;
}(SchItem);

exports.Connection = Connection;

var NoConn = function (_SchItem9) {
    _inherits(NoConn, _SchItem9);

    function NoConn(tokens) {
        _classCallCheck(this, NoConn);

        var _this9 = _possibleConstructorReturn(this, (NoConn.__proto__ || Object.getPrototypeOf(NoConn)).call(this));

        _this9.name1 = tokens[0];
        _this9.posx = Number(tokens[1]);
        _this9.posy = Number(tokens[2]);
        return _this9;
    }

    _createClass(NoConn, [{
        key: "parse",
        value: function parse(lines) {
            return this;
        }
    }]);

    return NoConn;
}(SchItem);

exports.NoConn = NoConn;

var SheetPin = function (_Text) {
    _inherits(SheetPin, _Text);

    function SheetPin(n, tokens) {
        _classCallCheck(this, SheetPin);

        var _this10 = _possibleConstructorReturn(this, (SheetPin.__proto__ || Object.getPrototypeOf(SheetPin)).call(this));

        _this10.number = n;
        _this10.text = kicad_common_1.ReadDelimitedText(tokens[0]);
        _this10.shape = tokens[1][0];
        _this10.sheetSide = tokens[2][0];
        _this10.posx = Number(tokens[3]);
        _this10.posy = Number(tokens[4]);
        _this10.size = Number(tokens[5]);
        if (_this10.sheetSide === kicad_common_1.SheetSide.LEFT) {
            _this10.setOrientationType(TextOrientationType.HORIZ_RIGHT);
        } else if (_this10.sheetSide === kicad_common_1.SheetSide.RIGHT) {
            _this10.setOrientationType(TextOrientationType.HORIZ_LEFT);
        } else if (_this10.sheetSide === kicad_common_1.SheetSide.TOP) {
            _this10.setOrientationType(TextOrientationType.BOTTOM);
        } else if (_this10.sheetSide === kicad_common_1.SheetSide.BOTTOM) {
            _this10.setOrientationType(TextOrientationType.UP);
        }
        return _this10;
    }

    _createClass(SheetPin, [{
        key: "parse",
        value: function parse(lines) {
            return this;
        }
    }]);

    return SheetPin;
}(Text);

exports.SheetPin = SheetPin;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var kicad_common_1 = __webpack_require__(48);
var kicad_strokefont_data_1 = __webpack_require__(304);
var INTERLINE_PITCH_RATIO = 1.5;
var OVERBAR_POSITION_FACTOR = 1.22;
var BOLD_FACTOR = 1.3;
var STROKE_FONT_SCALE = 1.0 / 21.0;
var ITALIC_TILT = 1.0 / 8;
// common/drawtxt.cpp
// common/gal/stroke_font.cpp

var Glyph = function () {
    function Glyph() {
        _classCallCheck(this, Glyph);

        this.lines = [];
    }

    _createClass(Glyph, [{
        key: "computeBoundingBox",
        value: function computeBoundingBox() {
            var points = [];
            var rect = new kicad_common_1.Rect(0, 0, this.endX - this.startX, 0);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = line[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var point = _step2.value;

                            rect = rect.merge(new kicad_common_1.Rect(0, 0, this.endX - this.startX, point.y).normalize());
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.boundingBox = rect;
        }
    }]);

    return Glyph;
}();

exports.Glyph = Glyph;

var StrokeFont = function () {
    function StrokeFont() {
        _classCallCheck(this, StrokeFont);

        this.glyphs = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = kicad_strokefont_data_1.STROKE_FONT[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var def = _step3.value;

                var glyph = new Glyph();
                var points = [];
                var SERIALIZE_OFFSET = 'R'.charCodeAt(0);
                var FONT_OFFSET = -10;
                var glyphStartX = (def.charCodeAt(0) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;
                var glyphEndX = (def.charCodeAt(1) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE;
                for (var i = 2; i < def.length; i += 2) {
                    if (def[i] === ' ' && def[i + 1] === 'R') {
                        // raise pen
                        if (points.length) {
                            glyph.lines.push(points.slice(0));
                            points.length = 0;
                        }
                    } else {
                        var x = (def.charCodeAt(i) - SERIALIZE_OFFSET) * STROKE_FONT_SCALE - glyphStartX;
                        var y = (def.charCodeAt(i + 1) - SERIALIZE_OFFSET + FONT_OFFSET) * STROKE_FONT_SCALE;
                        points.push(new kicad_common_1.Point(x, y));
                    }
                }
                if (points.length) {
                    glyph.lines.push(points.slice(0));
                }
                glyph.startX = glyphStartX;
                glyph.endX = glyphEndX;
                glyph.computeBoundingBox();
                this.glyphs.push(glyph);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }
    }

    _createClass(StrokeFont, [{
        key: "getInterline",
        value: function getInterline(size, lineWidth) {
            return size * INTERLINE_PITCH_RATIO + lineWidth;
        }
    }, {
        key: "computeTextLineSize",
        value: function computeTextLineSize(line, size, lineWidth) {
            var italic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            return this.computeStringBoundaryLimits(line, size, lineWidth, italic).width;
        }
    }, {
        key: "computeStringBoundaryLimits",
        value: function computeStringBoundaryLimits(line, size, lineWidth) {
            var italic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var ymax = 0;
            var ymin = 0;
            var width = 0;
            for (var i = 0, len = line.length; i < len; i++) {
                var c = line.charCodeAt(i);
                var n = c - ' '.charCodeAt(0);
                var glyph = this.glyphs[n] || this.glyphs['?'.charCodeAt(0) - ' '.charCodeAt(0)];
                width += glyph.boundingBox.width;
                ymax = Math.max(ymax, glyph.boundingBox.pos1.y, glyph.boundingBox.pos2.y);
                ymin = Math.min(ymin, glyph.boundingBox.pos1.y, glyph.boundingBox.pos2.y);
            }
            width = width * size + lineWidth;
            var height = size + lineWidth;
            if (italic) {
                width += height * ITALIC_TILT;
            }
            return {
                width: width,
                height: height,
                topLimit: ymax * size,
                bottomLimit: ymin * size
            };
        }
    }, {
        key: "drawGlyph",
        value: function drawGlyph(plotter, p, glyph, size, italic) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = glyph.lines[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var line = _step4.value;

                    {
                        var x = line[0].x * size + p.x;
                        var y = line[0].y * size + p.y;
                        if (italic) {
                            x -= y * ITALIC_TILT;
                        }
                        plotter.moveTo(x, y);
                    }
                    for (var i = 1, len = line.length; i < len; i++) {
                        var point = line[i];
                        var _x3 = point.x * size + p.x;
                        var _y = point.y * size + p.y;
                        if (italic) {
                            _x3 -= _y * ITALIC_TILT;
                        }
                        plotter.lineTo(_x3, _y);
                    }
                    plotter.finishPen();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "drawLineText",
        value: function drawLineText(plotter, p, line, size, lineWidth, hjustify, vjustify, italic) {
            var offset = lineWidth / 2;
            if (hjustify === kicad_common_1.TextHjustify.LEFT) {
                offset += 0;
            } else if (hjustify === kicad_common_1.TextHjustify.CENTER) {
                offset += -this.computeTextLineSize(line, size, lineWidth) / 2;
            } else if (hjustify === kicad_common_1.TextHjustify.RIGHT) {
                offset += -this.computeTextLineSize(line, size, lineWidth);
            }
            for (var i = 0, len = line.length; i < len; i++) {
                var c = line.charCodeAt(i);
                var n = c - ' '.charCodeAt(0);
                var glyph = this.glyphs[n];
                this.drawGlyph(plotter, { x: offset + p.x, y: p.y }, glyph, size, italic);
                offset += glyph.boundingBox.pos2.x * size;
            }
        }
    }, {
        key: "drawText",
        value: function drawText(plotter, p, text, size, lineWidth, angle, hjustify, vjustify, italic, bold) {
            if (lineWidth === 0 && bold) {
                lineWidth = size / 5.0;
            }
            lineWidth = this.clampTextPenSize(lineWidth, size, bold);
            plotter.save();
            plotter.setCurrentLineWidth(lineWidth * BOLD_FACTOR);
            plotter.translate(p.x, p.y);
            plotter.rotate(-kicad_common_1.DECIDEG2RAD(angle));
            var offset = 0;
            var lines = text.split(/\n/);
            if (vjustify === kicad_common_1.TextVjustify.TOP) {
                offset = size * lines.length;
            } else if (vjustify === kicad_common_1.TextVjustify.CENTER) {
                offset = size * lines.length / 2;
            } else if (vjustify === kicad_common_1.TextVjustify.BOTTOM) {
                offset = 0;
            }
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = lines[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var line = _step5.value;

                    this.drawLineText(plotter, { x: 0, y: offset }, line, size, lineWidth, hjustify, vjustify, italic);
                    offset += size * INTERLINE_PITCH_RATIO + lineWidth;
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            plotter.restore();
        }
    }, {
        key: "clampTextPenSize",
        value: function clampTextPenSize(lineWidth, size, bold) {
            var scale = bold ? 4.0 : 6.0;
            var max = Math.abs(size) / scale;
            if (lineWidth > max) {
                return max;
            } else {
                return lineWidth;
            }
        }
    }], [{
        key: "instance",
        get: function get() {
            if (!this._instance) this._instance = new StrokeFont();
            return this._instance;
        }
    }]);

    return StrokeFont;
}();

exports.StrokeFont = StrokeFont;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

__webpack_require__(119);

__webpack_require__(297);

__webpack_require__(298);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(86)))

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(120);
__webpack_require__(123);
__webpack_require__(124);
__webpack_require__(125);
__webpack_require__(126);
__webpack_require__(127);
__webpack_require__(128);
__webpack_require__(129);
__webpack_require__(130);
__webpack_require__(131);
__webpack_require__(132);
__webpack_require__(133);
__webpack_require__(134);
__webpack_require__(135);
__webpack_require__(136);
__webpack_require__(137);
__webpack_require__(138);
__webpack_require__(139);
__webpack_require__(140);
__webpack_require__(141);
__webpack_require__(142);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(145);
__webpack_require__(146);
__webpack_require__(147);
__webpack_require__(148);
__webpack_require__(149);
__webpack_require__(150);
__webpack_require__(151);
__webpack_require__(152);
__webpack_require__(153);
__webpack_require__(154);
__webpack_require__(155);
__webpack_require__(156);
__webpack_require__(157);
__webpack_require__(158);
__webpack_require__(159);
__webpack_require__(160);
__webpack_require__(161);
__webpack_require__(162);
__webpack_require__(163);
__webpack_require__(164);
__webpack_require__(165);
__webpack_require__(166);
__webpack_require__(167);
__webpack_require__(168);
__webpack_require__(169);
__webpack_require__(170);
__webpack_require__(171);
__webpack_require__(172);
__webpack_require__(173);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(191);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(202);
__webpack_require__(203);
__webpack_require__(204);
__webpack_require__(205);
__webpack_require__(206);
__webpack_require__(207);
__webpack_require__(208);
__webpack_require__(211);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(214);
__webpack_require__(215);
__webpack_require__(216);
__webpack_require__(217);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(220);
__webpack_require__(221);
__webpack_require__(222);
__webpack_require__(223);
__webpack_require__(81);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(104);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(230);
__webpack_require__(105);
__webpack_require__(107);
__webpack_require__(108);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(235);
__webpack_require__(236);
__webpack_require__(237);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(242);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(252);
__webpack_require__(253);
__webpack_require__(254);
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(257);
__webpack_require__(258);
__webpack_require__(259);
__webpack_require__(260);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(264);
__webpack_require__(265);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(270);
__webpack_require__(271);
__webpack_require__(272);
__webpack_require__(273);
__webpack_require__(274);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(277);
__webpack_require__(278);
__webpack_require__(279);
__webpack_require__(280);
__webpack_require__(281);
__webpack_require__(282);
__webpack_require__(283);
__webpack_require__(284);
__webpack_require__(285);
__webpack_require__(286);
__webpack_require__(287);
__webpack_require__(288);
__webpack_require__(289);
__webpack_require__(290);
__webpack_require__(291);
__webpack_require__(292);
__webpack_require__(295);
__webpack_require__(296);
module.exports = __webpack_require__(24);

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(10)
  , DESCRIPTORS    = __webpack_require__(6)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(12)
  , META           = __webpack_require__(29).KEY
  , $fails         = __webpack_require__(3)
  , shared         = __webpack_require__(49)
  , setToStringTag = __webpack_require__(40)
  , uid            = __webpack_require__(31)
  , wks            = __webpack_require__(5)
  , wksExt         = __webpack_require__(88)
  , wksDefine      = __webpack_require__(61)
  , keyOf          = __webpack_require__(121)
  , enumKeys       = __webpack_require__(122)
  , isArray        = __webpack_require__(64)
  , anObject       = __webpack_require__(1)
  , toIObject      = __webpack_require__(14)
  , toPrimitive    = __webpack_require__(21)
  , createDesc     = __webpack_require__(28)
  , _create        = __webpack_require__(35)
  , gOPNExt        = __webpack_require__(91)
  , $GOPD          = __webpack_require__(16)
  , $DP            = __webpack_require__(7)
  , $keys          = __webpack_require__(33)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(36).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(46).f  = $propertyIsEnumerable;
  __webpack_require__(51).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(32)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(33)
  , toIObject = __webpack_require__(14);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(33)
  , gOPS    = __webpack_require__(51)
  , pIE     = __webpack_require__(46);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(35)});

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperty: __webpack_require__(7).f});

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', {defineProperties: __webpack_require__(90)});

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(14)
  , $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(22)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(9)
  , $getPrototypeOf = __webpack_require__(17);

__webpack_require__(22)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9)
  , $keys    = __webpack_require__(33);

__webpack_require__(22)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(22)('getOwnPropertyNames', function(){
  return __webpack_require__(91).f;
});

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(29).onFreeze;

__webpack_require__(22)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(22)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(92)});

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {is: __webpack_require__(93)});

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(66).set});

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(47)
  , test    = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  __webpack_require__(12)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', {bind: __webpack_require__(94)});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7).f
  , createDesc = __webpack_require__(28)
  , has        = __webpack_require__(10)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || __webpack_require__(6) && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isObject       = __webpack_require__(4)
  , getPrototypeOf = __webpack_require__(17)
  , HAS_INSTANCE   = __webpack_require__(5)('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))__webpack_require__(7).f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(95);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(96);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global            = __webpack_require__(2)
  , has               = __webpack_require__(10)
  , cof               = __webpack_require__(18)
  , inheritIfRequired = __webpack_require__(68)
  , toPrimitive       = __webpack_require__(21)
  , fails             = __webpack_require__(3)
  , gOPN              = __webpack_require__(36).f
  , gOPD              = __webpack_require__(16).f
  , dP                = __webpack_require__(7).f
  , $trim             = __webpack_require__(41).trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(__webpack_require__(35)(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = __webpack_require__(6) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(12)(global, NUMBER, $Number);
}

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , toInteger    = __webpack_require__(30)
  , aNumberValue = __webpack_require__(97)
  , repeat       = __webpack_require__(69)
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , $fails       = __webpack_require__(3)
  , aNumberValue = __webpack_require__(97)
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export   = __webpack_require__(0)
  , _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {isInteger: __webpack_require__(98)});

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export   = __webpack_require__(0)
  , isInteger = __webpack_require__(98)
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(96);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(95);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0)
  , log1p   = __webpack_require__(99)
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0)
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0)
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0)
  , sign    = __webpack_require__(70);

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0)
  , $expm1  = __webpack_require__(71);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export   = __webpack_require__(0)
  , sign      = __webpack_require__(70)
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0)
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0)
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {log1p: __webpack_require__(99)});

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {sign: __webpack_require__(70)});

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(71)
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(71)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var $export        = __webpack_require__(0)
  , toIndex        = __webpack_require__(34)
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(14)
  , toLength  = __webpack_require__(8);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.1.3.25 String.prototype.trim()
__webpack_require__(41)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(72)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(73)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $at     = __webpack_require__(72)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])

var $export   = __webpack_require__(0)
  , toLength  = __webpack_require__(8)
  , context   = __webpack_require__(75)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(76)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export  = __webpack_require__(0)
  , context  = __webpack_require__(75)
  , INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(76)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(69)
});

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export     = __webpack_require__(0)
  , toLength    = __webpack_require__(8)
  , context     = __webpack_require__(75)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(76)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(15)('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.3 String.prototype.big()
__webpack_require__(15)('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.4 String.prototype.blink()
__webpack_require__(15)('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.5 String.prototype.bold()
__webpack_require__(15)('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.6 String.prototype.fixed()
__webpack_require__(15)('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(15)('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(15)('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.9 String.prototype.italics()
__webpack_require__(15)('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(15)('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.11 String.prototype.small()
__webpack_require__(15)('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.12 String.prototype.strike()
__webpack_require__(15)('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.13 String.prototype.sub()
__webpack_require__(15)('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.14 String.prototype.sup()
__webpack_require__(15)('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export     = __webpack_require__(0)
  , toObject    = __webpack_require__(9)
  , toPrimitive = __webpack_require__(21);

$export($export.P + $export.F * __webpack_require__(3)(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  __webpack_require__(12)(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))__webpack_require__(11)(proto, TO_PRIMITIVE, __webpack_require__(201));

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(21)
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', {isArray: __webpack_require__(64)});

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(25)
  , $export        = __webpack_require__(0)
  , toObject       = __webpack_require__(9)
  , call           = __webpack_require__(100)
  , isArrayIter    = __webpack_require__(77)
  , toLength       = __webpack_require__(8)
  , createProperty = __webpack_require__(78)
  , getIterFn      = __webpack_require__(79);

$export($export.S + $export.F * !__webpack_require__(54)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export        = __webpack_require__(0)
  , createProperty = __webpack_require__(78);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(14)
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(45) != Object || !__webpack_require__(20)(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export    = __webpack_require__(0)
  , html       = __webpack_require__(65)
  , cof        = __webpack_require__(18)
  , toIndex    = __webpack_require__(34)
  , toLength   = __webpack_require__(8)
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(13)
  , toObject  = __webpack_require__(9)
  , fails     = __webpack_require__(3)
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(20)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export  = __webpack_require__(0)
  , $forEach = __webpack_require__(23)(0)
  , STRICT   = __webpack_require__(20)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(210);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , isArray  = __webpack_require__(64)
  , SPECIES  = __webpack_require__(5)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $map    = __webpack_require__(23)(1);

$export($export.P + $export.F * !__webpack_require__(20)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $filter = __webpack_require__(23)(2);

$export($export.P + $export.F * !__webpack_require__(20)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $some   = __webpack_require__(23)(3);

$export($export.P + $export.F * !__webpack_require__(20)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $every  = __webpack_require__(23)(4);

$export($export.P + $export.F * !__webpack_require__(20)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(101);

$export($export.P + $export.F * !__webpack_require__(20)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(101);

$export($export.P + $export.F * !__webpack_require__(20)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(0)
  , $indexOf      = __webpack_require__(50)(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export       = __webpack_require__(0)
  , toIObject     = __webpack_require__(14)
  , toInteger     = __webpack_require__(30)
  , toLength      = __webpack_require__(8)
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(20)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {copyWithin: __webpack_require__(102)});

__webpack_require__(43)('copyWithin');

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {fill: __webpack_require__(80)});

__webpack_require__(43)('fill');

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(23)(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(43)(KEY);

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(23)(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(43)(KEY);

/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37)('Array');

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

var global            = __webpack_require__(2)
  , inheritIfRequired = __webpack_require__(68)
  , dP                = __webpack_require__(7).f
  , gOPN              = __webpack_require__(36).f
  , isRegExp          = __webpack_require__(53)
  , $flags            = __webpack_require__(55)
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(__webpack_require__(6) && (!CORRECT_NEW || __webpack_require__(3)(function(){
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(12)(global, 'RegExp', $RegExp);
}

__webpack_require__(37)('RegExp');

/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(104);
var anObject    = __webpack_require__(1)
  , $flags      = __webpack_require__(55)
  , DESCRIPTORS = __webpack_require__(6)
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  __webpack_require__(12)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(__webpack_require__(3)(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(56)('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(56)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(56)('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(56)('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = __webpack_require__(53)
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(32)
  , global             = __webpack_require__(2)
  , ctx                = __webpack_require__(25)
  , classof            = __webpack_require__(47)
  , $export            = __webpack_require__(0)
  , isObject           = __webpack_require__(4)
  , aFunction          = __webpack_require__(13)
  , anInstance         = __webpack_require__(38)
  , forOf              = __webpack_require__(44)
  , speciesConstructor = __webpack_require__(82)
  , task               = __webpack_require__(83).set
  , microtask          = __webpack_require__(84)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(39)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(40)($Promise, PROMISE);
__webpack_require__(37)(PROMISE);
Wrapper = __webpack_require__(24)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(54)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var weak = __webpack_require__(109);

// 23.4 WeakSet Objects
__webpack_require__(57)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export      = __webpack_require__(0)
  , $typed       = __webpack_require__(58)
  , buffer       = __webpack_require__(85)
  , anObject     = __webpack_require__(1)
  , toIndex      = __webpack_require__(34)
  , toLength     = __webpack_require__(8)
  , isObject     = __webpack_require__(4)
  , ArrayBuffer  = __webpack_require__(2).ArrayBuffer
  , speciesConstructor = __webpack_require__(82)
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(37)(ARRAY_BUFFER);

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(58).ABV, {
  DataView: __webpack_require__(85).DataView
});

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26)('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(13)
  , anObject  = __webpack_require__(1)
  , rApply    = (__webpack_require__(2).Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = __webpack_require__(0)
  , create     = __webpack_require__(35)
  , aFunction  = __webpack_require__(13)
  , anObject   = __webpack_require__(1)
  , isObject   = __webpack_require__(4)
  , fails      = __webpack_require__(3)
  , bind       = __webpack_require__(94)
  , rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = __webpack_require__(7)
  , $export     = __webpack_require__(0)
  , anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(21);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = __webpack_require__(0)
  , gOPD     = __webpack_require__(16).f
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 26.1.5 Reflect.enumerate(target)
var $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
__webpack_require__(74)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , isObject       = __webpack_require__(4)
  , anObject       = __webpack_require__(1);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = __webpack_require__(16)
  , $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(0)
  , getProto = __webpack_require__(17)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export       = __webpack_require__(0)
  , anObject      = __webpack_require__(1)
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {ownKeys: __webpack_require__(110)});

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export            = __webpack_require__(0)
  , anObject           = __webpack_require__(1)
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = __webpack_require__(7)
  , gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , createDesc     = __webpack_require__(28)
  , anObject       = __webpack_require__(1)
  , isObject       = __webpack_require__(4);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = __webpack_require__(0)
  , setProto = __webpack_require__(66);

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export   = __webpack_require__(0)
  , $includes = __webpack_require__(50)(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(43)('includes');

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0)
  , $at     = __webpack_require__(72)(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(111);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(111);

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(41)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(41)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/String.prototype.matchAll/
var $export     = __webpack_require__(0)
  , defined     = __webpack_require__(19)
  , toLength    = __webpack_require__(8)
  , isRegExp    = __webpack_require__(53)
  , getFlags    = __webpack_require__(55)
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

__webpack_require__(74)($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61)('asyncIterator');

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(61)('observable');

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = __webpack_require__(0)
  , ownKeys        = __webpack_require__(110)
  , toIObject      = __webpack_require__(14)
  , gOPD           = __webpack_require__(16)
  , createProperty = __webpack_require__(78);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0)
  , $values = __webpack_require__(112)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export  = __webpack_require__(0)
  , $entries = __webpack_require__(112)(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(13)
  , $defineProperty = __webpack_require__(7);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(6) && $export($export.P + __webpack_require__(59), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(13)
  , $defineProperty = __webpack_require__(7);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(6) && $export($export.P + __webpack_require__(59), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(21)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(59), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(21)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(6) && $export($export.P + __webpack_require__(59), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(113)('Map')});

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(113)('Set')});

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', {global: __webpack_require__(2)});

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0)
  , cof     = __webpack_require__(18);

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(27)
  , anObject                  = __webpack_require__(1)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(1)
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var Set                     = __webpack_require__(107)
  , from                    = __webpack_require__(114)
  , metadata                = __webpack_require__(27)
  , anObject                = __webpack_require__(1)
  , getPrototypeOf          = __webpack_require__(17)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(1)
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                = __webpack_require__(27)
  , anObject                = __webpack_require__(1)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(27)
  , anObject               = __webpack_require__(1)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(27)
  , anObject                  = __webpack_require__(1)
  , aFunction                 = __webpack_require__(13)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = __webpack_require__(0)
  , microtask = __webpack_require__(84)()
  , process   = __webpack_require__(2).process
  , isNode    = __webpack_require__(18)(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/zenparsing/es-observable
var $export     = __webpack_require__(0)
  , global      = __webpack_require__(2)
  , core        = __webpack_require__(24)
  , microtask   = __webpack_require__(84)()
  , OBSERVABLE  = __webpack_require__(5)('observable')
  , aFunction   = __webpack_require__(13)
  , anObject    = __webpack_require__(1)
  , anInstance  = __webpack_require__(38)
  , redefineAll = __webpack_require__(39)
  , hide        = __webpack_require__(11)
  , forOf       = __webpack_require__(44)
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

__webpack_require__(37)('Observable');

/***/ }),
/* 292 */
/***/ (function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global     = __webpack_require__(2)
  , $export    = __webpack_require__(0)
  , invoke     = __webpack_require__(52)
  , partial    = __webpack_require__(293)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var path      = __webpack_require__(294)
  , invoke    = __webpack_require__(52)
  , aFunction = __webpack_require__(13);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};

/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , $task   = __webpack_require__(83);
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators    = __webpack_require__(81)
  , redefine      = __webpack_require__(12)
  , global        = __webpack_require__(2)
  , hide          = __webpack_require__(11)
  , Iterators     = __webpack_require__(42)
  , wks           = __webpack_require__(5)
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(86)))

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(299);
module.exports = __webpack_require__(24).RegExp.escape;

/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0)
  , $re     = __webpack_require__(300)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ }),
/* 300 */
/***/ (function(module, exports) {

module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};

/***/ }),
/* 301 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(48));
__export(__webpack_require__(303));
__export(__webpack_require__(115));
__export(__webpack_require__(116));
__export(__webpack_require__(117));

/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _kicad_common_1$Net$I, _kicad_common_1$Net$O, _kicad_common_1$Net$U, _kicad_common_1$Net$B, _kicad_common_1$Net$T, _TEMPLATE_SHAPES;

var _templateObject = _taggedTemplateLiteral(["<circle cx=\"", "\" cy=\"", "\" r=\"", "\" "], ["<circle cx=\"", "\" cy=\"", "\" r=\"", "\" "]),
    _templateObject2 = _taggedTemplateLiteral([" style=\"stroke: ", "; fill: none; stroke-width: ", "\" stroke-linecap=\"round\"/>\n"], [" style=\"stroke: ", "; fill: none; stroke-width: ", "\" stroke-linecap=\"round\"/>\\n"]),
    _templateObject3 = _taggedTemplateLiteral([" style=\"stroke: ", "; fill: ", "; stroke-width: ", "\" stroke-linecap=\"round\"/>\n"], [" style=\"stroke: ", "; fill: ", "; stroke-width: ", "\" stroke-linecap=\"round\"/>\\n"]),
    _templateObject4 = _taggedTemplateLiteral(["<path d=\"M", " ", " A", " ", " 0.0 ", " ", " ", " ", "\""], ["<path d=\"M", " ", " A", " ", " 0.0 ", " ", " ", " ", "\""]),
    _templateObject5 = _taggedTemplateLiteral(["\" style=\"stroke: ", "; fill: none; stroke-width: ", "\" stroke-linecap=\"round\"/>\n"], ["\" style=\"stroke: ", "; fill: none; stroke-width: ", "\" stroke-linecap=\"round\"/>\\n"]),
    _templateObject6 = _taggedTemplateLiteral(["\" style=\"stroke: ", "; fill: ", "; stroke-width: ", "\" stroke-linecap=\"round\"/>\n"], ["\" style=\"stroke: ", "; fill: ", "; stroke-width: ", "\" stroke-linecap=\"round\"/>\\n"]),
    _templateObject7 = _taggedTemplateLiteral(["<path d=\"M", " ", "\n"], ["<path d=\"M", " ", "\\n"]),
    _templateObject8 = _taggedTemplateLiteral(["M", " ", "\n"], ["M", " ", "\\n"]),
    _templateObject9 = _taggedTemplateLiteral(["L", " ", "\n"], ["L", " ", "\\n"]),
    _templateObject10 = _taggedTemplateLiteral(["<image\n\t\t\txlink:href=\"", "\"\n\t\t\tx=\"", "\"\n\t\t\ty=\"", "\"\n\t\t\twidth=\"", "\"\n\t\t\theight=\"", "\"\n\t\t\t/>"], ["<image\n\t\t\txlink:href=\"", "\"\n\t\t\tx=\"", "\"\n\t\t\ty=\"", "\"\n\t\t\twidth=\"", "\"\n\t\t\theight=\"", "\"\n\t\t\t/>"]),
    _templateObject11 = _taggedTemplateLiteral(["<svg preserveAspectRatio=\"xMinYMin\"\n\t\t\twidth=\"", "\"\n\t\t\theight=\"", "\"\n\t\t\tviewBox=\"0 0 ", " ", "\"\n\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\tversion=\"1.1\">"], ["<svg preserveAspectRatio=\"xMinYMin\"\n\t\t\twidth=\"", "\"\n\t\t\theight=\"", "\"\n\t\t\tviewBox=\"0 0 ", " ", "\"\n\t\t\txmlns=\"http://www.w3.org/2000/svg\"\n\t\t\txmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t\tversion=\"1.1\">"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", { value: true });
var kicad_common_1 = __webpack_require__(48);
var kicad_lib_1 = __webpack_require__(115);
var kicad_sch_1 = __webpack_require__(116);
var kicad_strokefont_1 = __webpack_require__(117);
var TXT_MARGIN = 4;
var PIN_TXT_MARGIN = 4;
var DEFAULT_LINE_WIDTH = 6;
var DEFAULT_LINE_WIDTH_BUS = 12;
var DEFAULT_SIZE_TEXT = 60;
var SCH_COLORS = {
    LAYER_WIRE: kicad_common_1.Color.GREEN,
    LAYER_BUS: kicad_common_1.Color.BLUE,
    LAYER_JUNCTION: kicad_common_1.Color.GREEN,
    LAYER_LOCLABEL: kicad_common_1.Color.BLACK,
    LAYER_HIERLABEL: kicad_common_1.Color.BROWN,
    LAYER_GLOBLABEL: kicad_common_1.Color.RED,
    LAYER_PINNUM: kicad_common_1.Color.RED,
    LAYER_PINNAM: kicad_common_1.Color.CYAN,
    LAYER_FIELDS: kicad_common_1.Color.MAGENTA,
    LAYER_REFERENCEPART: kicad_common_1.Color.CYAN,
    LAYER_VALUEPART: kicad_common_1.Color.CYAN,
    LAYER_NOTES: kicad_common_1.Color.LIGHTBLUE,
    LAYER_DEVICE: kicad_common_1.Color.RED,
    LAYER_DEVICE_BACKGROUND: kicad_common_1.Color.LIGHTYELLOW,
    LAYER_NETNAM: kicad_common_1.Color.DARKGRAY,
    LAYER_PIN: kicad_common_1.Color.RED,
    LAYER_SHEET: kicad_common_1.Color.MAGENTA,
    LAYER_SHEETFILENAME: kicad_common_1.Color.BROWN,
    LAYER_SHEETNAME: kicad_common_1.Color.CYAN,
    LAYER_SHEETLABEL: kicad_common_1.Color.BROWN,
    LAYER_NOCONNECT: kicad_common_1.Color.BLUE,
    LAYER_ERC_WARN: kicad_common_1.Color.GREEN,
    LAYER_ERC_ERR: kicad_common_1.Color.RED,
    LAYER_SCHEMATIC_GRID: kicad_common_1.Color.DARKGRAY,
    LAYER_SCHEMATIC_BACKGROUND: kicad_common_1.Color.WHITE,
    LAYER_BRIGHTENED: kicad_common_1.Color.PUREMAGENTA
};
var TEMPLATE_SHAPES = (_TEMPLATE_SHAPES = {}, _defineProperty(_TEMPLATE_SHAPES, kicad_common_1.Net.INPUT, (_kicad_common_1$Net$I = {}, _defineProperty(_kicad_common_1$Net$I, kicad_sch_1.TextOrientationType.HORIZ_LEFT, [6, 0, 0, -1, -1, -2, -1, -2, 1, -1, 1, 0, 0]), _defineProperty(_kicad_common_1$Net$I, kicad_sch_1.TextOrientationType.UP, [6, 0, 0, 1, -1, 1, -2, -1, -2, -1, -1, 0, 0]), _defineProperty(_kicad_common_1$Net$I, kicad_sch_1.TextOrientationType.HORIZ_RIGHT, [6, 0, 0, 1, 1, 2, 1, 2, -1, 1, -1, 0, 0]), _defineProperty(_kicad_common_1$Net$I, kicad_sch_1.TextOrientationType.BOTTOM, [6, 0, 0, 1, 1, 1, 2, -1, 2, -1, 1, 0, 0]), _kicad_common_1$Net$I)), _defineProperty(_TEMPLATE_SHAPES, kicad_common_1.Net.OUTPUT, (_kicad_common_1$Net$O = {}, _defineProperty(_kicad_common_1$Net$O, kicad_sch_1.TextOrientationType.HORIZ_LEFT, [6, -2, 0, -1, 1, 0, 1, 0, -1, -1, -1, -2, 0]), _defineProperty(_kicad_common_1$Net$O, kicad_sch_1.TextOrientationType.HORIZ_RIGHT, [6, 2, 0, 1, -1, 0, -1, 0, 1, 1, 1, 2, 0]), _defineProperty(_kicad_common_1$Net$O, kicad_sch_1.TextOrientationType.UP, [6, 0, -2, 1, -1, 1, 0, -1, 0, -1, -1, 0, -2]), _defineProperty(_kicad_common_1$Net$O, kicad_sch_1.TextOrientationType.BOTTOM, [6, 0, 2, 1, 1, 1, 0, -1, 0, -1, 1, 0, 2]), _kicad_common_1$Net$O)), _defineProperty(_TEMPLATE_SHAPES, kicad_common_1.Net.UNSPECIFIED, (_kicad_common_1$Net$U = {}, _defineProperty(_kicad_common_1$Net$U, kicad_sch_1.TextOrientationType.HORIZ_LEFT, [5, 0, -1, -2, -1, -2, 1, 0, 1, 0, -1]), _defineProperty(_kicad_common_1$Net$U, kicad_sch_1.TextOrientationType.HORIZ_RIGHT, [5, 0, -1, 2, -1, 2, 1, 0, 1, 0, -1]), _defineProperty(_kicad_common_1$Net$U, kicad_sch_1.TextOrientationType.UP, [5, 1, 0, 1, -2, -1, -2, -1, 0, 1, 0]), _defineProperty(_kicad_common_1$Net$U, kicad_sch_1.TextOrientationType.BOTTOM, [5, 1, 0, 1, 2, -1, 2, -1, 0, 1, 0]), _kicad_common_1$Net$U)), _defineProperty(_TEMPLATE_SHAPES, kicad_common_1.Net.BIDI, (_kicad_common_1$Net$B = {}, _defineProperty(_kicad_common_1$Net$B, kicad_sch_1.TextOrientationType.HORIZ_LEFT, [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0]), _defineProperty(_kicad_common_1$Net$B, kicad_sch_1.TextOrientationType.HORIZ_RIGHT, [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0]), _defineProperty(_kicad_common_1$Net$B, kicad_sch_1.TextOrientationType.UP, [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0]), _defineProperty(_kicad_common_1$Net$B, kicad_sch_1.TextOrientationType.BOTTOM, [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0]), _kicad_common_1$Net$B)), _defineProperty(_TEMPLATE_SHAPES, kicad_common_1.Net.TRISTATE, (_kicad_common_1$Net$T = {}, _defineProperty(_kicad_common_1$Net$T, kicad_sch_1.TextOrientationType.HORIZ_LEFT, [5, 0, 0, -1, -1, -2, 0, -1, 1, 0, 0]), _defineProperty(_kicad_common_1$Net$T, kicad_sch_1.TextOrientationType.HORIZ_RIGHT, [5, 0, 0, 1, -1, 2, 0, 1, 1, 0, 0]), _defineProperty(_kicad_common_1$Net$T, kicad_sch_1.TextOrientationType.UP, [5, 0, 0, -1, -1, 0, -2, 1, -1, 0, 0]), _defineProperty(_kicad_common_1$Net$T, kicad_sch_1.TextOrientationType.BOTTOM, [5, 0, 0, -1, 1, 0, 2, 1, 1, 0, 0]), _kicad_common_1$Net$T)), _TEMPLATE_SHAPES);
/**
 * similar to KiCAD Plotter
 *
 */

var Plotter = function () {
    function Plotter() {
        _classCallCheck(this, Plotter);

        this.fill = kicad_common_1.Fill.NO_FILL;
        this.color = kicad_common_1.Color.BLACK;
        this.transform = kicad_common_1.Transform.identify();
        this.stateHistory = [];
        this.font = kicad_strokefont_1.StrokeFont.instance;
    }

    _createClass(Plotter, [{
        key: "text",
        value: function text(p, color, _text, orientation, size, hjustfy, vjustify, width, italic, bold, multiline) {
            this.setColor(color);
            this.fill = kicad_common_1.Fill.NO_FILL;
            this.font.drawText(this, p, _text, size, width, orientation, hjustfy, vjustify, italic, bold);
        }
    }, {
        key: "save",
        value: function save() {
            this.stateHistory.push({
                fill: this.fill,
                color: this.color,
                transform: this.transform.clone()
            });
        }
    }, {
        key: "translate",
        value: function translate(tx, ty) {
            this.transform = this.transform.translate(tx, ty);
        }
    }, {
        key: "scale",
        value: function scale(sx, sy) {
            this.transform = this.transform.scale(sx, sy);
        }
    }, {
        key: "rotate",
        value: function rotate(radian) {
            this.transform = this.transform.rotate(radian);
        }
    }, {
        key: "restore",
        value: function restore() {
            var state = this.stateHistory.pop();
            Object.assign(this, state);
        }
    }, {
        key: "setColor",
        value: function setColor(c) {
            this.color = c;
        }
    }, {
        key: "moveTo",
        value: function moveTo(x, y) {
            if (typeof y === 'number') {
                this.penTo({ x: x, y: y }, "U");
            } else {
                this.penTo(x, "U");
            }
        }
    }, {
        key: "lineTo",
        value: function lineTo(x, y) {
            if (typeof y === 'number') {
                this.penTo({ x: x, y: y }, "D");
            } else {
                this.penTo(x, "D");
            }
        }
    }, {
        key: "finishTo",
        value: function finishTo(x, y) {
            if (typeof y === 'number') {
                this.penTo({ x: x, y: y }, "D");
                this.penTo({ x: x, y: y }, "Z");
            } else {
                this.penTo(x, "D");
                this.penTo(x, "Z");
            }
        }
    }, {
        key: "finishPen",
        value: function finishPen() {
            this.penTo({ x: 0, y: 0 }, "Z");
        }
        /**
         * kicad-js implements plot methods to plotter instead of each library items for simplify parsing dependencies.
         */

    }, {
        key: "plotLibComponent",
        value: function plotLibComponent(component, unit, convert, transform) {
            this.setColor(SCH_COLORS.LAYER_DEVICE);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = component.draw.objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var draw = _step.value;

                    if (draw.unit !== 0 && unit !== draw.unit) {
                        continue;
                    }
                    ;
                    if (draw.convert !== 0 && convert !== draw.convert) {
                        continue;
                    }
                    if (draw instanceof kicad_lib_1.DrawArc) {
                        this.plotDrawArc(draw, component, transform);
                    } else if (draw instanceof kicad_lib_1.DrawCircle) {
                        this.plotDrawCircle(draw, component, transform);
                    } else if (draw instanceof kicad_lib_1.DrawPolyline) {
                        this.plotDrawPolyline(draw, component, transform);
                    } else if (draw instanceof kicad_lib_1.DrawSquare) {
                        this.plotDrawSquare(draw, component, transform);
                    } else if (draw instanceof kicad_lib_1.DrawText) {
                        this.plotDrawText(draw, component, transform);
                    } else if (draw instanceof kicad_lib_1.DrawPin) {
                        this.plotDrawPin(draw, component, transform);
                    } else {
                        throw 'unknown draw object type: ' + draw.constructor.name;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "plotLibComponentField",
        value: function plotLibComponentField(component, unit, convert, transform) {
            if (component.field && component.field.visibility) {
                var pos = transform.transformCoordinate({ x: component.field.posx, y: component.field.posy });
                var orientation = component.field.textOrientation;
                if (transform.y1) {
                    if (orientation === kicad_common_1.TextAngle.HORIZ) {
                        orientation = kicad_common_1.TextAngle.VERT;
                    } else {
                        orientation = kicad_common_1.TextAngle.HORIZ;
                    }
                }
                var text = component.field.reference;
                var width = 0; //this.font.computeTextLineSize(text, component.field.textSize, DEFAULT_LINE_WIDTH);
                var height = 0; //this.font.getInterline(component.field.textSize, DEFAULT_LINE_WIDTH);
                this.text(kicad_common_1.Point.add({ x: width / 2, y: height / 2 }, pos), SCH_COLORS.LAYER_REFERENCEPART, text, orientation, component.field.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, component.field.italic, component.field.bold);
            }
            if (component.fields[0] && component.fields[0].visibility) {
                var _pos = transform.transformCoordinate({ x: component.fields[0].posx, y: component.fields[0].posy });
                var _orientation = component.fields[0].textOrientation;
                if (transform.y1) {
                    if (_orientation === kicad_common_1.TextAngle.HORIZ) {
                        _orientation = kicad_common_1.TextAngle.VERT;
                    } else {
                        _orientation = kicad_common_1.TextAngle.HORIZ;
                    }
                }
                var _text2 = component.fields[0].name;
                var _width = 0; // this.font.computeTextLineSize(text, component.fields[0].textSize, DEFAULT_LINE_WIDTH);
                var _height = 0; // this.font.getInterline(component.fields[0].textSize, DEFAULT_LINE_WIDTH);
                this.text(kicad_common_1.Point.add({ x: _width / 2, y: _height / 2 }, _pos), SCH_COLORS.LAYER_VALUEPART, _text2, _orientation, component.fields[0].textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, component.fields[0].italic, component.fields[0].bold);
            }
        }
    }, {
        key: "plotDrawArc",
        value: function plotDrawArc(draw, component, transform) {
            var pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy });

            var _transform$mapAngles = transform.mapAngles(draw.startAngle, draw.endAngle),
                _transform$mapAngles2 = _slicedToArray(_transform$mapAngles, 2),
                startAngle = _transform$mapAngles2[0],
                endAngle = _transform$mapAngles2[1];

            this.arc(pos, startAngle, endAngle, draw.radius, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
        }
    }, {
        key: "plotDrawCircle",
        value: function plotDrawCircle(draw, component, transform) {
            var pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy });
            this.circle(pos, draw.radius * 2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
        }
    }, {
        key: "plotDrawPolyline",
        value: function plotDrawPolyline(draw, component, transform) {
            var points = [];
            for (var i = 0, len = draw.points.length; i < len; i += 2) {
                var pos = transform.transformCoordinate({ x: draw.points[i], y: draw.points[i + 1] });
                points.push(pos);
            }
            this.polyline(points, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
        }
    }, {
        key: "plotDrawSquare",
        value: function plotDrawSquare(draw, component, transform) {
            var pos1 = transform.transformCoordinate({ x: draw.startx, y: draw.starty });
            var pos2 = transform.transformCoordinate({ x: draw.endx, y: draw.endy });
            this.rect(pos1, pos2, draw.fill, draw.lineWidth || DEFAULT_LINE_WIDTH);
        }
    }, {
        key: "plotDrawText",
        value: function plotDrawText(draw, component, transform) {
            var pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy });
            this.text(pos, this.color, draw.text, component.field.textOrientation, draw.textSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, draw.italic, draw.bold);
        }
    }, {
        key: "plotDrawPin",
        value: function plotDrawPin(draw, component, transform) {
            if (!draw.visibility) return;
            this.plotDrawPinTexts(draw, component, transform);
            this.plotDrawPinSymbol(draw, component, transform);
        }
    }, {
        key: "plotDrawPinTexts",
        value: function plotDrawPinTexts(draw, component, transform) {
            var drawPinname = component.drawPinname;
            var drawPinnumber = component.drawPinnumber;
            if (draw.name === "" || draw.name === "~") {
                drawPinname = false;
            }
            if (draw.num === "") {
                drawPinnumber = false;
            }
            if (!drawPinname && !drawPinnumber) return;
            var pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy });
            var orientation = this.pinDrawOrientation(draw, transform);
            var x1 = pos.x,
                y1 = pos.y;
            if (orientation === kicad_common_1.PinOrientation.UP) {
                y1 -= draw.length;
            } else if (orientation === kicad_common_1.PinOrientation.DOWN) {
                y1 += draw.length;
            } else if (orientation === kicad_common_1.PinOrientation.LEFT) {
                x1 -= draw.length;
            } else if (orientation === kicad_common_1.PinOrientation.RIGHT) {
                x1 += draw.length;
            }
            var nameOffset = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
            var numOffset = PIN_TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
            var textInside = component.textOffset;
            var isHorizontal = orientation === kicad_common_1.PinOrientation.LEFT || orientation === kicad_common_1.PinOrientation.RIGHT;
            if (textInside) {
                if (isHorizontal) {
                    if (drawPinname) {
                        if (orientation === kicad_common_1.PinOrientation.RIGHT) {
                            this.text({ x: x1 + textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, false, false);
                        } else {
                            this.text({ x: x1 - textInside, y: y1 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, false, false);
                        }
                    }
                    if (drawPinnumber) {
                        this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                    }
                } else {
                    if (orientation === kicad_common_1.PinOrientation.DOWN) {
                        if (drawPinname) {
                            this.text({ x: x1, y: y1 + textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.RIGHT, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, false, false);
                        }
                        if (drawPinnumber) {
                            this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                        }
                    } else {
                        if (drawPinname) {
                            this.text({ x: x1, y: y1 - textInside }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, false, false);
                        }
                        if (drawPinnumber) {
                            this.text({ x: x1 - numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                        }
                    }
                }
            } else {
                if (isHorizontal) {
                    if (drawPinname) {
                        this.text({ x: (x1 + pos.x) / 2, y: y1 - nameOffset }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.HORIZ, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                    }
                    if (drawPinnumber) {
                        this.text({ x: (x1 + pos.x) / 2, y: y1 + numOffset }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.HORIZ, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, DEFAULT_LINE_WIDTH, false, false);
                    }
                } else {
                    if (drawPinname) {
                        this.text({ x: x1 - nameOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNAM, draw.name, kicad_common_1.TextAngle.VERT, draw.nameTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                    }
                    if (drawPinnumber) {
                        this.text({ x: x1 + numOffset, y: (y1 + pos.y) / 2 }, SCH_COLORS.LAYER_PINNUM, draw.num, kicad_common_1.TextAngle.VERT, draw.numTextSize, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.TOP, DEFAULT_LINE_WIDTH, false, false);
                    }
                }
            }
        }
    }, {
        key: "plotDrawPinSymbol",
        value: function plotDrawPinSymbol(draw, component, transform) {
            var pos = transform.transformCoordinate({ x: draw.posx, y: draw.posy });
            var orientation = this.pinDrawOrientation(draw, transform);
            var x1 = pos.x,
                y1 = pos.y;
            var mapX1 = 0,
                mapY1 = 0;
            if (orientation === kicad_common_1.PinOrientation.UP) {
                y1 -= draw.length;
                mapY1 = 1;
            } else if (orientation === kicad_common_1.PinOrientation.DOWN) {
                y1 += draw.length;
                mapY1 = -1;
            } else if (orientation === kicad_common_1.PinOrientation.LEFT) {
                x1 -= draw.length;
                mapX1 = 1;
            } else if (orientation === kicad_common_1.PinOrientation.RIGHT) {
                x1 += draw.length;
                mapX1 = -1;
            }
            // TODO shape
            this.fill = kicad_common_1.Fill.NO_FILL;
            this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
            this.moveTo({ x: x1, y: y1 });
            this.finishTo({ x: pos.x, y: pos.y });
            // this.circle({ x: pos.x, y: pos.y}, 20, Fill.NO_FILL, 2);
        }
    }, {
        key: "pinDrawOrientation",
        value: function pinDrawOrientation(draw, transform) {
            var end = { x: 0, y: 0 };
            if (draw.orientation === kicad_common_1.PinOrientation.UP) {
                end.y = 1;
            } else if (draw.orientation === kicad_common_1.PinOrientation.DOWN) {
                end.y = -1;
            } else if (draw.orientation === kicad_common_1.PinOrientation.LEFT) {
                end.x = -1;
            } else if (draw.orientation === kicad_common_1.PinOrientation.RIGHT) {
                end.x = 1;
            }
            var t = transform.clone();
            t.tx = 0;
            t.ty = 0;
            end = t.transformCoordinate(end);
            if (end.x === 0) {
                if (end.y > 0) {
                    return kicad_common_1.PinOrientation.DOWN;
                } else {
                    return kicad_common_1.PinOrientation.UP;
                }
            } else {
                if (end.x < 0) {
                    return kicad_common_1.PinOrientation.LEFT;
                } else {
                    return kicad_common_1.PinOrientation.RIGHT;
                }
            }
        }
    }, {
        key: "plotSchematic",
        value: function plotSchematic(sch, libs) {
            // default page layout
            var MARGIN = kicad_common_1.MM2MIL(10);
            this.rect({ x: MARGIN, y: MARGIN }, { x: sch.descr.width - MARGIN, y: sch.descr.height - MARGIN }, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            var OFFSET = kicad_common_1.MM2MIL(2);
            this.rect({ x: MARGIN + OFFSET, y: MARGIN + OFFSET }, { x: sch.descr.width - MARGIN - OFFSET, y: sch.descr.height - MARGIN - OFFSET }, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            // up
            this.moveTo(sch.descr.width / 2, MARGIN);
            this.finishTo(sch.descr.width / 2, MARGIN + OFFSET);
            // bottom
            this.moveTo(sch.descr.width / 2, sch.descr.height - MARGIN - OFFSET);
            this.finishTo(sch.descr.width / 2, sch.descr.height - MARGIN);
            // left
            this.moveTo(MARGIN, sch.descr.height / 2);
            this.finishTo(MARGIN + OFFSET, sch.descr.height / 2);
            // right
            this.moveTo(sch.descr.width - MARGIN - OFFSET, sch.descr.height / 2);
            this.finishTo(sch.descr.width - MARGIN, sch.descr.height / 2);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = sch.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    if (item instanceof kicad_sch_1.SchComponent) {
                        var component = void 0;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = libs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var lib = _step3.value;

                                if (!lib) continue;
                                component = lib.findByName(item.name);
                                if (component) break;
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        if (!component) {
                            console.warn("component " + item.name + " is not found in libraries");
                            continue;
                        }
                        this.plotLibComponent(component, item.unit, item.convert, item.transform);
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = item.fields[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var field = _step4.value;

                                if (!field.text) continue;
                                if (!field.visibility) continue;
                                if (field.number >= 2) continue;
                                var orientation = field.angle;
                                if (item.transform.y1) {
                                    if (orientation === kicad_common_1.TextAngle.HORIZ) {
                                        orientation = kicad_common_1.TextAngle.VERT;
                                    } else {
                                        orientation = kicad_common_1.TextAngle.HORIZ;
                                    }
                                }
                                var size = field.size || DEFAULT_SIZE_TEXT;
                                var textWidth = this.font.computeTextLineSize(field.text, size, DEFAULT_LINE_WIDTH);
                                var textHeight = this.font.getInterline(size, DEFAULT_LINE_WIDTH);
                                var relative = kicad_common_1.Point.sub({ x: field.posx, y: field.posy }, { x: item.posx, y: item.posy });
                                var textpos = item.transform.transformCoordinate(relative);
                                this.text(textpos, SCH_COLORS.LAYER_REFERENCEPART, field.text, orientation, size, kicad_common_1.TextHjustify.CENTER, kicad_common_1.TextVjustify.CENTER, DEFAULT_LINE_WIDTH, field.italic, field.bold);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    } else if (item instanceof kicad_sch_1.Sheet) {
                        this.setColor(SCH_COLORS.LAYER_SHEET);
                        this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                        this.fill = kicad_common_1.Fill.NO_FILL;
                        this.moveTo(item.posx, item.posy);
                        this.lineTo(item.posx, item.posy + item.sizey);
                        this.lineTo(item.posx + item.sizex, item.posy + item.sizey);
                        this.lineTo(item.posx + item.sizex, item.posy);
                        this.finishTo(item.posx, item.posy);
                        this.text({ x: item.posx, y: item.posy - 4 }, SCH_COLORS.LAYER_SHEETNAME, item.sheetName, 0, item.sheetNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.BOTTOM, DEFAULT_LINE_WIDTH, false, false);
                        this.text({ x: item.posx, y: item.posy + item.sizey + 4 }, SCH_COLORS.LAYER_SHEETFILENAME, item.fileName, 0, item.fileNameSize, kicad_common_1.TextHjustify.LEFT, kicad_common_1.TextVjustify.TOP, DEFAULT_LINE_WIDTH, false, false);
                        this.setColor(SCH_COLORS.LAYER_SHEETLABEL);
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = item.sheetPins[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var pin = _step5.value;

                                var tmp = pin.shape;
                                if (pin.shape === kicad_common_1.Net.INPUT) {
                                    pin.shape = kicad_common_1.Net.OUTPUT;
                                } else if (pin.shape === kicad_common_1.Net.OUTPUT) {
                                    pin.shape = kicad_common_1.Net.INPUT;
                                }
                                this.plotSchTextHierarchicalLabel(pin);
                                pin.shape = tmp;
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    } else if (item instanceof kicad_sch_1.Bitmap) {
                        item.parseIHDR();
                        var PPI = 300;
                        var PIXEL_SCALE = 1000 / PPI;
                        this.image({ x: item.posx, y: item.posy }, item.scale * PIXEL_SCALE, item.width, item.height, item.data);
                    } else if (item instanceof kicad_sch_1.Text) {
                        if (item.name1 === 'GLabel') {
                            this.plotSchTextGlobalLabel(item);
                        } else if (item.name1 === 'HLabel') {
                            this.plotSchTextHierarchicalLabel(item);
                        } else {
                            this.plotSchText(item);
                        }
                    } else if (item instanceof kicad_sch_1.Entry) {
                        this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                        this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                        this.moveTo(item.posx, item.posy);
                        this.finishTo(item.posx + item.sizex, item.posy + item.sizey);
                    } else if (item instanceof kicad_sch_1.Connection) {
                        this.setColor(SCH_COLORS.LAYER_JUNCTION);
                        this.circle({ x: item.posx, y: item.posy }, 40, kicad_common_1.Fill.FILLED_SHAPE, DEFAULT_LINE_WIDTH);
                    } else if (item instanceof kicad_sch_1.NoConn) {
                        this.fill = kicad_common_1.Fill.NO_FILL;
                        var DRAWNOCONNECT_SIZE = 48;
                        var delta = DRAWNOCONNECT_SIZE / 2;
                        this.setColor(SCH_COLORS.LAYER_NOCONNECT);
                        this.setCurrentLineWidth(DEFAULT_LINE_WIDTH);
                        this.moveTo(item.posx - delta, item.posy - delta);
                        this.finishTo(item.posx + delta, item.posy + delta);
                        this.moveTo(item.posx + delta, item.posy - delta);
                        this.finishTo(item.posx - delta, item.posy + delta);
                    } else if (item instanceof kicad_sch_1.Wire) {
                        this.setColor(item.isBus ? SCH_COLORS.LAYER_BUS : SCH_COLORS.LAYER_WIRE);
                        this.setCurrentLineWidth(item.isBus ? DEFAULT_LINE_WIDTH_BUS : DEFAULT_LINE_WIDTH);
                        this.fill = kicad_common_1.Fill.NO_FILL;
                        this.moveTo(item.startx, item.starty);
                        this.finishTo(item.endx, item.endy);
                    } else {
                        throw "unknown SchItem: " + item.constructor.name;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: "plotSchTextGlobalLabel",
        value: function plotSchTextGlobalLabel(item) {
            {
                var halfSize = item.size / 2;
                var lineWidth = DEFAULT_LINE_WIDTH;
                var points = [];
                var symLen = this.font.computeTextLineSize(item.text, item.size, lineWidth);
                var hasOverBar = /~[^~]/.test(item.text);
                var Y_CORRECTION = 1.40;
                var Y_OVERBAR_CORRECTION = 1.2;
                var x = symLen + lineWidth + 3;
                var y = halfSize * Y_CORRECTION;
                if (hasOverBar) {
                    // TODO
                }
                y += lineWidth + lineWidth / 2;
                points.push(new kicad_common_1.Point(0, 0));
                points.push(new kicad_common_1.Point(0, -y)); // Up
                points.push(new kicad_common_1.Point(-x, -y)); // left
                points.push(new kicad_common_1.Point(-x, 0)); // Up left
                points.push(new kicad_common_1.Point(-x, y)); // left down
                points.push(new kicad_common_1.Point(0, y)); // down
                var xOffset = 0;
                if (item.shape === kicad_common_1.Net.INPUT) {
                    xOffset -= halfSize;
                    points[0].x += halfSize;
                } else if (item.shape === kicad_common_1.Net.OUTPUT) {
                    points[3].x -= halfSize;
                } else if (item.shape === kicad_common_1.Net.BIDI || item.shape === kicad_common_1.Net.TRISTATE) {
                    xOffset = -halfSize;
                    points[0].x += halfSize;
                    points[3].x -= halfSize;
                }
                var angle = 0;
                if (item.orientationType === kicad_sch_1.TextOrientationType.HORIZ_LEFT) {
                    angle = 0;
                } else if (item.orientationType === kicad_sch_1.TextOrientationType.UP) {
                    angle = -900;
                } else if (item.orientationType === kicad_sch_1.TextOrientationType.HORIZ_RIGHT) {
                    angle = 1800;
                } else if (item.orientationType === kicad_sch_1.TextOrientationType.BOTTOM) {
                    angle = 900;
                }
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = points[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var p = _step6.value;

                        p.x += xOffset;
                        if (angle) {
                            kicad_common_1.RotatePoint(p, angle);
                        }
                        p.x += item.posx;
                        p.y += item.posy;
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                points.push(points[0]);
                this.setColor(SCH_COLORS.LAYER_GLOBLABEL);
                this.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            }
            {
                var _p = new kicad_common_1.Point(item.posx, item.posy);
                var width = DEFAULT_LINE_WIDTH;
                var _halfSize = this.font.computeTextLineSize(' ', item.size, width) / 2;
                var offset = width;
                if (item.shape === kicad_common_1.Net.INPUT || item.shape === kicad_common_1.Net.BIDI || item.shape === kicad_common_1.Net.TRISTATE) {
                    offset += _halfSize;
                } else if (item.shape === kicad_common_1.Net.OUTPUT || item.shape === kicad_common_1.Net.UNSPECIFIED) {
                    offset += TXT_MARGIN;
                }
                if (item.orientationType === 0) {
                    _p.x -= offset;
                } else if (item.orientationType === 1) {
                    _p.y -= offset;
                } else if (item.orientationType === 2) {
                    _p.x += offset;
                } else if (item.orientationType === 3) {
                    _p.y += offset;
                }
                this.text(_p, SCH_COLORS.LAYER_GLOBLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, width, item.italic, item.bold);
            }
        }
    }, {
        key: "plotSchTextHierarchicalLabel",
        value: function plotSchTextHierarchicalLabel(item) {
            {
                var p = new kicad_common_1.Point(item.posx, item.posy);
                var halfSize = item.size / 2;
                var template = TEMPLATE_SHAPES[item.shape][item.orientationType];
                var points = [];
                // first of template is number of corners
                for (var i = 1; i < template.length; i += 2) {
                    var x = template[i] * halfSize;
                    var y = template[i + 1] * halfSize;
                    points.push(kicad_common_1.Point.add(new kicad_common_1.Point(x, y), p));
                }
                this.polyline(points, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            }
            ;
            {
                var _p2 = new kicad_common_1.Point(item.posx, item.posy);
                var txtOffset = this.font.computeTextLineSize(' ', item.size, DEFAULT_LINE_WIDTH) + TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
                if (item.orientationType === 0) {
                    _p2.x -= txtOffset;
                } else if (item.orientationType === 1) {
                    _p2.y -= txtOffset;
                } else if (item.orientationType === 2) {
                    _p2.x += txtOffset;
                } else if (item.orientationType === 3) {
                    _p2.y += txtOffset;
                }
                this.text(_p2, SCH_COLORS.LAYER_HIERLABEL, item.text, item.orientation, item.size, item.hjustify, item.vjustify, DEFAULT_LINE_WIDTH, item.italic, item.bold);
            }
        }
    }, {
        key: "plotSchText",
        value: function plotSchText(item) {
            var color = SCH_COLORS.LAYER_NOTES;
            if (item.name1 === 'Label') {
                color = SCH_COLORS.LAYER_LOCLABEL;
            }
            var p = new kicad_common_1.Point(item.posx, item.posy);
            var txtOffset = TXT_MARGIN + DEFAULT_LINE_WIDTH / 2;
            if (item.orientationType === 0) {
                p.y -= txtOffset;
            } else if (item.orientationType === 1) {
                p.x -= txtOffset;
            } else if (item.orientationType === 2) {
                p.y -= txtOffset;
            } else if (item.orientationType === 3) {
                p.x -= txtOffset;
            }
            this.text(p, color, item.text, item.orientation, item.size, item.hjustify, item.vjustify, DEFAULT_LINE_WIDTH, item.italic, item.bold);
        }
    }, {
        key: "getTextBox",
        value: function getTextBox(text, size, lineWidth, invertY) {
            var _this = this;

            var lines = text.text.split(/\n/).map(function (line) {
                return _this.font.computeTextLineSize(text.text, size, lineWidth);
            });
            var dx = Math.max.apply(Math, _toConsumableArray(lines));
            var dy = this.font.getInterline(size, lineWidth) * lines.length;
            var pos = { x: text.posx, y: text.posy };
            if (invertY) {
                pos.y = -pos.y;
            }
            var rect = new kicad_common_1.Rect(pos.x, pos.y, pos.x + dx, pos.y + dy);
            if (text.hjustify === kicad_common_1.TextHjustify.LEFT) {} else if (text.hjustify === kicad_common_1.TextHjustify.CENTER) {
                rect.pos1.x -= rect.width / 2;
            } else if (text.hjustify === kicad_common_1.TextHjustify.RIGHT) {
                rect.pos1.x -= rect.width;
            }
            if (text.vjustify === kicad_common_1.TextVjustify.TOP) {} else if (text.vjustify === kicad_common_1.TextVjustify.CENTER) {
                rect.pos1.y -= dx / 2;
            } else if (text.vjustify === kicad_common_1.TextVjustify.BOTTOM) {
                rect.pos1.y -= dx;
            }
            return rect;
        }
    }]);

    return Plotter;
}();

exports.Plotter = Plotter;

var CanvasPlotter = function (_Plotter) {
    _inherits(CanvasPlotter, _Plotter);

    function CanvasPlotter(ctx) {
        _classCallCheck(this, CanvasPlotter);

        var _this2 = _possibleConstructorReturn(this, (CanvasPlotter.__proto__ || Object.getPrototypeOf(CanvasPlotter)).call(this));

        _this2.ctx = ctx;
        _this2.penState = "Z";
        _this2.fill = kicad_common_1.Fill.NO_FILL;
        _this2.ctx.lineCap = "round";
        _this2.ctx.strokeStyle = "#000";
        return _this2;
    }

    _createClass(CanvasPlotter, [{
        key: "rect",
        value: function rect(p1, p2, fill, width) {
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.moveTo(p1.x, p1.y);
            this.lineTo(p1.x, p2.y);
            this.lineTo(p2.x, p2.y);
            this.lineTo(p2.x, p1.y);
            this.finishTo(p1.x, p1.y);
        }
    }, {
        key: "circle",
        value: function circle(p, dia, fill, width) {
            p = this.transform.transformCoordinate(p);
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, dia / 2, 0, Math.PI * 2, false);
            if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
                this.ctx.fill();
            } else {
                this.ctx.stroke();
            }
        }
    }, {
        key: "arc",
        value: function arc(p, startAngle, endAngle, radius, fill, width) {
            p = this.transform.transformCoordinate(p);
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.ctx.beginPath();
            var anticlockwise = false;
            this.ctx.arc(p.x, p.y, radius, startAngle / 10 * Math.PI / 180, endAngle / 10 * Math.PI / 180, anticlockwise);
            if (fill === kicad_common_1.Fill.FILLED_SHAPE) {
                this.ctx.fill();
            } else {
                this.ctx.stroke();
            }
        }
    }, {
        key: "polyline",
        value: function polyline(points, fill, width) {
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.moveTo(points[0]);
            for (var i = 1, len = points.length; i < len; i++) {
                this.lineTo(points[i]);
            }
            this.finishPen();
        }
        /*
        text(
            p: Point,
            color: Color,
            text: string,
            orientation: number,
            size: number,
            hjustfy: TextHjustify,
            vjustify: TextVjustify,
            width: number,
            italic: boolean,
            bold: boolean,
            multiline?: boolean,
        ): void {
            p = this.transform.transformCoordinate(p);
            this.setColor(color);
            if (hjustfy === TextHjustify.LEFT) {
                this.ctx.textAlign = "left";
            } else
            if (hjustfy === TextHjustify.CENTER) {
                this.ctx.textAlign = "center";
            } else
            if (hjustfy === TextHjustify.RIGHT) {
                this.ctx.textAlign = "right";
            }
            if (vjustify === TextVjustify.TOP) {
                this.ctx.textBaseline = "top";
            } else
            if (vjustify === TextVjustify.CENTER) {
                this.ctx.textBaseline = "middle";
            } else
            if (vjustify === TextVjustify.BOTTOM) {
                this.ctx.textBaseline = "bottom";
            }
            this.ctx.fillStyle = this.color.toCSSColor();
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(-DECIDEG2RAD(orientation));
            this.ctx.font = (italic ? "italic " : "") + (bold ? "bold " : "") + size + "px monospace";
            // console.log('fillText', text, p.x, p.y, hjustfy, vjustify);
            this.ctx.fillText(text, 0, 0);
            this.ctx.restore();
        } */
        /**
         * U = Pen is up
         * D = Pen is down
         * Z = Pen is outof canvas
         */

    }, {
        key: "penTo",
        value: function penTo(p, s) {
            p = this.transform.transformCoordinate(p);
            if (s === "Z") {
                if (this.fill === kicad_common_1.Fill.FILLED_SHAPE) {
                    // console.log('ctx.fill', p);
                    this.ctx.fill();
                } else {
                    // console.log('ctx.stroke', p);
                    this.ctx.stroke();
                }
                this.penState = "Z";
                return;
            }
            // s is U | D
            if (this.penState === "Z") {
                this.ctx.beginPath();
                // console.log('ctx.beginPath');
                // console.log('ctx.moveTo', p);
                this.ctx.moveTo(p.x, p.y);
            } else {
                if (s === "U") {
                    // console.log('ctx.moveTo', p);
                    this.ctx.moveTo(p.x, p.y);
                } else {
                    // console.log('ctx.lineTo', p);
                    this.ctx.lineTo(p.x, p.y);
                }
            }
            this.penState = s;
        }
    }, {
        key: "setColor",
        value: function setColor(c) {
            _get(CanvasPlotter.prototype.__proto__ || Object.getPrototypeOf(CanvasPlotter.prototype), "setColor", this).call(this, c);
            this.ctx.fillStyle = c.toCSSColor();
            this.ctx.strokeStyle = c.toCSSColor();
        }
    }, {
        key: "setCurrentLineWidth",
        value: function setCurrentLineWidth(w) {
            this.ctx.lineWidth = w;
        }
    }, {
        key: "image",
        value: function image(p, scale, originalWidth, originalHeight, data) {
            p = this.transform.transformCoordinate(p);
            var start = kicad_common_1.Point.sub(p, { x: originalWidth / 2, y: originalHeight / 2 });
            var end = kicad_common_1.Point.add(p, { x: originalWidth / 2, y: originalHeight / 2 });
            this.rect(start, end, kicad_common_1.Fill.NO_FILL, DEFAULT_LINE_WIDTH);
        }
    }]);

    return CanvasPlotter;
}(Plotter);

exports.CanvasPlotter = CanvasPlotter;

var SVGPlotter = function (_Plotter2) {
    _inherits(SVGPlotter, _Plotter2);

    function SVGPlotter() {
        _classCallCheck(this, SVGPlotter);

        var _this3 = _possibleConstructorReturn(this, (SVGPlotter.__proto__ || Object.getPrototypeOf(SVGPlotter)).call(this));

        _this3.penState = "Z";
        _this3.output = "";
        _this3.lineWidth = DEFAULT_LINE_WIDTH;
        _this3.color = kicad_common_1.Color.BLACK;
        return _this3;
    }

    _createClass(SVGPlotter, [{
        key: "rect",
        value: function rect(p1, p2, fill, width) {
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.moveTo(p1.x, p1.y);
            this.lineTo(p1.x, p2.y);
            this.lineTo(p2.x, p2.y);
            this.lineTo(p2.x, p1.y);
            this.finishTo(p1.x, p1.y);
        }
    }, {
        key: "circle",
        value: function circle(p, dia, fill, width) {
            this.setCurrentLineWidth(width);
            this.fill = fill;
            p = this.transform.transformCoordinate(p);
            this.output += this.xmlTag(_templateObject, p.x, p.y, dia / 2);
            if (this.fill === kicad_common_1.Fill.NO_FILL) {
                this.output += this.xmlTag(_templateObject2, this.color.toCSSColor(), this.lineWidth);
            } else {
                this.output += this.xmlTag(_templateObject3, this.color.toCSSColor(), this.color.toCSSColor(), this.lineWidth);
            }
        }
    }, {
        key: "arc",
        value: function arc(p, startAngle, endAngle, radius, fill, width) {
            if (radius <= 0) return;
            if (startAngle > endAngle) {
                var _ref = [endAngle, startAngle];
                startAngle = _ref[0];
                endAngle = _ref[1];
            }
            this.setCurrentLineWidth(width);
            this.fill = fill;
            p = this.transform.transformCoordinate(p);
            var _ref2 = [-endAngle, -startAngle];
            startAngle = _ref2[0];
            endAngle = _ref2[1];

            var start = new kicad_common_1.Point(radius, 0);
            kicad_common_1.RotatePoint(start, startAngle);
            var end = new kicad_common_1.Point(radius, 0);
            kicad_common_1.RotatePoint(end, endAngle);
            start = kicad_common_1.Point.add(start, p);
            end = kicad_common_1.Point.add(end, p);
            var theta1 = kicad_common_1.DECIDEG2RAD(startAngle);
            if (theta1 < 0) theta1 += Math.PI * 2;
            var theta2 = kicad_common_1.DECIDEG2RAD(endAngle);
            if (theta2 < 0) theta2 += Math.PI * 2;
            if (theta2 < theta1) theta2 += Math.PI * 2;
            var isLargeArc = Math.abs(theta2 - theta1) > Math.PI;
            var isSweep = false;
            // console.log('ARC', startAngle, endAngle, radius, start, end, radius, isLargeArc, isSweep);
            var x = this.xmlTag;
            this.output += this.xmlTag(_templateObject4, start.x, start.y, radius, radius, isLargeArc ? 1 : 0, isSweep ? 1 : 0, end.x, end.y);
            if (this.fill === kicad_common_1.Fill.NO_FILL) {
                this.output += this.xmlTag(_templateObject2, this.color.toCSSColor(), this.lineWidth);
            } else {
                this.output += this.xmlTag(_templateObject3, this.color.toCSSColor(), this.color.toCSSColor(), this.lineWidth);
            }
        }
    }, {
        key: "polyline",
        value: function polyline(points, fill, width) {
            this.setCurrentLineWidth(width);
            this.fill = fill;
            this.moveTo(points[0]);
            for (var i = 1, len = points.length; i < len; i++) {
                this.lineTo(points[i]);
            }
            this.finishPen();
        }
        /*
        text(
            p: Point,
            color: Color,
            text: string,
            orientation: number,
            size: number,
            hjustfy: TextHjustify,
            vjustify: TextVjustify,
            width: number,
            italic: boolean,
            bold: boolean,
            multiline?: boolean,
        ): void {
            this.setColor(color);
            p = this.transform.transformCoordinate(p);
             let textAnchor;
            if (hjustfy === TextHjustify.LEFT) {
                textAnchor = "start";
            } else
            if (hjustfy === TextHjustify.CENTER) {
                textAnchor = "middle";
            } else
            if (hjustfy === TextHjustify.RIGHT) {
                textAnchor = "end";
            }
            let dominantBaseline;
            if (vjustify === TextVjustify.TOP) {
                dominantBaseline = "text-before-edge";
            } else
            if (vjustify === TextVjustify.CENTER) {
                dominantBaseline = "middle";
            } else
            if (vjustify === TextVjustify.BOTTOM) {
                dominantBaseline = "text-after-edge";
            }
             const fontWeight = bold ? "bold" : "normal";
            const fontStyle = italic ? "italic" : "normal";
             const rotate = -orientation / 10;
            const x = this.xmlTag;
            const lines = text.split(/\n/);
            for (var i = 0, len = lines.length; i < len; i++) {
                const y = p.y + (i * size * 1.2);
                this.output += this.xmlTag `<text x="${p.x}" y="${y}"
                    text-anchor="${textAnchor}"
                    dominant-baseline="${dominantBaseline}"
                    font-family="${SVGPlotter.font.family}"
                    font-size="${size}"
                    font-weight="${fontWeight}"
                    font-style="${fontStyle}"
                    stroke="none"
                    fill="${this.color.toCSSColor()}"
                    transform="rotate(${rotate}, ${p.x}, ${p.y})">${lines[i]}</text>`;
            }
        } */
        /**
         * U = Pen is up
         * D = Pen is down
         * Z = Pen is outof canvas
         */

    }, {
        key: "penTo",
        value: function penTo(p, s) {
            var x = this.xmlTag;
            p = this.transform.transformCoordinate(p);
            if (s === "Z") {
                if (this.penState !== "Z") {
                    if (this.fill === kicad_common_1.Fill.NO_FILL) {
                        this.output += this.xmlTag(_templateObject5, this.color.toCSSColor(), this.lineWidth);
                    } else {
                        this.output += this.xmlTag(_templateObject6, this.color.toCSSColor(), this.color.toCSSColor(), this.lineWidth);
                    }
                } else {
                    throw "invalid pen state Z -> Z";
                }
                this.penState = "Z";
                return;
            }
            // s is U | D
            if (this.penState === "Z") {
                this.output += this.xmlTag(_templateObject7, p.x, p.y);
            } else {
                if (s === "U") {
                    this.output += this.xmlTag(_templateObject8, p.x, p.y);
                } else {
                    this.output += this.xmlTag(_templateObject9, p.x, p.y);
                }
            }
            this.penState = s;
        }
    }, {
        key: "setCurrentLineWidth",
        value: function setCurrentLineWidth(w) {
            this.lineWidth = w;
        }
    }, {
        key: "image",
        value: function image(p, scale, originalWidth, originalHeight, data) {
            p = this.transform.transformCoordinate(p);
            var width = originalWidth * scale;
            var height = originalHeight * scale;
            var start = kicad_common_1.Point.sub(p, { x: width / 2, y: height / 2 });
            var url = 'data:image/png,' + data.reduce(function (r, i) {
                return r + '%' + (0x100 + i).toString(16).slice(1);
            }, "");
            console.log(url);
            /*
            this.rect(start, end, Fill.NO_FILL, DEFAULT_LINE_WIDTH);
            */
            this.output += this.xmlTag(_templateObject10, url, start.x, start.y, width, height);
        }
    }, {
        key: "plotSchematic",
        value: function plotSchematic(sch, libs) {
            var width = sch.descr.width;
            var height = sch.descr.height;
            this.output = this.xmlTag(_templateObject11, width, height, sch.descr.width, sch.descr.height);
            _get(SVGPlotter.prototype.__proto__ || Object.getPrototypeOf(SVGPlotter.prototype), "plotSchematic", this).call(this, sch, libs);
            this.output += "</svg>";
        }
    }, {
        key: "xmlTag",
        value: function xmlTag(literals) {
            var result = "";

            for (var _len = arguments.length, placeholders = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                placeholders[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < placeholders.length; i++) {
                result += literals[i];
                result += this.xmlentities(placeholders[i]);
            }
            result += literals[literals.length - 1];
            return result;
        }
    }, {
        key: "xmlentities",
        value: function xmlentities(s) {
            if (typeof s === "number") return String(s);
            var map = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&x22;',
                "'": '&x27;'
            };
            return String(s).replace(/[<>&]/g, function (_) {
                return map[_];
            });
        }
    }]);

    return SVGPlotter;
}(Plotter);

SVGPlotter.font = {
    family: '"Lucida Console", Monaco, monospace',
    widthRatio: 0.60009765625
};
exports.SVGPlotter = SVGPlotter;

/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * This program source code file is part of kicad-utils.
 * Copyright (C) 2017 cho45 <cho45@lowreal.net>.
 *
 * And this program source code file is imported from KiCad, a free EDA CAD application.
 *
 * Original Author Copyright:
 *
 * Copyright (C) 2015 Jean-Pierre Charras, jaen-pierre.charras@gipsa-lab.inpg.com
 * Copyright (C) 1992-2017 KiCad Developers, see KiCAD AUTHORS.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.STROKE_FONT = [
/* // BASIC LATIN (0020-007F) */
"JZ", "MWRYSZR[QZRYR[ RRSQGRFSGRSRF", "JZNFNJ RVFVJ", "H]LM[M RRDL_ RYVJV RS_YD", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RRCR^", "F^J[ZF RMFOGPIOKMLKKJIKGMF RYZZXYVWUUVTXUZW[YZ", "E_[[Z[XZUWPQNNMKMINGPFQFSGTITJSLRMLQKRJTJWKYLZN[Q[SZTYWUXRXP", "MWSFQJ", "KYVcUbS_R]QZPUPQQLRISGUDVC", "KYNcObQ_R]SZTUTQSLRIQGODNC", "JZRFRK RMIRKWI ROORKUO", "E_JSZS RR[RK", "MWSZS[R]Q^", "E_JSZS", "MWRYSZR[QZRYR[", "G][EI`", "H\\QFSFUGVHWJXNXSWWVYUZS[Q[OZNYMWLSLNMJNHOGQF", "H\\X[L[ RR[RFPINKLL", "H\\LHMGOFTFVGWHXJXLWOK[X[", "H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY", "H\\VMV[ RQELTYT", "H\\WFMFLPMOONTNVOWPXRXWWYVZT[O[MZLY", "H\\VFRFPGOHMKLOLWMYNZP[T[VZWYXWXRWPVOTNPNNOMPLR", "H\\KFYFP[", "H\\PONNMMLKLJMHNGPFTFVGWHXJXKWMVNTOPONPMQLSLWMYNZP[T[VZWYXWXSWQVPTO", "H\\N[R[TZUYWVXRXJWHVGTFPFNGMHLJLOMQNRPSTSVRWQXO", "MWRYSZR[QZRYR[ RRNSORPQORNRP", "MWSZS[R]Q^ RRNSORPQORNRP", "E_ZMJSZY", "E_JPZP RZVJV", "E_JMZSJY", "I[QYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS", "D_VQUPSOQOOPNQMSMUNWOXQYSYUXVW RVOVWWXXXZW[U[PYMVKRJNKKMIPHTIXK[N]R^V]Y[", "I[MUWU RK[RFY[", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[", "H[MPTP RW[M[MFWF", "HZTPMP RM[MFWF", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR", "G]L[LF RLPXP RX[XF", "MWR[RF", "JZUFUUTXRZO[M[", "G\\L[LF RX[OO RXFLR", "HYW[M[MF", "F^K[KFRUYFY[", "G]L[LFX[XF", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "G\\L[LFTFVGWHXJXMWOVPTQLQ", "G]Z]X\\VZSWQVOV RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG", "JZLFXF RR[RF", "G]LFLWMYNZP[T[VZWYXWXF", "I[KFR[YF", "F^IFN[RLV[[F", "H\\KFY[ RYFK[", "I[RQR[ RKFRQYF", "H\\KFYFK[Y[", "KYVbQbQDVD", "KYID[_", "KYNbSbSDND", "LXNHREVH", "JZJ]Z]", "NVPESH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR", "H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ", "HZVZT[P[NZMYLWLQMONNPMTMVN", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT", "MYOMWM RR[RISGUFWF", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN", "H[M[MF RV[VPUNSMPMNNMO", "MWR[RM RRFQGRHSGRFRH", "MWRMR_QaObNb RRFQGRHSGRFRH", "IZN[NF RPSV[ RVMNU", "MXU[SZRXRF", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[", "I\\NMN[ RNOONQMTMVNWPW[", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ", "I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN", "KXP[PM RPQQORNTMVM", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN", "MYOMWM RRFRXSZU[W[", "H[VMV[ RMMMXNZP[S[UZVY", "JZMMR[WM", "G]JMN[RQV[ZM", "IZL[WM RLMW[", "JZMMR[ RWMR[P`OaMb", "IZLMWML[W[", "KYVcUcSbR`RVQTOSQRRPRFSDUCVC", "H\\RbRD", "KYNcOcQbR`RVSTUSSRRPRFQDOCNC", "KZMSNRPQTSVRWQ", "F^K[KFYFY[K[",
/* // LATIN-1 SUPPLEMENT (0080-00FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "JZ", "MWROQNRMSNRORM RRUSaRbQaRURb", "HZVZT[P[NZMYLWLQMONNPMTMVN RRJR^", "H[LMTM RL[W[ RO[OIPGRFUFWG", "H]LYOV RLLOO RVVYY RVOYL RVVTWQWOVNTNQOOQNTNVOWQWTVV", "F^JTZT RJMZM RRQR[ RKFRQYF", "MWRbRW RRFRQ", "I[N]P^S^U]V[UYOSNQNPONQM RVGTFQFOGNIOKUQVSVTUVSW", "LXNFOGNHMGNFNH RVFWGVHUGVFVH", "@dVKTJPJNKLMKOKSLUNWPXTXVW RRCMDHGELDQEVH[M^R_W^\\[_V`Q_L\\GWDRC", "KZOEQDSDUEVGVN RVMTNQNOMNKOIQHVH", "H\\RMLSRY RXWTSXO", "E_JQZQZV", "RR", "@dWXRR RNXNJTJVKWMWOVQTRNR RRCMDHGELDQEVH[M^R_W^\\[_V`Q_L\\GWDRC", "LXMGWG", "JZRFPGOIPKRLTKUITGRF", "E_JOZO RRWRG RZ[J[", "JZNAP@S@UAVCVEUGNNVN", "JZN@V@RESEUFVHVKUMSNPNNM", "NVTEQH", "H^MMMb RWXXZZ[ RMXNZP[T[VZWXWM", "F]VMV[ ROMOXNZL[ RZMMMKNJP", "JZRRQSRTSSRRRT", "MWR\\T]U_TaRbOb", "JZVNNN RNCPBR@RN", "KYQNOMNKNGOEQDSDUEVGVKUMSNQN", "H\\RMXSRY RLWPSLO", "G]KQYQ RVNNN RNCPBR@RN RUYUa RQSN]W]", "G]KQYQ RVNNN RNCPBR@RN RNTPSSSUTVVVXUZNaVa", "G]KQYQ RN@V@RESEUFVHVKUMSNPNNM RUYUa RQSN]W]", "I[SORNSMTNSOSM RWaUbPbNaM_M]N[OZQYRXSVSU", "I[MUWU RK[RFY[ RP>SA", "I[MUWU RK[RFY[ RT>QA", "I[MUWU RK[RFY[ RNAR>VA", "I[MUWU RK[RFY[ RMAN@P?TAV@W?", "I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "I[MUWU RK[RFY[ RRFPEOCPAR@TAUCTERF", "F`JURU RRPYP RH[OF\\F RRFR[\\[", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb", "H[MPTP RW[M[MFWF RP>SA", "H[MPTP RW[M[MFWF RT>QA", "H[MPTP RW[M[MFWF RNAR>VA", "H[MPTP RW[M[MFWF RN?O@NAM@N?NA RV?W@VAU@V?VA", "MWR[RF RP>SA", "MWR[RF RT>QA", "MWR[RF RNAR>VA", "MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP", "G]L[LFX[XF RMAN@P?TAV@W?", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RP>SA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RT>QA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W?", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA", "E_LMXY RXMLY", "G]ZFJ[ RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[", "G]LFLWMYNZP[T[VZWYXWXF RP>SA", "G]LFLWMYNZP[T[VZWYXWXF RT>QA", "G]LFLWMYNZP[T[VZWYXWXF RNAR>VA", "G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA", "I[RQR[ RKFRQYF RT>QA", "G\\LFL[ RLKTKVLWMXOXRWTVUTVLV", "F]K[KJLHMGOFRFTGUHVJVMSMQNPPPQQSSTVTXUYWYXXZV[R[PZ", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RPESH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RTEQH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RMHNGPFTHVGWF", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRHPGOEPCRBTCUETGRH", "D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX", "HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RPESH", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RTEQH", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNFOGNHMGNFNH RVFWGVHUGVFVH", "MWR[RM RPESH", "MWR[RM RTEQH", "LXNHREVH RR[RM", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RR[RM", "I\\SCQI RWNUMQMONNOMQMXNZP[T[VZWXWLVITGRFNE", "I\\NMN[ RNOONQMTMVNWPW[ RMHNGPFTHVGWF", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RPESH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "E_ZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN", "H[XMK[ RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "H[VMV[ RMMMXNZP[S[UZVY RPESH", "H[VMV[ RMMMXNZP[S[UZVY RTEQH", "H[VMV[ RMMMXNZP[S[UZVY RNHREVH", "H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH", "JZMMR[ RWMR[P`OaMb RTEQH", "H[MFMb RMNOMSMUNVOWQWWVYUZS[O[MZ", "JZMMR[ RWMR[P`OaMb RNFOGNHMGNFNH RVFWGVHUGVFVH",
/* // LATIN EXTENDED-A (0100-017F) */
"I[MUWU RK[RFY[ RM@W@", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RMGWG", "I[MUWU RK[RFY[ RN>O@QASAU@V>", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE", "I[MUWU RK[RFY[ RY[W]V_WaYb[b", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RW[U]T_UaWbYb", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RT>QA", "HZVZT[P[NZMYLWLQMONNPMTMVN RTEQH", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RNAR>VA", "HZVZT[P[NZMYLWLQMONNPMTMVN RNHREVH", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR?Q@RAS@R?RA", "HZVZT[P[NZMYLWLQMONNPMTMVN RRFQGRHSGRFRH", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RN>RAV>", "HZVZT[P[NZMYLWLQMONNPMTMVN RNERHVE", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RN>RAV>", "IfW[WF RWZU[Q[OZNYMWMQNOONQMUMWN RbF`J", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RRHZH", "H[MPTP RW[M[MFWF RM@W@", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG", "H[MPTP RW[M[MFWF RN>O@QASAU@V>", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNEOGQHSHUGVE", "H[MPTP RW[M[MFWF RR?Q@RAS@R?RA", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRFQGRHSGRFRH", "H[MPTP RW[M[MFWF RR[P]O_PaRbTb", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR[P]O_PaRbTb", "H[MPTP RW[M[MFWF RN>RAV>", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNERHVE", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RNAR>VA", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNHREVH", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RN>O@QASAU@V>", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNEOGQHSHUGVE", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RR?Q@RAS@R?RA", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RRFQGRHSGRFRH", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RR\\T]U_TaRbOb", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RRGPFODPBRAUA", "G]L[LF RLPXP RX[XF RNAR>VA", "H[M[MF RV[VPUNSMPMNNMO RIAM>QA", "G]IJ[J RL[LF RLPXP RX[XF", "H[M[MF RV[VPUNSMPMNNMO RJHRH", "MWR[RF RMAN@P?TAV@W?", "MWR[RM RMHNGPFTHVGWF", "MWR[RF RM@W@", "MWR[RM RMGWG", "MWR[RF RN>O@QASAU@V>", "MWR[RM RNEOGQHSHUGVE", "MWR[RF RR[P]O_PaRbTb", "MWR[RM RR[P]O_PaRbTb", "MWR[RF RR?Q@RAS@R?RA", "MWR[RM", "MgR[RF RbFbUaX_Z\\[Z[", "MaR[RM RRFQGRHSGRFRH R\\M\\_[aYbXb R\\F[G\\H]G\\F\\H", "JZUFUUTXRZO[M[ RQAU>YA", "MWRMR_QaObNb RNHREVH", "G\\L[LF RX[OO RXFLR RR\\T]U_TaRbOb", "IZN[NF RPSV[ RVMNU RR\\T]U_TaRbOb", "IZNMN[ RPSV[ RVMNU", "HYW[M[MF RO>LA", "MXU[SZRXRF RTEQH", "HYW[M[MF RR\\T]U_TaRbOb", "MXU[SZRXRF RR\\T]U_TaRbOb", "HYW[M[MF RVHSK", "M^U[SZRXRF RZFXJ", "HYW[M[MF RUNTOUPVOUNUP", "M\\U[SZRXRF RYOZPYQXPYOYQ", "HYW[M[MF RJQPM", "MXU[SZRXRF ROQUM", "G]L[LFX[XF RT>QA", "I\\NMN[ RNOONQMTMVNWPW[ RTEQH", "G]L[LFX[XF RR\\T]U_TaRbOb", "I\\NMN[ RNOONQMTMVNWPW[ RR\\T]U_TaRbOb", "G]L[LFX[XF RN>RAV>", "I\\NMN[ RNOONQMTMVNWPW[ RNERHVE", "MjSFQJ R\\M\\[ R\\O]N_MbMdNePe[", "G]LFL[ RLINGPFTFVGWHXJX^W`VaTbQb", "I\\NMN[ RNOONQMTMVNWPW_VaTbRb", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN>O@QASAU@V>", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNEOGQHSHUGVE", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RQ>NA RX>UA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQENH RXEUH", "E`RPYP RRFR[ R\\FNFLGJIIMITJXLZN[\\[", "C`[ZY[U[SZRXRPSNUMYM[N\\P\\RRT RRQQOPNNMKMINHOGQGWHYIZK[N[PZQYRW", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RT>QA", "KXP[PM RPQQORNTMVM RTEQH", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RR\\T]U_TaRbOb", "KXP[PM RPQQORNTMVM RR\\T]U_TaRbOb", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RN>RAV>", "KXP[PM RPQQORNTMVM RNERHVE", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RT>QA", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RTEQH", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RNAR>VA", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNHREVH", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR\\T]U_TaRbOb", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RR\\T]U_TaRbOb", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RN>RAV>", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNERHVE", "JZLFXF RR[RF RR\\T]U_TaRbOb", "MYOMWM RRFRXSZU[W[ RR\\T]U_TaRbOb", "JZLFXF RR[RF RN>RAV>", "M[OMWM RYFXI RRFRXSZU[W[", "JZLFXF RR[RF RNQVQ", "MYOMWM RRFRXSZU[W[ ROSUS", "G]LFLWMYNZP[T[VZWYXWXF RMAN@P?TAV@W?", "H[VMV[ RMMMXNZP[S[UZVY RMHNGPFTHVGWF", "G]LFLWMYNZP[T[VZWYXWXF RM@W@", "H[VMV[ RMMMXNZP[S[UZVY RMGWG", "G]LFLWMYNZP[T[VZWYXWXF RN>O@QASAU@V>", "H[VMV[ RMMMXNZP[S[UZVY RNEOGQHSHUGVE", "G]LFLWMYNZP[T[VZWYXWXF RRAP@O>P<R;T<U>T@RA", "H[VMV[ RMMMXNZP[S[UZVY RRHPGOEPCRBTCUETGRH", "G]LFLWMYNZP[T[VZWYXWXF RQ>NA RX>UA", "H[VMV[ RMMMXNZP[S[UZVY RQENH RXEUH", "G]LFLWMYNZP[T[VZWYXWXF RR[P]O_PaRbTb", "H[VMV[ RMMMXNZP[S[UZVY RV[T]S_TaVbXb", "F^IFN[RLV[[F RNAR>VA", "G]JMN[RQV[ZM RNHREVH", "I[RQR[ RKFRQYF RNAR>VA", "JZMMR[ RWMR[P`OaMb RNHREVH", "JZLFXF RR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA", "H\\KFYFK[Y[ RT>QA", "IZLMWML[W[ RTEQH", "H\\KFYFK[Y[ RR?Q@RAS@R?RA", "IZLMWML[W[ RRFQGRHSGRFRH", "H\\KFYFK[Y[ RN>RAV>", "IZLMWML[W[ RNERHVE", "MYR[RISGUFWF",
/* // LATIN EXTENDED-B (0180-024F) */
"H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RJHRH", "C\\LFL[T[VZWYXWXTWRVQSPLP RFKFIGGIFSFUGVHWJWLVNUOSP", "G\\VFLFL[R[UZWXXVXSWQUORNLN", "H[WFMFM[ RMNOMSMUNVOWQWWVYUZS[O[MZ", "H]MFM[S[VZXXYVYSXQVOSNMN", "IZNMN[S[UZVXVUUSSRNR", "I^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZMY", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RMHKGJEKCLB", "HZVZT[P[NZMYLWLQMONNPMTMVN RTMTIUGWFYF", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP", "C\\FKFIGGIFQFTGVIWKXOXRWVVXTZQ[L[LF", "H]NFXFX[R[OZMXLVLSMQOORNXN", "I\\MFWFW[ RWNUMQMONNOMQMWNYOZQ[U[WZ", "I\\Q[T[VZWYXWXQWOVNTMQMONNOMQMWNYOZQ[T\\V]W_VaTbPbNa", "I\\WPPP RM[W[WFMF", "F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP", "G[PPTP RWGUFPFNGMHLJLLMNNOPPMQLRKTKWLYMZO[U[WZ", "HZTPMP RM[MFWF RM[M_LaJbHb", "MYOMWM RR[RISGUFWF RR[R_QaObMb", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RMHKGJEKCLB", "I[KFU[U_TaRbPaO_O[YF", "D`I[IF RIOJNLMOMQNRPRXSZU[X[ZZ[Y\\W\\P[NZM", "MZRFRWSYTZV[X[", "MWR[RF RNPVP", "G_L[LF RX[OO RLRWGYF[G\\I\\K", "IZNMN[ RPSV[ RVMNU RNMNIOGQFSF", "MXU[SZRXRF RNOVO", "JZRMM[ RMFOFPGRMW[ RNLTH", "Ca\\F\\[ R\\XZZX[V[TZSYRWRF RRWQYPZN[L[JZIYHWHF", "G]L[LFX[XF RL[L_KaIbGb", "I\\NMN[ RNOONQMTMVNWPWb", "G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH", "DaSGQFMFKGIIHMHTIXKZM[Q[SZUXVTVMUISGUFYF[G\\I\\b", "E^RNPMMMKNJOIQIWJYKZM[P[RZSYTWTQSORNTMVMXNYPYb", "C\\LFL[ RFKFIGGIFTFVGWHXJXMWOVPTQLQ", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RRMRISGUFWF", "G\\LFL[ RQVXb RLKTKVLWMXOXRWTVUTVLV", "H\\XZU[P[NZMYLWLUMSNRPQTPVOWNXLXJWHVGTFOFLG", "IZVZT[P[NZMXMWNUPTSTUSVQVPUNSMPMNN", "H[W[L[SPLFWF", "JYWbUbSaR_RIQGOFMGLIMKOLQKRI", "MYOMWM RRFRXSZU[W[ RW[W_VaTbRb", "HZR[RF RKKKILGNFXF", "MYOMWM RWFUFSGRIRXSZU[W[", "JZLFXF RR[RF RR[R_SaUbWb", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG", "F^ZFUFUJWKYMZPZUYXWZT[P[MZKXJUJPKMMKOJOFJF", "G]LFLWMYNZP[T[VZXXYVYIXGWF", "I`RQR[ RKFRQXGZF\\G]I]K", "J^MMR[ RMbOaP`R[VNXMZN[P[R", "H\\KFYFK[Y[ RNPVP", "IZLMWML[W[ RNTVT", "H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY", "H\\YFLFSNPNNOMPLRLWMYNZP[V[XZYY", "JZWMNMUVRVPWOXNZN^O`PaRbUbWa", "JZMMVMOTSTUUVWVXUZS[Q[O\\N^N_OaQbVb", "H\\LHMGOFTFVGWHXJXLWOK[X[ RNSVS", "H\\WFMFLPMOONTNVOWPXRXWWYVZT[O[MZLY", "JZVMOMNSPRSRUSVUVXUZS[P[NZ", "J^MZP[T[WZYXZVZSYQWOTNPNPF RLITI", "H[MMMb RMONNPMTMVNWPWSVUM^", "MWRFRb", "JZOFOb RUFUb", "MWRFRb ROWUW ROQUQ", "MWRYSZR[QZRYR[ RRSQGRFSGRSRF", "GpL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_FmF_[m[ Rb>fAj>", "GmL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_MjM_[j[ RaEeHiE", "ImW[WF RWZU[Q[OZNYMWMQNOONQMUMWN R_MjM_[j[ RaEeHiE", "HiW[M[MF RdFdUcXaZ^[\\[", "HcW[M[MF R^M^_]a[bZb R^F]G^H_G^F^H", "MbU[SZRXRF R]M]_\\aZbYb R]F\\G]H^G]F]H", "GmL[LFX[XF RhFhUgXeZb[`[", "GgL[LFX[XF RbMb_aa_b^b RbFaGbHcGbFbH", "IfNMN[ RNOONQMTMVNWPW[ RaMa_`a^b]b RaF`GaHbGaFaH", "I[MUWU RK[RFY[ RN>RAV>", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNERHVE", "MWR[RF RN>RAV>", "MWR[RM RNERHVE", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN>RAV>", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNERHVE", "G]LFLWMYNZP[T[VZWYXWXF RN>RAV>", "H[VMV[ RMMMXNZP[S[UZVY RNERHVE", "G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;", "H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@", "G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RT9Q<", "H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RN9R<V9", "H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RN>RAV>", "G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RP9S<", "H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA", "I[NNPMTMVNWPWXVZT[P[NZMXMVWT", "I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@", "I[MUWU RK[RFY[ RR?Q@RAS@R?RA RM;W;", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRFQGRHSGRFRH RM@W@", "F`JURU RRPYP RH[OF\\F RRFR[\\[ RO@Y@", "D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX RMGWG", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RSV[V", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RS^[^", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RN>RAV>", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNERHVE", "G\\L[LF RX[OO RXFLR RN>RAV>", "IZN[NF RPSV[ RVMNU RJANDRA", "G]R[P]O_PaRbTb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "H[R[P]O_PaRbTb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "G]R[P]O_PaRbTb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@", "H[R[P]O_PaRbTb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG", "H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY RN>RAV>", "JZMMVMOVRVTWUXVZV^U`TaRbObMa RNERHVE", "MWRMR_QaObNb RNERHVE", "GpL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_FmF_[m[", "GmL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_MjM_[j[", "ImW[WF RWZU[Q[OZNYMWMQNOONQMUMWN R_MjM_[j[", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RT>QA", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RTEQH", "CaH[HF RHPTP RTFTXUZW[Z[\\Z]X]M", "G\\LFLb RLINGPFTFVGWHXJXOWRUUL^", "G]L[LFX[XF RP>SA", "I\\NMN[ RNOONQMTMVNWPW[ RPESH", "I[MUWU RK[RFY[ RZ9X< RR;P<O>P@RAT@U>T<R;", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RZ@XC RRBPCOEPGRHTGUETCRB", "F`JURU RRPYP RH[OF\\F RRFR[\\[ RV>SA", "D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX RTEQH", "G]ZFJ[ RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[ RT>QA", "H[XMK[ RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH", "I[MUWU RK[RFY[ ROAL> RVAS>", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR ROHLE RVHSE", "I[MUWU RK[RFY[ RNAO?Q>S>U?VA", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHOFQESEUFVH", "H[MPTP RW[M[MFWF ROAL> RVAS>", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT ROHLE RVHSE", "H[MPTP RW[M[MFWF RNAO?Q>S>U?VA", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHOFQESEUFVH", "MWR[RF ROAL> RVAS>", "MWR[RM ROHLE RVHSE", "MWR[RF RNAO?Q>S>U?VA", "MWR[RM RNHOFQESEUFVH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF ROAL> RVAS>", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ ROHLE RVHSE", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAO?Q>S>U?VA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHOFQESEUFVH", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ ROAL> RVAS>", "KXP[PM RPQQORNTMVM RPHME RWHTE", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RNAO?Q>S>U?VA", "KXP[PM RPQQORNTMVM ROHPFRETEVFWH", "G]LFLWMYNZP[T[VZWYXWXF ROAL> RVAS>", "H[VMV[ RMMMXNZP[S[UZVY ROHLE RVHSE", "G]LFLWMYNZP[T[VZWYXWXF RNAO?Q>S>U?VA", "H[VMV[ RMMMXNZP[S[UZVY RNHOFQESEUFVH", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RS`SaRcQd", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RS`SaRcQd", "JZLFXF RR[RF RS`SaRcQd", "MYOMWM RRFRXSZU[W[ RU`UaTcSd", "I]VRXTYVY[X]V_T`Lb RLHMGOFUFWGXHYJYNXPVRTSNU", "J[UWVXWZW]V_U`SaMb RMNOMSMUNVOWQWTVVUWSXOY", "G]L[LF RLPXP RX[XF RN>RAV>", "H[M[MF RV[VPUNSMPMNNMO RI>MAQ>", "G]L[LFX[XF RX[Xb", "IbWFWXXZZ[\\[^Z_X^V\\UZVV^ RWNUMQMONNOMQMWNYOZQ[T[VZWX", "G]NFLGKIKKLMMNOO RVFXGYIYKXMWNUO ROOUOWPXQYSYWXYWZU[O[MZLYKWKSLQMPOO", "J[MJMMNORQVOWMWJ RPQTQVRWTWXVZT[P[NZMXMTNRPQ", "H\\KFYFK[Y[ RY[Y_XaVbTb", "IZLMWML[W[ RW[W_VaTbRb", "I[MUWU RK[RFY[ RR?Q@RAS@R?RA", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRFQGRHSGRFRH", "H[MPTP RW[M[MFWF RR\\T]U_TaRbOb", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR\\T]U_TaRbOb", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RM;W;", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RM@W@", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RR?Q@RAS@R?RA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRFQGRHSGRFRH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RR?Q@RAS@R?RA RM;W;", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRFQGRHSGRFRH RM@W@", "I[RQR[ RKFRQYF RM@W@", "JZMMR[ RWMR[P`OaMb RMGWG", "M]RFRXSZU[W[YZZXYVWUUVQ^", "IbNMN[ RNOONQMTMVNWPWXXZZ[\\[^Z_X^V\\UZVV^", "M]OMWM RRFRXSZU[W[YZZXYVWUUVQ^", "MWRMR_QaObNb", "D`R[RF RRZP[L[JZIYHWHQIOJNLMPMRN RTMXMZN[O\\Q\\W[YZZX[T[RZ", "D`RMRb RRZP[L[JZIYHWHQIOJNLMPMRN RTMXMZN[O\\Q\\W[YZZX[T[RZ", "I[MUWU RK[RFY[ RXCL`", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RXCL`", "HZVZT[P[NZMYLWLQMONNPMTMVN RWHM`", "HYW[M[MF RIOQO", "JZLFXF RR[RF RXCL`", "J[P[R^T_W_ RNZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN", "IZLMWML[N[P\\R^T_W_", "J^MGPFTFWGYIZKZNYPWRTSPSP[", "J^NNPMTMVNWOXQXSWUVVTWPWP[", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RIUOU", "G]IM[M RLFLWMYNZP[T[VZWYXWXF", "I[Y[RFK[", "H[MPTP RW[M[MFWF RXCL`", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RWHM`", "JZUFUUTXRZO[M[ RQPYP", "MWRMR_QaObNb ROTUT RRFQGRHSGRFRH", "G]XFX^Y`Za\\b^b RXIVGTFPFNGLIKMKTLXNZP[T[VZXX", "I\\WMW^X`Ya[b]b RWZU[Q[OZNYMWMQNOONQMUMWN", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RIQOQ", "KXP[PM RPQQORNTMVM RMTUT", "I[KIYI RRQR[ RKFRQYF", "JZLQXQ RMMR[ RWMR[P`OaMb",
/* // IPA EXTENSIONS (0250-02AF) */
"H[MMMXNZP[T[VZ RMNOMTMVNWPWRVTTUOUMV", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[", "G\\K[NQOOPNRMTMVNWOXRXVWYVZT[R[PZOYNWMPLNJM", "H[RFPFNGMIM[ RMNOMSMUNVOWQWWVYUZS[O[MZ", "J\\NNPMTMVNWOXQXWWYVZT[P[NZ", "HZVNTMPMNNMOLQLWMYNZP[S[UZVXUVSUQVM^", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RW[W_XaZb\\b", "I\\\\FZFXGWIW[ RWZU[Q[OZNYMWMQNOONQMUMWN", "I[NZP[T[VZWXWPVNTMPMNNMPMRWT", "I[NNPMTMVNWPWXVZT[P[NZMXMVWT", "IbNNPMTMVNWPWXVZT[P[NZMXMV\\S\\U]W_X`X", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN", "J[TTVSWQWPVNTMPMNN RRTTTVUWWWXVZT[P[NZ", "JaRTTTVUWWWXVZT[P[NZ RNNPMTMVNWPWQVSTT[S[U\\W^X_X", "H[TTVSWQWPVNTMPMNNMOLRLVMYNZP[T[VZWXWWVUTTRT", "MWRMR_QaObNb ROTUT", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RWMWIXGZF\\F", "I\\WYVZT[P[NZMXMQNOONQMWMW^V`UaSbMb", "HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU", "JZMMU[U_TaRbPaO_O[WM", "JZMMTVUXTZR[PZOXPVWM", "I\\WMWb RNMNXOZQ[T[VZWY", "H[RFPFNGMIM[ RV[VPUNSMPMNNMO", "H[RFPFNGMIM[ RV[VPUNSMPMNNMO RV[V_UaSbQb", "MWR[RM ROTUT RRFQGRHSGRFRH", "MXRMRXSZU[", "MWR[RM RU[O[ RUMOM", "MXU[SZRXRF RMONNPMTOVNWM", "IYU[SZRXRF RRQQOONMOLQMSOTWT", "MXRFR_SaUbWb", "GZLFLXMZO[ RLMVMOVRVTWUXVZV^U`TaRbObMa", "D`[M[[ R[YZZX[U[SZRXRM RRXQZO[L[JZIXIM", "D`[M[[ R[YZZX[U[SZRXRM RRXQZO[L[JZIXIM R[[[b", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ R[[[_ZaXbVb", "I\\NMN[ RNOONQMTMVNWPW[ RN[N_MaKbIb", "I\\NMN[ RNOONQMTMVNWPW[ RW[W_XaZb\\b", "H[M[MMV[VM", "H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "E]RTXT RRMR[ RZMMMKNJOIQIWJYKZM[Z[", "G]RTRXSZU[V[XZYXYQXOWNUMOMMNLOKQKXLZN[O[QZRX", "G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM", "LYTMT[ RTWSYRZP[N[", "LYTMT[ RTWSYRZP[N[ RTMTF", "LYTMT[ RTWSYRZP[N[ RT[T_UaWbYb", "KXP[PM RPQQORNTMVM RP[Pb", "KXP[PM RPQQORNTMVM RP[P_QaSbUb", "KXM[S[ RVMTMRNQOPRP[", "LYW[Q[ RNMPMRNSOTRT[", "I[RUW[ RN[NMTMVNWPWRVTTUNU", "I[RSWM RNMN[T[VZWXWVVTTSNS", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RN[N_OaQbSb", "KYWFUFSGRIR_QaObMb", "MWRMR_QaObNb ROTUT RRMRISGUFWF", "KYMFOFQGRIRXSZU[W[", "KYWFUFSGRIR_QaObMaL_M]O\\V\\", "KWU[M[ RRbRPQNOMMM", "MYOMWM RRFR_SaUbWb", "H[JRYR RVMV[ RMMMXNZP[S[UZVY", "I\\XMUMUPWRXTXWWYVZT[Q[OZNYMWMTNRPPPMMM", "H[MMMXNZP[S[UZVYWWWPVNUM", "JZW[RMM[", "G]Z[VMRWNMJ[", "JZW[RM RM[RMTHUGWF", "KYRTR[ RMMRTWM", "IZLMWML[W[ RW[W_XaZb\\b", "IZLMWML[T[VZWXVVTURVN^", "JZMMVMOVRVTWUXVZV^U`TaRbObMa", "JZMMVMOVRVTWUXVZV^U`TaRbPbNaM_N]P\\R]Uc", "J^MGPFTFWGYIZKZNYPWRTSPSP[", "FZWGTFPFMGKIJKJNKPMRPSTST[", "J^MZP[T[WZYXZVZSYQWOTNPNPF", "F[WHVGSFQFNGLIKKJOJYK]L_NaQbSbVaW`", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RROQPRQSPRORQ", "I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT", "I\\PTNUMWMXNZP[T[VZWYXVXRWOVNTMPMNNMPMQNSPTRT", "HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU RUMUIVGXFZF", "H[MTVT RMMM[ RVMV[", "LXRMR_QaObMaL_M]O\\V\\ RRFQGRHSGRFRH", "J[VMVb RTUNM RN[VS", "JYOMO[V[", "I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN RWMWIXGZF\\F", "J^MGPFTFWGYIZKZNYPWRTSPSP[ RLXTX", "FZWGTFPFMGKIJKJNKPMRPSTST[ RPXXX", "D`R[RF RRM]MR[][ RRZP[L[JZIYHWHQIOJNLMPMRN", "E`RFR[ RRNPMMMKNJOIQIWJYKZM[P[RZ RRM\\MUVXVZW[X\\Z\\^[`ZaXbUbSa", "D`R[RF RRM]MR[Z[\\Z]X\\VZUXVT^ RRZP[L[JZIYHWHQIOJNLMPMRN", "G^IMQM RLFLXMZO[QZS[W[YZZXZWYUWTTTRSQQQPRNTMWMYN", "I[KMTM RNFNXOZQ[T[ RYFWFUGTIT_SaQbOb", "F^HMPM RKFKXLZN[P[RZ RZNXMTMRNQOPQPWQYRZT[W[YZZXYVWUUVQ^", "F]HMPMP[ RK[KILGNFPF RPOQNSMVMXNYPY_XaVbTb", "G^LFLXMZO[QZS[W[YZZXZWYUWTTTRSQQQPRNTMWMYN", "H^MM[MP[ RMFMXNZP[[[", "G]JSN[RUV[ZS RJFNNRHVNZF", "G]XXXSLSLX RXKXFLFLK", "I\\WMWb RNMNXOZQ[T[VZWY RNMNIMGKFIF", "I\\\\bZbXaW_WM RNMNXOZQ[T[VZWY RNMNIMGKFIF",
/* // SPACING MODIFIER LETTERS (02B0-02FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // COMBINING DIACRITICAL MARKS (0300-036F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // GREEK AND COPTIC (0370-03FF) */
"H[MFM[ RXPMP", "IZNTVT RNMN[", "G]R[RF RKOKFYFYO", "I[R[RF RMOMFWFWO", "MWSFQJ", "MWS[Q_", "G]LFL[XFX[", "H\\MMM[WMW[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "NVR`RcSdTd", "J\\NZP[T[VZWYXWXQWOVNTMPMNN", "HZVZT[P[NZMYLWLQMONNPMTMVN RRSQTRUSTRSRU", "J\\NZP[T[VZWYXWXQWOVNTMPMNN RRSQTRUSTRSRU", "MWSZS[R]Q^ RRNSORPQORNRP", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "NVTEQH", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "G[MUWU RK[RFY[ RMEJH", "JZRRQSRTSSRRRT", "B[MPTP RW[M[MFWF RHEEH", "A]L[LF RLPXP RX[XF RGEDH", "GWR[RF RMEJH", "RR", "B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH", "RR", "@[RQR[ RKFRQYF RFECH", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH", "MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "I[MUWU RK[RFY[", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP", "HZM[MFXF", "I[K[RFY[K[", "H[MPTP RW[M[MFWF", "H\\KFYFK[Y[", "G]L[LF RLPXP RX[XF", "F^OPUP RPFTFVGXIYKZNZSYVXXVZT[P[NZLXKVJSJNKKLINGPF", "MWR[RF", "G\\L[LF RX[OO RXFLR", "I[K[RFY[", "F^K[KFRUYFY[", "G]L[LFX[XF", "H[L[W[ RLFWF RUPNP", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "G]L[LFXFX[", "G\\L[LFTFVGWHXJXMWOVPTQLQ", "RR", "H[W[L[SPLFWF", "JZLFXF RR[RF", "I[RQR[ RKFRQYF", "G]R[RF RPITIWJYLZNZRYTWVTWPWMVKTJRJNKLMJPI", "H\\KFY[ RYFK[", "G]R[RF RHFJGKIKNLQMROSUSWRXQYNYIZG\\F", "F^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[", "MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA", "I[RQR[ RKFRQYF RN?O@NAM@N?NA RV?W@VAU@V?VA", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH", "I\\NMN[ RNOONQMTMVNWPWb RTEQH", "MXRMRXSZU[ RTEQH", "H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[", "H[SOUPVQWSWWVYUZS[P[NZMY RKbLaM_MINGPFSFUGVIVLUNSOQO", "JZRYRb RLMMMNNRYWM", "H[SMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSMPLNKMINGPFTFVG", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN", "HZMFWFPMNPMSMWNYOZQ[S[U\\V^V_UaSbRb", "I\\NMN[ RNOONQMTMVNWPWb", "H[LPWP RPFSFUGVHWKWVVYUZS[P[NZMYLVLKMHNGPF", "MXRMRXSZU[", "IZNMN[ RPSV[ RVMNU", "JZRMM[ RMFOFPGRMW[", "H^MMMb RWXXZZ[ RMXNZP[T[VZWXWM", "J[MMR[WPWOVM", "HZMFWF RQFOGNINLONQOUO RQOOPNQMSMWNYOZQ[S[U\\V^V_UaSbRb", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "F]VMV[ ROMOXNZL[ RZMMMKNJP", "H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX", "HZVNTMPMNNMOLQLWMYNZP[S[U\\V^V_UaSb", "H\\YMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSM", "H\\LPMNOMXM RRMRXSZU[", "H[MMMXNZP[S[UZVYWWWPVNUM", "G]MMLNKPKVLXNZP[T[VZXXYVYPXNVMUMSNRPRb", "IZWMLb RLMNNOPT_UaWb", "G]RMRb RKMKVLXNZP[T[VZXXYVYM", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RRMRXSZU[", "H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH", "H[MMMXNZP[S[UZVYWWWPVNUM RTEQH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH", "G\\L[LF RXFLR ROOX[Qb", "H[SOUPVQWSWWVYUZS[P[NZMXMINGPFSFUGVIVLUNSOQO", "H[JPKQLSLVMYNZP[S[UZVYWVWKVHUGSFPFNGMHLJLLMNNOPPWP", "I\\KFMFOGQIRKR[ RRKSHTGVFWFYGZI", "NiTEQH RXFZF\\G^I_K_[ R_K`HaGcFdFfGgI", "I\\KFMFOGQIRKR[ RRKSHTGVFWFYGZI RN?O@NAM@N?NA RV?W@VAU@V?VA", "G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM", "F^RTRX R[MIM RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM", "IZLMNNOPOXNZM[LZLXMVVRWPWNVMUNTPTXUZW[V^U`TaRb", "G]R[Rb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "H[R[Rb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "FZWFQFNGLIKKJOJRKVLXNZQ[R[T\\U^U_TaSbQb", "HZVMPMNNMOLQLWMYNZP[R[T\\U^U_TaRbPb", "HZTPMP RM[MFWF", "MZVPRP RWFUFSGRIR_QaOb", "H\\MFOGPILSXNTXUZW[", "I[RFMPWPR[", "H\\NGNL RXIULTNTW RKIMGPFTFVGXIYKZOZUYYX[", "H\\L[UR RR[WV RLMPNSPURWVXZXb", "CaRWRR R\\XY]V`SaMa RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF", "G]RTRX RXZW\\S`PaOa RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM", "G]XFXb RPFNGLIKMKTLXNZP[T[VZXX", "I\\WMWb RQMONNOMQMWNYOZQ[T[VZWY", "F]KFK[ RKQMOPNTNVOXQYTYWXZW\\U^R`Nb", "I[WLWMVPTRRSPSNRMPMONMPLRLTMVPWSWWVYUZS[M[", "F]KHLGOFTFWGXHYJYLXOVQJ[N^Q_V_Y^", "J[NNPMTMVNWPWRVTTVN[P]R^U^W]", "G]I[[[ RIFJFLGXZZ[ R[FZFXGLZJ[", "H[KMMNVZX[K[MZVNXM", "G\\XEVFOFMGLHKJKWLYMZO[T[VZWYXWXPWNVMTLNLLMKN", "H[WEVFTGPGNHMILKLWMYNZP[S[UZVYWWWQVOUNSMOMMNLO", "G]RFRb RKQKMYMYQ", "I[MMWM RRFRb", "IZLMNNOPOXNZM[LZLXMVVRWPWNVMUNTPTXUZW[", "H\\WbQbOaN`M^MQNOONQMTMVNWOXQXWWYVZT[Q[OZMX", "HZVZT[P[NZMYLWLQMONNPMTMVN", "MWRMR_QaObNb RRFQGRHSGRFRH", "G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "HZLTST RVZT[P[NZMYLWLQMONNPMTMVN", "J\\XTQT RNZP[T[VZWYXWXQWOVNTMPMNN", "G\\LFL[ RLKTKVLWMXOXRWTVUTVLV", "H[MFMb RMNOMSMUNVOWQWWVYUZS[O[MZ", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH", "F^K[KFRMYFY[", "G]LbLMRSXMX[", "G\\J`S` RMbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX", "I^MYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RROQPRQSPRORQ", "I^MYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH RROQPRQSPRORQ",
/* // Cyrillic (0400-04FF) */
"H[MPTP RW[M[MFWF RP>SA", "H[MPTP RW[M[MFWF RN?O@NAM@N?NA RV?W@VAU@V?VA", "JbLFXF RR[RF RRMXM[N]P^S^\\]_[aXbVb", "HZM[MFXF RT>QA", "F[JPTP RWYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG", "MWR[RF", "MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA", "JZUFUUTXRZO[M[", "AbC[D[FZGXILJILGOFRFR[X[[Z]X^V^S]Q[OXNRN", "AbF[FF RRFR[X[[Z]X^V^S]Q[OXNFN", "JbLFXF RR[RF RRMXM[N]P^S^[", "G\\L[LF RX[OO RXFLR RT>QA", "G]LFL[XFX[ RP>SA", "G[KFRT RYFPXNZL[K[ RN>O@QASAU@V>", "G]R[R` RLFL[X[XF", "I[MUWU RK[RFY[", "G\\VFLFL[R[UZWXXVXSWQUORNLN", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP", "HZM[MFXF", "F^[`[[I[I` RW[WFRFPGOHNJL[", "H[MPTP RW[M[MFWF", "BbOOF[ RR[RF RRRFF R^[UO R^FRR", "I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ", "G]LFL[XFX[", "G]LFL[XFX[ RN>O@QASAU@V>", "G\\L[LF RX[OO RXFLR", "F\\W[WFTFQGOINLLXKZI[H[", "F^K[KFRUYFY[", "G]L[LF RLPXP RX[XF", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "G]L[LFXFX[", "G\\L[LFTFVGWHXJXMWOVPTQLQ", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH", "JZLFXF RR[RF", "G[KFRT RYFPXNZL[K[", "G]R[RF RPITIWJYLZNZRYTWVTWPWMVKTJRJNKLMJPI", "H\\KFY[ RYFK[", "G]XFX[ RLFL[Z[Z`", "H\\WFW[ RLFLNMPNQPRWR", "CaRFR[ RHFH[\\[\\F", "CaRFR[ RHFH[\\[\\F R\\[^[^`", "F]HFMFM[S[VZXXYVYSXQVOSNMN", "Da\\F\\[ RIFI[O[RZTXUVUSTQROONIN", "H]MFM[S[VZXXYVYSXQVOSNMN", "I^ZQPQ RMHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZMY", "CaHFH[ ROPHP RTFXFZG\\I]M]T\\XZZX[T[RZPXOTOMPIRGTF", "G\\RQK[ RW[WFOFMGLHKJKMLOMPOQWQ", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR", "H[WEVFTGPGNHMILKLWMYNZP[S[UZVYWWWQVOUNSMOMMNLO", "I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT", "JYO[OMWM", "H[WOVNTMPMNNMOLQLWMYNZP[S[UZVYWWWJVHUGSFOFMG", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT", "F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU", "K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ", "H\\MMM[WMW[", "H\\MMM[WMW[ RNEOGQHSHUGVE", "IZNMN[ RPSV[ RVMNU", "I[V[VMSMQNPPOXNZL[", "G]L[LMRXXMX[", "H[MTVT RMMM[ RVMV[", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "H[M[MMVMV[", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ", "HZVZT[P[NZMYLWLQMONNPMTMVN", "KYMMWM RRMR[", "JZMMR[ RWMR[P`OaMb", "G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM", "IZL[WM RLMW[", "I\\WMW[ RNMN[Y[Y`", "J\\VMV[ RNMNROTQUVU", "F^RMR[ RKMK[Y[YM", "F^RMR[ RKMK[Y[YM RY[[[[`", "HZJMNMN[S[UZVXVUUSSRNR", "F^YMY[ RKMK[P[RZSXSURSPRKR", "IZNMN[S[UZVXVUUSSRNR", "J\\XTQT RNNPMTMVNWOXQXWWYVZT[P[NZ", "E_JTPT RJMJ[ RT[RZQYPWPQQORNTMWMYNZO[Q[WZYYZW[T[", "I[RUM[ RV[VMPMNNMPMRNTPUVU", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RPESH", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNFOGNHMGNFNH RVFWGVHUGVFVH", "M^OKXK RRFR[ RRSSRUQWQYRZTZ[Y^WaVb", "JYO[OMWM RTEQH", "HZLTST RVZT[P[NZMYLWLQMONNPMTMVN", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN", "MWR[RM RRFQGRHSGRFRH", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RR[RM", "MWRMR_QaObNb RRFQGRHSGRFRH", "E^H[JZKXLPMNOMRMR[W[YZZXZUYSWRRR", "D^IMI[ RRMR[W[YZZXZVYTWSIS", "M^OKXK RRFR[ RRSSRUQWQYRZTZ[", "IZNMN[ RPSV[ RVMNU RTEQH", "H\\MMM[WMW[ RPESH", "JZMMR[ RWMR[P`OaMb RNEOGQHSHUGVE", "H]R[R` RMMM[W[WM", "CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM", "F]IIVI RMFM[S[VZXXYVYSXQVOSNMN", "HZJMTM RNFN[S[UZVXVUUSSRNR", "D`IFI[ RYPIP R\\Y[ZX[V[SZQXPVOROOPKQISGVFXF[G\\H", "F^KMK[ RWTKT RZZX[T[RZQYPWPQQORNTMXMZN", "F^LSXS RRSR[ RH[RF\\[", "I[NUVU RRUR[ RK[RMY[", "AbF[FF RFS\\S RVSV[ RL[VF`[", "E_J[JM RVUV[ RZUJU RO[VM][", "E_R[RPJFZFRP RI[IVJSLQOPUPXQZS[V[[", "G]R[RTLMXMRT RK[KXLVMUOTUTWUXVYXY[", "AcF[FF RFPSP RV[VPNF^FVP RM[MVNSPQSPYP\\Q^S_V_[", "DaI[IM RITST RV[VTPM\\MVT RO[OXPVQUSTYT[U\\V]X][", "H\\OPSP RNAQFSBTAUA RLGNFSFUGVHWJWLVNUOSPVQWRXTXWWYVZT[O[M\\L^L_MaObWb", "J[RTTT ROHRMTIUHVH RNNPMTMVNWPWQVSTTVUWWWXVZT[Q[O\\N^N_OaQbVb", "G]R[RF RHFJGKIKNLQMROSUSWRXQYNYIZG\\F", "G]RMRb RKMKVLXNZP[T[VZXXYVYM", "G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "I[KFR[YF", "JZMMR[WM", "I[KFR[YF ROAL> RVAS>", "JZMMR[WM ROHLE RVHSE", "GmPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF R`Me[ RjMe[c`ba`b", "HkP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ R^Mc[ RhMc[a``a^b", "CaRXR^ RRCRI RMFJGHIGLGUHXJZM[W[ZZ\\X]U]L\\IZGWFMF", "G]RYR] RRKRO ROMMNLOKQKWLYMZO[U[WZXYYWYQXOWNUMOM", "CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF RLBM@O?R?U@X@", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RLIMGOFRFUGXG", "CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF RM<W< RR<R?", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMEWE RRERH", "FZWGTFPFMGKIJKJNKPMRPSTST[", "FZVNTMPMNNMOLQLSMUNVPWTWT[", "H[N]UO ROQWU RT[LW", "JZMHMFWGWE", "JZMHUEVH", "NVPESH", "NVTEQH", "KZLIMGOFRFUGXG", ":j>R?PAOCPDR RC^D\\F[H\\I^ RCFDDFCHDIF ROcPaR`TaUc ROAP?R>T?UA R[^\\\\^[`\\a^ R[F\\D^C`DaF R`RaPcOePfR", ":jDQ>Q RH[D_ RHGDC RR_Re RRCR= R\\[`_ R\\G`C R`QfQ", "G]LFL[XFX[ RX[[[Ub RN>O@QASAU@V>", "H\\MMM[WMW[ RW[Z[Tb RNEOGQHSHUGVE", "H]MFM[S[VZXXYVYSXQVOSNMN RJIPI", "IZKMQM RNFN[S[UZVXVUUSSRNR", "G\\L[LFTFVGWHXJXMWOVPTQLQ RTMXS", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RSWW]", "HZM[MFXFXA", "JYO[OMWMWH", "HZM[MFXF RJQRQ", "JYO[OMWM RLTTT", "H]M[MFXF RMMSMVNXPYSY\\X_VaSbQb", "J\\O[OMWM ROTTTVUWVXXX[W^UaTb", "BbOOF[ RR[RF RRRFF R^[UO R^FRR R^[`[``", "F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RZ[\\[\\`", "I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ RR\\T]U_TaRbOb", "K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ RR\\T]U_TaRbOb", "G\\L[LF RX[OO RXFLR RX[Z[Z`", "IZNMN[ RPSV[ RVMNU RV[X[X`", "G\\L[LF RX[OO RXFLR RPKPS", "IZNMN[ RPSV[ RVMNU RRORW", "G\\L[LF RX[OO RXFLR RIJOJ", "IZN[NF RPSV[ RVMNU RKJQJ", "E\\X[OO RXFLR RGFLFL[", "HZPSV[ RVMNU RJMNMN[", "G]L[LF RLPXP RX[XF RX[Z[Z`", "H[MTVT RMMM[ RVMV[ RV[X[X`", "GeL[LF RLPXP RX[XFcF", "H`MTVT RMMM[ RV[VM^M", "GhL[LFXFX[ RXM^MaNcPdSd\\c_aa^b\\b", "HcM[MMVMV[ RVT[T]U^V_X_[^^\\a[b", "F^QFNGLIKKJOJRKVLXNZQ[S[VZXXYVZRZMYJWIVITJSMSRTVUXWZY[[[", "H\\QMPMNNMOLQLWMYNZP[T[VZWYXWXRWPUOSPRRRWSYTZV[Y[", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb", "HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb", "JZLFXF RR[RF RR[T[T`", "KYMMWM RRMR[ RR[T[T`", "I[RQR[ RKFRQYF", "JZR[Rb RMMR[WM", "I[RQR[ RKFRQYF RNUVU", "JZR[Rb RMMR[WM RN]V]", "H\\KFY[ RYFK[ RX[Z[Z`", "IZL[WM RLMW[ RV[X[X`", "D]FFRF RXFX[ RLFL[Z[Z`", "G\\RMIM RWMW[ RNMN[Y[Y`", "H\\WFW[ RLFLNMPNQPRWR RW[Y[Y`", "J\\VMV[ RNMNROTQUVU RV[X[X`", "H\\WFW[ RLFLNMPNQPRWR RRNRV", "J\\VMV[ RNMNROTQUVU RRQRY", "G]L[LF RL[ RLPRPUQWSXVX[", "H[M[MF RV[VPUNSMPMNNMO", "@^WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGXIYKZOJQGQEPDOCMCK", "E[VZT[P[NZMXMPNNPMTMVNWPWRMTKTISHQHO", "@^WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGXIYKZOJQGQEPDOCMCK RR[P]O_PaRbTb", "E[VZT[P[NZMXMPNNPMTMVNWPWRMTKTISHQHO RR[P]O_PaRbTb", "MWR[RF", "BbOOF[ RR[RF RRRFF R^[UO R^FRR RN>O@QASAU@V>", "F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RNEOGQHSHUGVE", "G\\L[LF RX[OO RXFLR RX[X_WaUbSb", "IZNMN[ RPSV[ RVMNU RV[V_UaSbQb", "F\\W[WFTFQGOINLLXKZI[H[ RW[Z[Tb", "I[V[VMSMQNPPOXNZL[ RV[Y[Sb", "G]L[LF RLPXP RX[XF RX[X_WaUbSb", "H[MTVT RMMM[ RVMV[ RV[V_UaSbQb", "G]L[LF RLPXP RX[XF RX[[[Ub", "H[MTVT RMMM[ RVMV[ RV[Y[Sb", "H\\WFW[ RLFLNMPNQPRWR RW[U[U`", "J\\VMV[ RNMNROTQUVU RV[T[T`", "F^K[KFRUYFY[ RY[\\[Vb", "G]L[LMRXXMX[ RX[[[Ub", "MWR[RF", "I[MUWU RK[RFY[ RN>O@QASAU@V>", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE", "I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH", "F`JURU RRPYP RH[OF\\F RRFR[\\[", "D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX", "H[MPTP RW[M[MFWF RN>O@QASAU@V>", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNEOGQHSHUGVE", "F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP", "I[NNPMTMVNWPWXVZT[P[NZMXMVWT", "F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP RNBOCNDMCNBND RVBWCVDUCVBVD", "I[NNPMTMVNWPWXVZT[P[NZMXMVWT RNFOGNHMGNFNH RVFWGVHUGVFVH", "BbOOF[ RR[RF RRRFF R^[UO R^FRR RN?O@NAM@N?NA RV?W@VAU@V?VA", "F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RNFOGNHMGNFNH RVFWGVHUGVFVH", "I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ RN?O@NAM@N?NA RV?W@VAU@V?VA", "K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ RNFOGNHMGNFNH RVFWGVHUGVFVH", "H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY", "JZMMVMOVRVTWUXVZV^U`TaRbObMa", "G]LFL[XFX[ RM@W@", "H\\MMM[WMW[ RMGWG", "G]LFL[XFX[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "H\\MMM[WMW[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF", "H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA", "H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "I^ZPPP RMYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH RN?O@NAM@N?NA RV?W@VAU@V?VA", "J\\XTQT RNZP[T[VZWYXWXQWOVNTMPMNN RNFOGNHMGNFNH RVFWGVHUGVFVH", "G[KFRT RYFPXNZL[K[ RM@W@", "JZMMR[ RWMR[P`OaMb RMGWG", "G[KFRT RYFPXNZL[K[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "JZMMR[ RWMR[P`OaMb RNFOGNHMGNFNH RVFWGVHUGVFVH", "G[KFRT RYFPXNZL[K[ RQ>NA RX>UA", "JZMMR[ RWMR[P`OaMb RQENH RXEUH", "H\\WFW[ RLFLNMPNQPRWR RN?O@NAM@N?NA RV?W@VAU@V?VA", "J\\VMV[ RNMNROTQUVU RNFOGNHMGNFNH RVFWGVHUGVFVH", "HZM[MFXF RM[O[O`", "JYO[OMWM RO[Q[Q`", "Da\\F\\[ RIFI[O[RZTXUVUSTQROONIN RN?O@NAM@N?NA RV?W@VAU@V?VA", "F^YMY[ RKMK[P[RZSXSURSPRKR RNFOGNHMGNFNH RVFWGVHUGVFVH", "HZWFMFM[Q[Q_PaNbLb RJQRQ", "JYWMOMO[S[S_RaPbNb RLTTT", "H\\KFY[ RYFK[ RX[X_WaUbSb", "IZL[WM RLMW[ RV[V_UaSbQb", "H\\KFY[ RYFK[ RNPVP", "IZL[WM RLMW[ RNTVT",
/* // Cyrillic Supplement (500-52F) */
"G\\WFW[Q[NZLXKVKSLQNOQNWN", "J[VMV[Q[OZNXNUOSQRVR", "B_RXSZU[X[ZZ[X[M RRFRXQZO[L[IZGXFVFSGQIOLNRN", "E]RXSZU[V[XZYXYQ RRMRXQZO[M[KZJXJUKSMRRR", "IePPTP RMGOFTFVGWHXJXLWNVOTPVQWRXTXXYZ[[^[`ZaXaM", "KbRTTT RNNPMTMVNWPWQVSTTVUWWWXXZZ[[[]Z^X^Q", "I\\PPTP RMGOFTFVGWHXJXLWNVOTPVQWRXTX[Z[Z`", "K[RTTT RNNPMTMVNWPWQVSTTVUWWW[Y[Y`", "FdH[I[KZLXNLOIQGTFWFWXXZZ[][_Z`X`M", "IaL[NZOXPPQNSMVMVXWZY[Z[\\Z]X]Q", "CaH[HF RHPTP RTFTXUZW[Z[\\Z]X]M", "F^KTTT RKMK[ RTMTXUZW[X[ZZ[X[R", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR", "HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU", "J_LFXF RRFRXSZU[X[ZZ[X[M", "K]MMWM RRMRXSZU[V[XZYXYS", "G[PPTP RWGUFPFNGMHLJLLMNNOPPMQLRKTKWLYMZO[U[WZ", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN", "F\\W[WFTFQGOINLLXKZI[H[ RW[W_VaTbRb", "I[V[VMSMQNPPOXNZL[ RV[V_UaSbQb", "BaP[^F RD[E[GZHXJLKIMGPF^[", "E^[MO[ RH[JZKXLPMNOM[[", "E_\\FUO\\[ RJ[JFRFTGUHVJVMUOTPRQJQ", "F^KMKb R[MUT[[ RKNMMQMSNTOUQUWTYSZQ[M[KZ", "DaOQH[ RTFT[^[ R[QLQJPIOHMHJIHJGLF^F", "D`H[MU RRPRMKMINHPHRITKURU R[ZY[U[SZRXRPSNUMYM[N\\P\\RRT", "G]Z]X\\VZSWQVOV RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[", "I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN", "F^IFN[RLV[[F", "G]JMN[RQV[ZM", "G\\L[LF RX[OO RXFLR RXKRG", "IZNMN[ RPSV[ RVMNU RWQQM", "FgW[WFTFQGOINLLXKZI[H[ RWM]M`NbPcSc\\b_`a]b[b", "IcV[VMSMQNPPOXNZL[ RVT[T]U^V_X_[^^\\a[b", "GhL[LF RLPXP RX[XF RXM^MaNcPdSd\\c_aa^b\\b", "HcMTVT RMMM[ RVMV[ RVT[T]U^V_X_[^^\\a[b", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Armenian (530-58F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Hebrew (590-5FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Arabic (600-6FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Syriac (700-74F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Arabic Supplement (750-77F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Taana (780-7BF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // N'Ko (7C0-7FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // - (800-8FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Devanagari (900-97F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Bengali (980-9FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Gurmukhi (A00-A7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Gujarati (A80-AFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Oriya (B00-B7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Tamil (B80-BFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Telugu (C00-C7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Kannada (C80-CFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Malayalam (D00-D7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Simhala (D80-DFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Thai (E00-E7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Lao (E80-EFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Tibetan (F00-FFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Myanmar (1000-109F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Geogian (10A0-10FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Hangul Jamo (1100-11FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Ethiopic (1200-137F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Ethiopic Supplement (1380-139F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Cherokee (13A0-13FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Unified Canadian Aboriginal Syllabics (1400-167F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Ogham (1680-169F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Runic (16A0-16FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Tagalog (1700-171F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Hanunoo (1720-173F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Buhid (1740-175F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Tagbanwa (1760-177F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Khmer (1780-17FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Mongolian (1800-18AF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // - (18B0-18FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Limbu (1900-194F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Tai Le (1950-197F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // New Tai Lue (1980-19DF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Khmer Symbols (19E0-19FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Buginese (1A00-1A1F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // - (1A20-1AFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Balinese (1B00-1B7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Sudanese (1B80-1BBF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // - (1BC0-1BFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Lepcha (1C00-1C4F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Ol Chiki (1C50-1C7F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // - (1C80-1CFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Phonetic Extensions (1D00-1D7F) */
"JZNXVX RM[RMW[", "H\\LXRX RRTWT RRMR[Y[ RYMPMK[", "D`[ZY[U[SZRX RINKMOMQNRPRXQZO[K[IZHXHVRUYU[T\\R\\P[NYMUMSNRP", "I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT RKWQW", "HZVZT[P[NZMYLWLQMONNPMTMVN", "J[SMOMO[S[UZVYWVWRVOUNSM", "J[SMOMO[S[UZVYWVWRVOUNSM RLTRT", "JYOTTT RVMOMO[V[", "J[TTVSWQWPVNTMPMNN RRTTTVUWWWXVZT[P[NZ", "MWRMR[ RRbSaR`QaRbR`", "LYTMTWSYRZP[O[", "IZNMN[ RPSV[ RVMNU", "JYOMO[V[ RLVRR", "G]L[LMRXXMX[", "I\\W[WMN[NM", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[", "J\\NNPMTMVNWOXQXWWYVZT[P[NZ", "G]YSYVXXWYUZOZMYLXKVKSLQMPOOUOWPXQYS", "G]XYYWYSXQWPUOOOMPLQKSKWLY", "G]YNK[ RYSYVXXWYUZOZMYLXKVKSLQMPOOUOWPXQYS", "DaINKMOMQNRPRXQZO[K[IZHXHVRT RRWSYTZV[Y[[Z\\Y]W]Q\\O[NYMVMTNSORQ", "G]OMNNMPNRPS RTSVRWPVNUM RPSTSVTWVWXVZT[P[NZMXMVNTPS", "I\\XTXQWOVNTMQMONNOMQMT", "H[LTLWMYNZP[S[UZVYWWWT", "I[N[NMTMVNWPWRVTTUNU", "I[RUM[ RV[VMPMNNMPMRNTPUVU", "I[RSMM RVMV[P[NZMXMVNTPSVS", "KYMMWM RRMR[", "H[MMMXNZP[S[UZVXVM", "G]KPYP RKYVYXXYVYSXQWP", "@]KPYP RKYVYXXYVYSXQWP REWFXEYDXEWEY REOFPEQDPEOEQ", "G]KKYK RWKXLYNYQXSVTKT RVTXUYWYZX\\V]K]", "JZMMR[WM", "G]JMN[RQV[ZM", "IZLMWML[W[", "JZNMVMRRSRUSVUVXUZS[P[NZ", "H\\XNUMPMNNMOLQLSMUNVPWTXVYWZX\\X^W`VaTbObLa RRTR\\", "JZW[PROPPNRMTNUPTRM[", "JYO[OMWM", "JZM[RMW[", "H[M[MMVMV[", "I[N[NMTMVNWPWRVTTUNU", "I[RMR[ RLMMNMRNTPUTUVTWRWNXM", "I[V[VMSMQNPPOXNZL[", "JZNKVK RMNR@WN", "H\\LKRK RRGWG RR@RNYN RY@P@KN", "I[SGVHWJWKVMTNNNN@S@UAVCVDUFSGNG", "I[SGVHWJWKVMTNNNN@S@UAVCVDUFSGNG RKGQG", "J[S@O@ONSNUMVLWIWEVBUAS@", "JYOGTG RV@O@ONVN", "KZUGPG RN@U@UNNN", "HZUAS@P@NAMBLDLJMLNMPNTNVMVHSH", "H[MGVG RM@MN RV@VN", "MWRNR@ RUNON RU@O@", "LYT@TJSLRMPNON", "IZN@NN RPFVN RV@NH", "JYO@ONVN", "G]LNL@RKX@XN", "H[MNM@VNV@", "I\\WNW@NNN@", "H[PNNMMLLJLDMBNAP@S@UAVBWDWJVLUMSNPN", "G]O@NAMCNEPF RTFVEWCVAU@ RPFTFVGWIWKVMTNPNNMMKMINGPF", "I[NNN@T@VAWCWEVGTHNH", "I[RHWN RNNN@T@VAWCWEVGTHNH", "KYM@W@ RR@RN", "H[M@MKNMPNSNUMVKV@", "G]J@NNRDVNZ@", "KZOEQDSDUEVGVN RVMTNQNOMNKOIQHVH", "JYNDNKOMQNSNUM RNEPDSDUEVGUISJNJ", "H]WDUKTMRNPNNMMKMGNEPDRDTEVMWN", "H\\XMVNUNSMRK RLDODQERHRKQMONNNLMKKKJVJXIYGXEVDUDSERH", "KYO@ON ROMQNSNUMVKVGUESDQDOE", "KYU@UN RUESDQDOENGNKOMQNSNUM", "LYVMTNRNPMOKOGPERDSDUEVGVHOI", "LYOEQDSDUEVGVKUMSNRNPMOKOJVI", "LXPIRI RUETDPDOEOHPIOJOMPNTNUM", "LXRITI ROEPDTDUEUHTIUJUMTNPNOM", "KYUDUPTRRSOS RUESDQDOENGNKOMQNSNUM", "NVRDRN RRUSTRSQTRURS", "IZO@ON RUNQH RUDOJ", "G]KNKD RKEMDODQERGRN RRGSEUDVDXEYGYN", "KZODON ROEQDSDUEVGVPURSSRS", "KYQNOMNKNGOEQDSDUEVGVKUMSNQN", "LYOEQDSDUEVGVKUMSNQNOM", "KYNINGOEQDSDUEVGVI", "KYNINKOMQNSNUMVKVI", "KYOSOD ROEQDSDUEVGVKUMSNQNOM", "NXPDVD RR@RKSMUNVN", "KYUDUN RNDNKOMQNSNUM", "I[MFWF RMMTMVLWJWHVF", "G]YDYN RYMWNUNSMRKRD RRKQMONNNLMKKKD", "LXNDRNVD", "LXVNPGPEQDSDTETGNN", "KYSFRF RNSOQOCPAR@S@UAVCUESFUGVIVKUMSNQNOM", "KXRMRS RMDOERMVD", "KYSDQDOENGNKOMQNSNUMVKVGUESDPCOBOAP@U@", "I[MDLFLJMLNMPNTNVMWLXJXGWEUDSERGRS", "LXVDNS RNDPETRVS", "NVRWRa RRPQQRRSQRPRR", "LWPWPa RPZQXSWUW", "KYUWUa RNWN^O`QaSaU`", "LXNWRaVW", "KYSYRY RNfOdOVPTRSSSUTVVUXSYUZV\\V^U`SaQaO`", "KXR`Rf RMWOXR`VW", "KYOfOZPXRWSWUXVZV^U`SaQaO`", "I[MWLYL]M_N`PaTaV`W_X]XZWXUWSXRZRf", "LXVWNf RNWPXTeVf", "D`IMIXJZL[O[QZRX R[ZY[U[SZRXRPSNUMYM[N\\P\\RRT", "H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RIHJGLFPHRGSF", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RQHRGTFXHZG[F", "MYOMWM RR[RISGUFWF RMTNSPRTTVSWR", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RMTNSPRTTVSWR", "I\\NMN[ RNOONQMTMVNWPW[ RMTNSPRTTVSWR", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RI`J_L^P`R_S^", "KXP[PM RPQQORNTMVM RLTMSORSTUSVR", "KXM[S[ RVMTMRNQOPRP[ RLTMSORSTUSVR", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNTOSQRUTWSXR", "MYOMWM RRFRXSZU[W[ RMSNRPQTSVRWQ", "IZLMWML[W[ RMTNSPRTTVSWR", "H[M[MJNHOGQFTFVG RMNOMSMUNVOWQWWVYUZS[O[MZ", "H[MGVG RM@MN RV@VN", "JZMMVMOURUTVUWVYV^U`TaRbPbNaM_M^N\\P[V[", "MlOMWM RRFRXSZU[W[ R^[^F Rg[gPfNdMaM_N^O RiC]`", "MWR[RM RU[O[ RUMOM ROTUT", "MXRMRXSZU[ ROTUT", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RHT\\T", "H[MMMXNZP[S[UZVXVM RHT\\T", "I\\XMUMUPWRXTXWWYVZT[Q[OZNYMWMTNRPPPMMM RHU\\U",
/* // Phonetic Extensions Supplement (1D80-1DBF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Combining Diacritical Marks Supplement (1DC0-1DFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Latin Extended Additional (1E00-1EFF) */
"I[MUWU RK[RFY[ RR`TaUcTeRfPeOcPaR`", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RR`TaUcTeRfPeOcPaR`", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RR?Q@RAS@R?RA", "H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RN?M@NAO@N?NA", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RRbSaR`QaRbR`", "H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RRbSaR`QaRbR`", "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RWaMa", "H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RWaMa", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb RT>QA", "HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb RTEQH", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RR?Q@RAS@R?RA", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RV?U@VAW@V?VA", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RRbSaR`QaRbR`", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RSbTaS`RaSbS`", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RWaMa", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RXaNa", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RQ\\S]T_SaQbNb", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RS\\U]V_UaSbPb", "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RVcR`Nc", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RWcS`Oc", "H[MPTP RW[M[MFWF RM@W@ RP9S<", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG RP>SA", "H[MPTP RW[M[MFWF RM@W@ RT9Q<", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG RT>QA", "H[MPTP RW[M[MFWF RVcR`Nc", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RVcR`Nc", "H[MPTP RW[M[MFWF RW`VaTbP`NaMb", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RW`VaTbP`NaMb", "H[MPTP RW[M[MFWF RR\\T]U_TaRbOb RN>O@QASAU@V>", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR\\T]U_TaRbOb RNEOGQHSHUGVE", "HZTPMP RM[MFWF RR?Q@RAS@R?RA", "MYOMWM RR[RISGUFWF RT?S@TAU@T?TA", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RM@W@", "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RMGWG", "G]L[LF RLPXP RX[XF RR?Q@RAS@R?RA", "H[M[MF RV[VPUNSMPMNNMO RM?L@MAN@M?MA", "G]L[LF RLPXP RX[XF RRbSaR`QaRbR`", "H[M[MF RV[VPUNSMPMNNMO RRbSaR`QaRbR`", "G]L[LF RLPXP RX[XF RN?O@NAM@N?NA RV?W@VAU@V?VA", "H[M[MF RV[VPUNSMPMNNMO RI?J@IAH@I?IA RQ?R@QAP@Q?QA", "G]L[LF RLPXP RX[XF RL\\N]O_NaLbIb", "H[M[MF RV[VPUNSMPMNNMO RM\\O]P_OaMbJb", "G]L[LF RLPXP RX[XF RV`UbScQcObN`", "H[M[MF RV[VPUNSMPMNNMO RV`UbScQcObN`", "MWR[RF RW`VaTbP`NaMb", "MWR[RM RRFQGRHSGRFRH RW`VaTbP`NaMb", "MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA RT9Q<", "MWR[RM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "G\\L[LF RX[OO RXFLR RT>QA", "IZN[NF RPSV[ RVMNU RPAMD", "G\\L[LF RX[OO RXFLR RRbSaR`QaRbR`", "IZN[NF RPSV[ RVMNU RRbSaR`QaRbR`", "G\\L[LF RX[OO RXFLR RWaMa", "IZN[NF RPSV[ RVMNU RWaMa", "HYW[M[MF RRbSaR`QaRbR`", "MXU[SZRXRF RSbTaS`RaSbS`", "HYW[M[MF RH@R@ RRbSaR`QaRbR`", "MXU[SZRXRF RM@W@ RSbTaS`RaSbS`", "HYW[M[MF RWaMa", "MXU[SZRXRF RXaNa", "HYW[M[MF RVcR`Nc", "MXU[SZRXRF RWcS`Oc", "F^K[KFRUYFY[ RT>QA", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RTEQH", "F^K[KFRUYFY[ RR?Q@RAS@R?RA", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RRFQGRHSGRFRH", "F^K[KFRUYFY[ RRbSaR`QaRbR`", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RRbSaR`QaRbR`", "G]L[LFX[XF RR?Q@RAS@R?RA", "I\\NMN[ RNOONQMTMVNWPW[ RRFQGRHSGRFRH", "G]L[LFX[XF RRbSaR`QaRbR`", "I\\NMN[ RNOONQMTMVNWPW[ RRbSaR`QaRbR`", "G]L[LFX[XF RWaMa", "I\\NMN[ RNOONQMTMVNWPW[ RWaMa", "G]L[LFX[XF RVcR`Nc", "I\\NMN[ RNOONQMTMVNWPW[ RVcR`Nc", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RT9Q<", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RT>QA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RN:O;N<M;N:N< RV:W;V<U;V:V<", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RN?O@NAM@N?NA RV?W@VAU@V?VA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@ RP9S<", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG RP>SA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@ RT9Q<", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG RT>QA", "G\\L[LFTFVGWHXJXMWOVPTQLQ RT>QA", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RTEQH", "G\\L[LFTFVGWHXJXMWOVPTQLQ RR?Q@RAS@R?RA", "H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RRFQGRHSGRFRH", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RR?Q@RAS@R?RA", "KXP[PM RPQQORNTMVM RSFRGSHTGSFSH", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RRbSaR`QaRbR`", "KXP[PM RPQQORNTMVM RPbQaP`OaPbP`", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RM@W@ RRbSaR`QaRbR`", "KXP[PM RPQQORNTMVM RNGXG RPbQaP`OaPbP`", "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RWaMa", "KXP[PM RPQQORNTMVM RUaKa", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR?Q@RAS@R?RA", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRFQGRHSGRFRH", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RRbSaR`QaRbR`", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRbSaR`QaRbR`", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RU>RA RM>N?M@L?M>M@", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RUERH RMENFMGLFMEMG", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RN>RAV> RR:Q;R<S;R:R<", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNERHVE RR?Q@RAS@R?RA", "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR?Q@RAS@R?RA RRbSaR`QaRbR`", "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRFQGRHSGRFRH RRbSaR`QaRbR`", "JZLFXF RR[RF RR?Q@RAS@R?RA", "MYOMWM RRFRXSZU[W[ RR?Q@RAS@R?RA", "JZLFXF RR[RF RRbSaR`QaRbR`", "MYOMWM RRFRXSZU[W[ RTbUaT`SaTbT`", "JZLFXF RR[RF RWaMa", "MYOMWM RRFRXSZU[W[ RYaOa", "JZLFXF RR[RF RVcR`Nc", "MYOMWM RRFRXSZU[W[ RXcT`Pc", "G]LFLWMYNZP[T[VZWYXWXF RVbUaV`WaVbV` RNbMaN`OaNbN`", "H[VMV[ RMMMXNZP[S[UZVY RVbUaV`WaVbV` RNbMaN`OaNbN`", "G]LFLWMYNZP[T[VZWYXWXF RW`VaTbP`NaMb", "H[VMV[ RMMMXNZP[S[UZVY RW`VaTbP`NaMb", "G]LFLWMYNZP[T[VZWYXWXF RVcR`Nc", "H[VMV[ RMMMXNZP[S[UZVY RVcR`Nc", "G]LFLWMYNZP[T[VZWYXWXF RMAN@P?TAV@W? RT9Q<", "H[VMV[ RMMMXNZP[S[UZVY RMHNGPFTHVGWF RT>QA", "G]LFLWMYNZP[T[VZWYXWXF RM@W@ RN:O;N<M;N:N< RV:W;V<U;V:V<", "H[VMV[ RMMMXNZP[S[UZVY RMGWG RN?O@NAM@N?NA RV?W@VAU@V?VA", "I[KFR[YF RMAN@P?TAV@W?", "JZMMR[WM RMHNGPFTHVGWF", "I[KFR[YF RRbSaR`QaRbR`", "JZMMR[WM RRbSaR`QaRbR`", "F^IFN[RLV[[F RP>SA", "G]JMN[RQV[ZM RPESH", "F^IFN[RLV[[F RT>QA", "G]JMN[RQV[ZM RTEQH", "F^IFN[RLV[[F RN?O@NAM@N?NA RV?W@VAU@V?VA", "G]JMN[RQV[ZM RNFOGNHMGNFNH RVFWGVHUGVFVH", "F^IFN[RLV[[F RR?Q@RAS@R?RA", "G]JMN[RQV[ZM RRFQGRHSGRFRH", "F^IFN[RLV[[F RRbSaR`QaRbR`", "G]JMN[RQV[ZM RRbSaR`QaRbR`", "H\\KFY[ RYFK[ RR?Q@RAS@R?RA", "IZL[WM RLMW[ RRFQGRHSGRFRH", "H\\KFY[ RYFK[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "IZL[WM RLMW[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "I[RQR[ RKFRQYF RR?Q@RAS@R?RA", "JZMMR[ RWMR[P`OaMb RRFQGRHSGRFRH", "H\\KFYFK[Y[ RNAR>VA", "IZLMWML[W[ RNHREVH", "H\\KFYFK[Y[ RRbSaR`QaRbR`", "IZLMWML[W[ RRbSaR`QaRbR`", "H\\KFYFK[Y[ RWaMa", "IZLMWML[W[ RWaMa", "H[M[MF RV[VPUNSMPMNNMO RWaMa", "MYOMWM RRFRXSZU[W[ RN?O@NAM@N?NA RV?W@VAU@V?VA", "G]JMN[RQV[ZM RRHPGOEPCRBTCUETGRH", "JZMMR[ RWMR[P`OaMb RRHPGOEPCRBTCUETGRH", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RWJYIZGYEWD", "MYR[RISGUFWF RT?S@TAU@T?TA", "MYR[RISGUFWF ROSUO", "MYR[RISGUFWF ROLUL", "E^J[JLKIMGPFZFSNVNXOYPZRZWYYXZV[R[PZOY", "H[SMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSMPLNKMINGPFTFVG", "I[MUWU RK[RFY[ RRbSaR`QaRbR`", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRbSaR`QaRbR`", "I[MUWU RK[RFY[ RRAT?U=T;R:P:", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRHTFUDTBRAPA", "I[MUWU RK[RFY[ RU>X; RNAR>VA", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RUEXB RNHREVH", "I[MUWU RK[RFY[ RO>L; RNAR>VA", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR ROELB RNHREVH", "I[MUWU RK[RFY[ RNAR>VA RXAZ?[=Z;X:V:", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RXHZF[DZBXAVA", "I[MUWU RK[RFY[ RNAR>VA RM<N;P:T<V;W:", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RMAN@P?TAV@W?", "I[MUWU RK[RFY[ RNAR>VA RRbSaR`QaRbR`", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RRbSaR`QaRbR`", "I[MUWU RK[RFY[ RN>O@QASAU@V> RT9Q<", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RT>QA", "I[MUWU RK[RFY[ RN>O@QASAU@V> RP9S<", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RP>SA", "I[MUWU RK[RFY[ RN>O@QASAU@V> RP>R<S:R8P7N7", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RPERCSAR?P>N>", "I[MUWU RK[RFY[ RN>O@QASAU@V> RM<N;P:T<V;W:", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RMAN@P?TAV@W?", "I[MUWU RK[RFY[ RN>O@QASAU@V> RRbSaR`QaRbR`", "I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RRbSaR`QaRbR`", "H[MPTP RW[M[MFWF RRbSaR`QaRbR`", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRbSaR`QaRbR`", "H[MPTP RW[M[MFWF RRAT?U=T;R:P:", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRHTFUDTBRAPA", "H[MPTP RW[M[MFWF RMAN@P?TAV@W?", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMHNGPFTHVGWF", "H[MPTP RW[M[MFWF RU>X; RNAR>VA", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RUEXB RNHREVH", "H[MPTP RW[M[MFWF RO>L; RNAR>VA", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT ROELB RNHREVH", "H[MPTP RW[M[MFWF RNAR>VA RXAZ?[=Z;X:V:", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RXHZF[DZBXAVA", "H[MPTP RW[M[MFWF RNAR>VA RM<N;P:T<V;W:", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RMAN@P?TAV@W?", "H[MPTP RW[M[MFWF RNAR>VA RRbSaR`QaRbR`", "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RRbSaR`QaRbR`", "MWR[RF RRAT?U=T;R:P:", "MWR[RM RRHTFUDTBRAPA", "MWR[RF RRbSaR`QaRbR`", "MWR[RM RRFQGRHSGRFRH RRbSaR`QaRbR`", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RRbSaR`QaRbR`", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRbSaR`QaRbR`", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RRAT?U=T;R:P:", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRHTFUDTBRAPA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RU>X; RNAR>VA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUEXB RNHREVH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RO>L; RNAR>VA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ ROELB RNHREVH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RXAZ?[=Z;X:V:", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RXHZF[DZBXAVA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RM<N;P:T<V;W:", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RMAN@P?TAV@W?", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RRbSaR`QaRbR`", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RRbSaR`QaRbR`", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RT>QA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RTEQH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RP>SA", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RPESH", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RRAT?U=T;R:P:", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RRHTFUDTBRAPA", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RWAVBTCPANBMC", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RWHVITJPHNIMJ", "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RRbSaR`QaRbR`", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RRbSaR`QaRbR`", "G]LFLWMYNZP[T[VZWYXWXF RRbSaR`QaRbR`", "H[VMV[ RMMMXNZP[S[UZVY RRbSaR`QaRbR`", "G]LFLWMYNZP[T[VZWYXWXF RRAT?U=T;R:P:", "H[VMV[ RMMMXNZP[S[UZVY RRHTFUDTBRAPA", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RT>QA", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RTEQH", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RP>SA", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RPESH", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RRAT?U=T;R:P:", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RRHTFUDTBRAPA", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RWAVBTCPANBMC", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RWHVITJPHNIMJ", "G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RRbSaR`QaRbR`", "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RRbSaR`QaRbR`", "I[RQR[ RKFRQYF RP>SA", "JZMMR[ RWMR[P`OaMb RPESH", "I[RQR[ RKFRQYF RRbSaR`QaRbR`", "JZMMR[ RWMR[P`OaMb RVbWaV`UaVbV`", "I[RQR[ RKFRQYF RRAT?U=T;R:P:", "JZMMR[ RWMR[P`OaMb RRHTFUDTBRAPA", "I[RQR[ RKFRQYF RMAN@P?TAV@W?", "JZMMR[ RWMR[P`OaMb RMHNGPFTHVGWF", "E\\PFP[ RJFJ[Z[", "J[MMWM ROFOXPZR[ RX[VZUXUF", "G]QFOGMJLMLWMYNZP[T[VZXXYVYTXPVMUL", "H[QMONNOMQMWNYOZQ[S[UZVYWWWUVSURSQ", "G[KFRT RYFRTPXOZM[KZJXKVMUOVPX", "JZMMR[ RWMR[Q_PaNbLaK_L]N\\P]Q_",
/* // Greek Extended (1F00-1FFF) */
"H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMHNHOGOE", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMEMGNHOH", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMHNHOGOE", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMEMGNHOH", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RMAN@P?TAV@W?", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RMAN@P?TAV@W?", "G[MUWU RK[RFY[ RJHKHLGLE", "G[MUWU RK[RFY[ RJEJGKHLH", "?[MUWU RK[RFY[ RIELH RBHCHDGDE", "?[MUWU RK[RFY[ RIELH RBEBGCHDH", "?[MUWU RK[RFY[ RMEJH RBHCHDGDE", "?[MUWU RK[RFY[ RMEJH RBEBGCHDH", "D[MUWU RK[RFY[ RFAG@I?MAO@P? RJHKHLGLE", "D[MUWU RK[RFY[ RFAG@I?MAO@P? RJEJGKHLH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RQHRHSGSE", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RQEQGRHSH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEWH RMHNHOGOE", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEWH RMEMGNHOH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RXEUH RMHNHOGOE", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RXEUH RMEMGNHOH", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "B[MPTP RW[M[MFWF REHFHGGGE", "B[MPTP RW[M[MFWF REEEGFHGH", ":[MPTP RW[M[MFWF RDEGH R=H>H?G?E", ":[MPTP RW[M[MFWF RDEGH R=E=G>H?H", ":[MPTP RW[M[MFWF RHEEH R=H>H?G?E", ":[MPTP RW[M[MFWF RHEEH R=E=G>H?H", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE", "I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH", "I\\NMN[ RNOONQMTMVNWPWb RTEWH RMHNHOGOE", "I\\NMN[ RNOONQMTMVNWPWb RTEWH RMEMGNHOH", "I\\NMN[ RNOONQMTMVNWPWb RXEUH RMHNHOGOE", "I\\NMN[ RNOONQMTMVNWPWb RXEUH RMEMGNHOH", "I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RMAN@P?TAV@W?", "I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RMAN@P?TAV@W?", "A]L[LF RLPXP RX[XF RDHEHFGFE", "A]L[LF RLPXP RX[XF RDEDGEHFH", "9]L[LF RLPXP RX[XF RCEFH R<H=H>G>E", "9]L[LF RLPXP RX[XF RCEFH R<E<G=H>H", "9]L[LF RLPXP RX[XF RGEDH R<H=H>G>E", "9]L[LF RLPXP RX[XF RGEDH R<E<G=H>H", ">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDHEHFGFE", ">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDEDGEHFH", "MXRMRXSZU[ RQHRHSGSE", "MXRMRXSZU[ RQEQGRHSH", "MXRMRXSZU[ RTEWH RMHNHOGOE", "MXRMRXSZU[ RTEWH RMEMGNHOH", "MXRMRXSZU[ RXEUH RMHNHOGOE", "MXRMRXSZU[ RXEUH RMEMGNHOH", "MXRMRXSZU[ RQHRHSGSE RMAN@P?TAV@W?", "MXRMRXSZU[ RQEQGRHSH RMAN@P?TAV@W?", "GWR[RF RJHKHLGLE", "GWR[RF RJEJGKHLH", "?WR[RF RIELH RBHCHDGDE", "?WR[RF RIELH RBEBGCHDH", "?WR[RF RMEJH RBHCHDGDE", "?WR[RF RMEJH RBEBGCHDH", "DWR[RF RFAG@I?MAO@P? RJHKHLGLE", "DWR[RF RFAG@I?MAO@P? RJEJGKHLH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQHRHSGSE", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQEQGRHSH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEWH RMHNHOGOE", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEWH RMEMGNHOH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RXEUH RMHNHOGOE", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RXEUH RMEMGNHOH", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF REHFHGGGE", "B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF REEEGFHGH", ":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH R=H>H?G?E", ":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH R=E=G>H?H", ":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH R=H>H?G?E", ":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH R=E=G>H?H", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "H[MMMXNZP[S[UZVYWWWPVNUM RQHRHSGSE", "H[MMMXNZP[S[UZVYWWWPVNUM RQEQGRHSH", "H[MMMXNZP[S[UZVYWWWPVNUM RTEWH RMHNHOGOE", "H[MMMXNZP[S[UZVYWWWPVNUM RTEWH RMEMGNHOH", "H[MMMXNZP[S[UZVYWWWPVNUM RXEUH RMHNHOGOE", "H[MMMXNZP[S[UZVYWWWPVNUM RXEUH RMEMGNHOH", "H[MMMXNZP[S[UZVYWWWPVNUM RQHRHSGSE RMAN@P?TAV@W?", "H[MMMXNZP[S[UZVYWWWPVNUM RQEQGRHSH RMAN@P?TAV@W?", "F^K[KFYFY[K[", "@[RQR[ RKFRQYF RCECGDHEH", "F^K[KFYFY[K[", "8[RQR[ RKFRQYF RBEEH R;E;G<H=H", "F^K[KFYFY[K[", "8[RQR[ RKFRQYF RFECH R;E;G<H=H", "F^K[KFYFY[K[", "=[RQR[ RKFRQYF R?A@@B?FAH@I? RCECGDHEH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMHNHOGOE", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMEMGNHOH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMHNHOGOE", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMEMGNHOH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RMAN@P?TAV@W?", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RMAN@P?TAV@W?", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCHDHEGEE", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCECGDHEH", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;H<H=G=E", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;E;G<H=H", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;H<H=G=E", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;E;G<H=H", "=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCHDHEGEE", "=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCECGDHEH", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH", "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH", "I\\NMN[ RNOONQMTMVNWPWb RTEQH", "I\\NMN[ RNOONQMTMVNWPWb RTEQH", "MXRMRXSZU[ RTEQH", "MXRMRXSZU[ RTEQH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH", "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH", "H[MMMXNZP[S[UZVYWWWPVNUM RTEQH", "H[MMMXNZP[S[UZVYWWWPVNUM RTEQH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMHNHOGOE RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMEMGNHOH RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMHNHOGOE RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMEMGNHOH RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RMAN@P?TAV@W? RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RMAN@P?TAV@W? RR`RcSdTd", "G[MUWU RK[RFY[ RJHKHLGLE RR`RcSdTd", "G[MUWU RK[RFY[ RJEJGKHLH RR`RcSdTd", "?[MUWU RK[RFY[ RIELH RBHCHDGDE RR`RcSdTd", "?[MUWU RK[RFY[ RIELH RBEBGCHDH RR`RcSdTd", "?[MUWU RK[RFY[ RMEJH RBHCHDGDE RR`RcSdTd", "?[MUWU RK[RFY[ RMEJH RBEBGCHDH RR`RcSdTd", "D[MUWU RK[RFY[ RFAG@I?MAO@P? RJHKHLGLE RR`RcSdTd", "D[MUWU RK[RFY[ RFAG@I?MAO@P? RJEJGKHLH RR`RcSdTd", "I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RTEWH RMHNHOGOE RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RTEWH RMEMGNHOH RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RXEUH RMHNHOGOE RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RXEUH RMEMGNHOH RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RMAN@P?TAV@W? RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RMAN@P?TAV@W? RN`NcOdPd", "N]L[LF RLPXP RX[XF RR`RcSdTd", "A]L[LF RLPXP RX[XF RDEDGEHFH RR`RcSdTd", "9]L[LF RLPXP RX[XF RCEFH R<H=H>G>E RR`RcSdTd", "9]L[LF RLPXP RX[XF RCEFH R<E<G=H>H RR`RcSdTd", "9]L[LF RLPXP RX[XF RGEDH R<H=H>G>E RR`RcSdTd", "9]L[LF RLPXP RX[XF RGEDH R<E<G=H>H RR`RcSdTd", ">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDHEHFGFE RR`RcSdTd", ">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDEDGEHFH RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMHNHOGOE RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMEMGNHOH RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMHNHOGOE RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMEMGNHOH RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RMAN@P?TAV@W? RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RMAN@P?TAV@W? RR`RcSdTd", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCHDHEGEE RR`RcSdTd", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCECGDHEH RR`RcSdTd", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;H<H=G=E RR`RcSdTd", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;E;G<H=H RR`RcSdTd", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;H<H=G=E RR`RcSdTd", "8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;E;G<H=H RR`RcSdTd", "=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCHDHEGEE RR`RcSdTd", "=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCECGDHEH RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RNEOGQHSHUGVE", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMGWG", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RPESH RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RR`RcSdTd", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH RR`RcSdTd", "F^K[KFYFY[K[", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMHNGPFTHVGWF", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMHNGPFTHVGWF RR`RcSdTd", "I[MUWU RK[RFY[ RN>O@QASAU@V>", "I[MUWU RK[RFY[ RM@W@", "G[MUWU RK[RFY[ RIELH", "G[MUWU RK[RFY[ RMEJH", "I[MUWU RK[RFY[ RR`RcSdTd", "NVQHRHSGSE", "NVR`RcSdTd", "NVQHRHSGSE", "KZMHNGPFTHVGWF", "LXMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH", "I\\NMN[ RNOONQMTMVNWPWb RPESH RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RN`NcOdPd", "I\\NMN[ RNOONQMTMVNWPWb RTEQH RN`NcOdPd", "F^K[KFYFY[K[", "I\\NMN[ RNOONQMTMVNWPWb RMHNGPFTHVGWF", "I\\NMN[ RNOONQMTMVNWPWb RMHNGPFTHVGWF RN`NcOdPd", "B[MPTP RW[M[MFWF RDEGH", "B[MPTP RW[M[MFWF RHEEH", "A]L[LF RLPXP RX[XF RCEFH", "A]L[LF RLPXP RX[XF RGEDH", "G]L[LF RLPXP RX[XF RR`RcSdTd", "JZTEWH RMHNHOGOE", "JZXEUH RMHNHOGOE", "NVQHRHSGSE RMAN@P?TAV@W?", "MXRMRXSZU[ RNEOGQHSHUGVE", "MXRMRXSZU[ RMGWG", "MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA", "MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "MXRMRXSZU[ RMHNGPFTHVGWF", "MXRMRXSZU[ RMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH", "MWR[RF RN>O@QASAU@V>", "MWR[RF RM@W@", "GWR[RF RIELH", "GWR[RF RMEJH", "F^K[KFYFY[K[", "JZTEWH RMEMGNHOH", "JZXEUH RMEMGNHOH", "NVQEQGRHSH RMAN@P?TAV@W?", "H[MMMXNZP[S[UZVYWWWPVNUM RNEOGQHSHUGVE", "H[MMMXNZP[S[UZVYWWWPVNUM RMGWG", "H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA", "H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX RQHRHSGSE", "H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX RQEQGRHSH", "H[MMMXNZP[S[UZVYWWWPVNUM RMHNGPFTHVGWF", "H[MMMXNZP[S[UZVYWWWPVNUM RMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH", "I[RQR[ RKFRQYF RN>O@QASAU@V>", "I[RQR[ RKFRQYF RM@W@", "@[RQR[ RKFRQYF RBEEH", "@[RQR[ RKFRQYF RFECH", "A\\L[LFTFVGWHXJXMWOVPTQLQ RDEDGEHFH", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA", "LXNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA", "NVPESH", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RPESH RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RR`RcSdTd", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH RR`RcSdTd", "F^K[KFYFY[K[", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMHNGPFTHVGWF", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMHNGPFTHVGWF RR`RcSdTd", "B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH", "B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH", "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH", "F^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RR`RcSdTd", "NVTEQH", "NVQEQGRHSH", "F^K[KFYFY[K[",
/* // General Punctuation (2000-206F) */
"F^", "LX", "F^", "LX", "NV", "OU", "PT", "H\\", "MW", "PT", "QS", "RR", "RR", "RR", "RR", "RR", "LXOTUT", "LXOTUT", "H\\JRZR", "LXVTNT", "F^IT[T", "F^IT[T", "H\\ODOb RUDUb", "JZJbZb RJ]Z]", "MWQGQFRDSC", "MWSFSGRIQJ", "MWSZS[R]Q^", "MWQFQGRISJ", "JZUGUFVDWC RMGMFNDOC", "JZOFOGNIMJ RWFWGVIUJ", "JZOZO[N]M^ RWZW[V]U^", "JZUFUGVIWJ RMFMGNIOJ", "I[MMWM RRFRb", "I[M[W[ RMMWM RRFRb", "E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ", "E_PPPV RQQQU RRQRU RSSUS RSRST ROPUSOV RVSOWOOVS", "MWRYSZR[QZRYR[", "MaRYSZR[QZRYR[ R\\Y]Z\\[[Z\\Y\\[", "MkRYSZR[QZRYR[ R\\Y]Z\\[[Z\\Y\\[ RfYgZf[eZfYf[", "JZRRQSRTSSRRRT", "RR", "RR", "RR", "RR", "RR", "RR", "RR", "RR", "FjJ[ZF RMFOGPIOKMLKKJIKGMF RcUeVfXeZc[aZ`XaVcU RYZZXYVWUUVTXUZW[YZ", "FvJ[ZF RMFOGPIOKMLKKJIKGMF RcUeVfXeZc[aZ`XaVcU RoUqVrXqZo[mZlXmVoU RYZZXYVWUUVTXUZW[YZ", "MWTFQL", "JZQFNL RWFTL", "G]NFKL RTFQL RZFWL", "MWPFSL", "JZSFVL RMFPL", "G]VFYL RPFSL RJFML", "LXVcR`Nc", "KYUMOSUY", "KYOMUSOY", "E_LMXY RXMLY RKRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT", "MaRYSZR[QZRYR[ RRSQGRFSGRSRF R\\Y]Z\\[[Z\\Y\\[ R\\S[G\\F]G\\S\\F", "I[QFQS RQYRZQ[PZQYQ[ RQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS RMGOFTFVGWIWKVMUNSORPQRQS", "E_JGZG", "OUb`aa^c\\dYeTfPfKeHdFcCaB`", "OUBFCEFCHBKAP@T@YA\\B^CaEbF", "E_N_VW RV_R[", "CaKRKW RRFRK RYRYW RFUKWPU RH[KWN[ RMIRKWI ROORKUO RTUYW^U RV[YW\\[", "LXOTUT", "G][EI`", "KYQSVS RVbQbQDVD", "KYSSNS RNbSbSDND", "ImQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS RcYdZc[bZcYc[ R_GaFfFhGiIiKhMgNeOdPcRcS", "IeQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS R`YaZ`[_Z`Y`[ R`S_G`FaG`S`F", "MiRYSZR[QZRYR[ RRSQGRFSGRSRF R_Y`Z_[^Z_Y_[ R[G]FbFdGeIeKdMcNaO`P_R_S", "KYNMVMPb", "G^NMN[ RUMUXVZX[ RJMWMYNZP", "H\\NQNU RWPWV RPVPPOQOUPV RQPPPNQMSNUPVQVQP", "H\\VQVU RMPMV RTVTPUQUUTV RSPTPVQWSVUTVSVSP", "JZR[RV RWXRVMX RURRVOR", "MWQZQ[R]S^ RRNQORPSORNRP", "OUBFCEFCHBKAP@T@YA\\B^CaEbF Rb`aa^c\\dYeTfPfKeHdFcCaB`", "JZRFRK RMIRKWI ROORKUO RRFRK RWIRKMI RUORKOO", "JZM^WB RNFOGNHMGNFNH RVYWZV[UZVYV[", "E_JSKRNQQRSTVUYTZS", ">fB^B]C[EZOZQYRWSYUZ_Za[b]b^", "E_JSZS RR[RK RLMXY RXMLY", "E_LRMSLTKSLRLT RXYYZX[WZXYX[ RXKYLXMWLXKXM", "D`KFHL RQFNL RWFTL R]FZL", "E_KRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT", "E_LXMYLZKYLXLZ RLLMMLNKMLLLN RRRSSRTQSRRRT RXXYYXZWYXXXZ RXLYMXNWMXLXN", "MWRYSZR[QZRYR[ RRNSORPQORNRP", "E_KRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT", "E_JSZS RR[RK RLXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN", "CaR\\S]R^Q]R\\R^ RRRSSRTQSRRRT RRHSIRJQIRHRJ", "CaR^S_R`Q_R^R` RRVSWRXQWRVRX RRNSORPQORNRP RRFSGRHQGRFRH", "OU", "RR", "RR", "RR", "RR", "RR", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "RR", "RR", "RR", "RR", "RR", "RR",
/* // Subscripts and Superscripts (2070-209F) */
"JZQ@S@UAVDVJUMSNQNOMNJNDOAQ@", "NVRDRN RR=Q>R?S>R=R?", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "JZUFUN RQ@NJWJ", "JZV@O@NFPESEUFVHVKUMSNPNNM", "JZNHOFQESEUFVHVKUMSNQNOMNKNFOCPAR@U@", "JZM@W@PN", "JZQFOENCOAQ@S@UAVCUESFQFOGNINKOMQNSNUMVKVIUGSF", "JZVFUHSIQIOHNFNCOAQ@S@UAVCVHUKTMRNON", "I[LHXH RRBRN", "I[LHXH", "I[LJXJ RLFXF", "MWT=S>RAQFQJROSRTS", "MWP=Q>RASFSJROQRPS", "KZODON ROEQDSDUEVGVN", "JZQSSSUTVWV]U`SaQaO`N]NWOTQS", "JZVaNa RNVPURSRa", "JZNTPSSSUTVVVXUZNaVa", "JZNSVSRXSXUYV[V^U`SaPaN`", "JZUYUa RQSN]W]", "JZVSOSNYPXSXUYV[V^U`SaPaN`", "JZN[OYQXSXUYV[V^U`SaQaO`N^NYOVPTRSUS", "JZMSWSPa", "JZQYOXNVOTQSSSUTVVUXSYQYOZN\\N^O`QaSaU`V^V\\UZSY", "JZVYU[S\\Q\\O[NYNVOTQSSSUTVVV[U^T`RaOa", "I[L[X[ RRURa", "I[L[X[", "I[L]X] RLYXY", "MWTPSQRTQYQ]RbSeTf", "MWPPQQRTSYS]RbQePf", "RR", "KZOXQWSWUXVZVa RV`TaQaO`N^O\\Q[V[", "LYV`TaRaP`O^OZPXRWSWUXVZV[O\\", "KYQaO`N^NZOXQWSWUXVZV^U`SaQa", "KYNWVa RVWNa", "LYOXQWSWUXVZV^U`SaRaP`O^O]V\\", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Currency Symbols (20A0-20CF) */
"F[XMPMP[X[ RTGRFNFLGKHJJJPKRLSNTUT", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RSBG_ RZBN_", "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR[RM RRQSOTNVMXM", "HZTPMP RM[MFWF RJVRV", "H[LMTM RL[W[ RO[OIPGRFUFWG RLSTS", "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RWHM`", "G]L[LFX[XF RHV\\V RHP\\P", "GyL[LFTFVGWHXJXMWOVPTQLQ R^MfM RaFaXbZd[f[ RlZn[r[tZuXuWtUrToTmSlQlPmNoMrMtN", "GmX[QQ RL[LFTFVGWHXJXMWOVPTQLQ R`Zb[f[hZiXiWhUfTcTaS`Q`PaNcMfMhN", "F^IFN[RLV[[F RHV\\V RHP\\P", "D`I[IFOFRGTIULUR RONOUPXRZU[[[[F", "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RRHZH RXaNa", "F[HSQS RHNTN RWYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH", "G\\L[LF RX[OO RXFLR RLOTO", "JZLFXF RR[RF ROVUR ROPUL", "IoK[RFY[K[ R`b`QaObNdMgMiNjOkQkWjYiZg[d[bZ`X", "G]ITJSLRNSOTQUSTXOYLYIXGVFUFSGRIRLSOXTYVYWXYWZT[", "G\\L[LFTFVGWHXJXMWOVPTQLQ RHL\\L", "F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RRCR^", "I[K[RFY[ RHV\\V RHP\\P", "H\\XZU[P[NZMYLWLUMSNRPQTPVOWNXLXJWHVGTFOFLG RRCR^", "HZVZT[P[NZMYLWLQMONNPMTMVN RRJR^", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Combining Diacritical Marks For Symbols (20D0-20FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Letterlike Symbols (2100-214F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Number Forms (2150-218F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Arrows (2190-21FF) */
"E_ZSJS RNWJSNO", "E_R[RK RNORKVO", "E_JSZS RVWZSVO", "E_RKR[ RVWR[NW", "E_JSZS RVWZSVO RNOJSNW", "E_R[RK RNORKVO RVWR[NW", "E_KLYZ RRLKLKS", "E_YLKZ RRLYLYS", "E_YZKL RRZYZYS", "E_KZYL RRZKZKS", "E_ZSJS RRWVO RNOJSNW", "E_JSZS RRONW RVWZSVO", "E_JWJQPQ RJQMTOUQTSRUQWRZU", "E_ZWZQTQ RZQWTUUSTQROQMRJU", "E_ZSJS RTOPSTW RNWJSNO", "E_R[RK RNURQVU RNORKVO", "E_JSZS RPOTSPW RVWZSVO", "E_RKR[ RVQRUNQ RVWR[NW", "E_JSVS RZOVSZW RNWJSNO", "E_ZSNS RJONSJW RVWZSVO", "E_ZOZW RJSZS RNWJSNO", "E_R[RK RV[N[ RNORKVO", "E_JOJW RZSJS RVWZSVO", "E_RKR[ RNKVK RVWR[NW", "E_N[V[ RR[RK RNWR[VW RNORKVO", "E_NWJSNO RJSWSYRZPYNWM", "E_VWZSVO RZSMSKRJPKNMM", "E_NWJSNO RJSWSYRZPYNWMUNTPTW", "E_VWZSVO RZSMSKRJPKNMMONPPPW", "E_PUJUJO RZWZQTQ RZQWTUUSTQROQMRJU", "E_JSZS RTOPW RNOJSNW RVWZSVO", "E_PWR[VY ROKLTVOR[", "E_V[VOJO RNSJONK", "E_N[NOZO RVSZOVK", "E_VKVWJW RNSJWN[", "E_NKNWZW RVSZWV[", "E_JOVOV[ RZWV[RW", "E_VKVWJW RNSJWN[", "E_OQKUGQ RYRYQXNVLSKQKNLLNKQKU", "E_UQYU]Q RKRKQLNNLQKSKVLXNYQYU", "E_KLYZ RKHYH RRLKLKS", "E_JWZW RJKJS RZSZ[ RZOJO RNSJONK RV[ZWVS", "E_[KUKUQ RMMLNKQKSLVNXQYSYVXXVYSYQXNUK", "E_IKOKOQ RWMXNYQYSXVVXSYQYNXLVKSKQLNOK", "E_ZSJSNO", "E_ZSJSNW", "E_R[RKVO", "E_R[RKNO", "E_JSZSVO", "E_JSZSVW", "E_RKR[VW", "E_RKR[NW", "E_ZWJW RJOZO RVSZOVK RN[JWNS", "E_N[NK RVKV[ RJONKRO RRWV[ZW", "E_JWZW RZOJO RNSJONK RV[ZWVS", "E_ZWJW RJOZO RN[JWNSJONK", "E_N[NK RVKV[ RJONKROVKZO", "E_JWZW RZOJO RV[ZWVSZOVK", "E_VKV[ RN[NK RZWV[RWN[JW", "E_JVZVVZ RZPJPNL", "E_ZVJVNZ RJPZPVL", "E_ZPMP RZVMV RRXVN ROXJSON", "E_MVWV RMPWP RSNQX ROXJSON RUNZSUX", "E_JVWV RJPWP RRNNX RUNZSUX", "E_ZPMP RZVMV ROXJSON", "E_ONO[ RUNU[ RWPRKMP", "E_JVWV RJPWP RUNZSUX", "E_UXUK ROXOK RMVR[WV", "E_MVWV RMPWP ROXJSON RUNZSUX", "E_OXON RUXUN RMVR[WV RWPRKMP", "E_[XOL RW\\KP RSLKLKT", "E_IXUL RM\\YP RQLYLYT", "E_INUZ RMJYV RQZYZYR", "E_[NOZ RWJKV RSZKZKR", "E_ZXOX RZSJS RZNON RQLJSQZ", "E_JXUX RJSZS RJNUN RSLZSSZ", "E_NWJSNO RZUWQTUQQNULSJS", "E_VWZSVO RJUMQPUSQVUXSZS", "E_NXVX RNSVS RR[RK RNORKVO", "E_VNNN RVSNS RRKR[ RVWR[NW", "E_ZSWS RSSQS RMSJS RNOJSNW", "E_R[RX RRTRR RRNRK RNORKVO", "E_JSMS RQSSS RWSZS RVWZSVO", "E_RKRN RRRRT RRXR[ RVWR[NW", "E_ZSJS RJWJO RNOJSNW", "E_JSZS RZOZW RVWZSVO", "E_ZPZVOVOXJSONOPZP", "E_U[O[OPMPRKWPUPU[", "E_JVJPUPUNZSUXUVJV", "E_OKUKUVWVR[MVOVOK", "E_U[O[OWUWU[ RUSOSOPMPRKWPUPUS", "E_W[M[MWOWOPMPRKWPUPUWWWW[", "E_ONUN RW[M[MWOWOPMPRKWPUPUWWWW[", "E_RKR[ RW[M[MWOWOPMPRKWPUPUWWWW[", "E_PPMPRKWPTP RU[O[OSMSRNWSUSU[", "E_PPMPRKWPTP RW[M[MWOWOSMSRNWSUSUWWWW[", "E_JNNNNPUPUNZSUXUVNVNXJXJN", "E_Z[NO RZKJKJ[ RUONONV", "E_JKVW RJ[Z[ZK ROWVWVP", "E_MPRKWPUPUVWVR[MVOVOPMP", "E_JSZS RVWZSVO RTRTTSVQWOWMVLTLRMPOOQOSPTR", "E_V[VK RNKN[ RZOVKRO RRWN[JW", "E_J[Z[ RJKZK RZSJS RVGZKVOZSVWZ[V_", "E_ZSJS RTWTO RNOJSNW", "E_JSZS RPOPW RVWZSVO", "E_JSZS RRORW RNOJSNW RVWZSVO", "E_ZSJS RWWWO RRWRO RNOJSNW", "E_JSZS RMOMW RRORW RVWZSVO", "E_JSZS RPOPW RTOTW RNWJSNO RVWZSVO", "E_NSZS RNWNOJSNW", "E_VSJS RVWVOZSVW", "E_NSVS RNWJSNONW RVWVOZSVW",
/* // Mathematical Operators (2200-22FF) */
"I[MLWL RKFR[YF", "HZVHUGSFPFNGMHLKLVMYNZP[S[UZVY", "H[WOVNTMPMNNMOLQLWMYNZP[S[UZVYWWWJVHUGSFOFMG", "I\\WPPP RM[W[WFMF", "I\\WQPQ RMFWFW[M[ RXCL`", "C`G[\\F ROFTFXHZJ\\N\\SZWXYT[O[KYIWGSGNIJKHOF", "I[K[RFY[K[", "I[YFR[KFYF", "C`\\QGQ R\\GOGKIIKGOGSIWKYO[\\[", "C`[CH^ R\\QGQ R\\GOGKIIKGOGSIWKYO[\\[", "E_JSZS RZZPZMYKWJTJRKOMMPLZL", "DaHP]P RHZUZYX[V]R]N[JYHUFHF", "DaI^\\C RHP]P RHZUZYX[V]R]N[JYHUFHF", "E_ZSJS RJZTZWYYWZTZRYOWMTLJL", "E_M[WQ RMZWP RMYWO RMXWN RMWWM RMVWL RMUWK RMTVK RMSUK RMRTK RMQSK RMPRK RMOQK RMNPK RMMOK RMLNK RN[WR RO[WS RP[WT RQ[WU RR[WV RS[WW RT[WX RU[WY RV[WZ RM[MKWKW[M[", "E_Z`ZFJFJ`", "E_ZFZ`J`JF", "E_Z`I`TSIF[F", "E_JSZS", "E_ZWJW RROR_ RJKZK", "E_JSZS RR[RK RRDQERFSERDRF", "G][EI`", "KYID[_", "E_KOYW RR[RK RYOKW", "E_PQRPTQUSTURVPUOSPQ", "E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ", "IbMTQSS[bB", "IbMTQSS[bB RN@V@RESEUFVHVKUMSNPNNM", "IbMTQSS[bB RUFUN RQ@NJWJ", "E_XPWPUQQUOVMULSMQOPQQUUWVXV", "E_TQVPXQYSXUVVTUPQNPLQKSLUNVPUTQ", "E_JKJ[Z[", "E_ZKJ[Z[", "E_ZKJ[Z[ RPSRUTZT]", "E_Z[JSZK RSYTWUSTOSM", "H\\RbRD", "H\\NUVQ RRDRb", "H\\ODOb RUDUb", "H\\LVXP RODOb RUDUb", "E_[[RKI[", "E_IKR[[K", "E_Z[ZQXMTKPKLMJQJ[", "E_JKJULYP[T[XYZUZK", "H\\L]M_O`Q_R]RISGUFWGXI", "D`H]I_K`M_N]NIOGQFSGTI RP]Q_S`U_V]VIWGYF[G\\I", "@dD]E_G`I_J]JIKGMFOGPI RL]M_O`Q_R]RISGUFWGXI RT]U_W`Y_Z]ZI[G]F_G`I", "H\\L]M_O`Q_R]RISGUFWGXI RRMUNWPXSWVUXRYOXMVLSMPONRM", "D`H]I_K`M_N]NIOGQFSGTI RP]Q_S`U_V]VIWGYF[G\\I RVMYN[P\\S[VYXVYNYKXIVHSIPKNNMVM", "@dD]E_G`I_J]JIKGMFOGPI RL]M_O`Q_R]RISGUFWGXI RT]U_W`Y_Z]ZI[G]F_G`I RZM]N_P`S_V]XZYJYGXEVDSEPGNJMZM", "H\\URXU[R RLSMPONRMUNWPXSXU RL]M_O`Q_R]RISGUFWGXI", "H\\UQXT[Q RL]M_O`Q_R]RISGUFWGXI RLSMPONRMUNWPXSWVUXRYOXMVLS", "H\\UUXR[U RL]M_O`Q_R]RISGUFWGXI RLSMPONRMUNWPXSWVUXRYOXMVLS", "E_KXLYKZJYKXKZ RRLSMRNQMRLRN RYXZYYZXYYXYZ", "E_YNXMYLZMYNYL RRZQYRXSYRZRX RKNJMKLLMKNKL", "JZRXSYRZQYRXRZ RRLSMRNQMRLRN", "E_LXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN", "E_JSZS RRFQGRHSGRFRH", "E_JSTS RYXZYYZXYYXYZ RYLZMYNXMYLYN", "E_JSZS RLXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN", "E_JSKRNQQRSTVUYTZS RRXSYRZQYRXRZ RRLSMRNQMRLRN", "E_JSKRNQQRSTVUYTZS", "E_ZSYRVQSRQTNUKTJS", "E_WPYQZSYUWVTUPQMPKQJSKUMV", "E_JSKNLLNKPLQNSXTZV[XZYXZS", "E_RKSLTOSRQTPWQZR[", "E_JSKRNQQRSTVUYTZS RVKN[", "E_ZPJP RZVYWVXSWQUNTKUJV", "E_JVZV RJPKONNQOSQVRYQZP", "E_JVZV RJPKONNQOSQVRYQZP RVKN[", "E_JYZY RJSZS RJMKLNKQLSNVOYNZM", "E_JYZY RJSZS RUPO\\ RJMKLNKQLSNVOYNZM", "E_JYZY RJSZS RJMKLNKQLSNVOYNZM RXGL_", "E_JVKUNTQUSWVXYWZV RJPKONNQOSQVRYQZP", "E_JVKUNTQUSWVXYWZV RJPKONNQOSQVRYQZP RVKN[", "E_JYZY RJSKRNQQRSTVUYTZS RJMKLNKQLSNVOYNZM", "E_JYKXNWQXSZV[YZZY RJSKRNQQRSTVUYTZS RJMKLNKQLSNVOYNZM", "E_ZYJY RZSJS RZMYLVKSLQNNOKNJM", "E_JXLWPVTVXWZX RJNLOPPTPXOZN", "E_JVNVNWOYQZSZUYVWVVZV RJPNPNOOMQLSLUMVOVPZP", "E_ZVJV RJPNPNOOMQLSLUMVOVPZP", "E_JPZP RZVJV RRHQIRJSIRHRJ", "E_JPZP RZVJV RRXSYRZQYRXRZ RRLSMRNQMRLRN", "E_JPZP RZVJV RKJLKKLJKKJKL RYZZ[Y\\X[YZY\\", "E_ZPJP RJVZV RYJXKYLZKYJYL RKZJ[K\\L[KZK\\", "AcNP^P R^VNV RGVHWGXFWGVGX RGNHOGPFOGNGP", "AcVPFP RFVVV R]V\\W]X^W]V]X R]N\\O]P^O]N]P", "E_JPZP RZVJV RPQRPTQUSTURVPUOSPQ", "E_JPZP RZVJV RRJPIOGPERDTEUGTIRJ", "E_JPZP RZVJV RNJOHQGSGUHVJ", "E_JPZP RZVJV RNJRGVJ", "E_JPZP RZVJV RNGRJVG", "E_JPZP RZVJV RRATGOCUCPGRA", "E_JPZP RZVJV RR?NJVJR?", "E_JPZP RYC]C RZVJV R]?[@ZBZJ RM?MJKJIIHGHEICKBMB RQFVFVCUBRBQCQIRJUJ", "E_JPZP RZVJV RMBMJ RMCNBQBRCRJ RRCSBVBWCWJ", "E_JPZP RZVJV RRHSIRJQIRHRJ RN@P?S?U@VBUDSE", "E_JPZP RTMPY RZVJV", "E_JYZY RJSZS RJMZM", "E_JYZY RJSZS RJMZM RXGL_", "E_J\\Z\\ RJPZP RJJZJ RZVJV", "E_ZZJZ RZVJPZJ", "E_JZZZ RJVZPJJ", "E_J]Z] RZWJW RZSJMZG", "E_Z]J] RJWZW RJSZMJG", "E_J]Z] RTTP` RZWJW RZSJMZG", "E_JWZW RTTP` RZ]J] RJSZMJG", "=gRMBSRY RbMRSbY", "=gRMbSRY RBMRSBY", "I[OCPDRGSITLUQUUTZS]R_PbOc RUcTbR_Q]PZOUOQPLQIRGTDUC", "E_JXLWPVTVXWZX RJNLOPPTPXOZN RVKN[", "E_ZMJSZY RVKN[", "E_JMZSJY RVKN[", "E_ZZJZ RZVJPZJ RXGL_", "E_JZZZ RJVZPJJ RXGL_", "E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ", "E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ", "E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ RXGL_", "E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ RXGL_", "E_JSZYJ_ RZSJMZG", "E_ZSJYZ_ RJSZMJG", "E_JSZYJ_ RZSJMZG RXGL_", "E_ZSJYZ_ RJSZMJG RXGL_", "E_ZKXNVPRRJSRTVVXXZ[", "E_JKLNNPRRZSRTNVLXJ[", "E_JVRWVYX[Z^ RZHXKVMROJPRQVSXUZX", "E_ZVRWNYL[J^ RJHLKNMROZPRQNSLUJX", "E_J[KZNYQZS\\V]Y\\Z[ RZHXKVMROJPRQVSXUZX", "E_J[KZNYQZS\\V]Y\\Z[ RJXLUNSRQZPRONMLKJH", "E_ZKXNVPRRJSRTVVXXZ[ RVKN[", "E_JKLNNPRRZSRTNVLXJ[ RVKN[", "E_ZMNMLNKOJQJUKWLXNYZY", "E_JMVMXNYOZQZUYWXXVYJY", "E_ZMNMLNKOJQJUKWLXNYZY RVKN[", "E_JMVMXNYOZQZUYWXXVYJY RVKN[", "E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV", "E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV", "E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV RXGL_", "E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV RXGL_", "E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV RSYQ_", "E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV RSYQ_", "E_JKJULYP[T[XYZUZK ROSUS RSUUSSQ", "E_JKJULYP[T[XYZUZK RRRQSRTSSRRRT", "E_JKJULYP[T[XYZUZK RLSXS RRMRY", "E_ZYJYJMZM", "E_JYZYZMJM", "E_Z\\J\\ RZVJVJJZJ", "E_J\\Z\\ RJVZVZJJJ", "E_Z[ZKJKJ[", "E_JKJ[Z[ZK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLSXS RRMRY", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLSXS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RMNWX RWNMX", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RWFM^", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRRQSRTSSRRRT", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRNRS RMQRSWQ ROWRSUW", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLUXU RLQXQ", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RNSVS", "E_JKZKZ[J[JK RLSXS RRMRY", "E_JKZKZ[J[JK RLSXS", "E_JKZKZ[J[JK RMNWX RWNMX", "E_JKZKZ[J[JK RRRQSRTSSRRRT", "E_J[JK RJSZS", "E_Z[ZK RZSJS", "E_ZKJK RRKR[", "E_J[Z[ RR[RK", "I[NSVS RNKN[", "I[NVVV RNPVP RNKN[", "E_JVZV RJPZP RJKJ[", "E_JKJ[ RPSZS RPKP[", "E_JKJ[ ROKO[ RTKT[ RYSTS", "E_JKJ[ RPVYV RPPYP RPKP[", "E_J[JK RJSZS RXGL_", "E_JVZV RJPZP RJKJ[ RXGL_", "E_JKJ[ RPSZS RPKP[ RXGL_", "E_JKJ[ RPVYV RPPYP RPKP[ RXGL_", "E_VKXLYNXPVQRRJSRTVUXVYXXZV[", "E_NKLLKNLPNQRRZSRTNULVKXLZN[", "E_JSZYZMJS", "E_ZSJYJMZS", "E_Z[J[ RJQZWZKJQ", "E_J[Z[ RZQJWJKZQ", "BbXQXU RYQYU RZPZV R[Q[U R\\Q\\U RMSLQJPHQGSHUJVLUMSWSXUZV\\U]S\\QZPXQWS", "BbLQLU RKQKU RJPJV RIQIU RHQHU RWSXQZP\\Q]S\\UZVXUWSMSLUJVHUGSHQJPLQMS", "E_JSTSUUWVYUZSYQWPUQTS", "E_JSNS RR[RW RRKRO RZSVS", "I[NFVF RRFR[", "E_J[Z[ RZKRVJK", "E_ZKJK RJ[RPZ[", "E_JKZK RZPR[JP", "E_JKJ[Z[ RJOLOQQTTVYV[", "E_Z[ZKJ[Z[", "Bb_`REE`", "BbEFRa_F", "Bb]`]O\\KZHWFSEQEMFJHHKGOG`", "BbGFGWH[J^M`QaSaW`Z^\\[]W]F", "E_RaJSRFZSRa", "JZRRQSRTSSRRRT", "I[RRTXOTUTPXRR", "E_ZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN RLMXY RXMLY", "E_JKZ[ZKJ[JK", "E_ZKJ[JKZ[", "E_JKZ[ZKJ[", "E_JKZ[ RRSJ[", "E_ZKJ[ RRSZ[", "E_ZVJV RZPYOVNSOQQNRKQJP", "E_JKMMOOQSR[SSUOWMZK", "E_Z[WYUWSSRKQSOWMYJ[", "E_ZPSPQQPSQUSVZV RZ\\Q\\N[KXJUJQKNNKQJZJ", "E_JPQPSQTSSUQVJV RJ\\S\\V[YXZUZQYNVKSJJJ", "E_U[UTTRRQPROTO[ R[[[RZOWLTKPKMLJOIRI[", "E_OKORPTRUTTURUK RIKITJWMZP[T[WZZW[T[K", "E_RKR[ RL[LSMPNOQNSNVOWPXSX[", "E_JPZP RZVJV RODOb RUDUb", "E_ZMJSZY RYRXSYTZSYRYT", "E_JMZSJY RKRJSKTLSKRKT", "5oJM:SJY RZMJSZY RjMZSjY", "5oZMjSZY RJMZSJY R:MJS:Y", "E_ZSJS RJWZ[J_ RZOJKZG", "E_JSZS RZWJ[Z_ RJOZKJG", "E_ZLJL RZPJVZ\\", "E_JLZL RJPZVJ\\", "E_JPROVMXKZH RZ^X[VYRWJVRUVSXQZN", "E_ZPRONMLKJH RJ^L[NYRWZVRUNSLQJN", "E_JPROVMXKZH RZ^X[VYRWJVRUVSXQZN RXGL_", "E_ZPRONMLKJH RJ^L[NYRWZVRUNSLQJN RXGL_", "E_Z\\J\\ RZVJVJJZJ RXGL_", "E_J\\Z\\ RJVZVZJJJ RXGL_", "E_Z\\J\\ RZVJVJJZJ RSYQ_", "E_J\\Z\\ RJVZVZJJJ RSYQ_", "E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ RSWQ]", "E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ RSWQ]", "E_J[KZNYQZS\\V]Y\\Z[ RZHXKVMROJPRQVSXUZX RSXQ^", "E_J[KZNYQZS\\V]Y\\Z[ RJXLUNSRQZPRONMLKJH RSXQ^", "E_JSZYZMJS RXGL_", "E_ZSJYJMZS RXGL_", "E_Z[J[ RJQZWZKJQ RXGL_", "E_J[Z[ RZQJWJKZQ RXGL_", "CaR\\S]R^Q]R\\R^ RRRSSRTQSRRRT RRHSIRJQIRHRJ", "CaHRISHTGSHRHT RRRSSRTQSRRRT R\\R]S\\T[S\\R\\T", "Ca\\H[I\\J]I\\H\\J RRRQSRTSSRRRT RH\\G]H^I]H\\H^", "CaHHIIHJGIHHHJ RRRSSRTQSRRRT R\\\\]]\\^[]\\\\\\^", ">`BQ\\Q R\\GOGKIIKGOGSIWKYO[\\[", ">`GQ\\Q R\\M\\U R\\GOGKIIKGOGSIWKYO[\\[", "E_JSZS RZPZV RZZPZMYKWJTJRKOMMPLZL", "C`\\QGQ R\\GOGKIIKGOGSIWKYO[\\[ RR@QARBSAR@RB", "C`GA\\A R\\QGQ R\\[O[KYIWGSGOIKKIOG\\G", "E_JSZS RZGJG RZLPLMMKOJRJTKWMYPZZZ", "C`G`\\` R\\PGP R\\FOFKHIJGNGRIVKXOZ\\Z", "C`HT\\T RHN\\N R\\GOGKIIKGOGSIWKYO[\\[", "DfbQHQ RHGUGYI[K]O]S[WYYU[H[", "Df]QHQ RHMHU RHGUGYI[K]O]S[WYYU[H[", "E_ZSJS RJPJV RJZTZWYYWZTZRYOWMTLJL", "Da]AHA RHQ]Q RH[U[YY[W]S]O[KYIUGHG", "E_ZSJS RJGZG RJLTLWMYOZRZTYWWYTZJZ", "C`GQ\\Q R\\GGGG[\\[",
/* // Miscellaneous Technical (2300-23FF) */
"E_PKTKXMZQZUXYT[P[LYJUJQLMPK RZKJ[", "E_JQRWROZU", "E_J[JORGZOZ[J[", "E_NORKVO", "E_VWR[NW", "E_ZKJK RJ[RPZ[", "E_JNZN RJHZH RJ[RSZ[", "H\\RDSETGSIRJQLRNSOTQSSRTQVRXSYT[S]R^Q`Rb", "KYQbQDVD", "KYSbSDND", "KYQDQbVb", "KYSDSbNb", "E_RWR[ RVSZS", "E_RWR[ RNSJS", "E_RORK RVSZS", "E_RORK RNSJS", "E_ZQJQJV", "D`[JZLYPYVZZ[\\Y[UZOZK[I\\JZKVKPJLIJKKOLULYK[J", "E_JSJQLMPKTKXMZQZS", "E_JSJQLMPKTKXMZQZS RJSZS", "E_JMLLPKTKXLZMR[JM", "E_PUJ[ RTKWLYNZQYTWVTWQVOTNQONQLTK", "E_JSZS RR[RK RVRUPSOQOOPNRNTOVQWSWUVVTVR", "E_JWZW RJOZO RNKN[ RVKV[", "E_LPXPZO[MZKXJVKUMUYV[X\\Z[[YZWXVLVJWIYJ[L\\N[OYOMNKLJJKIMJOLP", "E_ZUJUJP", "E_RORSUS RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_M[RVW[ RN[RWV[ RP[RYT[ RS[RZQ[ RU[RXO[ RYMRPKMROYM RJFZFZKYMKTJVJ[Z[ZVYTKMJJJF", "JZVFNFNM", "JZNFVFVM", "JZV[N[NT", "JZN[V[VT", "H\\RbRMSITGVFXGYI", "H\\RDRYQ]P_N`L_K]", "E_JUKTMSRRWSYTZU", "E_ZQYRWSRTMSKRJQ", "E_LKHK RXK\\K RNORKVO", "@dXK^K RFKLKX[^[", "AfJKZ[ RZKJ[ RFKZKbSZ[F[FK", "AcJKZ[ RZKJ[ RFK^K^[F[FK", "9k>VfV R>LfL RCQCL RD[DV REVEQ RFLFG RHQHL RJVJQ RK[KV RKLKG RMQML ROVOQ RPLPG RRQRL RTVTQ RULUG RWQWL RYVYQ RZ[ZV RZLZG R\\Q\\L R^V^Q R_L_G R`[`V R>QaQaL R>[>GfGf[>[", "KYUcOSUC", "KYOcUSOC", ">cZKJ[ RJKZ[ R^KJKBSJ[^[^K", "AcKOKW RR[YW RRKYO RRE^L^ZRaFZFLRE", "H\\PNKX RYNTX RVRUPSOQOOPNRNTOVQWSWUVVTVR", "E_N[J[JW RZSRSJ[ RVRUPSOQOOPNRNTOVQWSWUVVTVR", "E_JSZS RNYVY RVMNM", "E_RPRKNN RZPZKVN RRKJ[R[ZK", "H\\LS[S RRMRY RXP[SXV RVRUPSOQOOPNRNTOVQWSWUVVTVR", "E_ZSJ\\JJZS RJSZS", "E_J[JRZ[J[", "E_JWJ[Z[ZW", "E_VWR[NW", "D`JaZa RJFZF RRFRa", "D`MFWFWaMaMF", "D`IF[F[aIaIF RJPZP RZVJV", "D`IF[F[aIaIF RZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN", "D`IF[F[aIaIF RRJ[SR\\ISRJ", "D`IF[F[aIaIF RPQRPTQUSTURVPUOSPQ", "D`IF[F[aIaIF RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRbRD", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ", "E_JSZS RZKJ[", "E_JSZS RJKZ[", "D`IaIF[F[aIa[F", "D`[a[FIFIa[aIF", "D`IF[F[aIaIF RZMJSZY", "D`IF[F[aIaIF RJMZSJY", "E_ZSJS RNWJSNO RR[RK", "E_JSZS RVWZSVO RR[RK", "D`IF[F[aIaIF RZSJS RNWJSNO", "D`IF[F[aIaIF RJSZS RVWZSVO", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLGX_", "E_J[Z[ RR[RK RZaJa", "E_RKX[L[RK RRbRD", "D`IF[F[aIaIF RIKR[[K", "D`IF[F[aIaIF RRKX[L[RK", "E_ZKJK RRKR[ RVRUPSOQOOPNRNTOVQWSWUVVTVR", "E_R[RK RNORKVO RJSZS", "D`IF[F[aIaIF RR[RK RNORKVO", "E_ZKJK RRKR[ RMEWE", "E_R[LKXKR[ RRbRD", "D`IF[F[aIaIF R[[RKI[", "D`IF[F[aIaIF RR[LKXKR[", "E_J[Z[ RR[RK RPQRPTQUSTURVPUOSPQ", "E_RKR[ RVWR[NW RJSZS", "D`IF[F[aIaIF RRKR[ RVWR[NW", "JZJ]Z] RSFQJ", "E_RKX[L[RK RJ]Z]", "E_RJ[SR\\ISRJ RJ]Z]", "E_PQRPTQUSTURVPUOSPQ RJ]Z]", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RJ]Z]", "E_Z[ZQXMTKPKLMJQJ[ RPQRPTQUSTURVPUOSPQ", "D`IF[F[aIaIF RSFQJ", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRPTVORURPVRP", "D`IF[F[aIaIF RRYSZR[QZRYR[ RRNSORPQORNRP", "E_ZKJK RRKR[ RNDOENFMENDNF RVDWEVFUEVDVF", "E_R[LKXKR[ RNFOGNHMGNFNH RVFWGVHUGVFVH", "E_RKWZJQZQMZRK RNDOENFMENDNF RVDWEVFUEVDVF", "E_PQRPTQUSTURVPUOSPQ RNIOJNKMJNINK RVIWJVKUJVIVK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RNDOENFMENDNF RVDWEVFUEVDVF", "E_JKJULYP[T[XYZUZK RRbRD", "E_ZMNMLNKOJQJUKWLXNYZY RRbRD", "E_JSKRNQQRSTVUYTZS RNFOGNHMGNFNH RVFWGVHUGVFVH", "E_JMZSJY RNFOGNHMGNFNH RVFWGVHUGVFVH", "E_JSZS RSZS[R]Q^", "E_R[LKXKR[ RJSKRNQQRSTVUYTZS", "H\\QFSFUGVHWJXNXSWWVYUZS[Q[OZNYMWLSLNMJNHOGQF RJPKONNQOSQVRYQZP", "E_JSKRNQQRSTVUYTZS RRbRD", "MWSZS[R]Q^ RRNSORPQORNRP RJ]Z]", "D`IF[F[aIaIF RJPZP RTMPY RZVJV", "D`IF[F[aIaIF RQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS", "E_IKR[[K RJSKRNQQRSTVUYTZS", "E_[[RKI[ RJSKRNQQRSTVUYTZS", "MXRMRXSZU[", "H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RJ]Z]", "HZLTST RVZT[P[NZMYLWLQMONNPMTMVN RJ]Z]", "MXRMRXSZU[ RJ]Z]", "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RJ]Z]", "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[", "IbMTQSS[bB RXL`L", "A_J_F_F[ RJKJ[Z[ RF_OVEQOG", "E_JWNWN[V[VWZW", "E_NSN[J[ RVSV[Z[ RJSJQLMPKTKXMZQZSJS", "E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ RRbRD", "E_VWR[NW ROEQDSDUEVGVN RVMTNQNOMNKOIQHVH", "BbF[^[ RGLIKKKMLNNNU RUSVTUUTTUSUU R]S^T]U\\T]S]U RNTLUIUGTFRGPIONO", "BbF[N[ RV[^[ RGLIKKKMLNNNU RWLYK[K]L^N^U RNTLUIUGTFRGPIONO R^T\\UYUWTVRWPYO^O", "BbHPDP RJUFX RJKFH R^XZU R^HZK R`P\\P RTTRUPUNTMRMQNNPLRKVKTU", "=_RKR[B[BKRK RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_JKZKZ[J[JK RRbRD", "C_ESUS RQWUSQO RJWJ[Z[ZKJKJO", "@dX[^[ RZO^KZG RF[L[XK^K", "E_KOYW RR[RK RYOKW RRMONMPLSMVOXRYUXWVXSWPUNRM", "E_JSOSR[USZS RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_R[KOYOR[ RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_STJK RJOJKNK RSKTKXMZQZUXYT[P[LYJUJT", "D`KNKROR RYRWPTOPOMPKR RNXMVKUIVHXIZK[MZNX RVXWZY[[Z\\X[VYUWVVX", "E_I[N[NKVKV[[[", "E_I[V[VK RN[NK[K", "E_JKZK RJSRKZSR[JS", "E_Z[J[ RZSR[JSRKZS", "E_JKZK RJSRKZSR[JS RJSZS", "E_Z[J[ RZSR[JSRKZS RJSZS", "E_JVLV RJPZP RQVSV RXVZV", "BbL[FQLGXG^QX[L[", "D`IF[F[aIaIF", "MWTFQL", "AcZSJS RRORK RR[RW RNOJSNW R^[F[FK^K^[", "AcJSZS RRWR[ RRKRO RVWZSVO RFK^K^[F[FK", "BbLHQHQC RLSLHQCXCXSLS RLKJKHLGNGXHZJ[Z[\\Z]X]N\\LZKXK", "BbROJW RZORW RGXGNHLJKZK\\L]N]X\\ZZ[J[HZGX", "H\\XDVGUITLSQR[Rb", "H\\RbRD", "H\\XbV_U]TZSURKRD", "H\\LDNGOIPLQQR[Rb", "H\\RbRD", "H\\LbN_O]PZQURKRD", "H\\XGRGRb", "H\\RbRD", "H\\X_R_RD", "H\\LGRGRb", "H\\RbRD", "H\\L_R_RD", "H\\XDTHSJRNRb", "H\\RDRIQMPOLSPWQYR]Rb", "H\\XbT^S\\RXRD", "H\\RbRD", "H\\LDPHQJRNRb", "H\\RDRISMTOXSTWSYR]Rb", "H\\LbP^Q\\RXRD", "H\\RbRD", "H\\HS\\S", "H\\WDSHRKR[Q^Mb", "H\\MDQHRKR[S^Wb", "E_VbIF\\F", "E_VDI`\\`", ">fC^CYaYa^", ">fCHCMaMaH", ">fC^CYaYa^ RaHaMCMCH", "IbMTQSS[bB", "H\\RbRD", "H\\RbRD", "H\\HG\\G", "H\\HM\\M", "H\\\\YHY", "H\\\\_H_", "E_UFOFO[", "E_U[O[OF", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRbRD", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RZEJE RRERa", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RJaZa RRaRE", "E_RK[[I[RK RRbRD", "E_RK[[I[RK RZEJE RRERa", "E_RK[[I[RK RJaZa RRaRE", "E_JSKRNQQRSTVUYTZS RRbRD", "E_JSKRNQQRSTVUYTZS RZEJE RRERa", "E_JSKRNQQRSTVUYTZS RJaZa RRaRE", "E_JaZa RRaRE", "E_ZEJE RRERa", "E_OFUFU[", "E_O[U[UF", "D`TFQL RMKJKJ[Z[ZKWK", "E_IWN\\NZZZZKTKTTNTNRIW", "E_Z[J[ RJVRKZV", "H\\RbRD", "H\\NQNROTQUSUUTVRVQ", "H\\NQNROTQUSUUTVRVQ RMKWK", "H\\NQNROTQUSUUTVRVQ RW[M[", "CaGQGRHTJULUNTOROQ RUQURVTXUZU\\T]R]Q RGK]K", "CaGQGRHTJULUNTOROQ RUQURVTXUZU\\T]R]Q R][G[", "E_JQJRKTMUOUQTRRRQ RRRSTUUWUYTZRZQ", "E_JUZUZP", "E_JPJUZUZP", "E_RPRU RJPJUZUZP", "E_HO\\O RLUXU RRFRO RT[P[", "E_HS\\S RJMZMZYJYJM", ">fB]C\\FZHYKXPWTWYX\\Y^Za\\b]", ">fbIaJ^L\\MYNTOPOKNHMFLCJBI", ">fB^B]C[EZOZQYRWSYUZ_Za[b]b^", ">fbHbIaK_LULSMROQMOLELCKBIBH", ">fB^FY^Yb^", ">fbH^MFMBH", "E_I[NKVK[[I[", "AcRE^L^ZRaFZFLRE RQLSLVMXOYRYTXWVYSZQZNYLWKTKRLONMQL", "E_JSZS", "E_HXMN\\NWXHX", "E_JSZS RJSKNLLNKPLQNSXTZV[XZYXZS", "E_LMXY RXMLY RPQRPTQUSTURVPUOSPQ", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Control Pictures (2400-243F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Optical Character Recognition (2440-245F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Enclosed Alphanumerics (2460-24FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Box Drawing (2500-257F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Block Elements (2580-259F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Geometric Shapes (25A0-25FF) */
"E_KKK[ RL[LK RMKM[ RN[NK ROKO[ RP[PK RQKQ[ RR[RK RSKS[ RT[TK RUKU[ RV[VK RWKW[ RX[XK RYKY[ RJKZKZ[J[JK", "E_JKZKZ[J[JK", "E_KLMKWKYLZNZXYZW[M[KZJXJNKL", "E_JKZKZ[J[JK RPPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV", "E_JWZW RJSZS RJOZO RJKZKZ[J[JK", "E_NKN[ RRKR[ RVKV[ RJKZKZ[J[JK", "E_JWZW RJSZS RJOZO RNKN[ RRKR[ RVKV[ RJKZKZ[J[JK", "E_JKZ[ RN[JW RT[JQ RZUPK RZOVK RJKZKZ[J[JK", "E_J[ZK RJUTK RJONK RP[ZQ RV[ZW RJKZKZ[J[JK", "E_J[ZK RJUTK RJONK RJKZ[ RN[JW RP[ZQ RT[JQ RV[ZW RZUPK RZOVK RJKZKZ[J[JK", "E_PPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV", "E_OVOPUPUVOV", "E_JXTN RJWSN RJVRN RJUQN RJTPN RJSON RJRNN RJQMN RJPLN RJOKN RKXUN RLXVN RMXWN RNXXN ROXYN RPXZN RQXZO RRXZP RSXZQ RTXZR RUXZS RVXZT RWXZU RXXZV RYXZW RJNZNZXJXJN", "E_JNZNZXJXJN", "E_M[WQ RMZWP RMYWO RMXWN RMWWM RMVWL RMUWK RMTVK RMSUK RMRTK RMQSK RMPRK RMOQK RMNPK RMMOK RMLNK RN[WR RO[WS RP[WT RQ[WU RR[WV RS[WW RT[WX RU[WY RV[WZ RM[MKWKW[M[", "E_M[MKWKW[M[", "E_NNLP RONKR RPNJT RQNIV RRNHX RSNIX RTNJX RUNKX RVNLX RWNMX RXVVX RXNNX RYTUX RYNOX RZRTX RZNPX R[PSX R[NQX R\\NRX RHXMN\\NWXHX", "E_HXMN\\NWXHX", "E_JZJ[ RKXK[ RLVL[ RMTM[ RNSN[ ROQO[ RPOP[ RQMQ[ RRKR[ RSMS[ RTOT[ RUQU[ RVSV[ RWTW[ RXVX[ RYXY[ RZ[RLJ[ RZZZ[ RRK[[I[RK", "E_RK[[I[RK", "E_OUOV RPSPV RQQQV RRORV RSQSV RTSTV RUUUV ROVRPUV RROVVNVRO", "E_ROVVNVRO", "E_KKK[ RLLLZ RMLMZ RNMNY ROMOY RPNPX RQNQX RRORW RSPSV RTPTV RUQUU RVQVU RWSXS RWRWT RJKYSJ[ RZSJ\\JJZS", "E_ZSJ\\JJZS", "E_PPPV RQQQU RRQRU RSSUS RSRST ROPUSOV RVSOWOOVS", "E_VSOWOOVS", "E_KNKX RLNLX RMOMW RNONW ROOOW RPPPV RQPQV RRPRV RSQSU RTQTU RURUT RVRVT RWRWT RXSWS RJNYSJX RZSJYJMZS", "E_ZSJYJMZS", "E_ZLZK RYNYK RXPXK RWRWK RVSVK RUUUK RTWTK RSYSK RR[RK RQYQK RPWPK ROUOK RNSNK RMRMK RLPLK RKNKK RJKRZZK RJLJK RR[IK[KR[", "E_R[IK[KR[", "E_UQUP RTSTP RSUSP RRWRP RQUQP RPSPP ROQOP RUPRVOP RRWNPVPRW", "E_RWNPVPRW", "E_Y[YK RXZXL RWZWL RVYVM RUYUM RTXTN RSXSN RRWRO RQVQP RPVPP ROUOQ RNUNQ RMSLS RMTMR RZ[KSZK RJSZJZ\\JS", "E_JSZJZ\\JS", "E_TVTP RSUSQ RRURQ RQSOS RQTQR RUVOSUP RNSUOUWNS", "E_NSUOUWNS", "E_YXYN RXXXN RWWWO RVWVO RUWUO RTVTP RSVSP RRVRP RQUQQ RPUPQ ROTOR RNTNR RMTMR RLSMS RZXKSZN RJSZMZYJS", "E_JSZMZYJS", "E_JRJT RKUKQ RLPLV RMWMO RNNNX ROYOM RPLPZ RQ[QK RRJR\\ RS[SK RTLTZ RUYUM RVNVX RWWWO RXPXV RYUYQ RZRZT RRJ[SR\\ISRJ", "E_RJ[SR\\ISRJ", "E_RJ[SR\\ISRJ RPRPT RQUQQ RRPRV RSUSQ RTRTT RRPUSRVOSRP", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ", "E_RaJSRFZSRa", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK", "E_JQKO RKWJU RNLPK RP[NZ RTKVL RVZT[ RYOZQ RZUYW", "E_NLNZ RRKR[ RVLVZ RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ", "E_KOKW RLXP[ RLNPK RLMLY RMYMM RNLNZ ROZOL RPKP[ RQ[QK RRKR[ RS[SK RT[XX RTKT[ RTKXN RUZUL RVLVZ RWYWM RXMXY RYWYO RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RKOKW RLYLM RMMMY RNZNL ROLOZ RP[LX RP[PK RLN RQKQ[ RR[P[LYJUJQLMPKRKR[", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RYWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RKOKS RLMLS RMSMM RNLNS ROSOL RPKLN RPKPS RQKQS RRKRS RSKSS RTSTK RXN RULUS RVSVL RWMWS RXMXS RYOYS RJSJQLMPKTKXMZQZSJS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RYWYS RXYXS RWSWY RVZVS RUSUZ RT[XX RT[TS RS[SS RR[RS RQ[QS RPSP[ RLX ROZOS RNSNZ RMYMS RLYLS RKWKS RZSZUXYT[P[LYJUJSZS", "E_SSSK RTKTS RTKXN RUSUL RVLVS RWSWM RXMXS RYSYO RZSRSRK RPKTKXMZQZUXYT[P[LYJUJQLMPK", "E_QSQ[ RP[PS RP[LX ROSOZ RNZNS RMSMY RLYLS RKSKW RJSRSR[ RT[P[LYJUJQLMPKTKXMZQZUXYT[ RYWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK", "E_KOKW RLYLM RMMMY RNZNL ROLOZ RP[LX RP[PK RLN RQKQ[ RR[P[LYJUJQLMPKRKR[", "E_YWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK", "E_FDFb RGbGD RHDHb RIbID RJDJb RKbKD RLbLW RLDLO RMXMb RMNMD RNbNY RNDNM ROZOb ROLOD RPbPZ RPDPL RQZQb RQLQD RRbRZ RRDRL RSZSb RSLSD RTbTZ RTDTL RUZUb RULUD RVbVY RVDVM RWXWb RWNWD RXbXW RXDXO RYbYD RZDZb R[b[D R\\D\\b R]b]D R^D^b R_bEbED_D_b RKTKRLONMQLSLVMXOYRYTXWVYSZQZNYLWKT", "E_FRFD RGNIJ RGDGN RHLHD RIDIK RJJJD RJJMG RKDKI RLHLD RMHQF RMDMH RNGND ROPOS RODOG RPSPP RPGPD RQPQS RQDQG RRSRO RRGRD RSPSS RSFWH RSDSG RTSTP RTGTD RUPUS RUDUG RVGVD RWGZJ RWDWH RXHXD RYDYI RZJZD R[J]N R[D[K R\\L\\D R]D]N R^R^D ROQROUQ RNSOPROUPVSNS RFSFRGNIKJJMHQGSGWHZJ[K]N^R^S_S_DEDESFS R^T^b R]X[\\ R]b]X R\\Z\\b R[b[[ RZ\\Zb RZ\\W_ RYbY] RX^Xb RW^S` RWbW^ RV_Vb RUVUS RUbU_ RTSTV RT_Tb RSVSS RSbS_ RRSRW RR_Rb RQVQS RQ`M^ RQbQ_ RPSPV RP_Pb ROVOS RObO_ RN_Nb RM_J\\ RMbM^ RL^Lb RKbK] RJ\\Jb RI\\GX RIbI[ RHZHb RGbGX RFTFb RUURWOU RVSUVRWOVNSVS R^S^T]X[[Z\\W^S_Q_M^J\\I[GXFTFSESEb_b_S^S", "E_FRFD RGNIJ RGDGN RHLHD RIDIK RJJJD RJJMG RKDKI RLHLD RMHQF RMDMH RNGND ROPOS RODOG RPSPP RPGPD RQPQS RQDQG RRSRO RRGRD RSPSS RSFWH RSDSG RTSTP RTGTD RUPUS RUDUG RVGVD RWGZJ RWDWH RXHXD RYDYI RZJZD R[J]N R[D[K R\\L\\D R]D]N R^R^D ROQROUQ RNSOPROUPVSNS RFSFRGNIKJJMHQGSGWHZJ[K]N^R^S_S_DEDESFS", "E_^T^b R]X[\\ R]b]X R\\Z\\b R[b[[ RZ\\Zb RZ\\W_ RYbY] RX^Xb RW^S` RWbW^ RV_Vb RUVUS RUbU_ RTSTV RT_Tb RSVSS RSbS_ RRSRW RR_Rb RQVQS RQ`M^ RQbQ_ RPSPV RP_Pb ROVOS RObO_ RN_Nb RM_J\\ RMbM^ RL^Lb RKbK] RJ\\Jb RI\\GX RIbI[ RHZHb RGbGX RFTFb RUURWOU RVSUVRWOVNSVS R^S^T]X[[Z\\W^S_Q_M^J\\I[GXFTFSESEb_b_S^S", "E_JSJQLMPKRK", "E_ZSZQXMTKRK", "E_ZSZUXYT[R[", "E_JSJULYP[R[", "E_JSJQLMPKTKXMZQZS", "E_ZSZUXYT[P[LYJUJS", "E_KZK[ RLYL[ RMXM[ RNWN[ ROVO[ RPUP[ RQTQ[ RRSR[ RSRS[ RTQT[ RUPU[ RVOV[ RWNW[ RXMX[ RYLY[ RZ[ZKJ[Z[", "E_YZY[ RXYX[ RWXW[ RVWV[ RUVU[ RTUT[ RSTS[ RRSR[ RQRQ[ RPQP[ ROPO[ RNON[ RMNM[ RLML[ RKLK[ RJ[JKZ[J[", "E_YLYK RXMXK RWNWK RVOVK RUPUK RTQTK RSRSK RRSRK RQTQK RPUPK ROVOK RNWNK RMXMK RLYLK RKZKK RJKJ[ZKJK", "E_KLKK RLMLK RMNMK RNONK ROPOK RPQPK RQRQK RRSRK RSTSK RTUTK RUVUK RVWVK RWXWK RXYXK RYZYK RZKZ[JKZK", "E_PQRPTQUSTURVPUOSPQ", "E_JKZKZ[J[JK RK[KK RLKL[ RM[MK RNKN[ RO[OK RPKP[ RQ[QK RJ[JKRKR[J[", "E_JKZKZ[J[JK RYKY[ RX[XK RWKW[ RV[VK RUKU[ RT[TK RSKS[ RZKZ[R[RKZK", "E_JKZKZ[J[JK RYLYK RXMXK RWNWK RVOVK RUPUK RTQTK RSRSK RRSRK RQTQK RPUPK ROVOK RNWNK RMXMK RLYLK RKZKK RJKJ[ZKJK", "E_JKZKZ[J[JK RKZK[ RLYL[ RMXM[ RNWN[ ROVO[ RPUP[ RQTQ[ RRSR[ RSRS[ RTQT[ RUPU[ RVOV[ RWNW[ RXMX[ RYLY[ RZ[ZKJ[Z[", "E_JKZKZ[J[JK RR[RK", "E_RK[[I[RK RRUQVRWSVRURW", "E_J[RL RJZJ[ RKXK[ RLVL[ RMTM[ RNSN[ ROQO[ RPOP[ RQMQ[ RRKR[ RRK[[I[RK", "E_Z[RL RZZZ[ RYXY[ RXVX[ RWTW[ RVSV[ RUQU[ RTOT[ RSMS[ RRKR[ RRKI[[[RK", "C`OFTFXHZJ\\N\\SZWXYT[O[KYIWGSGNIJKHOF", "E_JKZKZ[J[JK RRKRSJS", "E_JKZKZ[J[JK RR[RSJS", "E_JKZKZ[J[JK RR[RSZS", "E_JKZKZ[J[JK RRKRSZS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRKRSJS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RR[RSJS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RR[RSZS", "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRKRSZS", "E_JKJ[ZKJK", "E_ZKZ[JKZK", "E_J[JKZ[J[", "E_JKZKZ[J[JK", "E_KKK[ RL[LK RMKM[ RN[NK ROKO[ RP[PK RQKQ[ RR[RK RSKS[ RT[TK RUKU[ RV[VK RWKW[ RX[XK RYKY[ RJKZKZ[J[JK", "E_OVOPUPUVOV", "E_PPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV", "E_Z[ZKJ[Z[",
/* // Miscellaneous Symbols (2600-26FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Dingbats (2700-27BF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Miscellaneous Mathematical Symbols A (27C0-27EF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Supplemental Arrows A (27F0-27FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Braille Patterns (2800-28FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Supplemental Arrows B (2900-297F) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Miscellaneous Mathematical Symbols B (2980-29FF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Supplemental Mathematical Operators (2A00-2AFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[",
/* // Miscellaneous Symbols and Arrows (2B00-2BFF) */
"F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K[", "F^K[KFYFY[K["];

/***/ }),
/* 305 */,
/* 306 */,
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(118);
__webpack_require__(301);
module.exports = __webpack_require__(308);


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = __webpack_require__(302),
    Transform = _require.Transform,
    CanvasPlotter = _require.CanvasPlotter,
    SVGPlotter = _require.SVGPlotter,
    Library = _require.Library,
    Schematic = _require.Schematic;

var app = new Vue({
	el: '#app',
	data: {
		url: ["https://raw.githubusercontent.com/cho45/Keble/master/Root-cache.lib", "https://raw.githubusercontent.com/cho45/Keble/master/_keymodule_l.sch"].join("\n"),
		status: "init",
		lib: {},
		components: []
	},

	created: function created() {},

	mounted: function mounted() {
		console.log(this.$refs);
		this.onSubmit();
	},

	methods: {
		fileSelected: function fileSelected() {
			var files = Array.from(this.$refs.fileInput.files).map(function (f) {
				return { name: f.name, url: window.URL.createObjectURL(f) };
			});
			this.loadFiles(files);
		},

		onSubmit: function onSubmit() {
			var urls = this.url.replace(/^\s+|\s+$/g, '').split(/\s+/).map(function (u) {
				return { name: u, url: u.replace(/github\.com\/(.+)\/blob\/(.+)/, 'raw.githubusercontent.com/$1/$2') };
			});
			console.log(urls);
			if (!urls.length) {
				this.status = "url is required";
				return;
			}
			this.loadFiles(urls);
		},

		loadFiles: function () {
			var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(urls) {
				var res, text, files, schFiles, libFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, libs, sch, svgPlotter, svg, blob;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								console.log('loadFiles', urls);
								urls = urls.filter(function (url) {
									return (/[.](sch|lib)$/i.test(url.name)
									);
								});

								_context.next = 4;
								return Promise.all(urls.map(function (url) {
									return fetch(url.url);
								}));

							case 4:
								res = _context.sent;
								_context.next = 7;
								return Promise.all(res.map(function (r) {
									return r.text();
								}));

							case 7:
								text = _context.sent;
								files = text.map(function (t, i) {
									return { url: urls[i], content: t };
								});
								schFiles = [];
								libFiles = [];
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 14;

								for (_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									file = _step.value;

									if (file.url.name.toLowerCase().endsWith(".sch")) {
										schFiles.push(file);
									} else if (file.url.name.toLowerCase().endsWith(".lib")) {
										libFiles.push(file);
									}
								}

								_context.next = 22;
								break;

							case 18:
								_context.prev = 18;
								_context.t0 = _context["catch"](14);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 22:
								_context.prev = 22;
								_context.prev = 23;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 25:
								_context.prev = 25;

								if (!_didIteratorError) {
									_context.next = 28;
									break;
								}

								throw _iteratorError;

							case 28:
								return _context.finish(25);

							case 29:
								return _context.finish(22);

							case 30:
								if (schFiles.length) {
									_context.next = 33;
									break;
								}

								this.status = ".sch file is needed";
								return _context.abrupt("return");

							case 33:

								if (!libFiles.length) {
									this.status = ".lib file is needed";
								}

								libs = libFiles.map(function (file) {
									return Library.load(file.content);
								});
								sch = Schematic.load(schFiles[0].content);
								svgPlotter = new SVGPlotter();

								svgPlotter.plotSchematic(sch, libs);
								svg = svgPlotter.output;


								if (typeof Blob !== 'undefined') {
									blob = new Blob([svg], { type: 'image/svg+xml' });

									this.$refs.img.src = URL.createObjectURL(blob);
								} else {
									this.$refs.img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
								}

							case 40:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this, [[14, 18, 22, 30], [23,, 25, 29]]);
			}));

			function loadFiles(_x) {
				return _ref.apply(this, arguments);
			}

			return loadFiles;
		}()
	}
});

/***/ })
/******/ ]);
//# sourceMappingURL=schematic.bundle.js.map