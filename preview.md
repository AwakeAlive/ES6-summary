## 类型

原始类型
基本类型 number string boolean null undefined
复合类型 object（包含Function Array Date...）

## 类型比较

### 非严格相等 a==b

原则：

1. 类型相同，同 ===

2. 类型不同，尝试类型转换和比较

```js
null == undefined 相等
number == string 转 number
// 1 == "1.0" // true
boolean == ? 转number
// 1 == true // true
object == number | string 尝试对象转换为基本类型
// new String('hi') === 'hi' // true
其它false
```

### 严格比较 a === b

原则：
类型不同： 返回false
类型相同： null === null
undefined === undefined
NaN ≠ NaN
new Object ≠ new object

## 包装对象

```js
let str = new String('12');

var a = 'string'
alert(a.lenth); //6
a.t = 3;
alert(a.t); // undefined

当把一个基本类型尝试以对象访问属性的时候，例如length，
JavaScript智能地把基本类型转换为对应的包装对象。
转换这个，相对于 a = new String('string')
a.t设置以后，临时对象会被销毁掉。
同理，Date Number一样，例如Number(123).toString() 一样原理
```

## 类型比较
typeof 一般判断基本类型
```js
typeof 100 // 'number'
typeof true // 'boolean'
typeof Object // 'function'
typeof Function // 'function'
typeof undefined // 'undefined'
typeof new Object() // 'object'
typeof [1, 2] // 'object'
typeof NaN  // 'number'
typeof null  // 'object'

typeof null === 'object' // 历史原因
```

instanceof 判断对象类型 基于原型链操作的判断符
obj instanceof Object
左操作数是一个对象，否则直接false
右边是一个对象或对象构造器，否则抛出TypeError

左操作数对象的原型链上是否有右边构造函数的prototype属性
[1, 2] instanceof Array === true

```js
function Person(){}
function Student() {}

Student.prototype = new Person()
Student.prototype.constructor = Student

var bosn = new Student();
var one = new Person();

boson instanceof Student; // true
one instanceof Person; // true
one instanceof Stundent; // false

bosn instanceof Person; // true
```
```js
// 解释
Boson.__proto__ === Student.prototype
Boson.__proto__ 不等于 Person.prototype
但是会沿着原型链向上查找 Student.prototype.__proto__ = Person.prototype
即 Boson.__proto__.__proto__ === Person.prototype

需要注意 不同window或不同iframe间的对象类型检测不能使用instanceof
```

### Object.prototype.toString.call or Object.prototype.toString.apply
```js
Object.prototype.toString.apply([]) === "[object Array]"

Object.prototype.toString.apply(function(){}) === "[object Function]"
Object.prototype.toString.apply(Object) === "[object Function]"

Object.prototype.toString.apply(null) === "[object Null]"
Object.prototype.toString.apply(undefined) === "[object Undefined]"

Object.prototype.toString.call(new Object()) === "[object Object]"

```
> Caution IE6,7,8  Object.prototype.toString.apply(null)返回"[object Object]"

### constructor
任何一个对象都有一个constructor属性,继承自己原型的，
constructor会指向构造这个对象的构造器或构造函数
constructor 可以改写，需注意

### duck type

## summary1

1 typeof 适合基本类型以及function检测，遇到null失效。可以通过严格等于null === null解决
2 [[Class]] 通过{}.toString拿到，适合内置对象和基元类型，遇到null 和 undefined失效（IE6，7，8返回[object Object]）
3 instanceof 适合自定义对象，也可以用来检测原生对象，在不同 iframe 和 window 检测失效

## 原始表达式
1. 常量
2. 关键字 null, this, type
3. 变量 i, j, k

## 数组，对象的初始化表达式

`[1, , , 4]` 类似 `[1, undefined, undefined, 4];`

调用表达式 `func() `即`函数名（）`

对象创建表达式 `new Func(1, 2) `如果没参数，括号可省略，类似 `new Object`
逗号运算符 `var val = (1, 2, 3); `// 即`val`取最后一个值 `var val = 3`

运算符 delete
在configurable = false情况下，delete删除对象属性删除失败
typeof 原始类型， 返回字符串
hasOwnProperty可以判断属性是否在自身上

```js
function Foo() {}
Foo.prototype.x = 1;
var obj = new Foo();
obj.x; // 1
obj.hasOwnProperty('x'); // false
obj.__proto__.hasOwnProperty('x'); // true
```

```js
var obj = {x: 1}
obj.x; // 1

delete obj.x;
obj.x; // undefined
```

configurable为false情况

```js
var obj = {};
Object.defineProperty(obj, 'x', {
  configurable: false,
  value: 1,
})

delete obj.x; // false
obj.x; // 1
```

ES5没有块级作用域

```js
for(var i =0; i< 10; i++) {
  var str = 'hi';
  console.log(str);
}
// equals to
var i = 0;
for(, i< 10; i++) {
  var str = 'hi';
  console.log(str);
}
```

注意 var a = b = 1 在函数里声明，b被放在全局作用域
```js
function foo() {
  var a = b = 1;
}

foo();

console.log(typeof a); // undefined
console.log(typeof b); // number
```

### try...catch...finally

3种形式： try...catch, try...finally, try...catch...finally

```js
try {
  throw 'test'
} catch (err) {
  console.log(err)
} finally {
  console.log('finally');
}
```

### 函数function 1. 函数声明（会前置） 2. 函数表达式

```js
fd(); // true

function fd() {
  // do sth.
  return true;
}
```

```js
fe(); // TypeError

var fe = function() {
  // do sth.
}
```

### for...in 遍历对象属性

```js
var p;
var obj = {
  x: 1,
  y: 2
}

for (p in obj) {
  // do sth.
}
```

**Attention:**
1. for...in...遍历顺序不确定
2. enumerable为false情况下不会出现属性 (enumerable 为true时，该属性才能够出现在对象的枚举属性中，enumerable默认false)
3. for in 对象属性时，受原型链影响。例如obj 的原型链上的原型有其他属性，并且enumerable为true情况下也会遍历到。

### switch <必须break语句断开，否则会继续往下执行>

```js
var val = 2;
// eg1
switch(val) {
  case 1:
    console.log(1);
    break;
  case 2:
    console.log(2); // 2
    break;
  default:
    console.log(0);
}

// eg2
switch(val) {
  case 1:
    console.log(1);
  case 2:
    console.log(2);
  default:
    console.log(0); // 20
}

// eg3
switch(val) {
  case 1:
  case 2:
    console.log(12); // 2
    break;
  default:
    console.log(0);
}
```

### 循环

```js
do {
  // do sth
} while(isTrue)

while(isTrue) {
  // do sth
}

for loop
```

### with语句 （可修改当前作用域，对象定义属性）

```js
// eg1
with ({x: 1}) { // 直接访问对象属性
  console.log(x); // 1
}

// eg2
with(document.forms[0]) { // 访问form[0]下面所有元素
  console.log(name.value)
}
// 现在被替换 => 访问深层次东西可以定义变量
var form = document.forms[0]
console.log(form.name.value);
```

**Attention:**
1. with语句让JS引擎优化更难
2. 可读性差
3. 可被变量定义替换
4. 严格模式下被禁用

## JS严格模式

1. 修复JS语言不足
2. 提供更强错误检查， 并增强安全性

**如何应用**
1.函数内

```js
function foo() {
  'use strict'; // 严格模式只对该函数有效
  // do sth.
}
```

2.不在函数内，函数外，针对整个文件

```js
'use strict'
function foo() {
  // do sth.
}
```

**严格模式下规则**
1.不允许使用with，否则报SyntaxError

```js
!function(){
  with({x: 1}) {
    console.log(x); // 1
  }
}();

!function(){
  'use strict';
  with({x: 1}) {
    console.log(x); // SyntaxError
  }
}();
```

2.不允许使用未声明的变量被赋值，否则报ReferenceError,而不是隐式创建全局变量

```js
!function() {
  x = 1;
  console.log(window.x); // 1
}()

!function() {
  'use strict';
  x = 1;
  console.log(window.x); // ReferenceError
}();
```

3.函数中的特殊对象arguments是静态副本， 而不像严格模式那样，修改arguments或修改参数变量会相互影响

```js
!function(a) {
  arguments[0] = 100; // arguments会直接修改形参
  console.log(a); // 100
}(1); // 不传形参，arguments[0] 不会影响，a为undefined

!function(a) {
  'use strict';
  arguments[0] = 100; // 严格模式下arguments[0]不影响形参
  console.log(a); // 1
}(1);

// 但是对于对象
!function(a) {
  'use strict';
  arguments[0]['x'] = 100; // arguments会直接修改形参
  console.log(a.x); // 100
}({x: 1});
```

4.delete参数，函数名报错 SyntaxError

```js
!function(a) {
  console.log(delete a); // false
}

!function(a) {
  'use strict';
  console.log(delete a); // SyntaxError
}
```

5.delete删除不可配置情况下报错
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认false

```js
!function(a) {
  var obj = {};
  obj.defineProperty(obj, 'a', {
    configurable: false
  })
  console.log(delete obj.a); // false
}

!function(a) {
  'use strict';
  var obj = {};
  obj.defineProperty(obj, 'a', {
    configurable: false
  })
  console.log(delete a); // SyntaxError
}
```

6.对象字面量重复属性名SyntaxError

```js
!function() {
  var obj = {
    x: 1,
    x: 2
  }
  console.log(obj.x); // 2
}()

!function() {
  'use strict';
  var obj = {
    x: 1,
    x: 2
  }
  console.log(obj.x); // SyntaxError？？？ (chrome64.0 试下？正确)
}()

```

7.禁止八进制字面量如010（八进制的8）

```js
!function() {
  console.log(010); // 8
}()

!function() {
  'use strict';
  console.log(010); // 8
}()
```

8.eval, arguments变为关键字，不能作为变量，函数名

```js
!function() {
  'use strict';
  function eval() {} // SyntaxError
}()
```

9.eval独立作用域

```js
!function() {
  eval('var evalVal = 2;');
  console.log(typeof evalVal); // number
}()

!function() {
  'use strict';
  eval('var evalVal = 2;');
  console.log(typeof evalVal); // undefined
}()

```
