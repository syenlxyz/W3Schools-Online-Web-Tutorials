"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/*
  Shared API Module (modern)
  - Common API utilities for MyLearning components
  - Handles authentication, API calls, and data fetching
  - Used by both RightHandSideMenu and BottomStatus
*/

(function () {
  if (window.SharedAPI) {
    return;
  }
  var SharedAPI = {
    _config: {
      cache: {
        xp: null,
        streaks: null,
        activity: null,
        tokens: null,
        challenges: null,
        lastFetch: {}
      },
      cacheTimeout: 30000 // 30 seconds
    }
  };

  // Get access token from cookie
  SharedAPI.getAccessToken = function () {
    try {
      var cookies = document.cookie.split(';');
      var tokenCookie = cookies.find(function (cookie) {
        return cookie.trim().startsWith('accessToken=');
      });
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    } catch (e) {
      return null;
    }
  };

  // Generic API call function
  SharedAPI.apiCall = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(url) {
      var options,
        token,
        response,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            token = SharedAPI.getAccessToken();
            if (token) {
              _context.next = 4;
              break;
            }
            throw new Error('No access token found');
          case 4:
            _context.next = 6;
            return fetch(url, _objectSpread(_objectSpread({}, options), {}, {
              headers: _objectSpread({
                Authorization: "Bearer ".concat(token),
                'Content-Type': 'application/json'
              }, options.headers)
            }));
          case 6:
            response = _context.sent;
            if (response.ok) {
              _context.next = 9;
              break;
            }
            throw new Error("API call failed: ".concat(response.status));
          case 9:
            return _context.abrupt("return", response.json());
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  // Check if cache is still valid
  SharedAPI.isCacheValid = function (key) {
    var lastFetch = SharedAPI._config.cache.lastFetch[key];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < SharedAPI._config.cacheTimeout;
  };

  // Fetch user XP with caching
  SharedAPI.fetchXP = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var useCache,
      data,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          useCache = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
          if (!(useCache && SharedAPI.isCacheValid('xp') && SharedAPI._config.cache.xp)) {
            _context2.next = 3;
            break;
          }
          return _context2.abrupt("return", SharedAPI._config.cache.xp);
        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return SharedAPI.apiCall("".concat(MyLearning._pathfinderApiBaseUrl, "/competency-api/xp"));
        case 6:
          data = _context2.sent;
          // API returns {"xp": 455} directly, not wrapped in data
          SharedAPI._config.cache.xp = data.xp;
          SharedAPI._config.cache.lastFetch.xp = Date.now();
          return _context2.abrupt("return", data.xp);
        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](3);
          console.error('XP fetch error:', _context2.t0);
          // Return cached value if available, otherwise return null
          return _context2.abrupt("return", SharedAPI._config.cache.xp || null);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[3, 12]]);
  }));

  // Fetch user streaks with caching
  SharedAPI.fetchStreaks = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var useCache,
      data,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          useCache = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : true;
          if (!(useCache && SharedAPI.isCacheValid('streaks') && SharedAPI._config.cache.streaks)) {
            _context3.next = 3;
            break;
          }
          return _context3.abrupt("return", SharedAPI._config.cache.streaks);
        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return SharedAPI.apiCall("".concat(MyLearning._pathfinderApiBaseUrl, "/competency-api/streaks"));
        case 6:
          data = _context3.sent;
          // API returns {"userId": "...", "streaks": 17, ...} directly, not wrapped in data
          SharedAPI._config.cache.streaks = data.streaks;
          SharedAPI._config.cache.lastFetch.streaks = Date.now();
          return _context3.abrupt("return", data.streaks);
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](3);
          console.error('Streaks fetch error:', _context3.t0);
          // Return cached value if available, otherwise return null
          return _context3.abrupt("return", SharedAPI._config.cache.streaks || null);
        case 16:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[3, 12]]);
  }));

  // Fetch user activity with caching
  SharedAPI.fetchActivity = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var useCache,
      data,
      activity,
      _args4 = arguments;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          useCache = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : true;
          if (!(useCache && SharedAPI.isCacheValid('activity') && SharedAPI._config.cache.activity)) {
            _context4.next = 3;
            break;
          }
          return _context4.abrupt("return", SharedAPI._config.cache.activity);
        case 3:
          _context4.prev = 3;
          _context4.next = 6;
          return SharedAPI.apiCall("".concat(MyLearning._apiBaseUrl, "/api/user/state?lite=true&withBookmarks=true"));
        case 6:
          data = _context4.sent;
          activity = {
            total: data.data.total,
            topics: data.data.topics,
            lessonsCount: data.data.total.lessonsCount,
            exercisesCount: data.data.total.excercisesCount,
            quizCount: data.data.total.quizCount,
            starCount: data.data.total.starCount
          };
          SharedAPI._config.cache.activity = activity;
          SharedAPI._config.cache.lastFetch.activity = Date.now();
          return _context4.abrupt("return", activity);
        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](3);
          console.error('Activity fetch error:', _context4.t0);
          // Return cached value if available, otherwise return null
          return _context4.abrupt("return", SharedAPI._config.cache.activity || null);
        case 17:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[3, 13]]);
  }));

  // Fetch user tokens (W3Points) with caching
  SharedAPI.fetchTokens = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var useCache,
      data,
      tokens,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          useCache = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : true;
          if (!(useCache && SharedAPI.isCacheValid('tokens') && SharedAPI._config.cache.tokens)) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return", SharedAPI._config.cache.tokens);
        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return SharedAPI.apiCall("".concat(MyLearning._pathfinderApiBaseUrl, "/users-api/kai-tokens"));
        case 6:
          data = _context5.sent;
          // API returns {"depleted": false, "balance": {"tokens": "1000", ...}}
          tokens = parseInt(data.balance.tokens, 10);
          SharedAPI._config.cache.tokens = tokens;
          SharedAPI._config.cache.lastFetch.tokens = Date.now();
          return _context5.abrupt("return", tokens);
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](3);
          console.error('Tokens fetch error:', _context5.t0);
          // Return cached value if available, otherwise return null
          return _context5.abrupt("return", SharedAPI._config.cache.tokens || null);
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[3, 13]]);
  }));

  // Fetch completed challenges with caching
  SharedAPI.fetchCompletedChallenges = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var useCache,
      data,
      challengesCount,
      _args6 = arguments;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          useCache = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : true;
          if (!(useCache && SharedAPI.isCacheValid('challenges') && SharedAPI._config.cache.challenges)) {
            _context6.next = 3;
            break;
          }
          return _context6.abrupt("return", SharedAPI._config.cache.challenges);
        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return SharedAPI.apiCall("".concat(MyLearning._spacesLabsApiBaseUrl, "/challenges-api/challenges/completed-challenges"));
        case 6:
          data = _context6.sent;
          // API returns array of completed challenges
          challengesCount = data.length;
          SharedAPI._config.cache.challenges = challengesCount;
          SharedAPI._config.cache.lastFetch.challenges = Date.now();
          return _context6.abrupt("return", challengesCount);
        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](3);
          console.error('Completed challenges fetch error:', _context6.t0);
          // Return cached value if available, otherwise return null
          return _context6.abrupt("return", SharedAPI._config.cache.challenges || null);
        case 17:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[3, 13]]);
  }));

  // Lazy fetch all data (non-blocking)
  SharedAPI.lazyFetchAll = function (callback) {
    // Use setTimeout to ensure this doesn't block rendering
    setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var _yield$Promise$allSet, _yield$Promise$allSet2, xp, streaks, activity, tokens, challenges, result;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return Promise.allSettled([SharedAPI.fetchXP(), SharedAPI.fetchStreaks(), SharedAPI.fetchActivity(), SharedAPI.fetchTokens(), SharedAPI.fetchCompletedChallenges()]);
          case 3:
            _yield$Promise$allSet = _context7.sent;
            _yield$Promise$allSet2 = _slicedToArray(_yield$Promise$allSet, 5);
            xp = _yield$Promise$allSet2[0];
            streaks = _yield$Promise$allSet2[1];
            activity = _yield$Promise$allSet2[2];
            tokens = _yield$Promise$allSet2[3];
            challenges = _yield$Promise$allSet2[4];
            result = {
              xp: xp.status === 'fulfilled' ? xp.value : null,
              streaks: streaks.status === 'fulfilled' ? streaks.value : null,
              activity: activity.status === 'fulfilled' ? activity.value : null,
              tokens: tokens.status === 'fulfilled' ? tokens.value : null,
              challenges: challenges.status === 'fulfilled' ? challenges.value : null
            };
            if (typeof callback === 'function') {
              callback(result);
            }
            _context7.next = 18;
            break;
          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](0);
            console.error('Lazy fetch all error:', _context7.t0);
            if (typeof callback === 'function') {
              callback({
                xp: null,
                streaks: null,
                activity: null,
                tokens: null,
                challenges: null
              });
            }
          case 18:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[0, 14]]);
    })), 0);
  };

  // Format tokens with k/M suffixes (only shorten at 10k+)
  SharedAPI.formatTokens = function (tokens) {
    if (!tokens || tokens === 0) return '0';
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (tokens >= 10000) {
      return (tokens / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return tokens.toString();
  };

  // Get XP amount based on user's subscription plan
  SharedAPI.getXpAmountForCurrentUser = function () {
    try {
      var subscriptionPlan = 'free'; // default to free

      // Try to get subscription plan from UserSession
      if (typeof UserSession !== 'undefined' && typeof UserSession.getUserSubscriptionPlan === 'function') {
        subscriptionPlan = UserSession.getUserSubscriptionPlan();
      }

      // Check if user is on paid plan
      if (['free', 'closed'].includes(subscriptionPlan) === false) {
        return 15; // +15 XP for paid plans
      }
      if (subscriptionPlan === 'closed') {
        return 0; // +0 XP for closed plans
      }
      return 10; // +10 XP for free users
    } catch (e) {
      // Fallback to free user amount if there's an error
      return 10;
    }
  };

  // Clear cache (useful for testing or when user data changes)
  SharedAPI.clearCache = function () {
    SharedAPI._config.cache.xp = null;
    SharedAPI._config.cache.streaks = null;
    SharedAPI._config.cache.activity = null;
    SharedAPI._config.cache.tokens = null;
    SharedAPI._config.cache.challenges = null;
    SharedAPI._config.cache.lastFetch = {};
  };
  window.SharedAPI = SharedAPI;
})();
