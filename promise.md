# promise
```js
let promise = new Promise(function (resolve, reject) {
  console.log('Promise');
  resolve();
})

promise.then(function() {
  console.log('resolved')
})

console.log('Hi')
```
上面的代码中，Promise新建后立即执行，所以首先输出的是`Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以`resolved`最后输出。

### Promise 实现异步加载图片
```js
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(image)
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

    image.src = url;
  })
}
```
上面的代码中，使用`Promise`包装了一个图片加载的异步操作。如果加载成功，就调用`resolve`方法，否则就调用`reject`方法。
### Promise对象实现Ajax
```js
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject) {
    const handler = function() {
      if (this.readyAtate !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.promise);
      } else {
        reject(new Error(this.statusText))
      }
    };

    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHandler("Accept", "application/json");
    client.send();

  });

  return promise;
}

getJSON("./posts.json").then(function(json) {
  console.log('Contents: '+json);
}, function(error) {
  console.log('出错了', error)
})
```
上面代码中，`getJSON`是对 `XMLHTTPRequest` 对象的封装，用于发出一个针对`JSON`数据的`HTTP`请求， 并且返回一个 `Promise` 对象。需要注意的是，在`getJSON`内部，`resolve`函数和`reject`函数调用时，都带有函数。

### Promise
```js
const p1 = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2.then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```
