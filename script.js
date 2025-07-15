document.getElementById("memeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const imageInput = document.getElementById("imageInput");
  const topText = document.getElementById("topText").value;
  const bottomText = document.getElementById("bottomText").value;
  const canvas = document.getElementById("memeCanvas");
  const ctx = canvas.getContext("2d");
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      // Draw the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = "30px Impact";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";

      // Top text
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 50);
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 50);

      // Bottom text
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);

      // Show download link
      const link = document.getElementById("downloadLink");
      link.href = canvas.toDataURL();
      link.style.display = "inline";
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(imageInput.files[0]);
});
