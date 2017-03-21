### 深入理解transform-origin
---
原文链接： http://www.cnblogs.com/darkterror/p/5308188.html

* transform-origin这个属性，是**变形原点**的意思，也就是**该元素**围绕着那个点变形或旋转，该属性只有在设置了transform属性的时候起作用；

* 因为我们元素默认基点就是其中心位置，换句话说我们没有使用transform-origin改变元素基点位置的情况下，transform进行的rotate,translate,scale,skew,matrix等操作都是以元素自己中心位置进行变化的。

平常使用的时候用的不多，只是知道默认的是以元素自己的中心为各种变形的基点，但当我们试图改变这个基点的时候改如何计算呢？这是它的参照物是什么样的呢？

拆解它的用法如下：

```javascript
/*只设置一个值的语法*/
transform-origin: x-offset
transform-origin: offset-keyword
/*设置两个值的语法*/
transform-origin：x-offset  y-offset
transform-origin：y-offset  x-offset-keyword
transform-origin：x-offset-keyword  y-offset
transform-origin：x-offset-keyword  y-offset-keyword
transform-origin：y-offset-keyword  x-offset-keyword
/*设置三个值的语法*/
transform-origin：x-offset  y-offset  z-offset
transform-origin：y-offset  x-offset-keyword  z-offset
transform-origin：x-offset-keyword  y-offset  z-offset
transform-origin：x-offset-keyword  y-offset-keyword  z-offset
transform-origin：y-offset-keyword  x-offset-keyword  z-offset
```

各个值含义如下：

```javascript
x-offset：用来设置transform-origin水平方向Ｘ轴的偏移量，可以使用和值，同时也可以是正值（从中心点沿水平方向Ｘ轴向右偏移量），也可以是负值（从中心点沿水平方向Ｘ轴向左偏移量）。
y-offset：用来设置transform-origin属性在垂直方向Ｙ轴的偏移量，可以使用和值，同时可以是正值（从中心点沿垂直方向Ｙ轴向下的偏移量），也可以是负值（从中心点沿垂直方向Ｙ轴向上的偏移量）。
z-offset：用来设置3D变形中transform-origin远离用户眼睛视点的距离，默认值z=0，其取值可以，不过在这里将无效。

offset-keyword：是top、right、bottom、left或center中的一个关键词，可以用来设置transform-origin的偏移量。

x-offset-keyword：是left、right或center中的一个关键词，可以用来设置transform-origin属性值在水平Ｘ轴的偏移量。
y-offset-keyword：是top、bottom或center中的一个关键词，可以用来设置transform-origin属性值在垂直方向Ｙ轴的偏移量。
```
为了方便记忆，可以把关键词和百分比值对比起来记：

```javascript
 top = top center = center top = 50% 0
 right = right center = center right = 100%或(100% 50%)
 bottom = bottom center = center bottom = 50% 100%
 left = left center = center left = 0或(0 50%)
 center = center center = 50%或（50% 50%）
 top left = left top = 0 0
 right top = top right = 100% 0
 bottom right = right bottom = 100% 100%
 bottom left = left bottom = 0 100%
```
总结一点就是：该基地都是以元素本身默认中心点为参照物的，而不是我们平常认为的屏幕左上角，相应的top，left，right，bottom这些百分比也是以元素自身的宽和高为参照物的，切记！

提醒：transform中translate的百分比也是以元素自身的宽和高为参照物的，这一点很重要，切记！
