const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let galleryMemes = JSON.parse(localStorage.getItem('galleryMemes')) || [];

function drawMeme() {
  const topText = document.getElementById('topText').value.toUpperCase();
  const bottomText = document.getElementById('bottomText').value.toUpperCase();
  const imageInput = document.getElementById('imageUpload').files[0];

  if (!imageInput) return alert("Upload an image first!");

  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      canvas.width = 400;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(topText, canvas.width / 2, 30);
      ctx.strokeText(topText, canvas.width / 2, 30);
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 10);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 10);
      saveToGallery(canvas.toDataURL("image/png"));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(imageInput);
}

function saveToGallery(imgData) {
  const uploadPreset = 'gptroll_unsigned';
  const cloudName = 'your_cloud_name'; // Replace this with your actual Cloudinary name

  const formData = new FormData();
  formData.append('file', imgData);
  formData.append('upload_preset', uploadPreset);

  fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const hostedURL = data.secure_url;
      const meme = {
        id: Date.now(),
        url: hostedURL,
        likes: 0,
        timestamp: new Date()
      };
      galleryMemes.unshift(meme);
      localStorage.setItem('galleryMemes', JSON.stringify(galleryMemes));
      updateGallery();

      const tweetText = encodeURIComponent("🤣 Trolling with $GPTROLL – Join the meme chaos!");
      const tweetURL = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(hostedURL)}`;
      const shareButton = document.getElementById('shareButton');
      shareButton.href = tweetURL;
      shareButton.style.display = 'inline-block';
    })
    .catch(err => console.error("Upload error:", err));
}

function updateGallery() {
  const container = document.getElementById('memeGallery');
  container.innerHTML = '';
  galleryMemes.forEach(meme => {
    const div = document.createElement('div');
    div.className = 'meme-item';
    div.innerHTML = \`
      <img src="\${meme.url}" />
      <div class="meme-actions">
        <button onclick="likeMeme(\${meme.id})">❤️ \${meme.likes}</button>
        <button onclick="deleteMeme(\${meme.id})">🗑️</button>
      </div>
    \`;
    container.appendChild(div);
  });
}

function likeMeme(id) {
  const meme = galleryMemes.find(m => m.id === id);
  if (meme) {
    meme.likes++;
    localStorage.setItem('galleryMemes', JSON.stringify(galleryMemes));
    updateGallery();
  }
}

function deleteMeme(id) {
  galleryMemes = galleryMemes.filter(m => m.id !== id);
  localStorage.setItem('galleryMemes', JSON.stringify(galleryMemes));
  updateGallery();
}

function sortGallery(order) {
  galleryMemes.sort((a, b) => order === 'newest' ? b.id - a.id : a.id - b.id);
  updateGallery();
}

function toggleGallery() {
  const gallery = document.getElementById('gallerySection');
  gallery.style.display = gallery.style.display === 'none' ? 'block' : 'none';
}

function downloadMeme() {
  const link = document.createElement('a');
  link.download = 'gptroll-meme.png';
  link.href = canvas.toDataURL();
  link.click();
}

window.onload = updateGallery;
