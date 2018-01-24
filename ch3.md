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

### ES5 Unnamed parameters
例子： 从一个对象筛选自己想要的属性，重新组成新对象
```js
function pick(object) {
    let result = Object.create(null);

    // start at the second parameter,   第一个参数为object
    for (let i = 1, len = arguments.length; i < len; i++) {
        result[arguments[i]] = object[arguments[i]];
    }

    return result;
}

let book = {
    title: "Understanding ECMAScript 6",
    author: "Nicholas C. Zakas",
    year: 2015
};

let bookData = pick(book, "author", "year");

console.log(bookData.author);   // "Nicholas C. Zakas"
console.log(bookData.year);     // 2015
```
此函数模拟了 `Underscore.js` 代码库的 `pick()` 方法，能够返回包含原有对象特定属性的子集副本。本例中只为函数定义了一个期望参数，也就是拷贝属性的来源对象，**除此之外传递的所有参数则都是需要拷贝的属性的名称**。

由此引入剩余参数
### Rest Parameter
剩余参数（ rest parameter ）由三个点（ ... ）与一个紧跟着的具名参数指定，它是包含
传递给函数的其余参数的一个数组，由此得名“剩余”。例如， `pick() `函数可以像下面这样用
剩余参数来重写：
```js
function pick(object, ...keys) {
  let result = Object.create(null);

  for(let i = 0, len = keys.length;i < len; i++) {
    result[keys[i]] = object[keys[i]]
  }

  return result;
}
```
keys是一个剩余参数，包含所有在object之后的参数，而与囊括所有的arguments不同，后者连第一个参数都会包含。
>函数的 length 属性用于指示具名参数的数量，而剩余参数对其毫无影响。此例中
pick() 函数的 length 属性值是 1 ，因为只有 object 参数被用于计算该值。
译注：这种说法并不严谨。若函数使用了默认参数，则 length 属性不包含使用默认值
的参数，并且它只能指示出第一个默认参数之前的具名参数数量。例如对于 function
example(first, second = 'woo', third) {} 函数声明来说， length 的值是 1 而非 2
，尽管这里有两个无默认值的具名参数。

#### 剩余参数的限制2条件
1、一个函数只能有一个剩余参数，并且它必须被放在最后。
```js
// Syntax error: Can't have a named parameter after rest parameters
function pick(object, ...keys, last) {
    let result = Object.create(null);

    for (let i = 0, len = keys.length; i < len; i++) {
        result[keys[i]] = object[keys[i]];
    }

    return result;
}
```
2、剩余参数不能在对象字面量的setter属性中使用。
（because对象字面量的 setter 被限定只能使用单个参数；而剩余参数按照定义
是不限制参数数量的，因此它在此处不被许可。
剩）

```js
let object = {

    // Syntax error: Can't use rest param in setter
    set name(...value) {
        // do something
    }
};
```
arguments 对象总能正确反映被传入函数的参数，而无视剩余参数的使用。
```js
function checkArgs(...args) {
  console.log(args.length);
  console.log(arguments.length);
  console.log(args[0], arguments[0]);
  console.log(args[1], arguments[1]);
}

checkArgs("a", "b");
```
outputs
```js
2
2
a a
b b
```
### 函数构造器的增强
`Function` 构造器允许你动态创建一个新函数，传给构造器的参数都是字符串
```js
var add = new Function("first", "second", "return first + second")

console.log(add(1, 1))

```
ES6 默认参数，剩余参数
```js
var add = new Function("first", "second = first", "return first + second");

console.log(add(1, 1)); //2
console.log(add(1)); //2

var pickFirst = new Function("...args", "return args[0]");

console.log(pickFirst(1, 2)); // 1
```
### The Spread Operator
剩余运算符允许你将多个独立的参数合并到一个数组中；而扩展运算符则允许你将一个数组分割，并将各个项作为分离的参数传给函数。
例如Math.max()接收任意数量的参数，并会返回其中的最大值
```js
let value1 = 25,
    value2 = 50;

console.log(Math.max(value1, value2)); // 50
```
处理数组多个值
```js
// ES5
let values = [25, 50,  75, 100];

console.log(Math.max.apply(Math, values)); // 100

// ES6
console.log(Math.max(...values)) // 100

// 将扩展运算符与其他参数使用，例如Math.max() 返回最小值0,可以将参数0单独传入
let values = [-25, -50, -75, -100];

console.log(Math.max(...values, 0));

```

### ES6 function name property
```js
function doSomething() { // function 函数声明
    // ...
}

var doAnotherThing = function() { // 函数表达式 a function expression
    // ...
};

console.log(doSomething.name);          // "doSomething"
console.log(doAnotherThing.name);       // "doAnotherThing"
```

```js
var doSomething = function() {
    // ...
};

console.log(doSomething.bind().name);   // "bound doSomething"

console.log((new Function()).name);     // "anonymous"
```
#### special cases
```js
var doSomething = function() {}

console.log(doSomething.bind().name); // "bound doSomething"
console.log((new Function()).name); // "anonymous"
```
绑定产生的函数拥有原函数的名称，并总会附带 "bound" 前缀，因此 doSomething() 函数的
绑定版本的名称为 "bound doSomething" 。

### 明确函数的双重用途
```js
function Person(name){
    this.name = name;
}

var person = new Person("Nicholas"); 
var notAPerson = Person("Nicholas"); 
console.log(person); // "[Object object]"
console.log(notAPerson) // undefined
```
在 ES5 中判断函数如何被调用
在 ES5 中判断是否使用了 new 去调用函数（即作为构造器），最流行的方式是使用instanceof ，例如：
```js
function Person(name) {
    if (this instanceof Person) {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // works!
```
可惜该方法并不绝对可靠，因为有时未使用 new 但 this 仍然可能是Person 的实例，正如下例：
```js
function Person(name) {
    if (typeof new.target !== "undefined") {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // error!
```
### new.target 元属性
```js
function Person(name) {
    if (typeof new.target !== "undefined") {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // error!
```
使用 new.target 而非 this instanceof Person ， Person 构造器会在未使用 new 时正确
地抛出错误。
```js
function Person(name) {
    if (new.target === Person) {
        this.name = name;   // using new
    } else {
        throw new Error("You must use new with Person.")
    }
}

function AnotherPerson(name) {
    Person.call(this, name);
}

var person = new Person("Nicholas");
var anotherPerson = new AnotherPerson("Nicholas");  // error!
```
在此代码中，为了正确工作， new.target 必须是 Person 。当调用 new
AnotherPerson("Nicholas") 时， Person.call(this, name) 也随之被调用，从而抛出了错误，
因为此时在 Person 构造器内部的 new.target 值为 undefined （调用 Person 时并未使用
new ）。

### 块级函数
```js
"use strict";

if (true) {

    // Throws a syntax error in ES5, not so in ES6
    function doSomething() {
        // ...
    }
}
```
```js
"use strict";

if (true) {
    // Block level functions are hoisted to the top of the block in which they are defined, 
    console.log(typeof doSomething);        // "function"

    function doSomething() {
        // ...
    }

    doSomething();
}

console.log(typeof doSomething);            // "undefined"
```
使用块级函数与let函数表达式类似，，在执行流跳出定义所在的代码块之后，函数定义就会被移除。
关键区别在于：块级函数会被提升到所在代码块的顶部；而使用 let 的函数表达式则不会。
```js
"use strict";

if (true) {

    console.log(typeof doSomething);        // throws error

    let doSomething = function () {
        // ...
    }

    doSomething();
}

console.log(typeof doSomething);
```
ES6 在非严格模式下同样允许使用块级函数，但行为有细微不同。块级函数的作用域会被提
升到所在函数或全局环境的顶部，而不是代码块的顶部。
```js
// ECMAScript 6 behavior
if (true) {

    console.log(typeof doSomething);        // "function"

    function doSomething() {
        // ...
    }

    doSomething();
}

console.log(typeof doSomething);            // "function"
```

### Arrow Function
* **No `this`, `super`, `arguments`, and `new.target` bindings** - The value of `this`, `super`, `arguments`, and `new.target` inside of the function is by the closest containing nonarrow function. (`super` is covered in Chapter 4.)
* **Cannot be called with `new`** - Arrow functions do not have a `[[Construct]]` method and therefore cannot be used as constructors. Arrow functions throw an error when used with `new`.
* **No prototype** - since you can't use `new` on an arrow function, there's no need for a prototype. The `prototype` property of an arrow function doesn't exist.
* **Can't change `this`** - The value of `this` inside of the function can't be changed. It remains the same throughout the entire lifecycle of the function.
* **No `arguments` object** - Since arrow functions have no `arguments` binding, you must rely on named and rest parameters to access function arguments.
* **No duplicate named parameters** - arrow functions cannot have duplicate named parameters in strict or nonstrict mode, as opposed to nonarrow functions that cannot have duplicate named parameters only in strict mode.
注意：箭头函数也拥有 name 属性，并且遵循与其他函数相同的规则。

```js
var reflect = value => value;

// effectively equivalent to:

var reflect = function(value) {
    return value;
};
```

```js
var getTempItem = id => ({ id: id, name: "Temp" });

// effectively equivalent to:

var getTempItem = function(id) {

    return {
        id: id,
        name: "Temp"
    };
};
```

### 创建立即函数表达式 IIFE
```js
let person = function(name) {
    return {
        getName: function() {
            return name;
        }
    };
}("Nicholas")

console.log(person.getName()) // "Nicholas"
```
此代码中 IIFE 被用于创建一个包含 getName() 方法的对象。该方法使用 name 参数作为返
回值，实际上让 name 成为所返回对象的一个私有成员。
#### 使用箭头函数
```js
let person = ((name) -> {
    return {
        getName: function() {
            return name;
        }
    };
})("Nicholas");

console.log(person.getName()); // "Nicholas"
```
> 译注：使用传统函数时， (function(){/*函数体*/})(); 与 (function(){/*函数体*/}());这两种方式都是可行的。

> 但若使用箭头函数，则只有下面的写法是有效的： (() => {/*函数体*/})();

#### No this Binding 箭头函数没有this绑定
JS 最常见的错误领域之一就是在函数内的 this 绑定。由于一个函数内部的 this 值会根
据调用该函数时的上下文而改变，因此完全可能违背本意地影响了预期外的对象
```js
var PageHandler = {
    id: '1',

    init: function() {
        document.addEventListener("click", function(event) {
            this.doSomething(event.type); // error
        }, false);
    },

    doSomething: function(type) {
        console.log("Handling " + type + " for " + this.id);
    }
}
```
此代码的 PageHandler 对象被设计用于处理页面上的交互。调用 init() 方法以建立交互，
并注册了一个事件处理函数来调用 this.doSomething() 。然而此代码并未按预期工作。
此处的 this 是对事件目标对象（也就是 document ）的一个引用，而没有绑定到
PageHandler 上，因此调用 this.doSomething() 会被中断。若试图运行此代码，你将会在事
件处理函数被触发时得到一个错误，因为 document 对象并不存在 doSomething() 方法。

你可以明确使用 bind() 方法将函数的 this 值绑定到 PageHandler 上，以修正这段代码，
就像这样：
```js
var PageHandler = {

    id: "123456",

    init: function() {
        document.addEventListener("click", (function(event) {
            this.doSomething(event.type);     // no error
        }).bind(this), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
};
```
箭头函数没有 `this` 绑定，意味着箭头函数内部的 `this` 值只能通过查找作用域链来确定。
如果箭头函数被包含在一个非箭头函数内，那么 `this` 值就会与该函数的相等；否则，
`this` 值就会是全局对象（在浏览器中是 `window` ，在 `nodejs` 中是 `global` ）。
```js
var PageHandler = {
    id: '12',

    init: function() {
        document.addEventListener("click", event => this.doSomething(event.type), false);
    },

    doSomething: function(type) {
        console.log("Handling " + type  + " for " + this.id);
    }
}
```

本例中的事件处理函数是一个调用 this.doSomething() 的箭头函数，它的 this 值与
init() 方法的相同，因此这个版本的代码的工作方式与使用了 bind(this) 的上个例子相
似。尽管 doSomething() 方法并不返回任何值，它仍然是函数体内唯一被执行的语句，因此
无需使用花括号来包裹它。

箭头函数被设计为“抛弃型”的函数，因此不能被用于定义新的类型； prototype 属性的缺失
让这个特性显而易见。对箭头函数使用 new 运算符会导致错误，正如下例：
```js
var MyType = () => {},
    object = new MyType();  // error - you can't use arrow functions with 'new'
```
由于 `MyType() `是一个箭头函数，它就不存在` [[Construct]]` 方法，此代码调用 `new
MyType() `的操作也因此失败。了解箭头函数不能被用于 `new` 的特性后， JS 引擎就能进一步
对其进行优化。
同样，由于箭头函数的 `this` 值由包含它的函数决定，因此不能使用` call()` 、 `apply()`
或 `bind()` 方法来改变其 `this` 值。

#### Arrow Functions and Arrays
```js
// ES5
var result = values.sort(function(a, b) {
    return a - b;
});
// ES6
var result = values.sort((a, b) => a - b);

```
The array methods that accept callback functions such as `sort()`, `map()`, and `reduce()` 
can all benefit from simpler arrow function syntax, which changes seemingly complex processes into simpler code.

#### 没有 arguments 绑定
尽管箭头函数没有自己的 arguments 对象，但仍然能访问包含它的函数的 arguments 对
象。无论此后箭头函数在何处执行，该对象都是可用的。例如：
```js
function createArrowFunctionReturningFirstArg() {
    return () => arguments[0];
}

var arrowFunction = createArrowFunctionReturningFirstArg(5);

console.log(arrowFunction());       // 5
```
在 createArrowFunctionReturningFirstArg() 内部， arguments[0] 元素被已创建的箭头函数
arrowFunction 所引用，该引用包含了传递给 createArrowFunctionReturningFirstArg() 函数
的首个参数。当箭头函数在此后被执行时，它返回了 5 ，正是传递给
createArrowFunctionReturningFirstArg() 的首个参数。尽管箭头函数 arrowFunction 已不在
创建它的函数的作用域内，但由于 `arguments` 标识符的作用域链解析，当时的 `arguments`
对象依然可被访问。


#### Identifying Arrow Functions
```js
var comparator = (a, b) => a - b;

console.log(typeof comparator);                 // "function"
console.log(comparator instanceof Function);    // true
```
`console.log() `的输出揭示了 `typeof` 与 `instanceof` 在作用于箭头函数时的行为，与作用
在其他函数上完全一致。
就像对待其他函数那样，你仍然可以对箭头函数使用` call()` 、 `apply()` 与 `bind() `方法，
只是箭头函数的 `this` 绑定并不会受影响。这里有几个例子：
```js
var sum = (num1, num2) => num1 + num2;

console.log(sum.call(null, 1, 2));      // 3
console.log(sum.apply(null, [1, 2]));   // 3

var boundSum = sum.bind(null, 1, 2);

console.log(boundSum());                // 3
```
箭头函数能在任意位置，包括使用回调函数时，替代你当前使用的匿名函数

#### 尾调用优化
尾调用（tail call ）指的是调用函数的语句是另一个函数的最后语句

尾调用优化的主要用例是在递归函数中，而且此时的优化能达到最大效果。考虑以下计算阶乘的函数：
```js
function factorial(n) {
    if(n <=1) {
        return 1;
    } else {
        // not optimized - must multiply after returning
        return n * factorial(n - 1);
    }
}
```
优化
```js
function factorial(n, p = 1) {
    if (n <= 1) {
        return 1 * p;
    } else {
        let result = n * p;

        // optimized
        return factorial(n -1, result)
    }
}
```

在重写的 factorial() 函数中，添加了默认值为 1 的第二个参数 p 。 p 参数保存着前一
次乘法的结果，因此下一次的结果就能在进行函数调用之前被算出。当 n 大于 1 时，会先
进行乘法运算并将其结果作为第二个参数传入 factorial() 。这就允许 ES6 引擎去优化这个
递归调用。
### summary
新增的 name 属性让你在调试与执行方面能更容易地识别函数。此外， ES6 正式定义了块级
函数的行为，因此在严格模式下它们不再是语法错误。
在 ES6 中，函数的行为被 [[Call]] 与 [[Construct]] 方法所定义，前者对应普通的函数执
行，后者则对应着使用了 new 的调用。 new.target 元属性也能用于判断函数被调用时是否
使用了 new 。

ES6 函数的最大变化就是增加了箭头函数。箭头函数被设计用于替代匿名函数表达式，它拥
有更简洁的语法、词法级的 `this` 绑定，并且没有 `arguments` 对象。此外，箭头函数不能修
改它们的 `this` 绑定，因此不能被用作构造器。
尾调用优化允许某些函数的调用被优化，以保持更小的调用栈、使用更少的内存，并防止堆
栈溢出。当能进行安全优化时，它会由引擎自动应用。不过你可以考虑重写递归函数，以便
利用这种优化。