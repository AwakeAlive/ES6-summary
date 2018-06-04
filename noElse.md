## 重构条件语句 => 转向switch语句 => 三元操作符 => 用对象代替Switch语句
> 作者：James Sinclair
翻译：晒太阳的鱼
译文：[JavaScript：少一点条件语句
](https://zhuanlan.zhihu.com/p/26633547)
本文简介：本文介绍了几种重构条件语句的方法。“早点返回，经常返回“、“使用三元操作符”、“用对象代替switch语句”
英文原文：[JavaScript，But less iffy](https://jrsinclair.com/articles/2017/javascript-but-less-iffy/#fnref:3)

* 重构条件语句方法避免使用else
```js
function renderMenu(menuData) {
  let menuHTML = '';
  if ((menuData === null) || (!Array.isArray(menuData)) {
    menuHTML = '<div class="menu-error">Most profuse apologies. Our server seems to have failed in it’s duties</div>';
  } else if (menuData.length === 0) {
    menuHTML = '<div class="menu no-notifications">No new notifications</div>';
  } else {
    menuHTML = '<ul class="menu notifications">'
        + menuData.map((item) => `<li><a href="${item.link}">${item.content}</a></li>`).join('')
        + '</ul>';
  }
  return menuHTML;
}
```
> 重构1
```js
function renderMenu(menuData) {
  if ((menuData === null) || (!Array.isArray(menuData)) {
    return '<div class="menu-error">Most profuse apologies. Our server seems to have failed in it’s duties</div>';
  } 
  if (menuData.length === 0) {
    return '<div class="menu no-notifications">No new notifications</div>';
  } 
      
  return '<ul class="menu notifications">'
    + menuData.map((item) => `<li><a href="${item.link}">${item.content}</a></li>`).join('')
    + '</ul>';
}
```
* 早点返回，经常返回
```js
function find(predicate, arr) {
  for (let item of arr) {
    if (predicate(item)) {
        return item;
    }
  }
}
```
* 三元操作符
```js
let foo;
if (bar === 'some value') {
    foo = baz;
}
else {
    foo = bar;
}
```
> 包裹IIFE
```js
let foo = null;
(function() {
  if (bar === 'some value') {
    foo = baz;
  } else {
    foo = qux;
  }
})();
// 改进1
let foo = (function() {
  if (bar === 'some value') {
    return baz;
  } else {
    return qux;
  }
})();
// 代码中，我们的IIFE不知道foo变量的存在。但是它通过作用域链在访问bar，baz和qux变量。让我们先处理baz与qux变量。我们把它们变成函数的入参（注意最后一行）。
// 改进2
let foo = (function(returnForTrue, returnForfalse) {
  if (bar === 'some value') {
    return returnForTrue
  } else {
    return returnForElse
  }
})(baz, qux);
// 最终，我们需要处理一下bar。我们可以把它当做变量处理，但是那样做的话会导致只能处理与一些值的比较。假如我们把整个条件当做一个函数入参处理，函数就能变得更加灵活。
// 改进3
let foo = (function(returnForTrue, returnForfalse, condition) {
  if (condition === 'some value') {
    return returnForTrue
  } else {
    return returnForElse
  }
})(baz, qux, (bar === 'some value'));
// 改进4
function conditional(returnForTrue, returnForfalse, condition) {
  if (condition === 'some value') {
    return returnForTrue
  } else {
    return returnForElse
  }
}

let foo = conditional(bar, qux, (bar === 'some value'))
// 改进5 三元
let foo = (bar === 'some value') ? baz : qux;
```
* 切换switch

Switch语句同时允许定义针对多种情况的单一响应。再次强调，这有点像其他语言中的模式匹配。在某些情况下，这种用法非常方便。所以再说一遍，switch语句并不总是坏的。
```js
let notificationPtrn;
switch(notification.type) {
  case 'citation':
    notificationPtrn = 'You received a citation from {{actingUser}}';
    break;
  case 'follow':
    notificationPtrn = '{{actingUser}} started following your work';
    break;
  case 'mention':
    notificationPtrn = '{{actingUser}} mentioned you in a post.';
    break;
  default:
    // Well, this should never happen
}
// switch语句变的有点惹人厌，那就是太容易忘记写break了。但是如果我们把switch包裹在一个函数内，我们就能使用之前提过的“早点返回，经常返回”的策略。这代表我们可以摆脱break语句的困扰。
// 改进
function getnotificationPtrn(n) {
  switch(n.type) {
    case 'citation':
      return 'You received a citation from {{actingUser}}';
    case 'follow':
      return '{{actingUser}} started following your work';
    case 'mention':
      return = '{{actingUser}} mentioned you in a post.';
    default:
      // Well, this should never happen
  }
}
let notificationPtrn = getnotificationPtrn(notification);
// 改进2 用纯函数来代替修改变量。我们可以使用简单的JavaScript对象实现同样结果
function getnotificationPtrn(n) {
  const textOptions = {
    citation: 'You received a citation from {{actingUser}}',
    follow: '{{actingUser}} started following your work',
    mention: '{{actingUser}} mentioned you in a post.'
  }
  return textOptions[n.type];
}
// 改进3 我们所做的事就是用数据代替一种控制结构。这比我们想象中的更有意义。现在我们能够把textOptions作为getNotification的函数入参。例如:
const textOptions = {
  citation: 'You received a citation from {{actingUser}}',
  follow: '{{actingUser}} started following your work',
  mention: '{{actingUser}} mentioned you in a post.'
}

function getNotificationPtrn(txtOptions, n) {
  return txtOptions[n.type];
}

const notificationPtrn = getNotificationPtrn(txtOptions, notification);
// 但是现在思考一下，textOptions是一个变量。并且该变量不用再被硬编码了。我们可以把它移动到一个JSON配置文件中，或者从服务器获取该变量。现在我们想怎么改textOptions就怎么改。我们可以增加新的选项，或者移除选项。我们也可以把多个地方不同的选项合并到一起。同时这个版本有更少的代码缩进。

// 这个版本我们没有代码处理未知的通知类型。如果用switch语句，我们可以用default实现处理未知的选项。当遭遇未知的类型时，我们可以在default中抛出未知错误，或者返回一段有意义的消息给用户。例如
function getNotificationPtrn(n) {
  switch (n.type) {
    case 'citation':
      return 'You received a citation from {{actingUser}}.';
    case 'follow':
      return '{{actingUser}} started following your work';
    case 'mention':
      return '{{actingUser}} mentioned you in a post.';
    default:
      throw new Error('You’ve received some sort of notification we don’t know about.';
  }
}
// 现在我们能够处理未知的通知类型了。但是我们又再次了使用switch语句。我们能否在POJO的方式中处理类似的情况？
// 一种选项就是使用if语句：
function getNotificationPtrn(txtOptions, n) {
  if (typeof txtOptions[n.type] === 'undefined') {
    return 'You’ve received some sort of notification we don’t know about.';
  }
  return txtOptions[n.type];
}
// 我们要尝试去除我们的if语句。所以这种选项并不理想。幸运的是，我们可以利用JavaScript中的弱类型优势结合布尔逻辑来实现我们的目标。在||运算符中，如果第一部分是假值，JavaScript会直接返回第二部分。如果我们传递了未知的通知类型给对象，对象会返回一个undefined结果。在JavaScript中会将undefined作为假值。所以我们可以像这样利用or表达式：
function getNotificationPtrn(txtOptions, n) {
  return txtOptions[n.type]
    || 'You’ve received some sort of notification we don’t know about.';
}
// 改进
const dflt = 'You’ve received some sort of notification we don’t know about.';
function getNotificationPtrn(defaultTxt, txtOptions, n) {
  return txtOptions[n.type] || defaultTxt;
}
const notificationPtrn = getNotificationPtrn(defaultTxt, txtOptions, notification.type);

// 改进
const dflt = 'You’ve received some sort of notification we don’t know about.';

const textOptions = {
  citation: 'You received a citation from {{actingUser}}.',
  follow:   '{{actingUser}} started following your work',
  mention:  '{{actingUser}} mentioned you in a post.',
}

function optionOrDefault(defaultOption, optionsObject, switchValue) {
  return optionsObject[switchValue] || defaultOption;
}

function getNotificationPtrn(notification) {
  return optionOrDefault(dflt, textOptions, notification.type);
}

```

现在我们有了一个非常清晰的关注点分离（separation of concerns）。文字选项与默认消息现在都是纯数据。它们不在被包含在控制结构中。同时我们有一个便利的函数，optionOrDefault，用于处理类似的情况。数据与选择要显示哪个选项的任务完全分离。

## Summary
重构条件比删除循环需要更多的精力。因为我们以不同的方式使用条件语句，而循环通常配合数组一起使用。但是我们可以应用一些简单的模式来让条件减少交叉。它们包括：“早点返回，经常返回“（return early，return often）、“使用三元操作符”、“用对象代替switch语句”。这些都不是万能银弹，而是打击复杂度的利器。
