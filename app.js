// 【クオリティアップ版のイメージロジック】

// 1. あらかじめ「動く食べ物」のコマ画像（PNG）を数枚用意してフォルダに入れておく
// もしくは、フリーの透過GIFアニメのURLを指定する
const foodFrames = [
    'images/burger_01.png', // 口を開けて近づくハンバーガー
    'images/burger_02.png', // ガブッと潰れるハンバーガー
    'images/burger_03.png', // 食べられて欠けたハンバーガー
];

// 2. ループ処理の中で、写真の上にこの「高画質パーツ」を順番に重ねて描画する
for (let i = 0; i < totalFrames; i++) {
    ctx.clearRect(0, 0, size, size);
    
    // 土台の写真を描画
    ctx.drawImage(sourceImage, x, y, w, h);
    
    // その上に、プロが描いたような素材画像を重ねる
    let currentFoodImage = new Image();
    currentFoodImage.src = foodFrames[i % foodFrames.length];
    
    // 位置や角度を計算してリッチに合成
    ctx.drawImage(currentFoodImage, foodX, foodY, foodSize, foodSize);
}
