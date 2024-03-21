let key = 0;
function loadImage(obj) {
    for (i = 0; i < obj.files.length; i++) {
        var fileReader = new FileReader();
        fileReader.onload = (function (e) {
            var field = document.getElementById("imgPreviewField");
            var figure = document.createElement("figure");
            var rmBtn = document.createElement("input");
            var img = new Image();
            img.src = e.target.result;
            rmBtn.type = "button";
            rmBtn.name = key;
            rmBtn.value = "削除";
            rmBtn.onclick = (function () {
                var element = document.getElementById("img-" + String(rmBtn.name)).remove();
            });
            figure.setAttribute("id", "img-" + key);
            figure.appendChild(img);
            figure.appendChild(rmBtn)
            field.appendChild(figure);
            key++;
        });
        fileReader.readAsDataURL(obj.files[i]);
    }
}
//*******************ここからcanvas*******************//
//初期化(変数letで宣言)
let canvas_mouse_event = false; //スイッチ [ true=線を引く, false=線は引かない ]  ＊＊＊
let oldX = 0; //１つ前の座標を代入するための変数
let oldY = 0; //１つ前の座標を代入するための変数
let bold_line = 30; //ラインの太さをここで指定
let color = "#cccccc"; //ラインの色をここで指定

//------------------------------------------------
//const can = $("#drowarea")[0]; //CanvasElement
//const ctx = can.getContext("2d"); //描画するための準備！
//------------------------------------------------
//上2つのスクリプトを記述します。
const can = $("#drowarea")[0];
const ctx = can.getContext("2d");
const width = 500;
const height = 500;



//*******************画像をcanvasにセット*******************//

// Canvas上に画像を表示する
function canvasDraw(imgSrc) {
    // canvas内の要素をクリアする
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
    // Canvas上に画像を表示
    var img = new Image();
    img.src = uploadImgSrc;
    img.onload = function() {
      ctx.drawImage(img, 0, 0, canvasWidth, this.height * (canvasWidth / this.width));
  
      // Canvas上にテキストを表示
      addText();
  
      // canvasを画像に変換
      var data = canvas.toDataURL();
  
      // ダウンロードリンクを生成して出力
      var dlLink = document.createElement('a');
      dlLink.href = data;
      dlLink.download = 'sample.png';
      dlLink.innerText = 'ダウンロード';
      document.getElementById('result').appendChild(dlLink);
    }
  }


//mousedown：フラグをTrue
//-----------------------------------------------
//oldX = e.offsetX;       //MOUSEDOWNしたX横座標取得
//oldY = e.offsetY; //MOUSEDOWN Y高さ座標取得
//canvas_mouse_event=true;
//-----------------------------------------------
//上5つのスクリプトを記述します。
$(can).on("mousedown",function(e){
    console.log(e);
    oldX = e.offsetX;
    oldY = e.offsetY;
    canvas_mouse_event = true;
});

//mousemove：フラグがTrueだったら描く ※e：イベント引数取得
//----------------------------------------------
//  if(canvas_mouse_event==true){
//      const px = e.offsetX;
//      const py = e.offsetY;
//      ctx.strokeStyle = color;
//      ctx.lineWidth = bold_line;
//      ctx.beginPath();
//      ctx.lineJoin= "round";
//      ctx.lineCap = "round";
//      ctx.moveTo(oldX, oldY);
//      ctx.lineTo(px, py);
//      ctx.stroke();
//      oldX = px;
//      oldY = py;
//  }
$(can).on("mousemove",function(e){
        const px = e.offsetX;
        const py = e.offsetY;
    if (px > width || py > height) {
        alert("でましたよ！");
    }
    if(canvas_mouse_event == true) {
        ctx.strokeStyle = color;//色
        ctx.lineWidth = bold_line;//太さ
        ctx.beginPath();
        ctx.moveTo(oldX,oldY);
        ctx.lineTo(px, py);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();
        oldX = px;
        oldY = py;
    }
});

//mouseup：フラグをfalse
//------------------------------------------------
//    canvas_mouse_event=false;
//------------------------------------------------
$(can).on("mouseup",function(){
    canvas_mouse_event = false;

});

//#clear_btn：クリアーボタンAction
//-----------------------------------------------------------------
//    ctx.beginPath();
//    ctx.clearRect(0, 0, can.width, can.height);
//-----------------------------------------------------------------

$("#clear_btn").on("click",function(){
    ctx.beginPath();
    ctx.clearRect(0,0,can.width,can.height);

});



