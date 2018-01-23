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