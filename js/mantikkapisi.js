var mantikKapisi = mantikKapisi || {};
mantikKapisi.mantiksalKapi = mantikKapisi.mantiksalKapi || {};
mantikKapisi.mantiksalKapi.port = mantikKapisi.mantiksalKapi.port || {};
mantikKapisi.mantiksalKapi.kapi = mantikKapisi.mantiksalKapi.kapi || {};

mantikKapisi.mantiksalKapi.SimpleLogic = function SimpleLogic (canvas, divKonumu) { //kapıların ve menu tasarımının ayarlandığı fonksiyon
	var kapilar = []; 
	this.kapilar = kapilar; //kapilar.js den gelen değerler yüklendi
	var yuzeyDurumu = canvas.getContext("2d"); // zemin 2 boyutlu işlemler yapılcağı için 2d ayarlandı
	this.divKonumu = divKonumu;
	var ayarlar = {};
	ayarlar.baglantiGenisligi = 8; // kapıların yanındaki giriş gibi gözüken ufak çıkıntılı kareler için görsel ayar
	ayarlar.baglantiYuksekligi = 10;
	if ('ontouchstart' in window || 'onmsgesturechange' in window) { // ekran ayarı değişikliğinde görsel ayar bloğunu değiştirmek için
		ayarlar.baglantiGenisligi = 20;
		ayarlar.baglantiYuksekligi = 20;
	}
	
	this.yuzeyGenisligi = 0; //kapılarla işlem yapacağımız zeminin özelliklerini tutmak için
	this.yuzeyYuksekligi = 0;
	
	this.eventHandlers = {}; //kapıların eventlarını tutmak için yani , fareye tıklama, basılı tutma,  bırakma gibi fonksiyonlar bunun altında tanımlanıyor
	
	this.eventHandlers.mousedown = function mousedown (event) { //fareye basılı tutulduğunda kapılar arası çizgi çekmek için
		if (typeof event.target.baglananGiris === "number") { 
			this.connecting = {kapi: event.target.kapi, input: event.target.baglananGiris}; // bağlantı nesnesine bağlanan giriş kapısını yüklüyor
			event.preventDefault();
		} else if(typeof event.target.baglananCikis === "number") {
			this.connecting = {kapi: event.target.kapi, output: event.target.baglananCikis}; // bağlantı nesnesine bağlanan çıkış kapısını yüklüyor
			event.preventDefault();
		} else if (!this.draggingNode && event.target.kapi && (typeof event.target.kapi.propertys.mousedown !== "function" || !event.target.kapi.propertys.mousedown(event))) {
			this.draggingNode = event.target; 
			//zemine sürüklenen kapının bağlantısı yapıldıktan sonra zeminde basınca tekrar başka alanlara taşıyabilmek için
			document.getElementById("menu").style.opacity = "0.3";
			event.target.draggingStartX = event.clientX - Math.floor(event.target.getBoundingClientRect().left);
			event.target.draggingStartY = event.clientY - Math.floor(event.target.getBoundingClientRect().top);
			event.target.dragStartTime = Date.now();
			event.preventDefault();
		} else { //
			this.backStartX = event.clientX; //eventlerin konumunu eski başlangıç pozisyonuna atıyor 
			this.backStartY = event.clientY;
			this.dragBackground = true;
			document.body.style.cursor = "move"; //zeminin özelliğine hareket ekliyor
		}
	}.bind(this);
	
	this.eventHandlers.mouseup = function mouseup (event) { // menuden fareye basılı tutularak sürüklenen kapıyı zemine bırakmak için
		var currentX = -parseInt(divKonumu.style.left.slice(0, -2)) + 20 || 0,
		    currentY = -parseInt(divKonumu.style.top.slice(0, -2)) + 20  || 0; //hangi konuma bırakılcağını hesaplıyor
		if (this.connecting) {
			if (typeof this.connecting.input === "number") { //kapılara bağlantı girişi ekliyor, bu kısımda kapılar arası çizgi çekilir ve giriş değerleri eklenir
				if (typeof event.target.baglananCikis === "number") {
					this.connecting.kapi.addInput(event.target.kapi, event.target.baglananCikis, this.connecting.input);
				}
			} else { //kapılara bağlantı girişi ekliyor, bu kısımda kapılar arası çizgi çekilir ve giriş değerleri eklenir
				if (typeof event.target.baglananGiris === "number") {
					event.target.kapi.addInput(this.connecting.kapi, this.connecting.output, event.target.baglananGiris);
				}
			}
		} else if (this.draggingNode && (this.draggingNode.kapi.x < currentX || this.draggingNode.kapi.y < currentY)) {
			this.removeNode(this.draggingNode.kapi);
			delete this.draggingNode;
			document.getElementById("menu").style.opacity = "";
		}

		if (this.draggingNode && Date.now() - this.draggingNode.dragStartTime > 200) { //menuden sürüklenen kapının zemine bırakılması için
			delete this.draggingNode; //kapı siliniyor
			document.getElementById("menu").style.opacity = "";
		}
		this.dragBackground = false; //fare basılı değilken kapılar zeminde hareket etmemesi için
		document.body.style.cursor = "";
		delete this.connecting;
	}.bind(this);
	
	this.eventHandlers.mousemove = function mousemove (event) { //menudeki kapıya fare ile tıklandığında menuden sürükleyebilmek için
		var returntrue;
		if (this.draggingNode && (typeof this.draggingNode.kapi.propertys.mousemove !== "function" || !this.draggingNode.kapi.propertys.mousemove(event, this.draggingNode))) {
			var x = event.clientX - Math.floor(divKonumu.getBoundingClientRect().left) - this.draggingNode.draggingStartX, //kapıların konumları alınıyor daha sonra işleniyor
				y = event.clientY - Math.floor(divKonumu.getBoundingClientRect().top) - this.draggingNode.draggingStartY;
			x = Math.round(x / 10) * 10;
			y = Math.round(y / 10) * 10;
			this.draggingNode.kapi.x = x; // kapının yeni kordinatları yükleniyor
			this.draggingNode.kapi.y = y;
			event.preventDefault();
			returntrue = true;
		}

		if (this.connecting) returntrue = true;

		if (this.dragBackground && !this.draggingNode) {
			var currentX = parseInt(divKonumu.style.left.slice(0, -2)) || 0,
			    currentY = parseInt(divKonumu.style.top.slice(0, -2))  || 0;

			divKonumu.style.left = currentX + (event.clientX - this.backStartX) + "px";
			divKonumu.style.top  = currentY + (event.clientY - this.backStartY) + "px";

			this.backStartX = event.clientX;
			this.backStartY = event.clientY;
			
			event.preventDefault();
		}

		this.mouseX = event.clientX - Math.floor(divKonumu.getBoundingClientRect().left);
		this.mouseY = event.clientY - Math.floor(divKonumu.getBoundingClientRect().top);
		return returntrue;
	}.bind(this);
	
	this.eventHandlers.touchstart = function touchstart (event) { //kapıya tıklanınca
		var ev = event.changedTouches[0];
		ev.preventDefault = function () {};
		this.eventHandlers.mousedown(ev);
	}.bind(this);
	
	this.eventHandlers.touchend = function touchend (event) { //kapıya tıklama bitince
		var ev = {
			clientX: event.changedTouches[0].clientX,
			clientY: event.changedTouches[0].clientY
		};
		ev.preventDefault = function () {};
		ev.target = document.elementFromPoint(ev.clientX, ev.clientY);
		this.eventHandlers.mouseup(ev);
	}.bind(this);
	
	this.eventHandlers.touchmove = function touchmove (event) { //kapıya tıklayıp sürüklerken
		var ev = event.changedTouches[0];
		ev.preventDefault = function () {};
		if (this.eventHandlers.mousemove(ev)) {
			event.preventDefault();
		}
	}.bind(this);;
	
	//eventlar ekleniyor
	document.addEventListener("mousedown", this.eventHandlers.mousedown);
	document.addEventListener("mouseup", this.eventHandlers.mouseup);
	document.addEventListener("mousemove", this.eventHandlers.mousemove);
	document.addEventListener("touchstart", this.eventHandlers.touchstart);
	document.addEventListener("touchend", this.eventHandlers.touchend);
	document.addEventListener("touchmove", this.eventHandlers.touchmove);

	this.update = function () { //kapıların işlemlerini gerçekleştirirken güncel tutmak için , 
		var updateTime = Date.now();
		for (var kapi = 0; kapi < kapilar.length; kapi++) {
			if (!kapilar[kapi].lastUpdate || kapilar[kapi].lastUpdate < updateTime) {
				kapilar[kapi].update(updateTime);
			}
		}
	};
	
	this.addNode = function (type, x, y) { //kapı eklemek için
		var kapi = new mantikKapisi.mantiksalKapi.Node({
			type: type,
			x: x,
			y: y
		});
		kapilar.push(kapi);
		return kapi;
	};
	
	this.removeNode = function (kapi) { //kapı silmek için
		for (var k = 0; k < kapilar.length; k++) {
			if (kapilar[k] === kapi) {
				var div = document.getElementById(kapilar[k].id);
				if (div) {
					div.parentNode.removeChild(div);
				}
				kapilar.splice(k, 1);
				k--;
			} else {
				kapilar[k].removeInput(kapi);
			}
		}
		delete this.draggingNode;
	};

	this.inputCoords = function inputCoords (kapi, input) { //kapıların giriş çizgilerinin kordinatı ayarlanır
		var image = kapi.propertys.getImage(kapi);
		var height = (image.height - kapi.propertys.inputs * ayarlar.baglantiYuksekligi) / (kapi.propertys.inputs + 1);
		var x = kapi.x - 2,
			y = kapi.y + height * (input + 1) + input * ayarlar.baglantiYuksekligi + ayarlar.baglantiYuksekligi / 2;
		return [x, y];
	};

	this.outputCoords = function outputCoords (kapi, output) { //kapıların çıkış çizgilerinin kordinatı ayarlanır
		var image = kapi.propertys.getImage(kapi);
		var height = (image.height - kapi.propertys.outputs * ayarlar.baglantiYuksekligi) / (kapi.propertys.outputs + 1);
		var x = kapi.x + image.width + 2,
			y = kapi.y + height * (output + 1) + output * ayarlar.baglantiYuksekligi + ayarlar.baglantiYuksekligi / 2;
		return [x, y];
	};
 
	this.draw = function () { //kapılar ana ekranımıza , yüzeye ve menüye eklenir
		canvas.width = this.yuzeyGenisligi;
		canvas.height = this.yuzeyYuksekligi;
		yuzeyDurumu.lineWidth = "5";
		for (var k = 0; k < kapilar.length; k++) {
			var div = document.getElementById(kapilar[k].id);
			if (!div) {
				div = divKonumu.appendChild(this.domElementOfNode(kapilar[k]));
			}
			div.style.position = "absolute";
			div.style.left = kapilar[k].x + "px";
			div.style.top = kapilar[k].y + "px";
			
			for (var i = 0; i < kapilar[k].inputs.length; i++) {
				if (kapilar[k].inputs[i]) {
					var inputCoords = this.inputCoords(kapilar[k], i);
					var outputCoords = this.outputCoords(kapilar[k].inputs[i].kapi, kapilar[k].inputs[i].number);
					yuzeyDurumu.beginPath();
					yuzeyDurumu.moveTo(inputCoords[0], inputCoords[1]);
					yuzeyDurumu.lineTo(outputCoords[0], outputCoords[1]);
					this.yuzeyGenisligi = Math.max(this.yuzeyGenisligi, Math.max(inputCoords[0], outputCoords[0]));
					this.yuzeyYuksekligi = Math.max(this.yuzeyYuksekligi, Math.max(inputCoords[1], outputCoords[1]));
					yuzeyDurumu.strokeStyle = (kapilar[k].inputs[i].kapi.outputs[kapilar[k].inputs[i].number]) ? "red" : "black";
					yuzeyDurumu.stroke();
				}
			}
		}
		
		if (this.connecting) { // kapıların bağlantı çizgileri ayarlanır
			yuzeyDurumu.beginPath();
			if (typeof this.connecting.output === "number") {
				var coords = this.outputCoords(this.connecting.kapi, this.connecting.output);
			} else {
				var coords = this.inputCoords(this.connecting.kapi, this.connecting.input);
			}
			yuzeyDurumu.moveTo(coords[0], coords[1]);
			yuzeyDurumu.lineTo(this.mouseX, this.mouseY);
			this.yuzeyGenisligi = Math.max(this.yuzeyGenisligi, Math.max(coords[0], this.mouseX));
			this.yuzeyYuksekligi = Math.max(this.yuzeyYuksekligi, Math.max(coords[1], this.mouseY));
			yuzeyDurumu.lineWidth = "5";
			yuzeyDurumu.strokeStyle = "black";
			yuzeyDurumu.stroke();
		}
	};
	
	this.domElementOfNode = function (kapi) { //kapıları sürüklemek, birbirlerine bağlamak için ana fonksiyon
		var div = document.createElement("div");
		div.id = kapi.id;
		div.className = "kapiContainer";
		
		image = div.appendChild(kapi.propertys.getImage(kapi));
		image.kapi = kapi;
		image.className = "draw_kapi position_kapi";
		image.id = kapi.id + "_image";
		
		var height = (image.height - kapi.propertys.inputs * ayarlar.baglantiYuksekligi) / (kapi.propertys.inputs + 1);
		for (var i = 0; i < kapi.propertys.inputs; i++) {
			var input = document.createElement("div");
			input.className = "baglantıCiz";
			input.style.position = "absolute";
			input.style.height = ayarlar.baglantiYuksekligi + "px";
			input.style.width = ayarlar.baglantiGenisligi + "px";
			input.style.left = -ayarlar.baglantiGenisligi + "px";
			input.style.top = height * (i + 1) + i * ayarlar.baglantiYuksekligi + "px";
			input.kapi = kapi;
			input.baglananGiris = i;
			input.addEventListener("click", function (number, event) {
				event.target.kapi.removeInput(number);
			}.bind(this, i));
			div.appendChild(input);
		}
		
		var height = (image.height - kapi.propertys.outputs * ayarlar.baglantiYuksekligi) / (kapi.propertys.outputs + 1);
		for (var i = 0; i < kapi.propertys.outputs; i++) {
			var input = document.createElement("div");
			input.className = "baglantıCiz";
			input.style.position = "absolute";
			input.style.height = ayarlar.baglantiYuksekligi + "px";
			input.style.width = ayarlar.baglantiGenisligi + "px";
			input.style.left = image.width + 2 + "px";
			input.style.top = height * (i + 1) + i * ayarlar.baglantiYuksekligi + "px";
			input.kapi = kapi;
			input.baglananCikis = i;
			input.addEventListener("click", function (number, event) {
				this.removeConnectionsFromOutput(event.target.kapi, number);
			}.bind(this, i));
			div.appendChild(input);
		}
		
		return div;
	};
	
	this.removeConnectionsFromOutput = function removeConnections (kapi, number) { //seçili kapı bağlantısının (çizgi) silinmesi için
		for (var k = 0; k < kapilar.length; k++) {
			kapilar[k].removeInput(kapi, number);
		}
	};
	
	this.kapiFromId = function (id) { //kapıları id leriyle var mı yokmu kontrol ediyor
		for (var k = 0; k < kapilar.length; k++) {
			if (kapilar[k].id === id) {
				return kapilar[k];
			}
		}
	
		return {};
	};
	
	 
 
	
	this.tick = function () { //ekrana menuyu getiriyor ve güncelleme fonksiyonunu tetikliyor
		this.update();
		this.draw();
		requestAnimationFrame(this.tick);
	}.bind(this);
	
	requestAnimationFrame(this.tick);
};

mantikKapisi.mantiksalKapi.Node = function Node (ayarlar) { //kapı girdilerine özellikler ekleniyor
	ayarlar = ayarlar || {};
	if (!mantikKapisi.mantiksalKapi.kapilar[ayarlar.type]) {
		throw "bilinmeyen kapi türü";
	}
	
	this.propertys = mantikKapisi.mantiksalKapi.kapilar[ayarlar.type];
	this.propertys.type = ayarlar.type;
	
	this.inputNodes = {length: this.propertys.inputs};
	this.inputs = this.inputNodes;
	this.outputs = [];
	for (var k = 0; k < this.propertys.defaultOutputs; k++) {
		this.outputs[k] = this.propertys.defaultOutputs[k];
	}
	
	this.lastUpdated = Date.now();
	this.x = ayarlar.x;
	this.y = ayarlar.y;
	this.id = ayarlar.type + "_" + Date.now();
	
	this.getInputs = function getInputs (time) { //kapılardan girdi değerleri alınıyor
		var inputs = [];
		for (var k = 0; k < this.propertys.inputs; k++) {
			if (this.inputNodes[k]) {
				if (this.inputNodes[k].lastUpdate < time) {
					this.inputNodes[k].update(time);
				}
				inputs[k] = this.inputNodes[k].kapi.outputs[this.inputNodes[k].number];
			} else {
				inputs[k] = false;
			}
		}
		return inputs;
	};
	
	this.update = function (time) { //güncelleme kapılar için
		this.lastUpdated = time;
		var inputs = this.getInputs(time);
		this.propertys.update(this, inputs, time);
	};
	
	this.addInput = function (kapi, kapiOutputNumber, inputNodeNumber) { // giriş ekleniyor
		this.inputNodes[inputNodeNumber] = {
			kapi: kapi,
			number: kapiOutputNumber
		};
	};
	
	this.removeInput = function (kapi, outputNumber) { // giriş siliniyor
		if (typeof kapi !== "number") {
			for (var k = 0; k < this.inputNodes.length; k++) {
				if (this.inputNodes[k] && this.inputNodes[k].kapi == kapi && (typeof outputNumber !== "number" || this.inputNodes[k].number === outputNumber)) {
					delete this.inputNodes[k];
				}
			}
		} else {
			delete this.inputNodes[kapi];
		}
	};
};

mantikKapisi.mantiksalKapi.kapi.getBackground = function (width, height, border) { //zeminin rengi ve boyutları ayarlanıyor
	var ctx = mantikKapisi.utils.newCtx(width, height, "grey");
	ctx.beginPath();
	ctx.fillStyle = "darkgrey";
	ctx.rect(border, border, width - border - border, height - border - border);
	ctx.fill();
	return ctx;
};

mantikKapisi.mantiksalKapi.port.getImage = function (text) { // kapıların resimleri ve rengi ayarlanıyor
	var width = 12 * text.length + 32,
		height = 50;
	var border = 5;
	var ctx = mantikKapisi.mantiksalKapi.kapi.getBackground(width, height, border);
	mantikKapisi.mantiksalKapi.port.textOnImage(ctx, text, border, height);
	return ctx.canvas;
};

mantikKapisi.mantiksalKapi.port.textOnImage = function (ctx, text, border, height) { //kapıların yazıları AND OR gibi rengi ve stili ayarlanıyor
	ctx.beginPath();
	ctx.font="20px 'Coda Caption'";
	ctx.fillStyle = "black";
	ctx.fillText(text, border + border, height / 2 + 8);
};