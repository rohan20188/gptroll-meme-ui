document.getElementById("memeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const fileInput = document.getElementById("imageInput");
  const preview = document.getElementById("memePreview");
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
});
