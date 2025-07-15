// script.js

const topTextInput = document.getElementById("topText");
const bottomTextInput = document.getElementById("bottomText");
const imageInput = document.getElementById("imageInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
const galleryContainer = document.getElementById("galleryContainer");
const gallery = document.getElementById("gallery");
const leaderboard = document.getElementById("leaderboard");
const toggleGalleryBtn = document.getElementById("toggleGalleryBtn");

let currentImage = null;

// Draw meme on canvas
function drawMeme(image, topText, bottomText) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";

  ctx.fillText(topText, canvas.width / 2, 40);
  ctx.strokeText(topText, canvas.width / 2, 40);

  ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
  ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
}

// Save meme to localStorage
function saveMeme(dataURL) {
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  memes.push({ url: dataURL, likes: 0 });
  localStorage.setItem("memes", JSON.stringify(memes));
  updateGallery();
}

// Generate meme
generateBtn.addEventListener("click", () => {
  if (!currentImage) return;
  drawMeme(currentImage, topTextInput.value, bottomTextInput.value);
  const dataURL = canvas.toDataURL();
  saveMeme(dataURL);
});

// Handle image upload
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      drawMeme(img, topTextInput.value, bottomTextInput.value);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Download meme
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Toggle gallery
toggleGalleryBtn.addEventListener("click", () => {
  galleryContainer.classList.toggle("hidden");
});

// Update gallery
function updateGallery() {
  gallery.innerHTML = "";
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  memes.forEach((meme, index) => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    const img = document.createElement("img");
    img.src = meme.url;

    const controls = document.createElement("div");
    controls.className = "gallery-controls";

    const likeBtn = document.createElement("button");
    likeBtn.textContent = `👍 ${meme.likes}`;
    likeBtn.onclick = () => {
      memes[index].likes += 1;
      localStorage.setItem("memes", JSON.stringify(memes));
      updateGallery();
      updateLeaderboard();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => {
      memes.splice(index, 1);
      localStorage.setItem("memes", JSON.stringify(memes));
      updateGallery();
      updateLeaderboard();
    };

    controls.appendChild(likeBtn);
    controls.appendChild(deleteBtn);
    div.appendChild(img);
    div.appendChild(controls);
    gallery.appendChild(div);
  });
}

// Update leaderboard
function updateLeaderboard() {
  leaderboard.innerHTML = "";
  const memes = JSON.parse(localStorage.getItem("memes") || "[]");
  const leaderboardData = {};

  memes.forEach((meme) => {
    const user = "Anonymous"; // Placeholder for future user ID
    if (!leaderboardData[user]) leaderboardData[user] = 0;
    leaderboardData[user] += meme.likes;
  });

  const sorted = Object.entries(leaderboardData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sorted.forEach(([user, score]) => {
    const li = document.createElement("li");
    li.className = "leader-entry";
    li.innerHTML = `<strong>${user}</strong><span>${score} Troll Points</span>`;
    leaderboard.appendChild(li);
  });
}

// Initial load
updateGallery();
updateLeaderboard();
