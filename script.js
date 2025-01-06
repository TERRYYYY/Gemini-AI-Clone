const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

//API Configuration
const GEMINI_API_KEY = "AIzaSyBlsFQ1T9wRhujejqhQhkgqBbUoOqBLRWU";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

//Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement ("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}


//Generate API Response

// Fetch response from the API based on the user's message
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text"); // Get text element
    //Send a POST request to the API with the user's message
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMessage }]
                }]
            })
        });

        const data = await response.json();
        console.log(data);

        const apiResponse = data?.candidates[0].content.parts[0].text;
        console.log(apiResponse);

        textElement.innerText = apiResponse;

    } catch (error) {
        console.log(error);
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
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

    generateAPIResponse(incomingMessageDiv);

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