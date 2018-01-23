// ES6提供了 includes(), startsWith(), endsWith()识别子字符串
// includes() 方法，若给定文本存在于字符串中，会返回 true ，否则返回 false ；
// startsWith() 方法，若给定文本出现在字符串起始处，返回 true ，否则返回 false ；
// endsWith() 方法，若给定文本出现在字符串结尾处，返回 true ，否则返回 false 。

// 每个方法都接受两个参数：需要搜索的文本，以及可选的搜索起始位置索引。当提供了第二
// 个参数时， includes() 与 startsWith() 方法会从该索引位置开始尝试匹配；而
// endsWith() 方法则会将该位置减去需搜索文本的长度，在计算出的位置尝试匹配。若未提供
// 第二个参数， includes() 与 startsWith() 方法会从字符串起始处开始查找，而
// endsWith() 方法的查找则在尾部进行。第二个参数实际上缩小了搜索的范围。以下是使用这
// 些方法的演示：
var msg = 'Hello world!';

console.log(msg.startsWith("Hello"));       // true
console.log(msg.endsWith("!"));             // true
console.log(msg.includes("o"));             // true

console.log(msg.startsWith("o"));           // false
console.log(msg.endsWith("world!"));        // true
console.log(msg.includes("x"));             // false

console.log(msg.startsWith("o", 4));        // true
console.log(msg.endsWith("o", 8));          // true
console.log(msg.includes("o", 8));          // false

// 虽然这三个方法使得判断子字符串是否存在变得更容易，但它们的返回结果只是布尔值。若
// 你需要找到确切的匹配位置，则需要使用 indexOf() 和 lastIndexOf() 。

// 如果向 startsWith() 、 endsWith() 或 includes() 方法传入了正则表达式而不是字符
// 串，会抛出错误。这与 indexOf() 以及 lastIndexOf() 方法的表现形成了反差，它们会
// 将正则表达式转换为字符串并搜索它。

// ES6 string.repeat 接收一个参数作为字符串的重复次数，返回一个将初始字符串重复指定次数的新字符串
console.log('x'.repeat(3)) // 'xxx'
// 在操纵文本时特别有用，尤其是在需要创建缩进的代码格式化工具中

// indent 使用了一定数量的空格
var indent = " ".repeat(4),
    indentLevel = 0;

// 每当需要增加缩进
var newIndent = indent.repeat(++indentLevel);

// 复制正则表达式
// In ECMAScript 5, you can duplicate regular expressions by passing them into the `RegExp` constructor like this:

var re1 = /ab/i,
    re2 = new RegExp(re1);
var re1 = /ab/i,
// throws an error in ES5, okay in ES6
re2 = new RegExp(re1, "g");

var re1 = /ab/i,

// throws an error in ES5, okay in ES6
re2 = new RegExp(re1, "g");


console.log(re1.toString());            // "/ab/i"
console.log(re2.toString());            // "/ab/g"

console.log(re1.test("ab"));            // true
console.log(re2.test("ab"));            // true

console.log(re1.test("AB"));            // true
console.log(re2.test("AB"));            // false

// flags属性
function getFlags(re) {
  var text = re.toString();
  return text.substring(text.lastIndexOf('/'+1 ,text.length));
}

// toString() 的输出为“ab/g”

var re = /ab/g;

console.log(getFlags(re)); // g

// in ES6 add re.source re.flags
console.log(re.source); // "ab"
console.log(re.flags); // "g"

// 模板字面量
// 对反引号需转义， 对单引号 双引号 无需转义
let message = `\`hello\` world!`;

console.log(message); // "`hello world!`"
console.log(typeof message); // "string"

// 创建多行字符串
let message = `multiline
               string`;
console.log(message); // "Multiline
                      //               string"
