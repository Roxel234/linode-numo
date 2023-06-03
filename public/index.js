const socket = io();

socket.on("cards",(data)=>{
	myCards=data;
	console.log(data);
});

var myCards = [];

const imageCache = {};

function loadImage(url){
	if (imageCache[url]) {
		return imageCache[url];
	} else {
		let img = new Image();
		img.src = url;
		imageCache[url] = img;
		return img;
	}
}

const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "blue";
ctx.fillRect(0,0,canvas.width,canvas.height);

setInterval(function(){
	for (var i = 0; i < myCards.length; i++) {
		ctx.drawImage(loadImage(myCards[i].filename),i*150,0);
	}
},100/6);