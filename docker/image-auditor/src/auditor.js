var protocol = require('./protocol');
var dgram = require('dgram');
var net = require('net');

var socket = dgram.createSocket('udp4');

var musicians = [];

socket.bind(protocol.PROTOCOL_PORT, function () {
    console.log("Joining multicast group");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

socket.on('message', function (msg, source) {
    var sound = JSON.parse(msg);
    console.log("New message : " + sound.uuid + " from : " + source.port);
    for(var i = 0; i < musicians.length; i++) {
        if(musicians[i].uuid == sound.uuid) {
            musicians[i].lastHeard = new Date();
            return;
        }
    }
    //if not found
    sound.lastHeard = new Date();
    musicians.push(sound);
});

//TCP
var tcp = net.createServer();
tcp.listen(protocol.PROTOCOL_PORT);
console.log("TCP listening port : " + protocol.PROTOCOL_PORT);

tcp.on('connection', function (socket) {
    //update musicians list
    for(var i = 0; i < musicians.length; i++) {
        if (new Date - musicians[i].lastHeard > 5000) {
            musicians.splice(i, 1);
        }
    }

    socket.write(JSON.stringify(musicians) + "\n");
    socket.destroy();
});