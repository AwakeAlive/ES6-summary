# Functions

## Functions with Default Parameter Values

ES5 默认参数值

```js
function makeRequest(url, timeout, callback) {

    timeout = timeout || 2000;
    callback = callback || function() {};

    // the rest of the function
}
```
但是有个弊端，`timeout`可能为0,所以改进方式

```js
function makeRequest(url, timeout, callback) {

    timeout = (typeof timeout !== "undefined") ? timeout : 2000;
    callback = (typeof callback !== "undefined") ? callback : function() {};

    // the rest of the function

}
```
ES6 默认值
```js
function makeRequest(url, timeout = 2000, callback = function() {}) {

    // the rest of the function

}
```
```js
function makeRequest(url, timeout = 2000, callback) {

    // the rest of the function

}
```

In this case, the default value for `timeout` will only be used if `timout` 值没传或`undefined`

```js
// uses default timeout
makeRequest("/foo", undefined, function(body) {
    doSomething(body);
});

// uses default timeout
makeRequest("/foo");

// doesn't use default timeout
makeRequest("/foo", null, function(body) {
    doSomething(body);
});
```

在这个例子中， `null`值被认为是有效参数，意味着对于 `makeRequest()` 的第三次调用并不
会使用 `timeout` 的默认值。

### 参数默认值影响arguments对象

**ES5 nonstrict mode**

the `arguments` object reflects changes in the named parameters of a function.

```js
function mixArgs(first, second) {
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    first = "c";
    second = "d";
    console.log('arguments: ', arguments)
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
}

mixArgs("a", "b");
```

outputs:
```
true
true
Arguments(2) ["c", "d", callee: ƒ, Symbol(Symbol.iterator): ƒ]
true
true
```
The `arguments` object is always updated in nonstrict mode to reflect changes in the named parameters. Thus, when `first` and `second` are assigned new values, `arguments[0]` and `arguments[1]` are updated accordingly, making all of the `===` comparisons resolve to `true`.

**ES5 strict mode**
```js
function mixArgs(first, second) {
  "use strict";

  console.log(first === arguments[0]);
  console.log(second === arguments[1]);

  first = "c";
  second = "d";
  console.log('arguments', arguments);
  console.log(first === arguments[0]);
  console.log(second === arguments[1]);

}

mixArgs("a", "b");
```
```
outputs

true
true
arguments Arguments(2) ["a", "b", callee: (...), Symbol(Symbol.iterator): ƒ]
false
false
```
这一次更改 `first` 与 `second` 就不会再影响 `arguments` 对象，因此输出结果符合通常的期
望。

然而在使用 `ES6` 参数默认值的函数中，无论函数是否明确运行在严格模式下， `arguments`
对象的表现总是会与 `ES5` 的**严格模式**一致，参数默认值的存在触发了 `arguments` 对象与具
名参数的分离。这是个细微但重要的细节，表示 arguments 对象的使用方式发生了变化
```js
// not in strict mode
function mixArgs(first, second = "b") {
    console.log(arguments.length);
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
    first = "c";
    second = "d"
    console.log('arguments', arguments);
    console.log(first === arguments[0]);
    console.log(second === arguments[1]);
}

mixArgs("a");
```
```
outputs

 1
 true
 false
 arguments Arguments ["a", callee: (...), Symbol(Symbol.iterator): ƒ]
 false
 false
 ```
 `arguments[1]` 的值是 `undefined`.无论是否在严格模式下，改变 `first` 和 `second` 的值
不会对 `arguments` 对象造成影响，所以 `arguments` 对象始终能映射出初始调用状态。

### 参数默认值表达式
```js
function getValue() {
    return 5;
}

function add(first, second = getValue()) {
    return first + second;
}

console.log(add(1, 1));     // 2
console.log(add(1));        // 6
```
```js
function add(first, second = first) {
    return first + second;
}

console.log(add(1, 1));     // 2
console.log(add(1));        // 2
```
```js
function getValue(value) {
    return value + 5;
}

function add(first, second = getValue(first)) {
    return first + second;
}

console.log(add(1, 1));     // 2
console.log(add(1));        // 7
```
*Attention注意*
**参数默认值的暂时性死区**
```js
function add(first = second, second) {
    return first + second;
}

console.log(add(1, 1));         // 2
console.log(add(undefined, 1)); // throws error
```
In this example, the call to `add(undefined, 1)` throws an error because `second` hasn't yet been initialized when `first` is initialized. At that point, `second` is in the TDZ and therefore any references to `second` throw an error.
