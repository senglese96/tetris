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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/keymaster/keymaster.js":
/*!*********************************************!*\
  !*** ./node_modules/keymaster/keymaster.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//     keymaster.js
//     (c) 2011-2013 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    },
    code = function(x){
      return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];

  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // for comparing mods before unassignment
  function compareArray(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  var modifierMap = {
      16:'shiftKey',
      18:'altKey',
      17:'ctrlKey',
      91:'metaKey'
  };
  function updateModifierKey(event) {
      for(k in _mods) _mods[k] = event[modifierMap[k]];
  };

  // handle keydown event
  function dispatch(event) {
    var key, handler, k, i, modifiersMatch, scope;
    key = event.keyCode;

    if (index(_downKeys, key) == -1) {
        _downKeys.push(key);
    }

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }
    updateModifierKey(event);

    // see if we need to ignore the keypress (filter() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    scope = getScope();

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    }
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k,
        i = index(_downKeys, key);

    // remove key from _downKeys
    if (i >= 0) {
        _downKeys.splice(i, 1);
    }

    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods;
    keys = getKeys(key);
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }

    // for each shortcut
    for (var i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = code(key);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // unbind all handlers for given key in current scope
  function unbindKey(key, scope) {
    var multipleKeys, keys,
      mods = [],
      i, j, obj;

    multipleKeys = getKeys(key);

    for (j = 0; j < multipleKeys.length; j++) {
      keys = multipleKeys[j].split('+');

      if (keys.length > 1) {
        mods = getMods(keys);
        key = keys[keys.length - 1];
      }

      key = code(key);

      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      for (i = 0; i < _handlers[key].length; i++) {
        obj = _handlers[key][i];
        // only clear handlers if correct scope and mods match
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  };

  // Returns true if the key with code 'keyCode' is currently down
  // Converts strings into key codes.
  function isPressed(keyCode) {
      if (typeof(keyCode)=='string') {
        keyCode = code(keyCode);
      }
      return index(_downKeys, keyCode) != -1;
  }

  function getPressedKeyCodes() {
      return _downKeys.slice(0);
  }

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // abstract key logic for assign and unassign
  function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) == '') {
      keys[keys.length - 2] += ',';
    }
    return keys;
  }

  // abstract mods logic for assign and unassign
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    for (var mi = 0; mi < mods.length; mi++)
    mods[mi] = _MODIFIERS[mods[mi]];
    return mods;
  }

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  // store previously defined key
  var previousKey = global.key;

  // restore previously defined key and return reference to our key object
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;
  global.key.isPressed = isPressed;
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  global.key.noConflict = noConflict;
  global.key.unbind = unbindKey;

  if(true) module.exports = assignKey;

})(this);


/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/*! exports provided: Block, Tetrimino, I, T, L, J, O, S, Z */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Block", function() { return Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tetrimino", function() { return Tetrimino; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return I; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "T", function() { return T; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return L; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return J; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "O", function() { return O; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S", function() { return S; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Z", function() { return Z; });
class Block{
    constructor(options){
        this.pos = options.pos;
        this.color = options.color
    }

    updatePos(move, grid){
        this.pos = [move[0], move[1]]
        grid.board[this.pos[0]][this.pos[1]] = this
    }

    drawBlock(ctx) {
        let newPos = [this.pos[0] * 40, this.pos[1] * 40];
        let grad = ctx.createLinearGradient(newPos[1], newPos[0], newPos[1] + 40, newPos[0] + 40);
        grad.addColorStop(0, this.color);
        grad.addColorStop(0.35, this.color);
        grad.addColorStop(1, 'rgba(255,255,255,1)');

        ctx.fillStyle = grad;
        ctx.fillRect(newPos[1], newPos[0], 40, 40)
    }

    eraseBlock(ctx){
        let newPos = [this.pos[0] * 40, this.pos[1] * 40];
        ctx.clearRect(newPos[1], newPos[0], 40, 40)
    }
}

class Tetrimino{
    constructor(initial, pattern, color){
        this.blocks = [];
        this.orientation = 'up'
        pattern.forEach(pos => {
            this.blocks.push(new Block({pos: [initial[0] + pos[0], initial[1] + pos[1]], color: color}))
        })
    }

    move(dir, grid){
        this.blocks.forEach(block => {

            block.updatePos([block.pos[0] + dir[0], block.pos[1] + dir[1]], grid)
        })
    }

    draw(ctx){
        this.blocks.forEach(block => {
            block.drawBlock(ctx);
        })
    }

    rotate(grid, dir) {
        let moves = []
        let pivot = this.blocks[0].pos
        for (let i = 1; i < 4; i++) {
            if (dir === 1) {
                let newX = pivot[1] + pivot[0] - this.blocks[i].pos[0];
                let newY = pivot[0] - pivot[1] + this.blocks[i].pos[1];
                if (!grid.occupied([newY, newX], this)) {
                    moves.push([newY, newX])
                } else {
                    break
                }
            } else {
                let newX = pivot[1] - pivot[0] + this.blocks[i].pos[0];
                let newY = pivot[0] + pivot[1] - this.blocks[i].pos[1];
                if (!grid.occupied([newY, newX], this)) {
                    moves.push([newY, newX])
                }
            }
        }
        if (moves.length === 3) {
            this.blocks.forEach(block => grid.board[block.pos[0]][block.pos[1]] = null)
            for (let j = 1; j < 4; j++) {
                this.blocks[j].updatePos(moves[j-1], grid)
            }
            this.blocks[0].updatePos(pivot, grid)
        }
    }
}

class I extends Tetrimino{
    constructor(initial){
        super(initial, [[0, 0], [0, -1], [0, 1], [0, 2]], 'lightblue');
        this.pattern = [[0, 0], [0, -1], [0, 1], [0, 2]]
    }
}

class T extends Tetrimino{
    constructor(initial){
        super(initial, [[0, 0], [0, -1], [-1, 0], [0, 1]], 'purple')
        this.pattern = [[0, 0], [0, -1], [-1, 0], [0, 1]]
    }
}

class L extends Tetrimino{
    constructor(initial) {
        super(initial, [[0, 0], [0, -1], [0, 1], [-1, 1]], 'orange')
        this.pattern = [[0, 0], [0, -1], [0, 1], [-1, 1]]
    }

}

class J extends Tetrimino{
    constructor(initial) {
        super(initial, [[0, 0], [0, -1], [0, 1], [-1, -1]], 'blue')
        this.pattern = [[0, 0], [0, -1], [0, 1], [-1, -1]]
    }
}

class O extends Tetrimino{
    constructor(initial) {
        super(initial, [[0, 0], [0, 1], [-1, 0], [-1, 1]], 'yellow')
        this.pattern = [[0, 0], [0, 1], [-1, 0], [-1, 1]]
    }

    rotate(grid, dir){
        return null;
    }
}
class S extends Tetrimino{
    constructor(initial) {
        super(initial, [[0, 0], [0, -1], [-1, 0], [-1, 1]], 'green')
        this.pattern = [[0, 0], [0, -1], [-1, 0], [-1, 1]]
    }
}

class Z extends Tetrimino{
    constructor(initial) {
        super(initial, [[0, 0], [0, 1], [-1, -1], [-1, 0]], 'red')
        this.pattern = [[0, 0], [0, 1], [-1, -1], [-1, 0]]
    }
}

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blocks */ "./src/blocks.js");
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ "./src/grid.js");




class Game{
    constructor(){
        this.grid = new _grid__WEBPACK_IMPORTED_MODULE_1__["default"];
        this.currentBag = this.randomBag()
        this.current = this.currentBag.shift()
        this.next = this.currentBag.splice(0, 3)
        this.score = 0;
        this.lines = 0
        this.gravInterval
        this.gravCurve = [750, 500, 250, 150, 100, 80, 65, 50, 40]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150]
        this.level = 1
        this.gravity = this.gravCurve.shift()
        this.playing = false
        this.hold = null
    }

    updateGravity(gravity){
        this.gravInterval = setInterval(() => {
            this.drop();
        }, gravity)
    }

    drop(){
        let isOccupied = false;
        this.current.blocks.forEach(block => {
            if (this.grid.occupied([block.pos[0] + 1, block.pos[1]], this.current)){
                isOccupied = true
            }
        })
        if(isOccupied){
            this.chooseNextPiece()
        }else{
            this.grid.move(this.current, [1, 0])
        }
        return isOccupied
    }

    fastDrop(){
        while(!this.drop()){
        }
    }

    holdPiece(){
        if(!this.hasHeld){
            this.current.blocks.forEach(block => {
                this.grid.board[block.pos[0]][block.pos[1]] = null
            })
            this.hasHeld = true
            if(this.hold){
                let temp
                temp = this.hold
                this.hold = this.current
                this.current = new temp.constructor([1, 4])
                this.generatePiece()
            } else{
                this.hold = this.current
                if (this.currentBag.length === 0 && this.next[0] === undefined) {
                    this.currentBag = this.randomBag()
                    this.current = this.currentBag.shift()
                    this.next = this.currentBag.splice(0, 3)
                } else {
                    this.current = this.next.shift()
                    this.next.push(this.currentBag.shift())
                }
                this.generatePiece()
            }
        }
    }

    randomBag(){
        let newBag = [new _blocks__WEBPACK_IMPORTED_MODULE_0__["T"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["I"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["O"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["J"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["L"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["S"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__["Z"]([1, 4])]
        newBag = this.shuffle(newBag)
        return newBag
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    chooseNextPiece(){
        this.current = null
        this.lines += this.didClear()
        if(this.lines >= this.gravTable[this.level-1]){
            this.level += 1;
            this.gravity = this.gravCurve.shift();
            clearInterval(this.gravInterval)
            this.updateGravity(this.gravity)
        }
        if(this.currentBag.length === 0){
            this.currentBag = this.randomBag()
            this.current = this.next.shift()
            this.next.push(this.currentBag.shift())
        }else{
            this.current = this.next.shift()
            this.next.push(this.currentBag.shift())
        }
        this.hasHeld = false
        this.generatePiece()
    }

    start(){
        this.generatePiece(this.current)
        this.updateGravity(this.gravity)
        this.playing = true
    }

    newStart(){
        this.grid = new _grid__WEBPACK_IMPORTED_MODULE_1__["default"];
        this.currentBag = this.randomBag()
        this.current = this.currentBag.shift()
        this.next = this.currentBag.splice(0, 3)
        this.score = 0;
        this.lines = 0
        this.gravInterval
        this.gravCurve = [750, 500, 250, 150, 100, 80, 65, 50, 40]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150]
        this.level = 1
        this.gravity = this.gravCurve.shift()
        this.playing = false
        this.hold = null
    }

    gameOver(){
        clearInterval(this.gravInterval);
        this.current = null;
        this.playing = false
        this.level = 1
    }

    generatePiece(){
        let over = false
        this.current.blocks.forEach(block => {
            if(this.grid.blockOccupied(block.pos)){
                over = true
            }
        })
        if(over){
            this.grid.updatePiece(this.current)
            this.gameOver();
        }
        else{
            this.grid.updatePiece(this.current)
        }
    }

    moveActivePiece(dir){
        let isOccupied = false;
        this.current.blocks.forEach(block => {
            if (this.grid.occupied([block.pos[0] + dir[0], block.pos[1] + dir[1]], this.current)) {
                isOccupied = true
            }
        })
        if (!isOccupied) {
            this.grid.move(this.current, dir)
        }
    }

    didClear(){
        let count = 0
        this.grid.board.forEach((row, idx) => {
            if(!row.includes(null)){
                count += 1
                row.forEach(block => {
                    this.grid.board[block.pos[0]][block.pos[1]] = null
                })
                if (count > 0) {
                    for (let i = idx - 1; i >= 0; i--) {
                        this.grid.board[i].forEach(block => {
                            if (block) {
                                this.dropStep(block)
                            }
                        })
                    }
                }
            }
        })
        switch(count){
            case 1:
                this.score += 100 * this.level
                break
            case 2:
                this.score += 300 * this.level
                break
            case 3:
                this.score += 500 * this.level
                break
            case 4:
                this.score += 800 * this.level
                break
            default:
                this.score += 0
        }
        return count;
    }

    dropStep(block){
        this.grid.board[block.pos[0]][block.pos[1]] = null
        block.updatePos([block.pos[0] + 1, block.pos[1]], this.grid)
    }

    rotateActivePiece(dir){
        this.current.rotate(this.grid, dir)
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! keymaster */ "./node_modules/keymaster/keymaster.js");
/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(keymaster__WEBPACK_IMPORTED_MODULE_1__);



class GameView{
    constructor(ctx, h_ctx, n_ctx, s_ctx){
        this.ctx = ctx
        this.game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"]()
        this.drawGrid()
        this.h_ctx = h_ctx
        this.n_ctx = n_ctx
        this.s_ctx = s_ctx
        this.updateHold()
        this.updateNext()
        this.updateScore()
    }

    start(){
        this.h_ctx.fillStyle = 'black'
        this.h_ctx.fillRect(0, 0, 200, 200)
        if(!this.keymapSet){
            this.setKeyMap()
        }
        this.game.start()
    }

    setKeyMap(){
        this.keymapSet = true
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('right', () => this.game.moveActivePiece([0, 1]))
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('left', () => this.game.moveActivePiece([0, -1]))
        const speedUp = throttled((e) => {
            if (e.keyCode === 40 && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(100)
            }
        }, 250)
        const slowDown = throttled(e => {
            if (e.keyCode === 40 && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(this.game.gravity)
            }
        }, 250)
        const fastDrop = throttled(e => {
            this.game.fastDrop()
        }, 250)
        document.addEventListener('keydown', speedUp)
        document.addEventListener('keyup', slowDown)
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('x', () => this.game.rotateActivePiece(1))
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('z', () => this.game.rotateActivePiece(-1))
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('c', () => this.game.holdPiece());
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('space', fastDrop)
    }

    update(){
        this.drawGrid()
        this.game.grid.board.forEach(row => {
            row.forEach(block => {
                if(block){
                    block.drawBlock(this.ctx);
                }
            })
        })
        this.updateHold()
        this.updateNext()
        this.updateScore()
    }

    updateHold(){
        this.h_ctx.fillStyle = 'black'
        this.h_ctx.fillRect(0, 0, 200, 200)
        if(this.game.hold){
            let newHold
            if (this.game.hold.constructor.name === "O"){
                newHold = new this.game.hold.constructor([2, 1.5])
            } else if (this.game.hold.constructor.name === "I"){
                newHold = new this.game.hold.constructor([1.5, 1.5])
            } 
            else{
                newHold = new this.game.hold.constructor([2, 2])
            }
            newHold.blocks.forEach(block => {
                block.drawBlock(this.h_ctx)
            })
        }
    }

    updateNext(){
        this.n_ctx.fillStyle = 'black'
        this.n_ctx.fillRect(0, 0, 600, 600)
        let idx
        let newNext
        for(let i = 2; i < 9; i += 3){
            idx = (i - 2) / 3
            if (this.game.next[idx].constructor.name === "O" || this.game.next[idx].constructor.name === "I") {
                newNext = new this.game.next[idx].constructor([i, 1.5])
            } else {
                newNext = new this.game.next[idx].constructor([i, 2])
            }
            newNext.blocks.forEach(block => {
                block.drawBlock(this.n_ctx)
            })
        }
    }

    updateScore(){
        this.s_ctx.fillStyle = 'black'
        this.s_ctx.fillRect(0, 0, 600, 600)
        this.s_ctx.font = '24px Times New Roman'
        this.s_ctx.fillStyle = 'white'
        this.s_ctx.fillText(`score: ${this.game.score}`, 20, 60, 180)
        this.s_ctx.fillText(`lines: ${this.game.lines}`, 20, 140, 180)
        this.s_ctx.fillText(`level: ${this.game.level}`, 20, 220, 180)
    }

    drawGrid(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, 500, 800)
        for(let i = 40; i <= 400; i += 40){
            this.ctx.strokeStyle = "gray"
            this.ctx.beginPath()
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, 800);
            this.ctx.stroke();
        }

        for(let j = 40; j <= 800; j += 40){
            this.ctx.strokeStyle = "gray"
            this.ctx.beginPath()
            this.ctx.moveTo(0, j);
            this.ctx.lineTo(400, j);
            this.ctx.stroke();
        }
    }
}

function throttled(fn, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (GameView);

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Grid{
    constructor(){
        this.board = []
        for(let i = 0; i < 20; i++){
            this.board.push(new Array())
            for(let j = 0; j < 10; j++){
                this.board[i].push(null)
            }
        };
    }

    updatePiece(tetrimino){
        tetrimino.blocks.forEach(block => {
            this.board[block.pos[0]][block.pos[1]] = block
        })
    }

    move(tetrimino, dir){
        tetrimino.blocks.forEach(block => {
            this.board[block.pos[0]][block.pos[1]] = null
        })
        tetrimino.move(dir, this);
        this.updatePiece(tetrimino)
    }

    blockOccupied(pos){
        if (this.board[pos[0]] === undefined ||
            this.board[pos[0]][pos[1]] === undefined ||
            this.board[pos[0]][pos[1]] !== null){
            return true
        }
        return false
    }

    occupied(pos, tetrimino) {
        if (this.board[pos[0]] === undefined ||
            this.board[pos[0]][pos[1]] === undefined ||
            !tetrimino.blocks.includes(this.board[pos[0]][pos[1]]) && this.board[pos[0]][pos[1]] !== null) {
            return true
        }
        return false
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Grid);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_view */ "./src/game_view.js");
/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! keymaster */ "./node_modules/keymaster/keymaster.js");
/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(keymaster__WEBPACK_IMPORTED_MODULE_1__);



window.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    const start_button = document.getElementById('start-button')
    const start_modal = document.getElementById('start-modal-background')
    const restart_modal = document.getElementById('restart-modal-background')
    const restart_button = document.getElementById('restart-button')
    const hold_ctx = document.getElementById("hold-canvas").getContext("2d")
    const next_ctx = document.getElementById("next-canvas").getContext("2d")
    const score_ctx = document.getElementById('score-canvas').getContext("2d")
    let game_view = new _game_view__WEBPACK_IMPORTED_MODULE_0__["default"](ctx, hold_ctx, next_ctx, score_ctx);
    start_button.addEventListener('click', e => {
        start_modal.style.display = 'none'
        game_view.start()
        let gamePlay = setInterval(() => {
            game_view.update()
            if (!game_view.game.playing) {
                clearInterval(gamePlay)
                restart_modal.style.display = 'block'
            }
        }, 16)
    })

    restart_button.addEventListener('click', e => {
        game_view.game.newStart();
        restart_modal.style.display = 'none'
        game_view.start()
        let gamePlay = setInterval(() => {
            game_view.update()
            if (!game_view.game.playing) {
                clearInterval(gamePlay)
                restart_modal.style.display = 'block'
            }
        }, 16)
    })
})


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2tleW1hc3Rlci9rZXltYXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jsb2Nrcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBLGtCQUFrQjtBQUNsQixhQUFhLDZDQUE2QztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxtRTs7Ozs7Ozs7Ozs7O0FDNUNmO0FBQUE7QUFBQTtBQUFBO0FBQWtDO0FBQ1A7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtEQUFRO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDIiwiZmlsZSI6Ii4vbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLy8gICAgIGtleW1hc3Rlci5qc1xuLy8gICAgIChjKSAyMDExLTIwMTMgVGhvbWFzIEZ1Y2hzXG4vLyAgICAga2V5bWFzdGVyLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG47KGZ1bmN0aW9uKGdsb2JhbCl7XG4gIHZhciBrLFxuICAgIF9oYW5kbGVycyA9IHt9LFxuICAgIF9tb2RzID0geyAxNjogZmFsc2UsIDE4OiBmYWxzZSwgMTc6IGZhbHNlLCA5MTogZmFsc2UgfSxcbiAgICBfc2NvcGUgPSAnYWxsJyxcbiAgICAvLyBtb2RpZmllciBrZXlzXG4gICAgX01PRElGSUVSUyA9IHtcbiAgICAgICfih6cnOiAxNiwgc2hpZnQ6IDE2LFxuICAgICAgJ+KMpSc6IDE4LCBhbHQ6IDE4LCBvcHRpb246IDE4LFxuICAgICAgJ+KMgyc6IDE3LCBjdHJsOiAxNywgY29udHJvbDogMTcsXG4gICAgICAn4oyYJzogOTEsIGNvbW1hbmQ6IDkxXG4gICAgfSxcbiAgICAvLyBzcGVjaWFsIGtleXNcbiAgICBfTUFQID0ge1xuICAgICAgYmFja3NwYWNlOiA4LCB0YWI6IDksIGNsZWFyOiAxMixcbiAgICAgIGVudGVyOiAxMywgJ3JldHVybic6IDEzLFxuICAgICAgZXNjOiAyNywgZXNjYXBlOiAyNywgc3BhY2U6IDMyLFxuICAgICAgbGVmdDogMzcsIHVwOiAzOCxcbiAgICAgIHJpZ2h0OiAzOSwgZG93bjogNDAsXG4gICAgICBkZWw6IDQ2LCAnZGVsZXRlJzogNDYsXG4gICAgICBob21lOiAzNiwgZW5kOiAzNSxcbiAgICAgIHBhZ2V1cDogMzMsIHBhZ2Vkb3duOiAzNCxcbiAgICAgICcsJzogMTg4LCAnLic6IDE5MCwgJy8nOiAxOTEsXG4gICAgICAnYCc6IDE5MiwgJy0nOiAxODksICc9JzogMTg3LFxuICAgICAgJzsnOiAxODYsICdcXCcnOiAyMjIsXG4gICAgICAnWyc6IDIxOSwgJ10nOiAyMjEsICdcXFxcJzogMjIwXG4gICAgfSxcbiAgICBjb2RlID0gZnVuY3Rpb24oeCl7XG4gICAgICByZXR1cm4gX01BUFt4XSB8fCB4LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICB9LFxuICAgIF9kb3duS2V5cyA9IFtdO1xuXG4gIGZvcihrPTE7azwyMDtrKyspIF9NQVBbJ2YnK2tdID0gMTExK2s7XG5cbiAgLy8gSUUgZG9lc24ndCBzdXBwb3J0IEFycmF5I2luZGV4T2YsIHNvIGhhdmUgYSBzaW1wbGUgcmVwbGFjZW1lbnRcbiAgZnVuY3Rpb24gaW5kZXgoYXJyYXksIGl0ZW0pe1xuICAgIHZhciBpID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlKGktLSkgaWYoYXJyYXlbaV09PT1pdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBmb3IgY29tcGFyaW5nIG1vZHMgYmVmb3JlIHVuYXNzaWdubWVudFxuICBmdW5jdGlvbiBjb21wYXJlQXJyYXkoYTEsIGEyKSB7XG4gICAgaWYgKGExLmxlbmd0aCAhPSBhMi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGExLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhMVtpXSAhPT0gYTJbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbW9kaWZpZXJNYXAgPSB7XG4gICAgICAxNjonc2hpZnRLZXknLFxuICAgICAgMTg6J2FsdEtleScsXG4gICAgICAxNzonY3RybEtleScsXG4gICAgICA5MTonbWV0YUtleSdcbiAgfTtcbiAgZnVuY3Rpb24gdXBkYXRlTW9kaWZpZXJLZXkoZXZlbnQpIHtcbiAgICAgIGZvcihrIGluIF9tb2RzKSBfbW9kc1trXSA9IGV2ZW50W21vZGlmaWVyTWFwW2tdXTtcbiAgfTtcblxuICAvLyBoYW5kbGUga2V5ZG93biBldmVudFxuICBmdW5jdGlvbiBkaXNwYXRjaChldmVudCkge1xuICAgIHZhciBrZXksIGhhbmRsZXIsIGssIGksIG1vZGlmaWVyc01hdGNoLCBzY29wZTtcbiAgICBrZXkgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgaWYgKGluZGV4KF9kb3duS2V5cywga2V5KSA9PSAtMSkge1xuICAgICAgICBfZG93bktleXMucHVzaChrZXkpO1xuICAgIH1cblxuICAgIC8vIGlmIGEgbW9kaWZpZXIga2V5LCBzZXQgdGhlIGtleS48bW9kaWZpZXJrZXluYW1lPiBwcm9wZXJ0eSB0byB0cnVlIGFuZCByZXR1cm5cbiAgICBpZihrZXkgPT0gOTMgfHwga2V5ID09IDIyNCkga2V5ID0gOTE7IC8vIHJpZ2h0IGNvbW1hbmQgb24gd2Via2l0LCBjb21tYW5kIG9uIEdlY2tvXG4gICAgaWYoa2V5IGluIF9tb2RzKSB7XG4gICAgICBfbW9kc1trZXldID0gdHJ1ZTtcbiAgICAgIC8vICdhc3NpZ25LZXknIGZyb20gaW5zaWRlIHRoaXMgY2xvc3VyZSBpcyBleHBvcnRlZCB0byB3aW5kb3cua2V5XG4gICAgICBmb3IoayBpbiBfTU9ESUZJRVJTKSBpZihfTU9ESUZJRVJTW2tdID09IGtleSkgYXNzaWduS2V5W2tdID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgLy8gc2VlIGlmIHdlIG5lZWQgdG8gaWdub3JlIHRoZSBrZXlwcmVzcyAoZmlsdGVyKCkgY2FuIGNhbiBiZSBvdmVycmlkZGVuKVxuICAgIC8vIGJ5IGRlZmF1bHQgaWdub3JlIGtleSBwcmVzc2VzIGlmIGEgc2VsZWN0LCB0ZXh0YXJlYSwgb3IgaW5wdXQgaXMgZm9jdXNlZFxuICAgIGlmKCFhc3NpZ25LZXkuZmlsdGVyLmNhbGwodGhpcywgZXZlbnQpKSByZXR1cm47XG5cbiAgICAvLyBhYm9ydCBpZiBubyBwb3RlbnRpYWxseSBtYXRjaGluZyBzaG9ydGN1dHMgZm91bmRcbiAgICBpZiAoIShrZXkgaW4gX2hhbmRsZXJzKSkgcmV0dXJuO1xuXG4gICAgc2NvcGUgPSBnZXRTY29wZSgpO1xuXG4gICAgLy8gZm9yIGVhY2ggcG90ZW50aWFsIHNob3J0Y3V0XG4gICAgZm9yIChpID0gMDsgaSA8IF9oYW5kbGVyc1trZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICBoYW5kbGVyID0gX2hhbmRsZXJzW2tleV1baV07XG5cbiAgICAgIC8vIHNlZSBpZiBpdCdzIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICBpZihoYW5kbGVyLnNjb3BlID09IHNjb3BlIHx8IGhhbmRsZXIuc2NvcGUgPT0gJ2FsbCcpe1xuICAgICAgICAvLyBjaGVjayBpZiBtb2RpZmllcnMgbWF0Y2ggaWYgYW55XG4gICAgICAgIG1vZGlmaWVyc01hdGNoID0gaGFuZGxlci5tb2RzLmxlbmd0aCA+IDA7XG4gICAgICAgIGZvcihrIGluIF9tb2RzKVxuICAgICAgICAgIGlmKCghX21vZHNba10gJiYgaW5kZXgoaGFuZGxlci5tb2RzLCAraykgPiAtMSkgfHxcbiAgICAgICAgICAgIChfbW9kc1trXSAmJiBpbmRleChoYW5kbGVyLm1vZHMsICtrKSA9PSAtMSkpIG1vZGlmaWVyc01hdGNoID0gZmFsc2U7XG4gICAgICAgIC8vIGNhbGwgdGhlIGhhbmRsZXIgYW5kIHN0b3AgdGhlIGV2ZW50IGlmIG5lY2Nlc3NhcnlcbiAgICAgICAgaWYoKGhhbmRsZXIubW9kcy5sZW5ndGggPT0gMCAmJiAhX21vZHNbMTZdICYmICFfbW9kc1sxOF0gJiYgIV9tb2RzWzE3XSAmJiAhX21vZHNbOTFdKSB8fCBtb2RpZmllcnNNYXRjaCl7XG4gICAgICAgICAgaWYoaGFuZGxlci5tZXRob2QoZXZlbnQsIGhhbmRsZXIpPT09ZmFsc2Upe1xuICAgICAgICAgICAgaWYoZXZlbnQucHJldmVudERlZmF1bHQpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGVsc2UgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZihldmVudC5jYW5jZWxCdWJibGUpIGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIHVuc2V0IG1vZGlmaWVyIGtleXMgb24ga2V5dXBcbiAgZnVuY3Rpb24gY2xlYXJNb2RpZmllcihldmVudCl7XG4gICAgdmFyIGtleSA9IGV2ZW50LmtleUNvZGUsIGssXG4gICAgICAgIGkgPSBpbmRleChfZG93bktleXMsIGtleSk7XG5cbiAgICAvLyByZW1vdmUga2V5IGZyb20gX2Rvd25LZXlzXG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgICBfZG93bktleXMuc3BsaWNlKGksIDEpO1xuICAgIH1cblxuICAgIGlmKGtleSA9PSA5MyB8fCBrZXkgPT0gMjI0KSBrZXkgPSA5MTtcbiAgICBpZihrZXkgaW4gX21vZHMpIHtcbiAgICAgIF9tb2RzW2tleV0gPSBmYWxzZTtcbiAgICAgIGZvcihrIGluIF9NT0RJRklFUlMpIGlmKF9NT0RJRklFUlNba10gPT0ga2V5KSBhc3NpZ25LZXlba10gPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVzZXRNb2RpZmllcnMoKSB7XG4gICAgZm9yKGsgaW4gX21vZHMpIF9tb2RzW2tdID0gZmFsc2U7XG4gICAgZm9yKGsgaW4gX01PRElGSUVSUykgYXNzaWduS2V5W2tdID0gZmFsc2U7XG4gIH07XG5cbiAgLy8gcGFyc2UgYW5kIGFzc2lnbiBzaG9ydGN1dFxuICBmdW5jdGlvbiBhc3NpZ25LZXkoa2V5LCBzY29wZSwgbWV0aG9kKXtcbiAgICB2YXIga2V5cywgbW9kcztcbiAgICBrZXlzID0gZ2V0S2V5cyhrZXkpO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWV0aG9kID0gc2NvcGU7XG4gICAgICBzY29wZSA9ICdhbGwnO1xuICAgIH1cblxuICAgIC8vIGZvciBlYWNoIHNob3J0Y3V0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBzZXQgbW9kaWZpZXIga2V5cyBpZiBhbnlcbiAgICAgIG1vZHMgPSBbXTtcbiAgICAgIGtleSA9IGtleXNbaV0uc3BsaXQoJysnKTtcbiAgICAgIGlmIChrZXkubGVuZ3RoID4gMSl7XG4gICAgICAgIG1vZHMgPSBnZXRNb2RzKGtleSk7XG4gICAgICAgIGtleSA9IFtrZXlba2V5Lmxlbmd0aC0xXV07XG4gICAgICB9XG4gICAgICAvLyBjb252ZXJ0IHRvIGtleWNvZGUgYW5kLi4uXG4gICAgICBrZXkgPSBrZXlbMF1cbiAgICAgIGtleSA9IGNvZGUoa2V5KTtcbiAgICAgIC8vIC4uLnN0b3JlIGhhbmRsZXJcbiAgICAgIGlmICghKGtleSBpbiBfaGFuZGxlcnMpKSBfaGFuZGxlcnNba2V5XSA9IFtdO1xuICAgICAgX2hhbmRsZXJzW2tleV0ucHVzaCh7IHNob3J0Y3V0OiBrZXlzW2ldLCBzY29wZTogc2NvcGUsIG1ldGhvZDogbWV0aG9kLCBrZXk6IGtleXNbaV0sIG1vZHM6IG1vZHMgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIHVuYmluZCBhbGwgaGFuZGxlcnMgZm9yIGdpdmVuIGtleSBpbiBjdXJyZW50IHNjb3BlXG4gIGZ1bmN0aW9uIHVuYmluZEtleShrZXksIHNjb3BlKSB7XG4gICAgdmFyIG11bHRpcGxlS2V5cywga2V5cyxcbiAgICAgIG1vZHMgPSBbXSxcbiAgICAgIGksIGosIG9iajtcblxuICAgIG11bHRpcGxlS2V5cyA9IGdldEtleXMoa2V5KTtcblxuICAgIGZvciAoaiA9IDA7IGogPCBtdWx0aXBsZUtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGtleXMgPSBtdWx0aXBsZUtleXNbal0uc3BsaXQoJysnKTtcblxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICBtb2RzID0gZ2V0TW9kcyhrZXlzKTtcbiAgICAgICAga2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBjb2RlKGtleSk7XG5cbiAgICAgIGlmIChzY29wZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNjb3BlID0gZ2V0U2NvcGUoKTtcbiAgICAgIH1cbiAgICAgIGlmICghX2hhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IF9oYW5kbGVyc1trZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9iaiA9IF9oYW5kbGVyc1trZXldW2ldO1xuICAgICAgICAvLyBvbmx5IGNsZWFyIGhhbmRsZXJzIGlmIGNvcnJlY3Qgc2NvcGUgYW5kIG1vZHMgbWF0Y2hcbiAgICAgICAgaWYgKG9iai5zY29wZSA9PT0gc2NvcGUgJiYgY29tcGFyZUFycmF5KG9iai5tb2RzLCBtb2RzKSkge1xuICAgICAgICAgIF9oYW5kbGVyc1trZXldW2ldID0ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBrZXkgd2l0aCBjb2RlICdrZXlDb2RlJyBpcyBjdXJyZW50bHkgZG93blxuICAvLyBDb252ZXJ0cyBzdHJpbmdzIGludG8ga2V5IGNvZGVzLlxuICBmdW5jdGlvbiBpc1ByZXNzZWQoa2V5Q29kZSkge1xuICAgICAgaWYgKHR5cGVvZihrZXlDb2RlKT09J3N0cmluZycpIHtcbiAgICAgICAga2V5Q29kZSA9IGNvZGUoa2V5Q29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXgoX2Rvd25LZXlzLCBrZXlDb2RlKSAhPSAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByZXNzZWRLZXlDb2RlcygpIHtcbiAgICAgIHJldHVybiBfZG93bktleXMuc2xpY2UoMCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaWx0ZXIoZXZlbnQpe1xuICAgIHZhciB0YWdOYW1lID0gKGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50KS50YWdOYW1lO1xuICAgIC8vIGlnbm9yZSBrZXlwcmVzc2VkIGluIGFueSBlbGVtZW50cyB0aGF0IHN1cHBvcnQga2V5Ym9hcmQgZGF0YSBpbnB1dFxuICAgIHJldHVybiAhKHRhZ05hbWUgPT0gJ0lOUFVUJyB8fCB0YWdOYW1lID09ICdTRUxFQ1QnIHx8IHRhZ05hbWUgPT0gJ1RFWFRBUkVBJyk7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIGtleS48bW9kaWZpZXI+IHRvIGZhbHNlXG4gIGZvcihrIGluIF9NT0RJRklFUlMpIGFzc2lnbktleVtrXSA9IGZhbHNlO1xuXG4gIC8vIHNldCBjdXJyZW50IHNjb3BlIChkZWZhdWx0ICdhbGwnKVxuICBmdW5jdGlvbiBzZXRTY29wZShzY29wZSl7IF9zY29wZSA9IHNjb3BlIHx8ICdhbGwnIH07XG4gIGZ1bmN0aW9uIGdldFNjb3BlKCl7IHJldHVybiBfc2NvcGUgfHwgJ2FsbCcgfTtcblxuICAvLyBkZWxldGUgYWxsIGhhbmRsZXJzIGZvciBhIGdpdmVuIHNjb3BlXG4gIGZ1bmN0aW9uIGRlbGV0ZVNjb3BlKHNjb3BlKXtcbiAgICB2YXIga2V5LCBoYW5kbGVycywgaTtcblxuICAgIGZvciAoa2V5IGluIF9oYW5kbGVycykge1xuICAgICAgaGFuZGxlcnMgPSBfaGFuZGxlcnNba2V5XTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7ICkge1xuICAgICAgICBpZiAoaGFuZGxlcnNbaV0uc2NvcGUgPT09IHNjb3BlKSBoYW5kbGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGVsc2UgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBhYnN0cmFjdCBrZXkgbG9naWMgZm9yIGFzc2lnbiBhbmQgdW5hc3NpZ25cbiAgZnVuY3Rpb24gZ2V0S2V5cyhrZXkpIHtcbiAgICB2YXIga2V5cztcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICBrZXlzID0ga2V5LnNwbGl0KCcsJyk7XG4gICAgaWYgKChrZXlzW2tleXMubGVuZ3RoIC0gMV0pID09ICcnKSB7XG4gICAgICBrZXlzW2tleXMubGVuZ3RoIC0gMl0gKz0gJywnO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIC8vIGFic3RyYWN0IG1vZHMgbG9naWMgZm9yIGFzc2lnbiBhbmQgdW5hc3NpZ25cbiAgZnVuY3Rpb24gZ2V0TW9kcyhrZXkpIHtcbiAgICB2YXIgbW9kcyA9IGtleS5zbGljZSgwLCBrZXkubGVuZ3RoIC0gMSk7XG4gICAgZm9yICh2YXIgbWkgPSAwOyBtaSA8IG1vZHMubGVuZ3RoOyBtaSsrKVxuICAgIG1vZHNbbWldID0gX01PRElGSUVSU1ttb2RzW21pXV07XG4gICAgcmV0dXJuIG1vZHM7XG4gIH1cblxuICAvLyBjcm9zcy1icm93c2VyIGV2ZW50c1xuICBmdW5jdGlvbiBhZGRFdmVudChvYmplY3QsIGV2ZW50LCBtZXRob2QpIHtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbWV0aG9kLCBmYWxzZSk7XG4gICAgZWxzZSBpZihvYmplY3QuYXR0YWNoRXZlbnQpXG4gICAgICBvYmplY3QuYXR0YWNoRXZlbnQoJ29uJytldmVudCwgZnVuY3Rpb24oKXsgbWV0aG9kKHdpbmRvdy5ldmVudCkgfSk7XG4gIH07XG5cbiAgLy8gc2V0IHRoZSBoYW5kbGVycyBnbG9iYWxseSBvbiBkb2N1bWVudFxuICBhZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkgeyBkaXNwYXRjaChldmVudCkgfSk7IC8vIFBhc3NpbmcgX3Njb3BlIHRvIGEgY2FsbGJhY2sgdG8gZW5zdXJlIGl0IHJlbWFpbnMgdGhlIHNhbWUgYnkgZXhlY3V0aW9uLiBGaXhlcyAjNDhcbiAgYWRkRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcsIGNsZWFyTW9kaWZpZXIpO1xuXG4gIC8vIHJlc2V0IG1vZGlmaWVycyB0byBmYWxzZSB3aGVuZXZlciB0aGUgd2luZG93IGlzIChyZSlmb2N1c2VkLlxuICBhZGRFdmVudCh3aW5kb3csICdmb2N1cycsIHJlc2V0TW9kaWZpZXJzKTtcblxuICAvLyBzdG9yZSBwcmV2aW91c2x5IGRlZmluZWQga2V5XG4gIHZhciBwcmV2aW91c0tleSA9IGdsb2JhbC5rZXk7XG5cbiAgLy8gcmVzdG9yZSBwcmV2aW91c2x5IGRlZmluZWQga2V5IGFuZCByZXR1cm4gcmVmZXJlbmNlIHRvIG91ciBrZXkgb2JqZWN0XG4gIGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgdmFyIGsgPSBnbG9iYWwua2V5O1xuICAgIGdsb2JhbC5rZXkgPSBwcmV2aW91c0tleTtcbiAgICByZXR1cm4gaztcbiAgfVxuXG4gIC8vIHNldCB3aW5kb3cua2V5IGFuZCB3aW5kb3cua2V5LnNldC9nZXQvZGVsZXRlU2NvcGUsIGFuZCB0aGUgZGVmYXVsdCBmaWx0ZXJcbiAgZ2xvYmFsLmtleSA9IGFzc2lnbktleTtcbiAgZ2xvYmFsLmtleS5zZXRTY29wZSA9IHNldFNjb3BlO1xuICBnbG9iYWwua2V5LmdldFNjb3BlID0gZ2V0U2NvcGU7XG4gIGdsb2JhbC5rZXkuZGVsZXRlU2NvcGUgPSBkZWxldGVTY29wZTtcbiAgZ2xvYmFsLmtleS5maWx0ZXIgPSBmaWx0ZXI7XG4gIGdsb2JhbC5rZXkuaXNQcmVzc2VkID0gaXNQcmVzc2VkO1xuICBnbG9iYWwua2V5LmdldFByZXNzZWRLZXlDb2RlcyA9IGdldFByZXNzZWRLZXlDb2RlcztcbiAgZ2xvYmFsLmtleS5ub0NvbmZsaWN0ID0gbm9Db25mbGljdDtcbiAgZ2xvYmFsLmtleS51bmJpbmQgPSB1bmJpbmRLZXk7XG5cbiAgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gYXNzaWduS2V5O1xuXG59KSh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBCbG9ja3tcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5wb3MgPSBvcHRpb25zLnBvcztcbiAgICAgICAgdGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3JcbiAgICB9XG5cbiAgICB1cGRhdGVQb3MobW92ZSwgZ3JpZCl7XG4gICAgICAgIHRoaXMucG9zID0gW21vdmVbMF0sIG1vdmVbMV1dXG4gICAgICAgIGdyaWQuYm9hcmRbdGhpcy5wb3NbMF1dW3RoaXMucG9zWzFdXSA9IHRoaXNcbiAgICB9XG5cbiAgICBkcmF3QmxvY2soY3R4KSB7XG4gICAgICAgIGxldCBuZXdQb3MgPSBbdGhpcy5wb3NbMF0gKiA0MCwgdGhpcy5wb3NbMV0gKiA0MF07XG4gICAgICAgIGxldCBncmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KG5ld1Bvc1sxXSwgbmV3UG9zWzBdLCBuZXdQb3NbMV0gKyA0MCwgbmV3UG9zWzBdICsgNDApO1xuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCB0aGlzLmNvbG9yKTtcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMC4zNSwgdGhpcy5jb2xvcik7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XG4gICAgICAgIGN0eC5maWxsUmVjdChuZXdQb3NbMV0sIG5ld1Bvc1swXSwgNDAsIDQwKVxuICAgIH1cblxuICAgIGVyYXNlQmxvY2soY3R4KXtcbiAgICAgICAgbGV0IG5ld1BvcyA9IFt0aGlzLnBvc1swXSAqIDQwLCB0aGlzLnBvc1sxXSAqIDQwXTtcbiAgICAgICAgY3R4LmNsZWFyUmVjdChuZXdQb3NbMV0sIG5ld1Bvc1swXSwgNDAsIDQwKVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsLCBwYXR0ZXJuLCBjb2xvcil7XG4gICAgICAgIHRoaXMuYmxvY2tzID0gW107XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSAndXAnXG4gICAgICAgIHBhdHRlcm4uZm9yRWFjaChwb3MgPT4ge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3MucHVzaChuZXcgQmxvY2soe3BvczogW2luaXRpYWxbMF0gKyBwb3NbMF0sIGluaXRpYWxbMV0gKyBwb3NbMV1dLCBjb2xvcjogY29sb3J9KSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlKGRpciwgZ3JpZCl7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuXG4gICAgICAgICAgICBibG9jay51cGRhdGVQb3MoW2Jsb2NrLnBvc1swXSArIGRpclswXSwgYmxvY2sucG9zWzFdICsgZGlyWzFdXSwgZ3JpZClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBkcmF3KGN0eCl7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgYmxvY2suZHJhd0Jsb2NrKGN0eCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcm90YXRlKGdyaWQsIGRpcikge1xuICAgICAgICBsZXQgbW92ZXMgPSBbXVxuICAgICAgICBsZXQgcGl2b3QgPSB0aGlzLmJsb2Nrc1swXS5wb3NcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WCA9IHBpdm90WzFdICsgcGl2b3RbMF0gLSB0aGlzLmJsb2Nrc1tpXS5wb3NbMF07XG4gICAgICAgICAgICAgICAgbGV0IG5ld1kgPSBwaXZvdFswXSAtIHBpdm90WzFdICsgdGhpcy5ibG9ja3NbaV0ucG9zWzFdO1xuICAgICAgICAgICAgICAgIGlmICghZ3JpZC5vY2N1cGllZChbbmV3WSwgbmV3WF0sIHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVzLnB1c2goW25ld1ksIG5ld1hdKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WCA9IHBpdm90WzFdIC0gcGl2b3RbMF0gKyB0aGlzLmJsb2Nrc1tpXS5wb3NbMF07XG4gICAgICAgICAgICAgICAgbGV0IG5ld1kgPSBwaXZvdFswXSArIHBpdm90WzFdIC0gdGhpcy5ibG9ja3NbaV0ucG9zWzFdO1xuICAgICAgICAgICAgICAgIGlmICghZ3JpZC5vY2N1cGllZChbbmV3WSwgbmV3WF0sIHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVzLnB1c2goW25ld1ksIG5ld1hdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW92ZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IGdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbClcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3Nbal0udXBkYXRlUG9zKG1vdmVzW2otMV0sIGdyaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJsb2Nrc1swXS51cGRhdGVQb3MocGl2b3QsIGdyaWQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpe1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFswLCAyXV0sICdsaWdodGJsdWUnKTtcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbMCwgMl1dXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVCBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKXtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWy0xLCAwXSwgWzAsIDFdXSwgJ3B1cnBsZScpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFswLCAxXV1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbLTEsIDFdXSwgJ29yYW5nZScpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWy0xLCAxXV1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEogZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgLTFdXSwgJ2JsdWUnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgLTFdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE8gZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgMV0sIFstMSwgMF0sIFstMSwgMV1dLCAneWVsbG93JylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIDFdLCBbLTEsIDBdLCBbLTEsIDFdXVxuICAgIH1cblxuICAgIHJvdGF0ZShncmlkLCBkaXIpe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgUyBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFstMSwgMV1dLCAnZ3JlZW4nKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbLTEsIDBdLCBbLTEsIDFdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFogZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgMV0sIFstMSwgLTFdLCBbLTEsIDBdXSwgJ3JlZCcpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAxXSwgWy0xLCAtMV0sIFstMSwgMF1dXG4gICAgfVxufSIsImltcG9ydCB7SSwgUywgTywgWiwgSiwgTCwgVH0gZnJvbSAnLi9ibG9ja3MnXG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnXG5cblxuY2xhc3MgR2FtZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmdyaWQgPSBuZXcgR3JpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50QmFnID0gdGhpcy5yYW5kb21CYWcoKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKVxuICAgICAgICB0aGlzLm5leHQgPSB0aGlzLmN1cnJlbnRCYWcuc3BsaWNlKDAsIDMpXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmxpbmVzID0gMFxuICAgICAgICB0aGlzLmdyYXZJbnRlcnZhbFxuICAgICAgICB0aGlzLmdyYXZDdXJ2ZSA9IFs3NTAsIDUwMCwgMjUwLCAxNTAsIDEwMCwgODAsIDY1LCA1MCwgNDBdXG4gICAgICAgIHRoaXMuZ3JhdlRhYmxlID0gWzE1LCAzMCwgNDUsIDYwLCA3NSwgMTAwLCAxMjUsIDE1MF1cbiAgICAgICAgdGhpcy5sZXZlbCA9IDFcbiAgICAgICAgdGhpcy5ncmF2aXR5ID0gdGhpcy5ncmF2Q3VydmUuc2hpZnQoKVxuICAgICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmhvbGQgPSBudWxsXG4gICAgfVxuXG4gICAgdXBkYXRlR3Jhdml0eShncmF2aXR5KXtcbiAgICAgICAgdGhpcy5ncmF2SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRyb3AoKTtcbiAgICAgICAgfSwgZ3Jhdml0eSlcbiAgICB9XG5cbiAgICBkcm9wKCl7XG4gICAgICAgIGxldCBpc09jY3VwaWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkLm9jY3VwaWVkKFtibG9jay5wb3NbMF0gKyAxLCBibG9jay5wb3NbMV1dLCB0aGlzLmN1cnJlbnQpKXtcbiAgICAgICAgICAgICAgICBpc09jY3VwaWVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZihpc09jY3VwaWVkKXtcbiAgICAgICAgICAgIHRoaXMuY2hvb3NlTmV4dFBpZWNlKClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmdyaWQubW92ZSh0aGlzLmN1cnJlbnQsIFsxLCAwXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNPY2N1cGllZFxuICAgIH1cblxuICAgIGZhc3REcm9wKCl7XG4gICAgICAgIHdoaWxlKCF0aGlzLmRyb3AoKSl7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBob2xkUGllY2UoKXtcbiAgICAgICAgaWYoIXRoaXMuaGFzSGVsZCl7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5oYXNIZWxkID0gdHJ1ZVxuICAgICAgICAgICAgaWYodGhpcy5ob2xkKXtcbiAgICAgICAgICAgICAgICBsZXQgdGVtcFxuICAgICAgICAgICAgICAgIHRlbXAgPSB0aGlzLmhvbGRcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLmN1cnJlbnRcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBuZXcgdGVtcC5jb25zdHJ1Y3RvcihbMSwgNF0pXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVBpZWNlKClcbiAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGQgPSB0aGlzLmN1cnJlbnRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QmFnLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm5leHRbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCYWcgPSB0aGlzLnJhbmRvbUJhZygpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudEJhZy5zaGlmdCgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCA9IHRoaXMuY3VycmVudEJhZy5zcGxpY2UoMCwgMylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm5leHQuc2hpZnQoKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQucHVzaCh0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZVBpZWNlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRvbUJhZygpe1xuICAgICAgICBsZXQgbmV3QmFnID0gW25ldyBUKFsxLCA0XSksIG5ldyBJKFsxLCA0XSksIG5ldyBPKFsxLCA0XSksIG5ldyBKKFsxLCA0XSksIG5ldyBMKFsxLCA0XSksIG5ldyBTKFsxLCA0XSksIG5ldyBaKFsxLCA0XSldXG4gICAgICAgIG5ld0JhZyA9IHRoaXMuc2h1ZmZsZShuZXdCYWcpXG4gICAgICAgIHJldHVybiBuZXdCYWdcbiAgICB9XG5cbiAgICBzaHVmZmxlKGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGEubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW2FbaV0sIGFbal1dID0gW2Fbal0sIGFbaV1dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGNob29zZU5leHRQaWVjZSgpe1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gICAgICAgIHRoaXMubGluZXMgKz0gdGhpcy5kaWRDbGVhcigpXG4gICAgICAgIGlmKHRoaXMubGluZXMgPj0gdGhpcy5ncmF2VGFibGVbdGhpcy5sZXZlbC0xXSl7XG4gICAgICAgICAgICB0aGlzLmxldmVsICs9IDE7XG4gICAgICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLmdyYXZDdXJ2ZS5zaGlmdCgpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdyYXZJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR3Jhdml0eSh0aGlzLmdyYXZpdHkpXG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5jdXJyZW50QmFnLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCYWcgPSB0aGlzLnJhbmRvbUJhZygpXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm5leHQuc2hpZnQoKVxuICAgICAgICAgICAgdGhpcy5uZXh0LnB1c2godGhpcy5jdXJyZW50QmFnLnNoaWZ0KCkpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5uZXh0LnNoaWZ0KClcbiAgICAgICAgICAgIHRoaXMubmV4dC5wdXNoKHRoaXMuY3VycmVudEJhZy5zaGlmdCgpKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGFzSGVsZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQaWVjZSgpXG4gICAgfVxuXG4gICAgc3RhcnQoKXtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBpZWNlKHRoaXMuY3VycmVudClcbiAgICAgICAgdGhpcy51cGRhdGVHcmF2aXR5KHRoaXMuZ3Jhdml0eSlcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gdHJ1ZVxuICAgIH1cblxuICAgIG5ld1N0YXJ0KCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG5ldyBHcmlkO1xuICAgICAgICB0aGlzLmN1cnJlbnRCYWcgPSB0aGlzLnJhbmRvbUJhZygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudEJhZy5zaGlmdCgpXG4gICAgICAgIHRoaXMubmV4dCA9IHRoaXMuY3VycmVudEJhZy5zcGxpY2UoMCwgMylcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMubGluZXMgPSAwXG4gICAgICAgIHRoaXMuZ3JhdkludGVydmFsXG4gICAgICAgIHRoaXMuZ3JhdkN1cnZlID0gWzc1MCwgNTAwLCAyNTAsIDE1MCwgMTAwLCA4MCwgNjUsIDUwLCA0MF1cbiAgICAgICAgdGhpcy5ncmF2VGFibGUgPSBbMTUsIDMwLCA0NSwgNjAsIDc1LCAxMDAsIDEyNSwgMTUwXVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLmdyYXZDdXJ2ZS5zaGlmdCgpXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGxcbiAgICB9XG5cbiAgICBnYW1lT3Zlcigpe1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ3JhdkludGVydmFsKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5sZXZlbCA9IDFcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVBpZWNlKCl7XG4gICAgICAgIGxldCBvdmVyID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JpZC5ibG9ja09jY3VwaWVkKGJsb2NrLnBvcykpe1xuICAgICAgICAgICAgICAgIG92ZXIgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKG92ZXIpe1xuICAgICAgICAgICAgdGhpcy5ncmlkLnVwZGF0ZVBpZWNlKHRoaXMuY3VycmVudClcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdGhpcy5ncmlkLnVwZGF0ZVBpZWNlKHRoaXMuY3VycmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVBY3RpdmVQaWVjZShkaXIpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5vY2N1cGllZChbYmxvY2sucG9zWzBdICsgZGlyWzBdLCBibG9jay5wb3NbMV0gKyBkaXJbMV1dLCB0aGlzLmN1cnJlbnQpKSB7XG4gICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYgKCFpc09jY3VwaWVkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQubW92ZSh0aGlzLmN1cnJlbnQsIGRpcilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZENsZWFyKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgdGhpcy5ncmlkLmJvYXJkLmZvckVhY2goKHJvdywgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZighcm93LmluY2x1ZGVzKG51bGwpKXtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxXG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gaWR4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtpXS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wU3RlcChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBzd2l0Y2goY291bnQpe1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMTAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAzMDAgKiB0aGlzLmxldmVsXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDUwMCAqIHRoaXMubGV2ZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gODAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBkcm9wU3RlcChibG9jayl7XG4gICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsXG4gICAgICAgIGJsb2NrLnVwZGF0ZVBvcyhbYmxvY2sucG9zWzBdICsgMSwgYmxvY2sucG9zWzFdXSwgdGhpcy5ncmlkKVxuICAgIH1cblxuICAgIHJvdGF0ZUFjdGl2ZVBpZWNlKGRpcil7XG4gICAgICAgIHRoaXMuY3VycmVudC5yb3RhdGUodGhpcy5ncmlkLCBkaXIpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xuaW1wb3J0IGtleSBmcm9tICdrZXltYXN0ZXInXG5cbmNsYXNzIEdhbWVWaWV3e1xuICAgIGNvbnN0cnVjdG9yKGN0eCwgaF9jdHgsIG5fY3R4LCBzX2N0eCl7XG4gICAgICAgIHRoaXMuY3R4ID0gY3R4XG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lKClcbiAgICAgICAgdGhpcy5kcmF3R3JpZCgpXG4gICAgICAgIHRoaXMuaF9jdHggPSBoX2N0eFxuICAgICAgICB0aGlzLm5fY3R4ID0gbl9jdHhcbiAgICAgICAgdGhpcy5zX2N0eCA9IHNfY3R4XG4gICAgICAgIHRoaXMudXBkYXRlSG9sZCgpXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dCgpXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKVxuICAgIH1cblxuICAgIHN0YXJ0KCl7XG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxSZWN0KDAsIDAsIDIwMCwgMjAwKVxuICAgICAgICBpZighdGhpcy5rZXltYXBTZXQpe1xuICAgICAgICAgICAgdGhpcy5zZXRLZXlNYXAoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5zdGFydCgpXG4gICAgfVxuXG4gICAgc2V0S2V5TWFwKCl7XG4gICAgICAgIHRoaXMua2V5bWFwU2V0ID0gdHJ1ZVxuICAgICAgICBrZXkoJ3JpZ2h0JywgKCkgPT4gdGhpcy5nYW1lLm1vdmVBY3RpdmVQaWVjZShbMCwgMV0pKVxuICAgICAgICBrZXkoJ2xlZnQnLCAoKSA9PiB0aGlzLmdhbWUubW92ZUFjdGl2ZVBpZWNlKFswLCAtMV0pKVxuICAgICAgICBjb25zdCBzcGVlZFVwID0gdGhyb3R0bGVkKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0MCAmJiB0aGlzLmdhbWUuZ3Jhdml0eSA+IDEwMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lLmdyYXZJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnVwZGF0ZUdyYXZpdHkoMTAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyNTApXG4gICAgICAgIGNvbnN0IHNsb3dEb3duID0gdGhyb3R0bGVkKGUgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDAgJiYgdGhpcy5nYW1lLmdyYXZpdHkgPiAxMDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZS5ncmF2SW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS51cGRhdGVHcmF2aXR5KHRoaXMuZ2FtZS5ncmF2aXR5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyNTApXG4gICAgICAgIGNvbnN0IGZhc3REcm9wID0gdGhyb3R0bGVkKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmZhc3REcm9wKClcbiAgICAgICAgfSwgMjUwKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc3BlZWRVcClcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBzbG93RG93bilcbiAgICAgICAga2V5KCd4JywgKCkgPT4gdGhpcy5nYW1lLnJvdGF0ZUFjdGl2ZVBpZWNlKDEpKVxuICAgICAgICBrZXkoJ3onLCAoKSA9PiB0aGlzLmdhbWUucm90YXRlQWN0aXZlUGllY2UoLTEpKVxuICAgICAgICBrZXkoJ2MnLCAoKSA9PiB0aGlzLmdhbWUuaG9sZFBpZWNlKCkpO1xuICAgICAgICBrZXkoJ3NwYWNlJywgZmFzdERyb3ApXG4gICAgfVxuXG4gICAgdXBkYXRlKCl7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoKVxuICAgICAgICB0aGlzLmdhbWUuZ3JpZC5ib2FyZC5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgaWYoYmxvY2spe1xuICAgICAgICAgICAgICAgICAgICBibG9jay5kcmF3QmxvY2sodGhpcy5jdHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudXBkYXRlSG9sZCgpXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dCgpXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKVxuICAgIH1cblxuICAgIHVwZGF0ZUhvbGQoKXtcbiAgICAgICAgdGhpcy5oX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFJlY3QoMCwgMCwgMjAwLCAyMDApXG4gICAgICAgIGlmKHRoaXMuZ2FtZS5ob2xkKXtcbiAgICAgICAgICAgIGxldCBuZXdIb2xkXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJPXCIpe1xuICAgICAgICAgICAgICAgIG5ld0hvbGQgPSBuZXcgdGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IoWzIsIDEuNV0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiSVwiKXtcbiAgICAgICAgICAgICAgICBuZXdIb2xkID0gbmV3IHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yKFsxLjUsIDEuNV0pXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBuZXdIb2xkID0gbmV3IHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yKFsyLCAyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0hvbGQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayh0aGlzLmhfY3R4KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU5leHQoKXtcbiAgICAgICAgdGhpcy5uX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMubl9jdHguZmlsbFJlY3QoMCwgMCwgNjAwLCA2MDApXG4gICAgICAgIGxldCBpZHhcbiAgICAgICAgbGV0IG5ld05leHRcbiAgICAgICAgZm9yKGxldCBpID0gMjsgaSA8IDk7IGkgKz0gMyl7XG4gICAgICAgICAgICBpZHggPSAoaSAtIDIpIC8gM1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5uZXh0W2lkeF0uY29uc3RydWN0b3IubmFtZSA9PT0gXCJPXCIgfHwgdGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIklcIikge1xuICAgICAgICAgICAgICAgIG5ld05leHQgPSBuZXcgdGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3RvcihbaSwgMS41XSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3TmV4dCA9IG5ldyB0aGlzLmdhbWUubmV4dFtpZHhdLmNvbnN0cnVjdG9yKFtpLCAyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld05leHQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayh0aGlzLm5fY3R4KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNjb3JlKCl7XG4gICAgICAgIHRoaXMuc19jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxSZWN0KDAsIDAsIDYwMCwgNjAwKVxuICAgICAgICB0aGlzLnNfY3R4LmZvbnQgPSAnMjRweCBUaW1lcyBOZXcgUm9tYW4nXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBzY29yZTogJHt0aGlzLmdhbWUuc2NvcmV9YCwgMjAsIDYwLCAxODApXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFRleHQoYGxpbmVzOiAke3RoaXMuZ2FtZS5saW5lc31gLCAyMCwgMTQwLCAxODApXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFRleHQoYGxldmVsOiAke3RoaXMuZ2FtZS5sZXZlbH1gLCAyMCwgMjIwLCAxODApXG4gICAgfVxuXG4gICAgZHJhd0dyaWQoKXtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDUwMCwgODAwKVxuICAgICAgICBmb3IobGV0IGkgPSA0MDsgaSA8PSA0MDA7IGkgKz0gNDApe1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIlxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhpLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpLCA4MDApO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGogPSA0MDsgaiA8PSA4MDA7IGogKz0gNDApe1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIlxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBqKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyg0MDAsIGopO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlZChmbiwgZGVsYXkpIHtcbiAgICBsZXQgbGFzdENhbGwgPSAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjb25zdCBub3cgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKG5vdyAtIGxhc3RDYWxsIDwgZGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbCA9IG5vdztcbiAgICAgICAgcmV0dXJuIGZuKC4uLmFyZ3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZVZpZXciLCJjbGFzcyBHcmlke1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBbXVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgMjA7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnB1c2gobmV3IEFycmF5KCkpXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpXS5wdXNoKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdXBkYXRlUGllY2UodGV0cmltaW5vKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gYmxvY2tcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlKHRldHJpbWlubywgZGlyKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICB9KVxuICAgICAgICB0ZXRyaW1pbm8ubW92ZShkaXIsIHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBpZWNlKHRldHJpbWlubylcbiAgICB9XG5cbiAgICBibG9ja09jY3VwaWVkKHBvcyl7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc1swXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gIT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvY2N1cGllZChwb3MsIHRldHJpbWlubykge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFtwb3NbMF1dID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbcG9zWzBdXVtwb3NbMV1dID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICF0ZXRyaW1pbm8uYmxvY2tzLmluY2x1ZGVzKHRoaXMuYm9hcmRbcG9zWzBdXVtwb3NbMV1dKSAmJiB0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWQiLCJpbXBvcnQgR2FtZVZpZXcgZnJvbSAnLi9nYW1lX3ZpZXcnXG5pbXBvcnQga2V5IGZyb20gJ2tleW1hc3Rlcidcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtY2FudmFzXCIpO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY29uc3Qgc3RhcnRfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LWJ1dHRvbicpXG4gICAgY29uc3Qgc3RhcnRfbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtbW9kYWwtYmFja2dyb3VuZCcpXG4gICAgY29uc3QgcmVzdGFydF9tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0LW1vZGFsLWJhY2tncm91bmQnKVxuICAgIGNvbnN0IHJlc3RhcnRfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQtYnV0dG9uJylcbiAgICBjb25zdCBob2xkX2N0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9sZC1jYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgY29uc3QgbmV4dF9jdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHQtY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKVxuICAgIGNvbnN0IHNjb3JlX2N0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZS1jYW52YXMnKS5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBsZXQgZ2FtZV92aWV3ID0gbmV3IEdhbWVWaWV3KGN0eCwgaG9sZF9jdHgsIG5leHRfY3R4LCBzY29yZV9jdHgpO1xuICAgIHN0YXJ0X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBzdGFydF9tb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIGdhbWVfdmlldy5zdGFydCgpXG4gICAgICAgIGxldCBnYW1lUGxheSA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGdhbWVfdmlldy51cGRhdGUoKVxuICAgICAgICAgICAgaWYgKCFnYW1lX3ZpZXcuZ2FtZS5wbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChnYW1lUGxheSlcbiAgICAgICAgICAgICAgICByZXN0YXJ0X21vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDE2KVxuICAgIH0pXG5cbiAgICByZXN0YXJ0X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBnYW1lX3ZpZXcuZ2FtZS5uZXdTdGFydCgpO1xuICAgICAgICByZXN0YXJ0X21vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgZ2FtZV92aWV3LnN0YXJ0KClcbiAgICAgICAgbGV0IGdhbWVQbGF5ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZV92aWV3LnVwZGF0ZSgpXG4gICAgICAgICAgICBpZiAoIWdhbWVfdmlldy5nYW1lLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVQbGF5KVxuICAgICAgICAgICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTYpXG4gICAgfSlcbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9