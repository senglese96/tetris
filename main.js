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
        this.gravCurve = [750, 600, 450, 350, 275, 225, 175, 140, 110, 90, 75]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150, 175, 200]
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
                if (this.currentBag.length === 0) {
                    this.currentBag = this.randomBag()
                    this.current = this.next.shift()
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
        this.gravCurve = [750, 600, 450, 350, 275, 225, 175, 140, 110, 90, 75]
        this.gravTable = [15, 30, 45, 60, 75, 100, 125, 150, 175, 200]
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
        let game_view = this;
        let speed = false;
        const speedUp = (e) => {
            if (e.keyCode === 40 && speed === false && this.game.gravity > 100) {
                clearInterval(this.game.gravInterval);
                this.game.drop();
                this.game.updateGravity(100);
                speed = true;
            }
        }
        const slowDown = (e) => {
            if (e.keyCode === 40 && this.game.gravity > 100 && speed === true) {
                clearInterval(this.game.gravInterval);
                this.game.updateGravity(this.game.gravity);
                speed = false;
            }
        }
        const fastDrop = throttled(e => {
            this.game.fastDrop()
        }, 250)
        document.addEventListener('keydown', speedUp)
        document.addEventListener('keyup', slowDown)
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('x', () => this.game.rotateActivePiece(1))
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('z', () => this.game.rotateActivePiece(-1))
        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('up', () => this.game.rotateActivePiece(1))
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
        this.h_ctx.font = "28px Arial"
        this.h_ctx.fillStyle = 'white'
        this.h_ctx.fillText(`Hold`, 50, 40, 140)
        if(this.game.hold){
            let newHold
            if (this.game.hold.constructor.name === "O"){
                newHold = new this.game.hold.constructor([3, 1.5])
            } else if (this.game.hold.constructor.name === "I"){
                newHold = new this.game.hold.constructor([2.5, 1.5])
            } 
            else{
                newHold = new this.game.hold.constructor([3, 2])
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
        this.s_ctx.font = '20px Arial'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2tleW1hc3Rlci9rZXltYXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jsb2Nrcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBLGtCQUFrQjtBQUNsQixhQUFhLDZDQUE2QztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLHVFOzs7Ozs7Ozs7Ozs7QUNqS2Y7QUFBQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBLDBCQUEwQixRQUFRO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLG1FOzs7Ozs7Ozs7Ozs7QUN0RGY7QUFBQTtBQUFBO0FBQUE7QUFBa0M7QUFDUDs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0RBQVE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMLENBQUMiLCJmaWxlIjoiLi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIvLyAgICAga2V5bWFzdGVyLmpzXG4vLyAgICAgKGMpIDIwMTEtMjAxMyBUaG9tYXMgRnVjaHNcbi8vICAgICBrZXltYXN0ZXIuanMgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbjsoZnVuY3Rpb24oZ2xvYmFsKXtcbiAgdmFyIGssXG4gICAgX2hhbmRsZXJzID0ge30sXG4gICAgX21vZHMgPSB7IDE2OiBmYWxzZSwgMTg6IGZhbHNlLCAxNzogZmFsc2UsIDkxOiBmYWxzZSB9LFxuICAgIF9zY29wZSA9ICdhbGwnLFxuICAgIC8vIG1vZGlmaWVyIGtleXNcbiAgICBfTU9ESUZJRVJTID0ge1xuICAgICAgJ+KHpyc6IDE2LCBzaGlmdDogMTYsXG4gICAgICAn4oylJzogMTgsIGFsdDogMTgsIG9wdGlvbjogMTgsXG4gICAgICAn4oyDJzogMTcsIGN0cmw6IDE3LCBjb250cm9sOiAxNyxcbiAgICAgICfijJgnOiA5MSwgY29tbWFuZDogOTFcbiAgICB9LFxuICAgIC8vIHNwZWNpYWwga2V5c1xuICAgIF9NQVAgPSB7XG4gICAgICBiYWNrc3BhY2U6IDgsIHRhYjogOSwgY2xlYXI6IDEyLFxuICAgICAgZW50ZXI6IDEzLCAncmV0dXJuJzogMTMsXG4gICAgICBlc2M6IDI3LCBlc2NhcGU6IDI3LCBzcGFjZTogMzIsXG4gICAgICBsZWZ0OiAzNywgdXA6IDM4LFxuICAgICAgcmlnaHQ6IDM5LCBkb3duOiA0MCxcbiAgICAgIGRlbDogNDYsICdkZWxldGUnOiA0NixcbiAgICAgIGhvbWU6IDM2LCBlbmQ6IDM1LFxuICAgICAgcGFnZXVwOiAzMywgcGFnZWRvd246IDM0LFxuICAgICAgJywnOiAxODgsICcuJzogMTkwLCAnLyc6IDE5MSxcbiAgICAgICdgJzogMTkyLCAnLSc6IDE4OSwgJz0nOiAxODcsXG4gICAgICAnOyc6IDE4NiwgJ1xcJyc6IDIyMixcbiAgICAgICdbJzogMjE5LCAnXSc6IDIyMSwgJ1xcXFwnOiAyMjBcbiAgICB9LFxuICAgIGNvZGUgPSBmdW5jdGlvbih4KXtcbiAgICAgIHJldHVybiBfTUFQW3hdIHx8IHgudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuICAgIH0sXG4gICAgX2Rvd25LZXlzID0gW107XG5cbiAgZm9yKGs9MTtrPDIwO2srKykgX01BUFsnZicra10gPSAxMTEraztcblxuICAvLyBJRSBkb2Vzbid0IHN1cHBvcnQgQXJyYXkjaW5kZXhPZiwgc28gaGF2ZSBhIHNpbXBsZSByZXBsYWNlbWVudFxuICBmdW5jdGlvbiBpbmRleChhcnJheSwgaXRlbSl7XG4gICAgdmFyIGkgPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUoaS0tKSBpZihhcnJheVtpXT09PWl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8vIGZvciBjb21wYXJpbmcgbW9kcyBiZWZvcmUgdW5hc3NpZ25tZW50XG4gIGZ1bmN0aW9uIGNvbXBhcmVBcnJheShhMSwgYTIpIHtcbiAgICBpZiAoYTEubGVuZ3RoICE9IGEyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYTEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGExW2ldICE9PSBhMltpXSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBtb2RpZmllck1hcCA9IHtcbiAgICAgIDE2OidzaGlmdEtleScsXG4gICAgICAxODonYWx0S2V5JyxcbiAgICAgIDE3OidjdHJsS2V5JyxcbiAgICAgIDkxOidtZXRhS2V5J1xuICB9O1xuICBmdW5jdGlvbiB1cGRhdGVNb2RpZmllcktleShldmVudCkge1xuICAgICAgZm9yKGsgaW4gX21vZHMpIF9tb2RzW2tdID0gZXZlbnRbbW9kaWZpZXJNYXBba11dO1xuICB9O1xuXG4gIC8vIGhhbmRsZSBrZXlkb3duIGV2ZW50XG4gIGZ1bmN0aW9uIGRpc3BhdGNoKGV2ZW50KSB7XG4gICAgdmFyIGtleSwgaGFuZGxlciwgaywgaSwgbW9kaWZpZXJzTWF0Y2gsIHNjb3BlO1xuICAgIGtleSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBpZiAoaW5kZXgoX2Rvd25LZXlzLCBrZXkpID09IC0xKSB7XG4gICAgICAgIF9kb3duS2V5cy5wdXNoKGtleSk7XG4gICAgfVxuXG4gICAgLy8gaWYgYSBtb2RpZmllciBrZXksIHNldCB0aGUga2V5Ljxtb2RpZmllcmtleW5hbWU+IHByb3BlcnR5IHRvIHRydWUgYW5kIHJldHVyblxuICAgIGlmKGtleSA9PSA5MyB8fCBrZXkgPT0gMjI0KSBrZXkgPSA5MTsgLy8gcmlnaHQgY29tbWFuZCBvbiB3ZWJraXQsIGNvbW1hbmQgb24gR2Vja29cbiAgICBpZihrZXkgaW4gX21vZHMpIHtcbiAgICAgIF9tb2RzW2tleV0gPSB0cnVlO1xuICAgICAgLy8gJ2Fzc2lnbktleScgZnJvbSBpbnNpZGUgdGhpcyBjbG9zdXJlIGlzIGV4cG9ydGVkIHRvIHdpbmRvdy5rZXlcbiAgICAgIGZvcihrIGluIF9NT0RJRklFUlMpIGlmKF9NT0RJRklFUlNba10gPT0ga2V5KSBhc3NpZ25LZXlba10gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVNb2RpZmllcktleShldmVudCk7XG5cbiAgICAvLyBzZWUgaWYgd2UgbmVlZCB0byBpZ25vcmUgdGhlIGtleXByZXNzIChmaWx0ZXIoKSBjYW4gY2FuIGJlIG92ZXJyaWRkZW4pXG4gICAgLy8gYnkgZGVmYXVsdCBpZ25vcmUga2V5IHByZXNzZXMgaWYgYSBzZWxlY3QsIHRleHRhcmVhLCBvciBpbnB1dCBpcyBmb2N1c2VkXG4gICAgaWYoIWFzc2lnbktleS5maWx0ZXIuY2FsbCh0aGlzLCBldmVudCkpIHJldHVybjtcblxuICAgIC8vIGFib3J0IGlmIG5vIHBvdGVudGlhbGx5IG1hdGNoaW5nIHNob3J0Y3V0cyBmb3VuZFxuICAgIGlmICghKGtleSBpbiBfaGFuZGxlcnMpKSByZXR1cm47XG5cbiAgICBzY29wZSA9IGdldFNjb3BlKCk7XG5cbiAgICAvLyBmb3IgZWFjaCBwb3RlbnRpYWwgc2hvcnRjdXRcbiAgICBmb3IgKGkgPSAwOyBpIDwgX2hhbmRsZXJzW2tleV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhhbmRsZXIgPSBfaGFuZGxlcnNba2V5XVtpXTtcblxuICAgICAgLy8gc2VlIGlmIGl0J3MgaW4gdGhlIGN1cnJlbnQgc2NvcGVcbiAgICAgIGlmKGhhbmRsZXIuc2NvcGUgPT0gc2NvcGUgfHwgaGFuZGxlci5zY29wZSA9PSAnYWxsJyl7XG4gICAgICAgIC8vIGNoZWNrIGlmIG1vZGlmaWVycyBtYXRjaCBpZiBhbnlcbiAgICAgICAgbW9kaWZpZXJzTWF0Y2ggPSBoYW5kbGVyLm1vZHMubGVuZ3RoID4gMDtcbiAgICAgICAgZm9yKGsgaW4gX21vZHMpXG4gICAgICAgICAgaWYoKCFfbW9kc1trXSAmJiBpbmRleChoYW5kbGVyLm1vZHMsICtrKSA+IC0xKSB8fFxuICAgICAgICAgICAgKF9tb2RzW2tdICYmIGluZGV4KGhhbmRsZXIubW9kcywgK2spID09IC0xKSkgbW9kaWZpZXJzTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgLy8gY2FsbCB0aGUgaGFuZGxlciBhbmQgc3RvcCB0aGUgZXZlbnQgaWYgbmVjY2Vzc2FyeVxuICAgICAgICBpZigoaGFuZGxlci5tb2RzLmxlbmd0aCA9PSAwICYmICFfbW9kc1sxNl0gJiYgIV9tb2RzWzE4XSAmJiAhX21vZHNbMTddICYmICFfbW9kc1s5MV0pIHx8IG1vZGlmaWVyc01hdGNoKXtcbiAgICAgICAgICBpZihoYW5kbGVyLm1ldGhvZChldmVudCwgaGFuZGxlcik9PT1mYWxzZSl7XG4gICAgICAgICAgICBpZihldmVudC5wcmV2ZW50RGVmYXVsdCkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZWxzZSBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmKGV2ZW50LmNhbmNlbEJ1YmJsZSkgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gdW5zZXQgbW9kaWZpZXIga2V5cyBvbiBrZXl1cFxuICBmdW5jdGlvbiBjbGVhck1vZGlmaWVyKGV2ZW50KXtcbiAgICB2YXIga2V5ID0gZXZlbnQua2V5Q29kZSwgayxcbiAgICAgICAgaSA9IGluZGV4KF9kb3duS2V5cywga2V5KTtcblxuICAgIC8vIHJlbW92ZSBrZXkgZnJvbSBfZG93bktleXNcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICAgIF9kb3duS2V5cy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuXG4gICAgaWYoa2V5ID09IDkzIHx8IGtleSA9PSAyMjQpIGtleSA9IDkxO1xuICAgIGlmKGtleSBpbiBfbW9kcykge1xuICAgICAgX21vZHNba2V5XSA9IGZhbHNlO1xuICAgICAgZm9yKGsgaW4gX01PRElGSUVSUykgaWYoX01PRElGSUVSU1trXSA9PSBrZXkpIGFzc2lnbktleVtrXSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiByZXNldE1vZGlmaWVycygpIHtcbiAgICBmb3IoayBpbiBfbW9kcykgX21vZHNba10gPSBmYWxzZTtcbiAgICBmb3IoayBpbiBfTU9ESUZJRVJTKSBhc3NpZ25LZXlba10gPSBmYWxzZTtcbiAgfTtcblxuICAvLyBwYXJzZSBhbmQgYXNzaWduIHNob3J0Y3V0XG4gIGZ1bmN0aW9uIGFzc2lnbktleShrZXksIHNjb3BlLCBtZXRob2Qpe1xuICAgIHZhciBrZXlzLCBtb2RzO1xuICAgIGtleXMgPSBnZXRLZXlzKGtleSk7XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZXRob2QgPSBzY29wZTtcbiAgICAgIHNjb3BlID0gJ2FsbCc7XG4gICAgfVxuXG4gICAgLy8gZm9yIGVhY2ggc2hvcnRjdXRcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIHNldCBtb2RpZmllciBrZXlzIGlmIGFueVxuICAgICAgbW9kcyA9IFtdO1xuICAgICAga2V5ID0ga2V5c1tpXS5zcGxpdCgnKycpO1xuICAgICAgaWYgKGtleS5sZW5ndGggPiAxKXtcbiAgICAgICAgbW9kcyA9IGdldE1vZHMoa2V5KTtcbiAgICAgICAga2V5ID0gW2tleVtrZXkubGVuZ3RoLTFdXTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnZlcnQgdG8ga2V5Y29kZSBhbmQuLi5cbiAgICAgIGtleSA9IGtleVswXVxuICAgICAga2V5ID0gY29kZShrZXkpO1xuICAgICAgLy8gLi4uc3RvcmUgaGFuZGxlclxuICAgICAgaWYgKCEoa2V5IGluIF9oYW5kbGVycykpIF9oYW5kbGVyc1trZXldID0gW107XG4gICAgICBfaGFuZGxlcnNba2V5XS5wdXNoKHsgc2hvcnRjdXQ6IGtleXNbaV0sIHNjb3BlOiBzY29wZSwgbWV0aG9kOiBtZXRob2QsIGtleToga2V5c1tpXSwgbW9kczogbW9kcyB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gdW5iaW5kIGFsbCBoYW5kbGVycyBmb3IgZ2l2ZW4ga2V5IGluIGN1cnJlbnQgc2NvcGVcbiAgZnVuY3Rpb24gdW5iaW5kS2V5KGtleSwgc2NvcGUpIHtcbiAgICB2YXIgbXVsdGlwbGVLZXlzLCBrZXlzLFxuICAgICAgbW9kcyA9IFtdLFxuICAgICAgaSwgaiwgb2JqO1xuXG4gICAgbXVsdGlwbGVLZXlzID0gZ2V0S2V5cyhrZXkpO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IG11bHRpcGxlS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAga2V5cyA9IG11bHRpcGxlS2V5c1tqXS5zcGxpdCgnKycpO1xuXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIG1vZHMgPSBnZXRNb2RzKGtleXMpO1xuICAgICAgICBrZXkgPSBrZXlzW2tleXMubGVuZ3RoIC0gMV07XG4gICAgICB9XG5cbiAgICAgIGtleSA9IGNvZGUoa2V5KTtcblxuICAgICAgaWYgKHNjb3BlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2NvcGUgPSBnZXRTY29wZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCFfaGFuZGxlcnNba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgX2hhbmRsZXJzW2tleV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb2JqID0gX2hhbmRsZXJzW2tleV1baV07XG4gICAgICAgIC8vIG9ubHkgY2xlYXIgaGFuZGxlcnMgaWYgY29ycmVjdCBzY29wZSBhbmQgbW9kcyBtYXRjaFxuICAgICAgICBpZiAob2JqLnNjb3BlID09PSBzY29wZSAmJiBjb21wYXJlQXJyYXkob2JqLm1vZHMsIG1vZHMpKSB7XG4gICAgICAgICAgX2hhbmRsZXJzW2tleV1baV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIHRydWUgaWYgdGhlIGtleSB3aXRoIGNvZGUgJ2tleUNvZGUnIGlzIGN1cnJlbnRseSBkb3duXG4gIC8vIENvbnZlcnRzIHN0cmluZ3MgaW50byBrZXkgY29kZXMuXG4gIGZ1bmN0aW9uIGlzUHJlc3NlZChrZXlDb2RlKSB7XG4gICAgICBpZiAodHlwZW9mKGtleUNvZGUpPT0nc3RyaW5nJykge1xuICAgICAgICBrZXlDb2RlID0gY29kZShrZXlDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleChfZG93bktleXMsIGtleUNvZGUpICE9IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UHJlc3NlZEtleUNvZGVzKCkge1xuICAgICAgcmV0dXJuIF9kb3duS2V5cy5zbGljZSgwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbHRlcihldmVudCl7XG4gICAgdmFyIHRhZ05hbWUgPSAoZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQpLnRhZ05hbWU7XG4gICAgLy8gaWdub3JlIGtleXByZXNzZWQgaW4gYW55IGVsZW1lbnRzIHRoYXQgc3VwcG9ydCBrZXlib2FyZCBkYXRhIGlucHV0XG4gICAgcmV0dXJuICEodGFnTmFtZSA9PSAnSU5QVVQnIHx8IHRhZ05hbWUgPT0gJ1NFTEVDVCcgfHwgdGFnTmFtZSA9PSAnVEVYVEFSRUEnKTtcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUga2V5Ljxtb2RpZmllcj4gdG8gZmFsc2VcbiAgZm9yKGsgaW4gX01PRElGSUVSUykgYXNzaWduS2V5W2tdID0gZmFsc2U7XG5cbiAgLy8gc2V0IGN1cnJlbnQgc2NvcGUgKGRlZmF1bHQgJ2FsbCcpXG4gIGZ1bmN0aW9uIHNldFNjb3BlKHNjb3BlKXsgX3Njb3BlID0gc2NvcGUgfHwgJ2FsbCcgfTtcbiAgZnVuY3Rpb24gZ2V0U2NvcGUoKXsgcmV0dXJuIF9zY29wZSB8fCAnYWxsJyB9O1xuXG4gIC8vIGRlbGV0ZSBhbGwgaGFuZGxlcnMgZm9yIGEgZ2l2ZW4gc2NvcGVcbiAgZnVuY3Rpb24gZGVsZXRlU2NvcGUoc2NvcGUpe1xuICAgIHZhciBrZXksIGhhbmRsZXJzLCBpO1xuXG4gICAgZm9yIChrZXkgaW4gX2hhbmRsZXJzKSB7XG4gICAgICBoYW5kbGVycyA9IF9oYW5kbGVyc1trZXldO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgKSB7XG4gICAgICAgIGlmIChoYW5kbGVyc1tpXS5zY29wZSA9PT0gc2NvcGUpIGhhbmRsZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgZWxzZSBpKys7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIGFic3RyYWN0IGtleSBsb2dpYyBmb3IgYXNzaWduIGFuZCB1bmFzc2lnblxuICBmdW5jdGlvbiBnZXRLZXlzKGtleSkge1xuICAgIHZhciBrZXlzO1xuICAgIGtleSA9IGtleS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgIGtleXMgPSBrZXkuc3BsaXQoJywnKTtcbiAgICBpZiAoKGtleXNba2V5cy5sZW5ndGggLSAxXSkgPT0gJycpIHtcbiAgICAgIGtleXNba2V5cy5sZW5ndGggLSAyXSArPSAnLCc7XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG5cbiAgLy8gYWJzdHJhY3QgbW9kcyBsb2dpYyBmb3IgYXNzaWduIGFuZCB1bmFzc2lnblxuICBmdW5jdGlvbiBnZXRNb2RzKGtleSkge1xuICAgIHZhciBtb2RzID0ga2V5LnNsaWNlKDAsIGtleS5sZW5ndGggLSAxKTtcbiAgICBmb3IgKHZhciBtaSA9IDA7IG1pIDwgbW9kcy5sZW5ndGg7IG1pKyspXG4gICAgbW9kc1ttaV0gPSBfTU9ESUZJRVJTW21vZHNbbWldXTtcbiAgICByZXR1cm4gbW9kcztcbiAgfVxuXG4gIC8vIGNyb3NzLWJyb3dzZXIgZXZlbnRzXG4gIGZ1bmN0aW9uIGFkZEV2ZW50KG9iamVjdCwgZXZlbnQsIG1ldGhvZCkge1xuICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBtZXRob2QsIGZhbHNlKTtcbiAgICBlbHNlIGlmKG9iamVjdC5hdHRhY2hFdmVudClcbiAgICAgIG9iamVjdC5hdHRhY2hFdmVudCgnb24nK2V2ZW50LCBmdW5jdGlvbigpeyBtZXRob2Qod2luZG93LmV2ZW50KSB9KTtcbiAgfTtcblxuICAvLyBzZXQgdGhlIGhhbmRsZXJzIGdsb2JhbGx5IG9uIGRvY3VtZW50XG4gIGFkZEV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KSB7IGRpc3BhdGNoKGV2ZW50KSB9KTsgLy8gUGFzc2luZyBfc2NvcGUgdG8gYSBjYWxsYmFjayB0byBlbnN1cmUgaXQgcmVtYWlucyB0aGUgc2FtZSBieSBleGVjdXRpb24uIEZpeGVzICM0OFxuICBhZGRFdmVudChkb2N1bWVudCwgJ2tleXVwJywgY2xlYXJNb2RpZmllcik7XG5cbiAgLy8gcmVzZXQgbW9kaWZpZXJzIHRvIGZhbHNlIHdoZW5ldmVyIHRoZSB3aW5kb3cgaXMgKHJlKWZvY3VzZWQuXG4gIGFkZEV2ZW50KHdpbmRvdywgJ2ZvY3VzJywgcmVzZXRNb2RpZmllcnMpO1xuXG4gIC8vIHN0b3JlIHByZXZpb3VzbHkgZGVmaW5lZCBrZXlcbiAgdmFyIHByZXZpb3VzS2V5ID0gZ2xvYmFsLmtleTtcblxuICAvLyByZXN0b3JlIHByZXZpb3VzbHkgZGVmaW5lZCBrZXkgYW5kIHJldHVybiByZWZlcmVuY2UgdG8gb3VyIGtleSBvYmplY3RcbiAgZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICB2YXIgayA9IGdsb2JhbC5rZXk7XG4gICAgZ2xvYmFsLmtleSA9IHByZXZpb3VzS2V5O1xuICAgIHJldHVybiBrO1xuICB9XG5cbiAgLy8gc2V0IHdpbmRvdy5rZXkgYW5kIHdpbmRvdy5rZXkuc2V0L2dldC9kZWxldGVTY29wZSwgYW5kIHRoZSBkZWZhdWx0IGZpbHRlclxuICBnbG9iYWwua2V5ID0gYXNzaWduS2V5O1xuICBnbG9iYWwua2V5LnNldFNjb3BlID0gc2V0U2NvcGU7XG4gIGdsb2JhbC5rZXkuZ2V0U2NvcGUgPSBnZXRTY29wZTtcbiAgZ2xvYmFsLmtleS5kZWxldGVTY29wZSA9IGRlbGV0ZVNjb3BlO1xuICBnbG9iYWwua2V5LmZpbHRlciA9IGZpbHRlcjtcbiAgZ2xvYmFsLmtleS5pc1ByZXNzZWQgPSBpc1ByZXNzZWQ7XG4gIGdsb2JhbC5rZXkuZ2V0UHJlc3NlZEtleUNvZGVzID0gZ2V0UHJlc3NlZEtleUNvZGVzO1xuICBnbG9iYWwua2V5Lm5vQ29uZmxpY3QgPSBub0NvbmZsaWN0O1xuICBnbG9iYWwua2V5LnVuYmluZCA9IHVuYmluZEtleTtcblxuICBpZih0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25LZXk7XG5cbn0pKHRoaXMpO1xuIiwiZXhwb3J0IGNsYXNzIEJsb2Nre1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLnBvcyA9IG9wdGlvbnMucG9zO1xuICAgICAgICB0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvclxuICAgIH1cblxuICAgIHVwZGF0ZVBvcyhtb3ZlLCBncmlkKXtcbiAgICAgICAgdGhpcy5wb3MgPSBbbW92ZVswXSwgbW92ZVsxXV1cbiAgICAgICAgZ3JpZC5ib2FyZFt0aGlzLnBvc1swXV1bdGhpcy5wb3NbMV1dID0gdGhpc1xuICAgIH1cblxuICAgIGRyYXdCbG9jayhjdHgpIHtcbiAgICAgICAgbGV0IG5ld1BvcyA9IFt0aGlzLnBvc1swXSAqIDMyLCB0aGlzLnBvc1sxXSAqIDMyXTtcbiAgICAgICAgbGV0IGdyYWQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQobmV3UG9zWzFdLCBuZXdQb3NbMF0sIG5ld1Bvc1sxXSArIDMyLCBuZXdQb3NbMF0gKyAzMik7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsIHRoaXMuY29sb3IpO1xuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgwLjM1LCB0aGlzLmNvbG9yKTtcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgJ3JnYmEoMjU1LDI1NSwyNTUsMSknKTtcblxuICAgICAgICBjdHguZmlsbFN0eWxlID0gZ3JhZDtcbiAgICAgICAgY3R4LmZpbGxSZWN0KG5ld1Bvc1sxXSwgbmV3UG9zWzBdLCAzMiwgMzIpXG4gICAgfVxuXG4gICAgZHJhd0dob3N0KGN0eCl7XG4gICAgICAgIGxldCBuZXdQb3MgPSBbdGhpcy5wb3NbMF0gKiAzMiwgdGhpcy5wb3NbMV0gKiAzMl07XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9ICcyJ1xuICAgICAgICBjdHgucmVjdChuZXdQb3NbMV0rMSwgbmV3UG9zWzBdKzEsIDMwLCAzMClcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIG1vdmVHaG9zdCgpe1xuICAgICAgICB0aGlzLnBvcyA9IFt0aGlzLnBvc1swXSArIDEsIHRoaXMucG9zWzFdXTtcbiAgICB9XG5cbiAgICBlcmFzZUJsb2NrKGN0eCl7XG4gICAgICAgIGxldCBuZXdQb3MgPSBbdGhpcy5wb3NbMF0gKiAzMiwgdGhpcy5wb3NbMV0gKiAzMl07XG4gICAgICAgIGN0eC5jbGVhclJlY3QobmV3UG9zWzFdLCBuZXdQb3NbMF0sIDMyLCAzMilcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCwgcGF0dGVybiwgY29sb3Ipe1xuICAgICAgICB0aGlzLmJsb2NrcyA9IFtdO1xuICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gJ3VwJ1xuICAgICAgICBwYXR0ZXJuLmZvckVhY2gocG9zID0+IHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tzLnB1c2gobmV3IEJsb2NrKHtwb3M6IFtpbml0aWFsWzBdICsgcG9zWzBdLCBpbml0aWFsWzFdICsgcG9zWzFdXSwgY29sb3I6IGNvbG9yfSkpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgbW92ZShkaXIsIGdyaWQpe1xuICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcblxuICAgICAgICAgICAgYmxvY2sudXBkYXRlUG9zKFtibG9jay5wb3NbMF0gKyBkaXJbMF0sIGJsb2NrLnBvc1sxXSArIGRpclsxXV0sIGdyaWQpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZHJhdyhjdHgpe1xuICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayhjdHgpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJvdGF0ZShncmlkLCBkaXIpIHtcbiAgICAgICAgbGV0IG1vdmVzID0gW11cbiAgICAgICAgbGV0IHBpdm90ID0gdGhpcy5ibG9ja3NbMF0ucG9zXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGlyID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ggPSBwaXZvdFsxXSArIHBpdm90WzBdIC0gdGhpcy5ibG9ja3NbaV0ucG9zWzBdO1xuICAgICAgICAgICAgICAgIGxldCBuZXdZID0gcGl2b3RbMF0gLSBwaXZvdFsxXSArIHRoaXMuYmxvY2tzW2ldLnBvc1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIWdyaWQub2NjdXBpZWQoW25ld1ksIG5ld1hdLCB0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3Zlcy5wdXNoKFtuZXdZLCBuZXdYXSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ggPSBwaXZvdFsxXSAtIHBpdm90WzBdICsgdGhpcy5ibG9ja3NbaV0ucG9zWzBdO1xuICAgICAgICAgICAgICAgIGxldCBuZXdZID0gcGl2b3RbMF0gKyBwaXZvdFsxXSAtIHRoaXMuYmxvY2tzW2ldLnBvc1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoIWdyaWQub2NjdXBpZWQoW25ld1ksIG5ld1hdLCB0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBtb3Zlcy5wdXNoKFtuZXdZLCBuZXdYXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdmVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jayA9PiBncmlkLmJvYXJkW2Jsb2NrLnBvc1swXV1bYmxvY2sucG9zWzFdXSA9IG51bGwpXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tzW2pdLnVwZGF0ZVBvcyhtb3Zlc1tqLTFdLCBncmlkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ibG9ja3NbMF0udXBkYXRlUG9zKHBpdm90LCBncmlkKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSSBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKXtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbMCwgMl1dLCAnbGlnaHRibHVlJyk7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWzAsIDJdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFQgZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCl7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFswLCAxXV0sICdwdXJwbGUnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbLTEsIDBdLCBbMCwgMV1dXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTCBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWy0xLCAxXV0sICdvcmFuZ2UnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgMV1dXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBKIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbLTEsIC0xXV0sICdibHVlJylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbLTEsIC0xXV1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIDFdLCBbLTEsIDBdLCBbLTEsIDFdXSwgJ3llbGxvdycpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAxXSwgWy0xLCAwXSwgWy0xLCAxXV1cbiAgICB9XG5cbiAgICByb3RhdGUoZ3JpZCwgZGlyKXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFMgZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbLTEsIDBdLCBbLTEsIDFdXSwgJ2dyZWVuJylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWy0xLCAwXSwgWy0xLCAxXV1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBaIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIDFdLCBbLTEsIC0xXSwgWy0xLCAwXV0sICdyZWQnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgMV0sIFstMSwgLTFdLCBbLTEsIDBdXVxuICAgIH1cbn0iLCJpbXBvcnQge0ksIFMsIE8sIFosIEosIEwsIFR9IGZyb20gJy4vYmxvY2tzJ1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJ1xuXG5cbmNsYXNzIEdhbWV7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5ncmlkID0gbmV3IEdyaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50QmFnLnNoaWZ0KClcbiAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50QmFnLnNwbGljZSgwLCAzKVxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5saW5lcyA9IDBcbiAgICAgICAgdGhpcy5ncmF2SW50ZXJ2YWxcbiAgICAgICAgdGhpcy5ncmF2Q3VydmUgPSBbNzUwLCA2MDAsIDQ1MCwgMzUwLCAyNzUsIDIyNSwgMTc1LCAxNDAsIDExMCwgOTAsIDc1XVxuICAgICAgICB0aGlzLmdyYXZUYWJsZSA9IFsxNSwgMzAsIDQ1LCA2MCwgNzUsIDEwMCwgMTI1LCAxNTAsIDE3NSwgMjAwXVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLmdyYXZDdXJ2ZS5zaGlmdCgpXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGxcbiAgICB9XG5cbiAgICB1cGRhdGVHcmF2aXR5KGdyYXZpdHkpe1xuICAgICAgICB0aGlzLmdyYXZJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJvcCgpO1xuICAgICAgICB9LCBncmF2aXR5KVxuICAgIH1cblxuICAgIGRyb3AoKXtcbiAgICAgICAgbGV0IGlzT2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQub2NjdXBpZWQoW2Jsb2NrLnBvc1swXSArIDEsIGJsb2NrLnBvc1sxXV0sIHRoaXMuY3VycmVudCkpe1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKGlzT2NjdXBpZWQpe1xuICAgICAgICAgICAgdGhpcy5jaG9vc2VOZXh0UGllY2UoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5tb3ZlKHRoaXMuY3VycmVudCwgWzEsIDBdKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc09jY3VwaWVkXG4gICAgfVxuXG4gICAgZmFzdERyb3AoKXtcbiAgICAgICAgd2hpbGUoIXRoaXMuZHJvcCgpKXtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhvbGRQaWVjZSgpe1xuICAgICAgICBpZighdGhpcy5oYXNIZWxkKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncmlkLmJvYXJkW2Jsb2NrLnBvc1swXV1bYmxvY2sucG9zWzFdXSA9IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmhhc0hlbGQgPSB0cnVlXG4gICAgICAgICAgICBpZih0aGlzLmhvbGQpe1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wXG4gICAgICAgICAgICAgICAgdGVtcCA9IHRoaXMuaG9sZFxuICAgICAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMuY3VycmVudFxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IG5ldyB0ZW1wLmNvbnN0cnVjdG9yKFsxLCA0XSlcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UoKVxuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuaG9sZCA9IHRoaXMuY3VycmVudFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCYWcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5uZXh0LnNoaWZ0KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50QmFnLnNwbGljZSgwLCAzKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubmV4dC5zaGlmdCgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dC5wdXNoKHRoaXMuY3VycmVudEJhZy5zaGlmdCgpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZG9tQmFnKCl7XG4gICAgICAgIGxldCBuZXdCYWcgPSBbbmV3IFQoWzEsIDRdKSwgbmV3IEkoWzEsIDRdKSwgbmV3IE8oWzEsIDRdKSwgbmV3IEooWzEsIDRdKSwgbmV3IEwoWzEsIDRdKSwgbmV3IFMoWzEsIDRdKSwgbmV3IFooWzEsIDRdKV1cbiAgICAgICAgbmV3QmFnID0gdGhpcy5zaHVmZmxlKG5ld0JhZylcbiAgICAgICAgcmV0dXJuIG5ld0JhZ1xuICAgIH1cblxuICAgIHNodWZmbGUoYSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICBbYVtpXSwgYVtqXV0gPSBbYVtqXSwgYVtpXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgY2hvb3NlTmV4dFBpZWNlKCl7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGxcbiAgICAgICAgdGhpcy5saW5lcyArPSB0aGlzLmRpZENsZWFyKClcbiAgICAgICAgaWYodGhpcy5saW5lcyA+PSB0aGlzLmdyYXZUYWJsZVt0aGlzLmxldmVsLTFdKXtcbiAgICAgICAgICAgIHRoaXMubGV2ZWwgKz0gMTtcbiAgICAgICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ3JhdkN1cnZlLnNoaWZ0KCk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ3JhdkludGVydmFsKVxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcmF2aXR5KHRoaXMuZ3Jhdml0eSlcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLmN1cnJlbnRCYWcubGVuZ3RoID09PSAwKXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubmV4dC5zaGlmdCgpXG4gICAgICAgICAgICB0aGlzLm5leHQucHVzaCh0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm5leHQuc2hpZnQoKVxuICAgICAgICAgICAgdGhpcy5uZXh0LnB1c2godGhpcy5jdXJyZW50QmFnLnNoaWZ0KCkpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oYXNIZWxkID0gZmFsc2VcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVBpZWNlKClcbiAgICB9XG5cbiAgICBzdGFydCgpe1xuICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICB0aGlzLnVwZGF0ZUdyYXZpdHkodGhpcy5ncmF2aXR5KVxuICAgICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlXG4gICAgfVxuXG4gICAgbmV3U3RhcnQoKXtcbiAgICAgICAgdGhpcy5ncmlkID0gbmV3IEdyaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudEJhZyA9IHRoaXMucmFuZG9tQmFnKClcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50QmFnLnNoaWZ0KClcbiAgICAgICAgdGhpcy5uZXh0ID0gdGhpcy5jdXJyZW50QmFnLnNwbGljZSgwLCAzKVxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5saW5lcyA9IDBcbiAgICAgICAgdGhpcy5ncmF2SW50ZXJ2YWxcbiAgICAgICAgdGhpcy5ncmF2Q3VydmUgPSBbNzUwLCA2MDAsIDQ1MCwgMzUwLCAyNzUsIDIyNSwgMTc1LCAxNDAsIDExMCwgOTAsIDc1XVxuICAgICAgICB0aGlzLmdyYXZUYWJsZSA9IFsxNSwgMzAsIDQ1LCA2MCwgNzUsIDEwMCwgMTI1LCAxNTAsIDE3NSwgMjAwXVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgICAgICB0aGlzLmdyYXZpdHkgPSB0aGlzLmdyYXZDdXJ2ZS5zaGlmdCgpXG4gICAgICAgIHRoaXMucGxheWluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuaG9sZCA9IG51bGxcbiAgICB9XG5cbiAgICBnYW1lT3Zlcigpe1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ3JhdkludGVydmFsKTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5sZXZlbCA9IDFcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVBpZWNlKCl7XG4gICAgICAgIGxldCBvdmVyID0gZmFsc2VcbiAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZ3JpZC5ibG9ja09jY3VwaWVkKGJsb2NrLnBvcykpe1xuICAgICAgICAgICAgICAgIG92ZXIgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmKG92ZXIpe1xuICAgICAgICAgICAgdGhpcy5ncmlkLnVwZGF0ZVBpZWNlKHRoaXMuY3VycmVudClcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdGhpcy5ncmlkLnVwZGF0ZVBpZWNlKHRoaXMuY3VycmVudClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdob3N0UGllY2UoKXtcbiAgICAgICAgbGV0IGlzT2NjdXBpZWQgPSBmYWxzZVxuICAgICAgICBjb25zdCBnaG9zdCA9IG5ldyB0aGlzLmN1cnJlbnQuY29uc3RydWN0b3IoWzAsMF0pXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCA0OyBpKyspe1xuICAgICAgICAgICAgZ2hvc3QuYmxvY2tzW2ldLnBvc1swXSA9IHRoaXMuY3VycmVudC5ibG9ja3NbaV0ucG9zWzBdXG4gICAgICAgICAgICBnaG9zdC5ibG9ja3NbaV0ucG9zWzFdID0gdGhpcy5jdXJyZW50LmJsb2Nrc1tpXS5wb3NbMV1cbiAgICAgICAgfVxuICAgICAgICBnaG9zdC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmlkLm9jY3VwaWVkKFtibG9jay5wb3NbMF0gKyAxLCBibG9jay5wb3NbMV1dLCBnaG9zdCkpIHtcbiAgICAgICAgICAgICAgICBpc09jY3VwaWVkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICB3aGlsZSghaXNPY2N1cGllZCl7XG4gICAgICAgICAgICBnaG9zdC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgYmxvY2subW92ZUdob3N0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5vY2N1cGllZChbYmxvY2sucG9zWzBdICsgMSwgYmxvY2sucG9zWzFdXSwgZ2hvc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2hvc3RcbiAgICB9XG5cbiAgICBtb3ZlQWN0aXZlUGllY2UoZGlyKXtcbiAgICAgICAgbGV0IGlzT2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQub2NjdXBpZWQoW2Jsb2NrLnBvc1swXSArIGRpclswXSwgYmxvY2sucG9zWzFdICsgZGlyWzFdXSwgdGhpcy5jdXJyZW50KSkge1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGlmICghaXNPY2N1cGllZCkge1xuICAgICAgICAgICAgdGhpcy5ncmlkLm1vdmUodGhpcy5jdXJyZW50LCBkaXIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkaWRDbGVhcigpe1xuICAgICAgICBsZXQgY291bnQgPSAwXG4gICAgICAgIHRoaXMuZ3JpZC5ib2FyZC5mb3JFYWNoKChyb3csIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYoIXJvdy5pbmNsdWRlcyhudWxsKSl7XG4gICAgICAgICAgICAgICAgY291bnQgKz0gMVxuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkLmJvYXJkW2Jsb2NrLnBvc1swXV1bYmxvY2sucG9zWzFdXSA9IG51bGxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGlkeCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuYm9hcmRbaV0uZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcFN0ZXAoYmxvY2spXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgc3dpdGNoKGNvdW50KXtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDEwMCAqIHRoaXMubGV2ZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMzAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSA1MDAgKiB0aGlzLmxldmVsXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDgwMCAqIHRoaXMubGV2ZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gICAgZHJvcFN0ZXAoYmxvY2spe1xuICAgICAgICB0aGlzLmdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICBibG9jay51cGRhdGVQb3MoW2Jsb2NrLnBvc1swXSArIDEsIGJsb2NrLnBvc1sxXV0sIHRoaXMuZ3JpZClcbiAgICB9XG5cbiAgICByb3RhdGVBY3RpdmVQaWVjZShkaXIpe1xuICAgICAgICB0aGlzLmN1cnJlbnQucm90YXRlKHRoaXMuZ3JpZCwgZGlyKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSdcbmltcG9ydCBrZXkgZnJvbSAna2V5bWFzdGVyJ1xuXG5jbGFzcyBHYW1lVmlld3tcbiAgICBjb25zdHJ1Y3RvcihjdHgsIGhfY3R4LCBuX2N0eCwgc19jdHgpe1xuICAgICAgICB0aGlzLmN0eCA9IGN0eFxuICAgICAgICB0aGlzLmdhbWUgPSBuZXcgR2FtZSgpXG4gICAgICAgIHRoaXMuZHJhd0dyaWQoKVxuICAgICAgICB0aGlzLmhfY3R4ID0gaF9jdHhcbiAgICAgICAgdGhpcy5uX2N0eCA9IG5fY3R4XG4gICAgICAgIHRoaXMuc19jdHggPSBzX2N0eFxuICAgICAgICB0aGlzLnVwZGF0ZUhvbGQoKVxuICAgICAgICB0aGlzLnVwZGF0ZU5leHQoKVxuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKClcbiAgICB9XG5cbiAgICBzdGFydCgpe1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgdGhpcy5oX2N0eC5maWxsUmVjdCgwLCAwLCAyMDAsIDIwMClcbiAgICAgICAgaWYoIXRoaXMua2V5bWFwU2V0KXtcbiAgICAgICAgICAgIHRoaXMuc2V0S2V5TWFwKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdhbWUuc3RhcnQoKVxuICAgIH1cblxuICAgIHNldEtleU1hcCgpe1xuICAgICAgICB0aGlzLmtleW1hcFNldCA9IHRydWVcbiAgICAgICAga2V5KCdyaWdodCcsICgpID0+IHRoaXMuZ2FtZS5tb3ZlQWN0aXZlUGllY2UoWzAsIDFdKSlcbiAgICAgICAga2V5KCdsZWZ0JywgKCkgPT4gdGhpcy5nYW1lLm1vdmVBY3RpdmVQaWVjZShbMCwgLTFdKSlcbiAgICAgICAgbGV0IGdhbWVfdmlldyA9IHRoaXM7XG4gICAgICAgIGxldCBzcGVlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBzcGVlZFVwID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQwICYmIHNwZWVkID09PSBmYWxzZSAmJiB0aGlzLmdhbWUuZ3Jhdml0eSA+IDEwMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lLmdyYXZJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmRyb3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudXBkYXRlR3Jhdml0eSgxMDApO1xuICAgICAgICAgICAgICAgIHNwZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzbG93RG93biA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0MCAmJiB0aGlzLmdhbWUuZ3Jhdml0eSA+IDEwMCAmJiBzcGVlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5nYW1lLmdyYXZJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnVwZGF0ZUdyYXZpdHkodGhpcy5nYW1lLmdyYXZpdHkpO1xuICAgICAgICAgICAgICAgIHNwZWVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFzdERyb3AgPSB0aHJvdHRsZWQoZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZmFzdERyb3AoKVxuICAgICAgICB9LCAyNTApXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBzcGVlZFVwKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHNsb3dEb3duKVxuICAgICAgICBrZXkoJ3gnLCAoKSA9PiB0aGlzLmdhbWUucm90YXRlQWN0aXZlUGllY2UoMSkpXG4gICAgICAgIGtleSgneicsICgpID0+IHRoaXMuZ2FtZS5yb3RhdGVBY3RpdmVQaWVjZSgtMSkpXG4gICAgICAgIGtleSgndXAnLCAoKSA9PiB0aGlzLmdhbWUucm90YXRlQWN0aXZlUGllY2UoMSkpXG4gICAgICAgIGtleSgnYycsICgpID0+IHRoaXMuZ2FtZS5ob2xkUGllY2UoKSk7XG4gICAgICAgIGtleSgnc3BhY2UnLCBmYXN0RHJvcClcbiAgICB9XG5cbiAgICB1cGRhdGUoKXtcbiAgICAgICAgdGhpcy5kcmF3R3JpZCgpXG4gICAgICAgIGlmKHRoaXMuZ2FtZS5jdXJyZW50KXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5naG9zdFBpZWNlKCkuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdHaG9zdCh0aGlzLmN0eCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5ncmlkLmJvYXJkLmZvckVhY2gocm93ID0+IHtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBpZihibG9jayl7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmRyYXdCbG9jayh0aGlzLmN0eCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy51cGRhdGVIb2xkKClcbiAgICAgICAgdGhpcy51cGRhdGVOZXh0KClcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpXG4gICAgfVxuXG4gICAgdXBkYXRlSG9sZCgpe1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgdGhpcy5oX2N0eC5maWxsUmVjdCgwLCAwLCAyMDAsIDIwMClcbiAgICAgICAgdGhpcy5oX2N0eC5mb250ID0gXCIyOHB4IEFyaWFsXCJcbiAgICAgICAgdGhpcy5oX2N0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFRleHQoYEhvbGRgLCA1MCwgNDAsIDE0MClcbiAgICAgICAgaWYodGhpcy5nYW1lLmhvbGQpe1xuICAgICAgICAgICAgbGV0IG5ld0hvbGRcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWUuaG9sZC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9cIil7XG4gICAgICAgICAgICAgICAgbmV3SG9sZCA9IG5ldyB0aGlzLmdhbWUuaG9sZC5jb25zdHJ1Y3RvcihbMywgMS41XSlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJJXCIpe1xuICAgICAgICAgICAgICAgIG5ld0hvbGQgPSBuZXcgdGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IoWzIuNSwgMS41XSlcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIG5ld0hvbGQgPSBuZXcgdGhpcy5nYW1lLmhvbGQuY29uc3RydWN0b3IoWzMsIDJdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3SG9sZC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgYmxvY2suZHJhd0Jsb2NrKHRoaXMuaF9jdHgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlTmV4dCgpe1xuICAgICAgICB0aGlzLm5fY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgdGhpcy5uX2N0eC5maWxsUmVjdCgwLCAwLCA2MDAsIDYwMClcbiAgICAgICAgbGV0IGlkeFxuICAgICAgICBsZXQgbmV3TmV4dFxuICAgICAgICBmb3IobGV0IGkgPSAyOyBpIDwgOTsgaSArPSAzKXtcbiAgICAgICAgICAgIGlkeCA9IChpIC0gMikgLyAzXG4gICAgICAgICAgICBpZiAodGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9cIiB8fCB0aGlzLmdhbWUubmV4dFtpZHhdLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiSVwiKSB7XG4gICAgICAgICAgICAgICAgbmV3TmV4dCA9IG5ldyB0aGlzLmdhbWUubmV4dFtpZHhdLmNvbnN0cnVjdG9yKFtpLCAxLjVdKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdOZXh0ID0gbmV3IHRoaXMuZ2FtZS5uZXh0W2lkeF0uY29uc3RydWN0b3IoW2ksIDJdKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3TmV4dC5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgYmxvY2suZHJhd0Jsb2NrKHRoaXMubl9jdHgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlU2NvcmUoKXtcbiAgICAgICAgdGhpcy5zX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snXG4gICAgICAgIHRoaXMuc19jdHguZmlsbFJlY3QoMCwgMCwgNjAwLCA2MDApXG4gICAgICAgIHRoaXMuc19jdHguZm9udCA9ICcyMHB4IEFyaWFsJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICAgICAgdGhpcy5zX2N0eC5maWxsVGV4dChgc2NvcmU6ICR7dGhpcy5nYW1lLnNjb3JlfWAsIDIwLCA1NiwgMTQwKVxuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBsaW5lczogJHt0aGlzLmdhbWUubGluZXN9YCwgMjAsIDExMiwgMTgwKVxuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBsZXZlbDogJHt0aGlzLmdhbWUubGV2ZWx9YCwgMjAsIDE2OCwgMTgwKVxuICAgIH1cblxuICAgIGRyYXdHcmlkKCl7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCA1MDAsIDgwMClcbiAgICAgICAgZm9yKGxldCBpID0gMzI7IGkgPD0gMzIwOyBpICs9IDMyKXtcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJncmF5XCJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9ICcxJ1xuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhpLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpLCA4MDApO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGogPSAzMjsgaiA8PSA2NDA7IGogKz0gMzIpe1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIlxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBqKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyg0MDAsIGopO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlZChmbiwgZGVsYXkpIHtcbiAgICBsZXQgbGFzdENhbGwgPSAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjb25zdCBub3cgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKG5vdyAtIGxhc3RDYWxsIDwgZGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbCA9IG5vdztcbiAgICAgICAgcmV0dXJuIGZuKC4uLmFyZ3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZVZpZXciLCJjbGFzcyBHcmlke1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBbXVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgMjA7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnB1c2gobmV3IEFycmF5KCkpXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpXS5wdXNoKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdXBkYXRlUGllY2UodGV0cmltaW5vKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gYmxvY2tcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlKHRldHJpbWlubywgZGlyKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICB9KVxuICAgICAgICB0ZXRyaW1pbm8ubW92ZShkaXIsIHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBpZWNlKHRldHJpbWlubylcbiAgICB9XG5cbiAgICBibG9ja09jY3VwaWVkKHBvcyl7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc1swXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gIT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvY2N1cGllZChwb3MsIHRldHJpbWlubykge1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmIChibG9jay5wb3NbMF0gPT09IHBvc1swXSAmJiBibG9jay5wb3NbMV0gPT09IHBvc1sxXSkge1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZighaXNPY2N1cGllZCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmJvYXJkW3Bvc1swXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSAhPT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JpZCIsImltcG9ydCBHYW1lVmlldyBmcm9tICcuL2dhbWVfdmlldydcbmltcG9ydCBrZXkgZnJvbSAna2V5bWFzdGVyJ1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jYW52YXNcIik7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjb25zdCBzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtYnV0dG9uJylcbiAgICBjb25zdCBzdGFydF9tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1tb2RhbC1iYWNrZ3JvdW5kJylcbiAgICBjb25zdCByZXN0YXJ0X21vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQtbW9kYWwtYmFja2dyb3VuZCcpXG4gICAgY29uc3QgcmVzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydC1idXR0b24nKVxuICAgIGNvbnN0IGhvbGRfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob2xkLWNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBjb25zdCBuZXh0X2N0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV4dC1jYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgY29uc3Qgc2NvcmVfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlLWNhbnZhcycpLmdldENvbnRleHQoXCIyZFwiKVxuICAgIGxldCBnYW1lX3ZpZXcgPSBuZXcgR2FtZVZpZXcoY3R4LCBob2xkX2N0eCwgbmV4dF9jdHgsIHNjb3JlX2N0eCk7XG4gICAgc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIHN0YXJ0X21vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgZ2FtZV92aWV3LnN0YXJ0KClcbiAgICAgICAgbGV0IGdhbWVQbGF5ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZV92aWV3LnVwZGF0ZSgpXG4gICAgICAgICAgICBpZiAoIWdhbWVfdmlldy5nYW1lLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVQbGF5KVxuICAgICAgICAgICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTYpXG4gICAgfSlcblxuICAgIHJlc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGdhbWVfdmlldy5nYW1lLm5ld1N0YXJ0KCk7XG4gICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBnYW1lX3ZpZXcuc3RhcnQoKVxuICAgICAgICBsZXQgZ2FtZVBsYXkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBnYW1lX3ZpZXcudXBkYXRlKClcbiAgICAgICAgICAgIGlmICghZ2FtZV92aWV3LmdhbWUucGxheWluZykge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZVBsYXkpXG4gICAgICAgICAgICAgICAgcmVzdGFydF9tb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxNilcbiAgICB9KVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=