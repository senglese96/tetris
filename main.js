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
        let newPos = [this.pos[0] * 32, this.pos[1] * 32];
        let grad = ctx.createLinearGradient(newPos[1], newPos[0], newPos[1] + 32, newPos[0] + 32);
        grad.addColorStop(0, this.color);
        grad.addColorStop(0.35, this.color);
        grad.addColorStop(1, 'rgba(255,255,255,1)');

        ctx.fillStyle = grad;
        ctx.fillRect(newPos[1], newPos[0], 32, 32)
    }

    drawGhost(ctx){
        let newPos = [this.pos[0] * 32, this.pos[1] * 32];
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = '2'
        ctx.rect(newPos[1]+1, newPos[0]+1, 30, 30)
        ctx.stroke();
    }

    moveGhost(){
        this.pos = [this.pos[0] + 1, this.pos[1]];
    }

    eraseBlock(ctx){
        let newPos = [this.pos[0] * 32, this.pos[1] * 32];
        ctx.clearRect(newPos[1], newPos[0], 32, 32)
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

    ghostPiece(){
        let isOccupied = false
        const ghost = new this.current.constructor([0,0])
        for(let i = 0; i < 4; i++){
            ghost.blocks[i].pos[0] = this.current.blocks[i].pos[0]
            ghost.blocks[i].pos[1] = this.current.blocks[i].pos[1]
        }
        ghost.blocks.forEach(block => {
            if (this.grid.occupied([block.pos[0] + 1, block.pos[1]], ghost)) {
                isOccupied = true
            }
        })
        while(!isOccupied){
            ghost.blocks.forEach(block => {
                block.moveGhost();
                if (this.grid.occupied([block.pos[0] + 1, block.pos[1]], ghost)) {
                    isOccupied = true
                }
            })
        }
        return ghost
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
        if(this.game.current){
            this.game.ghostPiece().blocks.forEach(block => {
                block.drawGhost(this.ctx);
            })
        }
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
        this.s_ctx.font = '20px Times New Roman'
        this.s_ctx.fillStyle = 'white'
        this.s_ctx.fillText(`score: ${this.game.score}`, 20, 56, 140)
        this.s_ctx.fillText(`lines: ${this.game.lines}`, 20, 112, 180)
        this.s_ctx.fillText(`level: ${this.game.level}`, 20, 168, 180)
    }

    drawGrid(){
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, 500, 800)
        for(let i = 32; i <= 320; i += 32){
            this.ctx.strokeStyle = "gray"
            this.ctx.lineWidth = '1'
            this.ctx.beginPath()
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, 800);
            this.ctx.stroke();
        }

        for(let j = 32; j <= 640; j += 32){
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
        let isOccupied = true
        tetrimino.blocks.forEach(block => {
            if (block.pos[0] === pos[0] && block.pos[1] === pos[1]) {
                isOccupied = false
            }
        })
        if(!isOccupied){
            return false
        }
        else if (this.board[pos[0]] === undefined ||
            this.board[pos[0]][pos[1]] === undefined) {
            return true
        } else if (this.board[pos[0]][pos[1]] !== null){
            debugger
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2tleW1hc3Rlci9rZXltYXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jsb2Nrcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBLGtCQUFrQjtBQUNsQixhQUFhLDZDQUE2QztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsdUU7Ozs7Ozs7Ozs7OztBQ3hKZjtBQUFBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxtRTs7Ozs7Ozs7Ozs7O0FDdkRmO0FBQUE7QUFBQTtBQUFBO0FBQWtDO0FBQ1A7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtEQUFRO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDIiwiZmlsZSI6Ii4vbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLy8gICAgIGtleW1hc3Rlci5qc1xuLy8gICAgIChjKSAyMDExLTIwMTMgVGhvbWFzIEZ1Y2hzXG4vLyAgICAga2V5bWFzdGVyLmpzIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG47KGZ1bmN0aW9uKGdsb2JhbCl7XG4gIHZhciBrLFxuICAgIF9oYW5kbGVycyA9IHt9LFxuICAgIF9tb2RzID0geyAxNjogZmFsc2UsIDE4OiBmYWxzZSwgMTc6IGZhbHNlLCA5MTogZmFsc2UgfSxcbiAgICBfc2NvcGUgPSAnYWxsJyxcbiAgICAvLyBtb2RpZmllciBrZXlzXG4gICAgX01PRElGSUVSUyA9IHtcbiAgICAgICfih6cnOiAxNiwgc2hpZnQ6IDE2LFxuICAgICAgJ+KMpSc6IDE4LCBhbHQ6IDE4LCBvcHRpb246IDE4LFxuICAgICAgJ+KMgyc6IDE3LCBjdHJsOiAxNywgY29udHJvbDogMTcsXG4gICAgICAn4oyYJzogOTEsIGNvbW1hbmQ6IDkxXG4gICAgfSxcbiAgICAvLyBzcGVjaWFsIGtleXNcbiAgICBfTUFQID0ge1xuICAgICAgYmFja3NwYWNlOiA4LCB0YWI6IDksIGNsZWFyOiAxMixcbiAgICAgIGVudGVyOiAxMywgJ3JldHVybic6IDEzLFxuICAgICAgZXNjOiAyNywgZXNjYXBlOiAyNywgc3BhY2U6IDMyLFxuICAgICAgbGVmdDogMzcsIHVwOiAzOCxcbiAgICAgIHJpZ2h0OiAzOSwgZG93bjogNDAsXG4gICAgICBkZWw6IDQ2LCAnZGVsZXRlJzogNDYsXG4gICAgICBob21lOiAzNiwgZW5kOiAzNSxcbiAgICAgIHBhZ2V1cDogMzMsIHBhZ2Vkb3duOiAzNCxcbiAgICAgICcsJzogMTg4LCAnLic6IDE5MCwgJy8nOiAxOTEsXG4gICAgICAnYCc6IDE5MiwgJy0nOiAxODksICc9JzogMTg3LFxuICAgICAgJzsnOiAxODYsICdcXCcnOiAyMjIsXG4gICAgICAnWyc6IDIxOSwgJ10nOiAyMjEsICdcXFxcJzogMjIwXG4gICAgfSxcbiAgICBjb2RlID0gZnVuY3Rpb24oeCl7XG4gICAgICByZXR1cm4gX01BUFt4XSB8fCB4LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICB9LFxuICAgIF9kb3duS2V5cyA9IFtdO1xuXG4gIGZvcihrPTE7azwyMDtrKyspIF9NQVBbJ2YnK2tdID0gMTExK2s7XG5cbiAgLy8gSUUgZG9lc24ndCBzdXBwb3J0IEFycmF5I2luZGV4T2YsIHNvIGhhdmUgYSBzaW1wbGUgcmVwbGFjZW1lbnRcbiAgZnVuY3Rpb24gaW5kZXgoYXJyYXksIGl0ZW0pe1xuICAgIHZhciBpID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlKGktLSkgaWYoYXJyYXlbaV09PT1pdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBmb3IgY29tcGFyaW5nIG1vZHMgYmVmb3JlIHVuYXNzaWdubWVudFxuICBmdW5jdGlvbiBjb21wYXJlQXJyYXkoYTEsIGEyKSB7XG4gICAgaWYgKGExLmxlbmd0aCAhPSBhMi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGExLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhMVtpXSAhPT0gYTJbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbW9kaWZpZXJNYXAgPSB7XG4gICAgICAxNjonc2hpZnRLZXknLFxuICAgICAgMTg6J2FsdEtleScsXG4gICAgICAxNzonY3RybEtleScsXG4gICAgICA5MTonbWV0YUtleSdcbiAgfTtcbiAgZnVuY3Rpb24gdXBkYXRlTW9kaWZpZXJLZXkoZXZlbnQpIHtcbiAgICAgIGZvcihrIGluIF9tb2RzKSBfbW9kc1trXSA9IGV2ZW50W21vZGlmaWVyTWFwW2tdXTtcbiAgfTtcblxuICAvLyBoYW5kbGUga2V5ZG93biBldmVudFxuICBmdW5jdGlvbiBkaXNwYXRjaChldmVudCkge1xuICAgIHZhciBrZXksIGhhbmRsZXIsIGssIGksIG1vZGlmaWVyc01hdGNoLCBzY29wZTtcbiAgICBrZXkgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgaWYgKGluZGV4KF9kb3duS2V5cywga2V5KSA9PSAtMSkge1xuICAgICAgICBfZG93bktleXMucHVzaChrZXkpO1xuICAgIH1cblxuICAgIC8vIGlmIGEgbW9kaWZpZXIga2V5LCBzZXQgdGhlIGtleS48bW9kaWZpZXJrZXluYW1lPiBwcm9wZXJ0eSB0byB0cnVlIGFuZCByZXR1cm5cbiAgICBpZihrZXkgPT0gOTMgfHwga2V5ID09IDIyNCkga2V5ID0gOTE7IC8vIHJpZ2h0IGNvbW1hbmQgb24gd2Via2l0LCBjb21tYW5kIG9uIEdlY2tvXG4gICAgaWYoa2V5IGluIF9tb2RzKSB7XG4gICAgICBfbW9kc1trZXldID0gdHJ1ZTtcbiAgICAgIC8vICdhc3NpZ25LZXknIGZyb20gaW5zaWRlIHRoaXMgY2xvc3VyZSBpcyBleHBvcnRlZCB0byB3aW5kb3cua2V5XG4gICAgICBmb3IoayBpbiBfTU9ESUZJRVJTKSBpZihfTU9ESUZJRVJTW2tdID09IGtleSkgYXNzaWduS2V5W2tdID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgLy8gc2VlIGlmIHdlIG5lZWQgdG8gaWdub3JlIHRoZSBrZXlwcmVzcyAoZmlsdGVyKCkgY2FuIGNhbiBiZSBvdmVycmlkZGVuKVxuICAgIC8vIGJ5IGRlZmF1bHQgaWdub3JlIGtleSBwcmVzc2VzIGlmIGEgc2VsZWN0LCB0ZXh0YXJlYSwgb3IgaW5wdXQgaXMgZm9jdXNlZFxuICAgIGlmKCFhc3NpZ25LZXkuZmlsdGVyLmNhbGwodGhpcywgZXZlbnQpKSByZXR1cm47XG5cbiAgICAvLyBhYm9ydCBpZiBubyBwb3RlbnRpYWxseSBtYXRjaGluZyBzaG9ydGN1dHMgZm91bmRcbiAgICBpZiAoIShrZXkgaW4gX2hhbmRsZXJzKSkgcmV0dXJuO1xuXG4gICAgc2NvcGUgPSBnZXRTY29wZSgpO1xuXG4gICAgLy8gZm9yIGVhY2ggcG90ZW50aWFsIHNob3J0Y3V0XG4gICAgZm9yIChpID0gMDsgaSA8IF9oYW5kbGVyc1trZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICBoYW5kbGVyID0gX2hhbmRsZXJzW2tleV1baV07XG5cbiAgICAgIC8vIHNlZSBpZiBpdCdzIGluIHRoZSBjdXJyZW50IHNjb3BlXG4gICAgICBpZihoYW5kbGVyLnNjb3BlID09IHNjb3BlIHx8IGhhbmRsZXIuc2NvcGUgPT0gJ2FsbCcpe1xuICAgICAgICAvLyBjaGVjayBpZiBtb2RpZmllcnMgbWF0Y2ggaWYgYW55XG4gICAgICAgIG1vZGlmaWVyc01hdGNoID0gaGFuZGxlci5tb2RzLmxlbmd0aCA+IDA7XG4gICAgICAgIGZvcihrIGluIF9tb2RzKVxuICAgICAgICAgIGlmKCghX21vZHNba10gJiYgaW5kZXgoaGFuZGxlci5tb2RzLCAraykgPiAtMSkgfHxcbiAgICAgICAgICAgIChfbW9kc1trXSAmJiBpbmRleChoYW5kbGVyLm1vZHMsICtrKSA9PSAtMSkpIG1vZGlmaWVyc01hdGNoID0gZmFsc2U7XG4gICAgICAgIC8vIGNhbGwgdGhlIGhhbmRsZXIgYW5kIHN0b3AgdGhlIGV2ZW50IGlmIG5lY2Nlc3NhcnlcbiAgICAgICAgaWYoKGhhbmRsZXIubW9kcy5sZW5ndGggPT0gMCAmJiAhX21vZHNbMTZdICYmICFfbW9kc1sxOF0gJiYgIV9tb2RzWzE3XSAmJiAhX21vZHNbOTFdKSB8fCBtb2RpZmllcnNNYXRjaCl7XG4gICAgICAgICAgaWYoaGFuZGxlci5tZXRob2QoZXZlbnQsIGhhbmRsZXIpPT09ZmFsc2Upe1xuICAgICAgICAgICAgaWYoZXZlbnQucHJldmVudERlZmF1bHQpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIGVsc2UgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBpZihldmVudC5jYW5jZWxCdWJibGUpIGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIHVuc2V0IG1vZGlmaWVyIGtleXMgb24ga2V5dXBcbiAgZnVuY3Rpb24gY2xlYXJNb2RpZmllcihldmVudCl7XG4gICAgdmFyIGtleSA9IGV2ZW50LmtleUNvZGUsIGssXG4gICAgICAgIGkgPSBpbmRleChfZG93bktleXMsIGtleSk7XG5cbiAgICAvLyByZW1vdmUga2V5IGZyb20gX2Rvd25LZXlzXG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgICBfZG93bktleXMuc3BsaWNlKGksIDEpO1xuICAgIH1cblxuICAgIGlmKGtleSA9PSA5MyB8fCBrZXkgPT0gMjI0KSBrZXkgPSA5MTtcbiAgICBpZihrZXkgaW4gX21vZHMpIHtcbiAgICAgIF9tb2RzW2tleV0gPSBmYWxzZTtcbiAgICAgIGZvcihrIGluIF9NT0RJRklFUlMpIGlmKF9NT0RJRklFUlNba10gPT0ga2V5KSBhc3NpZ25LZXlba10gPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVzZXRNb2RpZmllcnMoKSB7XG4gICAgZm9yKGsgaW4gX21vZHMpIF9tb2RzW2tdID0gZmFsc2U7XG4gICAgZm9yKGsgaW4gX01PRElGSUVSUykgYXNzaWduS2V5W2tdID0gZmFsc2U7XG4gIH07XG5cbiAgLy8gcGFyc2UgYW5kIGFzc2lnbiBzaG9ydGN1dFxuICBmdW5jdGlvbiBhc3NpZ25LZXkoa2V5LCBzY29wZSwgbWV0aG9kKXtcbiAgICB2YXIga2V5cywgbW9kcztcbiAgICBrZXlzID0gZ2V0S2V5cyhrZXkpO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbWV0aG9kID0gc2NvcGU7XG4gICAgICBzY29wZSA9ICdhbGwnO1xuICAgIH1cblxuICAgIC8vIGZvciBlYWNoIHNob3J0Y3V0XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBzZXQgbW9kaWZpZXIga2V5cyBpZiBhbnlcbiAgICAgIG1vZHMgPSBbXTtcbiAgICAgIGtleSA9IGtleXNbaV0uc3BsaXQoJysnKTtcbiAgICAgIGlmIChrZXkubGVuZ3RoID4gMSl7XG4gICAgICAgIG1vZHMgPSBnZXRNb2RzKGtleSk7XG4gICAgICAgIGtleSA9IFtrZXlba2V5Lmxlbmd0aC0xXV07XG4gICAgICB9XG4gICAgICAvLyBjb252ZXJ0IHRvIGtleWNvZGUgYW5kLi4uXG4gICAgICBrZXkgPSBrZXlbMF1cbiAgICAgIGtleSA9IGNvZGUoa2V5KTtcbiAgICAgIC8vIC4uLnN0b3JlIGhhbmRsZXJcbiAgICAgIGlmICghKGtleSBpbiBfaGFuZGxlcnMpKSBfaGFuZGxlcnNba2V5XSA9IFtdO1xuICAgICAgX2hhbmRsZXJzW2tleV0ucHVzaCh7IHNob3J0Y3V0OiBrZXlzW2ldLCBzY29wZTogc2NvcGUsIG1ldGhvZDogbWV0aG9kLCBrZXk6IGtleXNbaV0sIG1vZHM6IG1vZHMgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIHVuYmluZCBhbGwgaGFuZGxlcnMgZm9yIGdpdmVuIGtleSBpbiBjdXJyZW50IHNjb3BlXG4gIGZ1bmN0aW9uIHVuYmluZEtleShrZXksIHNjb3BlKSB7XG4gICAgdmFyIG11bHRpcGxlS2V5cywga2V5cyxcbiAgICAgIG1vZHMgPSBbXSxcbiAgICAgIGksIGosIG9iajtcblxuICAgIG11bHRpcGxlS2V5cyA9IGdldEtleXMoa2V5KTtcblxuICAgIGZvciAoaiA9IDA7IGogPCBtdWx0aXBsZUtleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGtleXMgPSBtdWx0aXBsZUtleXNbal0uc3BsaXQoJysnKTtcblxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICBtb2RzID0gZ2V0TW9kcyhrZXlzKTtcbiAgICAgICAga2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBjb2RlKGtleSk7XG5cbiAgICAgIGlmIChzY29wZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNjb3BlID0gZ2V0U2NvcGUoKTtcbiAgICAgIH1cbiAgICAgIGlmICghX2hhbmRsZXJzW2tleV0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChpID0gMDsgaSA8IF9oYW5kbGVyc1trZXldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9iaiA9IF9oYW5kbGVyc1trZXldW2ldO1xuICAgICAgICAvLyBvbmx5IGNsZWFyIGhhbmRsZXJzIGlmIGNvcnJlY3Qgc2NvcGUgYW5kIG1vZHMgbWF0Y2hcbiAgICAgICAgaWYgKG9iai5zY29wZSA9PT0gc2NvcGUgJiYgY29tcGFyZUFycmF5KG9iai5tb2RzLCBtb2RzKSkge1xuICAgICAgICAgIF9oYW5kbGVyc1trZXldW2ldID0ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBrZXkgd2l0aCBjb2RlICdrZXlDb2RlJyBpcyBjdXJyZW50bHkgZG93blxuICAvLyBDb252ZXJ0cyBzdHJpbmdzIGludG8ga2V5IGNvZGVzLlxuICBmdW5jdGlvbiBpc1ByZXNzZWQoa2V5Q29kZSkge1xuICAgICAgaWYgKHR5cGVvZihrZXlDb2RlKT09J3N0cmluZycpIHtcbiAgICAgICAga2V5Q29kZSA9IGNvZGUoa2V5Q29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXgoX2Rvd25LZXlzLCBrZXlDb2RlKSAhPSAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByZXNzZWRLZXlDb2RlcygpIHtcbiAgICAgIHJldHVybiBfZG93bktleXMuc2xpY2UoMCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaWx0ZXIoZXZlbnQpe1xuICAgIHZhciB0YWdOYW1lID0gKGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50KS50YWdOYW1lO1xuICAgIC8vIGlnbm9yZSBrZXlwcmVzc2VkIGluIGFueSBlbGVtZW50cyB0aGF0IHN1cHBvcnQga2V5Ym9hcmQgZGF0YSBpbnB1dFxuICAgIHJldHVybiAhKHRhZ05hbWUgPT0gJ0lOUFVUJyB8fCB0YWdOYW1lID09ICdTRUxFQ1QnIHx8IHRhZ05hbWUgPT0gJ1RFWFRBUkVBJyk7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIGtleS48bW9kaWZpZXI+IHRvIGZhbHNlXG4gIGZvcihrIGluIF9NT0RJRklFUlMpIGFzc2lnbktleVtrXSA9IGZhbHNlO1xuXG4gIC8vIHNldCBjdXJyZW50IHNjb3BlIChkZWZhdWx0ICdhbGwnKVxuICBmdW5jdGlvbiBzZXRTY29wZShzY29wZSl7IF9zY29wZSA9IHNjb3BlIHx8ICdhbGwnIH07XG4gIGZ1bmN0aW9uIGdldFNjb3BlKCl7IHJldHVybiBfc2NvcGUgfHwgJ2FsbCcgfTtcblxuICAvLyBkZWxldGUgYWxsIGhhbmRsZXJzIGZvciBhIGdpdmVuIHNjb3BlXG4gIGZ1bmN0aW9uIGRlbGV0ZVNjb3BlKHNjb3BlKXtcbiAgICB2YXIga2V5LCBoYW5kbGVycywgaTtcblxuICAgIGZvciAoa2V5IGluIF9oYW5kbGVycykge1xuICAgICAgaGFuZGxlcnMgPSBfaGFuZGxlcnNba2V5XTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7ICkge1xuICAgICAgICBpZiAoaGFuZGxlcnNbaV0uc2NvcGUgPT09IHNjb3BlKSBoYW5kbGVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGVsc2UgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBhYnN0cmFjdCBrZXkgbG9naWMgZm9yIGFzc2lnbiBhbmQgdW5hc3NpZ25cbiAgZnVuY3Rpb24gZ2V0S2V5cyhrZXkpIHtcbiAgICB2YXIga2V5cztcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICBrZXlzID0ga2V5LnNwbGl0KCcsJyk7XG4gICAgaWYgKChrZXlzW2tleXMubGVuZ3RoIC0gMV0pID09ICcnKSB7XG4gICAgICBrZXlzW2tleXMubGVuZ3RoIC0gMl0gKz0gJywnO1xuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIC8vIGFic3RyYWN0IG1vZHMgbG9naWMgZm9yIGFzc2lnbiBhbmQgdW5hc3NpZ25cbiAgZnVuY3Rpb24gZ2V0TW9kcyhrZXkpIHtcbiAgICB2YXIgbW9kcyA9IGtleS5zbGljZSgwLCBrZXkubGVuZ3RoIC0gMSk7XG4gICAgZm9yICh2YXIgbWkgPSAwOyBtaSA8IG1vZHMubGVuZ3RoOyBtaSsrKVxuICAgIG1vZHNbbWldID0gX01PRElGSUVSU1ttb2RzW21pXV07XG4gICAgcmV0dXJuIG1vZHM7XG4gIH1cblxuICAvLyBjcm9zcy1icm93c2VyIGV2ZW50c1xuICBmdW5jdGlvbiBhZGRFdmVudChvYmplY3QsIGV2ZW50LCBtZXRob2QpIHtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbWV0aG9kLCBmYWxzZSk7XG4gICAgZWxzZSBpZihvYmplY3QuYXR0YWNoRXZlbnQpXG4gICAgICBvYmplY3QuYXR0YWNoRXZlbnQoJ29uJytldmVudCwgZnVuY3Rpb24oKXsgbWV0aG9kKHdpbmRvdy5ldmVudCkgfSk7XG4gIH07XG5cbiAgLy8gc2V0IHRoZSBoYW5kbGVycyBnbG9iYWxseSBvbiBkb2N1bWVudFxuICBhZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBmdW5jdGlvbihldmVudCkgeyBkaXNwYXRjaChldmVudCkgfSk7IC8vIFBhc3NpbmcgX3Njb3BlIHRvIGEgY2FsbGJhY2sgdG8gZW5zdXJlIGl0IHJlbWFpbnMgdGhlIHNhbWUgYnkgZXhlY3V0aW9uLiBGaXhlcyAjNDhcbiAgYWRkRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcsIGNsZWFyTW9kaWZpZXIpO1xuXG4gIC8vIHJlc2V0IG1vZGlmaWVycyB0byBmYWxzZSB3aGVuZXZlciB0aGUgd2luZG93IGlzIChyZSlmb2N1c2VkLlxuICBhZGRFdmVudCh3aW5kb3csICdmb2N1cycsIHJlc2V0TW9kaWZpZXJzKTtcblxuICAvLyBzdG9yZSBwcmV2aW91c2x5IGRlZmluZWQga2V5XG4gIHZhciBwcmV2aW91c0tleSA9IGdsb2JhbC5rZXk7XG5cbiAgLy8gcmVzdG9yZSBwcmV2aW91c2x5IGRlZmluZWQga2V5IGFuZCByZXR1cm4gcmVmZXJlbmNlIHRvIG91ciBrZXkgb2JqZWN0XG4gIGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgdmFyIGsgPSBnbG9iYWwua2V5O1xuICAgIGdsb2JhbC5rZXkgPSBwcmV2aW91c0tleTtcbiAgICByZXR1cm4gaztcbiAgfVxuXG4gIC8vIHNldCB3aW5kb3cua2V5IGFuZCB3aW5kb3cua2V5LnNldC9nZXQvZGVsZXRlU2NvcGUsIGFuZCB0aGUgZGVmYXVsdCBmaWx0ZXJcbiAgZ2xvYmFsLmtleSA9IGFzc2lnbktleTtcbiAgZ2xvYmFsLmtleS5zZXRTY29wZSA9IHNldFNjb3BlO1xuICBnbG9iYWwua2V5LmdldFNjb3BlID0gZ2V0U2NvcGU7XG4gIGdsb2JhbC5rZXkuZGVsZXRlU2NvcGUgPSBkZWxldGVTY29wZTtcbiAgZ2xvYmFsLmtleS5maWx0ZXIgPSBmaWx0ZXI7XG4gIGdsb2JhbC5rZXkuaXNQcmVzc2VkID0gaXNQcmVzc2VkO1xuICBnbG9iYWwua2V5LmdldFByZXNzZWRLZXlDb2RlcyA9IGdldFByZXNzZWRLZXlDb2RlcztcbiAgZ2xvYmFsLmtleS5ub0NvbmZsaWN0ID0gbm9Db25mbGljdDtcbiAgZ2xvYmFsLmtleS51bmJpbmQgPSB1bmJpbmRLZXk7XG5cbiAgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gYXNzaWduS2V5O1xuXG59KSh0aGlzKTtcbiIsImV4cG9ydCBjbGFzcyBCbG9ja3tcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5wb3MgPSBvcHRpb25zLnBvcztcbiAgICAgICAgdGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3JcbiAgICB9XG5cbiAgICB1cGRhdGVQb3MobW92ZSwgZ3JpZCl7XG4gICAgICAgIHRoaXMucG9zID0gW21vdmVbMF0sIG1vdmVbMV1dXG4gICAgICAgIGdyaWQuYm9hcmRbdGhpcy5wb3NbMF1dW3RoaXMucG9zWzFdXSA9IHRoaXNcbiAgICB9XG5cbiAgICBkcmF3QmxvY2soY3R4KSB7XG4gICAgICAgIGxldCBuZXdQb3MgPSBbdGhpcy5wb3NbMF0gKiAzMiwgdGhpcy5wb3NbMV0gKiAzMl07XG4gICAgICAgIGxldCBncmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KG5ld1Bvc1sxXSwgbmV3UG9zWzBdLCBuZXdQb3NbMV0gKyAzMiwgbmV3UG9zWzBdICsgMzIpO1xuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLCB0aGlzLmNvbG9yKTtcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMC4zNSwgdGhpcy5jb2xvcik7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XG5cbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XG4gICAgICAgIGN0eC5maWxsUmVjdChuZXdQb3NbMV0sIG5ld1Bvc1swXSwgMzIsIDMyKVxuICAgIH1cblxuICAgIGRyYXdHaG9zdChjdHgpe1xuICAgICAgICBsZXQgbmV3UG9zID0gW3RoaXMucG9zWzBdICogMzIsIHRoaXMucG9zWzFdICogMzJdO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAnMidcbiAgICAgICAgY3R4LnJlY3QobmV3UG9zWzFdKzEsIG5ld1Bvc1swXSsxLCAzMCwgMzApXG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBtb3ZlR2hvc3QoKXtcbiAgICAgICAgdGhpcy5wb3MgPSBbdGhpcy5wb3NbMF0gKyAxLCB0aGlzLnBvc1sxXV07XG4gICAgfVxuXG4gICAgZXJhc2VCbG9jayhjdHgpe1xuICAgICAgICBsZXQgbmV3UG9zID0gW3RoaXMucG9zWzBdICogMzIsIHRoaXMucG9zWzFdICogMzJdO1xuICAgICAgICBjdHguY2xlYXJSZWN0KG5ld1Bvc1sxXSwgbmV3UG9zWzBdLCAzMiwgMzIpXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwsIHBhdHRlcm4sIGNvbG9yKXtcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBbXTtcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9ICd1cCdcbiAgICAgICAgcGF0dGVybi5mb3JFYWNoKHBvcyA9PiB7XG4gICAgICAgICAgICB0aGlzLmJsb2Nrcy5wdXNoKG5ldyBCbG9jayh7cG9zOiBbaW5pdGlhbFswXSArIHBvc1swXSwgaW5pdGlhbFsxXSArIHBvc1sxXV0sIGNvbG9yOiBjb2xvcn0pKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG1vdmUoZGlyLCBncmlkKXtcbiAgICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG5cbiAgICAgICAgICAgIGJsb2NrLnVwZGF0ZVBvcyhbYmxvY2sucG9zWzBdICsgZGlyWzBdLCBibG9jay5wb3NbMV0gKyBkaXJbMV1dLCBncmlkKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGRyYXcoY3R4KXtcbiAgICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICBibG9jay5kcmF3QmxvY2soY3R4KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByb3RhdGUoZ3JpZCwgZGlyKSB7XG4gICAgICAgIGxldCBtb3ZlcyA9IFtdXG4gICAgICAgIGxldCBwaXZvdCA9IHRoaXMuYmxvY2tzWzBdLnBvc1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRpciA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBuZXdYID0gcGl2b3RbMV0gKyBwaXZvdFswXSAtIHRoaXMuYmxvY2tzW2ldLnBvc1swXTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WSA9IHBpdm90WzBdIC0gcGl2b3RbMV0gKyB0aGlzLmJsb2Nrc1tpXS5wb3NbMV07XG4gICAgICAgICAgICAgICAgaWYgKCFncmlkLm9jY3VwaWVkKFtuZXdZLCBuZXdYXSwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZXMucHVzaChbbmV3WSwgbmV3WF0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBuZXdYID0gcGl2b3RbMV0gLSBwaXZvdFswXSArIHRoaXMuYmxvY2tzW2ldLnBvc1swXTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WSA9IHBpdm90WzBdICsgcGl2b3RbMV0gLSB0aGlzLmJsb2Nrc1tpXS5wb3NbMV07XG4gICAgICAgICAgICAgICAgaWYgKCFncmlkLm9jY3VwaWVkKFtuZXdZLCBuZXdYXSwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZXMucHVzaChbbmV3WSwgbmV3WF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtb3Zlcy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4gZ3JpZC5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsKVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc1tqXS51cGRhdGVQb3MobW92ZXNbai0xXSwgZ3JpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYmxvY2tzWzBdLnVwZGF0ZVBvcyhwaXZvdCwgZ3JpZClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEkgZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCl7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWzAsIDJdXSwgJ2xpZ2h0Ymx1ZScpO1xuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFswLCAyXV1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpe1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbLTEsIDBdLCBbMCwgMV1dLCAncHVycGxlJylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWy0xLCAwXSwgWzAsIDFdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEwgZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgMV1dLCAnb3JhbmdlJylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbLTEsIDFdXVxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgSiBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWy0xLCAtMV1dLCAnYmx1ZScpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWy0xLCAtMV1dXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTyBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAxXSwgWy0xLCAwXSwgWy0xLCAxXV0sICd5ZWxsb3cnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgMV0sIFstMSwgMF0sIFstMSwgMV1dXG4gICAgfVxuXG4gICAgcm90YXRlKGdyaWQsIGRpcil7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWy0xLCAwXSwgWy0xLCAxXV0sICdncmVlbicpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFstMSwgMV1dXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgWiBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAxXSwgWy0xLCAtMV0sIFstMSwgMF1dLCAncmVkJylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIDFdLCBbLTEsIC0xXSwgWy0xLCAwXV1cbiAgICB9XG59IiwiaW1wb3J0IHtJLCBTLCBPLCBaLCBKLCBMLCBUfSBmcm9tICcuL2Jsb2NrcydcbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCdcblxuXG5jbGFzcyBHYW1le1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG5ldyBHcmlkO1xuICAgICAgICB0aGlzLmN1cnJlbnRCYWcgPSB0aGlzLnJhbmRvbUJhZygpXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudEJhZy5zaGlmdCgpXG4gICAgICAgIHRoaXMubmV4dCA9IHRoaXMuY3VycmVudEJhZy5zcGxpY2UoMCwgMylcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMubGluZXMgPSAwXG4gICAgICAgIHRoaXMuZ3JhdkludGVydmFsXG4gICAgICAgIHRoaXMuZ3JhdkN1cnZlID0gWzc1MCwgNTAwLCAyNTAsIDE1MCwgMTAwLCA4MCwgNjUsIDUwLCA0MF1cbiAgICAgICAgdGhpcy5ncmF2VGFibGUgPSBbMTUsIDMwLCA0NSwgNjAsIDc1LCAxMDAsIDEyNSwgMTUwXVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLmdyYXZDdXJ2ZS5zaGlmdCgpXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGxcbiAgICB9XG5cbiAgICB1cGRhdGVHcmF2aXR5KGdyYXZpdHkpe1xuICAgICAgICB0aGlzLmdyYXZJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJvcCgpO1xuICAgICAgICB9LCBncmF2aXR5KVxuICAgIH1cblxuICAgIGRyb3AoKXtcbiAgICAgICAgbGV0IGlzT2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQub2NjdXBpZWQoW2Jsb2NrLnBvc1swXSArIDEsIGJsb2NrLnBvc1sxXV0sIHRoaXMuY3VycmVudCkpe1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKGlzT2NjdXBpZWQpe1xuICAgICAgICAgICAgdGhpcy5jaG9vc2VOZXh0UGllY2UoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5tb3ZlKHRoaXMuY3VycmVudCwgWzEsIDBdKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc09jY3VwaWVkXG4gICAgfVxuXG4gICAgZmFzdERyb3AoKXtcbiAgICAgICAgd2hpbGUoIXRoaXMuZHJvcCgpKXtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvbGRQaWVjZSgpe1xuICAgICAgICBpZighdGhpcy5oYXNIZWxkKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmJvYXJkW2Jsb2NrLnBvc1swXV1bYmxvY2sucG9zWzFdXSA9IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmhhc0hlbGQgPSB0cnVlXG4gICAgICAgICAgICBpZih0aGlzLmhvbGQpe1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wXG4gICAgICAgICAgICAgICAgdGVtcCA9IHRoaXMuaG9sZFxuICAgICAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMuY3VycmVudFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IG5ldyB0ZW1wLmNvbnN0cnVjdG9yKFsxLCA0XSlcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UoKVxuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMuY3VycmVudFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCYWcubGVuZ3RoID09PSAwICYmIHRoaXMubmV4dFswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50QmFnLnNoaWZ0KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50QmFnLnNwbGljZSgwLCAzKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubmV4dC5zaGlmdCgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dC5wdXNoKHRoaXMuY3VycmVudEJhZy5zaGlmdCgpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZG9tQmFnKCl7XG4gICAgICAgIGxldCBuZXdCYWcgPSBbbmV3IFQoWzEsIDRdKSwgbmV3IEkoWzEsIDRdKSwgbmV3IE8oWzEsIDRdKSwgbmV3IEooWzEsIDRdKSwgbmV3IEwoWzEsIDRdKSwgbmV3IFMoWzEsIDRdKSwgbmV3IFooWzEsIDRdKV1cbiAgICAgICAgbmV3QmFnID0gdGhpcy5zaHVmZmxlKG5ld0JhZylcbiAgICAgICAgcmV0dXJuIG5ld0JhZ1xuICAgIH1cblxuICAgIHNodWZmbGUoYSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBbYVtpXSwgYVtqXV0gPSBbYVtqXSwgYVtpXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgY2hvb3NlTmV4dFBpZWNlKCl7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGxcbiAgICAgICAgdGhpcy5saW5lcyArPSB0aGlzLmRpZENsZWFyKClcbiAgICAgICAgaWYodGhpcy5saW5lcyA+PSB0aGlzLmdyYXZUYWJsZVt0aGlzLmxldmVsLTFdKXtcbiAgICAgICAgICAgIHRoaXMubGV2ZWwgKz0gMTtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ3JhdkN1cnZlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ3JhdkludGVydmFsKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcmF2aXR5KHRoaXMuZ3Jhdml0eSlcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmN1cnJlbnRCYWcubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubmV4dC5zaGlmdCgpXG4gICAgICAgICAgICB0aGlzLm5leHQucHVzaCh0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm5leHQuc2hpZnQoKVxuICAgICAgICAgICAgdGhpcy5uZXh0LnB1c2godGhpcy5jdXJyZW50QmFnLnNoaWZ0KCkpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYXNIZWxkID0gZmFsc2VcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBpZWNlKClcbiAgICB9XG5cbiAgICBzdGFydCgpe1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICB0aGlzLnVwZGF0ZUdyYXZpdHkodGhpcy5ncmF2aXR5KVxuICAgICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgbmV3U3RhcnQoKXtcbiAgICAgICAgdGhpcy5ncmlkID0gbmV3IEdyaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50QmFnLnNoaWZ0KClcbiAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50QmFnLnNwbGljZSgwLCAzKVxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5saW5lcyA9IDBcbiAgICAgICAgdGhpcy5ncmF2SW50ZXJ2YWxcbiAgICAgICAgdGhpcy5ncmF2Q3VydmUgPSBbNzUwLCA1MDAsIDI1MCwgMTUwLCAxMDAsIDgwLCA2NSwgNTAsIDQwXVxuICAgICAgICB0aGlzLmdyYXZUYWJsZSA9IFsxNSwgMzAsIDQ1LCA2MCwgNzUsIDEwMCwgMTI1LCAxNTBdXG4gICAgICAgIHRoaXMubGV2ZWwgPSAxXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ3JhdkN1cnZlLnNoaWZ0KClcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbFxuICAgIH1cblxuICAgIGdhbWVPdmVyKCl7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5ncmF2SW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgIH1cblxuICAgIGdlbmVyYXRlUGllY2UoKXtcbiAgICAgICAgbGV0IG92ZXIgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmJsb2NrT2NjdXBpZWQoYmxvY2sucG9zKSl7XG4gICAgICAgICAgICAgICAgb3ZlciA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYob3Zlcil7XG4gICAgICAgICAgICB0aGlzLmdyaWQudXBkYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGlzLmdyaWQudXBkYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2hvc3RQaWVjZSgpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IGdob3N0ID0gbmV3IHRoaXMuY3VycmVudC5jb25zdHJ1Y3RvcihbMCwwXSlcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDQ7IGkrKyl7XG4gICAgICAgICAgICBnaG9zdC5ibG9ja3NbaV0ucG9zWzBdID0gdGhpcy5jdXJyZW50LmJsb2Nrc1tpXS5wb3NbMF1cbiAgICAgICAgICAgIGdob3N0LmJsb2Nrc1tpXS5wb3NbMV0gPSB0aGlzLmN1cnJlbnQuYmxvY2tzW2ldLnBvc1sxXVxuICAgICAgICB9XG4gICAgICAgIGdob3N0LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQub2NjdXBpZWQoW2Jsb2NrLnBvc1swXSArIDEsIGJsb2NrLnBvc1sxXV0sIGdob3N0KSkge1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHdoaWxlKCFpc09jY3VwaWVkKXtcbiAgICAgICAgICAgIGdob3N0LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBibG9jay5tb3ZlR2hvc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmlkLm9jY3VwaWVkKFtibG9jay5wb3NbMF0gKyAxLCBibG9jay5wb3NbMV1dLCBnaG9zdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnaG9zdFxuICAgIH1cblxuICAgIG1vdmVBY3RpdmVQaWVjZShkaXIpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5vY2N1cGllZChbYmxvY2sucG9zWzBdICsgZGlyWzBdLCBibG9jay5wb3NbMV0gKyBkaXJbMV1dLCB0aGlzLmN1cnJlbnQpKSB7XG4gICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYgKCFpc09jY3VwaWVkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQubW92ZSh0aGlzLmN1cnJlbnQsIGRpcilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZENsZWFyKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgdGhpcy5ncmlkLmJvYXJkLmZvckVhY2goKHJvdywgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZighcm93LmluY2x1ZGVzKG51bGwpKXtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxXG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gaWR4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtpXS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wU3RlcChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBzd2l0Y2goY291bnQpe1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMTAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAzMDAgKiB0aGlzLmxldmVsXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDUwMCAqIHRoaXMubGV2ZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gODAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBkcm9wU3RlcChibG9jayl7XG4gICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsXG4gICAgICAgIGJsb2NrLnVwZGF0ZVBvcyhbYmxvY2sucG9zWzBdICsgMSwgYmxvY2sucG9zWzFdXSwgdGhpcy5ncmlkKVxuICAgIH1cblxuICAgIHJvdGF0ZUFjdGl2ZVBpZWNlKGRpcil7XG4gICAgICAgIHRoaXMuY3VycmVudC5yb3RhdGUodGhpcy5ncmlkLCBkaXIpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xuaW1wb3J0IGtleSBmcm9tICdrZXltYXN0ZXInXG5cbmNsYXNzIEdhbWVWaWV3e1xuICAgIGNvbnN0cnVjdG9yKGN0eCwgaF9jdHgsIG5fY3R4LCBzX2N0eCl7XG4gICAgICAgIHRoaXMuY3R4ID0gY3R4XG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lKClcbiAgICAgICAgdGhpcy5kcmF3R3JpZCgpXG4gICAgICAgIHRoaXMuaF9jdHggPSBoX2N0eFxuICAgICAgICB0aGlzLm5fY3R4ID0gbl9jdHhcbiAgICAgICAgdGhpcy5zX2N0eCA9IHNfY3R4XG4gICAgICAgIHRoaXMudXBkYXRlSG9sZCgpXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dCgpXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKVxuICAgIH1cblxuICAgIHN0YXJ0KCl7XG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxSZWN0KDAsIDAsIDIwMCwgMjAwKVxuICAgICAgICBpZighdGhpcy5rZXltYXBTZXQpe1xuICAgICAgICAgICAgdGhpcy5zZXRLZXlNYXAoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5zdGFydCgpXG4gICAgfVxuXG4gICAgc2V0S2V5TWFwKCl7XG4gICAgICAgIHRoaXMua2V5bWFwU2V0ID0gdHJ1ZVxuICAgICAgICBrZXkoJ3JpZ2h0JywgKCkgPT4gdGhpcy5nYW1lLm1vdmVBY3RpdmVQaWVjZShbMCwgMV0pKVxuICAgICAgICBrZXkoJ2xlZnQnLCAoKSA9PiB0aGlzLmdhbWUubW92ZUFjdGl2ZVBpZWNlKFswLCAtMV0pKVxuICAgICAgICBjb25zdCBzcGVlZFVwID0gdGhyb3R0bGVkKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0MCAmJiB0aGlzLmdhbWUuZ3Jhdml0eSA+IDEwMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lLmdyYXZJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnVwZGF0ZUdyYXZpdHkoMTAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyNTApXG4gICAgICAgIGNvbnN0IHNsb3dEb3duID0gdGhyb3R0bGVkKGUgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDAgJiYgdGhpcy5nYW1lLmdyYXZpdHkgPiAxMDApIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZS5ncmF2SW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS51cGRhdGVHcmF2aXR5KHRoaXMuZ2FtZS5ncmF2aXR5KVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyNTApXG4gICAgICAgIGNvbnN0IGZhc3REcm9wID0gdGhyb3R0bGVkKGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmZhc3REcm9wKClcbiAgICAgICAgfSwgMjUwKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc3BlZWRVcClcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBzbG93RG93bilcbiAgICAgICAga2V5KCd4JywgKCkgPT4gdGhpcy5nYW1lLnJvdGF0ZUFjdGl2ZVBpZWNlKDEpKVxuICAgICAgICBrZXkoJ3onLCAoKSA9PiB0aGlzLmdhbWUucm90YXRlQWN0aXZlUGllY2UoLTEpKVxuICAgICAgICBrZXkoJ2MnLCAoKSA9PiB0aGlzLmdhbWUuaG9sZFBpZWNlKCkpO1xuICAgICAgICBrZXkoJ3NwYWNlJywgZmFzdERyb3ApXG4gICAgfVxuXG4gICAgdXBkYXRlKCl7XG4gICAgICAgIHRoaXMuZHJhd0dyaWQoKVxuICAgICAgICBpZih0aGlzLmdhbWUuY3VycmVudCl7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZ2hvc3RQaWVjZSgpLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBibG9jay5kcmF3R2hvc3QodGhpcy5jdHgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdhbWUuZ3JpZC5ib2FyZC5mb3JFYWNoKHJvdyA9PiB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgaWYoYmxvY2spe1xuICAgICAgICAgICAgICAgICAgICBibG9jay5kcmF3QmxvY2sodGhpcy5jdHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudXBkYXRlSG9sZCgpXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dCgpXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKVxuICAgIH1cblxuICAgIHVwZGF0ZUhvbGQoKXtcbiAgICAgICAgdGhpcy5oX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFJlY3QoMCwgMCwgMjAwLCAyMDApXG4gICAgICAgIGlmKHRoaXMuZ2FtZS5ob2xkKXtcbiAgICAgICAgICAgIGxldCBuZXdIb2xkXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJPXCIpe1xuICAgICAgICAgICAgICAgIG5ld0hvbGQgPSBuZXcgdGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IoWzIsIDEuNV0pXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiSVwiKXtcbiAgICAgICAgICAgICAgICBuZXdIb2xkID0gbmV3IHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yKFsxLjUsIDEuNV0pXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBuZXdIb2xkID0gbmV3IHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yKFsyLCAyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0hvbGQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayh0aGlzLmhfY3R4KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZU5leHQoKXtcbiAgICAgICAgdGhpcy5uX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMubl9jdHguZmlsbFJlY3QoMCwgMCwgNjAwLCA2MDApXG4gICAgICAgIGxldCBpZHhcbiAgICAgICAgbGV0IG5ld05leHRcbiAgICAgICAgZm9yKGxldCBpID0gMjsgaSA8IDk7IGkgKz0gMyl7XG4gICAgICAgICAgICBpZHggPSAoaSAtIDIpIC8gM1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5uZXh0W2lkeF0uY29uc3RydWN0b3IubmFtZSA9PT0gXCJPXCIgfHwgdGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIklcIikge1xuICAgICAgICAgICAgICAgIG5ld05leHQgPSBuZXcgdGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3RvcihbaSwgMS41XSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3TmV4dCA9IG5ldyB0aGlzLmdhbWUubmV4dFtpZHhdLmNvbnN0cnVjdG9yKFtpLCAyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld05leHQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayh0aGlzLm5fY3R4KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZVNjb3JlKCl7XG4gICAgICAgIHRoaXMuc19jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxSZWN0KDAsIDAsIDYwMCwgNjAwKVxuICAgICAgICB0aGlzLnNfY3R4LmZvbnQgPSAnMjBweCBUaW1lcyBOZXcgUm9tYW4nXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBzY29yZTogJHt0aGlzLmdhbWUuc2NvcmV9YCwgMjAsIDU2LCAxNDApXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFRleHQoYGxpbmVzOiAke3RoaXMuZ2FtZS5saW5lc31gLCAyMCwgMTEyLCAxODApXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFRleHQoYGxldmVsOiAke3RoaXMuZ2FtZS5sZXZlbH1gLCAyMCwgMTY4LCAxODApXG4gICAgfVxuXG4gICAgZHJhd0dyaWQoKXtcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDUwMCwgODAwKVxuICAgICAgICBmb3IobGV0IGkgPSAzMjsgaSA8PSAzMjA7IGkgKz0gMzIpe1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIlxuICAgICAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gJzEnXG4gICAgICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKGksIDApO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGksIDgwMCk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcihsZXQgaiA9IDMyOyBqIDw9IDY0MDsgaiArPSAzMil7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IFwiZ3JheVwiXG4gICAgICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKVxuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIGopO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKDQwMCwgaik7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gdGhyb3R0bGVkKGZuLCBkZWxheSkge1xuICAgIGxldCBsYXN0Q2FsbCA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IG5vdyA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuICAgICAgICBpZiAobm93IC0gbGFzdENhbGwgPCBkZWxheSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsID0gbm93O1xuICAgICAgICByZXR1cm4gZm4oLi4uYXJncyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lVmlldyIsImNsYXNzIEdyaWR7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5ib2FyZCA9IFtdXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKXtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucHVzaChuZXcgQXJyYXkoKSlcbiAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgaisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldLnB1c2gobnVsbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB1cGRhdGVQaWVjZSh0ZXRyaW1pbm8pe1xuICAgICAgICB0ZXRyaW1pbm8uYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBibG9ja1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIG1vdmUodGV0cmltaW5vLCBkaXIpe1xuICAgICAgICB0ZXRyaW1pbm8uYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsXG4gICAgICAgIH0pXG4gICAgICAgIHRldHJpbWluby5tb3ZlKGRpciwgdGhpcyk7XG4gICAgICAgIHRoaXMudXBkYXRlUGllY2UodGV0cmltaW5vKVxuICAgIH1cblxuICAgIGJsb2NrT2NjdXBpZWQocG9zKXtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmRbcG9zWzBdXSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSAhPT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIG9jY3VwaWVkKHBvcywgdGV0cmltaW5vKSB7XG4gICAgICAgIGxldCBpc09jY3VwaWVkID0gdHJ1ZVxuICAgICAgICB0ZXRyaW1pbm8uYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKGJsb2NrLnBvc1swXSA9PT0gcG9zWzBdICYmIGJsb2NrLnBvc1sxXSA9PT0gcG9zWzFdKSB7XG4gICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKCFpc09jY3VwaWVkKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYm9hcmRbcG9zWzBdXSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYm9hcmRbcG9zWzBdXVtwb3NbMV1dICE9PSBudWxsKXtcbiAgICAgICAgICAgIGRlYnVnZ2VyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JpZCIsImltcG9ydCBHYW1lVmlldyBmcm9tICcuL2dhbWVfdmlldydcbmltcG9ydCBrZXkgZnJvbSAna2V5bWFzdGVyJ1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jYW52YXNcIik7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjb25zdCBzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtYnV0dG9uJylcbiAgICBjb25zdCBzdGFydF9tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1tb2RhbC1iYWNrZ3JvdW5kJylcbiAgICBjb25zdCByZXN0YXJ0X21vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQtbW9kYWwtYmFja2dyb3VuZCcpXG4gICAgY29uc3QgcmVzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydC1idXR0b24nKVxuICAgIGNvbnN0IGhvbGRfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob2xkLWNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBjb25zdCBuZXh0X2N0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV4dC1jYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgY29uc3Qgc2NvcmVfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlLWNhbnZhcycpLmdldENvbnRleHQoXCIyZFwiKVxuICAgIGxldCBnYW1lX3ZpZXcgPSBuZXcgR2FtZVZpZXcoY3R4LCBob2xkX2N0eCwgbmV4dF9jdHgsIHNjb3JlX2N0eCk7XG4gICAgc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIHN0YXJ0X21vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgZ2FtZV92aWV3LnN0YXJ0KClcbiAgICAgICAgbGV0IGdhbWVQbGF5ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZV92aWV3LnVwZGF0ZSgpXG4gICAgICAgICAgICBpZiAoIWdhbWVfdmlldy5nYW1lLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVQbGF5KVxuICAgICAgICAgICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTYpXG4gICAgfSlcblxuICAgIHJlc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGdhbWVfdmlldy5nYW1lLm5ld1N0YXJ0KCk7XG4gICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBnYW1lX3ZpZXcuc3RhcnQoKVxuICAgICAgICBsZXQgZ2FtZVBsYXkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBnYW1lX3ZpZXcudXBkYXRlKClcbiAgICAgICAgICAgIGlmICghZ2FtZV92aWV3LmdhbWUucGxheWluZykge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZVBsYXkpXG4gICAgICAgICAgICAgICAgcmVzdGFydF9tb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxNilcbiAgICB9KVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=