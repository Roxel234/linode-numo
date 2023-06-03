const express = require("express");
const app = express();
const path = require("path");
const SocketIO = require("socket.io");

app.set("port", process.env.PORT || 2020);

app.use(express.static(path.join(__dirname,"public")));

const server = app.listen(2020,"0.0.0.0",function(){
	console.log("Server started");
	console.log("\nEnter in this links:");
	console.log("127.0.0.1:"+app.get("port"));
	console.log("localhost:"+app.get("port"));
	console.log("192.168.2.104:"+app.get("port"));
});

const io = SocketIO(server);

class Card {
	constructor(type){
		this.type = type;
		this.filename = "cards/card"+type+".png";
	}
}

function generateCards(){
	let temp_mazo = []; // ds --> desafio // d2 --> quit 2 cards
	let cardTypes = ["ds","d2","d2","0","2","3","4","5","6","7","8","9","-2","-3","-4","-5","-6","-7","-8","-9","plus","minus","plus","minus"];
	for (let i = 0; i < cardTypes.length; i++) {
		for (let x = 0; x < 4; x++) {
			temp_mazo.push(new Card(cardTypes[i]));
		}
	}
	temp_mazo.push(new Card("1"));
	temp_mazo.push(new Card("1"));
	temp_mazo.push(new Card("-1"));
	temp_mazo.push(new Card("-1"));

	temp_mazo.sort(()=>(Math.random()>.5 ? 1 : -1));

	return temp_mazo;
}

const mazo = generateCards();
console.log(mazo.length);

const rooms = {};

function createRoom(private){
	let room_id = Math.round(Math.random()*8999)+1000;

	rooms["room-"+room_id] = {
		is_private: private,
		available: true,
		players: []
	};

	console.log("Room Created. ID: "+room_id);
	console.log(rooms);

	return room_id;
}

function joinRoom(socket,id) {
	rooms["room-"+id].players.push(socket.id);
	console.log(socket.id,"joined room",id);
	console.log(rooms);
}

function createOrJoinRoom(socket){
	let roomKeys = Object.keys(rooms);

	let room = null;

	for (let i = 0; i < roomKeys.length; i++) {
		if (rooms[roomKeys[i]].players.length < 4) {
			room = parseInt(roomKeys[i].substr(5),10);
			break;
		}
	}

	if (room == null) {
		room = createRoom(false);
	}

	joinRoom(socket,room);

	//joinRoom(socket,createRoom(false));
}

io.on("connection",function(socket){
	console.log("New connection. ID: " + socket.id);

	let myCards = [];

	myCards.push(new Card("="));
	myCards.push(new Card("x"));

	for (let i = 0; i < 5; i++) {
		myCards.push(mazo[0]);
		mazo.splice(0,1);
	}

	createOrJoinRoom(socket);

	socket.emit("cards",myCards);
});