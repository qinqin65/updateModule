var net = require('net');
var fs = require('fs');

var timeout = 20000;//超时
var listenPort = 12008;//监听端口
var ver = 'Beta2.5';
var verInfo = '1、修复基本bug;2、改进程序稳定性;3、add update module';
//var updLis = '../binVerify.jar;../config.cfg;update.py';
var updLis = '../binVerify.jar;../config.cfg';

fs.readFile('binVerify.jar', function (err, fContent) {
  if (err) {
    throw err; 
  }
  fbinVerify = fContent;
});

fs.readFile('config.cfg', function (err, fContent) {
  if (err) {
    throw err; 
  }
  fconfig = fContent;
});

/*fs.readFile('update.py', function (err, fContent) {
  if (err) {
    throw err; 
  }
  fupdate = fContent;
});*/

var server = net.createServer(function(socket) {
  // 我们获得一个连接 - 该连接自动关联一个socket对象
  console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.setEncoding('binary');

  //超时事件
//  socket.setTimeout(timeout,function(){
//      console.log('连接超时');
//      socket.end();
//  });

  //接收到数据
  socket.on('data',function(data) {
      console.log('recv:' + data);
	  if('getVer'===data) {
	    socket.write(ver);
	  }
	  else if('getVerInfo'===data) {
	    socket.write(verInfo);
	  }
	  else if('getUpdLis'===data) {
	    socket.write(updLis);
	  }
	  else if('get:binVerify.jar'===data) {
	    sendFile(fbinVerify,socket);
	  }
	  else if('get:config.cfg'===data) {
	    sendFile(fconfig,socket);
	  }
	  /*else if('get:update.py'===data) {
	    sendFile(fupdate,socket);
	  }*/
  });

  //数据错误事件
  socket.on('error',function(exception) {
      console.log('socket error:' + exception);
      socket.end();
  });
  //客户端关闭事件
  socket.on('close',function(data) {
      console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort);
  });
}).listen(listenPort);

//服务器监听事件
server.on('listening',function() {
  console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception) {
  console.log("server error:" + exception);
}); 

function sendFile(file,sock) {
  if(file!=null) {
    sock.write(Math.ceil(file.length/1024)+'');
    for(var i=0,j=0;i<Math.ceil(file.length/1024);i++,j+=1024) {
      sock.write(file.slice(j,j+1024));
	}
  }
}