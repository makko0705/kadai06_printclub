//*******************絵を描く設定*******************//
//初期化(変数letで宣言)
let canvas_mouse_event = false; //スイッチ [ true=線を引く, false=線は引かない ]  ＊＊＊
let oldX = 0; //１つ前の座標を代入するための変数
let oldY = 0; //１つ前の座標を代入するための変数
let bold_line = 30; //ラインの太さをここで指定
let color = "#000000"; //最初の色をここで指定

let input_color = $("#brash_color").val();
let input_width = $("#brash_width").val();

//ブラシの色を取得 colorにセット
const inputColor = document.querySelector("#brash_color");
const inputColorResult = document.querySelector("#inputColorResult");
// ここを追加
inputColor.addEventListener("change", (e) => {
  const value = e.target.value; //ここでとったvalueをcolorにに代入
  color = value;
  inputColorResult.innerHTML = value;
});

//ブラシの太さを取得 bold_lineにセット
const inputWidth = document.querySelector("#brash_width");
const inputWidthResult = document.querySelector("#inputWidthResult");
// ここを追加
inputWidth.addEventListener("change", (w) => {
  const value = w.target.value; //ここでとったvalueをbold_lineに代入
  bold_line = value;
  inputWidthResult.innerHTML = value;
});

const canvas_drow = $("#drow_area")[0];//CanvasElement
const ctx_drow = canvas_drow.getContext("2d");//描画するための準備！
const width = 500;
const height = 500;

//mousedown：フラグをTrue
$(canvas_drow).on("mousedown",function(e){
  console.log(e,"書いてるときに出る");
  oldX = e.offsetX;//MOUSEDOWNしたX横座標取得
  oldY = e.offsetY;//MOUSEDOWN Y高さ座標取得
  canvas_mouse_event = true;
});

//mousemove：フラグがTrueだったら描く ※e：イベント引数取得
$(canvas_drow).on("mousemove",function(e){
  const px = e.offsetX;
  const py = e.offsetY;
  if (px > width || py > height) {
      alert("枠をでましたよ！");
  }
  if(canvas_mouse_event == true) {
    ctx_drow.strokeStyle = color;//色 18行目でとった色をここに代入
    ctx_drow.lineWidth = bold_line;//太さ
    ctx_drow.beginPath();
    ctx_drow.moveTo(oldX,oldY);
    ctx_drow.lineTo(px, py);
    ctx_drow.lineJoin = "round";
    ctx_drow.lineCap = "round";
    ctx_drow.stroke();
      oldX = px;
      oldY = py;
  }
});

//mouseup：フラグをfalse
$(canvas_drow).on("mouseup",function(){
  canvas_mouse_event = false;
});

//#clear_btn：クリアーボタンAction
$("#clear_btn").on("click",function(){
  ctx_drow.beginPath();
  ctx_drow.clearRect(0,0,canvas_drow.width,canvas_drow.height);
});

//*******************ファイルをアップロードしてプレビュー*******************
function previewFile(preview_bg){
  var fileData = new FileReader();
  fileData.onload = (function() {

    //id属性が付与されているimgタグのsrc属性に、
    //fileReaderで取得した値の結果を入力することでプレビュー表示している
    document.getElementById('demo_image').src = fileData.result;
    console.log(fileData.result,"fileData.resultのなかみ");
    console.log("画像がかわりました");

    var $img = $('#demo_image');
    var imgW = $img.width();
    var imgH = $img.height();
    console.log($img,"demo_imgのなかみ");
  
    
    //取得した画像サイズのcanvasを追加
    $("#bg_area").append('<canvas id="myPhoto" width="'+imgW+'" height="'+imgH+'"></canvas>');
  
  
  
  
  //キャンパスに描画するためのコンテキストを用意する
  var canvas_myPhoto = document.getElementById('myPhoto'),
      ctx_bg = canvas_myPhoto.getContext('2d');
      //取得した画像を新しいオブジェクトとして生成する
      
  var image = new Image();
  console.log(image,"imageのなかみ");
  
  image.src = $img.attr("src"); //image.srcにdemo_imageを入れる
  console.log(image.src,"image.srcのなかみ");
  
  // 描画する ここが意図する形にならない
  // drawImage(image.src,開始X,開始Y,終点X,終点Y,リサイズ開始X,リサイズ開始Y,リサイズ終点X,リサイズ終点Y)
  ctx_bg.drawImage(image, 0, 0, image.width, image.height, 0, 0, imgW, imgH);
  // 元画像のサイズのまま描画する場合、ctx.drawImage(image, 0, 0)でよい

  });
  fileData.readAsDataURL(preview_bg.files[0]);
}









//*******************#myPhotoと#drow_areaを合成*******************
//const canvas_drow = document.getElementById("drow_area"); これは上で定義してある
const canvas_bg = document.getElementById("myPhoto");

console.log(ctx_drow,"ctx_drowの中身です");

document.querySelector("#btn_concat").addEventListener("click", ()=>{
  console.log("concatボタンを押しました");
    concatCanvas("#concat", ["#myPhoto", "#drow_area"]);
    
  });
// Canvas合成
  async function concatCanvas(base, asset){
  const canvas = document.querySelector(base);
  const ctx = canvas.getContext("2d");

  for(let i=0; i<asset.length; i++){
    const image1 = await getImagefromCanvas(asset[i]);
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  }
}
function eraseCanvas(target){
  const canvas = document.querySelector(target);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//Canvasを画像として取得
function getImagefromCanvas(id){
  return new Promise((resolve, reject) => {
    const image = new Image();
    const ctx = document.querySelector(id).getContext("2d");
    image.onload = () => resolve(image.src = ctx.toDataURL());
    image.onerror = (e) => reject(e);
  });
}




// Canvasをすべて削除する






/*
質問内容
プリクラの機能を作りたいと思っている

ファイルをアップロード ◯
写真をプレビュー ◯
プレビューした画像を背景のcanvasにセット ✗
落書き ◯
ペンの太さ、色 ◯
完成ボタンをおしたら合成 ✗
*/