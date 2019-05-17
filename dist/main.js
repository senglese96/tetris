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

eval("//     keymaster.js\n//     (c) 2011-2013 Thomas Fuchs\n//     keymaster.js may be freely distributed under the MIT license.\n\n;(function(global){\n  var k,\n    _handlers = {},\n    _mods = { 16: false, 18: false, 17: false, 91: false },\n    _scope = 'all',\n    // modifier keys\n    _MODIFIERS = {\n      '⇧': 16, shift: 16,\n      '⌥': 18, alt: 18, option: 18,\n      '⌃': 17, ctrl: 17, control: 17,\n      '⌘': 91, command: 91\n    },\n    // special keys\n    _MAP = {\n      backspace: 8, tab: 9, clear: 12,\n      enter: 13, 'return': 13,\n      esc: 27, escape: 27, space: 32,\n      left: 37, up: 38,\n      right: 39, down: 40,\n      del: 46, 'delete': 46,\n      home: 36, end: 35,\n      pageup: 33, pagedown: 34,\n      ',': 188, '.': 190, '/': 191,\n      '`': 192, '-': 189, '=': 187,\n      ';': 186, '\\'': 222,\n      '[': 219, ']': 221, '\\\\': 220\n    },\n    code = function(x){\n      return _MAP[x] || x.toUpperCase().charCodeAt(0);\n    },\n    _downKeys = [];\n\n  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;\n\n  // IE doesn't support Array#indexOf, so have a simple replacement\n  function index(array, item){\n    var i = array.length;\n    while(i--) if(array[i]===item) return i;\n    return -1;\n  }\n\n  // for comparing mods before unassignment\n  function compareArray(a1, a2) {\n    if (a1.length != a2.length) return false;\n    for (var i = 0; i < a1.length; i++) {\n        if (a1[i] !== a2[i]) return false;\n    }\n    return true;\n  }\n\n  var modifierMap = {\n      16:'shiftKey',\n      18:'altKey',\n      17:'ctrlKey',\n      91:'metaKey'\n  };\n  function updateModifierKey(event) {\n      for(k in _mods) _mods[k] = event[modifierMap[k]];\n  };\n\n  // handle keydown event\n  function dispatch(event) {\n    var key, handler, k, i, modifiersMatch, scope;\n    key = event.keyCode;\n\n    if (index(_downKeys, key) == -1) {\n        _downKeys.push(key);\n    }\n\n    // if a modifier key, set the key.<modifierkeyname> property to true and return\n    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko\n    if(key in _mods) {\n      _mods[key] = true;\n      // 'assignKey' from inside this closure is exported to window.key\n      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;\n      return;\n    }\n    updateModifierKey(event);\n\n    // see if we need to ignore the keypress (filter() can can be overridden)\n    // by default ignore key presses if a select, textarea, or input is focused\n    if(!assignKey.filter.call(this, event)) return;\n\n    // abort if no potentially matching shortcuts found\n    if (!(key in _handlers)) return;\n\n    scope = getScope();\n\n    // for each potential shortcut\n    for (i = 0; i < _handlers[key].length; i++) {\n      handler = _handlers[key][i];\n\n      // see if it's in the current scope\n      if(handler.scope == scope || handler.scope == 'all'){\n        // check if modifiers match if any\n        modifiersMatch = handler.mods.length > 0;\n        for(k in _mods)\n          if((!_mods[k] && index(handler.mods, +k) > -1) ||\n            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;\n        // call the handler and stop the event if neccessary\n        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){\n          if(handler.method(event, handler)===false){\n            if(event.preventDefault) event.preventDefault();\n              else event.returnValue = false;\n            if(event.stopPropagation) event.stopPropagation();\n            if(event.cancelBubble) event.cancelBubble = true;\n          }\n        }\n      }\n    }\n  };\n\n  // unset modifier keys on keyup\n  function clearModifier(event){\n    var key = event.keyCode, k,\n        i = index(_downKeys, key);\n\n    // remove key from _downKeys\n    if (i >= 0) {\n        _downKeys.splice(i, 1);\n    }\n\n    if(key == 93 || key == 224) key = 91;\n    if(key in _mods) {\n      _mods[key] = false;\n      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;\n    }\n  };\n\n  function resetModifiers() {\n    for(k in _mods) _mods[k] = false;\n    for(k in _MODIFIERS) assignKey[k] = false;\n  };\n\n  // parse and assign shortcut\n  function assignKey(key, scope, method){\n    var keys, mods;\n    keys = getKeys(key);\n    if (method === undefined) {\n      method = scope;\n      scope = 'all';\n    }\n\n    // for each shortcut\n    for (var i = 0; i < keys.length; i++) {\n      // set modifier keys if any\n      mods = [];\n      key = keys[i].split('+');\n      if (key.length > 1){\n        mods = getMods(key);\n        key = [key[key.length-1]];\n      }\n      // convert to keycode and...\n      key = key[0]\n      key = code(key);\n      // ...store handler\n      if (!(key in _handlers)) _handlers[key] = [];\n      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });\n    }\n  };\n\n  // unbind all handlers for given key in current scope\n  function unbindKey(key, scope) {\n    var multipleKeys, keys,\n      mods = [],\n      i, j, obj;\n\n    multipleKeys = getKeys(key);\n\n    for (j = 0; j < multipleKeys.length; j++) {\n      keys = multipleKeys[j].split('+');\n\n      if (keys.length > 1) {\n        mods = getMods(keys);\n        key = keys[keys.length - 1];\n      }\n\n      key = code(key);\n\n      if (scope === undefined) {\n        scope = getScope();\n      }\n      if (!_handlers[key]) {\n        return;\n      }\n      for (i = 0; i < _handlers[key].length; i++) {\n        obj = _handlers[key][i];\n        // only clear handlers if correct scope and mods match\n        if (obj.scope === scope && compareArray(obj.mods, mods)) {\n          _handlers[key][i] = {};\n        }\n      }\n    }\n  };\n\n  // Returns true if the key with code 'keyCode' is currently down\n  // Converts strings into key codes.\n  function isPressed(keyCode) {\n      if (typeof(keyCode)=='string') {\n        keyCode = code(keyCode);\n      }\n      return index(_downKeys, keyCode) != -1;\n  }\n\n  function getPressedKeyCodes() {\n      return _downKeys.slice(0);\n  }\n\n  function filter(event){\n    var tagName = (event.target || event.srcElement).tagName;\n    // ignore keypressed in any elements that support keyboard data input\n    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');\n  }\n\n  // initialize key.<modifier> to false\n  for(k in _MODIFIERS) assignKey[k] = false;\n\n  // set current scope (default 'all')\n  function setScope(scope){ _scope = scope || 'all' };\n  function getScope(){ return _scope || 'all' };\n\n  // delete all handlers for a given scope\n  function deleteScope(scope){\n    var key, handlers, i;\n\n    for (key in _handlers) {\n      handlers = _handlers[key];\n      for (i = 0; i < handlers.length; ) {\n        if (handlers[i].scope === scope) handlers.splice(i, 1);\n        else i++;\n      }\n    }\n  };\n\n  // abstract key logic for assign and unassign\n  function getKeys(key) {\n    var keys;\n    key = key.replace(/\\s/g, '');\n    keys = key.split(',');\n    if ((keys[keys.length - 1]) == '') {\n      keys[keys.length - 2] += ',';\n    }\n    return keys;\n  }\n\n  // abstract mods logic for assign and unassign\n  function getMods(key) {\n    var mods = key.slice(0, key.length - 1);\n    for (var mi = 0; mi < mods.length; mi++)\n    mods[mi] = _MODIFIERS[mods[mi]];\n    return mods;\n  }\n\n  // cross-browser events\n  function addEvent(object, event, method) {\n    if (object.addEventListener)\n      object.addEventListener(event, method, false);\n    else if(object.attachEvent)\n      object.attachEvent('on'+event, function(){ method(window.event) });\n  };\n\n  // set the handlers globally on document\n  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48\n  addEvent(document, 'keyup', clearModifier);\n\n  // reset modifiers to false whenever the window is (re)focused.\n  addEvent(window, 'focus', resetModifiers);\n\n  // store previously defined key\n  var previousKey = global.key;\n\n  // restore previously defined key and return reference to our key object\n  function noConflict() {\n    var k = global.key;\n    global.key = previousKey;\n    return k;\n  }\n\n  // set window.key and window.key.set/get/deleteScope, and the default filter\n  global.key = assignKey;\n  global.key.setScope = setScope;\n  global.key.getScope = getScope;\n  global.key.deleteScope = deleteScope;\n  global.key.filter = filter;\n  global.key.isPressed = isPressed;\n  global.key.getPressedKeyCodes = getPressedKeyCodes;\n  global.key.noConflict = noConflict;\n  global.key.unbind = unbindKey;\n\n  if(true) module.exports = assignKey;\n\n})(this);\n\n\n//# sourceURL=webpack:///./node_modules/keymaster/keymaster.js?");

/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/*! exports provided: Block, Tetrimino, I, T, L, J, O, S, Z */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Block\", function() { return Block; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tetrimino\", function() { return Tetrimino; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"I\", function() { return I; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"T\", function() { return T; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"L\", function() { return L; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"J\", function() { return J; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"O\", function() { return O; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"S\", function() { return S; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Z\", function() { return Z; });\nclass Block{\n    constructor(options){\n        this.pos = options.pos;\n        this.color = options.color\n    }\n\n    updatePos(move, grid){\n        this.pos = [move[0], move[1]]\n        grid.board[this.pos[0]][this.pos[1]] = this\n    }\n\n    drawBlock(ctx) {\n        let newPos = [this.pos[0] * 40, this.pos[1] * 40];\n        let grad = ctx.createLinearGradient(newPos[1], newPos[0], newPos[1] + 40, newPos[0] + 40);\n        grad.addColorStop(0, this.color);\n        grad.addColorStop(0.35, this.color);\n        grad.addColorStop(1, 'rgba(255,255,255,1)');\n\n        ctx.fillStyle = grad;\n        ctx.fillRect(newPos[1], newPos[0], 40, 40)\n    }\n\n    eraseBlock(ctx){\n        let newPos = [this.pos[0] * 40, this.pos[1] * 40];\n        ctx.clearRect(newPos[1], newPos[0], 40, 40)\n    }\n}\n\nclass Tetrimino{\n    constructor(initial, pattern, color){\n        this.blocks = [];\n        this.orientation = 'up'\n        pattern.forEach(pos => {\n            this.blocks.push(new Block({pos: [initial[0] + pos[0], initial[1] + pos[1]], color: color}))\n        })\n    }\n\n    move(dir, grid){\n        this.blocks.forEach(block => {\n\n            block.updatePos([block.pos[0] + dir[0], block.pos[1] + dir[1]], grid)\n        })\n    }\n\n    draw(ctx){\n        this.blocks.forEach(block => {\n            block.drawBlock(ctx);\n        })\n    }\n\n    erase(ctx) {\n        this.blocks.forEach(block => {\n            block.eraseBlock(ctx);\n        })\n    }\n\n    rotate(grid, dir) {\n        let moves = []\n        let pivot = this.blocks[0].pos\n        for (let i = 1; i < 4; i++) {\n            if (dir === 1) {\n                let newX = pivot[1] + pivot[0] - this.blocks[i].pos[0];\n                let newY = pivot[0] - pivot[1] + this.blocks[i].pos[1];\n                if (!grid.occupied([newY, newX], this)) {\n                    moves.push([newY, newX])\n                } else {\n                    break\n                }\n            } else {\n                let newX = pivot[1] - pivot[0] + this.blocks[i].pos[0];\n                let newY = pivot[0] + pivot[1] - this.blocks[i].pos[1];\n                if (!grid.occupied([newY, newX], this)) {\n                    moves.push([newY, newX])\n                }\n            }\n        }\n        if (moves.length === 3) {\n            this.blocks.forEach(block => grid.board[block.pos[0]][block.pos[1]] = null)\n            for (let j = 1; j < 4; j++) {\n                this.blocks[j].updatePos(moves[j-1], grid)\n            }\n            this.blocks[0].updatePos(pivot, grid)\n        }\n    }\n}\n\nclass I extends Tetrimino{\n    constructor(initial){\n        super(initial, [[0, 0], [0, -1], [0, 1], [0, 2]], 'lightblue');\n    }\n}\n\nclass T extends Tetrimino{\n    constructor(initial){\n        super(initial, [[0, 0], [0, -1], [-1, 0], [0, 1]], 'purple')\n    }\n}\n\nclass L extends Tetrimino{\n    constructor(initial) {\n        super(initial, [[0, 0], [0, -1], [0, 1], [-1, 1]], 'blue')\n    }\n\n}\n\nclass J extends Tetrimino{\n    constructor(initial) {\n        super(initial, [[0, 0], [0, -1], [0, 1], [-1, -1]], 'orange')\n    }\n}\n\nclass O extends Tetrimino{\n    constructor(initial) {\n        super(initial, [[0, 0], [0, 1], [-1, 0], [-1, 1]], 'yellow')\n    }\n\n    rotate(grid, dir){\n        return null;\n    }\n}\nclass S extends Tetrimino{\n    constructor(initial) {\n        super(initial, [[0, 0], [0, -1], [-1, 0], [-1, 1]], 'green')\n    }\n}\n\nclass Z extends Tetrimino{\n    constructor(initial) {\n        super(initial, [[0, 0], [0, 1], [-1, -1], [-1, 0]], 'red')\n    }\n}\n\n//# sourceURL=webpack:///./src/blocks.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blocks */ \"./src/blocks.js\");\n/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid */ \"./src/grid.js\");\n\n\n\n\nclass Game{\n    constructor(){\n        this.grid = new _grid__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\n        this.currentBag = this.randomBag()\n        this.current = this.currentBag.shift()\n        this.next = this.currentBag.splice(0, 3)\n        this.gravity = 500;\n        this.score = 0;\n        this.lines = 0\n        this.gravInterval\n    }\n\n    updateGravity(gravity){\n        this.gravInterval = setInterval(() => {\n            this.drop();\n        }, gravity)\n    }\n\n    drop(){\n        let isOccupied = false;\n        this.current.blocks.forEach(block => {\n            if (this.grid.occupied([block.pos[0] + 1, block.pos[1]], this.current)){\n                isOccupied = true\n            }\n        })\n        if(isOccupied){\n            this.chooseNextPiece()\n        }else{\n            this.grid.move(this.current, [1, 0])\n        }\n    }\n\n    randomBag(){\n        let newBag = [new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"T\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"I\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"O\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"J\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"L\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"S\"]([1, 4]), new _blocks__WEBPACK_IMPORTED_MODULE_0__[\"Z\"]([1, 4])]\n        newBag = this.shuffle(newBag)\n        return newBag\n    }\n\n    shuffle(a) {\n        for (let i = a.length - 1; i > 0; i--) {\n            const j = Math.floor(Math.random() * (i + 1));\n            [a[i], a[j]] = [a[j], a[i]];\n        }\n        return a;\n    }\n\n    chooseNextPiece(){\n        if(this.currentBag.length === 0 && this.next[0] === undefined){\n            this.currentBag = this.randomBag()\n            this.current = this.currentBag.shift()\n            this.next = this.currentBag.splice(0, 3)\n        }else{\n            this.current = this.next.shift()\n            this.next.push(this.currentBag.shift())\n        }\n        this.generatePiece()\n    }\n\n    start(){\n        this.generatePiece(this.current)\n        this.updateGravity(this.gravity)\n    }\n\n    generatePiece(){\n        this.grid.updatePiece(this.current)\n    }\n\n    moveActivePiece(dir){\n        let isOccupied = false;\n        this.current.blocks.forEach(block => {\n            if (this.grid.occupied([block.pos[0] + dir[0], block.pos[1] + dir[1]], this.current)) {\n                isOccupied = true\n            }\n        })\n        if (!isOccupied) {\n            this.grid.move(this.current, dir)\n        }\n    }\n\n    rotateActivePiece(dir){\n        this.current.rotate(this.grid, dir)\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! keymaster */ \"./node_modules/keymaster/keymaster.js\");\n/* harmony import */ var keymaster__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(keymaster__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nclass GameView{\n    constructor(ctx){\n        this.ctx = ctx\n        this.game = new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\n        this.drawGrid()\n    }\n\n    start(){\n        this.setKeyMap()\n        this.game.start()\n    }\n\n    setKeyMap(){\n        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('right', () => this.game.moveActivePiece([0, 1]))\n        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('left', () => this.game.moveActivePiece([0, -1]))\n        const speedUp = debounce((e) => {\n            if (e.keyCode === 40 && this.game.gravity > 100) {\n                clearInterval(this.game.gravInterval);\n                this.game.updateGravity(100)\n            }\n        }, 200)\n        const slowDown = debounce(e => {\n            if (e.keyCode === 40 && this.game.gravity > 100) {\n                clearInterval(this.game.gravInterval);\n                this.game.updateGravity(this.game.gravity)\n            }\n        }, 200)\n        document.addEventListener('keydown', speedUp)\n        document.addEventListener('keyup', slowDown)\n        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('x', () => this.game.rotateActivePiece(1))\n        keymaster__WEBPACK_IMPORTED_MODULE_1___default()('z', () => this.game.rotateActivePiece(-1))\n    }\n\n    update(){\n        this.drawGrid()\n        this.game.grid.board.forEach(row => {\n            row.forEach(block => {\n                if(block){\n                    block.drawBlock(this.ctx);\n                }\n            })\n        })\n    }\n\n    drawGrid(){\n        this.ctx.fillStyle = \"black\"\n        this.ctx.fillRect(0, 0, 500, 800)\n        for(let i = 40; i <= 400; i += 40){\n            this.ctx.strokeStyle = \"gray\"\n            this.ctx.beginPath()\n            this.ctx.moveTo(i, 0);\n            this.ctx.lineTo(i, 800);\n            this.ctx.stroke();\n        }\n\n        for(let j = 40; j <= 800; j += 40){\n            this.ctx.strokeStyle = \"gray\"\n            this.ctx.beginPath()\n            this.ctx.moveTo(0, j);\n            this.ctx.lineTo(400, j);\n            this.ctx.stroke();\n        }\n    }\n}\n\nconst debounce = (func, delay) => {\n    let debounceTimer\n    return function () {\n        const context = this\n        const args = arguments\n        clearTimeout(debounceTimer)\n        debounceTimer = setTimeout(() => func.apply(context, args), delay)\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameView);\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Grid{\n    constructor(){\n        this.board = []\n        for(let i = 0; i < 20; i++){\n            this.board.push(new Array())\n            for(let j = 0; j < 10; j++){\n                this.board[i].push(null)\n            }\n        };\n    }\n\n    updatePiece(tetrimino){\n        tetrimino.blocks.forEach(block => {\n            this.board[block.pos[0]][block.pos[1]] = block\n        })\n    }\n\n    move(tetrimino, dir){\n        tetrimino.blocks.forEach(block => {\n            this.board[block.pos[0]][block.pos[1]] = null\n        })\n        tetrimino.move(dir, this);\n        this.updatePiece(tetrimino)\n    }\n\n    occupied(pos, tetrimino) {\n        if (this.board[pos[0]] === undefined ||\n            this.board[pos[0]][pos[1]] === undefined ||\n            !tetrimino.blocks.includes(this.board[pos[0]][pos[1]]) && this.board[pos[0]][pos[1]] !== null) {\n            return true\n        }\n        return false\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Grid);\n\n//# sourceURL=webpack:///./src/grid.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_view */ \"./src/game_view.js\");\n\n\nwindow.addEventListener('DOMContentLoaded', (event) => {\n    const canvas = document.getElementById(\"game-canvas\");\n    const ctx = canvas.getContext(\"2d\");\n    const game_view = new _game_view__WEBPACK_IMPORTED_MODULE_0__[\"default\"](ctx);\n    game_view.start()\n    setInterval(() => game_view.update(), 50)\n})\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });