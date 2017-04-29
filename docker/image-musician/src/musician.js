/**
 * RES - Labo Docker
 * Nicolas Rod
 * 29.04.2017
 */

// Déclaration des constantes
const TIME_BTW_UPDATE = 1000;
const IP = "255.255.255.255";
const PORT = 4242;

const INSTRUMENTS_SOUNDS = {
	piano: "ti-ta-ti",
	trumpet: "pouet",
	flute: "trulu",
	violin: "gzi-gzi",
	drum: "boum-boum"
};

// Construction de l'id unique
var uuid = require("uuid");

// Construction du socket
var dgram = require("dgram");
var socket = dgram.createSocket("udp4");

// Récupération de l'id passé en paramètre
var instrument_arg = process.argv[2];

// Construction du payload à broadcast
var payload = {
    uuid: uuid.v4(),
    instrument_type: instrument_arg,
    sound: INSTRUMENTS_SOUNDS[instrument_arg]
}

// Fonction broadcastant le payload
function broadcastSound() {
    var json = JSON.stringify(payload);
    console.log("Broadcasting sound...");
    socket.send(json, PORT, IP);
}

// Broadcast toutes les secondes
setInterval(broadcastSound, TIME_BTW_UPDATE);