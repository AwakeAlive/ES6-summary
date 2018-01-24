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