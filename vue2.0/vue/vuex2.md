### vuex2.0源码理解

原文：https://segmentfault.com/a/1190000007108052

引入vuex

```javascript
import Vuex from 'vuex'
var store = new Vuex.Store({})
Vuex.mapState({})
```
或者
```javascript
import { Store, mapState } from 'vuex'
var store = new Store({})
mapState({})
```

#### Store构造函数

vuex 只暴露出了6个方法，分别是
```javascript
var index = {
Store: Store,
install: install,
mapState: mapState,
mapMutations: mapMutations,
mapGetters: mapGetters,
mapActions: mapActions
}

return index;
```
其中 install 方法是配合 Vue.use 方法使用的，用于在 Vue 中注册 Vuex ,和数据流关系不大。其他的几种方法就是我们常用的。

先看看 Store 方法，学习 vuex 最先接触到的就是 new Store({}) 了。那么就先看看这个 Store 构造函数。
```javascript
var Store = function Store (options) {
  var this$1 = this; // 指向返回的store实例
  if ( options === void 0 ) options = {};

  // 使用构造函数之前，必须保证vuex已注册，使用Vue.use(Vuex)注册vuex
  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.")
  // 需要使用的浏览器支持Promise
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.")

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  // store的内部状态(属性)
  this._options = options
  this._committing = false
  this._actions = Object.create(null)  // 保存actions
  this._mutations = Object.create(null) // 保存mutations
  this._wrappedGetters = Object.create(null) // 保存包装后的getters
  this._runtimeModules = Object.create(null)
  this._subscribers = []
  this._watcherVM = new Vue()

  // bind commit and dispatch to self
  var store = this
  var ref = this;
  var dispatch = ref.dispatch; // 引用的是Store.prototype.dispatch
  var commit = ref.commit; // 引用的是Store.prototype.commit
  this.dispatch = function boundDispatch (type, payload) { // 绑定上下文对象
    return dispatch.call(store, type, payload)
  }
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  }

  // strict mode
  this.strict = strict // 是否开启严格模式

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  // 初始化 root module
  // 同时也会递归初始化所有子module
  // 并且收集所有的getters至this._wrappedGetters
  installModule(this, state, [], options)

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  // 重置vm实例状态
  // 同时在这里把getters转化为computed(计算属性)
  resetStoreVM(this, state)

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); })
};
```
接着往下看，接着会定义 state, plugins,strict三个变量，分别是你传入的 options 对应的选项。之后就是定义返回的 store 实例的一些内部状态。先不要管它们具体是什么，这个之后会慢慢讲，这里先看看 Store 构造函数都做了些什么。再之后就是绑定 dispatch 和 commit 方法到 store 实例上。接下来就是整个 vuex 的核心方法 installModule 了，之后重置 vm 实例的状态。

简单点说，当你使用 Store 构造函数，它实际上做了这么几件事，首先定义给 store 实例定义一些内部属性，之后就是绑定 dispatch 和 commit 的上下文对象永远是 store 实例上，之后 installModule 根据传入的 options ‘充实’ 内部状态等等。

##### installModule

```javascript
/*
 * store 就是 store 实例
 * rootState 是使用构造函数options中定义的 state 对象
 * path 路径
 * module 传入的options
 */
function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length  // 是否是root
  var state = module.state;
  var actions = module.actions;
  var mutations = module.mutations;
  var getters = module.getters;
  var modules = module.modules;

  // set state
  if (!isRoot && !hot) {
    // 找到要注册的 path 的上一级 state
    var parentState = getNestedState(rootState, path.slice(0, -1))
    // 定义 module 的 name
    var moduleName = path[path.length - 1]
    // store._withCommit方法之后会讲
    // 这里先理解为 执行传入的函数
    store._withCommit(function () {
      // 使用Vue.set方法
      // parentState[moduleName] = state
      // 并且state变成响应式的
      Vue.set(parentState, moduleName, state || {})
    })
  }
  // 之后设置 mutations, actions, getters, modules
  if (mutations) {
    Object.keys(mutations).forEach(function (key) {
      registerMutation(store, key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(function (key) {
      registerAction(store, key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(function (key) {
      installModule(store, rootState, path.concat(key), modules[key], hot)
    })
  }
}
```
这里有个很重要的概念要理解，什么是 **path**. vuex 的一个 store 实例可以拆分成很多个 module ,不同的 module 可以理解成一个子代的 store 实例（事实上，module 确实和 store 具有一样的结构）,这是一种模块化的概念。因此这里的 path 可以理解成是表示一种层级关系，当你有了一个 root state 之后，根据这个 root state 和 path 可以找到 path 路径对应的一个 local state， 每一个 module 下的 mutations 和 actions 改变的都是这个local state，而不是 root state.

##### mapState

在讲 mapState 之前，先说一下基础方法 normalizeMap

```javascript
/*
 * 如果map是一个数组 ['type1', 'type2', ...]
 * 转化为[
 *   {
 *     key: type1,
 *     val: type1
 *   },
 *   {
 *     key: type2,
 *     val: type2
 *   },
 *   ...
 * ]
 * 如果map是一个对象 {type1: fn1, type2: fn2, ...}
 * 转化为 [
 *   {
 *     key: type1,
 *     val: fn1
 *   },
 *   {
 *     key: type2,
 *     val: fn2
 *   },
 *   ...
 * ]
 */
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}
```
normalizeMap 函数接受一个对象或者数组，最后都转化成一个数组形式，数组元素是包含 key 和 value 两个属性的对象。

再来看看 mapState 方法。

```javascript
/*
 * states: Object | Array
 * 返回一个对象
 * 对象的属性名对应于传入的 states 的属性名或者数组元素
 * 属性值都是一个函数
 * 执行这个函数的返回值根据 val 的不同而不同
 */
function mapState (states) {
  var res = {}
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      return typeof val === 'function' // 如果是函数，返回函数执行后的结果
        ? val.call(this, this.$store.state, this.$store.getters)
        : this.$store.state[val] // 如果不是函数，而是一个字符串，直接在state中读取。
    }
  })
  return res
}
```
mapState 函数执行的结果是返回一个对象，属性名对应于传入的 states 对象或者数组元素。属性值是一个函数，执行这个函数将返回相应的 state .

##### mapMutations

```javascript
/*
 * mutations: Array
 * 返回一个对象
 * 属性名为 mutation 类型
 * 属性值为一个函数
 * 执行这个函数后将触发指定的 mutation
 */
function mapMutations (mutations) {
  var res = {}
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key; // mutation type
    var val = ref.val; // mutation type

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ]; // 一个数组缓存传入的参数

      // val作为commit函数的第一个参数type， 剩下的参数依次是payload 和 options
      return this.$store.commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
}
```
注意这里传入的 mutations 只能是一个数组，数组元素的 mutation type . 函数的作用的也很简单，传入一个 mutations 数组，返回一个对象，属性名是 mutation 的类型，属性值是一个函数，执行这个函数，将调用 commit 来触发对应的 mutation 从而改变state。另外注意这里的 this 指向的 store 的 ***_vm*** 。
***mapState 是在 Vue 实例中调用的***。

##### mapActions

```javascript
function mapActions (actions) {
  var res = {}
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
}
```
mapActions 函数和 mapMutations 函数几乎如出一辙。唯一的区别即使这里应该使用 dispatch 方法来触发 action.

##### mapGetters

```javascript
/*
 * getters: Array
 */
function mapGetters (getters) {
  var res = {}
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedGetter () {
      // 如果在getters中不存在，报错
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val))
      }
      // 根据 val 在 getters 对象里找对应的属性值
      return this.$store.getters[val]
    }
  })
  return res
}
```

这里 getters 同样接受一个数组，同样返回一个对象。

以上讲了四种 map*** 方法，这四种方法可以都返回一个对象，因此可以 ES6 新特性 ... 解构符。如

```javascript
{
    ...mapState(options)
}
```
关于 ... 解构符号, 举个小例子就明白了

```javascript
var obj1 = {
    a: 1,
    b: 2,
    c: 3
}
var obj2 = {
    ...obj1,
    d: 4
}
// obj2 = { a: 1, b: 2, c: 3, d: 4 }
// 同样可以用于数组
var arr1 = ['a', 'b', 'c']
var arr2 = [...arr1, 'd']
// arr2 = ['a', 'b', 'c', 'd']
```

##### install

install 方法与 vuex 数据流关系不大，主要是用于在 Vue 中注册 Vuex，这里为了保持篇幅的完整性，简单介绍一下。

```javascript
function install (_Vue) {
  if (Vue) {
  // 报错，已经使用了 Vue.use(Vuex)方法注册了
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
// 在浏览器环境写，会自动调用 install 方法
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
```
