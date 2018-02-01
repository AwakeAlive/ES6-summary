# 函数Function
##函数的返回值依赖于return语句
1. 一般函数调用没有return语句，在语句执行后，返回undefined
2. 作为构造器，外部使用new去调用的话，默认没有return语句，或者return基本类型，会将this作为返回值。
反之return这个对象的构造器。那么将这个对象作为new这个构造器这样的操作一个返回值。

## 函数的不同调用方式
1. 直接调用
2. 作为对象的方法 o.method();
3. 构造器 new Foo();
4. call/apply/bind 

## 函数的声明与表达式

1. 函数声明会前置
2. 函数表达式 
```js
var add = function (a, b) {
  // do sth.
}

// IEF (Immediately Executed Function)
(function() {
  // do sth.
})()

// first-class function
return function() {
  // do sth
}

NFE (Named Function Expression)
var add = function foo(a, b) {
  // do sth
}
```

```js
var num = add(1, 2); // 相当于var add; 报TypeError: undefined is not a function

console.log(num);

var add = function(a, b) {
  a = +a;
  b = +b;
  if(isNaN(a) || isNaN(b)) {
    return;
  }
  return a + b;
}
```
## 命名函数表达式
```js
var func = function nfe() {};
alert(func === nfe); // IE6~8 false IE9+ 'nfe' is undefined

//递归调用
var func = function nfe() {/** do sth **/ nfe();}
```

## Function 构造器

Function构造器里面参数局部变量
```js
var func = new Function('a', 'b', 'console.log(a+b)'); // 前面参数代表形参，最后是函数体
var func = Function('a', 'b', 'console.log(a+b)'); // 两者一样
```

```js
// case1
Function('var localVal = 'local'; console.log(localVal);')();
console.log(typeof localVal); // result local, undefined
// case 2
var globalVal = 'global';
(function() {
  var localVal = 'local';
  Function('console.log(typeof localVal, typeof global'); // localVal 特殊性，取不到 undefined 但是全局变量可以取得
})()
```
## 函数声明前置 不予许匿名和立即调用
函数表达式和函数构造器允许匿名和立即调用，函数构造器可以没有函数名

