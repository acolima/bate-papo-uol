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

function loadPage(response) {
    setInterval(reloadPage, 3000);
}

// Carrega página 
function reloadPage() {
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
                <li class="element status" data-identifier="message">
                    <p>${message.time} ${message.from} ${message.text}</p>
                </li>`
        }
        else if(message.type === "message"){
            messageBox.innerHTML += `
                <li class="element message" data-identifier="message">
                    <p>${message.time} ${message.from} para ${message.to}: ${message.text}</p>
                </li>`
        }
        else if(message.type === "private-message"){
            messageBox.innerHTML += `
                <li class="element private-message" data-identifier="message">
                    <p>${message.time} ${message.from} reservadamente para ${message.to}: ${message.text}</p>
                </li>`
        }
    }
    const ultimoElemento = document.querySelector(".messages li:last-child");
    ultimoElemento.scrollIntoView();
}


function checkUserConected() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: username});

    promise.then(usuarioOnline);
    promise.catch(usuarioOffline);
}

function usuarioOnline(response){
    console.log("ainda online");
}

function usuarioOffline(error) {
    console.log("deu ruim");
}

// Botão para enviar mensagens
function sendMessage() {
}

