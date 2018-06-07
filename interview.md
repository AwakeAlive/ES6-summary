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
## 事件委托
事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。

**问题**
比如我们有100个li，每个li都有相同的click点击事件，可能我们会用for循环的方法，来遍历所有的li，然后给它们添加事件，那这么做会存在什么影响呢？

**好处：**
减少DOM操作，将所有的DOM操作放到js程序里面，与dom操作的就只需要交互一次，这样就能大大减少与dom的交互次数，提高性能。


每个函数都是一个对象，是对象就会占用内存，对象越多，内存占用率就越大，自然性能就越差了（内存不够用，是硬伤，哈哈），比如上面的100个li，就要占用100个内存空间，如果是1000个，10000个呢，那只能说呵呵了，如果用事件委托，那么我们就可以只对它的父级（如果只有一个父级）这一个对象进行操作，这样我们就需要一个内存空间就够了，是不是省了很多，自然性能就会更好。

**事件委托原理**
事件委托是利用事件的冒泡原理来实现的，事件冒泡：事件从最深的节点开始，然后逐步向上传播事件，举个例子： 页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div，有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul，li，a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件。

## 缓存
请求资源的副本
优点：
1. 缓解服务器压力（不用每次去请求资源）
2. 提升性能
3. 减少带宽消耗

缓存： 
宏观上分为 私有缓存（用户专享的，各级代理不能缓存的缓存）+ 共享缓存（各级代理缓存的缓存）

微观上分为 1. 浏览器缓存 2. 代理服务器缓存 3. 网管缓存 4. 数据库缓存

1. 浏览器缓存： 
缓存存在的意义就是当用户点击back按钮或是再次去访问某个页面的时候能够更快的响应。尤其是在多页应用的网站中，如果你在多个页面使用了一张相同的图片，那么缓存这张图片就变得特别的有用。

2. 代理服务器缓存：
规模要大得多，因为是为成千上万的用户提供缓存机制，大公司和大型的ISP提供商通常会将它们设立在防火墙上或是作为一个独立的设备来运营。(下文如果没有特殊说明,所有提到的缓存服务器都是指代理服务器。)
由于缓存服务器不是客户端或是源服务器的一部分，它们存在于网络中，请求路由必须经过它们才会生效，所以实际上你可以去手动设置浏览器的代理，或是通过一个中间服务器来进行转发，这样用户自然就察觉不到代理服务器的存在了。
代理服务器缓存就是一个共享缓存，不只为一个用户服务，经常为大量用户使用，因此在减少相应时间和带宽使用方面很有效：因为同一个缓存可能会被重用多次。

3. 网关缓存
也叫代理缓存或反向代理缓存。网关也是一个中间服务器，网关缓存一般是网站管理员自己部署，从让网站拥有更好的性能
CDNS(网络内容分发商)分布网关缓存到整个（或部分）互联网上，并出售缓存服务给需要的网站，比如国内的七牛云、又拍云都有这种服务。

4. 数据库缓存
数据库缓存是指当我们的应用极其复杂，表自然也很繁杂，我们必须进行频繁的进行数据库查询，这样可能导致数据库不堪重负，一个好的办法就是将查询后的数据放到内存中，下一次查询直接从内存中取就好了。

### 浏览器的缓存策略
#### 缓存的目标
* 一个检索请求的成功响应： 对于GET请求，响应状态码：200，则表示成功。一个包含例如HTML文档，图片，或者文件的响应；
* 不变的重定向： 响应的状态码301
* 可用缓存响应：响应的状态码：304，Chrome会缓存304中的缓存设置，Firefox
* 错误响应： 响应状态码： 404 的一个页面
* 不完全的响应： 响应状态码 206， 只返回局部的信息
* 除了GET请求外，如果匹配到作为一个已被定义的cache键名的响应。

**浏览器对于缓存的处理是根据第一次请求资源时返回的响应头来确定的。**

```js
Age:23146
Cache-Control:max-age=2592000
Date:Tue, 28 Nov 2017 12:26:41 GMT
ETag:W/"5a1cf09a-63c6"
Expires:Thu, 28 Dec 2017 05:27:45 GMT
Last-Modified:Tue, 28 Nov 2017 05:14:02 GMT
Vary:Accept-Encoding
```
#### 强缓存阶段
以上请求头来自百度首页某个CSS文件的响应头。我去除了一些和缓存无关的字段，只保留了以上部分。我们来分析下，**Expires**是HTTP/1.0中的定义缓存的字段，它规定了缓存过期的一个绝对时间。**Cache-Control:max-age=2592000**是HTTP/1.1定义的关于缓存的字段，它规定了缓存过期的一个相对时间。优先级上当然是版本高的优先了，**max-age > Expires**。

这就是**强缓存阶段**，当浏览器再次试图访问这个CSS文件，发现有这个文件的缓存，那么就判断根据上一次的响应判断是否过期，如果没过期，使用缓存。加载文件，OVER
Firefox浏览器表现为一个灰色的200状态码。
Chrome浏览器状态码表现为:
> 200 (from disk cache)或是200 OK (from memory cache)
**多说一点**
关于缓存是从磁盘中获取还是从内存中获取，查找了很多资料，得出了一个较为可信的结论：Chrome会根据本地内存的使用率来决定缓存存放在哪，如果内存使用率很高，放在磁盘里面，内存的使用率很高会暂时放在内存里面。这就可以比较合理的解释了为什么同一个资源有时是from memory cache有时是from disk cache的问题了。
那么当这个CSS文件过期了怎么办?ETag和Last-Modified就该闪亮登场了。
先说Last-Modified，这个字段是文件最后一次修改的时间；
ETag呢？ETag是对文件的一个标记，嗯，可以这么说，具体生成方式HTTP并没有给出一个明确的方式，所以理论上只要不会重复生成方式无所谓，比如对资源内容使用抗碰撞散列函数，使用最近修改的时间戳的哈希值，甚至只是一个版本号。
#### 协商缓存
利用这两个字段浏览器可以进入协商缓存阶段，当浏览器再次试图访问这个CSS文件，发现缓存过期，于是会在本次请求的请求头里携带`If-Moified-Since`和`If-None-Match`这两个字段，服务器通过这两个字段来判断资源是否有修改，如果有修改则返回状态码200和新的内容，如果没有修改返回状态码304，浏览器收到200状态码，该咋处理就咋处理(相当于首次访问这个文件了)，发现返回304，于是知道了本地缓存虽然过期但仍然可以用，于是加载本地缓存。然后根据新的返回的响应头来设置缓存。(这一步有所差异，发现不同浏览器的处理是不同的，chrome会为304设置缓存，firefox则不会)😑
具体两个字段携带的内容如下(分别和上面的`Last-Modified`、`ETag`携带的值对应)：
```js
If-Modified-Since: Tue, 28 Nov 2017 05:14:02 GMT
If-None-Match: W/"5a1cf09a-63c6"
```
#### 启发式缓存阶段
我们把上面的响应头改下：
```js
Age:23146
Cache-Control: public
Date:Tue, 28 Nov 2017 12:26:41 GMT
Last-Modified:Tue, 28 Nov 2017 05:14:02 GMT
Vary:Accept-Encoding
```
浏览器用来确定缓存过期时间的字段一个都没有！
那该怎么办？有人可能会说下次请求直接进入协商缓存阶段，携带If-Moified-Since呗，不是的，浏览器还有个启发式缓存阶段
**根据响应头中2个时间字段 Date 和 Last-Modified 之间的时间差值，取其值的10%作为缓存时间周期。**
这就是启发式缓存阶段。这个阶段很容让人忽视，但实际上每时每刻都在发挥着作用。所以在今后的开发过程中如果遇到那种默认缓存的坑，不要叫嚣，不要生气，浏览器只是在遵循启发式缓存协议而已。
![缓存策略过程](https://user-gold-cdn.xitu.io/2018/1/27/16137f262e0adf18?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

👌对于缓存策略介绍到这，接下来再细细分析不同的HTTP首部字段的内容，以及它们之间的关系。

### HTTP中和缓存相关的首部字段
HTTP报文：
1. 首部（header）：包含了很多字段，比如: cookie,缓存， 报文大小， 报文格式等等
2. 主体（body）: HTTP请求真正需要

???




## 回调函数
[addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
### EventTarget.addEventListener()
> target.addEventListener(type, listener, options);
> target.addEventListener(type, listener ,{capture: Boolean, passive: Boolean, once: Boolean});
> target.addEventListener(type, listener, useCapture);
> target.addEventListener(type, listener[, useCapture, wantsUntrusted  ]); 
#### options支持的安全监测
```js
var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function() {
      passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch(err) {}
```
这段代码为 passive 属性创建了一个带有getter函数的 options 对象；getter设定了一个标识， passiveSupported，被调用后就会把其设为true。那意味着如果浏览器检查 options 对象上的 passive 值时， passiveSupported 将会被设置为 true；否则它将保持 false。然后我们调用 addEventListener() 去设置一个指定这些选项的空事件处理器，这样如果浏览器将第三个参数认定为对象的话，这些选项值就会被检查。

eg. 添加一个简单的侦听器
```html
<table id="outside">    
    <tr><td id="t1">one</td></tr>
    <tr><td id="t2">two</td></tr>
</table>
```
```js
// 1 不带任何参数的函数
function modifyText() {                   // 改变t2的函数
  var t2 = document.getElementById("t2");
  if (t2.firstChild.nodeValue == "three") {
    t2.firstChild.nodeValue = "two";
  } else {
    t2.firstChild.nodeValue = "three";
  }
}

// 为table添加事件监听器
var el = document.getElementById("outside");
el.addEventListener("click", modifyText, false);
```
```js
// 2 带匿名函数的事件监听器
// 改变t2值的函数
function modifyText(new_text) {
  var t2 = document.getElementById("t2");
  t2.firstChild.nodeValue = new_text;    
}
 
// 为table对象添加事件监听器
var el = document.getElementById("outside");
el.addEventListener("click", function(){modifyText("four")}, false);
```
```js
// 3 带有箭头函数的监听器
// Function to change the content of t2
function modifyText(new_text) {
  var t2 = document.getElementById("t2");
  t2.firstChild.nodeValue = new_text;    
}
 
// Add event listener to table with an arrow function
var el = document.getElementById("outside");
el.addEventListener("click", () => { modifyText("four"); }, false);
```