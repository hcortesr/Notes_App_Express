const btnSafe = document.getElementById('create_new');
const btnDlt = document.getElementById('delete_all');
const btnDltClose = document.getElementById('btn-cancel');
const newNoteWindow = document.getElementById('new-card-screen-container');
const deleteAllWindow = document.getElementById('delete-cards-container');
const deleteAllWindowClose = document.getElementById('newcard-close');
const btnSafeAction = document.getElementById('newcard-btn');
const optRed = document.getElementById('color-red');
const optGreen = document.getElementById('color-green');
const optBlue = document.getElementById('color-blue');
const optYell = document.getElementById('color-yellow');
const optRedEdit = document.getElementById('edit-color-red');
const optGreenEdit = document.getElementById('edit-color-green');
const optBlueEdit = document.getElementById('edit-color-blue');
const optYellEdit = document.getElementById('edit-color-yellow');
const btnDltAction = document.getElementById('btn-yes');
const bigScreen = document.getElementById('big-screen');
const cardsContainer = document.getElementById('cards-container');
const inputTitle = document.getElementById('newcard-title');
const inputContent = document.getElementById('newcard-content');



btnSafe.addEventListener('click', () => {
    inputContent.value = "";
    inputTitle.value = "";
    newNoteWindow.style.visibility = 'visible';
});
btnDlt.addEventListener('click', () => deleteAllWindow.style.visibility = 'visible');
btnDltClose.addEventListener('click', () => deleteAllWindow.style.visibility = 'hidden')
deleteAllWindowClose.addEventListener('click', () => newNoteWindow.style.visibility = 'hidden');