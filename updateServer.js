var net = require('net');
var fs = require('fs');

var timeout = 20000;//��ʱ
var listenPort = 12008;//�����˿�
var ver = 'Beta2.5';
var verInfo = '1���޸�����bug;2���Ľ������ȶ���;3��add update module';
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
  // ���ǻ��һ������ - �������Զ�����һ��socket����
  console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort);
  socket.setEncoding('binary');

  //��ʱ�¼�
//  socket.setTimeout(timeout,function(){
//      console.log('���ӳ�ʱ');
//      socket.end();
//  });

  //���յ�����
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

  //���ݴ����¼�
  socket.on('error',function(exception) {
      console.log('socket error:' + exception);
      socket.end();
  });
  //�ͻ��˹ر��¼�
  socket.on('close',function(data) {
      console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort);
  });
}).listen(listenPort);

//�����������¼�
server.on('listening',function() {
  console.log("server listening:" + server.address().port);
});

//�����������¼�
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