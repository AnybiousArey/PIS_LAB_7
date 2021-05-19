const { Socket } = require('dgram');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users = {
    'AndrewIC93': {'nickname': 'Andriy', 'id': 1, 'socketId':null},
    'GlebTr5z12': {'nickname': 'Gleb', 'id': 2, 'socketId':null},
    'Artdoil1982': {'nickname': 'Art', 'id': 3, 'socketId':null},
    'Director123': {'nickname': 'Director', 'id': 4, 'socketId':null}
};


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var saldo = {'previous': '2000 Грн', 'current': '1978 грн'}

io.on('connection', (socket) => {

    socket.on('set nickname', (nickname)=>{
        user = getUserByNick(nickname);
        user.socketId = socket.id;
        socket.emit('User Joined',`You joined as ${user.nickname}`);

        
    });

    socket.on('get-saldo', message => {
        nickname = getUserById(socket.id).nickname;
        socket.emit('chat-message-saldo', `previous saldo is ${saldo.previous}, current saldo is ${saldo.current}`);
     });


    socket.on('chat-send-message', message => {
        nickname = getUserById(socket.id).nickname;
        io.emit('chat-message', {message: message, name: nickname});
     });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

function getUserByNick(nickname) {
    return users[nickname];
}

function getUserById(id) {
    for (var name in users){
        if (users[name].socketId == id){
            return users[name];
        }
    }
   
}
