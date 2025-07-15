const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const gallery = document.getElementById('gallery');
const leaderboardList = document.getElementById('leaderboardList');
const shareContainer = document.getElementById('shareContainer');

let image = null;
let memes = JSON.parse(localStorage.getItem('memes') || '[]');
let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

function generateMeme() {
  const topText = document.getElementById('topText').value;
  const bottomText = document.getElementById('bottomText').value;
  const file = document.getElementById('imageUpload').files[0];

  if (!file) return alert("Please upload an image.");

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      canvas.width = 400;
      canvas.height = 400;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = '20px Impact';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';

      ctx.fillText(topText, canvas.width / 2, 30);
      ctx.strokeText(topText, canvas.width / 2, 30);

      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 10);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 10);

      const url = canvas.toDataURL();
      addToGallery(url);
      updateShareButton(url);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function addToGallery(dataUrl) {
  memes.push({ image: dataUrl, likes: 0 });
  localStorage.setItem('memes', JSON.stringify(memes));
  renderGallery();
}

function renderGallery() {
  gallery.innerHTML = '';

  memes.forEach((meme, index) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = meme.image;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const likeBtn = document.createElement('button');
    likeBtn.textContent = `👍 ${meme.likes}`;
    likeBtn.onclick = () => {
      meme.likes++;
      leaderboard.push({ image: meme.image, likes: meme.likes });
      localStorage.setItem('memes', JSON.stringify(memes));
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      renderGallery();
      updateLeaderboard();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.onclick = () => {
      memes.splice(index, 1);
      localStorage.setItem('memes', JSON.stringify(memes));
      renderGallery();
    };

    actions.appendChild(likeBtn);
    actions.appendChild(deleteBtn);
    div.appendChild(actions);
    div.appendChild(img);
    gallery.appendChild(div);
  });
}

function downloadMeme() {
  const link = document.createElement('a');
  link.download = 'gptroll-meme.png';
  link.href = canvas.toDataURL();
  link.click();
}

function toggleGallery() {
  gallery.classList.toggle('hidden');
}

function updateLeaderboard() {
  const sorted = [...memes].sort((a, b) => b.likes - a.likes);
  leaderboardList.innerHTML = '';
  sorted.slice(0, 5).forEach((meme, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i + 1} – ${meme.likes} Troll Points`;
    leaderboardList.appendChild(li);
  });
}

function updateShareButton(dataUrl) {
  shareContainer.innerHTML = '';

  const twitterShare = document.createElement('a');
  twitterShare.href = `https://twitter.com/intent/tweet?text=Check%20out%20my%20meme%20from%20GPTROLL!&url=${encodeURIComponent(dataUrl)}`;
  twitterShare.target = "_blank";
  twitterShare.textContent = 'Share to X';
  twitterShare.style.color = '#00ff00';
  twitterShare.style.display = 'inline-block';
  twitterShare.style.marginTop = '10px';

  shareContainer.appendChild(twitterShare);
}

// Load on page
renderGallery();
updateLeaderboard();
