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
查找属性首先在自身对象属性上查找，找不到的话，一级一级在原型链上向上查找，直到原型链末端。
但是赋值的话，例如`obj.z = 5;`,首先obj.z有没有，如果有则覆盖，没有直接添加。而且obj.z不影响原型链上的obj.prototype.z的值
```js
obj.z = undefined;
console.log(obj.z); // undefined
// 如果想拿到obj.z = 3, 只需delete obj.z; // true 删除成功
delete obj.z; // 同样delete obj.z 之后删除对象上的属性和方法，不影响原型链上的属性和方法
obj.z; // 3
```
### 原型链的继承

通过原型链可以继承属性和方法，（原型链向上查找），但反过来不会通过delete或添加影响原型链上的属性和方法。

## 对象的创建Object.create

Object.create 系统内置的一个函数会接收一个参数，一般是一个对象，它会返回一个新创建的对象，并且这个对象的原型指向这个参数。

```js
var obj = Object.create({x: 1})
obj.x; // 1
```
用字面量创建的对象也有原型，他的原型指向Object.protoype
```js
typeof obj.toString // 'function'
obj.hasOwnProperty('x'); // false
```

obj =>  { x: 1 } => Object.prototype => null

注意：并不是所有的对象都有toString方法，并不是所有的对象原型链上都有Object.prototype
```js
var obj = Object.create(null);
obj.toString; // undefined
```
`obj`的原型直接是`null` 
注意obj.__proto__ === undefined; (chrome64)
obj => null
## 对象属性操作
1. 读写属性
2. 属性异常
3. 删除属性
4. 检测属性
5. 枚举属性

属性读写 `obj.x` or `obj['x']`
`for...in` 遍历属性，可能会遍历原型链上的属性，而且顺序不固定

### 属性删除
delete 删除全局变量或局部变量，会返回false，不能delete掉
```js
var global = 1;
delete global; // false

(function () {
  var localVal = 1;
  return delete localVal; // false
})()

function fd() {};
delete fd; // false

(function() {
  function fd() {};
  return delete fd; // false
})()
```
但是1. 通过eval({ x: 1 })和隐式创建的全局变量可以被删除

```js
ohNO = 1;
window.ohNO; // 1
delete ohNO; // true
```

如果属性不存在，delete 属性,仍会返回true
```js
var person = {
  age: 28;
}

delete person.age; // true
person.age; // undefined
delete person.age; // true 表示对象不存在该属性，
delete person.year; // true
```
但是对象上的属性有的无法删除例如Object.prototype
```js
delete Object.prototype; // false
```

## 属性检测

```js
var cat = new Object; // cat 的原型指向Object.prototype 而Object.prototype.toString存在该属性

cat.legs = 4;
cat.name = 'Kitty';

'legs' in cat; // true
'abc' in cat; // false
'toString' in cat; // true inherited property

cat.hasOwnProperty('legs'); // true;
cat.hasOwnProperty('toString'); // false

// 对象属性是否可以枚举
cat.propertyIsEnumerable('legs'); // true
cat.propertyIsEnumerable('toString'); // false
// console.log 打印一般显示对象的直接属性，原型链上的属性enumerable枚举标签为false不显示
```
但是可以修改对象的枚举标签为false
```js
Object.defineProperty(cat, 'price', {enumerable: false, value: 1000})
```

自己用对象字面量和new Object或赋值创造出来的对象属性是可以枚举的
```js
cat.propertyIsEnumerable('price'); // false
cat.hasOwnProperty('price'); // true
```
注意： `cat.legs != undefined` 类似 `!== null` or `!== undefined`

```js
var o = {x: 1, y: 2, z: 3}
'toString' in o; // true
o.propertyIsEnumerable('toString'); // false
var key;
for(key in o) {
  console.log(key); // x, y, z
}
```

```js
var obj = Object.create(0);
obj.a = 4;
var key;
for(key in obj) {
  console.log(key); // a, x, y, z
}
```

```js
var obj = Object.create(o);
obj.a = 4;
var key;
for(key in obj) {
  // 想处理只是对象上的属性，可以过滤
  if (obj.hasOwnProperty(key)) {
    console.log(key); // a
  }
}
```

## 另一种读写属性的方式 getter setter
```js
var man = {
  name: 'Bosn',
  weibo: '@Bosn',
  get age() {
    return new Date().getFullYear() - 1988;
  },
  set age(val) {
    console.log('Age can't be set to '+ val);
  }
}

console.log(man.age);
man.age = 100; //  Age can't be set to 100
console.log(man.name); // Bosn
```

```js
var man = {
    weibo : '@Bosn',
    $age : null,
    get age() {
        if (this.$age == undefined) { // undefined or null
            return new Date().getFullYear() - 1988;
        } else {
            return this.$age;
        }
    },
    set age(val) {
        val = +val; // 变成数字
        if (!isNaN(val) && val > 0 && val < 150) {
            this.$age = +val;
        } else {
            throw new Error('Incorrect val = ' + val);
        }
    }
}

console.log(man.age); // 27
man.age = 100;
console.log(man.age); // 100;
man.age = 'abc'; // error:Incorrect val = NaN
```

## get set 与原型链
```js
function foo() {};

Object.defineProperty(foo.prototype, 'z', {get: function() {return 1;}});

var obj = new foo();

obj.z; // 1
obj.z = 10;
// obj没有z这个属性，并且在原型链上查找，发现有对应的get方法或set方法，当尝试赋值的时候会走原型链上的set or get 方法，不会直接在当前对象上添加属性方式
obj.z; // still 1
obj.__proto__.z; // still 1
```
// 注意想在obj.z添加属性
```js
Object.defineProperty(obj, 'z', {value: 100, configurable: true});
obj.z; // 100
delete obj.z; // configurable: true删除成功
obj.z; // back to 1
```

```js
var o = {};
Object.defineProperty(o, 'x', {value:  1}); // 默认writable= false; configurable=false
var obj = Object.create(o);
obj.x; // 1
obj.x = 200;
obj.x; //1 因为原型链上有这属性，但是configurable为false， still 1 can't change it

Object.defineProperty(obj, 'x', {writable: true, configurable: true, value: 200}); // 直接配置实例对象obj的writable为true， configurable为true
obj.x; // 200;
obj.x = 500;
obj.x; // 500
```

## 属性标签
属性级的权限配置
```js
Object.getOwnPropertyDescriptor({pro: true}, 'pro');
// 接收两参数， 第一个参数为对象， 第二个参数是属性名， 整个方法能获取当前属性下的标签
// Object {value: true, writable: true, enumerable: true, configurable: true}

Object.getOwnPropertyDescriptor({pro: true}, 'a'); // 没有这个属性， 返回undefined

var person = {}; 
Object.defineProperty(person, 'name', {
  configurable: false, // 属性标签是否可以再次修改，配置， 是否可删除
  writable: false,  // 属性是否可修改，是否可写
  enumerable: true, // 是否可以遍历枚举， 影响for...in 是否出现
  value: 'Bosn Ma'
})

person.name; // Bosn Ma
person.name = 1;
person.name; // Still Bosn Ma
delete person.name; // false 因为configurable为false
```
```js
Object.defineProperty(person, 'type', {
  configurable: true,
  writable: true,
  enumerable: false,
  value: 'Object'
});

Object.keys(person); // ["name"] 获取对象上的属性
```
```js
Object.defineProperties(person, {
  title: {value: 'fe', enumerable: true},
  corp: {value: 'BABA', enumerable: true},
  salary: {value: 50000, enumerable: true, writable: true}
});

Object.getOwnPropertyDescriptor(person, 'salary');
// Object{value: 50000, writable: true, enumerable: true, configurable: false}
Object.getOwnPropertyDescriptor(person, 'corp');
// Object{value: 'BABA', writable: false, enumerable: true, configurable: false}
```

```js
Object.defineProperties(person, {
  title: {value: 'fe', enumerable: true},
  corp: {value: 'BABA', enumerable: true},
  salary: {value: 50000, enumerable: true, writable: true},
  luck: {
    get: function() {
      return Math.random() > 0.5 ? 'good' : 'bad';
    }
  },
  promote: {
    set: function() {
      this.salary *= 1 + level * 0.1
    }
  }
});

Object.getOwnPropertyDescriptor(person, 'salary');
// Object {value: 50000, writable: true, enumerable: true, configurable: false}
Object.getOwnPropertyDescriptor(person, 'corp');
// Object {value: "BABA", writable: false, enumerable: true, configurable: false}
person.salary; // 50000
person.promote = 2;
person.salary; //60000
```
![object_property_tag](/images/object_property_tag.png)

## 对象标签
[[proto]] [[class]] [[extensible]] 
原型标签[[__proto__]]


## class标签
```js
var toString = Objct.prototype.toString;
function getType(o) {
  return toString.call(o).slice(8, -1);
}

toString.call(null); // '[object Null]';
getType(null); // 'Null'
getType(undefined); // 'Undefined'
getType(1); // 'Number'
getType(new Number(1)); // 'Number' 参数变对象
typeof new Number(1); // 'object'
getType(true); // 'Boolean'
getType(new Boolean(true)); // 'Boolean'
```

## extensible 对象是否可扩展
```js
var obj = {
  x: 1,
  y: 2
}
Object.isExtensible(obj); // true
Object.preventExtensions(obj); // 阻止对象添加新的属性，但不影响原来属性标签
Object.isExtensible(obj); // false
obj.z=1;
obj.z; // undefined
Object.getOwnPropertyDescriptor(obj, 'x');
// Object {value: 1, writable: true, enumerable: true, configurable: true}

Object.seal(obj); // configurable 变false
Object.getOwnPropertyDescriptor(obj, 'x');
// Object {value: 1, writable: true, enumerable: true, configurable: false}

Object.isSealed(obj); // true 是否被隐藏
Object.freeze(obj); // 对象冻结,只针对对象属性，不针对对象原型链上
Object.getOwnPropertyDescriptor(obj, 'x');
// Object {value: 1, writable: false, enumerable: true, configurable: false}
Object.isFrozen(obj); // true

// [caution] not affects prototype chain!!!
```

## 序列化，其他对象方法
```js
var obj = {x : 1, y : true, z : [1, 2, 3], nullVal : null}; // 对象序列下
JSON.stringify(obj); // "{"x":1,"y":true,"z":[1,2,3],"nullVal":null}"

obj = {val : undefined, a : NaN, b : Infinity, c : new Date()}; };
 // 对象序列下，
//1 对象属性值为undefined，整个属性值不会出现在stringfy里面
//2 对象属性值为NaN或Infinity会转null, Date => UTC 格式

JSON.stringify(obj); // "{"a":null,"b":null,"c":"2015-01-20T14:15:43.910Z"}"

obj = JSON.parse('{"x" : 1}');  // 注意引号
obj.x; // 1
```

## 序列化自定义
```js
var obj = {
    x : 1,
    y : 2,
    o : {
        o1 : 1,
        o2 : 2,
        toJSON : function () {
            return this.o1 + this.o2;
        } // this指向这个o
    }
};
JSON.stringify(obj); // "{"x":1,"y":2,"o":3}"
```


## 其他对象方法
```js
var obj = {x : 1, y : 2};
obj.toString(); // "[object Object]"
obj.toString = function() {return this.x + this.y}; // 自定义toString
"Result " + obj; // "Result 3", by toString

+obj; // 3, from toString

obj.valueOf = function() {return this.x + this.y + 100;}; 
// 对象转基本类型 自定义valueOf
+obj; // 103, from valueOf

valueOf ,toString 都是将对象转基本类型，默认以valueOf为主，
如果valueOf返回值不是基本类型，那么以toString为主，
如果toString返回值也不是基本类型，那么会报错

"Result " + obj; // still "Result 103"
```