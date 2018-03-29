

//kapıların mantıksal değerlerini ve hangi kapının ekranda nasıl gözükeceğini oluşturuyor.

var mantikKapisi = mantikKapisi || {};
mantikKapisi.mantiksalKapi = mantikKapisi.mantiksalKapi || {};
mantikKapisi.mantiksalKapi.kapilar = {
	
	AND: { // input : 2 yani iki giriş , fonksiyona inputların sonucunu ve hangi kapı olduğunu yolluyor, sonuç üretme mantikkapisi.js dosyasında 6. satır
		inputs: 2, // 2 girişli
		outputs: 1, // 1 çıkışlı kapı
		defaultOutputs: [true], // varsayılan çıkışa false veriyor fakat true değeri yüklenince de farkeden mantıksal değişiklik yok
		update: function (kapi, inputs) { // mantikkapisi.js dosyasındaki "update" fonksiyonuna kapının input değerlerini yolluyor
			kapi.outputs[0] = inputs[0] && inputs[1]; // iki inputta da değer var ise bir output üretiyor
		},
		getImage: function (kapi) { //kapı için ekranda gözüken kısmın tasarımının yapıldığı fonksiyon
			if (!kapi.image) { //kapının görüntüsü yoksa yeni görüntü oluşturuyor
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("AND KAPISI"); // ekranda yazan hali
			}
			return kapi.image; //fonk resimi döndürüyor tekrar çağırıldığı zaman erişmek için
		}
	},
	AND3: {
		inputs: 3,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = inputs[0] && inputs[1];
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("3'LU AND KAPISI"); // ekranda yazan hali
			}
			return kapi.image;
		}
	},
	NAND: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = !(inputs[0] && inputs[1]);
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("NAND KAPISI");
			}
			return kapi.image;
		}
	},
	NAND3: {
		inputs: 3,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = !(inputs[0] && inputs[1]);
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("3'LU NAND KAPISI");
			}
			return kapi.image;
		}
	},
	OR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = inputs[0] || inputs[1];
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("OR KAPISI");
			}
			return kapi.image;
		}
	},
	OR3: {
		inputs: 3,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = inputs[0] || inputs[1];
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("3'LU OR KAPISI");
			}
			return kapi.image;
		}
	},
	NOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = !(inputs[0] || inputs[1]);
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("NOR KAPISI");
			}
			return kapi.image;
		}
	},
	NOR3: {
		inputs: 3,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = !(inputs[0] || inputs[1]);
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("3'LU NOR KAPISI");
			}
			return kapi.image;
		}
	},
	XOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = inputs[0] ? !inputs[1] : inputs[1];
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("XOR KAPISI");
			}
			return kapi.image;
		}
	},
	XNOR: {
		inputs: 2,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = inputs[0] ? inputs[1] : !inputs[1];
		},
		getImage: function (kapi) {
			if(!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("XNOR KAPISI");
			}
			return kapi.image;
		}
	},
	NOT: {
		inputs: 1,
		outputs: 1,
		defaultOutputs: [false],
		update: function (kapi, inputs) {
			kapi.outputs[0] = !inputs[0];
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				kapi.image = mantikKapisi.mantiksalKapi.port.getImage("NOT KAPISI");
			}
			return kapi.image;
		}
	},
	Cikis: { // sonuç çıktısının tasarlandığı kısım, şekli ve özellikleri
		inputs: 1,
		outputs: 0,
		update: function (kapi, inputs) {
			if (!kapi.ctx) {
				kapi.propertys.getImage(kapi);
			}
			if (kapi.lastInput !== inputs[0]) {
				if (inputs[0]) {
					kapi.ctx.beginPath();
					kapi.ctx.arc(35, 35, 25, 0, 2 * Math.PI);
					kapi.ctx.fillStyle = "red";
					kapi.ctx.fill();
				} else {
					kapi.ctx.beginPath();
					kapi.ctx.arc(35, 35, 25, 0, 2 * Math.PI);
					kapi.ctx.fillStyle = "grey";
					kapi.ctx.fill();
				}
				kapi.lastInput = inputs[0];
			}
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				var ctx = mantikKapisi.mantiksalKapi.kapi.getBackground(70, 70, 7);
				ctx.beginPath();
				ctx.arc(35, 35, 25, 0, 2 * Math.PI); //karenin ortasındaki yuvarlak alan, sonuca göre ışık üretiyor
				ctx.fillStyle = "grey";
				ctx.fill();
				kapi.image = ctx.canvas;
				kapi.ctx = ctx;
			}
			return kapi.image;
		}
	},
	Giris: { //input = 1 için :: input beyaz renk ise aktif değil yani input 0 olur. input kırmızı renk ise aktiftir yani giriş 1 dir.
		inputs: 0,
		outputs: 1,
		update: function () {
		},
		getImage: function (kapi) {
			if (!kapi.image) {
				var ctx = mantikKapisi.mantiksalKapi.kapi.getBackground(50, 50, 5);
				ctx.beginPath();
				ctx.rect(20, 10, 10, 30);
				ctx.fillStyle = "white"; 
				ctx.fill();
				kapi.image = ctx.canvas;
				kapi.image.addEventListener("click", function () {
					this.outputs[0] = !this.outputs[0];
					ctx.beginPath();
					ctx.rect(20, 10, 10, 30);
					ctx.fillStyle = (this.outputs[0]) ? "red" : "white";
					ctx.fill();
				}.bind(kapi));
				kapi.ctx = ctx;
				kapi.image.style.cursor = "pointer";
			}
			return kapi.image;
		}
	},
	
};
