## 对象
对象标签：[[proto]], [[class]], [[extensible]]
对象配置： writable, enumerable, configurable, value, set/get

### 创建对象
```js
function foo() {}
foo.prototype.z = 3;

var obj = new foo();
obj.y = 2;
obj.x = 1;

obj.x; // 1
obj.y; // 2
obj.z; // 3

typeof obj.toString; // 'function' toString来源于Object.prototype
'z' in obj; // true  in遍历可能会遍历原型链上的属性
obj.hasOwnProperty('z'); // false 表明z不是obj对象直接属性，而是obj原型链上的
```
