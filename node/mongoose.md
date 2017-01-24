#### mongoose的理解
---

Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具
名词解释：
Schema ：一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力，schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力

Model   ：  由Schema发布生成的模型，具有抽象属性和行为的数据库操作对

Entity  ：  由Model创建的实体，他的操作也会影响数据库

注意：

1.本学习文档采用严格命名方式来区别不同对象，例如：
```javascript
var PersonSchema;   //Person的文本属性
var PersonModel;    //Person的数据库模型
var PersonEntity;   //Person实体
```
2 Schema、Model、Entity的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。

总结：Schema骨架，Model模型，Entity实体，

在Schema上我们可以创建方法，类似于JS的里的方法，可以被实体中使用方法，如果学过JS就很好理解，就类似于原型方法。只要是一个Model下的大家公用。
我们数据库中最重要的当然也是查询，查询功能机就需要在Model或者Entity层次下进行查询，至于增删改查这种具体的CRUD是在ntity实体完成的。

#### mongoose连接数据库

mongoose连接数据库是有两种方式的：

```javascript
var mongoose = require('mongoose');    //引用mongoose模块
// 方式一
var dbURI = 'mongodb://localhost/mydatabase'
mongoose.connect(dbURI)

//方式二：
var dbURI = 'mongodb://localhost/myadmindatabase';
var adminConnection = mongoose.createConnection(dbURI);
//如果需要声明端口号：
var dbURI = 'mongodb://localhost:27018/mydatabase';
//如果需要定义用户名和密码：
var dbURI = 'mongodb://username:password@localhost/mydatabase';
//也可以像下面这样传一个对象类型的参数：
var dbURI = 'mongodb://localhost/mydatabase';
var dbOptions = {'user':'db_username','pass':'db_password'};
mongoose.connect(dbURI, dbOptions);
```
根据连接数据库的方式，我们可以得到第二种创建Model的方式，就是使用数据库连接的引用名来创建：
adminConnection.model( 'User', userSchema );

默认情况下mongoose会根据我们传入的Model名字来生成collection名字，在上面的代码中就会生成名为users(全为小写字母)的collection(集合)；

有两种方法能让我们自定义collection的名字。

```javascript
//方式一，在创建schema的时候定义collection的名字：
var userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique:true}
},
{
    collection: 'myuserlist'
});
//方式二，在创建Model的时候定义collection的名字：
mongoose.model( 'User', userSchema, 'myuserlist' );
```

### 数据化操作

##### 插入

语法：**Model#save([fn])**
创建Model实例,初始化一条数据：
```javascript
// 初始化一条数据
// {
//   name: 'Shen',
//   age: 25,
//   job: '前端工程师'
// }
var user = new User({
  name: 'Shen',
  age: 25,
  job: '前端工程师'
});
```
user就是模型User的一个实例，它具有mongoose中模型所具有的一些方法，
定义完模型之后，我们就可以进行记录的增删查改了。mongoose的增删查改十分简单，以上述的User模型为例，当我们初始化一条数据的时候，并没有将它保存进数据库中。这个时候，我们只要调用user实例的save方法就可以将记录插入数据库中了。
例如保存实例：
```javascript
user.save()
// 还可以给save方法传递一个错误回调函数，如果保存过程中发生错误将会调用该函数。
user.save(function (err) {
    if (err) return handleError(err);
});
```
另外一种保存数据的方法是使用我们之前定义好的User对象，调用它的create方法：

```javascript
User.create({
    name: '胡八一',
    age: 30,
    job: '摸金校尉'
}, function (err, small) {
  if (err) return handleError(err);
  // saved!
});
```
##### 查询

一种方法是：
```javascript
User.find({ name: '胡八一' }).exec(callback);
```
另一种方法：

```javascript
User.find({ name: '胡八一'}, callback);
```
基本上所有涉及到查询的模型方法都有这样两种形式的查询方式，一种是不往查询方法中传递回调函数，这时查询方法不会立即执行查询，而是返回一个query对象，用户可以再在query对象上修改查询条件，直到执行exec(callback)方法；而第二种是往查询方法中传递回调函数，这时查询方法立即执行。

推荐使用前者，因为这样方便指定复杂的条件以及用于链式调用

```javascript
User
.find({ author: 'me' })
.where('title').equals('this is title')
.where('meta.votes').gt(17).lt(66)
.limit(10)
.sort('-date')
.select('title author body')
.exec(callback);
```
##### 删除

语法：**Model.remove(conditions, [callback])**










参考链接：
 https://cnodejs.org/topic/504b4924e2b84515770103dd

参考链接：http://www.cnblogs.com/zhongweiv/p/mongoose.html

参考链接：http://blog.csdn.net/foruok/article/details/47746057#comments

参考连接：http://www.cnblogs.com/jayruan/p/5123754.html

参考链接：https://my.oschina.net/calvinchen/blog/135393
