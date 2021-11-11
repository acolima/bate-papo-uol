// Carrega página 
function loadPage() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promise.then(loadMessages);
}

// Re-carrega as mensagens a cada 3 segundos
setInterval(loadPage, 3000);

// Carrega mensagens
function loadMessages(response) {
    const messages = response.data;
    const messageBox = document.querySelector(".messages");


    for(let i = 0; i < 10; i++){
        let message = messages[i];
        if(message.type === "status"){
            messageBox.innerHTML += `
                <li class="element ${message.type}">
                    <p>${message.time} ${message.from} ${message.text}</p>
                </li>`
        }
        else if(message.type === "message"){
            messageBox.innerHTML += `
                <li class="element ${message.type} ">
                    <p>${message.time} ${message.from} para ${message.to}: ${message.text}</p>
                </li>`
        }
        else {
            messageBox.innerHTML += `
                <li class="element ${message.type} ">
                    <p>${message.time} ${message.from} reservadamente para ${message.to}: ${message.text}</p>
                </li>`
        }
    }
    const ultimoElemento = document.querySelector(".messages li:last-child");
    ultimoElemento.scrollIntoView();
}

