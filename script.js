window.onload = function () {
  const ids = [
    'emoji',
    'front',
    'background',
    'clear-color',
    'weight',
    'family',
  ];

  for (const id of ids) {
    const element = document.getElementById(id);
    element.addEventListener('input', (e) => {
      if (e.target.id === 'clear-color') {
        localStorage.setItem(e.target.id, e.target.checked);
      } else {
        localStorage.setItem(e.target.id, e.target.value);
      }
      this.update(e);
    });
    const saved = localStorage.getItem(id);
    if (saved) {
      if (element.id === 'clear-color') {
        element.checked = saved === 'true';
      } else {
        element.value = saved;
      }
    }
  }

  update();
};

function update() {
  const emoji = document.getElementById('emoji').value;
  const emojiTexts = emoji.split('\n');

  const family = document.getElementById('family').value;
  const weight = document.getElementById('weight').value;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  ctx.textAlign = 'center';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById('background').disabled = document.getElementById('clear-color').checked;
  if (!document.getElementById('clear-color').checked) {
    ctx.fillStyle = document.getElementById('background').value;
    ctx.fillRect(0, 0, 128, 128);
  }
  ctx.fillStyle = document.getElementById('front').value;

  const lineNumber = emojiTexts.length;
  const lineHeight = 130 / lineNumber;
  for (const i in emojiTexts) {
    const emojiText = emojiTexts[lineNumber - i - 1];

    const height = getCanvasTextHeight(emojiText, weight, family);
    const size = (128 - (lineNumber - 1) * 2) * height.heightRatio / lineNumber;
    const descent = size * height.descent;
    const font = `${weight} ${size}pt ${family}`;
    ctx.font = font;

    ctx.fillText(emojiText, 64, 128 - descent - lineHeight * i, 128);
  }

  const download = document.getElementById('download');
  download.href = canvas.toDataURL("image/png");
  download.download = 'emoji.png';
}

var getCanvasTextHeight = function (text, weight, family) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  ctx.font = `${weight} 128pt ${family}`;
  ctx.fillStyle = '#000000';
  ctx.fillText(text, 0, 600, 128);

  const pixels = ctx.getImageData(0, 0, 128, 1000);
  const data = pixels.data;
  var textBeginningRow = -1;
  var textEndRow = -1;
  for (var i = 0; i < data.length; i += 4) {
    const alpha = data[i+3];
    if (alpha > 0) {
      const row = Math.floor((i / 4) / 128);
      if (textBeginningRow === -1) { textBeginningRow = row; }
      textEndRow = row;
    }
  }

  return {
    heightRatio: 128 / (textEndRow - textBeginningRow),
    descent: (textEndRow - 600) / 128,
  };
};
