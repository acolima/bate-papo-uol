let username;

// Verifica nome do usuário
function verifyUserName() {
    username = prompt("Digite seu nome de usuário");

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/participants", {name: username});

    promise.then(loadPage);
    promise.catch(userError);
}

function userError(error) {
    alert("Esse nome de usuário já está em uso");
    verifyUserName();
}

verifyUserName();
setInterval(checkUserConected, 5000, username);
setInterval(loadPage, 3000);

// Carrega página 
function loadPage(response) {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promise.then(loadMessages);
}

// Carrega mensagens
function loadMessages(response) {
    const messages = response.data;
    const messageBox = document.querySelector(".messages");

    messageBox.innerHTML = "";

    for(let i = 0; i < messages.length; i++){
        let message = messages[i];
        if(message.type === "status"){
            messageBox.innerHTML += `
                <li class="status" data-identifier="message">
                    <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> ${message.text}</p>
                </li>`
        }
        else if(message.type === "message"){
            messageBox.innerHTML += `
                <li class="message" data-identifier="message">
                    <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> para </span> <span class="bold">${message.to}</span>: ${message.text}</p>
                </li>`
        }
        else if(message.type === "private-message"){
            messageBox.innerHTML += `
                <li class="private-message" data-identifier="message">
                    <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> reservadamente para ${message.to}: ${message.text}</p>
                </li>`
        }
    }
    const ultimoElemento = document.querySelector(".messages li:last-child");
    ultimoElemento.scrollIntoView();
}


function checkUserConected() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: username});

    promise.then((response) => console.log(response.data));
    promise.catch((error) => console.log(error.response.data.message));
}

// Botão para enviar mensagens
function sendMessage() {
}

