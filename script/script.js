let username;
let participantName = ""; // participante para conversar reservado
let visibility = "message"; //por padrão, vai ser público

// Verifica nome do usuário
function verifyUserName() {
    username = prompt("Digite seu nome de usuário");

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v4/uol/participants", {name: username});

    promise.then(loadPage);
    promise.catch(userError);

    loadParticipants();
}

function userError(error) {
    alert("Esse nome de usuário já está em uso");
    verifyUserName();
}

verifyUserName();
setInterval(checkUserConected, 5000, username);
setInterval(loadPage, 3000);
setInterval(loadParticipants, 10000)

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
        else if(message.type === "private_message"){
            if(message.to === username){
                messageBox.innerHTML += `
                    <li class="private-message" data-identifier="message">
                        <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> reservadamente para ${message.to}: ${message.text}</p>
                    </li>`
            }
        }
    }
    const ultimoElemento = document.querySelector(".messages li:last-child");
    ultimoElemento.scrollIntoView();
}


function checkUserConected() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: username});

    promise.catch((error) => console.log(error.response.data.message));
}

// Botão para enviar mensagens
function sendMessage() {
    let messageInput = document.querySelector(".text-message");
    let message = {};


    if(visibility === "message"){
        message = {
            from: username,
            to: "Todos",
            text: messageInput.value,
            type: "message"
        }
    }else{
        message = {
            from: username,
            to: participantName,
            text: messageInput.value,
            type: "private_message"
        }
    }

    messageInput.value = "";

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
    
    promise.then(loadPage);
    promise.catch((error) => window.location.reload());
}

function showParticipants(){
    const participants = document.querySelector("aside");
    const screen = document.querySelector(".screen");

    participants.classList.toggle("hide");
    screen.classList.toggle("hide");
}

function loadParticipants() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");

    promise.then(listParticipants);
}

function listParticipants(response) {
    const participants = response.data;
    const ulParticipants = document.querySelector(".participants-list");

    ulParticipants.innerHTML = `
        <li class="participant" onclick="chooseParticipant(this)">
            <span class="person">
                <ion-icon  name="people" ></ion-icon>
                <p class="personName">Todos</p>
            </span>
            <span class="check">
            <ion-icon name="checkmark"></ion-icon>
            </span>
        </li>
    `;

    for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];

        ulParticipants.innerHTML += `
            <li class="participant" onclick="chooseParticipant(this)">
                <span class="person">
                    <ion-icon  name="people" ></ion-icon>
                    <p class="personName">${participant.name}</p>
                    </span>
                <span class="check">
                    <ion-icon name="checkmark"></ion-icon>
                </span>
            </li>
        `
    }
}

function chooseParticipant(element) {
    const participantSelected = document.querySelector(".participant.selected");  
    const personElement = element.querySelector(".personName");
    const checkElement = element.querySelector(".check");
    
    if(participantSelected !== null){
        participantSelected.classList.remove("selected");
        checkElement.classList.remove("show");
    }
    element.classList.toggle("selected");
    checkElement.classList.toggle("show");

    participantName = personElement.innerHTML;
}

function chooseVisibility(element, type) {
    const typeSelected = document.querySelector(".type.selected");  
    const checkElement = element.querySelector(".check");
    const inputPrivateMessage = document.querySelector(".text-private");

    if(typeSelected !== null){
        typeSelected.classList.remove("selected");
        checkElement.classList.remove("show");
    }
    element.classList.toggle("selected");
    checkElement.classList.add("show");
    
    visibility = type;

    if(type === "message"){
        inputPrivateMessage.innerHTML = "";
    }
    else{
        inputPrivateMessage.innerHTML = `Enviando para ${participantName} (reservadamente)`;
    }
}
