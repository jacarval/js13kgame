var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res){
  

  res.sendFile(__dirname + '/build/index.html');
  console.log(req.headers['user-agent']);


});

app.get('/mobile', function(req, res){
  

  res.sendFile(__dirname + '/build/mobile.html');
  console.log(req.headers['user-agent']);


});

io.on('connection', function(socket){

	socket.on('phone-create:paddle', function(){
		console.log('create padle');
		socket.broadcast.emit('create:paddle', socket.id);
	});

	socket.on('phone-orientation-event', function(event){
		socket.broadcast.emit('orientation-event', event, socket.id);
	});

	// socket.on('motion-event', function(event){
	// 	socket.broadcast.emit('motion-event', event, );
	// 	// console.log(event);
	// });

	socket.on('phone-touch-event', function(event) {
		socket.broadcast.emit('touch-event', event, socket.id);
	});

});


http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});