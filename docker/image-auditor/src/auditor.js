/**
 * RES - Labo Docker
 * Nicolas Rod
 * 29.04.2017
 */

// Constant definitions
const MULTICAST_ADDR = "239.255.43.43";
const UDP_PORT = 4242;
const TCP_ADDR = "0.0.0.0";
const TCP_PORT = 2205;
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
    // console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source port:	" +	source.port);

    var payload = JSON.parse(msg);
    var needToBeAdded = true;

    // Adding a property to keep trace of the last time an instrument was heard of.
    payload.lastActive = new Date();

    for (var i = 0; i < activeInstruments.length; i++){
        // If we already have heard of the current instrument, we simply update his time.
        if (activeInstruments[i].uuid === payload.uuid){
            activeInstruments[i].lastActive = payload.lastActive;
            needToBeAdded = false;
            break;
        }
    }
    if (needToBeAdded){
        payload.activeSince = new Date();
        activeInstruments.push(payload);
    }
    deleteInactiveMusicians();
});

function deleteInactiveMusicians(){
    var curTime = new Date();
    for (var i = 0; i < activeInstruments.length; i++){
        var timeSinceActive = curTime - activeInstruments[i].lastActive;
        console.log(activeInstruments[i].instrument_type + " TEMPS :" + timeSinceActive);

        if (timeSinceActive > TIMEOUT) {
            // We cant simply delete an element of an array, we have to SPLICE IT
            // and only keep the part that interest us #ThanksJavascript
            activeInstruments.splice(i, 1);
        }
    }
    var tmp = JSON.stringify(activeInstruments);
    console.log(tmp);
}

//  ============== TCP Server ====================
// Inspired from: https://gist.github.com/tedmiston/5935757
var net = require('net');
console.log("On a créé net.");

var tcpServer = net.createServer(function(socket) {
    console.log("DEMANDE TCP");
    var payload = [];
    for (var i = 0; i < activeInstruments.length; i++){
        var tmp = {
            uuid : activeInstruments[i].uuid,
            instrument : activeInstruments[i].instrument_type,
            activeSince : activeInstruments[i].activeSince
        }
        payload.push(tmp);
    }
    var jsonPayload = JSON.stringify(payload);
	socket.write(jsonPayload);
    socket.write("\r\n");
    socket.end();
});

console.log("On a créé tcpServer");
tcpServer.listen(TCP_PORT, '0.0.0.0');
console.log("On a bind le listen");