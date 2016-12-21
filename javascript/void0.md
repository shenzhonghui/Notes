### javascript中使用void 0的意思是什么？

原文：http://blog.csdn.net/aitangyong/article/details/40309211

```javascript
if (context === void 0) return func;  

if (array == null) return void 0;  
```
以前没有见过这种写法，到网上搜了一些资料，刚好发现stackoverflow上也有人提出类似的疑问。这里总结归纳下，做个笔记。void其实是JavaScript中的一个函数，接受一个参数，返回值永远是undefined。
可以说，使用void目的就是为了得到javascript中的undefined。所以void 0 是获取undefined的一种正确和标准的方式。

```javascript
void 0  
void (0)  
void "hello"  
void (new Date())  
//all will return undefined
```

参考资料：

http://stackoverflow.com/questions/7452341/what-does-void-0-mean

http://stackoverflow.com/questions/11409412/how-to-understand-return-obj-void-0-in-the-source-of-underscore
