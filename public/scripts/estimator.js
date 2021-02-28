let button = document.getElementById('button')

let catalog = document.getElementById('catalog')
let custom = document.getElementById('custom')

catalog.addEventListener('change', showHide);
custom.addEventListener('change', showHide);

function showHide() {
  let occasion = document.querySelector('.occasion')
  let cookieOptions = document.querySelector('.cookie-options')
  if (catalog.checked) {
    occasion.style.display = 'block';
    cookieOptions.style.display = 'none';
  } else if (custom.checked) {
    cookieOptions.style.display = 'block';
    occasion.style.display = 'none';
  }
}
