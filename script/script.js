let username; // nome do usuário
let participantName = "Todos"; // participante para conversar 
let visibility = "message"; //por padrão, vai ser público
let loadFirstTime = 0; // para carregar os participantes ativos quando a página carregar

// Verifica nome do usuário
function verifyUserName() {
    const usernameInput = document.querySelector(".login-screen input");

    username = usernameInput.value;

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", {name: username});

    promise.then(hideLoginScreen);
    promise.catch(userError);
}

// Esconde a tela de login
function hideLoginScreen(response) {
    const login = document.querySelector(".login");
    const screen = document.querySelector(".login-screen");

    login.innerHTML = `
        <img src="assets/loading.gif" alt="Gif de carregamento">
        <p style="font-size: 18px">Entrando...</p>
    `;
    
    setTimeout(() => {
        screen.classList.add("hide");
    }, 3000); 
    loadPage();
    startIntervals();
}

function userError(error) {
    const errorUsername = document.querySelector(".login-screen p");

    errorUsername.classList.remove("hide");
}

function startIntervals(params) {   
    setInterval(userStatus, 5000);
    setInterval(loadPage, 3000);
    setInterval(loadParticipants, 10000)
}

// Carrega página 
function loadPage() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    
    if(loadFirstTime === 0){
        loadParticipants();
        loadFirstTime++;
    }

    promise.then(renderMessages);
}

// Carrega mensagens
function renderMessages(response) {
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
        else if(message.type === "private_message" && (message.to === username || message.from === username)){
            messageBox.innerHTML += `
                <li class="private-message" data-identifier="message">
                    <p><span class="time">(${message.time})</span> <span class="bold">${message.from}</span> reservadamente para <span class="bold">${message.to}</span>: ${message.text}</p>
                </li>`
        }
    }
    const lastMessage = document.querySelector(".messages li:last-child");
    lastMessage.scrollIntoView();
}

// Verificar se o usuário está conectado
function userStatus() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", {name: username});

    promise.catch((error) => console.log(error.response));
}

// Botão para enviar mensagens
function sendMessage() {
    let messageInput = document.querySelector(".message-text");
    let message = {};

    if(visibility === "message"){
        message = {
            from: username,
            to: participantName,
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
    resetPrivateInfo();
    resetVisibility(); 

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
    
    promise.then(loadPage);
    promise.catch((error) => window.location.reload());   
}
 // Enviar input com enter (mensagem e login)
function sendEnter(event, input) {
    let key = event.keyCode;

    if(key === 13){
        if(input.classList[0] === "message-text")
            sendMessage();
        else verifyUserName();
    }
}

// Mostrar/oculta a aba com a lista de participantes ativos
function showParticipants(){
    const participants = document.querySelector("aside");

    participants.classList.toggle("hide");
}

// Re-carrega a lista de participantes ativos
function loadParticipants() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");    

    promise.then(listParticipants);

}

// Lista os participantes ativos
function listParticipants(response) {
    const participants = response.data;
    const ulParticipants = document.querySelector(".participants-list");
  
    ulParticipants.innerHTML = `
          <li class="participant selected" onclick="selectParticipant(this)" data-identifier="participant">
              <span class="person">
                  <ion-icon  name="people" ></ion-icon>
                  <p class="personName">Todos</p>
              </span>
              <span class="check show">
              <ion-icon name="checkmark"></ion-icon>
              </span>
          </li>`;
  
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
  
      ulParticipants.innerHTML += `
              <li class="participant" onclick="selectParticipant(this)" data-identifier="participant">
                  <span class="person">
                      <ion-icon  name="people" ></ion-icon>
                      <p class="personName">${participant.name}</p>
                      </span>
                  <span class="check">
                      <ion-icon name="checkmark"></ion-icon>
                  </span>
              </li>`;
    }
}

// Escolhe um participante para conversar
function selectParticipant(element) {
    const participantSelected = document.querySelector(".participant.selected");  
    participantName = element.querySelector(".personName").innerHTML;
    const checkElement = element.querySelector(".check");
    
    if(participantSelected !== null){
        participantSelected.classList.remove("selected");
        checkElement.classList.remove("show");
    }
    element.classList.toggle("selected");
    checkElement.classList.toggle("show");

    changeInput();
}

// Escolhe o tipo de visibilidade da mensagem
function chooseVisibility(element, type) {
    const typeSelected = document.querySelector(".type.selected");  
    const checkElement = element.querySelector(".check");

    if(typeSelected !== null){
        typeSelected.classList.remove("selected");
        checkElement.classList.remove("show");
    }
    element.classList.toggle("selected");
    checkElement.classList.add("show");
    
    visibility = type;
    changeInput();
}

// Altera o texto do input para mensagem privada
function changeInput() {
    const inputPrivateMessage = document.querySelector(".text-private");

    if(visibility === "message")
        inputPrivateMessage.innerHTML = "";
    else
        inputPrivateMessage.innerHTML = `Enviando para ${participantName} (reservadamente)`;
}

// Reseta o input de mensagem privada quando enviar a mensagem
function resetPrivateInfo(){
    let inputPrivateMessage = document.querySelector(".text-private");

    inputPrivateMessage.innerHTML = ""; 
    participantName = "Todos"; // depois que envia a mensagem, volta a mandar mensagem para todos
}

// Reseta visibilidade para público quando enviar a mensagem
function resetVisibility() {
    const typeSelected = document.querySelector(".type");  
    chooseVisibility(typeSelected, "message")
}