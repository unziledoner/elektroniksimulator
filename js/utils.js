var mantikKapisi = mantikKapisi || {};
mantikKapisi.utils = mantikKapisi.utils || {};

mantikKapisi.utils.newCtx = function newCtx (width, height, bckcolor) {
	var ctx = document.createElement("canvas"); //zemin elementi oluşturuldu
	ctx.width = width; // zemine boyut atandı
	ctx.height = height; 
	ctx = ctx.getContext("2d"); // zemin türü 2 boyutlu yapıldı
	if (bckcolor) { //zemin rengi atandı
		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = bckcolor;
		ctx.fill();
	}
	return ctx;
};