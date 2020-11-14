// open mobile menu

let button = document.querySelector('.hamburger');
let drawer = document.querySelector(".header-menu-drawer");

button.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('I am here');
  drawer.classList.toggle('show-nav');
})