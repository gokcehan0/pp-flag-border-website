let selectedBackgroundUrl = '';

document.getElementById('photoInput').addEventListener('change', function (event) {
    const photoFile = event.target.files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('photo').src = e.target.result;
        }
        reader.readAsDataURL(photoFile);
    }
});

document.getElementById('backgroundInput').addEventListener('change', function (event) {
    const backgroundFile = event.target.files[0];
    if (backgroundFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('background').style.backgroundImage = `url(${e.target.result})`;
            selectedBackgroundUrl = e.target.result;
        }
        reader.readAsDataURL(backgroundFile);
    }
});

document.getElementById('countrySelect').addEventListener('change', function (event) {
    const countryCode = event.target.value;
    if (countryCode) {
        selectedBackgroundUrl = `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${countryCode.toLowerCase()}.png`;
        document.getElementById('background').style.backgroundImage = `url(${selectedBackgroundUrl})`;
    }
});

async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        const countrySelect = document.getElementById('countrySelect');

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca2;
            option.textContent = country.name.common;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error('error country loading:', error);
    }
}

window.addEventListener('load', loadCountries);

document.getElementById('downloadBtn').addEventListener('click', function () {
const photo = document.getElementById('photo');
if (!photo.src) {
alert('Please upload a photo first.');
return;
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 220;
canvas.height = 220;

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.save();
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
ctx.closePath();
ctx.clip();

const backgroundImage = new Image();
backgroundImage.crossOrigin = 'Anonymous';
backgroundImage.src = selectedBackgroundUrl;

backgroundImage.onload = function () {
ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

const photoImage = new Image();
photoImage.src = photo.src;

photoImage.onload = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - 20) / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const size = canvas.width - 20;
    const aspectRatio = photoImage.width / photoImage.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (aspectRatio > 1) {
        drawWidth = size * aspectRatio;
        drawHeight = size;
        offsetX = (drawWidth - size) / 2;
        offsetY = 0;
    } else {
        drawWidth = size;
        drawHeight = size / aspectRatio;
        offsetX = 0;
        offsetY = (drawHeight - size) / 2;
    }

    ctx.drawImage(photoImage, 10 - offsetX, 10 - offsetY, drawWidth, drawHeight);
    ctx.restore();

    const link = document.createElement('a');
    link.download = 'photo_with_background.png';
    link.href = canvas.toDataURL();
    link.click();
};
};
});
