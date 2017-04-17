
微信小程序

#### 微信小程序需暴露的全局方法

```javascript
(function(global) {
  // 此处省略大堆代码......
  global.App = App;
  global.Page = Page;
  global.getApp = getApp;
  global.getCurrentPages = getCurrentPages;
  global.wx = wx;
})(this)

```

#### 微信小程序APP暴露的全局方法
```javascript
App 类的实例包含的方法
* getUserInfo

* onLaunch

* onUnlaunch

* onShow

* onHide
```
