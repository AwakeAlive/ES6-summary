## 类型
原始类型
基本类型 number string boolean null undefined
复合类型 object（包含Function Array Date...）

## 类型比较
### 非严格相等 a==b
原则：
1. 类型相同，同===
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
即Boson.__proto__.__proto__ === Person.prototype

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

## summary

1 typeof 适合基本类型以及function检测，遇到null失效。可以通过严格等于null === null解决
2 [[Class]] 通过{}.toString拿到，适合内置对象和基元类型，遇到nullhe undefined失效（IE6，7，8返回[object Object]）
3 instanceof 适合自定义对象，也可以用来检测原生对象，在不同iframe和window检测失效
