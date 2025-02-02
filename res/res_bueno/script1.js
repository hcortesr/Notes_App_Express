

// Big Screen
const bigCardTitle = document.getElementById('big-card-title');
const bigCardText = document.getElementById('big-card-text');
const bigCardDate = document.getElementById('big-card-date');
const bigCard = document.getElementById('big-card');
const bigCardClose = document.getElementById('big-card-close');

// Edit Window
const editNoteWindow = document.getElementById('edit-card-screen-container');
const editNoteForm = document.getElementById('edit-card-screen');
const editNoteClose = document.getElementById('editcard-close');
const editTitle = document.getElementById('editcard-title');
const editContent = document.getElementById('editcard-content');
const editColor = document.getElementById('editcard-color');
const editBtn = document.getElementById('editcard-btn');


class Note {
    constructor(title, content, color) {
        this.title = title;
        this.content = content;
        this.color = color;
        this.date = "fecha ex.";
    }
}

let setColor = "#ff6666";
let currentIndex = 0;
// Eventos
// btnSafeAction.addEventListener('click', () => { createNoteAction() });
optRed.addEventListener('click', () => chooseColor('red'));
optBlue.addEventListener('click', () => chooseColor('blue'));
optGreen.addEventListener('click', () => chooseColor('green'));
optYell.addEventListener('click', () => chooseColor('yellow'));

optRedEdit.addEventListener('click', () => chooseColor('red'));
optBlueEdit.addEventListener('click', () => chooseColor('blue'));
optGreenEdit.addEventListener('click', () => chooseColor('green'));
optYellEdit.addEventListener('click', () => chooseColor('yellow'));

editNoteWindow.addEventListener('submit', (event) => {
    event.preventDefault();
    editCardFun();
})

btnDltAction.addEventListener('click', () => {
    deleteAllFun();

})
bigCardClose.addEventListener('click', () => bigScreen.style.visibility = 'hidden');

editNoteClose.addEventListener('click', closeEditWindow);
editBtn.addEventListener('click', () => {
    arrayNotes[currentIndex].title = editTitle.value;
    arrayNotes[currentIndex].content = editContent.value;
    arrayNotes[currentIndex].color = setColor;
    renderNotes();
    closeEditWindow();
})
function getDateFormated() {
    const date = new Date();
    const dateText = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    return dateText
}

// Funciones
function saveCardsLocally() {
    localStorage.setItem('allCards', JSON.stringify(arrayNotes));
}
function deleteNote(index) {
    const id_card = arrayNotes[index]['id_card'];
    const datos = {
        id_card: id_card  // 'id_card' es la clave, 'id_card' (variable) es el valor
    };
    fetch('/delete_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: "",


    })
    renderNotes();
}
function openEditWindow(index) {
    editTitle.value = arrayNotes[index].title;
    editContent.value = arrayNotes[index].content;
    editNoteWindow.style.visibility = 'visible';
    currentIndex = index;
}
function closeEditWindow() {
    editNoteWindow.style.visibility = 'hidden';
}

function openBigScreen(title, text, date) {
    bigScreen.style.visibility = 'visible';
    bigCardTitle.textContent = title;
    bigCardText.textContent = text;
    bigCardDate.textContent = date;
    bigCard.style.backgroundColor = setColor;
}
function closeBigScreen() {
    bigScreen.style.visibility = 'hidden';
}



function chooseColor(color) {
    switch (color) {
        case "red": setColor = "#ff6666"; break;
        case "green": setColor = "#66ff66"; break;
        case "blue": setColor = "#6666e8"; break;
        case "yellow": setColor = "#f6f666"; break;
    }
}
function closeCreateNewNote() {
    newNoteWindow.style.visibility = 'hidden';

}
function createNoteAction() {

    const note = new Note(inputTitle.value, inputContent.value, setColor);
    // inputContent.value = "";
    // inputTitle.value = "";
    arrayNotes.push(note);

    showCards();
    closeCreateNewNote();

}


function renderNotes() {

    let newMainContent = "";
    arrayNotes.forEach((element, index) => {
        let textAux = `openBigScreen('${element.title}', '${element.content}', '${element.date}')`;

        const noteText = `
        <div class="card" style="background-color: ${element.color}">
            <h2>${element.title}</h2>
            <p class="card-text">${element.content}</p>
            <p class="card-date">${getDateFormated()}</p>
            <div class="card-option">
                <i onclick="${textAux}" class='bx bxs-info-circle bx-md card-option-white'></i>
                <i onclick="openEditWindow(${index})" class='bx bxs-edit-alt bx-md card-option-white'></i>
                <i onclick="deleteNote(${index})" class='bx bxs-trash bx-md card-option-white'></i>
            </div>
        </div>`;

        newMainContent += noteText;


    })
    cardsContainer.innerHTML = newMainContent;
    saveCardsLocally();
}

// ------------------------------------------ Funciones fetch()
function showCards() {
    fetch('/home/getCards', {
        method: 'get',
    })
        .then(res => res.json())
        .then(data => {
            arrayNotes = data;
            renderNotes();
        });

}
function deleteAllFun() {
    fetch('/home/deleteAll', {
        method: 'delete',
    }).then(res => {
        showCards()
        deleteAllWindow.style.visibility = 'hidden'

    });
}

function editCardFun() {
    console.log("editCard")
    fetch('/home/editCard', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...Object.fromEntries(new FormData(editNoteForm).entries()),
            id_card: arrayNotes[currentIndex]['id_card'],
        })
    }).then(res => {
        showCards();

    }).then(() => {
        editNoteWindow.style.visibility = 'hidden';
    })
}


showCards();
