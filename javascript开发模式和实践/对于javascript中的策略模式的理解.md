#### 对于javascript中的策略模式的理解

在现实中，很多时候也有多种途径到达同一个目的地。比如我们要去某个地方 游，
可以根据具 的实际情况来选择出行的线 。

* 如果没有时间但是不在乎 ，可以选择飞机。
* 如果没有钱，可以坐大巴或者火车
* 如果再 一点，可以选择自行车

在程序设计中，我们也常常 到类 的情况，要实现某一个功能有多种方案可以选择。比如 一个   件的程序，既可以选择 zip 算法，也可以选择 gzip 算法。

这些算法灵活多样，而且可以随意互相替换。

策略模式的定义是: **定义一系列的算法，把他们一个个封装起来，并且使它们可以相互替换。**

每个设计模式的主题：**将不变的部分和变化的部分隔开**
策略模式也不例外，策略模式的目的就是将**算法的使用**与**算法的实现**分离开来

例子：很多公司的年终奖是根据员工的工资基数和 年底绩效情况来发放的。例如，绩效为S的人年终奖有4倍工资，绩效为A的人年终奖有3倍工资 ，而绩效为B的人年终奖有2倍工资。
假设   部要求我们提供一段代码，来方便他们计算员 的 终 。
我们可以编写一个名为calculateBonus 的函数来计算每个人的奖金数 。很显然， calculateBonus 函数要正确工作，就需要接收两个参数:员工的工资数额和他的绩效考核等级。 代码如下:
```
var calculateBonus = function( performanceLevel, salary ){
    if ( performanceLevel === 'S' ){ 
        return salary* 4;
    }
    if ( performanceLevel === 'A' ){ 
        return salary * 3;
    }   
    if ( performanceLevel === 'B' ){ 
        return salary * 2;
    } 
};
```
缺点：

* calculateBonus 函数比较庞大，包含了很多 if-else 语 ，这些语句需要覆盖所有的逻辑分支。
* calculateBonus 函数缺乏弹性，如果增加了一种新的 效等级C，或者想把绩效S的奖金系数改为 5，那我们必须深入calculateBonus 函数的内部实现，这是违反开放封闭原则的。
* 算法的复用性差，如果在程序的其他地方需要重用这些计算奖金的算法呢?我们的选择只有复制和粘贴。

#### 使用策略模式重构代码 

一个基于策略模式的程序至少 两部分组成。
第一个部分是一组策略类，策略类封装具体的算法，并负责具体的计算过程。
第二个部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明 Context中要维持对某个策略对象的引用。

第一个版本是模仿传统面向对象语言中的实现：

我们先 把每种绩效的计算 则都封装在对应的策略类里面:
```
var performanceS = function(){};
    performanceS.prototype.calculate 
    return salary * 4;
};
var performanceA = function(){};
    performanceA.prototype.calculate 
    return salary * 3;
};
var performanceB = function(){};
    performanceB.prototype.calculate 
    return salary * 2;
};
 
```
接下来定义奖金类 Bonus:

```
var Bonus = function(){ 
    this.salary = null; //原始工资
    this.strategy = null;// 绩效等级对应的策略对象
};

Bonus.prototype.setSalary = function( salary ){        this.salary = salary; // 设置员工的原始工资  
};
Bonus.prototype.setStrategy = function( strategy ){
    this.strategy = strategy; // 设置员工绩效等级对应的策略对象   
};
Bonus.prototype.getBonus = function(){        
    return this.strategy.calculate( this.salary ); //  把计算奖金的操作委托给对应的策略对象  
};
```
这就是:定义一系列的算法，把它们各 自封装成策略类，算法被封装在策略类内部的方法里。在 户对 Context 发起请求的时候，Context 总是把请求  委托给这些策略对象中间的某一个进行计算。

完成剩余的代码：
```
var bonus = new Bonus(); 
bonus.setSalary( 10000 );

bonus.setStrategy( new performanceS() ); //       
console.log( bonus.getBonus() ); // :40000

bonus.setStrategy( new performanceA() ); //       
console.log( bonus.getBonus() ); // :30000
```

#### JavaScript版本的策略模式

上述代码中，我们让strategy对象从 个策略类中创建而来，这是模拟一些传统面向对象语 言的实现。实际上在 JavaScript 语言中，函数也是对象，所以更简单和直接的做法是把 strategy 直接定义为函数:
```
var strategies = {
    "S": function( salary ){
        return salary * 4; 
    },
    "A": function( salary ){ 
        return salary * 3;
    },
    "B": function( salary ){
        return salary * 2; 
    }
};
```
同样，Context 也没有必要必须用 Bonus 类来表示.

我们依然用calculateBonus函数 当
Context 来接受用户的请求。

```
var calculateBonus = function( level, salary ){       return strategies[ level ]( salary );
};

console.log( calculateBonus( 'S', 20000 ) );// 输入：80000
console.log( calculateBonus( 'A', 10000 ) )；// 输出：30000
```

#### 多态在策略模式中的体现

##### 1 使用策略模式编写缓动动画

这些算法都接受4 个参数，这 4 个参数的含义分别是动画已消耗的时间、小 原始位置、小球目标位置、动画持续 的总时间，返回的值则是动  应该处在的当前位置。代码如下:
```
var tween = {
	linear: function( t, b, c, d ){
		return c*t/d + b; 
	},
	easeIn: function( t, b, c, d ){ 
		return c*(t/=d)*t+b;
	},
	strongEaseIn: function(t, b, c, d){ 
		return c*(t/=d)*t*t*t*t+b;
	},
	strongEaseOut: function(t, b, c, d){
		return c*((t=t/d-1)*t*t*t*t+1)+b; 
	},
	sineaseIn: function( t, b, c, d ){ 
		return c*(t/=d)*t*t+b;
	},
	sineaseOut: function(t,b,c,d){
		return c*((t=t/d-1)*t*t+1)+b;
	},
}
```
定义一个动画类 Animate

```
var Animate = function (dom) {
	this.dom = dom; // 开始运动的dom节点
	this.startTime = 0; // 动画开始时间
	this.startPos = 0; // 动画开始时，dom节点的位置，即dom的初始位置
	this.endPos = 0; // 动画结束时，dom节点的位置，即dom的结束位置
	this.propertyName = null; // dom节点需要被改变的css属性名
	this.easing = null; // 缓动方法
	this.duration = null; // 动画持续时间
}
// 定义start启动动画，在动画启动的瞬间，需要记录一些信息，供缓动方法在以后计算小球当前位置的时候使用，在记录完这些信息后，还要负责启动计时器
Animate.prototype.start = function (propertyName,endPos,duration,easing) {
	this.startTime = + new Date(); // 动画启动时间
	this.startPos = this.dom.getBoundingClientRect([ propertyName ]);// dom节点初始位置
	this.propertyName = propertyName;
	this.endPos = endPos; // dom节点目标位置
	this.duration = duration; // 动画持续时间
	this.easing = tween[ easing ]; // 缓动算法
	var self = this;
	var timer = setInterval(function(){ // 启动定时器，开始动画
		if (self.step() === false) {
			clearInterval(timer);
		}
	},19)
}
```
Animate.prototype.start 方法接 以下 4 个参数。
* propertyName:要改变的 CSS 属性名，比如'left'、'top'，分别表示左 移动和上下移动。   
* endPos: 小球动画的目标位置。
* duration: 动话持续时间。
* easing: 缓动算法。

再接下来是 Animate.prototype.step 方法，
该方法代表小球运动的每一帧要做的事情。在此 处，这个方法负责计算小球的当前位置和调用更新CSS 属性值的方法Animate.prototype.update。 代码如下:

```
// 定义动画的每一帧应该做的事情，这里定义为负责计算小球的当前位置和调用更新小球的
// css属性的方法Animate.prototype.update
Animate.prototype.step = function(){
	var t = +new Date; // 取得当前时间      
	if ( t >= this.startTime + this.duration ){ //(1)
		this.update( this.endPos ); //  更新小球的css属性值 
		return false; 
	}
	// pos为小球的当前位置
	var pos = this.easing( t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration );       
 	this.update( pos ); // 更新小球的css属性值 
 };
// 在这段代码中，(1)处的意思是，如果当前时间大于动话开始时间加上动画持续时间之和，说明动画已经结 ，此时要修正小球的位置。因为在这一帧开始之后，小球的位置已经接近了目标 位置，但很可能不完全等于目标位置。此时我们要主动修正小球的当前位置为最终的目标位置。此外让 Animate.prototype.step 方法返回 false，可以通知 Animate.prototype.start 方法清除定时器。
```
最后是负责更新小球CSS 属性值的 Animate.prototype.update 方法:
```
Animate.prototype.update = function( pos ){
    this.dom.style[ this.propertyName ] = pos + 'px';
};
```
本节我们学会了怎样编写一个动画类，利用这个动 类和一些缓动算法就可以让小球运动起 来。我们使用策略模式把算法传入动画类中，来达到 种不同的缓动效果，这些算法都可以轻易地被  替换为另外一个算法，这是策略模式的经典运用之一。

##### 用策略模式重构表单验证

下面我们将用策略模式来重构表单  的代码，很显然第一步我们要把这些校验逻辑都封装成策略对象:
```
var strategies = {
    isNonEmpty: function( value, errorMsg ){
        if(value===''){ 
            return errorMsg ;
        } 
    },
    minLength: function( value, length, errorMsg ){ 
        //  限制最小长度
        if ( value.length < length ){
            return errorMsg;
        }
    }，
    isMobile: function( value, errorMsg ){
        // 手机号码格式
        if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){ 
            return errorMsg;
        } 
        
    }
}
```
1）添加单个验证规则
validator类

```
var Validator = function(){
    this.cache = []; // 保存验证规则   
};
Validator.prototype.add = function( dom, rule, errorMsg ){
    var ary = rule.split( ':' ); // 把strategy和参数分开    this.cache.push(function(){
        var strategy = ary.shift();
        ary.unshift(dom.value);
        ary.push(errorMsg);
        return strategies[strategy].apply(dom,ary);
    }); 
};
Validator.prototype.start = function(){
    for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
        var msg = validatorFunc();
        if ( msg ){ 
            return msg; 
        }
  }};
```

2) 为单个输入框添加多个验证规则

我们希望的验证规则：
```
validator.add( registerForm.userName,[{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
},{
    strategy: 'minLength',
    errorMsg: '用户名长度不能超过10位'
}]
```

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>策略模式验证表单</title>
</head>
<body>
    <form action="http:// xxx.com/register" id="registerForm" method="post">
        用户名:<input type="text" name="userName"/ >
        密码:<input type="text" name="password"/ >
        手机号码:<input type="text" name="phoneNumber"/ >
        <button>提交</button>
    </form> 
    <script>
        /********策略对象********/
        var strategies = {
            isNonEmpty: function( value, errorMsg ){
                if(value===''){ 
                    return errorMsg ;
                } 
            },
            minLength: function( value, length, errorMsg ){ 
                //  限制最小长度
                if ( value.length < length ){
                    return errorMsg;
                }
            }，
            isMobile: function( value, errorMsg ){
                // 手机号码格式
                if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){ 
                    return errorMsg;
                } 
                
            }
        }
        /********Validate 类*******/
        
        var Validator = function(){
            this.cache = []; // 保存验证规则   
        };
        Validator.prototype.add = function( dom, rules){
            var self = this;
            for (var i=0,rule; rule = rules[i++]){
                (function(rule){
                    var strategyAry = rule.strategy.split( ':' );
                    var errorMsg = rule.errorMsg;
                    
                    self.cache.push(function(){
                        var strategy = strategyAry.shift();
                        strategyAry.unshift(dom.value);
                        strategyAry.push(errorMsg);
                        return strategies[strategy].apply(dom,strategyAry);
                    }); 
                })(rule)
            }; 
        };
        Validator.prototype.start = function(){
            for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
                var msg = validatorFunc();
                if ( msg ){ 
                    return msg; 
                }
            }
        };
        
        /********客户端*****/
        var registerForm = document.getElementById( 'registerForm' );
            var validataFunc = function(){
                var validator = new Validator();
                
                validator.add( registerForm.userName, [{             strategy: 'isNonEmpty',
                    errorMsg: '用      '
                },{
                    strategy: 'minLength:6',
                    errorMsg: '用       于 10  '
                }]);        
                
                validator.add( registerForm.password, [{
                    strategy: 'minLength:6',
                    errorMsg: ' 码     于 6  '
                }]);
                
                validator.add( registerForm.phoneNumber, [{          strategy: 'isMobile',
                    errorMsg: '   码 式  确'
                }]);
                
                var errorMsg = validator.start();
                return errorMsg; 
            }
            registerForm.onsubmit = function(){       var errorMsg = validataFunc();
                if ( errorMsg ){
                    alert ( errorMsg );
                    return false; 
                }
            };
        </script>
    </body>
</html>
```





 






 



