let selectedBackgroundUrl = '';

document.getElementById('photoInput').addEventListener('change', function (event) {
  const photoFile = event.target.files[0];
  if (photoFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('photo').src = e.target.result;
    };
    reader.readAsDataURL(photoFile);
  }
});

document.getElementById('countrySelect').addEventListener('change', function (event) {
  const code = event.target.value.toLowerCase();
  if (code) {
    selectedBackgroundUrl = `https://flagcdn.com/w1280/${code}.png`; // En yüksek çözünürlük
    document.getElementById('background').style.backgroundImage = `url(${selectedBackgroundUrl})`;
  } else {
    selectedBackgroundUrl = '';
    document.getElementById('background').style.backgroundImage = '';
  }
});


document.getElementById('downloadBtn').addEventListener('click', function () {
  const photo = document.getElementById('photo');
  if (!photo.src) {
    alert('Please upload a photo first.');
    return;
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 880;  // Yüksek çözünürlük
  canvas.height = 880;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const backgroundImg = new Image();
  backgroundImg.crossOrigin = "anonymous";
  backgroundImg.src = selectedBackgroundUrl;

  backgroundImg.onload = function () {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    const photoImg = new Image();
    photoImg.src = photo.src;

    photoImg.onload = function () {
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - 80) / 2, 0, Math.PI * 2);
      ctx.clip();

      const size = canvas.width - 80;
      const aspect = photoImg.width / photoImg.height;
      let drawWidth = size, drawHeight = size, offsetX = 0, offsetY = 0;

      if (aspect > 1) {
        drawWidth = size * aspect;
        offsetX = (drawWidth - size) / 2;
      } else {
        drawHeight = size / aspect;
        offsetY = (drawHeight - size) / 2;
      }

      ctx.drawImage(photoImg, 40 - offsetX, 40 - offsetY, drawWidth, drawHeight);
      ctx.restore();

      const a = document.createElement('a');
      a.download = 'flag-overlay-highres.png';
      a.href = canvas.toDataURL('image/png', 1.0); // En yüksek kalite
      a.click();
    };
  };
});
