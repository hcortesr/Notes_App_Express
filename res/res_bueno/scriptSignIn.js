const newAlert = document.createElement('p');
const form = document.getElementById('login_container');
newAlert.id = 'warning-text';

function insertText(ele) {
    form.insertBefore(ele, form.children[4]);
}



form.addEventListener('submit', async (event) => {

    event.preventDefault();
    const formData = new FormData(form);

    formDataJSON = Object.fromEntries(formData.entries());


    if (event.submitter.value == 'Sign Up') {
        fetch('/logInPage/signUp', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJSON),
        })
            .then(res => res.text())
            .then(data => {


                if (data == "El usuario ya existe.") {
                    newAlert.textContent = data;
                    insertText(newAlert);

                } else {
                    const rute = JSON.parse(data).redirectTo;
                    window.location.href = rute;  // Redirige a la URL especificada en la respuesta
                }

            });

    } else if (event.submitter.value == 'Sign In') {
        fetch('/logInPage/signIn', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataJSON),
        })
            .then(res => res.text())
            .then(data => {


                if (data == "Hay un error con el usuario o la contraseña") {
                    newAlert.textContent = data;
                    insertText(newAlert);

                } else {
                    console.log(data);
                    const rute = JSON.parse(data).redirectTo;
                    window.location.href = rute;  // Redirige a la URL especificada en la respuesta
                }

            });

    }

})

// Not play the animation in the resizing of the window

window.addEventListener('resize', (e) => {
    console.log("Resizing");
    const main_title = document.querySelector('#main_title');
    main_title.style.animationPlayState = 'paused';
    main_title.style.animationDirection = 'reverse';

});