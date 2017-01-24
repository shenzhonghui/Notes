# offsetParent

深入理解定位父级offsetParent及偏移大小

原文地址： http://www.cnblogs.com/xiaohuochai/p/5828369.html

偏移量(offset dimension)是javascript中的一个重要的概念。涉及到偏移量的主要是offsetLeft、offsetTop、offsetHeight、offsetWidth这四个属性。当然，还有一个偏移参照——定位父级offsetParent。本文将详细介绍该部分内容

### 定位父级

在理解偏移大小之前，首先要理解offsetParent。人们并没有把offsetParent翻译为偏移父级，而是翻译成定位父级，很大原因是offsetParent与定位有关

定位父级offsetParent的定义是：与当前元素最近的经过定位(position不等于static)的父级元素，主要分为下列几种情况：

1、元素自身有fixed定位，offsetParent的结果为null

当元素自身有fixed固定定位时，我们知道固定定位的元素相对于视口进行定位，此时没有定位父级，offsetParent的结果为null

注意：firefox浏览器有兼容性问题

```javascript
<div id="test" style="position:fixed"></div>    
<script>
//firefox并没有考虑固定定位的问题，返回<body>，其他浏览器都返回null
console.log(test.offsetParent);
</script>

```

2 元素自身无fixed定位，且父级元素都未经过定位，offsetParent的结果为<body>

3 元素自身无fixed定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的经过定位的父级元素

4 <body>元素的parentNode是null

### 偏移量

offsetWidth： 表示元素在水平方向上占用的空间大小，无单位(以像素px计)

offsetHeight： 表示元素在垂直方向上占用的空间大小，无单位(以像素px计)

offsetTop： 表示元素的上外边框至offsetParent元素的上内边框之间的像素距离

offsetLeft： 表示元素的左外边框至offsetParent元素的左内边框之间的像素距离


注意：如果存在垂直滚动条，offsetWidth也包括垂直滚动条的宽度；如果存在水平滚动条，offsetHeight也包括水平滚动条的高度

Window.getComputedStyle()方法得出所有在应用有效的样式和分解任何可能会包含值的基础计算后的元素的CSS属性值。


### 页面偏移

要知道某个元素在页面上的偏移量，将这个元素的offsetLeft和offsetTop与其offsetParent的相同属性相加，并加上offsetParent的相应方向的边框，如此循环直到根元素，就可以得到元素到页面的偏移量

```javascript
function getCSS(obj,attr){
  // Ie9及现代浏览器支持getComputedStyle
  if(window.getComputedStyle){
    return getComputedStyle(obj)[attr];
  }
  // IE 9 以下支持
  return obj.currentStyle[attr];
}

```

```javascript
function getElementLeft(element){
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while(current != null){
    actualLeft += current.offsetLeft + parseFloat(getCSS(current,'border-left-width'));
    current = current.offsetParent;
  }
  return actualLeft + 'px';
}
function getElementTop(element){
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while(current != null){
    actualTop += current.offsetTop + parseFloat(getCSS(current,'border-top-width'));
    current = current.offsetParent;
  }
  return actualTop + 'px';
}
```
