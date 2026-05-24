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
            resultDiv.innerHTML = '<p>準備完了！しづ＆兄貴を驚かせるスタンプを作ろう 🚀</p>';
        };
    };
    reader.readAsDataURL(file);
});

// 2. GIF生成ボタンが押された時の処理
generateBtn.addEventListener('click', () => {
    if (!imageLoaded) return;

    resultDiv.innerHTML = '<p>もぐもぐアニメーションを生成中... 🍔✨</p>';
    generateBtn.disabled = true;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 400; // スタンプのサイズ
    canvas.width = size;
    canvas.height = size;

    const frames = [];
    const totalFrames = 8; // 8コマで1ループのアニメーション

    // 3. アニメーションの生成ループ
    for (let i = 0; i < totalFrames; i++) {
        ctx.clearRect(0, 0, size, size);

        // --- ベースとなる写真（被写体）を描画 ---
        const scale = Math.min(size / sourceImage.width, size / sourceImage.height);
        const w = sourceImage.width * scale;
        const h = sourceImage.height * scale;
        const x = (size - w) / 2;
        const y = (size - h) / 2;
        ctx.drawImage(sourceImage, x, y, w, h);

        // --- 創造的エフェクト：ハンバーガーが近づいて食べられる演出 ---
        ctx.save();
        
        // コマ数（i）に応じてハンバーガーの位置と形を計算
        // 後半のコマ（i >= 4）でハンバーガーがパクパク動く
        let foodY = y + h / 2; // 基本は画像の中央（口元あたり）
        let foodX = x + w / 2;
        let foodSize = 80;
        
        // 前半は右から近づいてくる、後半は口元で固定
        if (i < 4) {
            foodX = x + w + 50 - (i * 40); // 右からスライドイン
        } else {
            foodX = x + w / 2 + 10; // 口元あたり
        }

        // ハンバーガーのイラストを簡易的に描画（上バンズ、具、下バンズ）
        ctx.translate(foodX, foodY);
        
        // パクパクする動き（後半のコマで上下のバンズを動かす）
        let biteOffset = 0;
        if (i >= 4 && i % 2 === 0) {
            biteOffset = 8; // 口が開く瞬間
        }

        // 1. 下バンズ（茶色）
        ctx.fillStyle = "#CD853F";
        ctx.beginPath();
        ctx.arc(0, 15 + biteOffset, foodSize/2, 0, Math.PI, false);
        ctx.fill();

        // 2. 具：パティとチーズ（焦げ茶と黄色）
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(-foodSize/2, -5, foodSize, 15);
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(-foodSize/2 + 5, 5, foodSize - 10, 4);

        // 3. 上バンズ（茶色・丸み）
        ctx.fillStyle = "#CD853F";
        ctx.beginPath();
        ctx.arc(0, -5 - biteOffset, foodSize/2, Math.PI, 0, false);
        ctx.fill();

        // 「MUNCH!（もぐもぐ）」という文字を後半に出現させる
        if (i >= 4) {
            ctx.fillStyle = "#FF3B30";
            ctx.font = "bold 24px 'Arial Black'";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 4;
            ctx.strokeText("MUNCH!", -40, -50 - biteOffset);
            ctx.fillText("MUNCH!", -40, -50 - biteOffset);
        }

        ctx.restore();

        // コマを保存
        frames.push(canvas.toDataURL('image/png'));
    }

    // 4. GIFを1つに統合
    gifshot.createGIF({
        images: frames,
        gifWidth: size,
        gifHeight: size,
        interval: 0.12, // 再生速度
        numWorkers: 2
    }, (obj) => {
        generateBtn.disabled = false;
        
        if (!obj.error) {
            const gifUrl = obj.image;
            resultDiv.innerHTML = `
                <h3>🍔 もぐもぐスタンプ完成！</h3>
                <img src="${gifUrl}" alt="Munching GIF"><br>
                <a href="${gifUrl}" download="munch-stamp.gif" class="download-btn">📥 GIFを保存する</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: red;">エラー: ${obj.errorMsg}</p>`;
        }
    });
});
