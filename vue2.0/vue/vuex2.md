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
