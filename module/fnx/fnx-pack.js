/**
 FNX-framework
 author  : HQY
 email   : hqy321@gmail.com
 QQ      : 363395863
*/

//modules : base,detector,templatable,cookie,messenger,sticky,easing,position,iframe-shim,widget,switchable,overlay,popup,select,autocomplete,dialog,tip
!(function(){
	window.FNX = window.FNX ? window.FNX : {
		CMP : {}
	}; 
}());

/**
===============================
component : base
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("base/class", function(_using_){
var module = {},exports = module.exports = {};

// Class
// -----------------
// Thanks to:
//  - http://mootools.net/docs/core/Class/Class
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/ded/klass
//  - http://documentcloud.github.com/backbone/#Model-extend
//  - https://github.com/joyent/node/blob/master/lib/util.js
//  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js


// The base Class implementation.
function Class(o) {
  // Convert existed function to Class.
  if (!(this instanceof Class) && isFunction(o)) {
    return classify(o)
  }
}

module.exports = Class


// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
Class.create = function(parent, properties) {
  if (!isFunction(parent)) {
    properties = parent
    parent = null
  }

  properties || (properties = {})
  parent || (parent = properties.Extends || Class)
  properties.Extends = parent

  // The created class constructor
  function SubClass() {
    // Call the parent constructor.
    parent.apply(this, arguments)

    // Only call initialize in self constructor.
    if (this.constructor === SubClass && this.initialize) {
      this.initialize.apply(this, arguments)
    }
  }

  // Inherit class (static) properties from parent.
  if (parent !== Class) {
    mix(SubClass, parent, parent.StaticsWhiteList)
  }

  // Add instance properties to the subclass.
  implement.call(SubClass, properties)

  // Make subclass extendable.
  return classify(SubClass)
}


function implement(properties) {
  var key, value

  for (key in properties) {
    value = properties[key]

    if (Class.Mutators.hasOwnProperty(key)) {
      Class.Mutators[key].call(this, value)
    } else {
      this.prototype[key] = value
    }
  }
}


// Create a sub Class based on `Class`.
Class.extend = function(properties) {
  properties || (properties = {})
  properties.Extends = this

  return Class.create(properties)
}


function classify(cls) {
  cls.extend = Class.extend
  cls.implement = implement
  return cls
}


// Mutators define special properties.
Class.Mutators = {

  'Extends': function(parent) {
    var existed = this.prototype
    var proto = createProto(parent.prototype)

    // Keep existed properties.
    mix(proto, existed)

    // Enforce the constructor to be what we expect.
    proto.constructor = this

    // Set the prototype chain to inherit from `parent`.
    this.prototype = proto

    // Set a convenience property in case the parent's prototype is
    // needed later.
    this.superclass = parent.prototype
  },

  'Implements': function(items) {
    isArray(items) || (items = [items])
    var proto = this.prototype, item

    while (item = items.shift()) {
      mix(proto, item.prototype || item)
    }
  },

  'Statics': function(staticProperties) {
    mix(this, staticProperties)
  }
}


// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {
}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ?
    function(proto) {
      return { __proto__: proto }
    } :
    function(proto) {
      Ctor.prototype = proto
      return new Ctor()
    }


// Helpers
// ------------

function mix(r, s, wl) {
  // Copy "all" properties including inherited ones.
  for (var p in s) {
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue

      // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
}

var isFunction = function(val) {
  return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function(arr, item) {
      return arr.indexOf(item)
    } :
    function(arr, item) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
          return i
        }
      }
      return -1
    }


return module.exports;
});

_define_("base/events", function(_using_){
var module = {},exports = module.exports = {};

// Events
// -----------------
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js


// Regular expression used to split event strings
var eventSplitter = /\s+/


// A module that can be mixed in to *any object* in order to provide it
// with custom events. You may bind with `on` or remove with `off` callback
// functions to an event; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
function Events() {
}


// Bind one or more space separated events, `events`, to a `callback`
// function. Passing `"all"` will bind the callback to all events fired.
Events.prototype.on = function(events, callback, context) {
  var cache, event, list
  if (!callback) return this

  cache = this.__events || (this.__events = {})
  events = events.split(eventSplitter)

  while (event = events.shift()) {
    list = cache[event] || (cache[event] = [])
    list.push(callback, context)
  }

  return this
}

Events.prototype.once = function(events, callback, context) {
  var that = this
  var cb = function() {
    that.off(events, cb)
    callback.apply(context || that, arguments)
  }
  return this.on(events, cb, context)
}

// Remove one or many callbacks. If `context` is null, removes all callbacks
// with that function. If `callback` is null, removes all callbacks for the
// event. If `events` is null, removes all bound callbacks for all events.
Events.prototype.off = function(events, callback, context) {
  var cache, event, list, i

  // No events, or removing *all* events.
  if (!(cache = this.__events)) return this
  if (!(events || callback || context)) {
    delete this.__events
    return this
  }

  events = events ? events.split(eventSplitter) : keys(cache)

  // Loop through the callback list, splicing where appropriate.
  while (event = events.shift()) {
    list = cache[event]
    if (!list) continue

    if (!(callback || context)) {
      delete cache[event]
      continue
    }

    for (i = list.length - 2; i >= 0; i -= 2) {
      if (!(callback && list[i] !== callback ||
          context && list[i + 1] !== context)) {
        list.splice(i, 2)
      }
    }
  }

  return this
}


// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
Events.prototype.trigger = function(events) {
  var cache, event, all, list, i, len, rest = [], args, returned = true;
  if (!(cache = this.__events)) return this

  events = events.split(eventSplitter)

  // Fill up `rest` with the callback arguments.  Since we're only copying
  // the tail of `arguments`, a loop is much faster than Array#slice.
  for (i = 1, len = arguments.length; i < len; i++) {
    rest[i - 1] = arguments[i]
  }

  // For each event, walk through the list of callbacks twice, first to
  // trigger the event, then to trigger any `"all"` callbacks.
  while (event = events.shift()) {
    // Copy callback lists to prevent modification.
    if (all = cache.all) all = all.slice()
    if (list = cache[event]) list = list.slice()

    // Execute event callbacks except one named "all"
    if (event !== 'all') {
      returned = triggerEvents(list, rest, this) && returned
    }

    // Execute "all" callbacks.
    returned = triggerEvents(all, [event].concat(rest), this) && returned
  }

  return returned
}

Events.prototype.emit = Events.prototype.trigger


// Helpers
// -------

var keys = Object.keys

if (!keys) {
  keys = function(o) {
    var result = []

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name)
      }
    }
    return result
  }
}

// Mix `Events` to object instance or Class function.
Events.mixTo = function(receiver) {
  var proto = Events.prototype

  if (isFunction(receiver)) {
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        receiver.prototype[key] = proto[key]
      }
    }
    Object.keys(proto).forEach(function(key) {
      receiver.prototype[key] = proto[key]
    })
  }
  else {
    var event = new Events
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        copyProto(key)
      }
    }
  }

  function copyProto(key) {
    receiver[key] = function() {
      proto[key].apply(event, Array.prototype.slice.call(arguments))
      return this
    }
  }
}

// Execute callbacks
function triggerEvents(list, args, context) {
  var pass = true

  if (list) {
    var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]
    // call is faster than apply, optimize less than 3 argu
    // http://blog.csdn.net/zhengyinhui100/article/details/7837127
    switch (args.length) {
      case 0: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
      case 1: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
      case 2: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
      case 3: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
      default: for (; i < l; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
    }
  }
  // trigger will return false if one of the callbacks return false
  return pass;
}

function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]'
}

module.exports = Events


return module.exports;
});

_define_("base/aspect", function(_using_){
var module = {},exports = module.exports = {};

// Aspect
// ---------------------
// Thanks to:
//  - http://yuilibrary.com/yui/docs/api/classes/Do.html
//  - http://code.google.com/p/jquery-aop/
//  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/


// 在指定方法执行前，先执行 callback
exports.before = function(methodName, callback, context) {
  return weave.call(this, 'before', methodName, callback, context);
};


// 在指定方法执行后，再执行 callback
exports.after = function(methodName, callback, context) {
  return weave.call(this, 'after', methodName, callback, context);
};


// Helpers
// -------

var eventSplitter = /\s+/;

function weave(when, methodName, callback, context) {
  var names = methodName.split(eventSplitter);
  var name, method;

  while (name = names.shift()) {
    method = getMethod(this, name);
    if (!method.__isAspected) {
      wrap.call(this, name);
    }
    this.on(when + ':' + name, callback, context);
  }

  return this;
}


function getMethod(host, methodName) {
  var method = host[methodName];
  if (!method) {
    throw new Error('Invalid method name: ' + methodName);
  }
  return method;
}


function wrap(methodName) {
  var old = this[methodName];

  this[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    var beforeArgs = ['before:' + methodName].concat(args);

    // prevent if trigger return false
    if (this.trigger.apply(this, beforeArgs) === false) return;

    var ret = old.apply(this, arguments);
    var afterArgs = ['after:' + methodName, ret].concat(args);
    this.trigger.apply(this, afterArgs);

    return ret;
  };

  this[methodName].__isAspected = true;
}


return module.exports;
});

_define_("base/attribute", function(_using_){
var module = {},exports = module.exports = {};

// Attribute
// -----------------
// Thanks to:
//  - http://documentcloud.github.com/backbone/#Model
//  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
//  - https://github.com/berzniz/backbone.getters.setters


// 负责 attributes 的初始化
// attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
exports.initAttrs = function(config) {
  // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
  var attrs = this.attrs = {};

  // Get all inherited attributes.
  var specialProps = this.propsInAttrs || [];
  mergeInheritedAttrs(attrs, this, specialProps);

  // Merge user-specific attributes from config.
  if (config) {
    mergeUserValue(attrs, config);
  }

  // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
  setSetterAttrs(this, attrs, config);

  // Convert `on/before/afterXxx` config to event handler.
  parseEventsFromAttrs(this, attrs);

  // 将 this.attrs 上的 special properties 放回 this 上
  copySpecialProps(specialProps, this, attrs, true);
};


// Get the value of an attribute.
exports.get = function(key) {
  var attr = this.attrs[key] || {};
  var val = attr.value;
  return attr.getter ? attr.getter.call(this, val, key) : val;
};


// Set a hash of model attributes on the object, firing `"change"` unless
// you choose to silence it.
exports.set = function(key, val, options) {
  var attrs = {};

  // set("key", val, options)
  if (isString(key)) {
    attrs[key] = val;
  }
  // set({ "key": val, "key2": val2 }, options)
  else {
    attrs = key;
    options = val;
  }

  options || (options = {});
  var silent = options.silent;
  var override = options.override;

  var now = this.attrs;
  var changed = this.__changedAttrs || (this.__changedAttrs = {});

  for (key in attrs) {
    if (!attrs.hasOwnProperty(key)) continue;

    var attr = now[key] || (now[key] = {});
    val = attrs[key];

    if (attr.readOnly) {
      throw new Error('This attribute is readOnly: ' + key);
    }

    // invoke setter
    if (attr.setter) {
      val = attr.setter.call(this, val, key);
    }

    // 获取设置前的 prev 值
    var prev = this.get(key);

    // 获取需要设置的 val 值
    // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
    // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
    if (!override && isPlainObject(prev) && isPlainObject(val)) {
      val = merge(merge({}, prev), val);
    }

    // set finally
    now[key].value = val;

    // invoke change event
    // 初始化时对 set 的调用，不触发任何事件
    if (!this.__initializingAttrs && !isEqual(prev, val)) {
      if (silent) {
        changed[key] = [val, prev];
      }
      else {
        this.trigger('change:' + key, val, prev, key);
      }
    }
  }

  return this;
};


// Call this method to manually fire a `"change"` event for triggering
// a `"change:attribute"` event for each changed attribute.
exports.change = function() {
  var changed = this.__changedAttrs;

  if (changed) {
    for (var key in changed) {
      if (changed.hasOwnProperty(key)) {
        var args = changed[key];
        this.trigger('change:' + key, args[0], args[1], key);
      }
    }
    delete this.__changedAttrs;
  }

  return this;
};

// for test
exports._isPlainObject = isPlainObject;

// Helpers
// -------

var toString = Object.prototype.toString;
var hasOwn = Object.prototype.hasOwnProperty;

/**
 * Detect the JScript [[DontEnum]] bug:
 * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
 * made non-enumerable as well.
 * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
 */
/** Detect if own properties are iterated after inherited properties (IE < 9) */
var iteratesOwnLast;
(function() {
  var props = [];
  function Ctor() { this.x = 1; }
  Ctor.prototype = { 'valueOf': 1, 'y': 1 };
  for (var prop in new Ctor()) { props.push(prop); }
  iteratesOwnLast = props[0] !== 'x';
}());

var isArray = Array.isArray || function(val) {
  return toString.call(val) === '[object Array]';
};

function isString(val) {
  return toString.call(val) === '[object String]';
}

function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

function isWindow(o) {
  return o != null && o == o.window;
}

function isPlainObject(o) {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor
  // property. Make sure that DOM nodes and window objects don't
  // pass through, as well
  if (!o || toString.call(o) !== "[object Object]" ||
      o.nodeType || isWindow(o)) {
    return false;
  }

  try {
    // Not own constructor property must be Object
    if (o.constructor &&
        !hasOwn.call(o, "constructor") &&
        !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
      return false;
    }
  } catch (e) {
    // IE8,9 Will throw exceptions on certain host objects #9897
    return false;
  }

  var key;

  // Support: IE<9
  // Handle iteration over inherited properties before own properties.
  // http://bugs.jquery.com/ticket/12199
  if (iteratesOwnLast) {
    for (key in o) {
      return hasOwn.call(o, key);
    }
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  for (key in o) {}

  return key === undefined || hasOwn.call(o, key);
}

function isEmptyObject(o) {
  if (!o || toString.call(o) !== "[object Object]" ||
      o.nodeType || isWindow(o) || !o.hasOwnProperty) {
    return false;
  }

  for (var p in o) {
    if (o.hasOwnProperty(p)) return false;
  }
  return true;
}

function merge(receiver, supplier) {
  var key, value;

  for (key in supplier) {
    if (supplier.hasOwnProperty(key)) {
      receiver[key] = cloneValue(supplier[key], receiver[key]);
    }
  }

  return receiver;
}

// 只 clone 数组和 plain object，其他的保持不变
function cloneValue(value, prev){
  if (isArray(value)) {
    value = value.slice();
  }
  else if (isPlainObject(value)) {
    isPlainObject(prev) || (prev = {});

    value = merge(prev, value);
  }

  return value;
}

var keys = Object.keys;

if (!keys) {
  keys = function(o) {
    var result = [];

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name);
      }
    }
    return result;
  };
}

function mergeInheritedAttrs(attrs, instance, specialProps) {
  var inherited = [];
  var proto = instance.constructor.prototype;

  while (proto) {
    // 不要拿到 prototype 上的
    if (!proto.hasOwnProperty('attrs')) {
      proto.attrs = {};
    }

    // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
    copySpecialProps(specialProps, proto.attrs, proto);

    // 为空时不添加
    if (!isEmptyObject(proto.attrs)) {
      inherited.unshift(proto.attrs);
    }

    // 向上回溯一级
    proto = proto.constructor.superclass;
  }

  // Merge and clone default values to instance.
  for (var i = 0, len = inherited.length; i < len; i++) {
    mergeAttrs(attrs, normalize(inherited[i]));
  }
}

function mergeUserValue(attrs, config) {
  mergeAttrs(attrs, normalize(config, true), true);
}

function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
  for (var i = 0, len = specialProps.length; i < len; i++) {
    var key = specialProps[i];

    if (supplier.hasOwnProperty(key)) {
      receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
    }
  }
}


var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

function parseEventsFromAttrs(host, attrs) {
  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      var value = attrs[key].value, m;

      if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
        host[m[1]](getEventName(m[2]), value);
        delete attrs[key];
      }
    }
  }
}

// Converts `Show` to `show` and `ChangeTitle` to `change:title`
function getEventName(name) {
  var m = name.match(EVENT_NAME_PATTERN);
  var ret = m[1] ? 'change:' : '';
  ret += m[2].toLowerCase() + m[3];
  return ret;
}


function setSetterAttrs(host, attrs, config) {
  var options = { silent: true };
  host.__initializingAttrs = true;

  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      if (attrs[key].setter) {
        host.set(key, config[key], options);
      }
    }
  }

  delete host.__initializingAttrs;
}


var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

// normalize `attrs` to
//
//   {
//      value: 'xx',
//      getter: fn,
//      setter: fn,
//      readOnly: boolean
//   }
//
function normalize(attrs, isUserValue) {
  var newAttrs = {};

  for (var key in attrs) {
    var attr = attrs[key];

    if (!isUserValue &&
        isPlainObject(attr) &&
        hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
      newAttrs[key] = attr;
      continue;
    }

    newAttrs[key] = {
      value: attr
    };
  }

  return newAttrs;
}

var ATTR_OPTIONS = ['setter', 'getter', 'readOnly'];
// 专用于 attrs 的 merge 方法
function mergeAttrs(attrs, inheritedAttrs, isUserValue){
  var key, value;
  var attr;

  for (key in inheritedAttrs) {
    if (inheritedAttrs.hasOwnProperty(key)) {
      value = inheritedAttrs[key];
      attr = attrs[key];

      if (!attr) {
        attr = attrs[key] = {};
      }

      // 从严谨上来说，遍历 ATTR_SPECIAL_KEYS 更好
      // 从性能来说，直接 人肉赋值 更快
      // 这里还是选择 性能优先

      // 只有 value 要复制原值，其他的直接覆盖即可
      (value['value'] !== undefined) && (attr['value'] = cloneValue(value['value'], attr['value']));

      // 如果是用户赋值，只要考虑value
      if (isUserValue) continue;

      for (var i in ATTR_OPTIONS) {
        var option = ATTR_OPTIONS[i];
        if (value[option] !== undefined) {
          attr[option] = value[option];
        }
      }
    }
  }

  return attrs;
}

function hasOwnProperties(object, properties) {
  for (var i = 0, len = properties.length; i < len; i++) {
    if (object.hasOwnProperty(properties[i])) {
      return true;
    }
  }
  return false;
}


// 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
function isEmptyAttrValue(o) {
  return o == null || // null, undefined
      (isString(o) || isArray(o)) && o.length === 0 || // '', []
      isEmptyObject(o); // {}
}

// 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
function isEqual(a, b) {
  if (a === b) return true;

  if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className != toString.call(b)) return false;

  switch (className) {

    // Strings, numbers, dates, and booleans are compared by value.
    case '[object String]':
      // Primitives and their corresponding object wrappers are
      // equivalent; thus, `"5"` is equivalent to `new String("5")`.
      return a == String(b);

    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive. An `equal`
      // comparison is performed for other numeric values.
      return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values.
      // Dates are compared by their millisecond representations.
      // Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b;

    // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase;

    // 简单判断数组包含的 primitive 值是否相等
    case '[object Array]':
      var aString = a.toString();
      var bString = b.toString();

      // 只要包含非 primitive 值，为了稳妥起见，都返回 false
      return aString.indexOf('[object') === -1 &&
          bString.indexOf('[object') === -1 &&
          aString === bString;
  }

  if (typeof a != 'object' || typeof b != 'object') return false;

  // 简单判断两个对象是否相等，只判断第一层
  if (isPlainObject(a) && isPlainObject(b)) {

    // 键值不相等，立刻返回 false
    if (!isEqual(keys(a), keys(b))) {
      return false;
    }

    // 键相同，但有值不等，立刻返回 false
    for (var p in a) {
      if (a[p] !== b[p]) return false;
    }

    return true;
  }

  // 其他情况返回 false, 以避免误判导致 change 事件没发生
  return false;
}


return module.exports;
});

_define_("base/base", function(_using_){
var module = {},exports = module.exports = {};

// Base
// ---------
// Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。

var Class = _using_("base/class");
var Events = _using_("base/events");
var Aspect = _using_("base/aspect");
var Attribute = _using_("base/attribute");


module.exports = Class.create({
  Implements: [Events, Aspect, Attribute],

  initialize: function(config) {
    this.initAttrs(config);

    // Automatically register `this._onChangeAttr` method as
    // a `change:attr` event handler.
    parseEventsFromInstance(this, this.attrs);
  },

  destroy: function() {
    this.off();

    for (var p in this) {
      if (this.hasOwnProperty(p)) {
        delete this[p];
      }
    }

    // Destroy should be called only once, generate a fake destroy after called
    // https://github.com/aralejs/widget/issues/50
    this.destroy = function() {};
  }
});


function parseEventsFromInstance(host, attrs) {
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      var m = '_onChange' + ucfirst(attr);
      if (host[m]) {
        host.on('change:' + attr, host[m]);
      }
    }
  }
}

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}


return module.exports;
});

_define_("base", function(_using_){
var module = {},exports = module.exports = {};

// exports

var CMP = __gbl__.CMP || {};

//Core
CMP.Class = _using_("base/class");
CMP.Events = _using_("base/events");
CMP.Aspect = _using_("base/aspect");
CMP.Attribute = _using_("base/attribute");

//Base
CMP.Base = _using_("base/base");

module.exports = CMP;

return module.exports;
});

_using_("base");

})();

/**
===============================
component : detector
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("detector/detector", function(_using_){
var module = {},exports = module.exports = {};


var detector = {};
var NA_VERSION = "-1";
var win = this;
var external;
var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
var re_blackberry_10 = /\bbb10\b.+?\bversion\/([\d.]+)/;
var re_blackberry_6_7 = /\bblackberry\b.+\bversion\/([\d.]+)/;
var re_blackberry_4_5 = /\bblackberry\d+\/([\d.]+)/;

function toString(object){
  return Object.prototype.toString.call(object);
}
function isObject(object){
  return toString(object) === "[object Object]";
}
function isFunction(object){
  return toString(object) === "[object Function]";
}
function each(object, factory, argument){
  for(var i=0,b,l=object.length; i<l; i++){
    if(factory.call(object, object[i], i) === false){break;}
  }
}

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
var DEVICES = [
  ["nokia", function(ua){
    // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
    // 这种情况下会优先识别出 nokia/-1
    if(ua.indexOf("nokia ") !== -1){
      return /\bnokia ([0-9]+)?/;
    }else{
      return /\bnokia([a-z0-9]+)?/;
    }
  }],
  // 三星有 Android 和 WP 设备。
  ["samsung", function(ua){
    if(ua.indexOf("samsung") !== -1){
      return /\bsamsung(?:\-gt)?[ \-]([a-z0-9\-]+)/;
    }else{
      return /\b(?:gt|sch)[ \-]([a-z0-9\-]+)/;
    }
  }],
  ["wp", function(ua){
    return ua.indexOf("windows phone ") !== -1 ||
      ua.indexOf("xblwp") !== -1 ||
      ua.indexOf("zunewp") !== -1 ||
      ua.indexOf("windows ce") !== -1;
  }],
  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  // 小米
  ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
  // 红米
  ['hongmi', /\bhm[ \-]?([a-z0-9]+)/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", /\b(?:meizu\/|m)([0-9]+)\b/],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei", function(ua){
    var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
    if(ua.indexOf("huawei-huawei") !== -1){
      return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
    }else if(re_mediapad.test(ua)){
      return re_mediapad;
    }else{
      return /\bhuawei[ _\-]?([a-z0-9]+)/;
    }
  }],
  ["lenovo", function(ua){
    if(ua.indexOf("lenovo-lenovo") !== -1){
      return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
    }else{
      return /\blenovo[ \-]?([a-z0-9]+)/;
    }
  }],
  // 中兴
  ["zte", function(ua){
    if(/\bzte\-[tu]/.test(ua)){
      return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
    }else{
      return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
    }
  }],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ["htc", function(ua){
    if(/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)){
      return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
    }else{
      return /\bhtc[ _\-]?([a-z0-9 ]+)/;
    }
  }],
  ["oppo", /\boppo[_]([a-z0-9]+)/],
  ["konka", /\bkonka[_\-]([a-z0-9]+)/],
  ["sonyericsson", /\bmt([a-z0-9]+)/],
  ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", function(ua){
    if (ua.indexOf("blackberry") >= 0) {
      return /\bblackberry\s?(\d+)/;
    }
    return "bb10";
  }]
];

// 操作系统信息识别表达式
var OS = [
  ["wp", function(ua){
    if(ua.indexOf("windows phone ") !== -1){
      return /\bwindows phone (?:os )?([0-9.]+)/;
    }else if(ua.indexOf("xblwp") !== -1){
      return /\bxblwp([0-9.]+)/;
    }else if(ua.indexOf("zunewp") !== -1){
      return /\bzunewp([0-9.]+)/;
    }
    return "windows phone";
  }],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios", function(ua){
    if(/\bcpu(?: iphone)? os /.test(ua)){
      return /\bcpu(?: iphone)? os ([0-9._]+)/;
    }else if(ua.indexOf("iph os ") !== -1){
      return /\biph os ([0-9_]+)/;
    }else{
      return /\bios\b/;
    }
  }],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android", function(ua){
    if(ua.indexOf("android") >= 0){
      return /\bandroid[ \/-]?([0-9.x]+)?/;
    }else if(ua.indexOf("adr") >= 0){
      if(ua.indexOf("mqqbrowser") >= 0){
        return /\badr[ ]\(linux; u; ([0-9.]+)?/;
      }else{
        return /\badr(?:[ ]([0-9.]+))?/;
      }
    }
    return "android";
    //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
  }],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", function(ua){
    var m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }]
];

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua){
  if(!re_msie.test(ua)){return null;}

  var m,
      engineMode, engineVersion,
      browserMode, browserVersion,
      compatible=false;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if(ua.indexOf("trident/") !== -1){
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if(m && m.length>=2){
      // 真实引擎版本。
      engineVersion = m[1];
      var v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = re_msie.exec(ua);
  browserMode = m[1];
  var v_mode = m[1].split(".");
  if("undefined" === typeof browserVersion){
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if("undefined" === typeof engineVersion){
    engineVersion = engineMode;
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode
  };
}

// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
function checkTW360External(key){
  if(!external){return;} // return undefined.
  try{
    //        360安装路径：
    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    var runpath = external.twGetRunPath.toLowerCase();
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    var security = external.twGetSecurityID(win);
    var version = external.twGetVersion(security);

    if(runpath && runpath.indexOf(key) === -1){return false;}
    if(version){return {version: version};}
  }catch(ex){}
}

var ENGINE = [
  ["trident", re_msie],
  ["blink", function(ua){
    return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/;
  }],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", function(ua){
    var match;
    if (match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/)) {
      return {
        version: match[1] + "." + match[2]
      }
    }
  }],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/]
];
var BROWSER = [
  // Sogou.
  ["sogou", function(ua){
    if (ua.indexOf("sogoumobilebrowser") >= 0) {
      return /sogoumobilebrowser\/([0-9.]+)/
    } else if (ua.indexOf("sogoumse") >= 0){
      return true;
    }
    return / se ([0-9.x]+)/;
  }],
  // TheWorld (世界之窗)
  // 由于裙带关系，TheWorld API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["theworld", function(ua){
    var x = checkTW360External("theworld");
    if(typeof x !== "undefined"){return x;}
    return "theworld";
  }],
  // 360SE, 360EE.
  ["360", function(ua) {
    var x = checkTW360External("360se");
    if(typeof x !== "undefined"){return x;}
    if(ua.indexOf("360 aphone browser") !== -1){
      return /\b360 aphone browser \(([^\)]+)\)/;
    }
    return /\b360(?:se|ee|chrome|browser)\b/;
  }],
  // Maxthon
  ["maxthon", function(ua){
    try{
      if(external && (external.mxVersion || external.max_version)){
        return {
          version: external.mxVersion || external.max_version
        };
      }
    }catch(ex){}
    return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
  }],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["liebao", function(ua){
    if (ua.indexOf("liebaofast") >= 0){
      return /\bliebaofast\/([0-9.]+)/;
    }
    if(ua.indexOf("lbbrowser") === -1){return false;}
    var version;
    try{
      if(external && external.LiebaoGetVersion){
        version = external.LiebaoGetVersion();
      }
    }catch(ex){}
    return {
      version: version || NA_VERSION
    };
  }],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
  ["saayaa", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", re_msie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera", function(ua){
    var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
    var re_opera_new = /\bopr\/([0-9.]+)/;
    return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
  }],
  ["oupeng", /\boupeng\/([0-9.]+)/],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap", function(ua){
    if(ua.indexOf("aliapp") > 0){
      return /\baliapp\(ap\/([0-9.]+)\)/;
    }else{
      return /\balipayclient\/([0-9.]+)\b/;
    }
  }],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
  ["uc", function(ua){
    if(ua.indexOf("ucbrowser/") >= 0){
      return /\bucbrowser\/([0-9.]+)/;
    } else if(ua.indexOf("ubrowser/") >= 0){
      return /\bubrowser\/([0-9.]+)/;
    }else if(/\buc\/[0-9]/.test(ua)){
      return /\buc\/([0-9.]+)/;
    }else if(ua.indexOf("ucweb") >= 0){
      // `ucweb/2.0` is compony info.
      // `UCWEB8.7.2.214/145/800` is browser info.
      return /\bucweb([0-9.]+)?/;
    }else{
      return /\b(?:ucbrowser|uc)\b/;
    }
  }],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android", function(ua){
    if(ua.indexOf("android") === -1){return;}
    return /\bversion\/([0-9.]+(?: beta)?)/;
  }],
  ["blackberry", function(ua){
    var m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/]
];

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression, ua){
  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if(!expr){return null;}
  var info = {
    name: name,
    version: NA_VERSION,
    codename: ""
  };
  var t = toString(expr);
  if(expr === true){
    return info;
  }else if(t === "[object String]"){
    if(ua.indexOf(expr) !== -1){
      return info;
    }
  }else if(isObject(expr)){ // Object
    if(expr.hasOwnProperty("version")){
      info.version = expr.version;
    }
    return info;
  }else if(expr.exec){ // RegExp
    var m = expr.exec(ua);
    if(m){
      if(m.length >= 2 && m[1]){
        info.version = m[1].replace(/_/g, ".");
      }else{
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

var na = {name:"na", version:NA_VERSION};
// 初始化识别。
function init(ua, patterns, factory, detector){
  var detected = na;
  each(patterns, function(pattern){
    var d = detect(pattern[0], pattern[1], ua);
    if(d){
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}

// 解析 UserAgent 字符串
// @param {String} ua, userAgent string.
// @return {Object}
var parse = function(ua){
  ua = (ua || "").toLowerCase();
  var d = {};

  init(ua, DEVICES, function(name, version){
    var v = parseFloat(version);
    d.device = {
      name: name,
      version: v,
      fullVersion: version
    };
    d.device[name] = v;
  }, d);

  init(ua, OS, function(name, version){
    var v = parseFloat(version);
    d.os = {
      name: name,
      version: v,
      fullVersion: version
    };
    d.os[name] = v;
  }, d);

  var ieCore = IEMode(ua);

  init(ua, ENGINE, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复版本号及兼容模式。
    if(ieCore){
      version = ieCore.engineVersion || ieCore.engineMode;
      mode = ieCore.engineMode;
    }
    var v = parseFloat(version);
    d.engine = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.engine[name] = v;
  }, d);

  init(ua, BROWSER, function(name, version){
    var mode = version;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    if(ieCore){
      // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
      if(name === "ie"){
        version = ieCore.browserVersion;
      }
      mode = ieCore.browserMode;
    }
    var v = parseFloat(version);
    d.browser = {
      name: name,
      version: v,
      fullVersion: version,
      mode: parseFloat(mode),
      fullMode: mode,
      compatible: ieCore ? ieCore.compatible : false
    };
    d.browser[name] = v;
  }, d);
  return d;
};


// NodeJS.
if(typeof process === "object" && process.toString() === "[object process]"){

  // 加载更多的规则。
  var morerule = module["require"]("./morerule");
  [].unshift.apply(DEVICES, morerule.DEVICES || []);
  [].unshift.apply(OS,      morerule.OS      || []);
  [].unshift.apply(BROWSER, morerule.BROWSER || []);
  [].unshift.apply(ENGINE,  morerule.ENGINE  || []);

}else{

  var userAgent = navigator.userAgent || "";
  //var platform = navigator.platform || "";
  var appVersion = navigator.appVersion || "";
  var vendor = navigator.vendor || "";
  external = win.external;

  detector = parse(userAgent + " " + appVersion + " " + vendor);

}


// exports `parse()` API anyway.
detector.parse = parse;

module.exports = detector;


return module.exports;
});

_define_("detector", function(_using_){
var module = {},exports = module.exports = {};

// exports

module.exports = (__gbl__.CMP || {}).Detector = _using_("detector/detector");

return module.exports;
});

_using_("detector");

})();

/**
===============================
component : templatable
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("templatable/handlebars", function(_using_){
var module = {},exports = module.exports = {};

/*!

 handlebars v2.0.0

Copyright (C) 2011-2014 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
/* exported Handlebars */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Handlebars = root.Handlebars || factory();
  }
}(this, function () {
// handlebars/safe-string.js
var __module4__ = (function() {
  "use strict";
  var __exports__;
  // Build out our basic SafeString type
  function SafeString(string) {
    this.string = string;
  }

  SafeString.prototype.toString = function() {
    return "" + this.string;
  };

  __exports__ = SafeString;
  return __exports__;
})();

// handlebars/utils.js
var __module3__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  /*jshint -W004 */
  var SafeString = __dependency1__;

  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  function escapeChar(chr) {
    return escape[chr];
  }

  function extend(obj /* , ...source */) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }

    return obj;
  }

  __exports__.extend = extend;var toString = Object.prototype.toString;
  __exports__.toString = toString;
  // Sourced from lodash
  // https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
  var isFunction = function(value) {
    return typeof value === 'function';
  };
  // fallback for older versions of Chrome and Safari
  /* istanbul ignore next */
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  __exports__.isFunction = isFunction;
  /* istanbul ignore next */
  var isArray = Array.isArray || function(value) {
    return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
  };
  __exports__.isArray = isArray;

  function escapeExpression(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof SafeString) {
      return string.toString();
    } else if (string == null) {
      return "";
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = "" + string;

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  }

  __exports__.escapeExpression = escapeExpression;function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  __exports__.isEmpty = isEmpty;function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
  }

  __exports__.appendContextPath = appendContextPath;
  return __exports__;
})(__module4__);

// handlebars/exception.js
var __module5__ = (function() {
  "use strict";
  var __exports__;

  var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;

      message += ' - ' + line + ':' + node.firstColumn;
    }

    var tmp = Error.prototype.constructor.call(this, message);

    // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }

    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }

  Exception.prototype = new Error();

  __exports__ = Exception;
  return __exports__;
})();

// handlebars/base.js
var __module2__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;

  var VERSION = "2.0.0";
  __exports__.VERSION = VERSION;var COMPILER_REVISION = 6;
  __exports__.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
    2: '== 1.0.0-rc.3',
    3: '== 1.0.0-rc.4',
    4: '== 1.x.x',
    5: '== 2.0.0-alpha.x',
    6: '>= 2.0.0-beta.1'
  };
  __exports__.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray,
      isFunction = Utils.isFunction,
      toString = Utils.toString,
      objectType = '[object Object]';

  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};

    registerDefaultHelpers(this);
  }

  __exports__.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,

    logger: logger,
    log: log,

    registerHelper: function(name, fn) {
      if (toString.call(name) === objectType) {
        if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
        Utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function(name) {
      delete this.helpers[name];
    },

    registerPartial: function(name, partial) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials,  name);
      } else {
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function(name) {
      delete this.partials[name];
    }
  };

  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function(/* [args, ]options */) {
      if(arguments.length === 1) {
        // A missing field in a {{foo}} constuct.
        return undefined;
      } else {
        // Someone is actually trying to call something, blow up.
        throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
      }
    });

    instance.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse,
          fn = options.fn;

      if(context === true) {
        return fn(this);
      } else if(context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if(context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }

          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
          options = {data: data};
        }

        return fn(context, options);
      }
    });

    instance.registerHelper('each', function(context, options) {
      if (!options) {
        throw new Exception('Must pass iterator to #each');
      }

      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = "", data;

      var contextPath;
      if (options.data && options.ids) {
        contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
      }

      if (isFunction(context)) { context = context.call(this); }

      if (options.data) {
        data = createFrame(options.data);
      }

      if(context && typeof context === 'object') {
        if (isArray(context)) {
          for(var j = context.length; i<j; i++) {
            if (data) {
              data.index = i;
              data.first = (i === 0);
              data.last  = (i === (context.length-1));

              if (contextPath) {
                data.contextPath = contextPath + i;
              }
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for(var key in context) {
            if(context.hasOwnProperty(key)) {
              if(data) {
                data.key = key;
                data.index = i;
                data.first = (i === 0);

                if (contextPath) {
                  data.contextPath = contextPath + key;
                }
              }
              ret = ret + fn(context[key], {data: data});
              i++;
            }
          }
        }
      }

      if(i === 0){
        ret = inverse(this);
      }

      return ret;
    });

    instance.registerHelper('if', function(conditional, options) {
      if (isFunction(conditional)) { conditional = conditional.call(this); }

      // Default behavior is to render the positive path if the value is truthy and not empty.
      // The `includeZero` option may be set to treat the condtional as purely not empty based on the
      // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
      if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    instance.registerHelper('unless', function(conditional, options) {
      return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
    });

    instance.registerHelper('with', function(context, options) {
      if (isFunction(context)) { context = context.call(this); }

      var fn = options.fn;

      if (!Utils.isEmpty(context)) {
        if (options.data && options.ids) {
          var data = createFrame(options.data);
          data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
          options = {data:data};
        }

        return fn(context, options);
      } else {
        return options.inverse(this);
      }
    });

    instance.registerHelper('log', function(message, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, message);
    });

    instance.registerHelper('lookup', function(obj, field) {
      return obj && obj[field];
    });
  }

  var logger = {
    methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

    // State enum
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    level: 3,

    // can be overridden in the host environment
    log: function(level, message) {
      if (logger.level <= level) {
        var method = logger.methodMap[level];
        if (typeof console !== 'undefined' && console[method]) {
          console[method].call(console, message);
        }
      }
    }
  };
  __exports__.logger = logger;
  var log = logger.log;
  __exports__.log = log;
  var createFrame = function(object) {
    var frame = Utils.extend({}, object);
    frame._parent = object;
    return frame;
  };
  __exports__.createFrame = createFrame;
  return __exports__;
})(__module3__, __module5__);

// handlebars/runtime.js
var __module6__ = (function(__dependency1__, __dependency2__, __dependency3__) {
  "use strict";
  var __exports__ = {};
  var Utils = __dependency1__;
  var Exception = __dependency2__;
  var COMPILER_REVISION = __dependency3__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency3__.REVISION_CHANGES;
  var createFrame = __dependency3__.createFrame;

  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1,
        currentRevision = COMPILER_REVISION;

    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision],
            compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
              "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
      } else {
        // Use the embedded version info since the runtime doesn't know about this revision yet
        throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
              "Please update your runtime to a newer version ("+compilerInfo[1]+").");
      }
    }
  }

  __exports__.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

  function template(templateSpec, env) {
    /* istanbul ignore next */
    if (!env) {
      throw new Exception("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new Exception('Unknown template object: ' + typeof templateSpec);
    }

    // Note: Using env.VM references rather than local var references throughout this section to allow
    // for external users to override these as psuedo-supported APIs.
    env.VM.checkRevision(templateSpec.compiler);

    var invokePartialWrapper = function(partial, indent, name, context, hash, helpers, partials, data, depths) {
      if (hash) {
        context = Utils.extend({}, context, hash);
      }

      var result = env.VM.invokePartial.call(this, partial, name, context, helpers, partials, data, depths);

      if (result == null && env.compile) {
        var options = { helpers: helpers, partials: partials, data: data, depths: depths };
        partials[name] = env.compile(partial, { data: data !== undefined, compat: templateSpec.compat }, env);
        result = partials[name](context, options);
      }
      if (result != null) {
        if (indent) {
          var lines = result.split('\n');
          for (var i = 0, l = lines.length; i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }

            lines[i] = indent + lines[i];
          }
          result = lines.join('\n');
        }
        return result;
      } else {
        throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      }
    };

    // Just add water
    var container = {
      lookup: function(depths, name) {
        var len = depths.length;
        for (var i = 0; i < len; i++) {
          if (depths[i] && depths[i][name] != null) {
            return depths[i][name];
          }
        }
      },
      lambda: function(current, context) {
        return typeof current === 'function' ? current.call(context) : current;
      },

      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,

      fn: function(i) {
        return templateSpec[i];
      },

      programs: [],
      program: function(i, data, depths) {
        var programWrapper = this.programs[i],
            fn = this.fn(i);
        if (data || depths) {
          programWrapper = program(this, i, fn, data, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = program(this, i, fn);
        }
        return programWrapper;
      },

      data: function(data, depth) {
        while (data && depth--) {
          data = data._parent;
        }
        return data;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common && (param !== common)) {
          ret = Utils.extend({}, common, param);
        }

        return ret;
      },

      noop: env.VM.noop,
      compilerInfo: templateSpec.compiler
    };

    var ret = function(context, options) {
      options = options || {};
      var data = options.data;

      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data = initData(context, data);
      }
      var depths;
      if (templateSpec.useDepths) {
        depths = options.depths ? [context].concat(options.depths) : [context];
      }

      return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
    };
    ret.isTop = true;

    ret._setup = function(options) {
      if (!options.partial) {
        container.helpers = container.merge(options.helpers, env.helpers);

        if (templateSpec.usePartial) {
          container.partials = container.merge(options.partials, env.partials);
        }
      } else {
        container.helpers = options.helpers;
        container.partials = options.partials;
      }
    };

    ret._child = function(i, data, depths) {
      if (templateSpec.useDepths && !depths) {
        throw new Exception('must pass parent depths');
      }

      return program(container, i, templateSpec[i], data, depths);
    };
    return ret;
  }

  __exports__.template = template;function program(container, i, fn, data, depths) {
    var prog = function(context, options) {
      options = options || {};

      return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
    };
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    return prog;
  }

  __exports__.program = program;function invokePartial(partial, name, context, helpers, partials, data, depths) {
    var options = { partial: true, helpers: helpers, partials: partials, data: data, depths: depths };

    if(partial === undefined) {
      throw new Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    }
  }

  __exports__.invokePartial = invokePartial;function noop() { return ""; }

  __exports__.noop = noop;function initData(context, data) {
    if (!data || !('root' in data)) {
      data = data ? createFrame(data) : {};
      data.root = context;
    }
    return data;
  }
  return __exports__;
})(__module3__, __module5__, __module2__);

// handlebars.runtime.js
var __module1__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var base = __dependency1__;

  // Each of these augment the Handlebars object. No need to setup here.
  // (This is done to easily share code between commonjs and browse envs)
  var SafeString = __dependency2__;
  var Exception = __dependency3__;
  var Utils = __dependency4__;
  var runtime = __dependency5__;

  // For compatibility and usage outside of module systems, make the Handlebars object a namespace
  var create = function() {
    var hb = new base.HandlebarsEnvironment();

    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;

    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };

    return hb;
  };

  var Handlebars = create();
  Handlebars.create = create;

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module2__, __module4__, __module5__, __module3__, __module6__);

// handlebars/compiler/ast.js
var __module7__ = (function(__dependency1__) {
  "use strict";
  var __exports__;
  var Exception = __dependency1__;

  function LocationInfo(locInfo) {
    locInfo = locInfo || {};
    this.firstLine   = locInfo.first_line;
    this.firstColumn = locInfo.first_column;
    this.lastColumn  = locInfo.last_column;
    this.lastLine    = locInfo.last_line;
  }

  var AST = {
    ProgramNode: function(statements, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "program";
      this.statements = statements;
      this.strip = strip;
    },

    MustacheNode: function(rawParams, hash, open, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "mustache";
      this.strip = strip;

      // Open may be a string parsed from the parser or a passed boolean flag
      if (open != null && open.charAt) {
        // Must use charAt to support IE pre-10
        var escapeFlag = open.charAt(3) || open.charAt(2);
        this.escaped = escapeFlag !== '{' && escapeFlag !== '&';
      } else {
        this.escaped = !!open;
      }

      if (rawParams instanceof AST.SexprNode) {
        this.sexpr = rawParams;
      } else {
        // Support old AST API
        this.sexpr = new AST.SexprNode(rawParams, hash);
      }

      // Support old AST API that stored this info in MustacheNode
      this.id = this.sexpr.id;
      this.params = this.sexpr.params;
      this.hash = this.sexpr.hash;
      this.eligibleHelper = this.sexpr.eligibleHelper;
      this.isHelper = this.sexpr.isHelper;
    },

    SexprNode: function(rawParams, hash, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = "sexpr";
      this.hash = hash;

      var id = this.id = rawParams[0];
      var params = this.params = rawParams.slice(1);

      // a mustache is definitely a helper if:
      // * it is an eligible helper, and
      // * it has at least one parameter or hash segment
      this.isHelper = !!(params.length || hash);

      // a mustache is an eligible helper if:
      // * its id is simple (a single part, not `this` or `..`)
      this.eligibleHelper = this.isHelper || id.isSimple;

      // if a mustache is an eligible helper but not a definite
      // helper, it is ambiguous, and will be resolved in a later
      // pass or at runtime.
    },

    PartialNode: function(partialName, context, hash, strip, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type         = "partial";
      this.partialName  = partialName;
      this.context      = context;
      this.hash = hash;
      this.strip = strip;

      this.strip.inlineStandalone = true;
    },

    BlockNode: function(mustache, program, inverse, strip, locInfo) {
      LocationInfo.call(this, locInfo);

      this.type = 'block';
      this.mustache = mustache;
      this.program  = program;
      this.inverse  = inverse;
      this.strip = strip;

      if (inverse && !program) {
        this.isInverse = true;
      }
    },

    RawBlockNode: function(mustache, content, close, locInfo) {
      LocationInfo.call(this, locInfo);

      if (mustache.sexpr.id.original !== close) {
        throw new Exception(mustache.sexpr.id.original + " doesn't match " + close, this);
      }

      content = new AST.ContentNode(content, locInfo);

      this.type = 'block';
      this.mustache = mustache;
      this.program = new AST.ProgramNode([content], {}, locInfo);
    },

    ContentNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "content";
      this.original = this.string = string;
    },

    HashNode: function(pairs, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "hash";
      this.pairs = pairs;
    },

    IdNode: function(parts, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "ID";

      var original = "",
          dig = [],
          depth = 0,
          depthString = '';

      for(var i=0,l=parts.length; i<l; i++) {
        var part = parts[i].part;
        original += (parts[i].separator || '') + part;

        if (part === ".." || part === "." || part === "this") {
          if (dig.length > 0) {
            throw new Exception("Invalid path: " + original, this);
          } else if (part === "..") {
            depth++;
            depthString += '../';
          } else {
            this.isScoped = true;
          }
        } else {
          dig.push(part);
        }
      }

      this.original = original;
      this.parts    = dig;
      this.string   = dig.join('.');
      this.depth    = depth;
      this.idName   = depthString + this.string;

      // an ID is simple if it only has one part, and that part is not
      // `..` or `this`.
      this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;

      this.stringModeValue = this.string;
    },

    PartialNameNode: function(name, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "PARTIAL_NAME";
      this.name = name.original;
    },

    DataNode: function(id, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "DATA";
      this.id = id;
      this.stringModeValue = id.stringModeValue;
      this.idName = '@' + id.stringModeValue;
    },

    StringNode: function(string, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "STRING";
      this.original =
        this.string =
        this.stringModeValue = string;
    },

    NumberNode: function(number, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "NUMBER";
      this.original =
        this.number = number;
      this.stringModeValue = Number(number);
    },

    BooleanNode: function(bool, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "BOOLEAN";
      this.bool = bool;
      this.stringModeValue = bool === "true";
    },

    CommentNode: function(comment, locInfo) {
      LocationInfo.call(this, locInfo);
      this.type = "comment";
      this.comment = comment;

      this.strip = {
        inlineStandalone: true
      };
    }
  };


  // Must be exported as an object rather than the root of the module as the jison lexer
  // most modify the object to operate properly.
  __exports__ = AST;
  return __exports__;
})(__module5__);

// handlebars/compiler/parser.js
var __module9__ = (function() {
  "use strict";
  var __exports__;
  /* jshint ignore:start */
  /* istanbul ignore next */
  /* Jison generated parser */
  var handlebars = (function(){
  var parser = {trace: function trace() { },
  yy: {},
  symbols_: {"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"CONTENT":12,"COMMENT":13,"openRawBlock":14,"END_RAW_BLOCK":15,"OPEN_RAW_BLOCK":16,"sexpr":17,"CLOSE_RAW_BLOCK":18,"openBlock":19,"block_option0":20,"closeBlock":21,"openInverse":22,"block_option1":23,"OPEN_BLOCK":24,"CLOSE":25,"OPEN_INVERSE":26,"inverseAndProgram":27,"INVERSE":28,"OPEN_ENDBLOCK":29,"path":30,"OPEN":31,"OPEN_UNESCAPED":32,"CLOSE_UNESCAPED":33,"OPEN_PARTIAL":34,"partialName":35,"param":36,"partial_option0":37,"partial_option1":38,"sexpr_repetition0":39,"sexpr_option0":40,"dataName":41,"STRING":42,"NUMBER":43,"BOOLEAN":44,"OPEN_SEXPR":45,"CLOSE_SEXPR":46,"hash":47,"hash_repetition_plus0":48,"hashSegment":49,"ID":50,"EQUALS":51,"DATA":52,"pathSegments":53,"SEP":54,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",12:"CONTENT",13:"COMMENT",15:"END_RAW_BLOCK",16:"OPEN_RAW_BLOCK",18:"CLOSE_RAW_BLOCK",24:"OPEN_BLOCK",25:"CLOSE",26:"OPEN_INVERSE",28:"INVERSE",29:"OPEN_ENDBLOCK",31:"OPEN",32:"OPEN_UNESCAPED",33:"CLOSE_UNESCAPED",34:"OPEN_PARTIAL",42:"STRING",43:"NUMBER",44:"BOOLEAN",45:"OPEN_SEXPR",46:"CLOSE_SEXPR",50:"ID",51:"EQUALS",52:"DATA",54:"SEP"},
  productions_: [0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[10,3],[14,3],[9,4],[9,4],[19,3],[22,3],[27,2],[21,3],[8,3],[8,3],[11,5],[11,4],[17,3],[17,1],[36,1],[36,1],[36,1],[36,1],[36,1],[36,3],[47,1],[49,3],[35,1],[35,1],[35,1],[41,2],[30,1],[53,3],[53,1],[6,0],[6,2],[20,0],[20,1],[23,0],[23,1],[37,0],[37,1],[38,0],[38,1],[39,0],[39,2],[40,0],[40,1],[48,1],[48,2]],
  performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1: yy.prepareProgram($$[$0-1].statements, true); return $$[$0-1]; 
  break;
  case 2:this.$ = new yy.ProgramNode(yy.prepareProgram($$[$0]), {}, this._$);
  break;
  case 3:this.$ = $$[$0];
  break;
  case 4:this.$ = $$[$0];
  break;
  case 5:this.$ = $$[$0];
  break;
  case 6:this.$ = $$[$0];
  break;
  case 7:this.$ = new yy.ContentNode($$[$0], this._$);
  break;
  case 8:this.$ = new yy.CommentNode($$[$0], this._$);
  break;
  case 9:this.$ = new yy.RawBlockNode($$[$0-2], $$[$0-1], $$[$0], this._$);
  break;
  case 10:this.$ = new yy.MustacheNode($$[$0-1], null, '', '', this._$);
  break;
  case 11:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], false, this._$);
  break;
  case 12:this.$ = yy.prepareBlock($$[$0-3], $$[$0-2], $$[$0-1], $$[$0], true, this._$);
  break;
  case 13:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 14:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 15:this.$ = { strip: yy.stripFlags($$[$0-1], $$[$0-1]), program: $$[$0] };
  break;
  case 16:this.$ = {path: $$[$0-1], strip: yy.stripFlags($$[$0-2], $$[$0])};
  break;
  case 17:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 18:this.$ = new yy.MustacheNode($$[$0-1], null, $$[$0-2], yy.stripFlags($$[$0-2], $$[$0]), this._$);
  break;
  case 19:this.$ = new yy.PartialNode($$[$0-3], $$[$0-2], $$[$0-1], yy.stripFlags($$[$0-4], $$[$0]), this._$);
  break;
  case 20:this.$ = new yy.PartialNode($$[$0-2], undefined, $$[$0-1], yy.stripFlags($$[$0-3], $$[$0]), this._$);
  break;
  case 21:this.$ = new yy.SexprNode([$$[$0-2]].concat($$[$0-1]), $$[$0], this._$);
  break;
  case 22:this.$ = new yy.SexprNode([$$[$0]], null, this._$);
  break;
  case 23:this.$ = $$[$0];
  break;
  case 24:this.$ = new yy.StringNode($$[$0], this._$);
  break;
  case 25:this.$ = new yy.NumberNode($$[$0], this._$);
  break;
  case 26:this.$ = new yy.BooleanNode($$[$0], this._$);
  break;
  case 27:this.$ = $$[$0];
  break;
  case 28:$$[$0-1].isHelper = true; this.$ = $$[$0-1];
  break;
  case 29:this.$ = new yy.HashNode($$[$0], this._$);
  break;
  case 30:this.$ = [$$[$0-2], $$[$0]];
  break;
  case 31:this.$ = new yy.PartialNameNode($$[$0], this._$);
  break;
  case 32:this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0], this._$), this._$);
  break;
  case 33:this.$ = new yy.PartialNameNode(new yy.NumberNode($$[$0], this._$));
  break;
  case 34:this.$ = new yy.DataNode($$[$0], this._$);
  break;
  case 35:this.$ = new yy.IdNode($$[$0], this._$);
  break;
  case 36: $$[$0-2].push({part: $$[$0], separator: $$[$0-1]}); this.$ = $$[$0-2]; 
  break;
  case 37:this.$ = [{part: $$[$0]}];
  break;
  case 38:this.$ = [];
  break;
  case 39:$$[$0-1].push($$[$0]);
  break;
  case 48:this.$ = [];
  break;
  case 49:$$[$0-1].push($$[$0]);
  break;
  case 52:this.$ = [$$[$0]];
  break;
  case 53:$$[$0-1].push($$[$0]);
  break;
  }
  },
  table: [{3:1,4:2,5:[2,38],6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],31:[2,38],32:[2,38],34:[2,38]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:[1,10],13:[1,11],14:16,16:[1,20],19:14,22:15,24:[1,18],26:[1,19],28:[2,2],29:[2,2],31:[1,12],32:[1,13],34:[1,17]},{1:[2,1]},{5:[2,39],12:[2,39],13:[2,39],16:[2,39],24:[2,39],26:[2,39],28:[2,39],29:[2,39],31:[2,39],32:[2,39],34:[2,39]},{5:[2,3],12:[2,3],13:[2,3],16:[2,3],24:[2,3],26:[2,3],28:[2,3],29:[2,3],31:[2,3],32:[2,3],34:[2,3]},{5:[2,4],12:[2,4],13:[2,4],16:[2,4],24:[2,4],26:[2,4],28:[2,4],29:[2,4],31:[2,4],32:[2,4],34:[2,4]},{5:[2,5],12:[2,5],13:[2,5],16:[2,5],24:[2,5],26:[2,5],28:[2,5],29:[2,5],31:[2,5],32:[2,5],34:[2,5]},{5:[2,6],12:[2,6],13:[2,6],16:[2,6],24:[2,6],26:[2,6],28:[2,6],29:[2,6],31:[2,6],32:[2,6],34:[2,6]},{5:[2,7],12:[2,7],13:[2,7],16:[2,7],24:[2,7],26:[2,7],28:[2,7],29:[2,7],31:[2,7],32:[2,7],34:[2,7]},{5:[2,8],12:[2,8],13:[2,8],16:[2,8],24:[2,8],26:[2,8],28:[2,8],29:[2,8],31:[2,8],32:[2,8],34:[2,8]},{17:21,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:27,30:22,41:23,50:[1,26],52:[1,25],53:24},{4:28,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{4:29,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],28:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{12:[1,30]},{30:32,35:31,42:[1,33],43:[1,34],50:[1,26],53:24},{17:35,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:36,30:22,41:23,50:[1,26],52:[1,25],53:24},{17:37,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[1,38]},{18:[2,48],25:[2,48],33:[2,48],39:39,42:[2,48],43:[2,48],44:[2,48],45:[2,48],46:[2,48],50:[2,48],52:[2,48]},{18:[2,22],25:[2,22],33:[2,22],46:[2,22]},{18:[2,35],25:[2,35],33:[2,35],42:[2,35],43:[2,35],44:[2,35],45:[2,35],46:[2,35],50:[2,35],52:[2,35],54:[1,40]},{30:41,50:[1,26],53:24},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],52:[2,37],54:[2,37]},{33:[1,42]},{20:43,27:44,28:[1,45],29:[2,40]},{23:46,27:47,28:[1,45],29:[2,42]},{15:[1,48]},{25:[2,46],30:51,36:49,38:50,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],47:57,48:58,49:60,50:[1,59],52:[1,25],53:24},{25:[2,31],42:[2,31],43:[2,31],44:[2,31],45:[2,31],50:[2,31],52:[2,31]},{25:[2,32],42:[2,32],43:[2,32],44:[2,32],45:[2,32],50:[2,32],52:[2,32]},{25:[2,33],42:[2,33],43:[2,33],44:[2,33],45:[2,33],50:[2,33],52:[2,33]},{25:[1,61]},{25:[1,62]},{18:[1,63]},{5:[2,17],12:[2,17],13:[2,17],16:[2,17],24:[2,17],26:[2,17],28:[2,17],29:[2,17],31:[2,17],32:[2,17],34:[2,17]},{18:[2,50],25:[2,50],30:51,33:[2,50],36:65,40:64,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],46:[2,50],47:66,48:58,49:60,50:[1,59],52:[1,25],53:24},{50:[1,67]},{18:[2,34],25:[2,34],33:[2,34],42:[2,34],43:[2,34],44:[2,34],45:[2,34],46:[2,34],50:[2,34],52:[2,34]},{5:[2,18],12:[2,18],13:[2,18],16:[2,18],24:[2,18],26:[2,18],28:[2,18],29:[2,18],31:[2,18],32:[2,18],34:[2,18]},{21:68,29:[1,69]},{29:[2,41]},{4:70,6:3,12:[2,38],13:[2,38],16:[2,38],24:[2,38],26:[2,38],29:[2,38],31:[2,38],32:[2,38],34:[2,38]},{21:71,29:[1,69]},{29:[2,43]},{5:[2,9],12:[2,9],13:[2,9],16:[2,9],24:[2,9],26:[2,9],28:[2,9],29:[2,9],31:[2,9],32:[2,9],34:[2,9]},{25:[2,44],37:72,47:73,48:58,49:60,50:[1,74]},{25:[1,75]},{18:[2,23],25:[2,23],33:[2,23],42:[2,23],43:[2,23],44:[2,23],45:[2,23],46:[2,23],50:[2,23],52:[2,23]},{18:[2,24],25:[2,24],33:[2,24],42:[2,24],43:[2,24],44:[2,24],45:[2,24],46:[2,24],50:[2,24],52:[2,24]},{18:[2,25],25:[2,25],33:[2,25],42:[2,25],43:[2,25],44:[2,25],45:[2,25],46:[2,25],50:[2,25],52:[2,25]},{18:[2,26],25:[2,26],33:[2,26],42:[2,26],43:[2,26],44:[2,26],45:[2,26],46:[2,26],50:[2,26],52:[2,26]},{18:[2,27],25:[2,27],33:[2,27],42:[2,27],43:[2,27],44:[2,27],45:[2,27],46:[2,27],50:[2,27],52:[2,27]},{17:76,30:22,41:23,50:[1,26],52:[1,25],53:24},{25:[2,47]},{18:[2,29],25:[2,29],33:[2,29],46:[2,29],49:77,50:[1,74]},{18:[2,37],25:[2,37],33:[2,37],42:[2,37],43:[2,37],44:[2,37],45:[2,37],46:[2,37],50:[2,37],51:[1,78],52:[2,37],54:[2,37]},{18:[2,52],25:[2,52],33:[2,52],46:[2,52],50:[2,52]},{12:[2,13],13:[2,13],16:[2,13],24:[2,13],26:[2,13],28:[2,13],29:[2,13],31:[2,13],32:[2,13],34:[2,13]},{12:[2,14],13:[2,14],16:[2,14],24:[2,14],26:[2,14],28:[2,14],29:[2,14],31:[2,14],32:[2,14],34:[2,14]},{12:[2,10]},{18:[2,21],25:[2,21],33:[2,21],46:[2,21]},{18:[2,49],25:[2,49],33:[2,49],42:[2,49],43:[2,49],44:[2,49],45:[2,49],46:[2,49],50:[2,49],52:[2,49]},{18:[2,51],25:[2,51],33:[2,51],46:[2,51]},{18:[2,36],25:[2,36],33:[2,36],42:[2,36],43:[2,36],44:[2,36],45:[2,36],46:[2,36],50:[2,36],52:[2,36],54:[2,36]},{5:[2,11],12:[2,11],13:[2,11],16:[2,11],24:[2,11],26:[2,11],28:[2,11],29:[2,11],31:[2,11],32:[2,11],34:[2,11]},{30:79,50:[1,26],53:24},{29:[2,15]},{5:[2,12],12:[2,12],13:[2,12],16:[2,12],24:[2,12],26:[2,12],28:[2,12],29:[2,12],31:[2,12],32:[2,12],34:[2,12]},{25:[1,80]},{25:[2,45]},{51:[1,78]},{5:[2,20],12:[2,20],13:[2,20],16:[2,20],24:[2,20],26:[2,20],28:[2,20],29:[2,20],31:[2,20],32:[2,20],34:[2,20]},{46:[1,81]},{18:[2,53],25:[2,53],33:[2,53],46:[2,53],50:[2,53]},{30:51,36:82,41:55,42:[1,52],43:[1,53],44:[1,54],45:[1,56],50:[1,26],52:[1,25],53:24},{25:[1,83]},{5:[2,19],12:[2,19],13:[2,19],16:[2,19],24:[2,19],26:[2,19],28:[2,19],29:[2,19],31:[2,19],32:[2,19],34:[2,19]},{18:[2,28],25:[2,28],33:[2,28],42:[2,28],43:[2,28],44:[2,28],45:[2,28],46:[2,28],50:[2,28],52:[2,28]},{18:[2,30],25:[2,30],33:[2,30],46:[2,30],50:[2,30]},{5:[2,16],12:[2,16],13:[2,16],16:[2,16],24:[2,16],26:[2,16],28:[2,16],29:[2,16],31:[2,16],32:[2,16],34:[2,16]}],
  defaultActions: {4:[2,1],44:[2,41],47:[2,43],57:[2,47],63:[2,10],70:[2,15],73:[2,45]},
  parseError: function parseError(str, hash) {
      throw new Error(str);
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
      this.lexer.setInput(input);
      this.lexer.yy = this.yy;
      this.yy.lexer = this.lexer;
      this.yy.parser = this;
      if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
      var yyloc = this.lexer.yylloc;
      lstack.push(yyloc);
      var ranges = this.lexer.options && this.lexer.options.ranges;
      if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
      function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
      }
      function lex() {
          var token;
          token = self.lexer.lex() || 1;
          if (typeof token !== "number") {
              token = self.symbols_[token] || token;
          }
          return token;
      }
      var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == "undefined") {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
              var errStr = "";
              if (!recovering) {
                  expected = [];
                  for (p in table[state])
                      if (this.terminals_[p] && p > 2) {
                          expected.push("'" + this.terminals_[p] + "'");
                      }
                  if (this.lexer.showPosition) {
                      errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                  } else {
                      errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                  }
                  this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
              }
          }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = this.lexer.yyleng;
                  yytext = this.lexer.yytext;
                  yylineno = this.lexer.yylineno;
                  yyloc = this.lexer.yylloc;
                  if (recovering > 0)
                      recovering--;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
              if (ranges) {
                  yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }
  };
  /* Jison generated lexer */
  var lexer = (function(){
  var lexer = ({EOF:1,
  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },
  setInput:function (input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
          if (this.options.ranges) this.yylloc.range = [0,0];
          this.offset = 0;
          return this;
      },
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) this.yylloc.range[1]++;

          this._input = this._input.slice(1);
          return ch;
      },
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length-1);
          this.matched = this.matched.substr(0, this.matched.length-1);

          if (lines.length-1) this.yylineno -= lines.length-1;
          var r = this.yylloc.range;

          this.yylloc = {first_line: this.yylloc.first_line,
            last_line: this.yylineno+1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
                this.yylloc.first_column - len
            };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
      },
  more:function () {
          this._more = true;
          return this;
      },
  less:function (n) {
          this.unput(this.match.slice(n));
      },
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
      },
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c+"^";
      },
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) this.done = true;

          var token,
              match,
              tempMatch,
              index,
              col,
              lines;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i=0;i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (!this.options.flex) break;
              }
          }
          if (match) {
              lines = match[0].match(/(?:\r\n?|\n).*/g);
              if (lines) this.yylineno += lines.length;
              this.yylloc = {first_line: this.yylloc.last_line,
                             last_line: this.yylineno+1,
                             first_column: this.yylloc.last_column,
                             last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
              this.yytext += match[0];
              this.match += match[0];
              this.matches = match;
              this.yyleng = this.yytext.length;
              if (this.options.ranges) {
                  this.yylloc.range = [this.offset, this.offset += this.yyleng];
              }
              this._more = false;
              this._input = this._input.slice(match[0].length);
              this.matched += match[0];
              token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
              if (this.done && this._input) this.done = false;
              if (token) return token;
              else return;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                      {text: "", token: null, line: this.yylineno});
          }
      },
  lex:function lex() {
          var r = this.next();
          if (typeof r !== 'undefined') {
              return r;
          } else {
              return this.lex();
          }
      },
  begin:function begin(condition) {
          this.conditionStack.push(condition);
      },
  popState:function popState() {
          return this.conditionStack.pop();
      },
  _currentRules:function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
      },
  topState:function () {
          return this.conditionStack[this.conditionStack.length-2];
      },
  pushState:function begin(condition) {
          this.begin(condition);
      }});
  lexer.options = {};
  lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {


  function strip(start, end) {
    return yy_.yytext = yy_.yytext.substr(start, yy_.yyleng-end);
  }


  var YYSTATE=YY_START
  switch($avoiding_name_collisions) {
  case 0:
                                     if(yy_.yytext.slice(-2) === "\\\\") {
                                       strip(0,1);
                                       this.begin("mu");
                                     } else if(yy_.yytext.slice(-1) === "\\") {
                                       strip(0,1);
                                       this.begin("emu");
                                     } else {
                                       this.begin("mu");
                                     }
                                     if(yy_.yytext) return 12;
                                   
  break;
  case 1:return 12;
  break;
  case 2:
                                     this.popState();
                                     return 12;
                                   
  break;
  case 3:
                                    yy_.yytext = yy_.yytext.substr(5, yy_.yyleng-9);
                                    this.popState();
                                    return 15;
                                   
  break;
  case 4: return 12; 
  break;
  case 5:strip(0,4); this.popState(); return 13;
  break;
  case 6:return 45;
  break;
  case 7:return 46;
  break;
  case 8: return 16; 
  break;
  case 9:
                                    this.popState();
                                    this.begin('raw');
                                    return 18;
                                   
  break;
  case 10:return 34;
  break;
  case 11:return 24;
  break;
  case 12:return 29;
  break;
  case 13:this.popState(); return 28;
  break;
  case 14:this.popState(); return 28;
  break;
  case 15:return 26;
  break;
  case 16:return 26;
  break;
  case 17:return 32;
  break;
  case 18:return 31;
  break;
  case 19:this.popState(); this.begin('com');
  break;
  case 20:strip(3,5); this.popState(); return 13;
  break;
  case 21:return 31;
  break;
  case 22:return 51;
  break;
  case 23:return 50;
  break;
  case 24:return 50;
  break;
  case 25:return 54;
  break;
  case 26:// ignore whitespace
  break;
  case 27:this.popState(); return 33;
  break;
  case 28:this.popState(); return 25;
  break;
  case 29:yy_.yytext = strip(1,2).replace(/\\"/g,'"'); return 42;
  break;
  case 30:yy_.yytext = strip(1,2).replace(/\\'/g,"'"); return 42;
  break;
  case 31:return 52;
  break;
  case 32:return 44;
  break;
  case 33:return 44;
  break;
  case 34:return 43;
  break;
  case 35:return 50;
  break;
  case 36:yy_.yytext = strip(1,2); return 50;
  break;
  case 37:return 'INVALID';
  break;
  case 38:return 5;
  break;
  }
  };
  lexer.rules = [/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{\/)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{(~)?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
  lexer.conditions = {"mu":{"rules":[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[5],"inclusive":false},"raw":{"rules":[3,4],"inclusive":false},"INITIAL":{"rules":[0,1,38],"inclusive":true}};
  return lexer;})()
  parser.lexer = lexer;
  function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();__exports__ = handlebars;
  /* jshint ignore:end */
  return __exports__;
})();

// handlebars/compiler/helpers.js
var __module10__ = (function(__dependency1__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;

  function stripFlags(open, close) {
    return {
      left: open.charAt(2) === '~',
      right: close.charAt(close.length-3) === '~'
    };
  }

  __exports__.stripFlags = stripFlags;
  function prepareBlock(mustache, program, inverseAndProgram, close, inverted, locInfo) {
    /*jshint -W040 */
    if (mustache.sexpr.id.original !== close.path.original) {
      throw new Exception(mustache.sexpr.id.original + ' doesn\'t match ' + close.path.original, mustache);
    }

    var inverse = inverseAndProgram && inverseAndProgram.program;

    var strip = {
      left: mustache.strip.left,
      right: close.strip.right,

      // Determine the standalone candiacy. Basically flag our content as being possibly standalone
      // so our parent can determine if we actually are standalone
      openStandalone: isNextWhitespace(program.statements),
      closeStandalone: isPrevWhitespace((inverse || program).statements)
    };

    if (mustache.strip.right) {
      omitRight(program.statements, null, true);
    }

    if (inverse) {
      var inverseStrip = inverseAndProgram.strip;

      if (inverseStrip.left) {
        omitLeft(program.statements, null, true);
      }
      if (inverseStrip.right) {
        omitRight(inverse.statements, null, true);
      }
      if (close.strip.left) {
        omitLeft(inverse.statements, null, true);
      }

      // Find standalone else statments
      if (isPrevWhitespace(program.statements)
          && isNextWhitespace(inverse.statements)) {

        omitLeft(program.statements);
        omitRight(inverse.statements);
      }
    } else {
      if (close.strip.left) {
        omitLeft(program.statements, null, true);
      }
    }

    if (inverted) {
      return new this.BlockNode(mustache, inverse, program, strip, locInfo);
    } else {
      return new this.BlockNode(mustache, program, inverse, strip, locInfo);
    }
  }

  __exports__.prepareBlock = prepareBlock;
  function prepareProgram(statements, isRoot) {
    for (var i = 0, l = statements.length; i < l; i++) {
      var current = statements[i],
          strip = current.strip;

      if (!strip) {
        continue;
      }

      var _isPrevWhitespace = isPrevWhitespace(statements, i, isRoot, current.type === 'partial'),
          _isNextWhitespace = isNextWhitespace(statements, i, isRoot),

          openStandalone = strip.openStandalone && _isPrevWhitespace,
          closeStandalone = strip.closeStandalone && _isNextWhitespace,
          inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;

      if (strip.right) {
        omitRight(statements, i, true);
      }
      if (strip.left) {
        omitLeft(statements, i, true);
      }

      if (inlineStandalone) {
        omitRight(statements, i);

        if (omitLeft(statements, i)) {
          // If we are on a standalone node, save the indent info for partials
          if (current.type === 'partial') {
            current.indent = (/([ \t]+$)/).exec(statements[i-1].original) ? RegExp.$1 : '';
          }
        }
      }
      if (openStandalone) {
        omitRight((current.program || current.inverse).statements);

        // Strip out the previous content node if it's whitespace only
        omitLeft(statements, i);
      }
      if (closeStandalone) {
        // Always strip the next node
        omitRight(statements, i);

        omitLeft((current.inverse || current.program).statements);
      }
    }

    return statements;
  }

  __exports__.prepareProgram = prepareProgram;function isPrevWhitespace(statements, i, isRoot) {
    if (i === undefined) {
      i = statements.length;
    }

    // Nodes that end with newlines are considered whitespace (but are special
    // cased for strip operations)
    var prev = statements[i-1],
        sibling = statements[i-2];
    if (!prev) {
      return isRoot;
    }

    if (prev.type === 'content') {
      return (sibling || !isRoot ? (/\r?\n\s*?$/) : (/(^|\r?\n)\s*?$/)).test(prev.original);
    }
  }
  function isNextWhitespace(statements, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }

    var next = statements[i+1],
        sibling = statements[i+2];
    if (!next) {
      return isRoot;
    }

    if (next.type === 'content') {
      return (sibling || !isRoot ? (/^\s*?\r?\n/) : (/^\s*?(\r?\n|$)/)).test(next.original);
    }
  }

  // Marks the node to the right of the position as omitted.
  // I.e. {{foo}}' ' will mark the ' ' node as omitted.
  //
  // If i is undefined, then the first child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitRight(statements, i, multiple) {
    var current = statements[i == null ? 0 : i + 1];
    if (!current || current.type !== 'content' || (!multiple && current.rightStripped)) {
      return;
    }

    var original = current.string;
    current.string = current.string.replace(multiple ? (/^\s+/) : (/^[ \t]*\r?\n?/), '');
    current.rightStripped = current.string !== original;
  }

  // Marks the node to the left of the position as omitted.
  // I.e. ' '{{foo}} will mark the ' ' node as omitted.
  //
  // If i is undefined then the last child will be marked as such.
  //
  // If mulitple is truthy then all whitespace will be stripped out until non-whitespace
  // content is met.
  function omitLeft(statements, i, multiple) {
    var current = statements[i == null ? statements.length - 1 : i - 1];
    if (!current || current.type !== 'content' || (!multiple && current.leftStripped)) {
      return;
    }

    // We omit the last node if it's whitespace only and not preceeded by a non-content node.
    var original = current.string;
    current.string = current.string.replace(multiple ? (/\s+$/) : (/[ \t]+$/), '');
    current.leftStripped = current.string !== original;
    return current.leftStripped;
  }
  return __exports__;
})(__module5__);

// handlebars/compiler/base.js
var __module8__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__) {
  "use strict";
  var __exports__ = {};
  var parser = __dependency1__;
  var AST = __dependency2__;
  var Helpers = __dependency3__;
  var extend = __dependency4__.extend;

  __exports__.parser = parser;

  var yy = {};
  extend(yy, Helpers, AST);

  function parse(input) {
    // Just return if an already-compile AST was passed in.
    if (input.constructor === AST.ProgramNode) { return input; }

    parser.yy = yy;

    return parser.parse(input);
  }

  __exports__.parse = parse;
  return __exports__;
})(__module9__, __module7__, __module10__, __module3__);

// handlebars/compiler/compiler.js
var __module11__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__ = {};
  var Exception = __dependency1__;
  var isArray = __dependency2__.isArray;

  var slice = [].slice;

  function Compiler() {}

  __exports__.Compiler = Compiler;// the foundHelper register will disambiguate helper lookup from finding a
  // function in a context. This is necessary for mustache compatibility, which
  // requires that context functions in blocks are evaluated by blockHelperMissing,
  // and then proceed as if the resulting value was provided to blockHelperMissing.

  Compiler.prototype = {
    compiler: Compiler,

    equals: function(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }

      for (var i = 0; i < len; i++) {
        var opcode = this.opcodes[i],
            otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }

      // We know that length is the same between the two arrays because they are directly tied
      // to the opcode behavior above.
      len = this.children.length;
      for (i = 0; i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }

      return true;
    },

    guid: 0,

    compile: function(program, options) {
      this.opcodes = [];
      this.children = [];
      this.depths = {list: []};
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true,
        'lookup': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.accept(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements;

      for(var i=0, l=statements.length; i<l; i++) {
        this.accept(statements[i]);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++, depth;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache,
          program = block.program,
          inverse = block.inverse;

      if (program) {
        program = this.compileProgram(program);
      }

      if (inverse) {
        inverse = this.compileProgram(inverse);
      }

      var sexpr = mustache.sexpr;
      var type = this.classifySexpr(sexpr);

      if (type === "helper") {
        this.helperSexpr(sexpr, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(sexpr);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('blockValue', sexpr.id.original);
      } else {
        this.ambiguousSexpr(sexpr, program, inverse);

        // now that the simple mustache is resolved, we need to
        // evaluate it by executing `blockHelperMissing`
        this.opcode('pushProgram', program);
        this.opcode('pushProgram', inverse);
        this.opcode('emptyHash');
        this.opcode('ambiguousBlockValue');
      }

      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, i, l;

      this.opcode('pushHash');

      for(i=0, l=pairs.length; i<l; i++) {
        this.pushParam(pairs[i][1]);
      }
      while(i--) {
        this.opcode('assignToHash', pairs[i][0]);
      }
      this.opcode('popHash');
    },

    partial: function(partial) {
      var partialName = partial.partialName;
      this.usePartial = true;

      if (partial.hash) {
        this.accept(partial.hash);
      } else {
        this.opcode('push', 'undefined');
      }

      if (partial.context) {
        this.accept(partial.context);
      } else {
        this.opcode('getContext', 0);
        this.opcode('pushContext');
      }

      this.opcode('invokePartial', partialName.name, partial.indent || '');
      this.opcode('append');
    },

    content: function(content) {
      if (content.string) {
        this.opcode('appendContent', content.string);
      }
    },

    mustache: function(mustache) {
      this.sexpr(mustache.sexpr);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ambiguousSexpr: function(sexpr, program, inverse) {
      var id = sexpr.id,
          name = id.parts[0],
          isBlock = program != null || inverse != null;

      this.opcode('getContext', id.depth);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      this.ID(id);

      this.opcode('invokeAmbiguous', name, isBlock);
    },

    simpleSexpr: function(sexpr) {
      var id = sexpr.id;

      if (id.type === 'DATA') {
        this.DATA(id);
      } else if (id.parts.length) {
        this.ID(id);
      } else {
        // Simplified ID for `this`
        this.addDepth(id.depth);
        this.opcode('getContext', id.depth);
        this.opcode('pushContext');
      }

      this.opcode('resolvePossibleLambda');
    },

    helperSexpr: function(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse),
          id = sexpr.id,
          name = id.parts[0];

      if (this.options.knownHelpers[name]) {
        this.opcode('invokeKnownHelper', params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new Exception("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        id.falsy = true;

        this.ID(id);
        this.opcode('invokeHelper', params.length, id.original, id.isSimple);
      }
    },

    sexpr: function(sexpr) {
      var type = this.classifySexpr(sexpr);

      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);
      this.opcode('getContext', id.depth);

      var name = id.parts[0];
      if (!name) {
        // Context reference, i.e. `{{foo .}}` or `{{foo ..}}`
        this.opcode('pushContext');
      } else {
        this.opcode('lookupOnContext', id.parts, id.falsy, id.isScoped);
      }
    },

    DATA: function(data) {
      this.options.data = true;
      this.opcode('lookupData', data.id.depth, data.id.parts);
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    NUMBER: function(number) {
      this.opcode('pushLiteral', number.number);
    },

    BOOLEAN: function(bool) {
      this.opcode('pushLiteral', bool.bool);
    },

    comment: function() {},

    // HELPERS
    opcode: function(name) {
      this.opcodes.push({ opcode: name, args: slice.call(arguments, 1) });
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    classifySexpr: function(sexpr) {
      var isHelper   = sexpr.isHelper;
      var isEligible = sexpr.eligibleHelper;
      var options    = this.options;

      // if ambiguous, we can possibly resolve the ambiguity now
      // An eligible helper is one that does not have a complex path, i.e. `this.foo`, `../foo` etc.
      if (isEligible && !isHelper) {
        var name = sexpr.id.parts[0];

        if (options.knownHelpers[name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }

      if (isHelper) { return "helper"; }
      else if (isEligible) { return "ambiguous"; }
      else { return "simple"; }
    },

    pushParams: function(params) {
      for(var i=0, l=params.length; i<l; i++) {
        this.pushParam(params[i]);
      }
    },

    pushParam: function(val) {
      if (this.stringParams) {
        if(val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode('getContext', val.depth || 0);
        this.opcode('pushStringParam', val.stringModeValue, val.type);

        if (val.type === 'sexpr') {
          // Subexpressions get evaluated and passed in
          // in string params mode.
          this.sexpr(val);
        }
      } else {
        if (this.trackIds) {
          this.opcode('pushId', val.type, val.idName || val.stringModeValue);
        }
        this.accept(val);
      }
    },

    setupFullMustacheParams: function(sexpr, program, inverse) {
      var params = sexpr.params;
      this.pushParams(params);

      this.opcode('pushProgram', program);
      this.opcode('pushProgram', inverse);

      if (sexpr.hash) {
        this.hash(sexpr.hash);
      } else {
        this.opcode('emptyHash');
      }

      return params;
    }
  };

  function precompile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }

    options = options || {};
    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var ast = env.parse(input);
    var environment = new env.Compiler().compile(ast, options);
    return new env.JavaScriptCompiler().compile(environment, options);
  }

  __exports__.precompile = precompile;function compile(input, options, env) {
    if (input == null || (typeof input !== 'string' && input.constructor !== env.AST.ProgramNode)) {
      throw new Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }

    options = options || {};

    if (!('data' in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }

    var compiled;

    function compileInput() {
      var ast = env.parse(input);
      var environment = new env.Compiler().compile(ast, options);
      var templateSpec = new env.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env.template(templateSpec);
    }

    // Template is only compiled on first use and cached after that point.
    var ret = function(context, options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, options);
    };
    ret._setup = function(options) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(options);
    };
    ret._child = function(i, data, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data, depths);
    };
    return ret;
  }

  __exports__.compile = compile;function argEquals(a, b) {
    if (a === b) {
      return true;
    }

    if (isArray(a) && isArray(b) && a.length === b.length) {
      for (var i = 0; i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }
  return __exports__;
})(__module5__, __module3__);

// handlebars/compiler/javascript-compiler.js
var __module12__ = (function(__dependency1__, __dependency2__) {
  "use strict";
  var __exports__;
  var COMPILER_REVISION = __dependency1__.COMPILER_REVISION;
  var REVISION_CHANGES = __dependency1__.REVISION_CHANGES;
  var Exception = __dependency2__;

  function Literal(value) {
    this.value = value;
  }

  function JavaScriptCompiler() {}

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name /* , type*/) {
      if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      } else {
        return parent + "['" + name + "']";
      }
    },
    depthedLookup: function(name) {
      this.aliases.lookup = 'this.lookup';

      return 'lookup(depths, "' + name + '")';
    },

    compilerInfo: function() {
      var revision = COMPILER_REVISION,
          versions = REVISION_CHANGES[revision];
      return [revision, versions];
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return {
          appendToBuffer: true,
          content: string,
          toString: function() { return "buffer += " + string + ";"; }
        };
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options;
      this.stringParams = this.options.stringParams;
      this.trackIds = this.options.trackIds;
      this.precompile = !asObject;

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        environments: []
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];
      this.aliases = {};
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];

      this.compileChildren(environment, options);

      this.useDepths = this.useDepths || environment.depths.list.length || this.options.compat;

      var opcodes = environment.opcodes,
          opcode,
          i,
          l;

      for (i = 0, l = opcodes.length; i < l; i++) {
        opcode = opcodes[i];

        this[opcode.opcode].apply(this, opcode.args);
      }

      // Flush any trailing content that might be pending.
      this.pushSource('');

      /* istanbul ignore next */
      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new Exception('Compile completed with content left on stack');
      }

      var fn = this.createFunctionContext(asObject);
      if (!this.isChild) {
        var ret = {
          compiler: this.compilerInfo(),
          main: fn
        };
        var programs = this.context.programs;
        for (i = 0, l = programs.length; i < l; i++) {
          if (programs[i]) {
            ret[i] = programs[i];
          }
        }

        if (this.environment.usePartial) {
          ret.usePartial = true;
        }
        if (this.options.data) {
          ret.useData = true;
        }
        if (this.useDepths) {
          ret.useDepths = true;
        }
        if (this.options.compat) {
          ret.compat = true;
        }

        if (!asObject) {
          ret.compiler = JSON.stringify(ret.compiler);
          ret = this.objectLiteral(ret);
        }

        return ret;
      } else {
        return fn;
      }
    },

    preamble: function() {
      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = [];
    },

    createFunctionContext: function(asObject) {
      var varDeclarations = '';

      var locals = this.stackVars.concat(this.registers.list);
      if(locals.length > 0) {
        varDeclarations += ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      for (var alias in this.aliases) {
        if (this.aliases.hasOwnProperty(alias)) {
          varDeclarations += ', ' + alias + '=' + this.aliases[alias];
        }
      }

      var params = ["depth0", "helpers", "partials", "data"];

      if (this.useDepths) {
        params.push('depths');
      }

      // Perform a second pass over the output to merge content when possible
      var source = this.mergeSource(varDeclarations);

      if (asObject) {
        params.push(source);

        return Function.apply(this, params);
      } else {
        return 'function(' + params.join(',') + ') {\n  ' + source + '}';
      }
    },
    mergeSource: function(varDeclarations) {
      var source = '',
          buffer,
          appendOnly = !this.forceBuffer,
          appendFirst;

      for (var i = 0, len = this.source.length; i < len; i++) {
        var line = this.source[i];
        if (line.appendToBuffer) {
          if (buffer) {
            buffer = buffer + '\n    + ' + line.content;
          } else {
            buffer = line.content;
          }
        } else {
          if (buffer) {
            if (!source) {
              appendFirst = true;
              source = buffer + ';\n  ';
            } else {
              source += 'buffer += ' + buffer + ';\n  ';
            }
            buffer = undefined;
          }
          source += line + '\n  ';

          if (!this.environment.isSimple) {
            appendOnly = false;
          }
        }
      }

      if (appendOnly) {
        if (buffer || !source) {
          source += 'return ' + (buffer || '""') + ';\n';
        }
      } else {
        varDeclarations += ", buffer = " + (appendFirst ? '' : this.initializeBuffer());
        if (buffer) {
          source += 'return buffer + ' + buffer + ';\n';
        } else {
          source += 'return buffer;\n';
        }
      }

      if (varDeclarations) {
        source = 'var ' + varDeclarations.substring(2) + (appendFirst ? '' : ';\n  ') + source;
      }

      return source;
    },

    // [blockValue]
    //
    // On stack, before: hash, inverse, program, value
    // On stack, after: return value of blockHelperMissing
    //
    // The purpose of this opcode is to take a block of the form
    // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
    // replace it on the stack with the result of properly
    // invoking blockHelperMissing.
    blockValue: function(name) {
      this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      var params = [this.contextName(0)];
      this.setupParams(name, 0, params);

      var blockName = this.popStack();
      params.splice(1, 0, blockName);

      this.push('blockHelperMissing.call(' + params.join(', ') + ')');
    },

    // [ambiguousBlockValue]
    //
    // On stack, before: hash, inverse, program, value
    // Compiler value, before: lastHelper=value of last found helper, if any
    // On stack, after, if no lastHelper: same as [blockValue]
    // On stack, after, if lastHelper: value
    ambiguousBlockValue: function() {
      this.aliases.blockHelperMissing = 'helpers.blockHelperMissing';

      // We're being a bit cheeky and reusing the options value from the prior exec
      var params = [this.contextName(0)];
      this.setupParams('', 0, params, true);

      this.flushInline();

      var current = this.topStack();
      params.splice(1, 0, current);

      this.pushSource("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
    },

    // [appendContent]
    //
    // On stack, before: ...
    // On stack, after: ...
    //
    // Appends the string value of `content` to the current buffer
    appendContent: function(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      }

      this.pendingContent = content;
    },

    // [append]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Coerces `value` to a String and appends it to the current buffer.
    //
    // If `value` is truthy, or 0, it is coerced into a string and appended
    // Otherwise, the empty string is appended
    append: function() {
      // Force anything that is inlined onto the stack so we don't have duplication
      // when we examine local
      this.flushInline();
      var local = this.popStack();
      this.pushSource('if (' + local + ' != null) { ' + this.appendToBuffer(local) + ' }');
      if (this.environment.isSimple) {
        this.pushSource("else { " + this.appendToBuffer("''") + " }");
      }
    },

    // [appendEscaped]
    //
    // On stack, before: value, ...
    // On stack, after: ...
    //
    // Escape `value` and append it to the buffer
    appendEscaped: function() {
      this.aliases.escapeExpression = 'this.escapeExpression';

      this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
    },

    // [getContext]
    //
    // On stack, before: ...
    // On stack, after: ...
    // Compiler value, after: lastContext=depth
    //
    // Set the value of the `lastContext` compiler value to the depth
    getContext: function(depth) {
      this.lastContext = depth;
    },

    // [pushContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext, ...
    //
    // Pushes the value of the current context onto the stack.
    pushContext: function() {
      this.pushStackLiteral(this.contextName(this.lastContext));
    },

    // [lookupOnContext]
    //
    // On stack, before: ...
    // On stack, after: currentContext[name], ...
    //
    // Looks up the value of `name` on the current context and pushes
    // it onto the stack.
    lookupOnContext: function(parts, falsy, scoped) {
      /*jshint -W083 */
      var i = 0,
          len = parts.length;

      if (!scoped && this.options.compat && !this.lastContext) {
        // The depthed query is expected to handle the undefined logic for the root level that
        // is implemented below, so we evaluate that directly in compat mode
        this.push(this.depthedLookup(parts[i++]));
      } else {
        this.pushContext();
      }

      for (; i < len; i++) {
        this.replaceStack(function(current) {
          var lookup = this.nameLookup(current, parts[i], 'context');
          // We want to ensure that zero and false are handled properly if the context (falsy flag)
          // needs to have the special handling for these values.
          if (!falsy) {
            return ' != null ? ' + lookup + ' : ' + current;
          } else {
            // Otherwise we can use generic falsy handling
            return ' && ' + lookup;
          }
        });
      }
    },

    // [lookupData]
    //
    // On stack, before: ...
    // On stack, after: data, ...
    //
    // Push the data lookup operator
    lookupData: function(depth, parts) {
      /*jshint -W083 */
      if (!depth) {
        this.pushStackLiteral('data');
      } else {
        this.pushStackLiteral('this.data(data, ' + depth + ')');
      }

      var len = parts.length;
      for (var i = 0; i < len; i++) {
        this.replaceStack(function(current) {
          return ' && ' + this.nameLookup(current, parts[i], 'data');
        });
      }
    },

    // [resolvePossibleLambda]
    //
    // On stack, before: value, ...
    // On stack, after: resolved value, ...
    //
    // If the `value` is a lambda, replace it on the stack by
    // the return value of the lambda
    resolvePossibleLambda: function() {
      this.aliases.lambda = 'this.lambda';

      this.push('lambda(' + this.popStack() + ', ' + this.contextName(0) + ')');
    },

    // [pushStringParam]
    //
    // On stack, before: ...
    // On stack, after: string, currentContext, ...
    //
    // This opcode is designed for use in string mode, which
    // provides the string value of a parameter along with its
    // depth rather than resolving it immediately.
    pushStringParam: function(string, type) {
      this.pushContext();
      this.pushString(type);

      // If it's a subexpression, the string result
      // will be pushed after this opcode.
      if (type !== 'sexpr') {
        if (typeof string === 'string') {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },

    emptyHash: function() {
      this.pushStackLiteral('{}');

      if (this.trackIds) {
        this.push('{}'); // hashIds
      }
      if (this.stringParams) {
        this.push('{}'); // hashContexts
        this.push('{}'); // hashTypes
      }
    },
    pushHash: function() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = {values: [], types: [], contexts: [], ids: []};
    },
    popHash: function() {
      var hash = this.hash;
      this.hash = this.hashes.pop();

      if (this.trackIds) {
        this.push('{' + hash.ids.join(',') + '}');
      }
      if (this.stringParams) {
        this.push('{' + hash.contexts.join(',') + '}');
        this.push('{' + hash.types.join(',') + '}');
      }

      this.push('{\n    ' + hash.values.join(',\n    ') + '\n  }');
    },

    // [pushString]
    //
    // On stack, before: ...
    // On stack, after: quotedString(string), ...
    //
    // Push a quoted version of `string` onto the stack
    pushString: function(string) {
      this.pushStackLiteral(this.quotedString(string));
    },

    // [push]
    //
    // On stack, before: ...
    // On stack, after: expr, ...
    //
    // Push an expression onto the stack
    push: function(expr) {
      this.inlineStack.push(expr);
      return expr;
    },

    // [pushLiteral]
    //
    // On stack, before: ...
    // On stack, after: value, ...
    //
    // Pushes a value onto the stack. This operation prevents
    // the compiler from creating a temporary variable to hold
    // it.
    pushLiteral: function(value) {
      this.pushStackLiteral(value);
    },

    // [pushProgram]
    //
    // On stack, before: ...
    // On stack, after: program(guid), ...
    //
    // Push a program expression onto the stack. This takes
    // a compile-time guid and converts it into a runtime-accessible
    // expression.
    pushProgram: function(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },

    // [invokeHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // Pops off the helper's parameters, invokes the helper,
    // and pushes the helper's return value onto the stack.
    //
    // If the helper is not found, `helperMissing` is called.
    invokeHelper: function(paramSize, name, isSimple) {
      this.aliases.helperMissing = 'helpers.helperMissing';

      var nonHelper = this.popStack();
      var helper = this.setupHelper(paramSize, name);

      var lookup = (isSimple ? helper.name + ' || ' : '') + nonHelper + ' || helperMissing';
      this.push('((' + lookup + ').call(' + helper.callParams + '))');
    },

    // [invokeKnownHelper]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of helper invocation
    //
    // This operation is used when the helper is known to exist,
    // so a `helperMissing` fallback is not required.
    invokeKnownHelper: function(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(helper.name + ".call(" + helper.callParams + ")");
    },

    // [invokeAmbiguous]
    //
    // On stack, before: hash, inverse, program, params..., ...
    // On stack, after: result of disambiguation
    //
    // This operation is used when an expression like `{{foo}}`
    // is provided, but we don't know at compile-time whether it
    // is a helper or a path.
    //
    // This operation emits more code than the other options,
    // and can be avoided by passing the `knownHelpers` and
    // `knownHelpersOnly` flags at compile-time.
    invokeAmbiguous: function(name, helperCall) {
      this.aliases.functionType = '"function"';
      this.aliases.helperMissing = 'helpers.helperMissing';
      this.useRegister('helper');

      var nonHelper = this.popStack();

      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);

      var helperName = this.lastHelper = this.nameLookup('helpers', name, 'helper');

      this.push(
        '((helper = (helper = ' + helperName + ' || ' + nonHelper + ') != null ? helper : helperMissing'
          + (helper.paramsInit ? '),(' + helper.paramsInit : '') + '),'
        + '(typeof helper === functionType ? helper.call(' + helper.callParams + ') : helper))');
    },

    // [invokePartial]
    //
    // On stack, before: context, ...
    // On stack after: result of partial invocation
    //
    // This operation pops off a context, invokes a partial with that context,
    // and pushes the result of the invocation back.
    invokePartial: function(name, indent) {
      var params = [this.nameLookup('partials', name, 'partial'), "'" + indent + "'", "'" + name + "'", this.popStack(), this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      } else if (this.options.compat) {
        params.push('undefined');
      }
      if (this.options.compat) {
        params.push('depths');
      }

      this.push("this.invokePartial(" + params.join(", ") + ")");
    },

    // [assignToHash]
    //
    // On stack, before: value, ..., hash, ...
    // On stack, after: ..., hash, ...
    //
    // Pops a value off the stack and assigns it to the current hash
    assignToHash: function(key) {
      var value = this.popStack(),
          context,
          type,
          id;

      if (this.trackIds) {
        id = this.popStack();
      }
      if (this.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }

      var hash = this.hash;
      if (context) {
        hash.contexts.push("'" + key + "': " + context);
      }
      if (type) {
        hash.types.push("'" + key + "': " + type);
      }
      if (id) {
        hash.ids.push("'" + key + "': " + id);
      }
      hash.values.push("'" + key + "': (" + value + ")");
    },

    pushId: function(type, name) {
      if (type === 'ID' || type === 'DATA') {
        this.pushString(name);
      } else if (type === 'sexpr') {
        this.pushStackLiteral('true');
      } else {
        this.pushStackLiteral('null');
      }
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        var index = this.matchExistingProgram(child);

        if (index == null) {
          this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
          index = this.context.programs.length;
          child.index = index;
          child.name = 'program' + index;
          this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
          this.context.environments[index] = child;

          this.useDepths = this.useDepths || compiler.useDepths;
        } else {
          child.index = index;
          child.name = 'program' + index;
        }
      }
    },
    matchExistingProgram: function(child) {
      for (var i = 0, len = this.context.environments.length; i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return i;
        }
      }
    },

    programExpression: function(guid) {
      var child = this.environment.children[guid],
          depths = child.depths.list,
          useDepths = this.useDepths,
          depth;

      var programParams = [child.index, 'data'];

      if (useDepths) {
        programParams.push('depths');
      }

      return 'this.program(' + programParams.join(', ') + ')';
    },

    useRegister: function(name) {
      if(!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },

    pushStackLiteral: function(item) {
      return this.push(new Literal(item));
    },

    pushSource: function(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent)));
        this.pendingContent = undefined;
      }

      if (source) {
        this.source.push(source);
      }
    },

    pushStack: function(item) {
      this.flushInline();

      var stack = this.incrStack();
      this.pushSource(stack + " = " + item + ";");
      this.compileStack.push(stack);
      return stack;
    },

    replaceStack: function(callback) {
      var prefix = '',
          inline = this.isInline(),
          stack,
          createdStack,
          usedLiteral;

      /* istanbul ignore next */
      if (!this.isInline()) {
        throw new Exception('replaceStack on non-inline');
      }

      // We want to merge the inline statement into the replacement statement via ','
      var top = this.popStack(true);

      if (top instanceof Literal) {
        // Literals do not need to be inlined
        prefix = stack = top.value;
        usedLiteral = true;
      } else {
        // Get or create the current stack name for use by the inline
        createdStack = !this.stackSlot;
        var name = !createdStack ? this.topStackName() : this.incrStack();

        prefix = '(' + this.push(name) + ' = ' + top + ')';
        stack = this.topStack();
      }

      var item = callback.call(this, stack);

      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push('(' + prefix + item + ')');
    },

    incrStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return this.topStackName();
    },
    topStackName: function() {
      return "stack" + this.stackSlot;
    },
    flushInline: function() {
      var inlineStack = this.inlineStack;
      if (inlineStack.length) {
        this.inlineStack = [];
        for (var i = 0, len = inlineStack.length; i < len; i++) {
          var entry = inlineStack[i];
          if (entry instanceof Literal) {
            this.compileStack.push(entry);
          } else {
            this.pushStack(entry);
          }
        }
      }
    },
    isInline: function() {
      return this.inlineStack.length;
    },

    popStack: function(wrapped) {
      var inline = this.isInline(),
          item = (inline ? this.inlineStack : this.compileStack).pop();

      if (!wrapped && (item instanceof Literal)) {
        return item.value;
      } else {
        if (!inline) {
          /* istanbul ignore next */
          if (!this.stackSlot) {
            throw new Exception('Invalid stack pop');
          }
          this.stackSlot--;
        }
        return item;
      }
    },

    topStack: function() {
      var stack = (this.isInline() ? this.inlineStack : this.compileStack),
          item = stack[stack.length - 1];

      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },

    contextName: function(context) {
      if (this.useDepths && context) {
        return 'depths[' + context + ']';
      } else {
        return 'depth' + context;
      }
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\u2028/g, '\\u2028')   // Per Ecma-262 7.3 + 7.8.4
        .replace(/\u2029/g, '\\u2029') + '"';
    },

    objectLiteral: function(obj) {
      var pairs = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          pairs.push(this.quotedString(key) + ':' + obj[key]);
        }
      }

      return '{' + pairs.join(',') + '}';
    },

    setupHelper: function(paramSize, name, blockHelper) {
      var params = [],
          paramsInit = this.setupParams(name, paramSize, params, blockHelper);
      var foundHelper = this.nameLookup('helpers', name, 'helper');

      return {
        params: params,
        paramsInit: paramsInit,
        name: foundHelper,
        callParams: [this.contextName(0)].concat(params).join(", ")
      };
    },

    setupOptions: function(helper, paramSize, params) {
      var options = {}, contexts = [], types = [], ids = [], param, inverse, program;

      options.name = this.quotedString(helper);
      options.hash = this.popStack();

      if (this.trackIds) {
        options.hashIds = this.popStack();
      }
      if (this.stringParams) {
        options.hashTypes = this.popStack();
        options.hashContexts = this.popStack();
      }

      inverse = this.popStack();
      program = this.popStack();

      // Avoid setting fn and inverse if neither are set. This allows
      // helpers to do a check for `if (options.fn)`
      if (program || inverse) {
        if (!program) {
          program = 'this.noop';
        }

        if (!inverse) {
          inverse = 'this.noop';
        }

        options.fn = program;
        options.inverse = inverse;
      }

      // The parameters go on to the stack in order (making sure that they are evaluated in order)
      // so we need to pop them off the stack in reverse order
      var i = paramSize;
      while (i--) {
        param = this.popStack();
        params[i] = param;

        if (this.trackIds) {
          ids[i] = this.popStack();
        }
        if (this.stringParams) {
          types[i] = this.popStack();
          contexts[i] = this.popStack();
        }
      }

      if (this.trackIds) {
        options.ids = "[" + ids.join(",") + "]";
      }
      if (this.stringParams) {
        options.types = "[" + types.join(",") + "]";
        options.contexts = "[" + contexts.join(",") + "]";
      }

      if (this.options.data) {
        options.data = "data";
      }

      return options;
    },

    // the params and contexts arguments are passed in arrays
    // to fill in
    setupParams: function(helperName, paramSize, params, useRegister) {
      var options = this.objectLiteral(this.setupOptions(helperName, paramSize, params));

      if (useRegister) {
        this.useRegister('options');
        params.push('options');
        return 'options=' + options;
      } else {
        params.push(options);
        return '';
      }
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };

  __exports__ = JavaScriptCompiler;
  return __exports__;
})(__module2__, __module5__);

// handlebars.js
var __module0__ = (function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__) {
  "use strict";
  var __exports__;
  /*globals Handlebars: true */
  var Handlebars = __dependency1__;

  // Compiler imports
  var AST = __dependency2__;
  var Parser = __dependency3__.parser;
  var parse = __dependency3__.parse;
  var Compiler = __dependency4__.Compiler;
  var compile = __dependency4__.compile;
  var precompile = __dependency4__.precompile;
  var JavaScriptCompiler = __dependency5__;

  var _create = Handlebars.create;
  var create = function() {
    var hb = _create();

    hb.compile = function(input, options) {
      return compile(input, options, hb);
    };
    hb.precompile = function (input, options) {
      return precompile(input, options, hb);
    };

    hb.AST = AST;
    hb.Compiler = Compiler;
    hb.JavaScriptCompiler = JavaScriptCompiler;
    hb.Parser = Parser;
    hb.parse = parse;

    return hb;
  };

  Handlebars = create();
  Handlebars.create = create;

  Handlebars['default'] = Handlebars;

  __exports__ = Handlebars;
  return __exports__;
})(__module1__, __module7__, __module8__, __module11__, __module12__);

  return __module0__;
}));


return module.exports;
});

_define_("templatable/templatable", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var Handlebars = _using_("templatable/handlebars")['default'];

var compiledTemplates = {};

// 提供 Template 模板支持，默认引擎是 Handlebars
module.exports = {

  // Handlebars 的 helpers
  templateHelpers: null,

  // Handlebars 的 partials
  templatePartials: null,

  // template 对应的 DOM-like object
  templateObject: null,

  // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
  parseElementFromTemplate: function () {
    // template 支持 id 选择器
    var t, template = this.get('template');
    if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
      template = t.innerHTML;
      this.set('template', template);
    }
    this.templateObject = convertTemplateToObject(template);
    this.element = $(this.compile());
  },

  // 编译模板，混入数据，返回 html 结果
  compile: function (template, model) {
    template || (template = this.get('template'));

    model || (model = this.get('model')) || (model = {});
    if (model.toJSON) {
      model = model.toJSON();
    }

    // handlebars runtime，注意 partials 也需要预编译
    if (isFunction(template)) {
      return template(model, {
        helpers: this.templateHelpers,
        partials: precompile(this.templatePartials)
      });
    } else {
      var helpers = this.templateHelpers;
      var partials = this.templatePartials;
      var helper, partial;

      // 注册 helpers
      if (helpers) {
        for (helper in helpers) {
          if (helpers.hasOwnProperty(helper)) {
            Handlebars.registerHelper(helper, helpers[helper]);
          }
        }
      }
      // 注册 partials
      if (partials) {
        for (partial in partials) {
          if (partials.hasOwnProperty(partial)) {
            Handlebars.registerPartial(partial, partials[partial]);
          }
        }
      }

      var compiledTemplate = compiledTemplates[template];
      if (!compiledTemplate) {
        compiledTemplate = compiledTemplates[template] = Handlebars.compile(template);
      }

      // 生成 html
      var html = compiledTemplate(model);

      // 卸载 helpers
      if (helpers) {
        for (helper in helpers) {
          if (helpers.hasOwnProperty(helper)) {
            delete Handlebars.helpers[helper];
          }
        }
      }
      // 卸载 partials
      if (partials) {
        for (partial in partials) {
          if (partials.hasOwnProperty(partial)) {
            delete Handlebars.partials[partial];
          }
        }
      }
      return html;
    }
  },

  // 刷新 selector 指定的局部区域
  renderPartial: function (selector) {
    if (this.templateObject) {
      var template = convertObjectToTemplate(this.templateObject, selector);

      if (template) {
        if (selector) {
          this.$(selector).html(this.compile(template));
        } else {
          this.element.html(this.compile(template));
        }
      } else {
        this.element.html(this.compile());
      }
    }

    // 如果 template 已经编译过了，templateObject 不存在
    else {
      var all = $(this.compile());
      var selected = all.find(selector);
      if (selected.length) {
        this.$(selector).html(selected.html());
      } else {
        this.element.html(all.html());
      }
    }

    return this;
  }
};


// Helpers
// -------
var _compile = Handlebars.compile;

Handlebars.compile = function (template) {
  return isFunction(template) ? template : _compile.call(Handlebars, template);
};

// 将 template 字符串转换成对应的 DOM-like object


function convertTemplateToObject(template) {
  return isFunction(template) ? null : $(encode(template));
}

// 根据 selector 得到 DOM-like template object，并转换为 template 字符串


function convertObjectToTemplate(templateObject, selector) {
  if (!templateObject) return;

  var element;
  if (selector) {
    element = templateObject.find(selector);
    if (element.length === 0) {
      throw new Error('Invalid template selector: ' + selector);
    }
  } else {
    element = templateObject;
  }
  return decode(element.html());
}

function encode(template) {
  return template
  // 替换 {{xxx}} 为 <!-- {{xxx}} -->
  .replace(/({[^}]+}})/g, '<!--$1-->')
  // 替换 src="{{xxx}}" 为 data-TEMPLATABLE-src="{{xxx}}"
  .replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g, ' data-templatable-$1=$2$3$2');
}

function decode(template) {
  return template.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, '$1').replace(/data-templatable-/ig, '');
}

function isFunction(obj) {
  return typeof obj === "function";
}

function precompile(partials) {
  if (!partials) return {};

  var result = {};
  for (var name in partials) {
    var partial = partials[name];
    result[name] = isFunction(partial) ? partial : Handlebars.compile(partial);
  }
  return result;
};

// 调用 renderPartial 时，Templatable 对模板有一个约束：
// ** template 自身必须是有效的 html 代码片段**，比如
//   1. 代码闭合
//   2. 嵌套符合规范
//
// 总之，要保证在 template 里，将 `{{...}}` 转换成注释后，直接 innerHTML 插入到
// DOM 中，浏览器不会自动增加一些东西。比如：
//
// tbody 里没有 tr：
//  `<table><tbody>{{#each items}}<td>{{this}}</td>{{/each}}</tbody></table>`
//
// 标签不闭合：
//  `<div><span>{{name}}</div>`


return module.exports;
});

_define_("templatable", function(_using_){
var module = {},exports = module.exports = {};

// exports

var CMP = __gbl__.CMP || {};

if(!CMP.Templatable){
	CMP.Templatable = _using_("templatable/templatable");
	CMP.Templatable.Handlebars = _using_("templatable/handlebars");
}

module.exports = CMP.Templatable;

return module.exports;
});

_using_("templatable");

})();

/**
===============================
component : cookie
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("cookie/cookie", function(_using_){
var module = {},exports = module.exports = {};

// Cookie
// -------------
// Thanks to:
//  - http://www.nczonline.net/blog/2009/05/05/http-cookies-explained/
//  - http://developer.yahoo.com/yui/3/cookie/


var Cookie = exports;

var decode = decodeURIComponent;
var encode = encodeURIComponent;


/**
 * Returns the cookie value for the given name.
 *
 * @param {String} name The name of the cookie to retrieve.
 *
 * @param {Function|Object} options (Optional) An object containing one or
 *     more cookie options: raw (true/false) and converter (a function).
 *     The converter function is run on the value before returning it. The
 *     function is not used if the cookie doesn't exist. The function can be
 *     passed instead of the options object for conveniently. When raw is
 *     set to true, the cookie value is not URI decoded.
 *
 * @return {*} If no converter is specified, returns a string or undefined
 *     if the cookie doesn't exist. If the converter is specified, returns
 *     the value returned from the converter.
 */
Cookie.get = function(name, options) {
    validateCookieName(name);

    if (typeof options === 'function') {
        options = { converter: options };
    }
    else {
        options = options || {};
    }

    var cookies = parseCookieString(document.cookie, !options['raw']);
    return (options.converter || same)(cookies[name]);
};


/**
 * Sets a cookie with a given name and value.
 *
 * @param {string} name The name of the cookie to set.
 *
 * @param {*} value The value to set for the cookie.
 *
 * @param {Object} options (Optional) An object containing one or more
 *     cookie options: path (a string), domain (a string),
 *     expires (number or a Date object), secure (true/false),
 *     and raw (true/false). Setting raw to true indicates that the cookie
 *     should not be URI encoded before being set.
 *
 * @return {string} The created cookie string.
 */
Cookie.set = function(name, value, options) {
    validateCookieName(name);

    options = options || {};
    var expires = options['expires'];
    var domain = options['domain'];
    var path = options['path'];

    if (!options['raw']) {
        value = encode(String(value));
    }

    var text = name + '=' + value;

    // expires
    var date = expires;
    if (typeof date === 'number') {
        date = new Date();
        date.setDate(date.getDate() + expires);
    }
    if (date instanceof Date) {
        text += '; expires=' + date.toUTCString();
    }

    // domain
    if (isNonEmptyString(domain)) {
        text += '; domain=' + domain;
    }

    // path
    if (isNonEmptyString(path)) {
        text += '; path=' + path;
    }

    // secure
    if (options['secure']) {
        text += '; secure';
    }

    document.cookie = text;
    return text;
};


/**
 * Removes a cookie from the machine by setting its expiration date to
 * sometime in the past.
 *
 * @param {string} name The name of the cookie to remove.
 *
 * @param {Object} options (Optional) An object containing one or more
 *     cookie options: path (a string), domain (a string),
 *     and secure (true/false). The expires option will be overwritten
 *     by the method.
 *
 * @return {string} The created cookie string.
 */
Cookie.remove = function(name, options) {
    options = options || {};
    options['expires'] = new Date(0);
    return this.set(name, '', options);
};


function parseCookieString(text, shouldDecode) {
    var cookies = {};

    if (isString(text) && text.length > 0) {

        var decodeValue = shouldDecode ? decode : same;
        var cookieParts = text.split(/;\s/g);
        var cookieName;
        var cookieValue;
        var cookieNameValue;

        for (var i = 0, len = cookieParts.length; i < len; i++) {

            // Check for normally-formatted cookie (name-value)
            cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
            if (cookieNameValue instanceof Array) {
                try {
                    cookieName = decode(cookieNameValue[1]);
                    cookieValue = decodeValue(cookieParts[i]
                            .substring(cookieNameValue[1].length + 1));
                } catch (ex) {
                    // Intentionally ignore the cookie -
                    // the encoding is wrong
                }
            } else {
                // Means the cookie does not have an "=", so treat it as
                // a boolean flag
                cookieName = decode(cookieParts[i]);
                cookieValue = '';
            }

            if (cookieName) {
                cookies[cookieName] = cookieValue;
            }
        }

    }

    return cookies;
}


// Helpers

function isString(o) {
    return typeof o === 'string';
}

function isNonEmptyString(s) {
    return isString(s) && s !== '';
}

function validateCookieName(name) {
    if (!isNonEmptyString(name)) {
        throw new TypeError('Cookie name must be a non-empty string');
    }
}

function same(s) {
    return s;
}


return module.exports;
});

_define_("cookie", function(_using_){
var module = {},exports = module.exports = {};

// exports

module.exports = (__gbl__.CMP || {}).Cookie = _using_("cookie/cookie");

return module.exports;
});

_using_("cookie");

})();

/**
===============================
component : messenger
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("messenger/messenger", function(_using_){
var module = {},exports = module.exports = {};

/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 */

module.exports = (function(){

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    var prefix = "fnx-messenger",
        supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name){
        var errMsg = '';
        if(arguments.length < 2){
            errMsg = 'target error - target and name are both required';
        } else if (typeof target != 'object'){
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string'){
            errMsg = 'target error - target name must be string type';
        }
        if(errMsg){
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if ( supportPostMessage ){
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg){
            this.target.postMessage(prefix + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg){
            var targetFunc = window.navigator[prefix + this.name];
            if ( typeof targetFunc == 'function' ) {
                targetFunc(prefix + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        prefix = projectName || prefix;
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function(){
        var self = this;
        var generalCallback = function(msg){
            if(typeof msg == 'object' && msg.data){
                msg = msg.data;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };

        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', generalCallback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function(){
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };

    return Messenger;

})();


return module.exports;
});

_define_("messenger", function(_using_){
var module = {},exports = module.exports = {};

// exports

module.exports = (__gbl__.CMP || {}).Messenger = _using_("messenger/messenger");

return module.exports;
});

_using_("messenger");

})();

/**
===============================
component : sticky
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("sticky/sticky", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery"),
    doc = $(document),
    stickyPrefix = ["-webkit-", "-ms-", "-o-", "-moz-", ""],
    guid = 0,

    ua = (window.navigator.userAgent || "").toLowerCase(),
    isIE = ua.indexOf("msie") !== -1,
    isIE6 = ua.indexOf("msie 6") !== -1;

var isPositionStickySupported = checkPositionStickySupported(),
    isPositionFixedSupported = checkPositionFixedSupported();


// Sticky
// position: sticky simulator
function Sticky(options) {
    this.options = options || {};
    this.elem = $(this.options.element);        
    this.callback = options.callback || function() {};
    this.position = options.position;
    this._stickyId = guid++;
}

Sticky.prototype._prepare = function() {
    // save element's origin position
    var offset = this.elem.offset();
    this._originTop = offset.top;
    this._originLeft = offset.left;

    // if is fixed, force to call this_supportFixed
    if (this.position.top === Number.MAX_VALUE) {
        this._callFix = true;
        this.position.top = this._originTop;
    }

    // save element's origin style
    this._originStyles = {
        position: null,
        top: null,
        bottom: null,
        left: null
    };
    for (var style in this._originStyles) {
        if (this._originStyles.hasOwnProperty(style)) {
            this._originStyles[style] = this.elem.css(style);
        }
    }
};

Sticky.prototype.render = function () {
    var self = this;

    // only bind once
    if (!this.elem.length || this.elem.data('bind-sticked')) {
        return this;
    }

    this._prepare();

    // if other element change height in one page,
    // or if resize window,
    // need adjust sticky element's status
    this.adjust = function() {
        self._restore();

        var offset = self.elem.offset();
        self._originTop = offset.top;
        self._originLeft = offset.left;

        scrollFn.call(self);
    };

    var scrollFn;
    if (sticky.isPositionStickySupported && !this._callFix) {
        scrollFn = this._supportSticky;

        // set position: sticky directly
        var tmp = "";
        for (var i = 0; i < stickyPrefix.length; i++) {
            tmp += "position:" + stickyPrefix[i] + "sticky;";
        }
        if (this.position.top !== undefined) {
            tmp += "top: " + this.position.top + "px;";
        }
        if (this.position.bottom !== undefined) {
            tmp += "bottom: " + this.position.bottom + "px;";
        }
        this.elem[0].style.cssText += tmp;

        this.adjust = function() {
            scrollFn.call(self);
        };
    } else if (sticky.isPositionFixedSupported) {
        scrollFn = this._supportFixed;
    } else {
        scrollFn = this._supportAbsolute;   // ie6
        // avoid floatImage Shake for IE6
        // see: https://github.com/lifesinger/lifesinger.
        //      github.com/blob/master/lab/2009/ie6sticked_position_v4.html
        $("<style type='text/css'> * html" +
          "{ background:url(null) no-repeat fixed; } </style>").appendTo("head");
    }

    // first run after document ready
    scrollFn.call(this);

    // stickyX is event namespace
    $(window).on('scroll.sticky' + this._stickyId, function () {
        if (!self.elem.is(':visible')) return;
        scrollFn.call(self);
    });

    $(window).on('resize.sticky' + this._stickyId, debounce(function() {
        self.adjust();
    }, 120));

    this.elem.data('bind-sticked', true);

    return this;
};

Sticky.prototype._getTopBottom = function(scrollTop, offsetTop) {
    var top;
    var bottom;

    // top is true when the distance from element to top of window <= position.top
    if (this.position.top !== undefined) {
        top = offsetTop - scrollTop <= this.position.top;
    }
    // bottom is true when the distance is from bottom of element to bottom of window <= position.bottom
    if (this.position.bottom !== undefined) {
        bottom = scrollTop + $(window).height() - offsetTop - this.elem.outerHeight() <= this.position.bottom;
    }

    return {
        top: top,
        bottom: bottom
    };
};

Sticky.prototype._supportFixed = function () {
    var _sticky = this.elem.data('sticked');
    var distance = this._getTopBottom(doc.scrollTop(), this._originTop);

    if (!_sticky &&
        (distance.top !== undefined && distance.top ||
            distance.bottom !== undefined && distance.bottom)) {
        this._addPlaceholder();

        this.elem.css($.extend({
            position: 'fixed',
            left: this._originLeft
        }, distance.top ? { top: this.position.top } : { bottom: this.position.bottom }));
        this.elem.data('sticked', true);
        this.callback.call(this, true);
    } else if (_sticky && !distance.top && !distance.bottom) {
        this._restore();
    }
};

Sticky.prototype._supportAbsolute = function () {
    var scrollTop = doc.scrollTop();
    var _sticky = this.elem.data('sticked');
    var distance = this._getTopBottom(scrollTop, this.elem.offset().top);

    if (distance.top || distance.bottom || this._callFix) {
        // sticky status change only one time
        if (!_sticky) {
            this._addPlaceholder();
            this.elem.data('sticked', true);
            this.callback.call(this, true);
        }
        // update element's position
        this.elem.css({
            position: 'absolute',
            top: this._callFix ? this._originTop + scrollTop: (distance.top ? this.position.top + scrollTop :
                scrollTop + $(window).height() - this.position.bottom - this.elem.outerHeight())
        });
    } else if (_sticky && !distance.top && !distance.bottom) {
        this._restore();
    }
};

Sticky.prototype._supportSticky = function () {
    // sticky status change for callback
    var _sticky = this.elem.data('sticked');
    var distance = this._getTopBottom(doc.scrollTop(), this.elem.offset().top);

    if (!_sticky &&
        (distance.top !== undefined && distance.top ||
            distance.bottom !== undefined && distance.bottom)) {
        this.elem.data('sticked', true);
        this.callback.call(this, true);
    } else if (_sticky && !distance.top && !distance.bottom){
        // don't need restore style and remove placeholder
        this.elem.data('sticked', false);
        this.callback.call(this, false);
    }
};

Sticky.prototype._restore = function () {
    this._removePlaceholder();

    // set origin style
    this.elem.css(this._originStyles);

    this.elem.data('sticked', false);

    this.callback.call(this, false);
};

// need placeholder when: 1) position: static or relative, but expect for display != block
Sticky.prototype._addPlaceholder = function() {
    var need = false;
    var position = this.elem.css("position");

    if (position === 'static' || position === 'relative') {
        need = true;
    }
    if (this.elem.css("display") !== "block") {
        need = false;
    }

    if (need) {
        this._placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');
        this._placeholder.width(this.elem.outerWidth(true))
            .height(this.elem.outerHeight(true))
            .css("float", this.elem.css("float")).insertAfter(this.elem);
    }
};

Sticky.prototype._removePlaceholder = function() {
    // remove placeholder if has
    this._placeholder && this._placeholder.remove();
};

Sticky.prototype.destroy = function () {
    this._restore();
    this.elem.data("bind-sticked", false);
    $(window).off('scroll.sticky' + this._stickyId);
    $(window).off('resize.sticky' + this._stickyId);
};

// APIs
// ---

module.exports = sticky;

function sticky(elem, position, callback) {
    if (!$.isPlainObject(position)) {
        position = {
            top: position
        };
    }
    if (position.top === undefined && position.bottom === undefined) {
        position.top = 0;
    }
    return (new Sticky({
        element: elem,
        position: position,
        callback: callback
    })).render();
}

// sticky.stick(elem, position, callback)
sticky.stick = sticky;

// sticky.fix(elem)
sticky.fix =  function (elem) {
    return (new Sticky({
        element: elem,
        // position.top is Number.MAX_VALUE means fixed
        position: {
            top: Number.MAX_VALUE
        }
    })).render();
};

// for tc
sticky.isPositionStickySupported = isPositionStickySupported;
sticky.isPositionFixedSupported = isPositionFixedSupported;

// Helper
// ---
function checkPositionFixedSupported() {
    return !isIE6;
}

function checkPositionStickySupported() {
    if (isIE) return false;

    var container = doc[0].body;

    if (doc[0].createElement && container && container.appendChild && container.removeChild) {
        var isSupported,
            el = doc[0].createElement("div"),
            getStyle = function (st) {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(el).getPropertyValue(st);
                } else {
                    return el.currentStyle.getAttribute(st);
                }
            };

        container.appendChild(el);

        for (var i = 0; i < stickyPrefix.length; i++) {
            el.style.cssText = "position:" + stickyPrefix[i] + "sticky;visibility:hidden;";
            if (isSupported = getStyle("position").indexOf("sticky") !== -1) break;
        }

        el.parentNode.removeChild(el);
        return isSupported;
    }
}

// https://github.com/jashkenas/underscore/blob/master/underscore.js#L699
function getTime() {
    return (Date.now || function() {
        return new Date().getTime();
    })()
}
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
        context = this;
        args = arguments;
        timestamp = getTime();
        var later = function() {
            var last = getTime() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) result = func.apply(context, args);
        return result;
    };
}


return module.exports;
});

_define_("sticky", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');
module.exports = (__gbl__.CMP || {}).Sticky = _using_("sticky/sticky");

return module.exports;
});

_using_("sticky");

})();

/**
===============================
component : easing
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("easing/easing", function(_using_){
var module = {},exports = module.exports = {};

// Based on Easing Equations (c) 2003 Robert Penner, all rights reserved.
// This work is subject to the terms in
// http://www.robertpenner.com/easing_terms_of_use.html
// Preview: http://www.robertpenner.com/Easing/easing_demo.html
//
// Thanks to:
//  - https://github.com/yui/yui3/blob/master/src/anim/js/anim-easing.js
//  - https://github.com/gilmoreorless/jquery-easing-molecules


var PI = Math.PI;
var pow = Math.pow;
var sin = Math.sin;
var MAGIC_NUM = 1.70158; // Penner's magic number


/**
 * 和 YUI 的 Easing 相比，这里的 Easing 进行了归一化处理，参数调整为：
 * @param {Number} t Time value used to compute current value 0 =< t <= 1
 * @param {Number} b Starting value  b = 0
 * @param {Number} c Delta between start and end values  c = 1
 * @param {Number} d Total length of animation d = 1
 */
var Easing = {

    /**
     * Uniform speed between points.
     */
    easeNone: function(t) {
        return t;
    },

    /**
     * Begins slowly and accelerates towards end. (quadratic)
     */
    easeIn: function(t) {
        return t * t;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     */
    easeOut: function(t) {
        return (2 - t) * t;
    },

    /**
     * Begins slowly and decelerates towards end. (quadratic)
     */
    easeBoth: function(t) {
        return (t *= 2) < 1 ?
                .5 * t * t :
                .5 * (1 - (--t) * (t - 2));
    },

    /**
     * Begins slowly and accelerates towards end. (quartic)
     */
    easeInStrong: function(t) {
        return t * t * t * t;
    },
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     */
    easeOutStrong: function(t) {
        return 1 - (--t) * t * t * t;
    },

    /**
     * Begins slowly and decelerates towards end. (quartic)
     */
    easeBothStrong: function(t) {
        return (t *= 2) < 1 ?
                .5 * t * t * t * t :
                .5 * (2 - (t -= 2) * t * t * t);
    },

    /**
     * Backtracks slightly, then reverses direction and moves to end.
     */
    backIn: function(t) {
        if (t === 1) t -= .001;
        return t * t * ((MAGIC_NUM + 1) * t - MAGIC_NUM);
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     */
    backOut: function(t) {
        return (t -= 1) * t * ((MAGIC_NUM + 1) * t + MAGIC_NUM) + 1;
    },

    /**
     * Backtracks slightly, then reverses direction, overshoots end,
     * then reverses and comes back to end.
     */
    backBoth: function(t) {
        var s = MAGIC_NUM;
        var m = (s *= 1.525) + 1;

        if ((t *= 2 ) < 1) {
            return .5 * (t * t * (m * t - s));
        }
        return .5 * ((t -= 2) * t * (m * t + s) + 2);
    },

    /**
     * Snap in elastic effect.
     */
    elasticIn: function(t) {
        var p = .3, s = p / 4;
        if (t === 0 || t === 1) return t;
        return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
    },

    /**
     * Snap out elastic effect.
     */
    elasticOut: function(t) {
        var p = .3, s = p / 4;
        if (t === 0 || t === 1) return t;
        return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
    },

    /**
     * Snap both elastic effect.
     */
    elasticBoth: function(t) {
        var p = .45, s = p / 4;
        if (t === 0 || (t *= 2) === 2) return t;

        if (t < 1) {
            return -.5 * (pow(2, 10 * (t -= 1)) *
                    sin((t - s) * (2 * PI) / p));
        }
        return pow(2, -10 * (t -= 1)) *
                sin((t - s) * (2 * PI) / p) * .5 + 1;
    },

    /**
     * Bounce off of start.
     */
    bounceIn: function(t) {
        return 1 - Easing.bounceOut(1 - t);
    },

    /**
     * Bounces off end.
     */
    bounceOut: function(t) {
        var s = 7.5625, r;

        if (t < (1 / 2.75)) {
            r = s * t * t;
        }
        else if (t < (2 / 2.75)) {
            r = s * (t -= (1.5 / 2.75)) * t + .75;
        }
        else if (t < (2.5 / 2.75)) {
            r = s * (t -= (2.25 / 2.75)) * t + .9375;
        }
        else {
            r = s * (t -= (2.625 / 2.75)) * t + .984375;
        }

        return r;
    },

    /**
     * Bounces off start and end.
     */
    bounceBoth: function(t) {
        if (t < .5) {
            return Easing.bounceIn(t * 2) * .5;
        }
        return Easing.bounceOut(t * 2 - 1) * .5 + .5;
    }
};

// 可以通过 require 获取
module.exports = Easing;


// 也可以直接通过 jQuery.easing 来使用
var $ = _using_("jquery");
$.extend($.easing, Easing);


return module.exports;
});

_define_("easing", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');
module.exports = (__gbl__.CMP || {}).Easing = _using_("easing/easing");

return module.exports;
});

_using_("easing");

})();

/**
===============================
component : position
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("position/position", function(_using_){
var module = {},exports = module.exports = {};

// Position
// --------
// 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
// 代码易改，人生难得

var Position = exports,
    VIEWPORT = { _id: 'VIEWPORT', nodeType: 1 },
    $ = _using_("jquery"),
    isPinFixed = false,
    ua = (window.navigator.userAgent || "").toLowerCase(),
    isIE6 = ua.indexOf("msie 6") !== -1;


// 将目标元素相对于基准元素进行定位
// 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
Position.pin = function(pinObject, baseObject) {

    // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
    pinObject = normalize(pinObject);
    baseObject = normalize(baseObject);

    // if pinObject.element is not present
    // https://github.com/aralejs/position/pull/11
    if (pinObject.element === VIEWPORT ||
        pinObject.element._id === 'VIEWPORT') {
        return;
    }

    // 设定目标元素的 position 为绝对定位
    // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
    var pinElement = $(pinObject.element);

    if (pinElement.css('position') !== 'fixed' || isIE6) {
        pinElement.css('position', 'absolute');
        isPinFixed = false;
    }
    else {
        // 定位 fixed 元素的标志位，下面有特殊处理
        isPinFixed = true;
    }

    // 将位置属性归一化为数值
    // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
    //    否则获取的宽高有可能不对
    posConverter(pinObject);
    posConverter(baseObject);

    var parentOffset = getParentOffset(pinElement);
    var baseOffset = baseObject.offset();

    // 计算目标元素的位置
    var top = baseOffset.top + baseObject.y -
            pinObject.y - parentOffset.top;

    var left = baseOffset.left + baseObject.x -
            pinObject.x - parentOffset.left;

    // 定位目标元素
    pinElement.css({ left: left, top: top });
};


// 将目标元素相对于基准元素进行居中定位
// 接受两个参数，分别为目标元素和定位的基准元素，都是 DOM 节点类型
Position.center = function(pinElement, baseElement) {
    Position.pin({
        element: pinElement,
        x: '50%',
        y: '50%'
    }, {
        element: baseElement,
        x: '50%',
        y: '50%'
    });
};


// 这是当前可视区域的伪 DOM 节点
// 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
Position.VIEWPORT = VIEWPORT;


// Helpers
// -------

// 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
function normalize(posObject) {
    posObject = toElement(posObject) || {};

    if (posObject.nodeType) {
        posObject = { element: posObject };
    }

    var element = toElement(posObject.element) || VIEWPORT;
    if (element.nodeType !== 1) {
        throw new Error('posObject.element is invalid.');
    }

    var result = {
        element: element,
        x: posObject.x || 0,
        y: posObject.y || 0
    };

    // config 的深度克隆会替换掉 Position.VIEWPORT, 导致直接比较为 false
    var isVIEWPORT = (element === VIEWPORT || element._id === 'VIEWPORT');

    // 归一化 offset
    result.offset = function() {
        // 若定位 fixed 元素，则父元素的 offset 没有意义
        if (isPinFixed) {
            return {
                left: 0,
                top: 0
            };
        }
        else if (isVIEWPORT) {
            return {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop()
            };
        }
        else {
            return getOffset($(element)[0]);
        }
    };

    // 归一化 size, 含 padding 和 border
    result.size = function() {
        var el = isVIEWPORT ? $(window) : $(element);
        return {
            width: el.outerWidth(),
            height: el.outerHeight()
        };
    };

    return result;
}

// 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
function posConverter(pinObject) {
    pinObject.x = xyConverter(pinObject.x, pinObject, 'width');
    pinObject.y = xyConverter(pinObject.y, pinObject, 'height');
}

// 处理 x, y 值，都转化为数字
function xyConverter(x, pinObject, type) {
    // 先转成字符串再说！好处理
    x = x + '';

    // 处理 px
    x = x.replace(/px/gi, '');

    // 处理 alias
    if (/\D/.test(x)) {
        x = x.replace(/(?:top|left)/gi, '0%')
             .replace(/center/gi, '50%')
             .replace(/(?:bottom|right)/gi, '100%');
    }

    // 将百分比转为像素值
    if (x.indexOf('%') !== -1) {
        //支持小数
        x = x.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
            return pinObject.size()[type] * (d / 100.0);
        });
    }

    // 处理类似 100%+20px 的情况
    if (/[+\-*\/]/.test(x)) {
        try {
            // eval 会影响压缩
            // new Function 方法效率高于 for 循环拆字符串的方法
            // 参照：http://jsperf.com/eval-newfunction-for
            x = (new Function('return ' + x))();
        } catch (e) {
            throw new Error('Invalid position value: ' + x);
        }
    }

    // 转回为数字
    return numberize(x);
}

// 获取 offsetParent 的位置
function getParentOffset(element) {
    var parent = element.offsetParent();

    // IE7 下，body 子节点的 offsetParent 为 html 元素，其 offset 为
    // { top: 2, left: 2 }，会导致定位差 2 像素，所以这里将 parent
    // 转为 document.body
    if (parent[0] === document.documentElement) {
        parent = $(document.body);
    }

    // 修正 ie6 下 absolute 定位不准的 bug
    if (isIE6) {
        parent.css('zoom', 1);
    }

    // 获取 offsetParent 的 offset
    var offset;

    // 当 offsetParent 为 body，
    // 而且 body 的 position 是 static 时
    // 元素并不按照 body 来定位，而是按 document 定位
    // http://jsfiddle.net/afc163/hN9Tc/2/
    // 因此这里的偏移值直接设为 0 0
    if (parent[0] === document.body &&
        parent.css('position') === 'static') {
            offset = { top:0, left: 0 };
    } else {
        offset = getOffset(parent[0]);
    }

    // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
    offset.top += numberize(parent.css('border-top-width'));
    offset.left += numberize(parent.css('border-left-width'));

    return offset;
}

function numberize(s) {
    return parseFloat(s, 10) || 0;
}

function toElement(element) {
    return $(element)[0];
}

// fix jQuery 1.7.2 offset
// document.body 的 position 是 absolute 或 relative 时
// jQuery.offset 方法无法正确获取 body 的偏移值
//   -> http://jsfiddle.net/afc163/gMAcp/
// jQuery 1.9.1 已经修正了这个问题
//   -> http://jsfiddle.net/afc163/gMAcp/1/
// 这里先实现一份
// 参照 kissy 和 jquery 1.9.1
//   -> https://github.com/kissyteam/kissy/blob/master/src/dom/sub-modules/base/src/base/offset.js#L366
//   -> https://github.com/jquery/jquery/blob/1.9.1/src/offset.js#L28
function getOffset(element) {
    var box = element.getBoundingClientRect(),
        docElem = document.documentElement;

    // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
    return {
        left: box.left + (window.pageXOffset || docElem.scrollLeft) -
              (docElem.clientLeft || document.body.clientLeft  || 0),
        top: box.top  + (window.pageYOffset || docElem.scrollTop) -
             (docElem.clientTop || document.body.clientTop  || 0)
    };
}


return module.exports;
});

_define_("position", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

module.exports = (__gbl__.CMP || {}).Position = _using_("position/position");

return module.exports;
});

_using_("position");

})();

/**
===============================
component : iframe-shim
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("iframe-shim/iframe-shim", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var Position = _share_("position");

var isIE6 = (window.navigator.userAgent || '').toLowerCase().indexOf('msie 6') !== -1;

// target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
function Shim(target) {
    // 如果选择器选了多个 DOM，则只取第一个
    this.target = $(target).eq(0);
}

// 根据目标元素计算 iframe 的显隐、宽高、定位
Shim.prototype.sync = function() {
    var target = this.target;
    var iframe = this.iframe;

    // 如果未传 target 则不处理
    if (!target.length) return this;

    var height = target.outerHeight();
    var width = target.outerWidth();

    // 如果目标元素隐藏，则 iframe 也隐藏
    // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
    // http://api.jquery.com/hidden-selector/
    if (!height || !width || target.is(':hidden')) {
        iframe && iframe.hide();
    } else {
        // 第一次显示时才创建：as lazy as possible
        iframe || (iframe = this.iframe = createIframe(target));

        iframe.css({
            'height': height,
            'width': width
        });

        Position.pin(iframe[0], target[0]);
        iframe.show();
    }

    return this;
};

// 销毁 iframe 等
Shim.prototype.destroy = function() {
    if (this.iframe) {
        this.iframe.remove();
        delete this.iframe;
    }
    delete this.target;
};

if (isIE6) {
    module.exports = Shim;
} else {
    // 除了 IE6 都返回空函数
    function Noop() {}

    Noop.prototype.sync = function() {return this};
    Noop.prototype.destroy = Noop;

    module.exports = Noop;
}

// Helpers

// 在 target 之前创建 iframe，这样就没有 z-index 问题
// iframe 永远在 target 下方
function createIframe(target) {
    var css = {
        display: 'none',
        border: 'none',
        opacity: 0,
        position: 'absolute'
    };

    // 如果 target 存在 zIndex 则设置
    var zIndex = target.css('zIndex');
    if (zIndex && zIndex > 0) {
        css.zIndex = zIndex - 1;
    }

    return $('<iframe>', {
        src: 'javascript:\'\'', // 不加的话，https 下会弹警告
        frameborder: 0,
        css: css
    }).insertBefore(target);
}


return module.exports;
});

_define_("iframe-shim", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['position'] = CMP.Position || require('../position/position');
module.exports = CMP.IframeShim = _using_("iframe-shim/iframe-shim");

return module.exports;
});

_using_("iframe-shim");

})();

/**
===============================
component : widget
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("widget/daparser", function(_using_){
var module = {},exports = module.exports = {};

// DAParser
// --------
// data api 解析器，提供对单个 element 的解析，可用来初始化页面中的所有 Widget 组件。

var $ = _using_("jquery")


// 得到某个 DOM 元素的 dataset
exports.parseElement = function(element, raw) {
  element = $(element)[0]
  var dataset = {}

  // ref: https://developer.mozilla.org/en/DOM/element.dataset
  if (element.dataset) {
    // 转换成普通对象
    dataset = $.extend({}, element.dataset)
  }
  else {
    var attrs = element.attributes

    for (var i = 0, len = attrs.length; i < len; i++) {
      var attr = attrs[i]
      var name = attr.name

      if (name.indexOf('data-') === 0) {
        name = camelCase(name.substring(5))
        dataset[name] = attr.value
      }
    }
  }

  return raw === true ? dataset : normalizeValues(dataset)
}


// Helpers
// ------

var RE_DASH_WORD = /-([a-z])/g
var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/
var parseJSON = this.JSON ? JSON.parse : $.parseJSON

// 仅处理字母开头的，其他情况转换为小写："data-x-y-123-_A" --> xY-123-_a
function camelCase(str) {
  return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
    return (letter + '').toUpperCase()
  })
}

// 解析并归一化配置中的值
function normalizeValues(data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {

      var val = data[key]
      if (typeof val !== 'string') continue

      if (JSON_LITERAL_PATTERN.test(val)) {
        val = val.replace(/'/g, '"')
        data[key] = normalizeValues(parseJSON(val))
      }
      else {
        data[key] = normalizeValue(val)
      }
    }
  }

  return data
}

// 将 'false' 转换为 false
// 'true' 转换为 true
// '3253.34' 转换为 3253.34
function normalizeValue(val) {
  if (val.toLowerCase() === 'false') {
    val = false
  }
  else if (val.toLowerCase() === 'true') {
    val = true
  }
  else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
    var number = parseFloat(val)
    if (number + '' === val) {
      val = number
    }
  }

  return val
}


return module.exports;
});

_define_("widget/auto-render", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery")
var DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered'


// 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
exports.autoRender = function(config) {
  return new this(config).render()
}


// 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
exports.autoRenderAll = function(root, callback) {
  if (typeof root === 'function') {
    callback = root
    root = null
  }

  root = $(root || document.body)
  var modules = []
  var elements = []

  root.find('[data-widget]').each(function(i, element) {
    if (!exports.isDataApiOff(element)) {
      modules.push(element.getAttribute('data-widget').toLowerCase())
      elements.push(element)
    }
  })

  if (modules.length) {
    seajs.use(modules, function() {

      for (var i = 0; i < arguments.length; i++) {
        var SubWidget = arguments[i]
        var element = $(elements[i])

        // 已经渲染过
        if (element.attr(DATA_WIDGET_AUTO_RENDERED)) continue

        var config = {
          initElement: element,
          renderType: 'auto'
        };

        // data-widget-role 是指将当前的 DOM 作为 role 的属性去实例化，默认的 role 为 element
        var role = element.attr('data-widget-role')
        config[role ? role : 'element'] = element

        // 调用自动渲染接口
        SubWidget.autoRender && SubWidget.autoRender(config)

        // 标记已经渲染过
        element.attr(DATA_WIDGET_AUTO_RENDERED, 'true')
      }

      // 在所有自动渲染完成后，执行回调
      callback && callback()
    })
  }
}


var isDefaultOff = $(document.body).attr('data-api') === 'off'

// 是否没开启 data-api
exports.isDataApiOff = function(element) {
  var elementDataApi = $(element).attr('data-api')

  // data-api 默认开启，关闭只有两种方式：
  //  1. element 上有 data-api="off"，表示关闭单个
  //  2. document.body 上有 data-api="off"，表示关闭所有
  return  elementDataApi === 'off' ||
      (elementDataApi !== 'on' && isDefaultOff)
}



return module.exports;
});

_define_("widget/widget", function(_using_){
var module = {},exports = module.exports = {};

// Widget
// ---------
// Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
// Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
// 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。

var Base = _share_("base")
var $ = _using_("jquery")
var DAParser = _using_("widget/daparser")
var AutoRender = _using_("widget/auto-render")

var DELEGATE_EVENT_NS = '.delegate-events-'
var ON_RENDER = '_onRender'
var DATA_WIDGET_CID = 'data-widget-cid'

// 所有初始化过的 Widget 实例
var cachedInstances = {}

var Widget = Base.extend({

  // config 中的这些键值会直接添加到实例上，转换成 properties
  propsInAttrs: ['initElement', 'element', 'events'],

  // 与 widget 关联的 DOM 元素
  element: null,

  // 事件代理，格式为：
  //   {
  //     'mousedown .title': 'edit',
  //     'click {{attrs.saveButton}}': 'save'
  //     'click .open': function(ev) { ... }
  //   }
  events: null,

  // 属性列表
  attrs: {
    // 基本属性
    id: null,
    className: null,
    style: null,

    // 默认模板
    template: '<div></div>',

    // 默认数据模型
    model: null,

    // 组件的默认父节点
    parentNode: document.body || 'body'
  },

  // 初始化方法，确定组件创建时的基本流程：
  // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
  initialize: function(config) {
    this.cid = uniqueCid()

    // 初始化 attrs
    var dataAttrsConfig = this._parseDataAttrsConfig(config)
    Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig)

    // 初始化 props
    this.parseElement()
    this.initProps()

    // 初始化 events
    this.delegateEvents()

    // 子类自定义的初始化
    this.setup()

    // 保存实例信息
    this._stamp()

    // 是否由 template 初始化
    this._isTemplate = !(config && config.element)
  },

  // 解析通过 data-attr 设置的 api
  _parseDataAttrsConfig: function(config) {
    var element, dataAttrsConfig
    if (config) {
      element = config.initElement ? $(config.initElement) : $(config.element)
    }

    // 解析 data-api 时，只考虑用户传入的 element，不考虑来自继承或从模板构建的
    if (element && element[0] && !AutoRender.isDataApiOff(element)) {
      dataAttrsConfig = DAParser.parseElement(element)
    }

    return dataAttrsConfig
  },

  // 构建 this.element
  parseElement: function() {
    var element = this.element

    if (element) {
      this.element = $(element)
    }
    // 未传入 element 时，从 template 构建
    else if (this.get('template')) {
      this.parseElementFromTemplate()
    }

    // 如果对应的 DOM 元素不存在，则报错
    if (!this.element || !this.element[0]) {
      throw new Error('element is invalid')
    }
  },

  // 从模板中构建 this.element
  parseElementFromTemplate: function() {
    this.element = $(this.get('template'))
  },

  // 负责 properties 的初始化，提供给子类覆盖
  initProps: function() {
  },

  // 注册事件代理
  delegateEvents: function(element, events, handler) {
    var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

    // widget.delegateEvents()
    if (argus.length === 0) {
      events = getEvents(this)
      element = this.element
    }

    // widget.delegateEvents({
    //   'click p': 'fn1',
    //   'click li': 'fn2'
    // })
    else if (argus.length === 1) {
      events = element
      element = this.element
    }

    // widget.delegateEvents('click p', function(ev) { ... })
    else if (argus.length === 2) {
      handler = events
      events = element
      element = this.element
    }

    // widget.delegateEvents(element, 'click p', function(ev) { ... })
    else {
      element || (element = this.element)
      this._delegateElements || (this._delegateElements = [])
      this._delegateElements.push($(element))
    }

    // 'click p' => {'click p': handler}
    if (isString(events) && isFunction(handler)) {
      var o = {}
      o[events] = handler
      events = o
    }

    // key 为 'event selector'
    for (var key in events) {
      if (!events.hasOwnProperty(key)) continue

      var args = parseEventKey(key, this)
      var eventType = args.type
      var selector = args.selector

      ;(function(handler, widget) {

        var callback = function(ev) {
          if (isFunction(handler)) {
            handler.call(widget, ev)
          } else {
            widget[handler](ev)
          }
        }

        // delegate
        if (selector) {
          $(element).on(eventType, selector, callback)
        }
        // normal bind
        // 分开写是为了兼容 zepto，zepto 的判断不如 jquery 强劲有力
        else {
          $(element).on(eventType, callback)
        }

      })(events[key], this)
    }

    return this
  },

  // 卸载事件代理
  undelegateEvents: function(element, eventKey) {
    var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

    if (!eventKey) {
      eventKey = element
      element = null
    }

    // 卸载所有
    // .undelegateEvents()
    if (argus.length === 0) {
      var type = DELEGATE_EVENT_NS + this.cid

      this.element && this.element.off(type)

      // 卸载所有外部传入的 element
      if (this._delegateElements) {
        for (var de in this._delegateElements) {
          if (!this._delegateElements.hasOwnProperty(de)) continue
          this._delegateElements[de].off(type)
        }
      }

    } else {
      var args = parseEventKey(eventKey, this)

      // 卸载 this.element
      // .undelegateEvents(events)
      if (!element) {
        this.element && this.element.off(args.type, args.selector)
      }

      // 卸载外部 element
      // .undelegateEvents(element, events)
      else {
        $(element).off(args.type, args.selector)
      }
    }
    return this
  },

  // 提供给子类覆盖的初始化方法
  setup: function() {
  },

  // 将 widget 渲染到页面上
  // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
  // 约定：子类覆盖时，需保持 `return this`
  render: function() {

    // 让渲染相关属性的初始值生效，并绑定到 change 事件
    if (!this.rendered) {
      this._renderAndBindAttrs()
      this.rendered = true
    }

    // 插入到文档流中
    var parentNode = this.get('parentNode')
    if (parentNode && !isInDocument(this.element[0])) {
      // 隔离样式，添加统一的命名空间
      // https://github.com/aliceui/aliceui.org/issues/9
      var outerBoxClass = this.constructor.outerBoxClass
      if (outerBoxClass) {
        var outerBox = this._outerBox = $('<div></div>').addClass(outerBoxClass)
        outerBox.append(this.element).appendTo(parentNode)
      } else {
        this.element.appendTo(parentNode)
      }
    }

    return this
  },

  // 让属性的初始值生效，并绑定到 change:attr 事件上
  _renderAndBindAttrs: function() {
    var widget = this
    var attrs = widget.attrs

    for (var attr in attrs) {
      if (!attrs.hasOwnProperty(attr)) continue
      var m = ON_RENDER + ucfirst(attr)

      if (this[m]) {
        var val = this.get(attr)

        // 让属性的初始值生效。注：默认空值不触发
        if (!isEmptyAttrValue(val)) {
          this[m](val, undefined, attr)
        }

        // 将 _onRenderXx 自动绑定到 change:xx 事件上
        (function(m) {
          widget.on('change:' + attr, function(val, prev, key) {
            widget[m](val, prev, key)
          })
        })(m)
      }
    }
  },

  _onRenderId: function(val) {
    this.element.attr('id', val)
  },

  _onRenderClassName: function(val) {
    this.element.addClass(val)
  },

  _onRenderStyle: function(val) {
    this.element.css(val)
  },

  // 让 element 与 Widget 实例建立关联
  _stamp: function() {
    var cid = this.cid

    ;(this.initElement || this.element).attr(DATA_WIDGET_CID, cid)
    cachedInstances[cid] = this
  },

  // 在 this.element 内寻找匹配节点
  $: function(selector) {
    return this.element.find(selector)
  },

  destroy: function() {
    this.undelegateEvents()
    delete cachedInstances[this.cid]

    // For memory leak
    if (this.element && this._isTemplate) {
      this.element.off()
      // 如果是 widget 生成的 element 则去除
      if (this._outerBox) {
        this._outerBox.remove()
      } else {
        this.element.remove()
      }
    }
    this.element = null

    Widget.superclass.destroy.call(this)
  }
})

// For memory leak
$(window).unload(function() {
  for(var cid in cachedInstances) {
    cachedInstances[cid].destroy()
  }
})

// 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
Widget.query = function(selector) {
  var element = $(selector).eq(0)
  var cid

  element && (cid = element.attr(DATA_WIDGET_CID))
  return cachedInstances[cid]
}


Widget.autoRender = AutoRender.autoRender
Widget.autoRenderAll = AutoRender.autoRenderAll
Widget.StaticsWhiteList = ['autoRender']

module.exports = Widget


// Helpers
// ------

var toString = Object.prototype.toString
var cidCounter = 0

function uniqueCid() {
  return 'widget-' + cidCounter++
}

function isString(val) {
  return toString.call(val) === '[object String]'
}

function isFunction(val) {
  return toString.call(val) === '[object Function]'
}

// Zepto 上没有 contains 方法
var contains = $.contains || function(a, b) {
  //noinspection JSBitwiseOperatorUsage
  return !!(a.compareDocumentPosition(b) & 16)
}

function isInDocument(element) {
  return contains(document.documentElement, element)
}

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}


var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/
var EXPRESSION_FLAG = /{{([^}]+)}}/g
var INVALID_SELECTOR = 'INVALID_SELECTOR'

function getEvents(widget) {
  if (isFunction(widget.events)) {
    widget.events = widget.events()
  }
  return widget.events
}

function parseEventKey(eventKey, widget) {
  var match = eventKey.match(EVENT_KEY_SPLITTER)
  var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid

  // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
  var selector = match[2] || undefined

  if (selector && selector.indexOf('{{') > -1) {
    selector = parseExpressionInEventKey(selector, widget)
  }

  return {
    type: eventType,
    selector: selector
  }
}

// 解析 eventKey 中的 {{xx}}, {{yy}}
function parseExpressionInEventKey(selector, widget) {

  return selector.replace(EXPRESSION_FLAG, function(m, name) {
    var parts = name.split('.')
    var point = widget, part

    while (part = parts.shift()) {
      if (point === widget.attrs) {
        point = widget.get(part)
      } else {
        point = point[part]
      }
    }

    // 已经是 className，比如来自 dataset 的
    if (isString(point)) {
      return point
    }

    // 不能识别的，返回无效标识
    return INVALID_SELECTOR
  })
}


// 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
function isEmptyAttrValue(o) {
  return o == null || o === undefined
}

function trimRightUndefine(argus) {
  for (var i = argus.length - 1; i >= 0; i--) {
    if (argus[i] === undefined) {
      argus.pop()
    } else {
      break
    }
  }
  return argus
}


return module.exports;
});

_define_("widget", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['base'] = CMP.Base || require('../base/base').Base;
//Widget类不允许重复加载
if(typeof CMP.Widget != 'function'){
	CMP.Widget = _using_("widget/widget");
}
module.exports = CMP.Widget;

return module.exports;
});

_using_("widget");

})();

/**
===============================
component : switchable
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("switchable/plugins/effects", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");

_share_("easing");

var SCROLLX = 'scrollx';
var SCROLLY = 'scrolly';
var FADE = 'fade';


// 切换效果插件
module.exports = {
  attrs: {
    // 切换效果，可取 scrollx | scrolly | fade 或直接传入 effect function
    effect: 'none',
    easing: 'linear',
    duration: 500
  },

  isNeeded: function () {
    return this.get('effect') !== 'none';
  },

  install: function () {
    var panels = this.get('panels');

    // 注：
    // 1. 所有 panel 的尺寸应该相同
    //    最好指定第一个 panel 的 width 和 height
    //    因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对
    // 2. 初始化 panels 样式
    //    这些特效需要将 panels 都显示出来
    // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
    panels.show();
    var effect = this.get('effect');
    var step = this.get('step');

    var isFunction = $.isFunction(effect);

    // 初始化滚动效果
    if (!isFunction && effect.indexOf('scroll') === 0) {
      var content = this.content;
      var firstPanel = panels.eq(0);

      // 设置定位信息，为滚动效果做铺垫
      content.css('position', 'relative');

      // 注：content 的父级不一定是 container
      if (content.parent().css('position') === 'static') {
        content.parent().css('position', 'relative');
      }

      // 水平排列
      if (effect === SCROLLX) {
        panels.css('float', 'left');
        // 设置最大宽度，以保证有空间让 panels 水平排布
        // 35791197px 为 360 下 width 最大数值
        content.width('35791197px');
      }

      // 只有 scrollX, scrollY 需要设置 viewSize
      // 其他情况下不需要
      var viewSize = this.get('viewSize');
      if (!viewSize[0]) {
        viewSize[0] = firstPanel.outerWidth() * step;
        viewSize[1] = firstPanel.outerHeight() * step;
        this.set('viewSize', viewSize);
      }

      if (!viewSize[0]) {
        throw new Error('Please specify viewSize manually');
      }
    }
    // 初始化淡隐淡出效果
    else if (!isFunction && effect === FADE) {
      var activeIndex = this.get('activeIndex');
      var min = activeIndex * step;
      var max = min + step - 1;

      panels.each(function (i, panel) {
        var isActivePanel = i >= min && i <= max;
        $(panel).css({
          opacity: isActivePanel ? 1 : 0,
          position: 'absolute',
          zIndex: isActivePanel ? 9 : 1
        });
      });
    }

    // 覆盖 switchPanel 方法
    this._switchPanel = function (panelInfo) {
      var effect = this.get('effect');
      var fn = $.isFunction(effect) ? effect : Effects[effect];
      fn.call(this, panelInfo);
    };
  }
};


// 切换效果方法集
var Effects = {

  // 淡隐淡现效果
  fade: function (panelInfo) {
    // 简单起见，目前不支持 step > 1 的情景。若需要此效果时，可修改结构来达成。
    if (this.get('step') > 1) {
      throw new Error('Effect "fade" only supports step === 1');
    }

    var fromPanel = panelInfo.fromPanels.eq(0);
    var toPanel = panelInfo.toPanels.eq(0);

    if (this.anim) {
      // 立刻停止，以开始新的
      this.anim.stop(false, true);
    }

    // 首先显示下一张
    toPanel.css('opacity', 1);
    toPanel.show();

    if (panelInfo.fromIndex > -1) {
      var that = this;
      var duration = this.get('duration');
      var easing = this.get('easing');

      // 动画切换
      this.anim = fromPanel.animate({
        opacity: 0
      }, duration, easing, function () {
        that.anim = null; // free
        // 切换 z-index
        toPanel.css('zIndex', 9);
        fromPanel.css('zIndex', 1);
        fromPanel.css('display', 'none');
      });
    }
    // 初始情况下没有必要动画切换
    else {
      toPanel.css('zIndex', 9);
    }
  },

  // 水平/垂直滚动效果
  scroll: function (panelInfo) {
    var isX = this.get('effect') === SCROLLX;
    var diff = this.get('viewSize')[isX ? 0 : 1] * panelInfo.toIndex;

    var props = {};
    props[isX ? 'left' : 'top'] = -diff + 'px';

    if (this.anim) {
      this.anim.stop();
    }

    if (panelInfo.fromIndex > -1) {
      var that = this;
      var duration = this.get('duration');
      var easing = this.get('easing');

      this.anim = this.content.animate(props, duration, easing, function () {
        that.anim = null; // free
      });
    }
    else {
      this.content.css(props);
    }
  }
};

Effects[SCROLLY] = Effects.scroll;
Effects[SCROLLX] = Effects.scroll;
module.exports.Effects = Effects;

return module.exports;
});

_define_("switchable/plugins/autoplay", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var win = $(window);

// 自动播放插件
module.exports = {

  attrs: {
    autoplay: false,

    // 自动播放的间隔时间
    interval: 5000
  },

  isNeeded: function () {
    return this.get('autoplay');
  },

  install: function () {
    var element = this.element;
    var EVENT_NS = '.' + this.cid;
    var timer;
    var interval = this.get('interval');
    var that = this;

    // start autoplay
    start();

    function start() {
      // 停止之前的
      stop();

      // 设置状态
      that.paused = false;

      // 开始现在的
      timer = setInterval(function () {
        if (that.paused) return;
        that.next();
      }, interval);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      that.paused = true;
    }

    // public api
    this.stop = stop;
    this.start = start;

    // 滚出可视区域后，停止自动播放
    this._scrollDetect = throttle(function () {
      that[isInViewport(element) ? 'start' : 'stop']();
    });
    win.on('scroll' + EVENT_NS, this._scrollDetect);

    // 鼠标悬停时，停止自动播放
    this.element.hover(stop, start);
  },

  destroy: function () {
    var EVENT_NS = '.' + this.cid;

    this.stop && this.stop();

    if (this._scrollDetect) {
      this._scrollDetect.stop();
      win.off('scroll' + EVENT_NS);
    }
  }
};


// Helpers
// -------

function throttle(fn, ms) {
  ms = ms || 200;
  var throttleTimer;

  function f() {
    f.stop();
    throttleTimer = setTimeout(fn, ms);
  }

  f.stop = function () {
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      throttleTimer = 0;
    }
  };

  return f;
}


function isInViewport(element) {
  var scrollTop = win.scrollTop();
  var scrollBottom = scrollTop + win.height();
  var elementTop = element.offset().top;
  var elementBottom = elementTop + element.height();

  // 只判断垂直位置是否在可视区域，不判断水平。只有要部分区域在可视区域，就返回 true
  return elementTop < scrollBottom && elementBottom > scrollTop;
}

return module.exports;
});

_define_("switchable/plugins/circular", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");

var SCROLLX = 'scrollx';
var SCROLLY = 'scrolly';
var Effects = _using_("switchable/plugins/effects").Effects;


// 无缝循环滚动插件
module.exports = {
  // 仅在开启滚动效果时需要
  isNeeded: function () {
    var effect = this.get('effect');
    var circular = this.get('circular');
    return circular && (effect === SCROLLX || effect === SCROLLY);
  },

  install: function () {
    this._scrollType = this.get('effect');
    this.set('effect', 'scrollCircular');
  }
};

Effects.scrollCircular = function (panelInfo) {
  var toIndex = panelInfo.toIndex;
  var fromIndex = panelInfo.fromIndex;
  var isX = this._scrollType === SCROLLX;
  var prop = isX ? 'left' : 'top';
  var viewDiff = this.get('viewSize')[isX ? 0 : 1];
  var diff = -viewDiff * toIndex;

  var props = {};
  props[prop] = diff + 'px';

  // 开始动画
  if (fromIndex > -1) {

    // 开始动画前，先停止掉上一动画
    if (this.anim) {
      this.anim.stop(false, true);
    }

    var len = this.get('length');
    // scroll 的 0 -> len-1 应该是正常的从 0->1->2->.. len-1 的切换
    var isBackwardCritical = fromIndex === 0 && toIndex === len - 1;
    // len-1 -> 0
    var isForwardCritical = fromIndex === len - 1 && toIndex === 0;
    var isBackward = this._isBackward === undefined ? toIndex < fromIndex : this._isBackward;
    // isBackward 使用下面的判断方式, 会在 nav 上 trigger 从 0 -> len-1 切换时,
    // 不经过 0->1->2->...-> len-1, 而是 0 反向切换到 len-1;
    // 而上面的判断方式, nav 上的 trigger 切换是正常的, 只有调用 prev 才从 0 反向切换到 len-1;
    //var isBackward = isBackwardCritical ||
    //    (!isForwardCritical && toIndex < fromIndex);
    // 从第一个反向滚动到最后一个 or 从最后一个正向滚动到第一个
    var isCritical = (isBackward && isBackwardCritical) || (!isBackward && isForwardCritical);

    // 在临界点时，先调整 panels 位置
    if (isCritical) {
      diff = adjustPosition.call(this, isBackward, prop, viewDiff);
      props[prop] = diff + 'px';
    }

    var duration = this.get('duration');
    var easing = this.get('easing');
    var that = this;

    this.anim = this.content.animate(props, duration, easing, function () {
      that.anim = null; // free
      // 复原位置
      if (isCritical) {
        resetPosition.call(that, isBackward, prop, viewDiff);
      }
    });
  }
  // 初始化
  else {
    this.content.css(props);
  }
};

// 调整位置


function adjustPosition(isBackward, prop, viewDiff) {
  var step = this.get('step');
  var len = this.get('length');
  var start = isBackward ? len - 1 : 0;
  var from = start * step;
  var to = (start + 1) * step;
  var diff = isBackward ? viewDiff : -viewDiff * len;
  var panelDiff = isBackward ? -viewDiff * len : viewDiff * len;

  // 调整 panels 到下一个视图中
  var toPanels = $(this.get('panels').get().slice(from, to));
  toPanels.css('position', 'relative');
  toPanels.css(prop, panelDiff + 'px');

  // 返回偏移量
  return diff;
}

// 复原位置


function resetPosition(isBackward, prop, viewDiff) {
  var step = this.get('step');
  var len = this.get('length');
  var start = isBackward ? len - 1 : 0;
  var from = start * step;
  var to = (start + 1) * step;

  // 滚动完成后，复位到正常状态
  var toPanels = $(this.get('panels').get().slice(from, to));
  toPanels.css('position', '');
  toPanels.css(prop, '');

  // 瞬移到正常位置
  this.content.css(prop, isBackward ? -viewDiff * (len - 1) : '');
}

return module.exports;
});

_define_("switchable/switchable", function(_using_){
var module = {},exports = module.exports = {};

// Switchable
// -----------
// 可切换组件，核心特征是：有一组可切换的面板（Panel），可通过触点（Trigger）来触发。
// 感谢：
//  - https://github.com/kissyteam/kissy/tree/6707ecc4cdfddd59e21698c8eb4a50b65dbe7632/src/switchable

var $ = _using_("jquery");
var Widget = _share_("widget");

var Effects = _using_("switchable/plugins/effects");
var Autoplay = _using_("switchable/plugins/autoplay");
var Circular = _using_("switchable/plugins/circular");

var Switchable = Widget.extend({
  attrs: {

    // 用户传入的 triggers 和 panels
    // 可以是 Selector、jQuery 对象、或 DOM 元素集
    triggers: {
      value: [],
      getter: function (val) {
        return $(val);
      }
    },

    panels: {
      value: [],
      getter: function (val) {
        return $(val);
      }
    },

    classPrefix: 'ui-switchable',

    // 是否包含 triggers，用于没有传入 triggers 时，是否自动生成的判断标准
    hasTriggers: true,
    // 触发类型
    triggerType: 'hover',
    // or 'click'
    // 触发延迟
    delay: 100,

    // 初始切换到哪个面板
    activeIndex: {
      value: 0,
      setter: function (val) {
        return parseInt(val) || 0;
      }
    },

    // 一屏内有多少个 panels
    step: 1,
    // 有多少屏
    length: {
      readOnly: true,
      getter: function () {
        return Math.ceil(this.get('panels').length / this.get('step'));
      }
    },

    // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
    viewSize: [],

    activeTriggerClass: {
      getter: function (val) {
        return val ? val : this.get("classPrefix") + '-active';
      }
    }
  },

  setup: function () {
    this._initConstClass();
    this._initElement();

    var role = this._getDatasetRole();
    this._initPanels(role);
    // 配置中的 triggers > dataset > 自动生成
    this._initTriggers(role);
    this._bindTriggers();
    this._initPlugins();

    // 渲染默认初始状态
    this.render();
  },

  _initConstClass: function () {
    this.CONST = constClass(this.get('classPrefix'));
  },
  _initElement: function () {
    this.element.addClass(this.CONST.UI_SWITCHABLE);
  },

  // 从 HTML 标记中获取各个 role, 替代原来的 markupType
  _getDatasetRole: function () {
    var self = this;
    var role = {};
    var roles = ['trigger', 'panel', 'nav', 'content'];
    $.each(roles, function (index, key) {
      var elems = self.$('[data-role=' + key + ']');
      if (elems.length) {
        role[key] = elems;
      }
    });
    return role;
  },

  _initPanels: function (role) {
    var panels = this.get('panels');

    // 先获取 panels 和 content
    if (panels.length > 0) {} else if (role.panel) {
      this.set('panels', panels = role.panel);
    } else if (role.content) {
      this.set('panels', panels = role.content.find('> *'));
      this.content = role.content;
    }

    if (panels.length === 0) {
      throw new Error('panels.length is ZERO');
    }
    if (!this.content) {
      this.content = panels.parent();
    }
    this.content.addClass(this.CONST.CONTENT_CLASS);
    this.get('panels').addClass(this.CONST.PANEL_CLASS);
  },

  _initTriggers: function (role) {
    var triggers = this.get('triggers');

    // 再获取 triggers 和 nav
    if (triggers.length > 0) {}
    // attr 里没找到时，才根据 data-role 来解析
    else if (role.trigger) {
      this.set('triggers', triggers = role.trigger);
    } else if (role.nav) {
      triggers = role.nav.find('> *');

      // 空的 nav 标记
      if (triggers.length === 0) {
        triggers = generateTriggersMarkup(
        this.get('length'), this.get('activeIndex'), this.get('activeTriggerClass'), true).appendTo(role.nav);
      }
      this.set('triggers', triggers);

      this.nav = role.nav;
    }
    // 用户没有传入 triggers，也没有通过 data-role 指定时，如果
    // hasTriggers 为 true，则自动生成 triggers
    else if (this.get('hasTriggers')) {
      this.nav = generateTriggersMarkup(
      this.get('length'), this.get('activeIndex'), this.get('activeTriggerClass')).appendTo(this.element);
      this.set('triggers', triggers = this.nav.children());
    }

    if (!this.nav && triggers.length) {
      this.nav = triggers.parent();
    }

    this.nav && this.nav.addClass(this.CONST.NAV_CLASS);
    triggers.addClass(this.CONST.TRIGGER_CLASS).each(function (i, trigger) {
      $(trigger).data('value', i);
    });
  },

  _bindTriggers: function () {
    var that = this,
        triggers = this.get('triggers');

    if (this.get('triggerType') === 'click') {
      triggers.click(focus);
    }
    // hover
    else {
      triggers.hover(focus, leave);
    }

    function focus(ev) {
      that._onFocusTrigger(ev.type, $(this).data('value'));
    }

    function leave() {
      clearTimeout(that._switchTimer);
    }
  },

  _onFocusTrigger: function (type, index) {
    var that = this;

    // click or tab 键激活时
    if (type === 'click') {
      this.switchTo(index);
    }

    // hover
    else {
      this._switchTimer = setTimeout(function () {
        that.switchTo(index);
      }, this.get('delay'));
    }
  },

  _initPlugins: function () {
    this._plugins = [];

    this._plug(Effects);
    this._plug(Autoplay);
    this._plug(Circular);
  },
  // 切换到指定 index
  switchTo: function (toIndex) {
    this.set('activeIndex', toIndex);
  },

  // change 事件触发的前提是当前值和先前值不一致, 所以无需验证 toIndex !== fromIndex
  _onRenderActiveIndex: function (toIndex, fromIndex) {
    this._switchTo(toIndex, fromIndex);
  },

  _switchTo: function (toIndex, fromIndex) {
    this.trigger('switch', toIndex, fromIndex);
    this._switchTrigger(toIndex, fromIndex);
    this._switchPanel(this._getPanelInfo(toIndex, fromIndex));
    this.trigger('switched', toIndex, fromIndex);

    // 恢复手工向后切换标识
    this._isBackward = undefined;
  },

  _switchTrigger: function (toIndex, fromIndex) {
    var triggers = this.get('triggers');
    if (triggers.length < 1) return;

    triggers.eq(fromIndex).removeClass(this.get('activeTriggerClass'));
    triggers.eq(toIndex).addClass(this.get('activeTriggerClass'));
  },

  _switchPanel: function (panelInfo) {
    // 默认是最简单的切换效果：直接隐藏/显示
    panelInfo.fromPanels.hide();
    panelInfo.toPanels.show();
  },

  _getPanelInfo: function (toIndex, fromIndex) {
    var panels = this.get('panels').get();
    var step = this.get('step');

    var fromPanels, toPanels;

    // 初始情况下 fromIndex 为 undefined
    if (fromIndex > -1) {
      fromPanels = panels.slice(fromIndex * step, (fromIndex + 1) * step);
    }

    toPanels = panels.slice(toIndex * step, (toIndex + 1) * step);

    return {
      toIndex: toIndex,
      fromIndex: fromIndex,
      toPanels: $(toPanels),
      fromPanels: $(fromPanels)
    };
  },

  // 切换到上一视图
  prev: function () {
    //  设置手工向后切换标识, 外部调用 prev 一样
    this._isBackward = true;

    var fromIndex = this.get('activeIndex');
    // 考虑循环切换的情况
    var index = (fromIndex - 1 + this.get('length')) % this.get('length');
    this.switchTo(index);
  },

  // 切换到下一视图
  next: function () {
    this._isBackward = false;

    var fromIndex = this.get('activeIndex');
    var index = (fromIndex + 1) % this.get('length');
    this.switchTo(index);
  },

  _plug: function (plugin) {
    var pluginAttrs = plugin.attrs;

    if (pluginAttrs) {
      for (var key in pluginAttrs) {
        if (pluginAttrs.hasOwnProperty(key) &&
        // 不覆盖用户传入的配置
        !(key in this.attrs)) {
          this.set(key, pluginAttrs[key]);
        }
      }
    }
    if (!plugin.isNeeded.call(this)) return;


    if (plugin.install) {
      plugin.install.call(this);
    }

    this._plugins.push(plugin);
  },


  destroy: function () {
    // todo: events
    var that = this;

    $.each(this._plugins, function (i, plugin) {
      if (plugin.destroy) {
        plugin.destroy.call(that);
      }
    });

    Switchable.superclass.destroy.call(this);
  }
});

module.exports = Switchable;


// Helpers
// -------

function generateTriggersMarkup(length, activeIndex, activeTriggerClass, justChildren) {
  var nav = $('<ul>');

  for (var i = 0; i < length; i++) {
    var className = i === activeIndex ? activeTriggerClass : '';

    $('<li>', {
      'class': className,
      'html': i + 1
    }).appendTo(nav);
  }

  return justChildren ? nav.children() : nav;
}


// 内部默认的 className


function constClass(classPrefix) {
  return {
    UI_SWITCHABLE: classPrefix || '',
    NAV_CLASS: classPrefix ? classPrefix + '-nav' : '',
    CONTENT_CLASS: classPrefix ? classPrefix + '-content' : '',
    TRIGGER_CLASS: classPrefix ? classPrefix + '-trigger' : '',
    PANEL_CLASS: classPrefix ? classPrefix + '-panel' : '',
    PREV_BTN_CLASS: classPrefix ? classPrefix + '-prev-btn' : '',
    NEXT_BTN_CLASS: classPrefix ? classPrefix + '-next-btn' : ''
  }
}

return module.exports;
});

_define_("switchable/slide", function(_using_){
var module = {},exports = module.exports = {};

var Switchable = _using_("switchable/switchable");

// 卡盘轮播组件
module.exports = Switchable.extend({
  attrs: {
    autoplay: true,
    circular: true
  }
});

return module.exports;
});

_define_("switchable/accordion", function(_using_){
var module = {},exports = module.exports = {};

var Switchable = _using_("switchable/switchable");


// 手风琴组件
var Accordion = Switchable.extend({
  attrs: {
    triggerType: 'click',

    // 是否运行展开多个
    multiple: false,

    autoplay: false
  },
  switchTo: function (toIndex) {
    if (this.get('multiple')) {
      this._switchTo(toIndex, toIndex);
    } else {
      Switchable.prototype.switchTo.call(this, toIndex);
    }
  },

  _switchTrigger: function (toIndex, fromIndex) {
    if (this.get('multiple')) {
      this.get('triggers').eq(toIndex).toggleClass(this.get('activeTriggerClass'));
    } else {
      Switchable.prototype._switchTrigger.call(this, toIndex, fromIndex);
    }
  },

  _switchPanel: function (panelInfo) {
    if (this.get('multiple')) {
      panelInfo.toPanels.toggle();
    } else {
      Switchable.prototype._switchPanel.call(this, panelInfo);
    }
  }
});

module.exports = Accordion;

return module.exports;
});

_define_("switchable/carousel", function(_using_){
var module = {},exports = module.exports = {};

var Switchable = _using_("switchable/switchable");
var $ = _using_("jquery");

// 旋转木马组件
module.exports = Switchable.extend({

  attrs: {
    circular: true,

    prevBtn: {
      getter: function (val) {
        return $(val).eq(0);
      }
    },

    nextBtn: {
      getter: function (val) {
        return $(val).eq(0);
      }
    },
    disabledBtnClass: {
      getter: function (val) {
        return val ? val : this.get("classPrefix") + '-disabled-btn';
      }
    }
  },

  _initTriggers: function (role) {
    Switchable.prototype._initTriggers.call(this, role);

    // attr 里没找到时，才根据 data-role 来解析
    var prevBtn = this.get('prevBtn');
    var nextBtn = this.get('nextBtn');

    if (!prevBtn[0] && role.prev) {
      prevBtn = role.prev;
      this.set('prevBtn', prevBtn);
    }

    if (!nextBtn[0] && role.next) {
      nextBtn = role.next;
      this.set('nextBtn', nextBtn);
    }

    prevBtn.addClass(this.CONST.PREV_BTN_CLASS);
    nextBtn.addClass(this.CONST.NEXT_BTN_CLASS);
  },

  _getDatasetRole: function () {
    var role = Switchable.prototype._getDatasetRole.call(this);

    var self = this;
    var roles = ['next', 'prev'];
    $.each(roles, function (index, key) {
      var elems = self.$('[data-role=' + key + ']');
      if (elems.length) {
        role[key] = elems;
      }
    });
    return role;
  },

  _bindTriggers: function () {
    Switchable.prototype._bindTriggers.call(this);

    var that = this;
    var circular = this.get('circular');

    this.get('prevBtn').click(function (ev) {
      ev.preventDefault();
      if (circular || that.get('activeIndex') > 0) {
        that.prev();
      }
    });

    this.get('nextBtn').click(function (ev) {
      ev.preventDefault();
      var len = that.get('length') - 1;
      if (circular || that.get('activeIndex') < len) {
        that.next();
      }
    });

    // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
    // circular = true 时，无需处理
    if (!circular) {
      this.on('switch', function (toIndex) {
        that._updateButtonStatus(toIndex);
      });
    }
  },

  _updateButtonStatus: function (toIndex) {
    var prevBtn = this.get('prevBtn');
    var nextBtn = this.get('nextBtn');
    var disabledBtnClass = this.get("disabledBtnClass");

    prevBtn.removeClass(disabledBtnClass);
    nextBtn.removeClass(disabledBtnClass);

    if (toIndex === 0) {
      prevBtn.addClass(disabledBtnClass);
    }
    else if (toIndex === this.get('length') - 1) {
      nextBtn.addClass(disabledBtnClass);
    }
  }
});

return module.exports;
});

_define_("switchable/tabs", function(_using_){
var module = {},exports = module.exports = {};

var Switchable = _using_("switchable/switchable");

// 展现型标签页组件
module.exports = Switchable.extend({});

return module.exports;
});

_define_("switchable", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['easing'] = CMP.Easing || require('../easing/easing');
_share_.m['widget'] = CMP.Widget || require('../widget/widget');

module.exports = CMP.Switchable = _using_("switchable/switchable");
CMP.Switchable.Slide = _using_("switchable/slide");
CMP.Switchable.Accordion = _using_("switchable/accordion");
CMP.Switchable.Carousel = _using_("switchable/carousel");
CMP.Switchable.Tabs = _using_("switchable/tabs");

return module.exports;
});

_using_("switchable");

})();

/**
===============================
component : overlay
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("overlay/overlay", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery"),
    Position = _share_("position"),
    Shim = _share_("iframe-shim"),
    Widget = _share_("widget");


// Overlay
// -------
// Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
// 是一切悬浮类 UI 组件的基类
var Overlay = Widget.extend({

  attrs: {
    // 基本属性
    width: null,
    height: null,
    zIndex: 99,
    visible: false,

    // 定位配置
    align: {
      // element 的定位点，默认为左上角
      selfXY: [0, 0],
      // 基准定位元素，默认为当前可视区域
      baseElement: Position.VIEWPORT,
      // 基准定位元素的定位点，默认为左上角
      baseXY: [0, 0]
    },

    // 父元素
    parentNode: document.body || 'body'
  },

  show: function () {
    // 若从未渲染，则调用 render
    if (!this.rendered) {
      this.render();
    }
    this.set('visible', true);
    return this;
  },

  hide: function () {
    this.set('visible', false);
    return this;
  },

  setup: function () {
    var that = this;
    // 加载 iframe 遮罩层并与 overlay 保持同步
    this._setupShim();
    // 窗口resize时，重新定位浮层
    this._setupResize();

    this.after('render', function () {
      var _pos = this.element.css('position');
      if (_pos === 'static' || _pos === 'relative') {
        this.element.css({
          position: 'absolute',
          left: '-9999px',
          top: '-9999px'
        });
      }
    });
    // 统一在显示之后重新设定位置
    this.after('show', function () {
      that._setPosition();
    });
  },

  destroy: function () {
    // 销毁两个静态数组中的实例
    erase(this, Overlay.allOverlays);
    erase(this, Overlay.blurOverlays);
    return Overlay.superclass.destroy.call(this);
  },

  // 进行定位
  _setPosition: function (align) {
    // 不在文档流中，定位无效
    if (!isInDocument(this.element[0])) return;

    align || (align = this.get('align'));

    // 如果align为空，表示不需要使用js对齐
    if (!align) return;

    var isHidden = this.element.css('display') === 'none';

    // 在定位时，为避免元素高度不定，先显示出来
    if (isHidden) {
      this.element.css({
        visibility: 'hidden',
        display: 'block'
      });
    }

    Position.pin({
      element: this.element,
      x: align.selfXY[0],
      y: align.selfXY[1]
    }, {
      element: align.baseElement,
      x: align.baseXY[0],
      y: align.baseXY[1]
    });

    // 定位完成后，还原
    if (isHidden) {
      this.element.css({
        visibility: '',
        display: 'none'
      });
    }

    return this;
  },

  // 加载 iframe 遮罩层并与 overlay 保持同步
  _setupShim: function () {
    var shim = new Shim(this.element);

    // 在隐藏和设置位置后，要重新定位
    // 显示后会设置位置，所以不用绑定 shim.sync
    this.after('hide _setPosition', shim.sync, shim);

    // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
    var attrs = ['width', 'height'];
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        this.on('change:' + attr, shim.sync, shim);
      }
    }

    // 在销魂自身前要销毁 shim
    this.before('destroy', shim.destroy, shim);
  },

  // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
  _setupResize: function () {
    Overlay.allOverlays.push(this);
  },

  // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
  _blurHide: function (arr) {
    arr = $.makeArray(arr);
    arr.push(this.element);
    this._relativeElements = arr;
    Overlay.blurOverlays.push(this);
  },

  // 用于 set 属性后的界面更新
  _onRenderWidth: function (val) {
    this.element.css('width', val);
  },

  _onRenderHeight: function (val) {
    this.element.css('height', val);
  },

  _onRenderZIndex: function (val) {
    this.element.css('zIndex', val);
  },

  _onRenderAlign: function (val) {
    this._setPosition(val);
  },

  _onRenderVisible: function (val) {
    this.element[val ? 'show' : 'hide']();
  }

});

// 绑定 blur 隐藏事件
Overlay.blurOverlays = [];
$(document).on('click', function (e) {
  hideBlurOverlays(e);
});

// 绑定 resize 重新定位事件
var timeout;
var winWidth = $(window).width();
var winHeight = $(window).height();
Overlay.allOverlays = [];

$(window).resize(function () {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(function () {
    var winNewWidth = $(window).width();
    var winNewHeight = $(window).height();

    // IE678 莫名其妙触发 resize
    // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
    if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
      $(Overlay.allOverlays).each(function (i, item) {
        // 当实例为空或隐藏时，不处理
        if (!item || !item.get('visible')) {
          return;
        }
        item._setPosition();
      });
    }

    winWidth = winNewWidth;
    winHeight = winNewHeight;
  }, 80);
});

module.exports = Overlay;


// Helpers
// -------

function isInDocument(element) {
  return $.contains(document.documentElement, element);
}

function hideBlurOverlays(e) {
  $(Overlay.blurOverlays).each(function (index, item) {
    // 当实例为空或隐藏时，不处理
    if (!item || !item.get('visible')) {
      return;
    }

    // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
    for (var i = 0; i < item._relativeElements.length; i++) {
      var el = $(item._relativeElements[i])[0];
      if (el === e.target || $.contains(el, e.target)) {
        return;
      }
    }

    // 到这里，判断触发了元素的 blur 事件，隐藏元素
    item.hide();
  });
}

// 从数组中删除对应元素


function erase(target, array) {
  for (var i = 0; i < array.length; i++) {
    if (target === array[i]) {
      array.splice(i, 1);
      return array;
    }
  }
}


return module.exports;
});

_define_("overlay/mask", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery"),
    Overlay = _using_("overlay/overlay"),
    
    
    ua = (window.navigator.userAgent || "").toLowerCase(),
    isIE6 = ua.indexOf("msie 6") !== -1,
    
    
    body = $(document.body),
	win = $(window),
    doc = $(document);


// Mask
// ----------
// 全屏遮罩层组件
var Mask = Overlay.extend({

  attrs: {
    width: isIE6 ? 0 : '100%',//IE6将script放入head中 doc.outerWidth(true) 报错
    height: isIE6 ? 0 : '100%',

    className: 'ui-mask',
    opacity: 0.2,
    backgroundColor: '#000',
    style: {
      position: isIE6 ? 'absolute' : 'fixed',
      top: 0,
      left: 0
    },

    align: {
      // undefined 表示相对于当前可视范围定位
      baseElement: isIE6 ? body : undefined
    }
  },

  show: function () {
    if (isIE6) {
      this.set('width', win.width());
      this.set('height', doc.height());
    }
    return Mask.superclass.show.call(this);
  },

  _onRenderBackgroundColor: function (val) {
    this.element.css('backgroundColor', val);
  },

  _onRenderOpacity: function (val) {
    this.element.css('opacity', val);
  }
});

// 单例
module.exports = new Mask();

return module.exports;
});

_define_("overlay", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['position'] = CMP.Position || require('../position/position');
_share_.m['iframe-shim'] = CMP.IframeShim || require('../iframe-shim/iframe-shim');
_share_.m['widget'] = CMP.Widget || require('../widget/widget');

//Overlay类不允许重复加载
if(typeof CMP.Overlay != 'function'){
	CMP.Overlay = _using_("overlay/overlay");
	CMP.Overlay.Mask = _using_("overlay/mask");
}

module.exports = CMP.Overlay;

return module.exports;
});

_using_("overlay");

})();

/**
===============================
component : popup
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("popup/popup", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var Overlay = _share_("overlay");


// Popup 是可触发 Overlay 型 UI 组件
var Popup = Overlay.extend({

  attrs: {
    // 触发元素
    trigger: {
      value: null,
      // required
      getter: function (val) {
        return $(val);
      }
    },

    // 触发类型
    triggerType: 'hover',
    // or click or focus
    // 触发事件委托的对象
    delegateNode: {
      value: null,
      getter: function (val) {
        return $(val);
      }
    },

    // 默认的定位参数
    align: {
      value: {
        baseXY: [0, '100%'],
        selfXY: [0, 0]
      },
      setter: function (val) {
        if (!val) {
          return;
        }
        if (val.baseElement) {
          this._specifiedBaseElement = true;
        } else if (this.activeTrigger) {
          // 若给的定位元素未指定基准元素
          // 就给一个...
          val.baseElement = this.activeTrigger;
        }
        return val;
      },
      getter: function (val) {
        // 若未指定基准元素，则按照当前的触发元素进行定位
        return $.extend({}, val, this._specifiedBaseElement ? {} : {
          baseElement: this.activeTrigger
        });
      }
    },

    // 延迟触发和隐藏时间
    delay: 70,

    // 是否能够触发
    // 可以通过set('disabled', true)关闭
    disabled: false,

    // 基本的动画效果，可选 fade|slide
    effect: '',

    // 动画的持续时间
    duration: 250

  },

  setup: function () {
    Popup.superclass.setup.call(this);
    this._bindTrigger();
    this._blurHide(this.get('trigger'));

    // 默认绑定activeTrigger为第一个元素
    // for https://github.com/aralejs/popup/issues/6
    this.activeTrigger = this.get('trigger').eq(0);

    // 当使用委托事件时，_blurHide 方法对于新添加的节点会失效
    // 这时需要重新绑定
    var that = this;
    if (this.get('delegateNode')) {
      this.before('show', function () {
        that._relativeElements = that.get('trigger');
        that._relativeElements.push(that.element);
      });
    }
  },

  render: function () {
    Popup.superclass.render.call(this);

    // 通过 template 生成的元素默认也应该是不可见的
    // 所以插入元素前强制隐藏元素，#20
    this.element.hide();
    return this;
  },

  show: function () {
    if (this.get('disabled')) {
      return;
    }
    return Popup.superclass.show.call(this);
  },

  // triggerShimSync 为 true 时
  // 表示什么都不做，只是触发 hide 的 before/after 绑定方法
  hide: function (triggerShimSync) {
    if (!triggerShimSync) {
      return Popup.superclass.hide.call(this);
    }
    return this;
  },

  _bindTrigger: function () {
    var triggerType = this.get('triggerType');

    if (triggerType === 'click') {
      this._bindClick();
    } else if (triggerType === 'focus') {
      this._bindFocus();
    } else {
      // 默认是 hover
      this._bindHover();
    }
  },

  _bindClick: function () {
    var that = this;

    bindEvent('click', this.get('trigger'), function (e) {
      // this._active 这个变量表明了当前触发元素是激活状态
      if (this._active === true) {
        that.hide();
      } else {
        // 将当前trigger标为激活状态
        makeActive(this);
        that.show();
      }
    }, this.get('delegateNode'), this);

    // 隐藏前清空激活状态
    this.before('hide', function () {
      makeActive();
    });

    // 处理所有trigger的激活状态
    // 若 trigger 为空，相当于清除所有元素的激活状态


    function makeActive(trigger) {
      if (that.get('disabled')) {
        return;
      }
      that.get('trigger').each(function (i, item) {
        if (trigger == item) {
          item._active = true;
          // 标识当前点击的元素
          that.activeTrigger = $(item);
        } else {
          item._active = false;
        }
      });
    }
  },

  _bindFocus: function () {
    var that = this;

    bindEvent('focus', this.get('trigger'), function () {
      // 标识当前点击的元素
      that.activeTrigger = $(this);
      that.show();
    }, this.get('delegateNode'), this);

    bindEvent('blur', this.get('trigger'), function () {
      setTimeout(function () {
        (!that._downOnElement) && that.hide();
        that._downOnElement = false;
      }, that.get('delay'));
    }, this.get('delegateNode'), this);

    // 为了当input blur时能够选择和操作弹出层上的内容
    this.delegateEvents("mousedown", function (e) {
      this._downOnElement = true;
    });
  },

  _bindHover: function () {
    var trigger = this.get('trigger');
    var delegateNode = this.get('delegateNode');
    var delay = this.get('delay');

    var showTimer, hideTimer;
    var that = this;

    // 当 delay 为负数时
    // popup 变成 tooltip 的效果
    if (delay < 0) {
      this._bindTooltip();
      return;
    }

    bindEvent('mouseenter', trigger, function () {
      clearTimeout(hideTimer);
      hideTimer = null;

      // 标识当前点击的元素
      that.activeTrigger = $(this);
      showTimer = setTimeout(function () {
        that.show();
      }, delay);
    }, delegateNode, this);

    bindEvent('mouseleave', trigger, leaveHandler, delegateNode, this);

    // 鼠标在悬浮层上时不消失
    this.delegateEvents("mouseenter", function () {
      clearTimeout(hideTimer);
    });
    this.delegateEvents("mouseleave", leaveHandler);

    this.element.on('mouseleave', 'select', function (e) {
      e.stopPropagation();
    });

    function leaveHandler(e) {
      clearTimeout(showTimer);
      showTimer = null;

      if (that.get('visible')) {
        hideTimer = setTimeout(function () {
          that.hide();
        }, delay);
      }
    }
  },

  _bindTooltip: function () {
    var trigger = this.get('trigger');
    var delegateNode = this.get('delegateNode');
    var that = this;

    bindEvent('mouseenter', trigger, function () {
      // 标识当前点击的元素
      that.activeTrigger = $(this);
      that.show();
    }, delegateNode, this);

    bindEvent('mouseleave', trigger, function () {
      that.hide();
    }, delegateNode, this);
  },

  _onRenderVisible: function (val, originVal) {
    // originVal 为 undefined 时不继续执行
    if (val === !! originVal) {
      return;
    }

    var fade = (this.get('effect').indexOf('fade') !== -1);
    var slide = (this.get('effect').indexOf('slide') !== -1);
    var animConfig = {};
    slide && (animConfig.height = (val ? 'show' : 'hide'));
    fade && (animConfig.opacity = (val ? 'show' : 'hide'));

    // 需要在回调时强制调一下 hide
    // 来触发 iframe-shim 的 sync 方法
    // 修复 ie6 下 shim 未隐藏的问题
    // visible 只有从 true 变为 false 时，才调用这个 hide
    var that = this;
    var hideComplete = val ?
    function () {
      that.trigger('animated');
    } : function () {
      // 参数 true 代表只是为了触发 shim 方法
      that.hide(true);
      that.trigger('animated');
    };

    if (fade || slide) {
      this.element.stop(true, true).animate(animConfig, this.get('duration'), hideComplete).css({
        'visibility': 'visible'
      });
    } else {
      this.element[val ? 'show' : 'hide']();
    }
  }

});

module.exports = Popup;

// 一个绑定事件的简单封装


function bindEvent(type, element, fn, delegateNode, context) {
  var hasDelegateNode = delegateNode && delegateNode[0];

  context.delegateEvents(
  hasDelegateNode ? delegateNode : element, hasDelegateNode ? type + " " + element.selector : type, function (e) {
    fn.call(e.currentTarget, e);
  });
}

return module.exports;
});

_define_("popup", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['overlay'] = CMP.Overlay || require('../overlay/overlay');

module.exports = CMP.Popup = _using_("popup/popup");

return module.exports;
});

_using_("popup");

})();

/**
===============================
component : select
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("select/select.handlebars", function(_using_){
var module = {},exports = module.exports = {};

module.exports = '\
<div class="{{classPrefix}}">\
    <ul class="{{classPrefix}}-content" data-role="content">\
        {{#each select}}\
        <li data-role="item"\
          class="{{../classPrefix}}-item {{#if disabled}}{{../../classPrefix}}-item-disabled{{/if}}"\
          data-value="{{value}}"\
          data-defaultSelected="{{output defaultSelected}}"\
          data-selected="{{output selected}}"\
          data-disabled="{{output disabled}}">{{{text}}}</li>\
        {{/each}}\
    </ul>\
</div>\
';

return module.exports;
});

_define_("select/select", function(_using_){
var module = {},exports = module.exports = {};

var Overlay = _share_("overlay");
var $ = _using_("jquery");
var Templatable = _share_("templatable");

var template = _using_("select/select.handlebars");

var Select = Overlay.extend({

    Implements: Templatable,

    attrs: {
        trigger: {
            value: null, // required
            getter: function(val) {
                return $(val).eq(0);
            }
        },
        classPrefix: 'ui-select',
        template: template,
        // 定位配置
        align: {
            baseXY: [0, '100%-1px']
        },

        // trigger 的 tpl
		triggerTpl: '<a href="#"><span data-role="trigger-content"></span><i></i></a>',

        // 原生 select 的属性
        name: '',
        value: '',
        length: 0,
        selectedIndex: -1,
        multiple: false, // TODO
        disabled: false,
        maxHeight: null,

        // 以下不要覆盖
        selectSource: null // 原生表单项的引用，select/input
    },

    events: {
        'click': function(e){
            e.stopPropagation();
        },
        'click [data-role=item]': function(e) {
            var target = $(e.currentTarget);
            if(!target.data('disabled')){
                this.select(target);
            }
        },
        'mouseenter [data-role=item]': function(e) {
            var target = $(e.currentTarget);
            if(!target.data('disabled')){
                target.addClass(getClassName(this.get('classPrefix'), 'hover'));
            }
        },
        'mouseleave [data-role=item]': function(e) {
            var target = $(e.currentTarget);
            if(!target.data('disabled')){
                target.removeClass(getClassName(this.get('classPrefix'), 'hover'));
            }
        }
    },

    templateHelpers: {
        output: function(data) {
            return data + '';
        }
    },

    // 覆盖父类
    // --------

    initAttrs: function(config, dataAttrsConfig) {
        Select.superclass.initAttrs.call(this, config, dataAttrsConfig);

        var selectName, trigger = this.get('trigger');
        trigger.addClass(getClassName(this.get('classPrefix'), 'trigger'));

        if (trigger[0].tagName.toLowerCase() === 'select') {
            // 初始化 name
            // 如果 select 的 name 存在则覆盖 name 属性
            selectName = trigger.attr('name');
            if (selectName) {
                this.set('name', selectName);
            }

            // 替换之前把 select 保存起来
            this.set('selectSource', trigger);
            // 替换 trigger
            var newTrigger = $(this.get('triggerTpl')).addClass(getClassName(this.get('classPrefix'), 'trigger'));
            this.set('trigger', newTrigger);
            this._initFromSelect = true;

            // 隐藏原生控件
            // 不用 hide() 的原因是需要和 arale/validator 的 skipHidden 来配合
            trigger.after(newTrigger).css({
                position: 'absolute',
                left: '-99999px',
                zIndex: -100
            });

            // trigger 如果为 select 则根据 select 的结构生成
            this.set("model", convertSelect(trigger[0], this.get('classPrefix')));
        } else {
            // 如果 name 存在则创建隐藏域
            selectName = this.get('name');
            if (selectName) {
                var input = $('input[name="' + selectName + '"]').eq(0);
                if (!input[0]) {
                    input = $(
                        '<input type="text" id="select-' + selectName.replace(/\./g, '-') +
                        '" name="' + selectName +
                        '" />'
                    ).css({
                        position: 'absolute',
                        left: '-99999px',
                        zIndex: -100
                    }).insertAfter(trigger);
                }
                this.set('selectSource', input);
            }

            // trigger 如果为其他 DOM，则由用户提供 model
            this.set("model", completeModel(this.get("model"), this.get('classPrefix')));
        }
    },

    setup: function() {
        this._bindEvents();
        this._initOptions();
        this._initHeight();
        this._tweakAlignDefaultValue();
        // 调用 overlay，点击 body 隐藏
        this._blurHide(this.get('trigger'));
        Select.superclass.setup.call(this);
    },

    render: function() {
        Select.superclass.render.call(this);
        this._setTriggerWidth();
        return this;
    },

    destroy: function() {
        if (this._initFromSelect) {
            this.get('trigger').remove();
        }
        this.get('selectSource') && this.get('selectSource').remove();
        this.element.remove();
        Select.superclass.destroy.call(this);
    },

    // 方法接口
    // --------

    select: function(option) {
        var selectIndex = getOptionIndex(option, this.options);
        var oldSelectIndex = this.get('selectedIndex');
        this.set('selectedIndex', selectIndex);

        // 同步 html 到 model
        var model = this.get('model');
        if (oldSelectIndex >= 0) {
            model.select[oldSelectIndex].selected = false;
        }
        if (selectIndex >= 0) {
            model.select[selectIndex].selected = true;
        }
        this.set('model', model);

        // 如果不是原来选中的则触发 change 事件
        if (oldSelectIndex !== selectIndex) {
            var current = this.options.eq(selectIndex);
            var previous  = this.options.eq(oldSelectIndex);
            this.trigger('change', current, previous);
        }

        this.hide();
        return this;
    },

    syncModel: function(model) {
        this.set("model", completeModel(model, this.get('classPrefix')));
        this.renderPartial('[data-role=content]');
        // 同步原来的 select
        syncSelect(this.get('selectSource'), model);
        // 渲染后重置 select 的属性
        this.options = this.$('[data-role=content]').children();
        this.set('length', this.options.length);
        this.set('selectedIndex', -1);
        this.set('value', '');

        var selectIndex = getOptionIndex('[data-selected=true]', this.options);
        var oldSelectIndex = this.get('selectedIndex');
        this.set('selectedIndex', selectIndex);

        // 重新设置 trigger 宽度
        this._setTriggerWidth();
        return this;
    },

    getOption: function(option) {
        var index = getOptionIndex(option, this.options);
        return this.options.eq(index);
    },

    addOption: function(option) {
        var model = this.get("model").select;
        model.push(option);
        this.syncModel(model);
        return this;
    },

    removeOption: function(option) {
        var removedIndex = getOptionIndex(option, this.options),
            oldIndex = this.get('selectedIndex'),
            removedOption = this.options.eq(removedIndex);

        // 删除 option，更新属性
        removedOption.remove();
        this.options = this.$('[data-role=content]').children();
        this.set('length', this.options.length);

        // 如果被删除的是当前选中的，则选中第一个
        if (removedIndex === oldIndex) {
            this.set('selectedIndex', 0);

        // 如果被删除的在选中的前面，则选中的索引向前移动一格
        } else if (removedIndex < oldIndex) {
            this.set('selectedIndex', oldIndex - 1);
        }
        return this;
    },

    enableOption: function(option) {
        var index = getOptionIndex(option, this.options);
        var model = this.get("model").select;
        model[index].disabled = false;
        this.syncModel(model);
        return this;
    },

    disableOption: function(option) {
        var index = getOptionIndex(option, this.options);
        var model = this.get("model").select;
        model[index].disabled = true;
        this.syncModel(model);
        return this;
    },

    // set 后的回调
    // ------------

    _onRenderSelectedIndex: function(index) {
        if (index === -1) return;

        var selected = this.options.eq(index),
            currentItem = this.currentItem,
            value = selected.attr('data-value');

        // 如果两个 DOM 相同则不再处理
        if (currentItem && selected[0] === currentItem[0]) {
            return;
        }

        // 设置原来的表单项
        var source = this.get('selectSource');
        if (source) {
            if (source[0].tagName.toLowerCase() === 'select') {
                source[0].selectedIndex = index;
            } else {
               source[0].value = value;
            }
        }

        // 处理之前选中的元素
        if (currentItem) {
            currentItem.attr('data-selected', 'false')
                .removeClass(getClassName(this.get('classPrefix'), 'selected'));
        }

        // 处理当前选中的元素
        selected.attr('data-selected', 'true')
            .addClass(getClassName(this.get('classPrefix'), 'selected'));
        this.set('value', value);

        // 填入选中内容，位置先找 "data-role"="trigger-content"，再找 trigger
        var trigger = this.get('trigger');
        var triggerContent = trigger.find('[data-role=trigger-content]');
        if (triggerContent.length) {
            triggerContent.html(selected.html());
        } else {
            trigger.html(selected.html());
        }
        this.currentItem = selected;
    },

    _onRenderDisabled: function(val) {
        var className = getClassName(this.get('classPrefix'), 'disabled');
        var trigger = this.get('trigger');
        trigger[(val ? 'addClass' : 'removeClass')](className);

        // trigger event
        var selected = this.options.eq(this.get('selectedIndex'));
        this.trigger('disabledChange', selected, val);
    },

    // 私有方法
    // ------------

    _bindEvents: function() {
        var trigger = this.get('trigger');

        this.delegateEvents(trigger, "mousedown", this._triggerHandle);
        this.delegateEvents(trigger, "click", function(e) {
            e.preventDefault();
        });
        this.delegateEvents(trigger, 'mouseenter', function(e) {
            trigger.addClass(getClassName(this.get('classPrefix'), 'trigger-hover'));
        });
        this.delegateEvents(trigger, 'mouseleave', function(e) {
            trigger.removeClass(getClassName(this.get('classPrefix'), 'trigger-hover'));
        });
    },

    _initOptions: function() {
        this.options = this.$('[data-role=content]').children();
        // 初始化 select 的参数
        // 必须在插入文档流后操作
        this.select('[data-selected=true]');
        this.set('length', this.options.length);
    },

    // trigger 的宽度和浮层保持一致
    _setTriggerWidth: function() {
        var trigger = this.get('trigger');
        var width = this.element.outerWidth();
        var pl = parseInt(trigger.css('padding-left'), 10);
        var pr = parseInt(trigger.css('padding-right'), 10);
        // maybe 'thin|medium|thick' in IE
        // just give a 0
        var bl = parseInt(trigger.css('border-left-width'), 10) || 0;
        var br = parseInt(trigger.css('border-right-width'), 10) || 0;
        trigger.css('width', width - pl - pr - bl - br);
    },

    // borrow from dropdown
    // 调整 align 属性的默认值, 在 trigger 下方
    _tweakAlignDefaultValue: function() {
        var align = this.get('align');
        // 默认基准定位元素为 trigger
        if (align.baseElement._id === 'VIEWPORT') {
            align.baseElement = this.get('trigger');
        }
        this.set('align', align);
    },

    _triggerHandle: function(e) {
        e.preventDefault();
        if (!this.get('disabled')) {
            this.get('visible') ? this.hide() : this.show();
        }
    },

    _initHeight: function() {
        this.after('show', function() {
            var maxHeight = this.get('maxHeight');
            if (maxHeight) {
                var ul = this.$('[data-role=content]');
                var height = getLiHeight(ul);
                this.set('height', height > maxHeight ? maxHeight : '');
                ul.scrollTop(0);
            }
        });
    }
});

module.exports = Select;

// Helper
// ------

// 将 select 对象转换为 model
//
// <select>
//   <option value='value1'>text1</option>
//   <option value='value2' selected>text2</option>
//   <option value='value3' disabled>text3</option>
// </select>
//
// ------->
//
// [
//   {value: 'value1', text: 'text1',
//      defaultSelected: false, selected: false, disabled: false}
//   {value: 'value2', text: 'text2',
//      defaultSelected: true, selected: true, disabled: false}
//   {value: 'value3', text: 'text3',
//      defaultSelected: false, selected: false, disabled: true}
// ]
function convertSelect(select, classPrefix) {
    var i, model = [], options = select.options,
        l = options.length, hasDefaultSelect = false;
    for (i = 0; i < l; i++) {
        var j, o = {}, option = options[i];
        var fields = ['text', 'value', 'defaultSelected', 'selected', 'disabled'];
        for (j in fields) {
            var field = fields[j];
            o[field] = option[field];
        }
        if (option.selected) hasDefaultSelect = true;
        model.push(o);
    }
    // 当所有都没有设置 selected，默认设置第一个
    if (!hasDefaultSelect && model.length) {
        model[0].selected = 'true';
    }
    return {select: model, classPrefix: classPrefix};
}

// 补全 model 对象
function completeModel(model, classPrefix) {
    var i, j, l, ll, newModel = [], selectIndexArray = [];
    for (i = 0, l = model.length; i < l; i++) {
        var o = $.extend({}, model[i]);
        if (o.selected) selectIndexArray.push(i);
        o.selected = o.defaultSelected = !!o.selected;
        o.disabled = !!o.disabled;
        newModel.push(o);
    }
    if (selectIndexArray.length > 0) {
        // 如果有多个 selected 则选中最后一个
        selectIndexArray.pop();
        for (j = 0, ll = selectIndexArray.length; j < ll; j++) {
            newModel[selectIndexArray[j]].selected = false;
        }
    } else { //当所有都没有设置 selected 则默认设置第一个
        newModel[0].selected = true;
    }
    return {select: newModel, classPrefix: classPrefix};
}

function getOptionIndex(option, options) {
    var index;
    if ($.isNumeric(option)) { // 如果是索引
        index = option;
    } else if (typeof option === 'string') { // 如果是选择器
        index = options.index(options.parent().find(option));
    } else { // 如果是 DOM
        index = options.index(option);
    }
    return index;
}

function syncSelect(select, model) {
    if (!(select && select[0])) return;
    select = select[0];
    if (select.tagName.toLowerCase() === 'select') {
        $(select).find('option').remove();
        for (var i in model) {
            var m  = model[i];
            var option = document.createElement("option");
            option.text = m.text;
            option.value = m .value;
            select.add(option);
        }
    }
}

// 获取 className ，如果 classPrefix 不设置，就返回 ''
function getClassName(classPrefix, className){
    if(!classPrefix) return '';
    return classPrefix + '-' + className;
}

// 获取 ul 中所有 li 的高度
function getLiHeight (ul) {
    var height = 0;
    ul.find('li').each(function(index, item) {
        height += $(item).outerHeight();
    });
    return height;
}


return module.exports;
});

_define_("select", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['overlay'] = CMP.Overlay || require('../overlay/overlay');
_share_.m['templatable'] = CMP.Templatable || require('../templatable/templatable');

module.exports = CMP.Select = _using_("select/select");

return module.exports;
});

_using_("select");

})();

/**
===============================
component : autocomplete
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("autocomplete/data-source", function(_using_){
var module = {},exports = module.exports = {};

var Base = _share_("base");
var $ = _using_("jquery");

var DataSource = Base.extend({

  attrs: {
    source: null,
    type: 'array'
  },

  initialize: function (config) {
    DataSource.superclass.initialize.call(this, config);

    // 每次发送请求会将 id 记录到 callbacks 中，返回后会从中删除
    // 如果 abort 会清空 callbacks，之前的请求结果都不会执行
    this.id = 0;
    this.callbacks = [];

    var source = this.get('source');
    if (isString(source)) {
      this.set('type', 'url');
    } else if ($.isArray(source)) {
      this.set('type', 'array');
    } else if ($.isPlainObject(source)) {
      this.set('type', 'object');
    } else if ($.isFunction(source)) {
      this.set('type', 'function');
    } else {
      throw new Error('Source Type Error');
    }
  },

  getData: function (query) {
    return this['_get' + capitalize(this.get('type') || '') + 'Data'](query);
  },

  abort: function () {
    this.callbacks = [];
  },

  // 完成数据请求，getData => done
  _done: function (data) {
    this.trigger('data', data);
  },

  _getUrlData: function (query) {
    var that = this,
        options;
    var obj = {
      query: query ? encodeURIComponent(query) : '',
      timestamp: new Date().getTime()
    };
    var url = this.get('source').replace(/\{\{(.*?)\}\}/g, function (all, match) {
      return obj[match];
    });

    var callbackId = 'callback_' + this.id++;
    this.callbacks.push(callbackId);

    if (/^(https?:\/\/)/.test(url)) {
      options = {
        dataType: 'jsonp'
      };
    } else {
      options = {
        dataType: 'json'
      };
    }
    $.ajax(url, options).success(function (data) {
      if ($.inArray(callbackId, that.callbacks) > -1) {
        delete that.callbacks[callbackId];
        that._done(data);
      }
    }).error(function () {
      if ($.inArray(callbackId, that.callbacks) > -1) {
        delete that.callbacks[callbackId];
        that._done({});
      }
    });
  },

  _getArrayData: function () {
    var source = this.get('source');
    this._done(source);
    return source;
  },

  _getObjectData: function () {
    var source = this.get('source');
    this._done(source);
    return source;
  },

  _getFunctionData: function (query) {
    var that = this,
        func = this.get('source');

    // 如果返回 false 可阻止执行
    var data = func.call(this, query, done);
    if (data) {
      this._done(data);
    }

    function done(data) {
      that._done(data);
    }
  }
});

module.exports = DataSource;

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

function capitalize(str) {
  return str.replace(/^([a-z])/, function (f, m) {
    return m.toUpperCase();
  });
}


return module.exports;
});

_define_("autocomplete/filter", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");

var Filter = {
  'default': function (data) {
    return data;
  },

  'startsWith': function (data, query) {
    query = query || '';
    var result = [],
        l = query.length,
        reg = new RegExp('^' + escapeKeyword(query));

    if (!l) return [];

    $.each(data, function (index, item) {
      var a, matchKeys = [item.value].concat(item.alias);

      // 匹配 value 和 alias 中的
      while (a = matchKeys.shift()) {
        if (reg.test(a)) {
          // 匹配和显示相同才有必要高亮
          if (item.label === a) {
            item.highlightIndex = [
              [0, l]
            ];
          }
          result.push(item);
          break;
        }
      }
    });
    return result;
  },


  'stringMatch': function (data, query) {
    query = query || '';
    var result = [],
        l = query.length;

    if (!l) return [];

    $.each(data, function (index, item) {
      var a, matchKeys = [item.value].concat(item.alias);

      // 匹配 value 和 alias 中的
      while (a = matchKeys.shift()) {
        if (a.indexOf(query) > -1) {
          // 匹配和显示相同才有必要高亮
          if (item.label === a) {
            item.highlightIndex = stringMatch(a, query);
          }
          result.push(item);
          break;
        }
      }
    });
    return result;
  }
};

module.exports = Filter;

// 转义正则关键字
var keyword = /(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?|\\)/g;

function escapeKeyword(str) {
  return (str || '').replace(keyword, '\\$1');
}

function stringMatch(matchKey, query) {
  var r = [],
      a = matchKey.split('');
  var queryIndex = 0,
      q = query.split('');
  for (var i = 0, l = a.length; i < l; i++) {
    var v = a[i];
    if (v === q[queryIndex]) {
      if (queryIndex === q.length - 1) {
        r.push([i - q.length + 1, i + 1]);
        queryIndex = 0;
        continue;
      }
      queryIndex++;
    } else {
      queryIndex = 0;
    }
  }
  return r;
}

return module.exports;
});

_define_("autocomplete/input", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var Base = _share_("base");

var lteIE9 = /\bMSIE [6789]\.0\b/.test(navigator.userAgent);
var specialKeyCodeMap = {
  9: 'tab',
  27: 'esc',
  37: 'left',
  39: 'right',
  13: 'enter',
  38: 'up',
  40: 'down'
};

var Input = Base.extend({

  attrs: {
    element: {
      value: null,
      setter: function (val) {
        return $(val);
      }
    },
    query: null,
    delay: 100
  },

  initialize: function () {
    Input.superclass.initialize.apply(this, arguments);

    // bind events
    this._bindEvents();

    // init query
    this.set('query', this.getValue());
  },

  focus: function () {
    this.get('element').focus();
  },

  getValue: function () {
    return this.get('element').val();
  },

  setValue: function (val, silent) {
    this.get('element').val(val);
    !silent && this._change();
  },

  destroy: function () {
    Input.superclass.destroy.call(this);
  },

  _bindEvents: function () {
    var timer, input = this.get('element');

    input.attr('autocomplete', 'off').on('focus.autocomplete', wrapFn(this._handleFocus, this)).on('blur.autocomplete', wrapFn(this._handleBlur, this)).on('keydown.autocomplete', wrapFn(this._handleKeydown, this));

    // IE678 don't support input event
    // IE 9 does not fire an input event when the user removes characters from input filled by keyboard, cut, or drag operations.
    if (!lteIE9) {
      input.on('input.autocomplete', wrapFn(this._change, this));
    } else {
      var that = this,
          events = ['keydown.autocomplete', 'keypress.autocomplete', 'cut.autocomplete', 'paste.autocomplete'].join(' ');

      input.on(events, wrapFn(function (e) {
        if (specialKeyCodeMap[e.which]) return;

        clearTimeout(timer);
        timer = setTimeout(function () {
          that._change.call(that, e);
        }, this.get('delay'));
      }, this));
    }
  },

  _change: function () {
    var newVal = this.getValue();
    var oldVal = this.get('query');
    var isSame = compare(oldVal, newVal);
    var isSameExpectWhitespace = isSame ? (newVal.length !== oldVal.length) : false;

    if (isSameExpectWhitespace) {
      this.trigger('whitespaceChanged', oldVal);
    }
    if (!isSame) {
      this.set('query', newVal);
      this.trigger('queryChanged', newVal, oldVal);
    }
  },

  _handleFocus: function (e) {
    this.trigger('focus', e);
  },

  _handleBlur: function (e) {
    this.trigger('blur', e);
  },

  _handleKeydown: function (e) {
    var keyName = specialKeyCodeMap[e.which];
    if (keyName) {
      var eventKey = 'key' + ucFirst(keyName);
      this.trigger(e.type = eventKey, e);
    }
  }
});

module.exports = Input;

function wrapFn(fn, context) {
  return function () {
    fn.apply(context, arguments);
  };
}

function compare(a, b) {
  a = (a || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
  b = (b || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
  return a === b;
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

return module.exports;
});

_define_("autocomplete/autocomplete.handlebars", function(_using_){
var module = {},exports = module.exports = {};

module.exports = '\
<div class="{{classPrefix}}">\
  <div class="{{classPrefix}}-content">\
    {{> header}}\
    <ul data-role="items">\
    {{#each items}}\
      <li data-role="item" class="{{../classPrefix}}-item">\
        {{#include parent=.. }}{{> html}}{{/include}}\
      </li>\
    {{/each}}\
    </ul>\
    {{> footer}}\
  </div>\
</div>\
';

return module.exports;
});

_define_("autocomplete/autocomplete", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var Overlay = _share_("overlay");
var Templatable = _share_("templatable");
var DataSource = _using_("autocomplete/data-source");
var Filter = _using_("autocomplete/filter");
var Input = _using_("autocomplete/input");

var IE678 = /\bMSIE [678]\.0\b/.test(navigator.userAgent);
var template = _using_("autocomplete/autocomplete.handlebars");

var AutoComplete = Overlay.extend({

  Implements: Templatable,

  attrs: {
    // 触发元素
    trigger: null,
    classPrefix: 'ui-select',
    align: {
      baseXY: [0, '100%']
    },
    submitOnEnter: true,
    // 回车是否会提交表单
    dataSource: { //数据源，支持 Array, URL, Object, Function
      value: [],
      getter: function (val) {
        var that = this;
        if ($.isFunction(val)) {
          return function () {
            return val.apply(that, arguments);
          };
        }
        return val;
      }
    },
    locator: 'data',
    // 输出过滤
    filter: null,
    disabled: false,
    selectFirst: false,
    delay: 100,
    // 以下为模板相关
    model: {
      value: {
        items: []
      },
      getter: function (val) {
        val.classPrefix || (val.classPrefix = this.get('classPrefix'));
        return val;
      }
    },
    template: template,
    footer: '',
    header: '',
    html: '{{{label}}}',
    // 以下仅为组件使用
    selectedIndex: null,
    data: []
  },

  events: {
    'mousedown [data-role=items]': '_handleMouseDown',
    'click [data-role=item]': '_handleSelection',
    'mouseenter [data-role=item]': '_handleMouseMove',
    'mouseleave [data-role=item]': '_handleMouseMove'
  },

  templateHelpers: {
    // 将匹配的高亮文字加上 hl 的样式
    highlightItem: highlightItem,
    include: include
  },

  parseElement: function () {
    var that = this;
    this.templatePartials || (this.templatePartials = {});
    $.each(['header', 'footer', 'html'], function (index, item) {
      that.templatePartials[item] = that.get(item);
    });
    AutoComplete.superclass.parseElement.call(this);
  },

  setup: function () {
    AutoComplete.superclass.setup.call(this);

    this._isOpen = false;
    this._initInput(); // 初始化输入框
    this._initDataSource(); // 初始化数据源
    this._initFilter(); // 初始化过滤器
    this._bindHandle(); // 绑定事件
    this._blurHide([$(this.get('trigger'))]);
    this._tweakAlignDefaultValue();

    this.on('indexChanged', function (index) {
      // scroll current item into view
      //this.currentItem.scrollIntoView();
      var containerHeight = parseInt(this.get('height'), 10);
      if (!containerHeight) return;

      var itemHeight = this.items.parent().height() / this.items.length,
          itemTop = Math.max(0, itemHeight * (index + 1) - containerHeight);
      this.element.children().scrollTop(itemTop);
    });
  },

  show: function () {
    this._isOpen = true;
    // 无数据则不显示
    if (this._isEmpty()) return;
    AutoComplete.superclass.show.call(this);
  },

  hide: function () {
    // 隐藏的时候取消请求或回调
    if (this._timeout) clearTimeout(this._timeout);
    this.dataSource.abort();
    this._hide();
  },

  destroy: function () {
    this._clear();
    if (this.input) {
      this.input.destroy();
      this.input = null;
    }
    AutoComplete.superclass.destroy.call(this);
  },


  // Public Methods
  // --------------
  selectItem: function (index) {
    if (this.items) {
      if (index && this.items.length > index && index >= -1) {
        this.set('selectedIndex', index);
      }
      this._handleSelection();
    }
  },

  setInputValue: function (val) {
    this.input.setValue(val);
  },

  // Private Methods
  // ---------------

  // 数据源返回，过滤数据
  _filterData: function (data) {
    var filter = this.get('filter'),
        locator = this.get('locator');

    // 获取目标数据
    data = locateResult(locator, data);

    // 进行过滤
    data = filter.call(this, normalize(data), this.input.get('query'));

    this.set('data', data);
  },

  // 通过数据渲染模板
  _onRenderData: function (data) {
    data || (data = []);

    // 渲染下拉
    this.set('model', {
      items: data,
      query: this.input.get('query'),
      length: data.length
    });

    this.renderPartial();

    // 初始化下拉的状态
    this.items = this.$('[data-role=items]').children();

    if (this.get('selectFirst')) {
      this.set('selectedIndex', 0);
    }

    // 选中后会修改 input 的值并触发下一次渲染，但第二次渲染的结果不应该显示出来。
    this._isOpen && this.show();
  },

  // 键盘控制上下移动
  _onRenderSelectedIndex: function (index) {
    var hoverClass = this.get('classPrefix') + '-item-hover';
    this.items && this.items.removeClass(hoverClass);

    // -1 什么都不选
    if (index === -1) return;

    this.items.eq(index).addClass(hoverClass);
    this.trigger('indexChanged', index, this.lastIndex);
    this.lastIndex = index;
  },

  // 初始化
  // ------------
  _initDataSource: function () {
    this.dataSource = new DataSource({
      source: this.get('dataSource')
    });
  },

  _initInput: function () {
    this.input = new Input({
      element: this.get('trigger'),
      delay: this.get('delay')
    });
  },

  _initFilter: function () {
    var filter = this.get('filter');
    filter = initFilter(filter, this.dataSource);
    this.set('filter', filter);
  },

  // 事件绑定
  // ------------
  _bindHandle: function () {
    this.dataSource.on('data', this._filterData, this);

    this.input.on('blur', this.hide, this).on('focus', this._handleFocus, this).on('keyEnter', this._handleSelection, this).on('keyEsc', this.hide, this).on('keyUp keyDown', this.show, this).on('keyUp keyDown', this._handleStep, this).on('queryChanged', this._clear, this).on('queryChanged', this._hide, this).on('queryChanged', this._handleQueryChange, this).on('queryChanged', this.show, this);

    this.after('hide', function () {
      this.set('selectedIndex', -1);
    });

    // 选中后隐藏浮层
    this.on('itemSelected', function () {
      this._hide();
    });
  },

  // 选中的处理器
  // 1. 鼠标点击触发
  // 2. 回车触发
  // 3. selectItem 触发
  _handleSelection: function (e) {
    if (!this.items) return;
    var isMouse = e ? e.type === 'click' : false;
    var index = isMouse ? this.items.index(e.currentTarget) : this.get('selectedIndex');
    var item = this.items.eq(index);
    var data = this.get('data')[index];

    if (index >= 0 && item && data) {
      this.input.setValue(data.target);
      this.set('selectedIndex', index, {
        silent: true
      });

      // 是否阻止回车提交表单
      if (e && !isMouse && !this.get('submitOnEnter')) e.preventDefault();

      this.trigger('itemSelected', data, item);
    }
  },

  _handleFocus: function () {
    this._isOpen = true;
  },

  _handleMouseMove: function (e) {
    var hoverClass = this.get('classPrefix') + '-item-hover';
    this.items.removeClass(hoverClass);
    if (e.type === 'mouseenter') {
      var index = this.items.index(e.currentTarget);
      this.set('selectedIndex', index, {
        silent: true
      });
      this.items.eq(index).addClass(hoverClass);
    }
  },

  _handleMouseDown: function (e) {
    if (IE678) {
      var trigger = this.input.get('element')[0];
      trigger.onbeforedeactivate = function () {
        window.event.returnValue = false;
        trigger.onbeforedeactivate = null;
      };
    }
    e.preventDefault();
  },

  _handleStep: function (e) {
    e.preventDefault();
    this.get('visible') && this._step(e.type === 'keyUp' ? -1 : 1);
  },

  _handleQueryChange: function (val, prev) {
    if (this.get('disabled')) return;

    this.dataSource.abort();
    this.dataSource.getData(val);
  },

  // 选项上下移动
  _step: function (direction) {
    var currentIndex = this.get('selectedIndex');
    if (direction === -1) { // 反向
      if (currentIndex > -1) {
        this.set('selectedIndex', currentIndex - 1);
      } else {
        this.set('selectedIndex', this.items.length - 1);
      }
    } else if (direction === 1) { // 正向
      if (currentIndex < this.items.length - 1) {
        this.set('selectedIndex', currentIndex + 1);
      } else {
        this.set('selectedIndex', -1);
      }
    }
  },

  _clear: function () {
    this.$('[data-role=items]').empty();
    this.set('selectedIndex', -1);
    delete this.items;
    delete this.lastIndex;
  },

  _hide: function () {
    this._isOpen = false;
    AutoComplete.superclass.hide.call(this);
  },

  _isEmpty: function () {
    var data = this.get('data');
    return !(data && data.length > 0);
  },

  // 调整 align 属性的默认值
  _tweakAlignDefaultValue: function () {
    var align = this.get('align');
    align.baseElement = this.get('trigger');
    this.set('align', align);
  }
});

module.exports = AutoComplete;

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

// 通过 locator 找到 data 中的某个属性的值
// 1. locator 支持 function，函数返回值为结果
// 2. locator 支持 string，而且支持点操作符寻址
//     data {
//       a: {
//         b: 'c'
//       }
//     }
//     locator 'a.b'
// 最后的返回值为 c

function locateResult(locator, data) {
  if (locator) {
    if ($.isFunction(locator)) {
      return locator.call(this, data);
    } else if (!$.isArray(data) && isString(locator)) {
      var s = locator.split('.'),
          p = data;
      while (s.length) {
        var v = s.shift();
        if (!p[v]) {
          break;
        }
        p = p[v];
      }
      return p;
    }
  }
  return data;
}

// 标准格式，不匹配则忽略
//
//   {
//     label: '', 显示的字段
//     value: '', 匹配的字段
//     target: '', input的最终值
//     alias: []  其他匹配的字段
//   }

function normalize(data) {
  var result = [];
  $.each(data, function (index, item) {
    if (isString(item)) {
      result.push({
        label: item,
        value: item,
        target: item,
        alias: []
      });
    } else if (isObject(item)) {
      if (!item.value && !item.label) return;
      item.value || (item.value = item.label);
      item.label || (item.label = item.value);
      item.target || (item.target = item.label);
      item.alias || (item.alias = []);
      result.push(item);
    }
  });
  return result;
}

// 初始化 filter
// 支持的格式
//   1. null: 使用默认的 startsWith
//   2. string: 从 Filter 中找，如果不存在则用 default
//   3. function: 自定义

function initFilter(filter, dataSource) {
  // 字符串
  if (isString(filter)) {
    // 从组件内置的 FILTER 获取
    if (Filter[filter]) {
      filter = Filter[filter];
    } else {
      filter = Filter['default'];
    }
  }
  // 非函数为默认值
  else if (!$.isFunction(filter)) {
    // 异步请求的时候不需要过滤器
    if (dataSource.get('type') === 'url') {
      filter = Filter['default'];
    } else {
      filter = Filter['startsWith'];
    }
  }
  return filter;
}

function include(options) {
  var context = {};

  mergeContext(this);
  mergeContext(options.hash);
  return options.fn(context);

  function mergeContext(obj) {
    for (var k in obj) context[k] = obj[k];
  }
}

function highlightItem(label) {
  var index = this.highlightIndex,
      classPrefix = this.parent ? this.parent.classPrefix : '',
      cursor = 0,
      v = label || this.label || '',
      h = '';
  if ($.isArray(index)) {
    for (var i = 0, l = index.length; i < l; i++) {
      var j = index[i],
          start, length;
      if ($.isArray(j)) {
        start = j[0];
        length = j[1] - j[0];
      } else {
        start = j;
        length = 1;
      }

      if (start > cursor) {
        h += v.substring(cursor, start);
      }
      if (start < v.length) {
        var className = classPrefix ? ('class="' + classPrefix + '-item-hl"') : '';
        h += '<span ' + className + '>' + v.substr(start, length) + '</span>';
      }
      cursor = start + length;
      if (cursor >= v.length) {
        break;
      }
    }
    if (v.length > cursor) {
      h += v.substring(cursor, v.length);
    }
    return h;
  }
  return v;
}


return module.exports;
});

_define_("autocomplete", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['base'] = CMP.Base || require('../base/base').Base;
_share_.m['overlay'] = CMP.Overlay || require('../overlay/overlay');
_share_.m['templatable'] = CMP.Templatable || require('../templatable/templatable');

module.exports = CMP.Autocomplete = _using_("autocomplete/autocomplete");

return module.exports;
});

_using_("autocomplete");

})();

/**
===============================
component : dialog
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("dialog/dialog.handlebars", function(_using_){
var module = {},exports = module.exports = {};

module.exports = '\
<div class="{{classPrefix}}">\
    <a class="{{classPrefix}}-close" title="Close" href="javascript:;" data-role="close"></a>\
    <div class="{{classPrefix}}-content" data-role="content"></div>\
</div>\
';

return module.exports;
});

_define_("dialog/dialog", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery"),
    Overlay = _share_("overlay"),
    mask = Overlay.Mask,
    Events = _share_("events"),
    Templatable = _share_("templatable");

// Dialog
// ---
// Dialog 是通用对话框组件，提供显隐关闭、遮罩层、内嵌iframe、内容区域自定义功能。
// 是所有对话框类型组件的基类。
var Dialog = Overlay.extend({

  Implements: Templatable,

  attrs: {
    // 模板
    template: _using_("dialog/dialog.handlebars"),

    // 对话框触发点
    trigger: {
      value: null,
      getter: function (val) {
        return $(val);
      }
    },

    // 统一样式前缀
    classPrefix: 'ui-dialog',

    // 指定内容元素，可以是 url 地址
    content: {
      value: null,
      setter: function (val) {
        // 判断是否是 url 地址
        if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(val)) {
          this._type = 'iframe';
          // 用 ajax 的方式而不是 iframe 进行载入
          if (val.indexOf('?ajax') > 0 || val.indexOf('&ajax') > 0) {
            this._ajax = true;
          }
        }
        return val;
      }
    },

    // 是否有背景遮罩层
    hasMask: true,

    // 关闭按钮可以自定义
    closeTpl: '×',

    // 默认宽度
    width: 500,

    // 默认高度
    height: null,

    // iframe 类型时，dialog 的最初高度
    initialHeight: 300,

    // 简单的动画效果 none | fade
    effect: 'none',

    // 不用解释了吧
    zIndex: 999,

    // 是否自适应高度
    autoFit: true,

    // 默认定位左右居中，略微靠上
    align: {
      value: {
        selfXY: ['50%', '50%'],
        baseXY: ['50%', '42%']
      },
      getter: function (val) {
        // 高度超过窗口的 42/50 浮层头部顶住窗口
        // https://github.com/aralejs/dialog/issues/41
        if (this.element.height() > $(window).height() * 0.84) {
          return {
            selfXY: ['50%', '0'],
            baseXY: ['50%', '0']
          };
        }
        return val;
      }
    }
  },


  parseElement: function () {
    this.set("model", {
      classPrefix: this.get('classPrefix')
    });
    Dialog.superclass.parseElement.call(this);
    this.contentElement = this.$('[data-role=content]');

    // 必要的样式
    this.contentElement.css({
      height: '100%',
      zoom: 1
    });
    // 关闭按钮先隐藏
    // 后面当 onRenderCloseTpl 时，如果 closeTpl 不为空，会显示出来
    // 这样写是为了回避 arale.base 的一个问题：
    // 当属性初始值为''时，不会进入 onRender 方法
    // https://github.com/aralejs/base/issues/7
    this.$('[data-role=close]').hide();
  },

  events: {
    'click [data-role=close]': function (e) {
      e.preventDefault();
      this.hide();
    }
  },

  show: function () {
    // iframe 要在载入完成才显示
    if (this._type === 'iframe') {
      // ajax 读入内容并 append 到容器中
      if (this._ajax) {
        this._ajaxHtml();
      } else {
        // iframe 还未请求完，先设置一个固定高度
        !this.get('height') && this.contentElement.css('height', this.get('initialHeight'));
        this._showIframe();
      }
    }

    Dialog.superclass.show.call(this);
    return this;
  },

  hide: function () {
    // 把 iframe 状态复原
    if (this._type === 'iframe' && this.iframe) {
      this.iframe.attr({
        src: 'javascript:\'\';'
      });
      // 原来只是将 iframe 的状态复原
      // 但是发现在 IE6 下，将 src 置为 javascript:''; 会出现 404 页面
      this.iframe.remove();
      this.iframe = null;
    }

    Dialog.superclass.hide.call(this);
    clearInterval(this._interval);
    delete this._interval;
    return this;
  },

  destroy: function () {
    this.element.remove();
    this._hideMask();
    clearInterval(this._interval);
    return Dialog.superclass.destroy.call(this);
  },

  setup: function () {
    Dialog.superclass.setup.call(this);

    this._setupTrigger();
    this._setupMask();
    this._setupKeyEvents();
    this._setupFocus();
    toTabed(this.element);
    toTabed(this.get('trigger'));

    // 默认当前触发器
    this.activeTrigger = this.get('trigger').eq(0);
  },

  // onRender
  // ---
  _onRenderContent: function (val) {
    if (this._type !== 'iframe') {
      var value;
      // 有些情况会报错
      try {
        value = $(val);
      } catch (e) {
        value = [];
      }
      if (value[0]) {
        this.contentElement.empty().append(value);
      } else {
        this.contentElement.empty().html(val);
      }
      // #38 #44
      this._setPosition();
    }
  },

  _onRenderCloseTpl: function (val) {
    if (val === '') {
      this.$('[data-role=close]').html(val).hide();
    } else {
      this.$('[data-role=close]').html(val).show();
    }
  },

  // 覆盖 overlay，提供动画
  _onRenderVisible: function (val) {
    if (val) {
      if (this.get('effect') === 'fade') {
        // 固定 300 的动画时长，暂不可定制
        this.element.fadeIn(300);
      } else {
        this.element.show();
      }
    } else {
      this.element.hide();
    }
  },

  // 私有方法
  // ---
  // 绑定触发对话框出现的事件
  _setupTrigger: function () {
    this.delegateEvents(this.get('trigger'), 'click', function (e) {
      e.preventDefault();
      // 标识当前点击的元素
      this.activeTrigger = $(e.currentTarget);
      this.show();
    });
  },

  // 绑定遮罩层事件
  _setupMask: function () {
    var that = this;

    // 存放 mask 对应的对话框
    mask._dialogs = mask._dialogs || [];

    this.after('show', function () {
      if (!this.get('hasMask')) {
        return;
      }
      // not using the z-index
      // because multiable dialogs may share same mask
      mask.set('zIndex', that.get('zIndex')).show();
      mask.element.insertBefore(that.element);

      // 避免重复存放
      var existed = false;
      for (var i = 0; i < mask._dialogs.length; i++) {
        if (mask._dialogs[i] === that) {
          existed = true;
        }
      }
      // 依次存放对应的对话框
      if (!existed) {
        mask._dialogs.push(that);
      }
    });

    this.after('hide', this._hideMask);
  },

  // 隐藏 mask
  _hideMask: function () {
    if (!this.get('hasMask')) {
      return;
    }

    // 当且仅当最后一个 dialog 是当前 dialog 时，才移除
    // 因为 hide 与 destroy 都会调用 _hideMask，此举用于避免错误移除
    if (mask._dialogs &&
        mask._dialogs[mask._dialogs.length - 1] === this) {
      mask._dialogs.pop();
    }

    if (mask._dialogs && mask._dialogs.length > 0) {
      var last = mask._dialogs[mask._dialogs.length - 1];
      mask.set('zIndex', last.get('zIndex'));
      mask.element.insertBefore(last.element);
    } else {
      mask.hide();
    }
  },

  // 绑定元素聚焦状态
  _setupFocus: function () {
    this.after('show', function () {
      this.element.focus();
    });
    this.after('hide', function () {
      // 关于网页中浮层消失后的焦点处理
      // http://www.qt06.com/post/280/
      this.activeTrigger && this.activeTrigger.focus();
    });
  },

  // 绑定键盘事件，ESC关闭窗口
  _setupKeyEvents: function () {
    this.delegateEvents($(document), 'keyup.esc', function (e) {
      if (e.keyCode === 27) {
        this.get('visible') && this.hide();
      }
    });
  },

  _showIframe: function () {
    var that = this;
    // 若未创建则新建一个
    if (!this.iframe) {
      this._createIframe();
    }
    // 开始请求 iframe
    this.iframe.attr({
      src: this._fixUrl(),
      name: 'dialog-iframe' + new Date().getTime()
    });
    // 因为在 IE 下 onload 无法触发
    // http://my.oschina.net/liangrockman/blog/24015
    // 所以使用 jquery 的 one 函数来代替 onload
    // one 比 on 好，因为它只执行一次，并在执行后自动销毁
    this.iframe.one('load', function () {
      // 如果 dialog 已经隐藏了，就不需要触发 onload
      if (!that.get('visible')) {
        return;
      }
      // 绑定自动处理高度的事件
      if (that.get('autoFit')) {
        clearInterval(that._interval);
        that._interval = setInterval(function () {
          that._syncHeight();
        }, 300);
      }
      that._syncHeight();
      that._setPosition();
      that.trigger('complete:show');
    });
  },

  _fixUrl: function () {
    var s = this.get('content').match(/([^?#]*)(\?[^#]*)?(#.*)?/);
    s.shift();
    s[1] = ((s[1] && s[1] !== '?') ? (s[1] + '&') : '?') + 't=' + new Date().getTime();
    return s.join('');
  },

  _createIframe: function () {
    var that = this;

    this.iframe = $('<iframe>', {
      src: 'javascript:\'\';',
      scrolling: 'no',
      frameborder: 'no',
      allowTransparency: 'true',
      css: {
        border: 'none',
        width: '100%',
        display: 'block',
        height: '100%',
        overflow: 'hidden'
      }
    }).appendTo(this.contentElement);

    // 给 iframe 绑一个 close 事件
    // iframe 内部可通过 window.frameElement.trigger('close') 关闭
    Events.mixTo(this.iframe[0]);
    this.iframe[0].on('close', function () {
      that.hide();
    });
  },

  _syncHeight: function () {
    var h;
    // 如果未传 height，才会自动获取
    if (!this.get('height')) {
      try {
        this._errCount = 0;
        h = getIframeHeight(this.iframe) + 'px';
      } catch (err) {
        // 页面跳转也会抛错，最多失败6次
        this._errCount = (this._errCount || 0) + 1;
        if (this._errCount >= 6) {
          // 获取失败则给默认高度 300px
          // 跨域会抛错进入这个流程
          h = this.get('initialHeight');
          clearInterval(this._interval);
          delete this._interval;
        }
      }
      this.contentElement.css('height', h);
      // force to reflow in ie6
      // http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
      this.element[0].className = this.element[0].className;
    } else {
      clearInterval(this._interval);
      delete this._interval;
    }
  },

  _ajaxHtml: function () {
    var that = this;
    this.contentElement.css('height', this.get('initialHeight'));
    this.contentElement.load(this.get('content'), function () {
      that._setPosition();
      that.contentElement.css('height', '');
      that.trigger('complete:show');
    });
  }

});

module.exports = Dialog;

// Helpers
// ----
// 让目标节点可以被 Tab


function toTabed(element) {
  if (element.attr('tabindex') == null) {
    element.attr('tabindex', '-1');
  }
}

// 获取 iframe 内部的高度


function getIframeHeight(iframe) {
  var D = iframe[0].contentWindow.document;
  if (D.body.scrollHeight && D.documentElement.scrollHeight) {
    return Math.min(
    D.body.scrollHeight, D.documentElement.scrollHeight);
  } else if (D.documentElement.scrollHeight) {
    return D.documentElement.scrollHeight;
  } else if (D.body.scrollHeight) {
    return D.body.scrollHeight;
  }
}


return module.exports;
});

_define_("dialog/confirmbox.handlebars", function(_using_){
var module = {},exports = module.exports = {};

module.exports = '\
{{#if title}}\
<div class="{{classPrefix}}-title" data-role="title">{{{title}}}</div>\
{{/if}}\
<div class="{{classPrefix}}-container">\
    <div class="{{classPrefix}}-message" data-role="message">{{{message}}}</div>\
    {{#if hasFoot}}\
    <div class="{{classPrefix}}-operation" data-role="foot">\
        {{#if confirmTpl}}\
        <div class="{{classPrefix}}-confirm" data-role="confirm">\
            {{{confirmTpl}}}\
        </div>\
        {{/if}}\
        {{#if cancelTpl}}\
        <div class="{{classPrefix}}-cancel" data-role="cancel">\
            {{{cancelTpl}}}\
        </div>\
        {{/if}}\
    </div>\
    {{/if}}\
</div>\
';

return module.exports;
});

_define_("dialog/confirmbox", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery"),
    Dialog = _using_("dialog/dialog");


var Templatable = _share_("templatable"),
	template = _using_("dialog/confirmbox.handlebars");

// ConfirmBox
// -------
// ConfirmBox 是一个有基础模板和样式的对话框组件。
var ConfirmBox = Dialog.extend({

  attrs: {
    title: '默认标题',

    confirmTpl: '<a class="ui-dialog-button-orange" href="javascript:;">确定</a>',

    cancelTpl: '<a class="ui-dialog-button-white" href="javascript:;">取消</a>',

    message: '默认内容'
  },

  setup: function () {
    ConfirmBox.superclass.setup.call(this);

    var model = {
      classPrefix: this.get('classPrefix'),
      message: this.get('message'),
      title: this.get('title'),
      confirmTpl: this.get('confirmTpl'),
      cancelTpl: this.get('cancelTpl'),
      hasFoot: this.get('confirmTpl') || this.get('cancelTpl')
    };
    this.set('content', Templatable.compile(template,model));
  },

  events: {
    'click [data-role=confirm]': function (e) {
      e.preventDefault();
      this.trigger('confirm');
    },
    'click [data-role=cancel]': function (e) {
      e.preventDefault();
      this.trigger('cancel');
      this.hide();
    }
  },

  _onChangeMessage: function (val) {
    this.$('[data-role=message]').html(val);
  },

  _onChangeTitle: function (val) {
    this.$('[data-role=title]').html(val);
  },

  _onChangeConfirmTpl: function (val) {
    this.$('[data-role=confirm]').html(val);
  },

  _onChangeCancelTpl: function (val) {
    this.$('[data-role=cancel]').html(val);
  }

});

ConfirmBox.alert = function (message, callback, options) {
  var defaults = {
    message: message,
    title: '',
    cancelTpl: '',
    closeTpl: '',
    onConfirm: function () {
      callback && callback();
      this.hide();
    }
  };
  new ConfirmBox($.extend(null, defaults, options)).show().after('hide', function () {
    this.destroy();
  });
};

ConfirmBox.confirm = function (message, title, onConfirm, onCancel, options) {
  // support confirm(message, title, onConfirm, options)
  if (typeof onCancel === 'object' && !options) {
    options = onCancel;
  }

  var defaults = {
    message: message,
    title: title || '确认框',
    closeTpl: '',
    onConfirm: function () {
      onConfirm && onConfirm();
      this.hide();
    },
    onCancel: function () {
      onCancel && onCancel();
      this.hide();
    }
  };
  new ConfirmBox($.extend(null, defaults, options)).show().after('hide', function () {
    this.destroy();
  });
};

ConfirmBox.show = function (message, callback, options) {
  var defaults = {
    message: message,
    title: '',
    confirmTpl: false,
    cancelTpl: false
  };
  new ConfirmBox($.extend(null, defaults, options)).show().before('hide', function () {
    callback && callback();
  }).after('hide', function () {
    this.destroy();
  });
};

module.exports = ConfirmBox;


return module.exports;
});

_define_("dialog", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['events'] = CMP.Events || require('../base/base').Events;
_share_.m['overlay'] = CMP.Overlay || require('../overlay/overlay');
_share_.m['templatable'] = CMP.Templatable || require('../templatable/templatable');


CMP.Dialog = _using_("dialog/dialog");
CMP.Dialog.ConfirmBox = _using_("dialog/confirmbox");
module.exports = CMP.Dialog;

return module.exports;
});

_using_("dialog");

})();

/**
===============================
component : tip
version   : 1.0.0
===============================
**/

!(function () {
var __modules__ = {},__gbl__ = window.FNX || {};

function _share_(name){
	return _share_.m[name];
}
_share_.m = {};

function _using_ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], _using_, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function require(){
	return {};
};

function _define_ (path, fn) {
    __modules__[path] = fn;
}



_define_("jquery", function(_using_){
var module = {},exports = module.exports = {};

module.exports = jQuery;

return module.exports;
});

_define_("tip/basic-tip", function(_using_){
var module = {},exports = module.exports = {};

var Popup = _share_("popup");

// 通用提示组件
// 兼容站内各类样式
module.exports = Popup.extend({

  attrs: {
    // 提示内容
    content: null,

    // 提示框在目标的位置方向 [up|down|left|right]
    direction: 'up',

    // 提示框离目标距离(px)
    distance: 8,

    // 箭头偏移位置(px)，负数表示箭头位置从最右边或最下边开始算
    arrowShift: 22,

    // 箭头指向 trigger 的水平或垂直的位置
    pointPos: '50%'
  },

  _setAlign: function () {
    var alignObject = {},
        arrowShift = this.get('arrowShift'),
        distance = this.get('distance'),
        pointPos = this.get('pointPos'),
        direction = this.get('direction');

    if (arrowShift < 0) {
      arrowShift = '100%' + arrowShift;
    }

    if (direction === 'up') {
      alignObject.baseXY = [pointPos, 0];
      alignObject.selfXY = [arrowShift, '100%+' + distance];
    }
    else if (direction === 'down') {
      alignObject.baseXY = [pointPos, '100%+' + distance];
      alignObject.selfXY = [arrowShift, 0];
    }
    else if (direction === 'left') {
      alignObject.baseXY = [0, pointPos];
      alignObject.selfXY = ['100%+' + distance, arrowShift];
    }
    else if (direction === 'right') {
      alignObject.baseXY = ['100%+' + distance, pointPos];
      alignObject.selfXY = [0, arrowShift];
    }

    alignObject.comeFromArrowPosition = true;
    this.set('align', alignObject);
  },

  // 用于 set 属性后的界面更新
  _onRenderContent: function (val) {
    var ctn = this.$('[data-role="content"]');
    if (typeof val !== 'string') {
      val = val.call(this);
    }
    ctn && ctn.html(val);
  }

});


return module.exports;
});

_define_("tip/tip.handlebars", function(_using_){
var module = {},exports = module.exports = {};

module.exports = '\
<div class="ui-poptip">\
    <div class="ui-poptip-shadow">\
    <div class="ui-poptip-container">\
        <div class="ui-poptip-arrow">\
            <em></em>\
            <span></span>\
        </div>\
        <div class="ui-poptip-content" data-role="content">\
        </div>\
    </div>\
    </div>\
</div>\
';

return module.exports;
});

_define_("tip/tip", function(_using_){
var module = {},exports = module.exports = {};

var $ = _using_("jquery");
var BasicTip = _using_("tip/basic-tip");

// 气泡提示弹出组件
// ---
var Tip = BasicTip.extend({

  attrs: {
    template: _using_("tip/tip.handlebars"),

    // 提示内容
    content: 'A TIP BOX',

    // 箭头位置
    // 按钟表点位置，目前支持1、2、5、7、10、11点位置
    // https://i.alipayobjects.com/e/201307/jBty06lQT.png
    arrowPosition: 7,

    align: {
      setter: function (val) {
        // 用户初始化时主动设置了 align
        // 且并非来自 arrowPosition 的设置
        if (val && !val.comeFromArrowPosition) {
          this._specifiedAlign = true;
        }
        return val;
      }
    },

    // 颜色 [yellow|blue|white]
    theme: 'yellow',

    // 当弹出层显示在屏幕外时，是否自动转换浮层位置
    inViewport: false
  },

  setup: function () {
    BasicTip.superclass.setup.call(this);
    this._originArrowPosition = this.get('arrowPosition');

    this.after('show', function () {
      this._makesureInViewport();
    });
  },

  _makesureInViewport: function () {
    if (!this.get('inViewport')) {
      return;
    }
    var ap = this._originArrowPosition,
        scrollTop = $(window).scrollTop(),
        viewportHeight = $(window).outerHeight(),
        elemHeight = this.element.height() + this.get('distance'),
        triggerTop = this.get('trigger').offset().top,
        triggerHeight = this.get('trigger').height(),
        arrowMap = {
        '1': 5,
        '5': 1,
        '7': 11,
        '11': 7
        };

    if ((ap == 11 || ap == 1) && (triggerTop + triggerHeight > scrollTop + viewportHeight - elemHeight)) {
      // tip 溢出屏幕下方
      this.set('arrowPosition', arrowMap[ap]);
    } else if ((ap == 7 || ap == 5) && (triggerTop < scrollTop + elemHeight)) {
      // tip 溢出屏幕上方
      this.set('arrowPosition', arrowMap[ap]);
    } else {
      // 复原
      this.set('arrowPosition', this._originArrowPosition);
    }
  },

  // 用于 set 属性后的界面更新
  _onRenderArrowPosition: function (val, prev) {
    val = parseInt(val, 10);
    var arrow = this.$('.ui-poptip-arrow');
    arrow.removeClass('ui-poptip-arrow-' + prev).addClass('ui-poptip-arrow-' + val);

    // 用户设置了 align
    // 则直接使用 align 表示的位置信息，忽略 arrowPosition
    if (this._specifiedAlign) {
      return;
    }

    var direction = '',
        arrowShift = 0;
    if (val === 10) {
      direction = 'right';
      arrowShift = 20;
    }
    else if (val === 11) {
      direction = 'down';
      arrowShift = 22;
    }
    else if (val === 1) {
      direction = 'down';
      arrowShift = -22;
    }
    else if (val === 2) {
      direction = 'left';
      arrowShift = 20;
    }
    else if (val === 5) {
      direction = 'up';
      arrowShift = -22;
    }
    else if (val === 7) {
      direction = 'up';
      arrowShift = 22;
    }
    this.set('direction', direction);
    this.set('arrowShift', arrowShift);
    this._setAlign();
  },

  _onRenderWidth: function (val) {
    this.$('[data-role="content"]').css('width', val);
  },

  _onRenderHeight: function (val) {
    this.$('[data-role="content"]').css('height', val);
  },

  _onRenderTheme: function (val, prev) {
    this.element.removeClass('ui-poptip-' + prev);
    this.element.addClass('ui-poptip-' + val);
  }

});

module.exports = Tip;


return module.exports;
});

_define_("tip", function(_using_){
var module = {},exports = module.exports = {};

// exports

require('$');

var CMP = __gbl__.CMP || {};
_share_.m['popup'] = CMP.Popup || require('../popup/popup');

module.exports = (__gbl__.CMP || {}).Tip = _using_("tip/tip");

return module.exports;
});

_using_("tip");

})();