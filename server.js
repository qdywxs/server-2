// ❗️以下代码请按序号阅读!
// server.js

var http = require("http"); // 前面说了，创建 http 服务器的底层内置模块。
var path = require("path"); // 该模块可以处理不同操作系统下的 url（不同操作系统路径写法不一）。
var fs = require("fs");     // 该模块用于读、写文件。

var url = require("url");
/*
该模块自动解析 url，读取信息，相当于我们直接使用一个 location。
即：把 URL 进行解析，然后得到这些数据。url 模块可把 URL 作为参数，然后进行解析得到一个对象，
然后我们就可以使用某些部分了，而不用我们自己再使用正则进行提取。
 */

// 3️⃣接着，通过下面 2 行代码运行测试：
function staticRoot(staticPath, req, res) {
  console.log(staticPath);


  /*
  4️⃣继而，控制台随即得到项目文件的相关文件信息，通过绝对路径能读取文件。
  获取路径之后进行操作，需要通过用户的 url 给用户返回一些特定内容。
  发出请求得到返回的是 console.log(req.url)，req.url 所返回的均是项目文件中的相关文件，
  即请求的均是这些文件：index.html、index.css、logo.png。

  请求得到之后进行解析，如何解析？
  如下 2 行代码：
   */
  var pathObj = new URL(`${req.url}`, "http://localhost:8080");
  console.log(pathObj);


  /*
  5️⃣然后，以下 3 行代码实现一个默认页面，设置一个“默认路径”：localhost:8080/index.html。
  ❗️即，我们这样设置了过后，当用户直接在浏览器地址栏输入：
  localhost:8080 时，其默认就会去读
  localhost:8080/index.html。
   */
  if(pathObj.pathname === "/") {
    pathObj.pathname += "index.html";
  }


  var filePath = path.join(staticPath, pathObj.pathname);

  /*
  读取文件的方式：同步（❌）
  var fileContent = fs.readFileSync(filePath, "binary")
  res.write(fileContent, "binary")
  res.end()
   */


  // 读取文件的方式：异步（也可以当做制作 404 的页面状态）。
  // binary 表示用二进制的方式去读取。
  fs.readFile(filePath, "binary", function(err, fileContent) {
    if(err) {
      console.log("404");
      res.writeHead(404, "not found");

      res.end("<h1>404 Not Found</h1>");
      /*
      ❗️上一行代码相当于：
      res.write("<h1>404 Not Found</h1>");
      res.end();
       */

    }else {
      console.log("ok");
      res.writeHead(200, "OK");
      res.write(fileContent, "binary");
      res.end();
    }
  });

}



console.log(path.join(__dirname, "static"));

/*
1️⃣首先，通过 http.creatServer 创建一个 server，
listen 去启动一个服务器，监听 8080 端口，请求到来之后，
进入 server 这个函数里，处理这个请求。
 */
var server = http.createServer(function(req, res) {
  staticRoot(path.join(__dirname, "static"), req, res); /*
                              2️⃣其次，写一个函数 staticRoot() 作为静态文件路径，
                              将“路径名”、req、res 都传递进去，如：

                              staticRoot(path.join(__dirname, "static"), req, res);

                              2️⃣-①：__dirname 是 Node.js 的内置变量，代表当前的文件夹，
                              我这里是 /Users/oli-zhao/Desktop/server-2；
                              2️⃣-②：static 是我们上边放置 html、css、js、imgs 等文件的
                              static 文件夹。

                              ❗️那么，path.join(__dirname, "static") 则会生成一个
                              “绝对路径”：/Users/oli-zhao/Desktop/server-2/static。
                                                         */
                              /*
                              ❗️❗️❗️这样写的原因：
                              ①：代码存放文件的位置可能会发生变动，如上写法将不用再担心这个问题；
                              ②：在不同系统（Mac、Windows、Linux）都可以用。
                               */
});


server.listen(8080);
console.log("visit http://localhost:8080");