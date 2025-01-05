const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement ("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}


//Show Loading Animation while waiting for the API response
const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                <img src="images/gemini.svg" alt="Gemini Image" class="avatar">
                <p class="text"></p>

                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
            <span class="icon material-symbols-rounded"> content_copy </span>`
    
    const incomingMessageDiv = createMessageElement (html, "incoming", "loading");

    //Creating an element of outgoing messages and adding it to the chat list
    chatList.appendChild(incomingMessageDiv);

}

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();

    if (!userMessage) return; //Exit if there is no message

    // console.log(userMessage);

    const html = `<div class="message-content">
                    <img src="images/user5.jpg" alt="Gemini Image" class="avatar">
                    <p class="text"></p>
                </div>`
    
    const outgoingMessageDiv = createMessageElement (html, "outgoing");

    //Creating an element of outgoing messages and adding it to the chat list
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;

    chatList.appendChild(outgoingMessageDiv);


    typingForm.reset(); //Clear input field
    setTimeout(showLoadingAnimation, 500); //Show loading animation after a delay
}

//Prevent default form submission and handle ougoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the page from refreshing and goes to the function below

    handleOutgoingChat();
});