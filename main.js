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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2tleW1hc3Rlci9rZXltYXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Jsb2Nrcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZV92aWV3LmpzIiwid2VicGFjazovLy8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBOztBQUVBLENBQUM7QUFDRDtBQUNBLGtCQUFrQjtBQUNsQixhQUFhLDZDQUE2QztBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsdUU7Ozs7Ozs7Ozs7OztBQzdKZjtBQUFBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsbUU7Ozs7Ozs7Ozs7OztBQ3REZjtBQUFBO0FBQUE7QUFBQTtBQUFrQztBQUNQOztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrREFBUTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQyIsImZpbGUiOiIuL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIi8vICAgICBrZXltYXN0ZXIuanNcbi8vICAgICAoYykgMjAxMS0yMDEzIFRob21hcyBGdWNoc1xuLy8gICAgIGtleW1hc3Rlci5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuOyhmdW5jdGlvbihnbG9iYWwpe1xuICB2YXIgayxcbiAgICBfaGFuZGxlcnMgPSB7fSxcbiAgICBfbW9kcyA9IHsgMTY6IGZhbHNlLCAxODogZmFsc2UsIDE3OiBmYWxzZSwgOTE6IGZhbHNlIH0sXG4gICAgX3Njb3BlID0gJ2FsbCcsXG4gICAgLy8gbW9kaWZpZXIga2V5c1xuICAgIF9NT0RJRklFUlMgPSB7XG4gICAgICAn4oenJzogMTYsIHNoaWZ0OiAxNixcbiAgICAgICfijKUnOiAxOCwgYWx0OiAxOCwgb3B0aW9uOiAxOCxcbiAgICAgICfijIMnOiAxNywgY3RybDogMTcsIGNvbnRyb2w6IDE3LFxuICAgICAgJ+KMmCc6IDkxLCBjb21tYW5kOiA5MVxuICAgIH0sXG4gICAgLy8gc3BlY2lhbCBrZXlzXG4gICAgX01BUCA9IHtcbiAgICAgIGJhY2tzcGFjZTogOCwgdGFiOiA5LCBjbGVhcjogMTIsXG4gICAgICBlbnRlcjogMTMsICdyZXR1cm4nOiAxMyxcbiAgICAgIGVzYzogMjcsIGVzY2FwZTogMjcsIHNwYWNlOiAzMixcbiAgICAgIGxlZnQ6IDM3LCB1cDogMzgsXG4gICAgICByaWdodDogMzksIGRvd246IDQwLFxuICAgICAgZGVsOiA0NiwgJ2RlbGV0ZSc6IDQ2LFxuICAgICAgaG9tZTogMzYsIGVuZDogMzUsXG4gICAgICBwYWdldXA6IDMzLCBwYWdlZG93bjogMzQsXG4gICAgICAnLCc6IDE4OCwgJy4nOiAxOTAsICcvJzogMTkxLFxuICAgICAgJ2AnOiAxOTIsICctJzogMTg5LCAnPSc6IDE4NyxcbiAgICAgICc7JzogMTg2LCAnXFwnJzogMjIyLFxuICAgICAgJ1snOiAyMTksICddJzogMjIxLCAnXFxcXCc6IDIyMFxuICAgIH0sXG4gICAgY29kZSA9IGZ1bmN0aW9uKHgpe1xuICAgICAgcmV0dXJuIF9NQVBbeF0gfHwgeC50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XG4gICAgfSxcbiAgICBfZG93bktleXMgPSBbXTtcblxuICBmb3Ioaz0xO2s8MjA7aysrKSBfTUFQWydmJytrXSA9IDExMStrO1xuXG4gIC8vIElFIGRvZXNuJ3Qgc3VwcG9ydCBBcnJheSNpbmRleE9mLCBzbyBoYXZlIGEgc2ltcGxlIHJlcGxhY2VtZW50XG4gIGZ1bmN0aW9uIGluZGV4KGFycmF5LCBpdGVtKXtcbiAgICB2YXIgaSA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZShpLS0pIGlmKGFycmF5W2ldPT09aXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLy8gZm9yIGNvbXBhcmluZyBtb2RzIGJlZm9yZSB1bmFzc2lnbm1lbnRcbiAgZnVuY3Rpb24gY29tcGFyZUFycmF5KGExLCBhMikge1xuICAgIGlmIChhMS5sZW5ndGggIT0gYTIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhMS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYTFbaV0gIT09IGEyW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG1vZGlmaWVyTWFwID0ge1xuICAgICAgMTY6J3NoaWZ0S2V5JyxcbiAgICAgIDE4OidhbHRLZXknLFxuICAgICAgMTc6J2N0cmxLZXknLFxuICAgICAgOTE6J21ldGFLZXknXG4gIH07XG4gIGZ1bmN0aW9uIHVwZGF0ZU1vZGlmaWVyS2V5KGV2ZW50KSB7XG4gICAgICBmb3IoayBpbiBfbW9kcykgX21vZHNba10gPSBldmVudFttb2RpZmllck1hcFtrXV07XG4gIH07XG5cbiAgLy8gaGFuZGxlIGtleWRvd24gZXZlbnRcbiAgZnVuY3Rpb24gZGlzcGF0Y2goZXZlbnQpIHtcbiAgICB2YXIga2V5LCBoYW5kbGVyLCBrLCBpLCBtb2RpZmllcnNNYXRjaCwgc2NvcGU7XG4gICAga2V5ID0gZXZlbnQua2V5Q29kZTtcblxuICAgIGlmIChpbmRleChfZG93bktleXMsIGtleSkgPT0gLTEpIHtcbiAgICAgICAgX2Rvd25LZXlzLnB1c2goa2V5KTtcbiAgICB9XG5cbiAgICAvLyBpZiBhIG1vZGlmaWVyIGtleSwgc2V0IHRoZSBrZXkuPG1vZGlmaWVya2V5bmFtZT4gcHJvcGVydHkgdG8gdHJ1ZSBhbmQgcmV0dXJuXG4gICAgaWYoa2V5ID09IDkzIHx8IGtleSA9PSAyMjQpIGtleSA9IDkxOyAvLyByaWdodCBjb21tYW5kIG9uIHdlYmtpdCwgY29tbWFuZCBvbiBHZWNrb1xuICAgIGlmKGtleSBpbiBfbW9kcykge1xuICAgICAgX21vZHNba2V5XSA9IHRydWU7XG4gICAgICAvLyAnYXNzaWduS2V5JyBmcm9tIGluc2lkZSB0aGlzIGNsb3N1cmUgaXMgZXhwb3J0ZWQgdG8gd2luZG93LmtleVxuICAgICAgZm9yKGsgaW4gX01PRElGSUVSUykgaWYoX01PRElGSUVSU1trXSA9PSBrZXkpIGFzc2lnbktleVtrXSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZU1vZGlmaWVyS2V5KGV2ZW50KTtcblxuICAgIC8vIHNlZSBpZiB3ZSBuZWVkIHRvIGlnbm9yZSB0aGUga2V5cHJlc3MgKGZpbHRlcigpIGNhbiBjYW4gYmUgb3ZlcnJpZGRlbilcbiAgICAvLyBieSBkZWZhdWx0IGlnbm9yZSBrZXkgcHJlc3NlcyBpZiBhIHNlbGVjdCwgdGV4dGFyZWEsIG9yIGlucHV0IGlzIGZvY3VzZWRcbiAgICBpZighYXNzaWduS2V5LmZpbHRlci5jYWxsKHRoaXMsIGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgLy8gYWJvcnQgaWYgbm8gcG90ZW50aWFsbHkgbWF0Y2hpbmcgc2hvcnRjdXRzIGZvdW5kXG4gICAgaWYgKCEoa2V5IGluIF9oYW5kbGVycykpIHJldHVybjtcblxuICAgIHNjb3BlID0gZ2V0U2NvcGUoKTtcblxuICAgIC8vIGZvciBlYWNoIHBvdGVudGlhbCBzaG9ydGN1dFxuICAgIGZvciAoaSA9IDA7IGkgPCBfaGFuZGxlcnNba2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgaGFuZGxlciA9IF9oYW5kbGVyc1trZXldW2ldO1xuXG4gICAgICAvLyBzZWUgaWYgaXQncyBpbiB0aGUgY3VycmVudCBzY29wZVxuICAgICAgaWYoaGFuZGxlci5zY29wZSA9PSBzY29wZSB8fCBoYW5kbGVyLnNjb3BlID09ICdhbGwnKXtcbiAgICAgICAgLy8gY2hlY2sgaWYgbW9kaWZpZXJzIG1hdGNoIGlmIGFueVxuICAgICAgICBtb2RpZmllcnNNYXRjaCA9IGhhbmRsZXIubW9kcy5sZW5ndGggPiAwO1xuICAgICAgICBmb3IoayBpbiBfbW9kcylcbiAgICAgICAgICBpZigoIV9tb2RzW2tdICYmIGluZGV4KGhhbmRsZXIubW9kcywgK2spID4gLTEpIHx8XG4gICAgICAgICAgICAoX21vZHNba10gJiYgaW5kZXgoaGFuZGxlci5tb2RzLCAraykgPT0gLTEpKSBtb2RpZmllcnNNYXRjaCA9IGZhbHNlO1xuICAgICAgICAvLyBjYWxsIHRoZSBoYW5kbGVyIGFuZCBzdG9wIHRoZSBldmVudCBpZiBuZWNjZXNzYXJ5XG4gICAgICAgIGlmKChoYW5kbGVyLm1vZHMubGVuZ3RoID09IDAgJiYgIV9tb2RzWzE2XSAmJiAhX21vZHNbMThdICYmICFfbW9kc1sxN10gJiYgIV9tb2RzWzkxXSkgfHwgbW9kaWZpZXJzTWF0Y2gpe1xuICAgICAgICAgIGlmKGhhbmRsZXIubWV0aG9kKGV2ZW50LCBoYW5kbGVyKT09PWZhbHNlKXtcbiAgICAgICAgICAgIGlmKGV2ZW50LnByZXZlbnREZWZhdWx0KSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICBlbHNlIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBpZihldmVudC5zdG9wUHJvcGFnYXRpb24pIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgaWYoZXZlbnQuY2FuY2VsQnViYmxlKSBldmVudC5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyB1bnNldCBtb2RpZmllciBrZXlzIG9uIGtleXVwXG4gIGZ1bmN0aW9uIGNsZWFyTW9kaWZpZXIoZXZlbnQpe1xuICAgIHZhciBrZXkgPSBldmVudC5rZXlDb2RlLCBrLFxuICAgICAgICBpID0gaW5kZXgoX2Rvd25LZXlzLCBrZXkpO1xuXG4gICAgLy8gcmVtb3ZlIGtleSBmcm9tIF9kb3duS2V5c1xuICAgIGlmIChpID49IDApIHtcbiAgICAgICAgX2Rvd25LZXlzLnNwbGljZShpLCAxKTtcbiAgICB9XG5cbiAgICBpZihrZXkgPT0gOTMgfHwga2V5ID09IDIyNCkga2V5ID0gOTE7XG4gICAgaWYoa2V5IGluIF9tb2RzKSB7XG4gICAgICBfbW9kc1trZXldID0gZmFsc2U7XG4gICAgICBmb3IoayBpbiBfTU9ESUZJRVJTKSBpZihfTU9ESUZJRVJTW2tdID09IGtleSkgYXNzaWduS2V5W2tdID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHJlc2V0TW9kaWZpZXJzKCkge1xuICAgIGZvcihrIGluIF9tb2RzKSBfbW9kc1trXSA9IGZhbHNlO1xuICAgIGZvcihrIGluIF9NT0RJRklFUlMpIGFzc2lnbktleVtrXSA9IGZhbHNlO1xuICB9O1xuXG4gIC8vIHBhcnNlIGFuZCBhc3NpZ24gc2hvcnRjdXRcbiAgZnVuY3Rpb24gYXNzaWduS2V5KGtleSwgc2NvcGUsIG1ldGhvZCl7XG4gICAgdmFyIGtleXMsIG1vZHM7XG4gICAga2V5cyA9IGdldEtleXMoa2V5KTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1ldGhvZCA9IHNjb3BlO1xuICAgICAgc2NvcGUgPSAnYWxsJztcbiAgICB9XG5cbiAgICAvLyBmb3IgZWFjaCBzaG9ydGN1dFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gc2V0IG1vZGlmaWVyIGtleXMgaWYgYW55XG4gICAgICBtb2RzID0gW107XG4gICAgICBrZXkgPSBrZXlzW2ldLnNwbGl0KCcrJyk7XG4gICAgICBpZiAoa2V5Lmxlbmd0aCA+IDEpe1xuICAgICAgICBtb2RzID0gZ2V0TW9kcyhrZXkpO1xuICAgICAgICBrZXkgPSBba2V5W2tleS5sZW5ndGgtMV1dO1xuICAgICAgfVxuICAgICAgLy8gY29udmVydCB0byBrZXljb2RlIGFuZC4uLlxuICAgICAga2V5ID0ga2V5WzBdXG4gICAgICBrZXkgPSBjb2RlKGtleSk7XG4gICAgICAvLyAuLi5zdG9yZSBoYW5kbGVyXG4gICAgICBpZiAoIShrZXkgaW4gX2hhbmRsZXJzKSkgX2hhbmRsZXJzW2tleV0gPSBbXTtcbiAgICAgIF9oYW5kbGVyc1trZXldLnB1c2goeyBzaG9ydGN1dDoga2V5c1tpXSwgc2NvcGU6IHNjb3BlLCBtZXRob2Q6IG1ldGhvZCwga2V5OiBrZXlzW2ldLCBtb2RzOiBtb2RzIH0pO1xuICAgIH1cbiAgfTtcblxuICAvLyB1bmJpbmQgYWxsIGhhbmRsZXJzIGZvciBnaXZlbiBrZXkgaW4gY3VycmVudCBzY29wZVxuICBmdW5jdGlvbiB1bmJpbmRLZXkoa2V5LCBzY29wZSkge1xuICAgIHZhciBtdWx0aXBsZUtleXMsIGtleXMsXG4gICAgICBtb2RzID0gW10sXG4gICAgICBpLCBqLCBvYmo7XG5cbiAgICBtdWx0aXBsZUtleXMgPSBnZXRLZXlzKGtleSk7XG5cbiAgICBmb3IgKGogPSAwOyBqIDwgbXVsdGlwbGVLZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICBrZXlzID0gbXVsdGlwbGVLZXlzW2pdLnNwbGl0KCcrJyk7XG5cbiAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbW9kcyA9IGdldE1vZHMoa2V5cyk7XG4gICAgICAgIGtleSA9IGtleXNba2V5cy5sZW5ndGggLSAxXTtcbiAgICAgIH1cblxuICAgICAga2V5ID0gY29kZShrZXkpO1xuXG4gICAgICBpZiAoc2NvcGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzY29wZSA9IGdldFNjb3BlKCk7XG4gICAgICB9XG4gICAgICBpZiAoIV9oYW5kbGVyc1trZXldKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBfaGFuZGxlcnNba2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICBvYmogPSBfaGFuZGxlcnNba2V5XVtpXTtcbiAgICAgICAgLy8gb25seSBjbGVhciBoYW5kbGVycyBpZiBjb3JyZWN0IHNjb3BlIGFuZCBtb2RzIG1hdGNoXG4gICAgICAgIGlmIChvYmouc2NvcGUgPT09IHNjb3BlICYmIGNvbXBhcmVBcnJheShvYmoubW9kcywgbW9kcykpIHtcbiAgICAgICAgICBfaGFuZGxlcnNba2V5XVtpXSA9IHt9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiB0aGUga2V5IHdpdGggY29kZSAna2V5Q29kZScgaXMgY3VycmVudGx5IGRvd25cbiAgLy8gQ29udmVydHMgc3RyaW5ncyBpbnRvIGtleSBjb2Rlcy5cbiAgZnVuY3Rpb24gaXNQcmVzc2VkKGtleUNvZGUpIHtcbiAgICAgIGlmICh0eXBlb2Yoa2V5Q29kZSk9PSdzdHJpbmcnKSB7XG4gICAgICAgIGtleUNvZGUgPSBjb2RlKGtleUNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4KF9kb3duS2V5cywga2V5Q29kZSkgIT0gLTE7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQcmVzc2VkS2V5Q29kZXMoKSB7XG4gICAgICByZXR1cm4gX2Rvd25LZXlzLnNsaWNlKDApO1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsdGVyKGV2ZW50KXtcbiAgICB2YXIgdGFnTmFtZSA9IChldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudCkudGFnTmFtZTtcbiAgICAvLyBpZ25vcmUga2V5cHJlc3NlZCBpbiBhbnkgZWxlbWVudHMgdGhhdCBzdXBwb3J0IGtleWJvYXJkIGRhdGEgaW5wdXRcbiAgICByZXR1cm4gISh0YWdOYW1lID09ICdJTlBVVCcgfHwgdGFnTmFtZSA9PSAnU0VMRUNUJyB8fCB0YWdOYW1lID09ICdURVhUQVJFQScpO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSBrZXkuPG1vZGlmaWVyPiB0byBmYWxzZVxuICBmb3IoayBpbiBfTU9ESUZJRVJTKSBhc3NpZ25LZXlba10gPSBmYWxzZTtcblxuICAvLyBzZXQgY3VycmVudCBzY29wZSAoZGVmYXVsdCAnYWxsJylcbiAgZnVuY3Rpb24gc2V0U2NvcGUoc2NvcGUpeyBfc2NvcGUgPSBzY29wZSB8fCAnYWxsJyB9O1xuICBmdW5jdGlvbiBnZXRTY29wZSgpeyByZXR1cm4gX3Njb3BlIHx8ICdhbGwnIH07XG5cbiAgLy8gZGVsZXRlIGFsbCBoYW5kbGVycyBmb3IgYSBnaXZlbiBzY29wZVxuICBmdW5jdGlvbiBkZWxldGVTY29wZShzY29wZSl7XG4gICAgdmFyIGtleSwgaGFuZGxlcnMsIGk7XG5cbiAgICBmb3IgKGtleSBpbiBfaGFuZGxlcnMpIHtcbiAgICAgIGhhbmRsZXJzID0gX2hhbmRsZXJzW2tleV07XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaGFuZGxlcnMubGVuZ3RoOyApIHtcbiAgICAgICAgaWYgKGhhbmRsZXJzW2ldLnNjb3BlID09PSBzY29wZSkgaGFuZGxlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICBlbHNlIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gYWJzdHJhY3Qga2V5IGxvZ2ljIGZvciBhc3NpZ24gYW5kIHVuYXNzaWduXG4gIGZ1bmN0aW9uIGdldEtleXMoa2V5KSB7XG4gICAgdmFyIGtleXM7XG4gICAga2V5ID0ga2V5LnJlcGxhY2UoL1xccy9nLCAnJyk7XG4gICAga2V5cyA9IGtleS5zcGxpdCgnLCcpO1xuICAgIGlmICgoa2V5c1trZXlzLmxlbmd0aCAtIDFdKSA9PSAnJykge1xuICAgICAga2V5c1trZXlzLmxlbmd0aCAtIDJdICs9ICcsJztcbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cblxuICAvLyBhYnN0cmFjdCBtb2RzIGxvZ2ljIGZvciBhc3NpZ24gYW5kIHVuYXNzaWduXG4gIGZ1bmN0aW9uIGdldE1vZHMoa2V5KSB7XG4gICAgdmFyIG1vZHMgPSBrZXkuc2xpY2UoMCwga2V5Lmxlbmd0aCAtIDEpO1xuICAgIGZvciAodmFyIG1pID0gMDsgbWkgPCBtb2RzLmxlbmd0aDsgbWkrKylcbiAgICBtb2RzW21pXSA9IF9NT0RJRklFUlNbbW9kc1ttaV1dO1xuICAgIHJldHVybiBtb2RzO1xuICB9XG5cbiAgLy8gY3Jvc3MtYnJvd3NlciBldmVudHNcbiAgZnVuY3Rpb24gYWRkRXZlbnQob2JqZWN0LCBldmVudCwgbWV0aG9kKSB7XG4gICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG1ldGhvZCwgZmFsc2UpO1xuICAgIGVsc2UgaWYob2JqZWN0LmF0dGFjaEV2ZW50KVxuICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KCdvbicrZXZlbnQsIGZ1bmN0aW9uKCl7IG1ldGhvZCh3aW5kb3cuZXZlbnQpIH0pO1xuICB9O1xuXG4gIC8vIHNldCB0aGUgaGFuZGxlcnMgZ2xvYmFsbHkgb24gZG9jdW1lbnRcbiAgYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgZnVuY3Rpb24oZXZlbnQpIHsgZGlzcGF0Y2goZXZlbnQpIH0pOyAvLyBQYXNzaW5nIF9zY29wZSB0byBhIGNhbGxiYWNrIHRvIGVuc3VyZSBpdCByZW1haW5zIHRoZSBzYW1lIGJ5IGV4ZWN1dGlvbi4gRml4ZXMgIzQ4XG4gIGFkZEV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCBjbGVhck1vZGlmaWVyKTtcblxuICAvLyByZXNldCBtb2RpZmllcnMgdG8gZmFsc2Ugd2hlbmV2ZXIgdGhlIHdpbmRvdyBpcyAocmUpZm9jdXNlZC5cbiAgYWRkRXZlbnQod2luZG93LCAnZm9jdXMnLCByZXNldE1vZGlmaWVycyk7XG5cbiAgLy8gc3RvcmUgcHJldmlvdXNseSBkZWZpbmVkIGtleVxuICB2YXIgcHJldmlvdXNLZXkgPSBnbG9iYWwua2V5O1xuXG4gIC8vIHJlc3RvcmUgcHJldmlvdXNseSBkZWZpbmVkIGtleSBhbmQgcmV0dXJuIHJlZmVyZW5jZSB0byBvdXIga2V5IG9iamVjdFxuICBmdW5jdGlvbiBub0NvbmZsaWN0KCkge1xuICAgIHZhciBrID0gZ2xvYmFsLmtleTtcbiAgICBnbG9iYWwua2V5ID0gcHJldmlvdXNLZXk7XG4gICAgcmV0dXJuIGs7XG4gIH1cblxuICAvLyBzZXQgd2luZG93LmtleSBhbmQgd2luZG93LmtleS5zZXQvZ2V0L2RlbGV0ZVNjb3BlLCBhbmQgdGhlIGRlZmF1bHQgZmlsdGVyXG4gIGdsb2JhbC5rZXkgPSBhc3NpZ25LZXk7XG4gIGdsb2JhbC5rZXkuc2V0U2NvcGUgPSBzZXRTY29wZTtcbiAgZ2xvYmFsLmtleS5nZXRTY29wZSA9IGdldFNjb3BlO1xuICBnbG9iYWwua2V5LmRlbGV0ZVNjb3BlID0gZGVsZXRlU2NvcGU7XG4gIGdsb2JhbC5rZXkuZmlsdGVyID0gZmlsdGVyO1xuICBnbG9iYWwua2V5LmlzUHJlc3NlZCA9IGlzUHJlc3NlZDtcbiAgZ2xvYmFsLmtleS5nZXRQcmVzc2VkS2V5Q29kZXMgPSBnZXRQcmVzc2VkS2V5Q29kZXM7XG4gIGdsb2JhbC5rZXkubm9Db25mbGljdCA9IG5vQ29uZmxpY3Q7XG4gIGdsb2JhbC5rZXkudW5iaW5kID0gdW5iaW5kS2V5O1xuXG4gIGlmKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGFzc2lnbktleTtcblxufSkodGhpcyk7XG4iLCJleHBvcnQgY2xhc3MgQmxvY2t7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIHRoaXMucG9zID0gb3B0aW9ucy5wb3M7XG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRpb25zLmNvbG9yXG4gICAgfVxuXG4gICAgdXBkYXRlUG9zKG1vdmUsIGdyaWQpe1xuICAgICAgICB0aGlzLnBvcyA9IFttb3ZlWzBdLCBtb3ZlWzFdXVxuICAgICAgICBncmlkLmJvYXJkW3RoaXMucG9zWzBdXVt0aGlzLnBvc1sxXV0gPSB0aGlzXG4gICAgfVxuXG4gICAgZHJhd0Jsb2NrKGN0eCkge1xuICAgICAgICBsZXQgbmV3UG9zID0gW3RoaXMucG9zWzBdICogMzIsIHRoaXMucG9zWzFdICogMzJdO1xuICAgICAgICBsZXQgZ3JhZCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudChuZXdQb3NbMV0sIG5ld1Bvc1swXSwgbmV3UG9zWzFdICsgMzIsIG5ld1Bvc1swXSArIDMyKTtcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgdGhpcy5jb2xvcik7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAuMzUsIHRoaXMuY29sb3IpO1xuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsMjU1LDI1NSwxKScpO1xuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xuICAgICAgICBjdHguZmlsbFJlY3QobmV3UG9zWzFdLCBuZXdQb3NbMF0sIDMyLCAzMilcbiAgICB9XG5cbiAgICBkcmF3R2hvc3QoY3R4KXtcbiAgICAgICAgbGV0IG5ld1BvcyA9IFt0aGlzLnBvc1swXSAqIDMyLCB0aGlzLnBvc1sxXSAqIDMyXTtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gJzInXG4gICAgICAgIGN0eC5yZWN0KG5ld1Bvc1sxXSsxLCBuZXdQb3NbMF0rMSwgMzAsIDMwKVxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgbW92ZUdob3N0KCl7XG4gICAgICAgIHRoaXMucG9zID0gW3RoaXMucG9zWzBdICsgMSwgdGhpcy5wb3NbMV1dO1xuICAgIH1cblxuICAgIGVyYXNlQmxvY2soY3R4KXtcbiAgICAgICAgbGV0IG5ld1BvcyA9IFt0aGlzLnBvc1swXSAqIDMyLCB0aGlzLnBvc1sxXSAqIDMyXTtcbiAgICAgICAgY3R4LmNsZWFyUmVjdChuZXdQb3NbMV0sIG5ld1Bvc1swXSwgMzIsIDMyKVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsLCBwYXR0ZXJuLCBjb2xvcil7XG4gICAgICAgIHRoaXMuYmxvY2tzID0gW107XG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSAndXAnXG4gICAgICAgIHBhdHRlcm4uZm9yRWFjaChwb3MgPT4ge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3MucHVzaChuZXcgQmxvY2soe3BvczogW2luaXRpYWxbMF0gKyBwb3NbMF0sIGluaXRpYWxbMV0gKyBwb3NbMV1dLCBjb2xvcjogY29sb3J9KSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlKGRpciwgZ3JpZCl7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuXG4gICAgICAgICAgICBibG9jay51cGRhdGVQb3MoW2Jsb2NrLnBvc1swXSArIGRpclswXSwgYmxvY2sucG9zWzFdICsgZGlyWzFdXSwgZ3JpZClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBkcmF3KGN0eCl7XG4gICAgICAgIHRoaXMuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgYmxvY2suZHJhd0Jsb2NrKGN0eCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcm90YXRlKGdyaWQsIGRpcikge1xuICAgICAgICBsZXQgbW92ZXMgPSBbXVxuICAgICAgICBsZXQgcGl2b3QgPSB0aGlzLmJsb2Nrc1swXS5wb3NcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChkaXIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WCA9IHBpdm90WzFdICsgcGl2b3RbMF0gLSB0aGlzLmJsb2Nrc1tpXS5wb3NbMF07XG4gICAgICAgICAgICAgICAgbGV0IG5ld1kgPSBwaXZvdFswXSAtIHBpdm90WzFdICsgdGhpcy5ibG9ja3NbaV0ucG9zWzFdO1xuICAgICAgICAgICAgICAgIGlmICghZ3JpZC5vY2N1cGllZChbbmV3WSwgbmV3WF0sIHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVzLnB1c2goW25ld1ksIG5ld1hdKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3WCA9IHBpdm90WzFdIC0gcGl2b3RbMF0gKyB0aGlzLmJsb2Nrc1tpXS5wb3NbMF07XG4gICAgICAgICAgICAgICAgbGV0IG5ld1kgPSBwaXZvdFswXSArIHBpdm90WzFdIC0gdGhpcy5ibG9ja3NbaV0ucG9zWzFdO1xuICAgICAgICAgICAgICAgIGlmICghZ3JpZC5vY2N1cGllZChbbmV3WSwgbmV3WF0sIHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVzLnB1c2goW25ld1ksIG5ld1hdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobW92ZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IGdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbClcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja3Nbal0udXBkYXRlUG9zKG1vdmVzW2otMV0sIGdyaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJsb2Nrc1swXS51cGRhdGVQb3MocGl2b3QsIGdyaWQpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpe1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFswLCAyXV0sICdsaWdodGJsdWUnKTtcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbMCwgMl1dXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVCBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKXtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWy0xLCAwXSwgWzAsIDFdXSwgJ3B1cnBsZScpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFswLCAxXV1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMIGV4dGVuZHMgVGV0cmltaW5ve1xuICAgIGNvbnN0cnVjdG9yKGluaXRpYWwpIHtcbiAgICAgICAgc3VwZXIoaW5pdGlhbCwgW1swLCAwXSwgWzAsIC0xXSwgWzAsIDFdLCBbLTEsIDFdXSwgJ29yYW5nZScpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAtMV0sIFswLCAxXSwgWy0xLCAxXV1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEogZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgLTFdXSwgJ2JsdWUnKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbMCwgMV0sIFstMSwgLTFdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE8gZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgMV0sIFstMSwgMF0sIFstMSwgMV1dLCAneWVsbG93JylcbiAgICAgICAgdGhpcy5wYXR0ZXJuID0gW1swLCAwXSwgWzAsIDFdLCBbLTEsIDBdLCBbLTEsIDFdXVxuICAgIH1cblxuICAgIHJvdGF0ZShncmlkLCBkaXIpe1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgUyBleHRlbmRzIFRldHJpbWlub3tcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsKSB7XG4gICAgICAgIHN1cGVyKGluaXRpYWwsIFtbMCwgMF0sIFswLCAtMV0sIFstMSwgMF0sIFstMSwgMV1dLCAnZ3JlZW4nKVxuICAgICAgICB0aGlzLnBhdHRlcm4gPSBbWzAsIDBdLCBbMCwgLTFdLCBbLTEsIDBdLCBbLTEsIDFdXVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFogZXh0ZW5kcyBUZXRyaW1pbm97XG4gICAgY29uc3RydWN0b3IoaW5pdGlhbCkge1xuICAgICAgICBzdXBlcihpbml0aWFsLCBbWzAsIDBdLCBbMCwgMV0sIFstMSwgLTFdLCBbLTEsIDBdXSwgJ3JlZCcpXG4gICAgICAgIHRoaXMucGF0dGVybiA9IFtbMCwgMF0sIFswLCAxXSwgWy0xLCAtMV0sIFstMSwgMF1dXG4gICAgfVxufSIsImltcG9ydCB7SSwgUywgTywgWiwgSiwgTCwgVH0gZnJvbSAnLi9ibG9ja3MnXG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnXG5cblxuY2xhc3MgR2FtZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmdyaWQgPSBuZXcgR3JpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50QmFnID0gdGhpcy5yYW5kb21CYWcoKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKVxuICAgICAgICB0aGlzLm5leHQgPSB0aGlzLmN1cnJlbnRCYWcuc3BsaWNlKDAsIDMpXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmxpbmVzID0gMFxuICAgICAgICB0aGlzLmdyYXZJbnRlcnZhbFxuICAgICAgICB0aGlzLmdyYXZDdXJ2ZSA9IFs3NTAsIDYwMCwgNDUwLCAzNTAsIDI3NSwgMjI1LCAxNzUsIDE0MCwgMTEwLCA5MCwgNzVdXG4gICAgICAgIHRoaXMuZ3JhdlRhYmxlID0gWzE1LCAzMCwgNDUsIDYwLCA3NSwgMTAwLCAxMjUsIDE1MCwgMTc1LCAyMDBdXG4gICAgICAgIHRoaXMubGV2ZWwgPSAxXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ3JhdkN1cnZlLnNoaWZ0KClcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbFxuICAgIH1cblxuICAgIHVwZGF0ZUdyYXZpdHkoZ3Jhdml0eSl7XG4gICAgICAgIHRoaXMuZ3JhdkludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcm9wKCk7XG4gICAgICAgIH0sIGdyYXZpdHkpXG4gICAgfVxuXG4gICAgZHJvcCgpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5vY2N1cGllZChbYmxvY2sucG9zWzBdICsgMSwgYmxvY2sucG9zWzFdXSwgdGhpcy5jdXJyZW50KSl7XG4gICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYoaXNPY2N1cGllZCl7XG4gICAgICAgICAgICB0aGlzLmNob29zZU5leHRQaWVjZSgpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5ncmlkLm1vdmUodGhpcy5jdXJyZW50LCBbMSwgMF0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzT2NjdXBpZWRcbiAgICB9XG5cbiAgICBmYXN0RHJvcCgpe1xuICAgICAgICB3aGlsZSghdGhpcy5kcm9wKCkpe1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaG9sZFBpZWNlKCl7XG4gICAgICAgIGlmKCF0aGlzLmhhc0hlbGQpe1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuaGFzSGVsZCA9IHRydWVcbiAgICAgICAgICAgIGlmKHRoaXMuaG9sZCl7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBcbiAgICAgICAgICAgICAgICB0ZW1wID0gdGhpcy5ob2xkXG4gICAgICAgICAgICAgICAgdGhpcy5ob2xkID0gdGhpcy5jdXJyZW50XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbmV3IHRlbXAuY29uc3RydWN0b3IoWzEsIDRdKVxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVQaWVjZSgpXG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5ob2xkID0gdGhpcy5jdXJyZW50XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudEJhZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmFnID0gdGhpcy5yYW5kb21CYWcoKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLm5leHQuc2hpZnQoKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQgPSB0aGlzLmN1cnJlbnRCYWcuc3BsaWNlKDAsIDMpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5uZXh0LnNoaWZ0KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0LnB1c2godGhpcy5jdXJyZW50QmFnLnNoaWZ0KCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVQaWVjZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByYW5kb21CYWcoKXtcbiAgICAgICAgbGV0IG5ld0JhZyA9IFtuZXcgVChbMSwgNF0pLCBuZXcgSShbMSwgNF0pLCBuZXcgTyhbMSwgNF0pLCBuZXcgSihbMSwgNF0pLCBuZXcgTChbMSwgNF0pLCBuZXcgUyhbMSwgNF0pLCBuZXcgWihbMSwgNF0pXVxuICAgICAgICBuZXdCYWcgPSB0aGlzLnNodWZmbGUobmV3QmFnKVxuICAgICAgICByZXR1cm4gbmV3QmFnXG4gICAgfVxuXG4gICAgc2h1ZmZsZShhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBhLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIFthW2ldLCBhW2pdXSA9IFthW2pdLCBhW2ldXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBjaG9vc2VOZXh0UGllY2UoKXtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICAgICAgICB0aGlzLmxpbmVzICs9IHRoaXMuZGlkQ2xlYXIoKVxuICAgICAgICBpZih0aGlzLmxpbmVzID49IHRoaXMuZ3JhdlRhYmxlW3RoaXMubGV2ZWwtMV0pe1xuICAgICAgICAgICAgdGhpcy5sZXZlbCArPSAxO1xuICAgICAgICAgICAgdGhpcy5ncmF2aXR5ID0gdGhpcy5ncmF2Q3VydmUuc2hpZnQoKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5ncmF2SW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdyYXZpdHkodGhpcy5ncmF2aXR5KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuY3VycmVudEJhZy5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50QmFnID0gdGhpcy5yYW5kb21CYWcoKVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5uZXh0LnNoaWZ0KClcbiAgICAgICAgICAgIHRoaXMubmV4dC5wdXNoKHRoaXMuY3VycmVudEJhZy5zaGlmdCgpKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubmV4dC5zaGlmdCgpXG4gICAgICAgICAgICB0aGlzLm5leHQucHVzaCh0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhc0hlbGQgPSBmYWxzZVxuICAgICAgICB0aGlzLmdlbmVyYXRlUGllY2UoKVxuICAgIH1cblxuICAgIHN0YXJ0KCl7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVQaWVjZSh0aGlzLmN1cnJlbnQpXG4gICAgICAgIHRoaXMudXBkYXRlR3Jhdml0eSh0aGlzLmdyYXZpdHkpXG4gICAgICAgIHRoaXMucGxheWluZyA9IHRydWVcbiAgICB9XG5cbiAgICBuZXdTdGFydCgpe1xuICAgICAgICB0aGlzLmdyaWQgPSBuZXcgR3JpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50QmFnID0gdGhpcy5yYW5kb21CYWcoKVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnRCYWcuc2hpZnQoKVxuICAgICAgICB0aGlzLm5leHQgPSB0aGlzLmN1cnJlbnRCYWcuc3BsaWNlKDAsIDMpXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmxpbmVzID0gMFxuICAgICAgICB0aGlzLmdyYXZJbnRlcnZhbFxuICAgICAgICB0aGlzLmdyYXZDdXJ2ZSA9IFs3NTAsIDYwMCwgNDUwLCAzNTAsIDI3NSwgMjI1LCAxNzUsIDE0MCwgMTEwLCA5MCwgNzVdXG4gICAgICAgIHRoaXMuZ3JhdlRhYmxlID0gWzE1LCAzMCwgNDUsIDYwLCA3NSwgMTAwLCAxMjUsIDE1MCwgMTc1LCAyMDBdXG4gICAgICAgIHRoaXMubGV2ZWwgPSAxXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ3JhdkN1cnZlLnNoaWZ0KClcbiAgICAgICAgdGhpcy5wbGF5aW5nID0gZmFsc2VcbiAgICAgICAgdGhpcy5ob2xkID0gbnVsbFxuICAgIH1cblxuICAgIGdhbWVPdmVyKCl7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5ncmF2SW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmxldmVsID0gMVxuICAgIH1cblxuICAgIGdlbmVyYXRlUGllY2UoKXtcbiAgICAgICAgbGV0IG92ZXIgPSBmYWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5ncmlkLmJsb2NrT2NjdXBpZWQoYmxvY2sucG9zKSl7XG4gICAgICAgICAgICAgICAgb3ZlciA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYob3Zlcil7XG4gICAgICAgICAgICB0aGlzLmdyaWQudXBkYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGlzLmdyaWQudXBkYXRlUGllY2UodGhpcy5jdXJyZW50KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2hvc3RQaWVjZSgpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IGdob3N0ID0gbmV3IHRoaXMuY3VycmVudC5jb25zdHJ1Y3RvcihbMCwwXSlcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDQ7IGkrKyl7XG4gICAgICAgICAgICBnaG9zdC5ibG9ja3NbaV0ucG9zWzBdID0gdGhpcy5jdXJyZW50LmJsb2Nrc1tpXS5wb3NbMF1cbiAgICAgICAgICAgIGdob3N0LmJsb2Nrc1tpXS5wb3NbMV0gPSB0aGlzLmN1cnJlbnQuYmxvY2tzW2ldLnBvc1sxXVxuICAgICAgICB9XG4gICAgICAgIGdob3N0LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdyaWQub2NjdXBpZWQoW2Jsb2NrLnBvc1swXSArIDEsIGJsb2NrLnBvc1sxXV0sIGdob3N0KSkge1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHdoaWxlKCFpc09jY3VwaWVkKXtcbiAgICAgICAgICAgIGdob3N0LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBibG9jay5tb3ZlR2hvc3QoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ncmlkLm9jY3VwaWVkKFtibG9jay5wb3NbMF0gKyAxLCBibG9jay5wb3NbMV1dLCBnaG9zdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnaG9zdFxuICAgIH1cblxuICAgIG1vdmVBY3RpdmVQaWVjZShkaXIpe1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnQuYmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZC5vY2N1cGllZChbYmxvY2sucG9zWzBdICsgZGlyWzBdLCBibG9jay5wb3NbMV0gKyBkaXJbMV1dLCB0aGlzLmN1cnJlbnQpKSB7XG4gICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgaWYgKCFpc09jY3VwaWVkKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQubW92ZSh0aGlzLmN1cnJlbnQsIGRpcilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpZENsZWFyKCl7XG4gICAgICAgIGxldCBjb3VudCA9IDBcbiAgICAgICAgdGhpcy5ncmlkLmJvYXJkLmZvckVhY2goKHJvdywgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZighcm93LmluY2x1ZGVzKG51bGwpKXtcbiAgICAgICAgICAgICAgICBjb3VudCArPSAxXG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gaWR4IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtpXS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wU3RlcChibG9jaylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBzd2l0Y2goY291bnQpe1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMTAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZSArPSAzMDAgKiB0aGlzLmxldmVsXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDUwMCAqIHRoaXMubGV2ZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gODAwICogdGhpcy5sZXZlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICBkcm9wU3RlcChibG9jayl7XG4gICAgICAgIHRoaXMuZ3JpZC5ib2FyZFtibG9jay5wb3NbMF1dW2Jsb2NrLnBvc1sxXV0gPSBudWxsXG4gICAgICAgIGJsb2NrLnVwZGF0ZVBvcyhbYmxvY2sucG9zWzBdICsgMSwgYmxvY2sucG9zWzFdXSwgdGhpcy5ncmlkKVxuICAgIH1cblxuICAgIHJvdGF0ZUFjdGl2ZVBpZWNlKGRpcil7XG4gICAgICAgIHRoaXMuY3VycmVudC5yb3RhdGUodGhpcy5ncmlkLCBkaXIpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJ1xuaW1wb3J0IGtleSBmcm9tICdrZXltYXN0ZXInXG5cbmNsYXNzIEdhbWVWaWV3e1xuICAgIGNvbnN0cnVjdG9yKGN0eCwgaF9jdHgsIG5fY3R4LCBzX2N0eCl7XG4gICAgICAgIHRoaXMuY3R4ID0gY3R4XG4gICAgICAgIHRoaXMuZ2FtZSA9IG5ldyBHYW1lKClcbiAgICAgICAgdGhpcy5kcmF3R3JpZCgpXG4gICAgICAgIHRoaXMuaF9jdHggPSBoX2N0eFxuICAgICAgICB0aGlzLm5fY3R4ID0gbl9jdHhcbiAgICAgICAgdGhpcy5zX2N0eCA9IHNfY3R4XG4gICAgICAgIHRoaXMudXBkYXRlSG9sZCgpXG4gICAgICAgIHRoaXMudXBkYXRlTmV4dCgpXG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKVxuICAgIH1cblxuICAgIHN0YXJ0KCl7XG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxSZWN0KDAsIDAsIDIwMCwgMjAwKVxuICAgICAgICBpZighdGhpcy5rZXltYXBTZXQpe1xuICAgICAgICAgICAgdGhpcy5zZXRLZXlNYXAoKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5zdGFydCgpXG4gICAgfVxuXG4gICAgc2V0S2V5TWFwKCl7XG4gICAgICAgIHRoaXMua2V5bWFwU2V0ID0gdHJ1ZVxuICAgICAgICBrZXkoJ3JpZ2h0JywgKCkgPT4gdGhpcy5nYW1lLm1vdmVBY3RpdmVQaWVjZShbMCwgMV0pKVxuICAgICAgICBrZXkoJ2xlZnQnLCAoKSA9PiB0aGlzLmdhbWUubW92ZUFjdGl2ZVBpZWNlKFswLCAtMV0pKVxuICAgICAgICBsZXQgZ2FtZV92aWV3ID0gdGhpcztcbiAgICAgICAgbGV0IHNwZWVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHNwZWVkVXAgPSAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDAgJiYgc3BlZWQgPT09IGZhbHNlICYmIHRoaXMuZ2FtZS5ncmF2aXR5ID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWUuZ3JhdkludGVydmFsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZHJvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS51cGRhdGVHcmF2aXR5KDEwMCk7XG4gICAgICAgICAgICAgICAgc3BlZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNsb3dEb3duID0gKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQwICYmIHRoaXMuZ2FtZS5ncmF2aXR5ID4gMTAwICYmIHNwZWVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWUuZ3JhdkludGVydmFsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudXBkYXRlR3Jhdml0eSh0aGlzLmdhbWUuZ3Jhdml0eSk7XG4gICAgICAgICAgICAgICAgc3BlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmYXN0RHJvcCA9IHRocm90dGxlZChlID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5mYXN0RHJvcCgpXG4gICAgICAgIH0sIDI1MClcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNwZWVkVXApXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgc2xvd0Rvd24pXG4gICAgICAgIGtleSgneCcsICgpID0+IHRoaXMuZ2FtZS5yb3RhdGVBY3RpdmVQaWVjZSgxKSlcbiAgICAgICAga2V5KCd6JywgKCkgPT4gdGhpcy5nYW1lLnJvdGF0ZUFjdGl2ZVBpZWNlKC0xKSlcbiAgICAgICAga2V5KCdjJywgKCkgPT4gdGhpcy5nYW1lLmhvbGRQaWVjZSgpKTtcbiAgICAgICAga2V5KCdzcGFjZScsIGZhc3REcm9wKVxuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuICAgICAgICB0aGlzLmRyYXdHcmlkKClcbiAgICAgICAgaWYodGhpcy5nYW1lLmN1cnJlbnQpe1xuICAgICAgICAgICAgdGhpcy5nYW1lLmdob3N0UGllY2UoKS5ibG9ja3MuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICAgICAgYmxvY2suZHJhd0dob3N0KHRoaXMuY3R4KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nYW1lLmdyaWQuYm9hcmQuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgICAgcm93LmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGJsb2NrKXtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2suZHJhd0Jsb2NrKHRoaXMuY3R4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnVwZGF0ZUhvbGQoKVxuICAgICAgICB0aGlzLnVwZGF0ZU5leHQoKVxuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKClcbiAgICB9XG5cbiAgICB1cGRhdGVIb2xkKCl7XG4gICAgICAgIHRoaXMuaF9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLmhfY3R4LmZpbGxSZWN0KDAsIDAsIDIwMCwgMjAwKVxuICAgICAgICBpZih0aGlzLmdhbWUuaG9sZCl7XG4gICAgICAgICAgICBsZXQgbmV3SG9sZFxuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT1wiKXtcbiAgICAgICAgICAgICAgICBuZXdIb2xkID0gbmV3IHRoaXMuZ2FtZS5ob2xkLmNvbnN0cnVjdG9yKFsyLCAxLjVdKVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmdhbWUuaG9sZC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIklcIil7XG4gICAgICAgICAgICAgICAgbmV3SG9sZCA9IG5ldyB0aGlzLmdhbWUuaG9sZC5jb25zdHJ1Y3RvcihbMS41LCAxLjVdKVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgbmV3SG9sZCA9IG5ldyB0aGlzLmdhbWUuaG9sZC5jb25zdHJ1Y3RvcihbMiwgMl0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdIb2xkLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBibG9jay5kcmF3QmxvY2sodGhpcy5oX2N0eClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVOZXh0KCl7XG4gICAgICAgIHRoaXMubl9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJ1xuICAgICAgICB0aGlzLm5fY3R4LmZpbGxSZWN0KDAsIDAsIDYwMCwgNjAwKVxuICAgICAgICBsZXQgaWR4XG4gICAgICAgIGxldCBuZXdOZXh0XG4gICAgICAgIGZvcihsZXQgaSA9IDI7IGkgPCA5OyBpICs9IDMpe1xuICAgICAgICAgICAgaWR4ID0gKGkgLSAyKSAvIDNcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWUubmV4dFtpZHhdLmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT1wiIHx8IHRoaXMuZ2FtZS5uZXh0W2lkeF0uY29uc3RydWN0b3IubmFtZSA9PT0gXCJJXCIpIHtcbiAgICAgICAgICAgICAgICBuZXdOZXh0ID0gbmV3IHRoaXMuZ2FtZS5uZXh0W2lkeF0uY29uc3RydWN0b3IoW2ksIDEuNV0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld05leHQgPSBuZXcgdGhpcy5nYW1lLm5leHRbaWR4XS5jb25zdHJ1Y3RvcihbaSwgMl0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdOZXh0LmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgICAgICBibG9jay5kcmF3QmxvY2sodGhpcy5uX2N0eClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVTY29yZSgpe1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxTdHlsZSA9ICdibGFjaydcbiAgICAgICAgdGhpcy5zX2N0eC5maWxsUmVjdCgwLCAwLCA2MDAsIDYwMClcbiAgICAgICAgdGhpcy5zX2N0eC5mb250ID0gJzIwcHggVGltZXMgTmV3IFJvbWFuJ1xuICAgICAgICB0aGlzLnNfY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSdcbiAgICAgICAgdGhpcy5zX2N0eC5maWxsVGV4dChgc2NvcmU6ICR7dGhpcy5nYW1lLnNjb3JlfWAsIDIwLCA1NiwgMTQwKVxuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBsaW5lczogJHt0aGlzLmdhbWUubGluZXN9YCwgMjAsIDExMiwgMTgwKVxuICAgICAgICB0aGlzLnNfY3R4LmZpbGxUZXh0KGBsZXZlbDogJHt0aGlzLmdhbWUubGV2ZWx9YCwgMjAsIDE2OCwgMTgwKVxuICAgIH1cblxuICAgIGRyYXdHcmlkKCl7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCA1MDAsIDgwMClcbiAgICAgICAgZm9yKGxldCBpID0gMzI7IGkgPD0gMzIwOyBpICs9IDMyKXtcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gXCJncmF5XCJcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9ICcxJ1xuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhpLCAwKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhpLCA4MDApO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IobGV0IGogPSAzMjsgaiA8PSA2NDA7IGogKz0gMzIpe1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcImdyYXlcIlxuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKClcbiAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCBqKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyg0MDAsIGopO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlZChmbiwgZGVsYXkpIHtcbiAgICBsZXQgbGFzdENhbGwgPSAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjb25zdCBub3cgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKG5vdyAtIGxhc3RDYWxsIDwgZGVsYXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbCA9IG5vdztcbiAgICAgICAgcmV0dXJuIGZuKC4uLmFyZ3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZVZpZXciLCJjbGFzcyBHcmlke1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBbXVxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgMjA7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnB1c2gobmV3IEFycmF5KCkpXG4gICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpXS5wdXNoKG51bGwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdXBkYXRlUGllY2UodGV0cmltaW5vKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gYmxvY2tcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlKHRldHJpbWlubywgZGlyKXtcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbYmxvY2sucG9zWzBdXVtibG9jay5wb3NbMV1dID0gbnVsbFxuICAgICAgICB9KVxuICAgICAgICB0ZXRyaW1pbm8ubW92ZShkaXIsIHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBpZWNlKHRldHJpbWlubylcbiAgICB9XG5cbiAgICBibG9ja09jY3VwaWVkKHBvcyl7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkW3Bvc1swXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gIT09IG51bGwpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBvY2N1cGllZChwb3MsIHRldHJpbWlubykge1xuICAgICAgICBsZXQgaXNPY2N1cGllZCA9IHRydWVcbiAgICAgICAgdGV0cmltaW5vLmJsb2Nrcy5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmIChibG9jay5wb3NbMF0gPT09IHBvc1swXSAmJiBibG9jay5wb3NbMV0gPT09IHBvc1sxXSkge1xuICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBpZighaXNPY2N1cGllZCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmJvYXJkW3Bvc1swXV0gPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJvYXJkW3Bvc1swXV1bcG9zWzFdXSAhPT0gbnVsbCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JpZCIsImltcG9ydCBHYW1lVmlldyBmcm9tICcuL2dhbWVfdmlldydcbmltcG9ydCBrZXkgZnJvbSAna2V5bWFzdGVyJ1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZS1jYW52YXNcIik7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICBjb25zdCBzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnQtYnV0dG9uJylcbiAgICBjb25zdCBzdGFydF9tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydC1tb2RhbC1iYWNrZ3JvdW5kJylcbiAgICBjb25zdCByZXN0YXJ0X21vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQtbW9kYWwtYmFja2dyb3VuZCcpXG4gICAgY29uc3QgcmVzdGFydF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydC1idXR0b24nKVxuICAgIGNvbnN0IGhvbGRfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob2xkLWNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBjb25zdCBuZXh0X2N0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV4dC1jYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgY29uc3Qgc2NvcmVfY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlLWNhbnZhcycpLmdldENvbnRleHQoXCIyZFwiKVxuICAgIGxldCBnYW1lX3ZpZXcgPSBuZXcgR2FtZVZpZXcoY3R4LCBob2xkX2N0eCwgbmV4dF9jdHgsIHNjb3JlX2N0eCk7XG4gICAgc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIHN0YXJ0X21vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgZ2FtZV92aWV3LnN0YXJ0KClcbiAgICAgICAgbGV0IGdhbWVQbGF5ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZV92aWV3LnVwZGF0ZSgpXG4gICAgICAgICAgICBpZiAoIWdhbWVfdmlldy5nYW1lLnBsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGdhbWVQbGF5KVxuICAgICAgICAgICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTYpXG4gICAgfSlcblxuICAgIHJlc3RhcnRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGdhbWVfdmlldy5nYW1lLm5ld1N0YXJ0KCk7XG4gICAgICAgIHJlc3RhcnRfbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICBnYW1lX3ZpZXcuc3RhcnQoKVxuICAgICAgICBsZXQgZ2FtZVBsYXkgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBnYW1lX3ZpZXcudXBkYXRlKClcbiAgICAgICAgICAgIGlmICghZ2FtZV92aWV3LmdhbWUucGxheWluZykge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZ2FtZVBsYXkpXG4gICAgICAgICAgICAgICAgcmVzdGFydF9tb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxNilcbiAgICB9KVxufSlcbiJdLCJzb3VyY2VSb290IjoiIn0=