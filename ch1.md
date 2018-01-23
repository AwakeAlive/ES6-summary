## 块级绑定

### var声明与变量提升
变量提升：使用 var 关键字声明的变量，无论其实际声明位置在何处，都会被视为声明于所在函数的顶
部（如果声明不在任意函数内，则视为在全局作用域的顶部）

块级声明也就是让所声明的变量在指定块的作用域外无法被访问。块级作用域（又被称为词法作用域）
在如下情况被创建：
1. 在一个函数内部
2. 在一个由一对花括号包裹的代码块内部

### 禁止重复声明

如果一个标识符已经在代码块内部被定义，那么在此代码块内使用同一个标识符进行 let 声明就会导致错误。

ES6 const声明的变量被认为是常量（constant）。const声明的变量都要在声明事初始化。

使用 const 声明对象

const 声明会阻止对于变量绑定与变量自身值的修改，这意味着它并不会阻止对变量成员的
修改。例如：
```js
const person = {
    name: "Nicholas"
};

// works
person.name = "Greg";

// throws an error
person = {
    name: "Greg"
};
```
此处 person 在初始化时被绑定为带有单个属性的对象。修改 person.name 并不会抛出错
误，因为该操作只修改了 person 对象的成员，而没有修改 person 的绑定值。当代码试图
为 person 对象自身赋值，即试图更改变量绑定时，就会导致错误。 const 在变量方面的微
妙工作机制容易被误解.

但仅需牢记： `const` 阻止的是对于变量绑定的修改，而不阻止对成员值的修改。

### The Temporal Dead Zone

```js
if (condition) {
    console.log(typeof value);  // ReferenceError!
    let value = "blue";
}
```

此处的 value 变量使用了 let 进行定义与初始化，但该语句永远不会被执行，因为声明之
前的那行代码抛出了一个错误。出现该问题是因为 value 位于被 JS 社区称为暂时性死区（
temporal dead zone ， TDZ ）的区域内。该名称并未在 ECMAScript 规范中被明确命名，
但经常被用于描述 let 或 const 声明的变量为何在声明位置之前无法被访问。本小节描述
的是暂时性死区导致的声明位置的微妙之处，尽管此处使用的都是 let ，但替换为 const
也不例外。

不过可以在变量被定义的代码块之外对该变量使用typeof ，尽管其结果可能并非预期。参考如下代码：
```js
console.log(typeof value);     // "undefined"

if (condition) {
    let value = "blue";
}
```

typeof 运算符被用于 value 变量被定义的代码块外部，此时 value 并未在暂时性死区内。这意味着 value 变量绑定尚不存在，而 typeof 仅会单纯返回 "undefined" 。

### Functions in Loops
```js
var funcs = [];

for (var i = 0; i < 10; i++) {
    funcs.push(function() { console.log(i); });
}

funcs.forEach(function(func) {
    func();     // outputs the number "10" ten times
});
```
你原本可能预期这段代码会输出 0 到 9 的数值，但它却在同一行将数值 10 输出了十次。这是
因为变量 i 在循环的每次迭代中都被共享了，意味着循环内创建的那些函数都拥有对于同一
变量的引用。在循环结束后，变量 i 的值会是 10 ，因此当 console.log(i) 被调用时，
每次都打印出 10 。

为了修正这个问题，开发者在循环内使用立即调用函数表达式（IIFEs），以便在每次迭代中
强制创建变量的一个新副本。

```js
var funcs = [];

for (var i = 0; i < 10; i++) {
    funcs.push((function(value) {
        return function() {
            console.log(value);
        }
    }(i)));
}

funcs.forEach(function(func) {
    func();     // outputs 0, then 1, then 2, up to 9
});
```
这种写法在循环内使用了 IIFE 。变量 i 被传递给 IIFE ，从而创建了作为副本的 value 变
量，每个 value 都存储着每次迭代时变量 i 的值。迭代中的函数使用这些值副本，在循环
从 0 到 9 的过程中每次都能输出预期结果。幸运的是，使用 let 与 const 的块级绑定可以
在 ES6 中简化这种写法。

### 循环内的 let 声明
let 声明通过有效模仿上例中 IIFE 的作用而简化了循环。在每次迭代中，都会创建一个新的
同名变量并对其进行初始化。这意味着你可以完全省略 IIFE 而获取预期的结果，就像这样：
```js
var funcs = [];

for (let i = 0; i < 10; i++) {
    funcs.push(function() {
        console.log(i);
    });
}

funcs.forEach(function(func) {
    func();     // outputs 0, then 1, then 2, up to 9
})
```
与使用 var 声明配合 IIFE 相比，这里代码能达到相同效果，但无疑更加简洁。在循环中
let 声明每次都创建了一个新的 i 变量，并赋予了正确的值，于是在循环内部创建的函数
都获得了各自的 i 副本

### 循环内的常量声明

ES6 规范没有明确禁止在循环中使用 const 声明，然而它会根据不同循环方式而有不同行
为。在常规的 for 循环中，你可以在初始化时使用 const ，但循环会在试图改变该变量的
值时抛出错误。例如：
```js
var funcs = [];

// throws an error after one iteration
for (const i = 0; i < 10; i++) {
    funcs.push(function() {
        console.log(i);
    });
}
```
In this code, the `i` variable is declared as a constant. The first iteration of the loop, where `i` is 0, executes successfully. An error is thrown when `i++` executes because it's attempting to modify a constant. As such, you can only use `const` to declare a variable in the loop initializer if you are not modifying that variable.

When used in a `for-in` or `for-of` loop, on the other hand, a `const` variable behaves the same as a `let` variable. So the following should not cause an error:

```js
var funcs = [],
    object = {
        a: true,
        b: true,
        c: true
    };

// doesn't cause an error
for (const key in object) {
    funcs.push(function() {
        console.log(key);
    });
}

funcs.forEach(function(func) {
    func();     // outputs "a", then "b", then "c"
});
```

## 全局块级绑定
```js
// in a browser
let RegExp = "Hello!";
console.log(RegExp);                    // "Hello!"
console.log(window.RegExp === RegExp);  // false

const ncz = "Hi!";
console.log(ncz);                       // "Hi!"
console.log("ncz" in window);           // false
```

### Summary
let 与 const 块级绑定将词法作用域引入了 JS 。这两种声明方式都不会进行提升，并且
仅在声明它们的代码块内部可用。这样变量就能够在必要位置被准确声明，其表现更加接近
其他语言，并且能减少无心之失。作为一个副作用，你不能在变量声明位置之前访问它们，
即便使用的是 typeof 这样的安全运算符。由于块级绑定存在暂时性死区（ TDZ ），试图在
声明位置之前访问它就会导致错误。
let 与 const 的表现在很多情况下都相似于 var ，然而在循环中就有差异。在 for-in 与
for-of 循环中， let 与 const 都能在每一次迭代时创建一个新的绑定，这意味着在循环
体内创建的函数可以使用当前迭代所绑定的循环变量值，而不是像使用 var 那样，统一使用
循环结束时的变量值。在 for 循环中使用 let 声明时也是如此，不过在 for 循环中使用
const 声明则会导致错误。
块级绑定当前的最佳实践就是：在默认情况下使用 const ，而仅在变量值确实需要被更改的
情况下才使用 let 。这在代码中能确保基本的不可变性，有助于防止某些类型的错误。
