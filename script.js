const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//Create a new message element and return it
const createMessageElement = (content, className) => {
    const div = document.createElement ("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
}

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();

    if (!userMessage) return; //Exit if there is no message

    console.log(userMessage);

    const html = `<div class="message-content">
                    <img src="./images/gemini.svg" alt="Gemini Image" class="avatar">
                    <p class="text"></p>
                </div>`
    
    const outgoingMessageDiv = createMessageElement (html, "outgoing");

    //Creating an element of outgoing messages and adding it to the chat list
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    
    chatList.appendChild(outgoingMessageDiv);
}

//Prevent default form submission and handle ougoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the page from refreshing and goes to the function below

    handleOutgoingChat();
});