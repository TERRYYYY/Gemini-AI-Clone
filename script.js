const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

let userMessage = null;

//API Configuration
const GEMINI_API_KEY = "AIzaSyBlsFQ1T9wRhujejqhQhkgqBbUoOqBLRWU";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;


//Local Storage Data
const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

    //Apply the stored theme
    document.body.classList.toggle("light_mode", isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    //Restore saved chats
    // chatList.innerHTML = savedChats || "";

    // Hide header once chatting has started
    document.body.classList.toggle("hide-header", savedChats);

    //Scroll to the bottom
    chatList.scrollTo(0, chatList.scrollHeight);
}

loadLocalStorageData();



//Create a new message element and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement ("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}



// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        //Append each word to the text element with a space
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");

        //If all words are displayed
        if(currentWordIndex === words.length){
            clearInterval(typingInterval);
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");

            //Save chats to local storage
            // localStorage.setItem("savedChats", chatList.innerHTML);
            
        }

        //Scroll to the bottom
        chatList.scrollTo(0, chatList.scrollHeight);
    }, 75);
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

        // Get the API response text and remove asterisks from it
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
        console.log(apiResponse);

        showTypingEffect(apiResponse, textElement, incomingMessageDiv);

        // textElement.innerText = apiResponse;

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
            <span onClick="copyMessage(this)" class="icon material-symbols-rounded"> content_copy </span>
            <span id="delete-chat-button" class="icon material-symbols-rounded">delete</span>`
    
    const incomingMessageDiv = createMessageElement (html, "incoming", "loading");

    //Creating an element of outgoing messages and adding it to the chat list
    chatList.appendChild(incomingMessageDiv);

    //Scroll to the bottom
    chatList.scrollTo(0, chatList.scrollHeight);

    generateAPIResponse(incomingMessageDiv);

}


//Copy message text to the clipboard
const copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(messageText);
    copyIcon.innerText = "done"; //Show tick icon
    setTimeout(() => copyIcon.innerText = "content_copy", 1000); // Revert icon after 1 second
}


//Handles outgoing chat
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

    //Clear input field
    typingForm.reset(); 

    //Scroll to the bottom
    chatList.scrollTo(0, chatList.scrollHeight);

    // Hide header once chatting has started
    document.body.classList.add("hide-header");

    setTimeout(showLoadingAnimation, 500); //Show loading animation after a delay


    //Toggle between light mode and dark mode
    toggleThemeButton.addEventListener("click", () => {
        const isLightMode = document.body.classList.toggle("light_mode");

        localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
        toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
    });


    // Delete all chats from local storage when button is clicked
    deleteChatButton.addEventListener("click", () => {
        if(confirm("Are you sure you want to delete all messages?")) {
            localStorage.removeItem("savedChats");
            loadLocalStorageData();
        }
    });
}

//Prevent default form submission and handle ougoing chat
typingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the page from refreshing and goes to the function below

    handleOutgoingChat();
});