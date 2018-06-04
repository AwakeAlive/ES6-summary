1. js查询一个字符串内出现次数最多的字母

字符串 str = "ahasdaskdasdasjdnas";
问题：将此字符串出现次数最多的字母打印出来；

思路：申请一个json对象，遍历字符串将字符串的字母作为属性添加到json对象上，字母出现的次数做属性值；

遍历对象属性，将属性值最大的打印即可 charAt()
charAt() 方法从一个字符串中返回指定的字符。
```js
var json = {};
for( var j = 0; j < str.length; j++) {
  if (!json[charAt(j)]) {
    json[str.charAt(j)] = 1;
  } else {
    json[str.charAt(j)]++;
  }
}
// 用一个for循环进所有的字符串元素放在一个json对象中当住属性，对象的属性值就是出现的个数
console.log(json)
var iMax = 0;
var iIndex = '';
for (var i in json) {
  // for in 遍历该对象，并依次比较属性值最大的值并输出该属性即可
  if (json[i] > iMax) {
    iMax = json[i];
    iIndex = i;
  }
}

document.write('出现次数最多的是'+iIndex+'出现了'+iMax+'次');
```