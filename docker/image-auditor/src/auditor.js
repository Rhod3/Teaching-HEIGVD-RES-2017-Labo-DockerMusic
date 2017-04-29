/**
 * RES - Labo Docker
 * Nicolas Rod
 * 29.04.2017
 */

// Constant definitions
const MULTICAST_ADDR = "255.255.255.255";
const UDP_PORT = 4242;
const TCP_ADDR = "127.0.0.1";
const TCP_PORT = 4343;
const TIME_BTW_UPDATE = 1000;
const TIMEOUT = 5000;

// Array containing all the active instruments
var activeInstruments = [];


//  ============== UDP Server ====================
var	dgram = require('dgram');	
	
var	udpSocket =	dgram.createSocket('udp4');

udpSocket.bind(UDP_PORT, function()	{
    console.log("Joining multicast group");
    udpSocket.addMembership(MULTICAST_ADDR);
});	

// Called every time a datagram is received
udpSocket.on('message',	function(msg, source)	{
    console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source port:	" +	source.port);

    var payload = JSON.parse(msg);
    var needToBeAdded = 1;

    // Adding a property to keep trace of the last time an instrument was heard of.
    payload.lastActive = new Date();

    for (var i = 0; i < activeInstruments; i++){
        // If we already have heard of the current instrument, we simply update his time.
        if (musicians[i].uuid === payload.uuid){
            musicians[i].lastActive = payload.lastActive;
            needToBeAdded = 0;
            break;
        }
    }
    if (needToBeAdded === 1){
        activeInstruments.push(payload);
    }
});

function deleteInactiveMusicians(){
    var curTime = new Date();
    for (var i = 0; i < activeInstruments.length; i++){
        var timeSinceActive = activeInstruments[i].lastActive - curTime;

        if (timeSinceActive > TIMEOUT) {
            // We cant simply delete an element of an array, we have to SPLICE IT
            // and only keep the part that interest us #ThanksJavascript
            activeInstruments.splice(i, 1);
        }
    }
}
setInterval(deleteInactiveMusicians, TIME_BTW_UPDATE);



//  ============== TCP Server ====================
// Inspired from: https://gist.github.com/tedmiston/5935757
var net = require('net');
var tcpServer = net.createServer(function(socket) {
    var payload = JSON.stringify(activeInstruments);
	socket.end(payload);
});

tcpServer.listen(TCP_PORT, TCP_ADDR);