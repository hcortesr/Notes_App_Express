const cardForm = document.getElementById('card_form');


cardForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;
    const id_card = document.getElementById('id_card').value;

    await fetch('/home/editCard', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "title": title,
            "content": content,
            "color": color,
            "id_card": id_card,
        }),
    })
        .then(res => console.log("Se evniaron los datos"));

})




