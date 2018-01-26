## 扩展的对象功能

### 对象字面量简写(局部变量和同名属性)
```js
function createPerson(name, age) {
  return {
    name,
    age
  }
}
```
#### 方法简写
```js
var person = {
  name: 'Nicholas',
  sayName: function() {
    console.log(this.name)
  }
}

// ES6语法简洁
var person = {
  name: 'Nicholas',
  sayName() {
    console.log(this.name);
  }
}
```
### 对象属性名可以常量，可以变量，可以为计算的表达式
```js
var lastName = 'last name';

var person = {
  "first name": "Nicholas",
  [lastName]: "Zakas",
}

console.log(person["first name"]); // Nicholas
console.log(person[lastName]);  // Zakas

var suffix = " name";

var person = {
  ["first" + suffix]: "Nicholas",
}

console.log(person["first name"]); // Nicholas
```
### Object.is() 与 Object.assign()

对于严格相等运算符（===）， 它认为 `+0` 与 `-0` 相等。
另外，`NaN === NaN` 会返回false，因此只有用`isNaN`才能检测`NaN`
ES6 引入`Object.is()`方法弥补严格相等运算符弥留的怪异缺陷。方法接受两参数，并且二者类型相同且值也相等时返回true

这种相等性判断逻辑和传统的 == 运算符所用的不同，== 运算符会对它两边的操作数做隐式类型转换（如果它们类型不同），
然后才进行相等性比较，（所以才会有类似 "" == false 为 true 的现象），但 Object.is 不会做这种类型转换

这与===运算符也不一样。===运算符（和==运算符）将数字值-0和+0视为相等，并认为Number.NaN不等于NaN。

```js
console.log(+0 == -0); // true
console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); // false
```

Object.is() 判断两个值是否相同。如果下列任何一项成立，则两个值相同：

两个值都是 undefined
两个值都是 null
两个值都是 true 或者都是 false
两个值是由相同个数的字符按照相同的顺序组成的字符串
两个值指向同一个对象
两个值都是数字并且
都是正零 +0
都是负零 -0
都是 NaN
都是除零和 NaN 外的其它同一个数字
```js
console.log(+0 == -0); // true
console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); // false
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true
console.log(5 == 5); // true
console.log(5 == "5"); // true
console.log(5 === 5); // true
console.log(5 === "5"); // false
console.log(Object.is(5, 5)); // true
console.log(Object.is(5, "5")); // false
```
混入（ Mixin ）是在 JS 中组合对象时最流行的模式。
ES5中
```js
function mixin(receiver, supplier) {
  Object.keys(supplier).forEach(function(key) {
    receiver[key] === supplier[key];
  });

  return receiver;
}
```
mixin() 函数在 supplier 对象的自有属性上进行迭代，并将这些属性复制到 receiver 对
象（浅复制，当属性值为对象时，仅复制其引用）。这样 receiver 对象就能获得新的属性
而**无须使用继承**，正如下面代码：
```js
function EventTarget() { /*...*/ }
EventTarget.prototype = {
  constructor: EventTarget,
  emit: function() { /*...*/ },
  on: function() { /*...*/ }
};

var myObject = {};
mixin(myObject, EventTarget.prototype);

myObject.emit("somethingChanged");
```
此处 `myObject` 对象接收了 `EventTarget.prototype `对象的行为，获得了使用 `emit()` 方法
来发布事件、使用 `on()` 来订阅事件的能力。
#### Object.assign()
`Object.assign() `方法接受任意数量的源对象，而接收对象会按照源对象在参数中的顺序来依次接收它们的属性。
这意味着在接收对象中，后面源对象的属性可能会覆盖前面的
```js
var receiver = {};

Object.assign(receiver,
    {
        type: "js",
        name: "file.js"
    },
    {
        type: "css"
    }
);

console.log(receiver.type);     // "css"
console.log(receiver.name);     // "file.js"
```
>切记 `Object.assign() `不能将源对象的访问器属性复制到接收对象中，由于它使用了赋值运算符，源对象的访问器属性就会转变成接收对象的数据属性，例如：

```js
var receiver = {},
    supplier = {
        get name() {
            return "file.js"
        }
    };
Object.assign(receiver, supplier);
var descriptor = Object.getOwnPropertyDescriptor(receiver, "name");
console.log(descriptor.value);      // "file.js"
console.log(descriptor.get);        // undefined
```
### Duplicate Object Literal Properties 重复的对象字面量属性

```js
"use strict";

var person = {
    name: "Nicholas",
    name: "Greg"        // syntax error in ES5 strict mode
};
```
ES6不会检索重复属性，后面的属性值覆盖
```js
"use strict";

var person = {
    name: "Nicholas",
    name: "Greg"        // no error in ES6 strict mode
};

console.log(person.name);       // "Greg"
```
### 自有属性的枚举顺序
`Object.getOwnPropertyNames() `获得顺序

自有属性枚举时基本顺序如下：
1. 所有的数字类型键，按升序排列。
2. 所有的字符串类型键，按被添加到对象的顺序排列。
3. 所有的符号类型（详见第六章）键，也按添加顺序排列。

此处有个示例：
```js
var obj = {
    a: 1,
    0: 1,
    c: 1,
    2: 1,
    b: 1,
    1: 1
};

obj.d = 1;

console.log(Object.getOwnPropertyNames(obj).join(""));     // "012acbd"
```
The `Object.getOwnPropertyNames()` method returns the properties in `obj` in the order `0`, `1`, `2`, `a`, `c`, `b`, `d`.
对于 `for-in `循环，并非所有的 JS 引擎都采用相同的处理方式，其枚举顺序仍未被明
确规定。而 `Object.keys() `和 `JSON.stringify() `也使用了与 for-in 一样的枚举顺
序。
### 更强大的原型

ES5添加Object.getPrototypeOf()方法来获取任意指定对象的原型。
ES6添加Object.setProototypeOf()方法来修改任意指定对象的原型。接收两个参数（需要被修改原型的对象，将会成为原型的对象）

```js
let person = {
    getGreeting() {
        return "Hello";
    }
};

let dog = {
    getGreeting() {
        return "Woof";
    }
};


let friend = {
    getGreeting() {
        return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
    }
};

// set prototype to person
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting());                      // "Hello, hi!"
console.log(Object.getPrototypeOf(friend) === person);  // true

// set prototype to dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting());                      // "Woof, hi!"
console.log(Object.getPrototypeOf(friend) === dog);     // true
```

Object.setProototypeOf()方法能够在创建对象之后改变其原型。


Object.create() 创建一个空对象，并且这个对象的原型指向这个参数。
![Object.create](/Object.create.png)
