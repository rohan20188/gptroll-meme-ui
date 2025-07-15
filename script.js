const memeForm = document.getElementById("memeForm");
const imageInput = document.getElementById("imageInput");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const memeCanvas = document.getElementById("memeCanvas");
const downloadLink = document.getElementById("downloadLink");

const ctx = memeCanvas.getContext("2d");
let image = new Image();

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    image.onload = () => {
      drawMeme();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

memeForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (image.src) {
    drawMeme();
  }
});

function drawMeme() {
  // Clear canvas
  ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);

  // Draw image
  ctx.drawImage(image, 0, 0, memeCanvas.width, memeCanvas.height);

  // Style for text
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "bold 30px Impact";
  ctx.textAlign = "center";

  // Draw top text
  ctx.strokeText(topText.value, memeCanvas.width / 2, 40);
  ctx.fillText(topText.value, memeCanvas.width / 2, 40);

  // Draw bottom text
  ctx.strokeText(bottomText.value, memeCanvas.width / 2, memeCanvas.height - 20);
  ctx.fillText(bottomText.value, memeCanvas.width / 2, memeCanvas.height - 20);

  // Set download link
  const dataURL = memeCanvas.toDataURL("image/png");
  downloadLink.href = dataURL;
  downloadLink.style.display = "block"; // Make sure it's visible
}

