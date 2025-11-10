function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById('previewImg');
  const uploadBox = document.getElementById('uploadBox');

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result; // set preview image source
      preview.style.display = 'block'; // show image
      uploadBox.classList.add('uploaded'); // hide upload icon
    }
    reader.readAsDataURL(input.files[0]);
  }
}




function togglePassword(id, icon) {
  const input = document.getElementById(id);
  const isHidden = input.type === "password";

  // toggle input type
  input.type = isHidden ? "text" : "password";

  // update icon image
  icon.src = isHidden 
    ? "/Frontend/IMAGES/hide.png"   // kapag nag-show
    : "/Frontend/IMAGES/view.png";  // kapag nag-hide
}

const dialog = document.getElementById('dialog');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const form = document.getElementById('signupForm');

form.addEventListener('submit', function(e){
  e.preventDefault();
  dialog.style.display = 'flex'; // show modal
});

confirmBtn.addEventListener('click', function(){
  form.submit(); // submit the form after confirmation
});

cancelBtn.addEventListener('click', function(){
  dialog.style.display = 'none'; // hide modal
});
