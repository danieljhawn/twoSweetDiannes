// window.onload = function () {
//   document.getElementById('ifCatalog').style.display = 'none';
//   document.getElementById('ifCustom').style.display = 'none';
// }
// function yesnoCheck() {
//   if (document.getElementById('yesCheck').checked) {
//     document.getElementById('ifCatalog').style.display = 'block';
//     document.getElementById('ifCustom').style.display = 'none';
//   }
//   else if (document.getElementById('noCheck').checked) {
//     document.getElementById('ifCustom').style.display = 'block';
//     document.getElementById('ifCatalog').style.display = 'none';
//   }
// }

let button = document.getElementById('button')

button.onclick = function () {

  let catalog = document.getElementById('catalog').checked;
  let custom = document.getElementById('custom').checked;
  console.log('customer wants' + catalog);
  console.log('customer wants ' + custom);
}