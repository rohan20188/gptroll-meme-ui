const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const imageUpload = document.getElementById("imageUpload");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const memeCanvas = document.getElementById("memeCanvas");
const toggleGalleryBtn = document.getElementById("toggleGalleryBtn");
const galleryContainer = document.getElementById("galleryContainer");
const gallery = document.getElementById("gallery");
const leaderboard = document.getElementById("leaderboard");
const shareXBtn = document.getElementById("shareXBtn");

const ctx = memeCanvas.getContext("2d");
let uploadedImage = null;

imageUpload.addEventListener("change", () => {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      drawMeme();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(imageUpload.files[0]);
});

function drawMeme() {
  if (!uploadedImage) return;

  memeCanvas.width = uploadedImage.width;
  memeCanvas.height = uploadedImage.height;
  ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
  ctx.drawImage(uploadedImage, 0, 0);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";

  ctx.fillText(topText.value.toUpperCase(), memeCanvas.width / 2, 50);
  ctx.strokeText(topText.value.toUpperCase(), memeCanvas.width / 2, 50);

  ctx.fillText(bottomText.value.toUpperCase(), memeCanvas.width / 2, memeCanvas.height - 20);
  ctx.strokeText(bottomText.value.toUpperCase(), memeCanvas.width / 2, memeCanvas.height - 20);
}

generateBtn.addEventListener("click", drawMeme);

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "gptroll_meme.png";
  link.href = memeCanvas.toDataURL();
  link.click();
  saveMemeToGallery(link.href);
});

toggleGalleryBtn.addEventListener("click", () => {
  galleryContainer.classList.toggle("hidden");
  toggleGalleryBtn.textContent = galleryContainer.classList.contains("hidden")
    ? "Show Meme Gallery"
    : "Hide Meme Gallery";
});

shareXBtn.addEventListener("click", () => {
  const tweetText = encodeURIComponent("Check out this troll-worthy meme I just made with #GPTROLL 😈👾 → https://gptroll-meme-generator.vercel.app");
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  window.open(tweetUrl, "_blank");
});

function saveMemeToGallery(dataURL) {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  memes.push({ src: dataURL, likes: 0 });
  localStorage.setItem("memes", JSON.stringify(memes));
  displayGallery();
  updateLeaderboard();
}

function displayGallery() {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  gallery.innerHTML = "";
  memes.forEach((meme, index) => {
    const memeDiv = document.createElement("div");
    memeDiv.className = "gallery-item";

    const img = document.createElement("img");
    img.src = meme.src;

    const controls = document.createElement("div");
    controls.className = "gallery-controls";

    const likeBtn = document.createElement("button");
    likeBtn.innerText = `👍 ${meme.likes}`;
    likeBtn.onclick = () => {
      meme.likes++;
      localStorage.setItem("memes", JSON.stringify(memes));
      displayGallery();
      updateLeaderboard();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑️";
    deleteBtn.onclick = () => {
      memes.splice(index, 1);
      localStorage.setItem("memes", JSON.stringify(memes));
      displayGallery();
      updateLeaderboard();
    };

    controls.appendChild(likeBtn);
    controls.appendChild(deleteBtn);
    memeDiv.appendChild(img);
    memeDiv.appendChild(controls);
    gallery.appendChild(memeDiv);
  });
}

function updateLeaderboard() {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  const scores = {};

  memes.forEach((meme) => {
    const user = "User"; // Replace with real user ID or wallet later
    scores[user] = (scores[user] || 0) + meme.likes;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  leaderboard.innerHTML = "<h2>Leaderboard</h2>";
  sorted.forEach(([user, score]) => {
    const entry = document.createElement("div");
    entry.className = "leader-entry";
    entry.innerHTML = `<span>${user}</span><span>${score} Troll Points</span>`;
    leaderboard.appendChild(entry);
  });
}

window.onload = () => {
  displayGallery();
  updateLeaderboard();
};
