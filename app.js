const imageInput = document.getElementById('imageInput');
const generateBtn = document.getElementById('generateBtn');
const resultDiv = document.getElementById('result');

let sourceImage = new Image();
let imageLoaded = false;

// 1. ユーザーが画像を選択した時の処理
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        sourceImage.src = event.target.result;
        sourceImage.onload = () => {
            imageLoaded = true;
            generateBtn.disabled = false;
            resultDiv.innerHTML = '<p>画像が読み込まれました！「GIFを生成する」を押してね。</p>';
        };
    };
    reader.readAsDataURL(file);
});

// 2. GIF生成ボタンが押された時の処理
generateBtn.addEventListener('click', () => {
    if (!imageLoaded) return;

    resultDiv.innerHTML = '<p>AIアニメーション生成中... 🚀</p>';
    generateBtn.disabled = true;

    // 仮想のキャンバスを作成して、ここでアニメーションの各コマを描画する
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 300; // スタンプのサイズ
    canvas.width = size;
    canvas.height = size;

    const frames = [];
    const totalFrames = 6; // 6コマのアニメーション

    // 3. 1枚の画像から、少しずつ位置をずらしたコマ（フレーム）を自動生成
    for (let i = 0; i < totalFrames; i++) {
        // キャンバスをクリア
        ctx.clearRect(0, 0, size, size);

        // ブルブル震えるためのランダムなズレ（オフセット）を計算
        // （※1コマ目はズレなし、それ以外は-5px〜+5pxの間でランダムに揺らす）
        const offsetX = i === 0 ? 0 : (Math.random() - 0.5) * 10;
        const offsetY = i === 0 ? 0 : (Math.random() - 0.5) * 10;

        // 画像をキャンバスの中心にアスペクト比を保って描画する計算
        const scale = Math.min(size / sourceImage.width, size / sourceImage.height);
        const w = sourceImage.width * scale;
        const h = sourceImage.height * scale;
        const x = (size - w) / 2 + offsetX;
        const y = (size - h) / 2 + offsetY;

        // ここで描画
        ctx.drawImage(sourceImage, x, y, w, h);

        // キャンバスの見た目をデータ化（DataURL）して配列に保存
        frames.push(canvas.toDataURL('image/png'));
    }

    // 4. 作成したコマをgifshotで1つのGIFにまとめる
    gifshot.createGIF({
        images: frames,
        gifWidth: size,
        gifHeight: size,
        interval: 0.05, // 震える速度（短いほど高速に震える）
        numWorkers: 2
    }, (obj) => {
        generateBtn.disabled = false;
        
        if (!obj.error) {
            const gifUrl = obj.image;
            resultDiv.innerHTML = `
                <h3>完成した1枚画像からの動くスタンプ：</h3>
                <img src="${gifUrl}" alt="Generated GIF"><br>
                <a href="${gifUrl}" download="shake-stamp.gif" class="download-btn">📥 GIFを保存する</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">エラー: ${obj.errorMsg}</p>`;
        }
    });
});
