const memeForm = document.getElementById('memeForm');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const downloadLink = document.getElementById('downloadLink');
const memeGallery = document.getElementById('memeGallery');

let galleryMemes = [];

memeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.font = 'bold 30px Impact';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';

      ctx.fillText(topTextInput.value, canvas.width / 2, 40);
      ctx.strokeText(topTextInput.value, canvas.width / 2, 40);

      ctx.fillText(bottomTextInput.value, canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomTextInput.value, canvas.width / 2, canvas.height - 20);

      const url = canvas.toDataURL('image/png');
      downloadLink.href = url;

      saveToGallery(url);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function saveToGallery(imgData) {
  const meme = {
    id: Date.now(),
    url: imgData,
    likes: 0,
    timestamp: new Date()
  };
  galleryMemes.unshift(meme);
  updateGallery();
}

function updateGallery() {
  if (galleryMemes.length === 0) {
    memeGallery.innerHTML = 'No memes yet. Be the first to troll the world!';
    return;
  }

  memeGallery.innerHTML = '';
  galleryMemes.forEach(meme => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${meme.url}" alt="Meme" />
      <div class="gallery-actions">
        <span>${meme.likes} ❤️</span>
        <button onclick="likeMeme(${meme.id})">Like</button>
        <button onclick="deleteMeme(${meme.id})">Delete</button>
      </div>
    `;
    memeGallery.appendChild(div);
  });
}

function likeMeme(id) {
  const meme = galleryMemes.find(m => m.id === id);
  if (meme) meme.likes++;
  updateGallery();
}

function deleteMeme(id) {
  galleryMemes = galleryMemes.filter(m => m.id !== id);
  updateGallery();
}

function sortGallery(order) {
  galleryMemes.sort((a, b) => {
    return order === 'newest'
      ? b.timestamp - a.timestamp
      : a.timestamp - b.timestamp;
  });
  updateGallery();
}
