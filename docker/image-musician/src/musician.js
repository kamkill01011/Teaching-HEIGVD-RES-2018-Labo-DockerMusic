var protocol = require('./protocol');
var uuid = require('uuid');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

var instrument = process.argv[2];
// need to test if has arg and if it is correct

const SOUNDS = {
    piano:   "ti-ta-ti",
    trumpet: "pouet",
    flute:   "trulu",
    violin:  "gzi-gzi",
    drum:    "boum-boum"
}

var sound = {
    uuid: uuid(),
    sound: SOUNDS[instrument]
}

setInterval(sendSound, 1000);

function sendSound() {
    var payload = JSON.stringify(sound);
    console.log(instrument + " send : " + payload);
    socket.send(payload, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
        console.log("Sending payload: " + payload + " via port " + socket.address().port);
    });
}