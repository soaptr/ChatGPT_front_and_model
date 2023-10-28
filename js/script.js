// Function to update the chat interface with a user message
function updateUserChat(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user-message';
    userBubble.textContent = message;
    chatMessages.appendChild(userBubble);
}

// Function to update the chat interface with a ChatGPT reply
function updateChatGPTChat(reply) {
    const chatMessages = document.querySelector('.chat-messages');
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble chatGPT-message';
    chatBubble.textContent = reply;
    chatMessages.appendChild(chatBubble);
}

// Function to send a message and update chat history
function sendMessageAndUpdateHistory(chatName, message, isUser = false) {
//    if (message.trim() === '') {
//        return;
//    }

    // Add the message to the chat history
    if (!chatHistories[chatName]) {
        chatHistories[chatName] = [];
    }

    chatHistories[chatName].push({
        isUser,
        message
    });

    // Update the chat interface
    if (isUser) {
        updateUserChat(message);
    } else {
        updateChatGPTChat(message);
    }
}

function readHistory(chatName, message, isUser = false) {
//    if (message.trim() === '') {
//        return;
//    }

    // Update the chat interface
    if (isUser) {
        updateUserChat(message);
    } else {
        updateChatGPTChat(message);
    }
}

async function getGPTReply(message) {

    const apiUrl = 'http://localhost:8000/process_message/';

    return new Promise((resolve, reject) => {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Response not okay');
            }
        })
        .then(data => {
            const responseText = data.response;
            resolve(responseText); // Resolve the Promise with the response
        })
        .catch(error => {
            reject(error); // Reject the Promise if there is an error
        });
    });

}

// Event listeners for sending messages using Enter key or Send button
document.getElementById('send-button').addEventListener('click', () => {
    const inputField = document.getElementById('input-field');
    const message = inputField.value;
    sendMessageAndUpdateHistory(activeChat, message, true);
    inputField.value = '';
    getGPTReply(message).then(resolve => {
        sendMessageAndUpdateHistory(activeChat, resolve, false);
    });
});

document.getElementById('input-field').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const inputField = document.getElementById('input-field');
        const message = inputField.value;
        sendMessageAndUpdateHistory(activeChat, message, true);
        inputField.value = '';
        getGPTReply(message).then(resolve => {
            sendMessageAndUpdateHistory(activeChat, resolve, false);
        });
    }
});


// Function to add a new chat
function addNewChatButton(chatName) {
    const chatList = document.querySelector('.chat-list');
    const chatButton = document.createElement('a');
    chatButton.href = '#';
    chatButton.className = 'chat-button';
    chatButton.textContent = chatName;
    chatList.appendChild(chatButton);

    // Event listener to switch to the new chat when the chat button is clicked
    chatButton.addEventListener('click', (event) => {
        event.preventDefault();
        switchChat(chatButton, chatName);
        activeChat = chatName;
    });
}

// Define an object to store chat histories
let chatHistories = {};

// Function to switch between chats and display chat history
function switchChat(chatButton, chatName) {
    // Remove active class from all chat buttons
    const chatButtons = document.querySelectorAll('.chat-button');
    chatButtons.forEach(button => {
        button.classList.remove('active-chat-button');
    });

    // Highlight the active chat button
    chatButton.classList.add('active-chat-button');

    // Load and display chat history for the selected chat
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = ''; // Clear the chat interface

    if (chatHistories[chatName]) {
        chatHistories[chatName].forEach(entry => {
            readHistory(chatName, entry.message, entry.isUser);
        });
    }
}

// Example of switching to a chat and displaying chat history
const chatButtons = document.querySelectorAll('.chat-button');
chatButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        switchChat(button, button.textContent);
        activeChat = button.textContent; // Update the active chat
    });
});

let id = 0;

// Event listener for the "Add New Chat" button
document.getElementById('add-chat-button').addEventListener('click', () => {
    // You can add your logic to create a new chat here
    var currentdate = new Date();
    var datetime = ++id + ". " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    const newChatName = datetime;
    if (newChatName) {
        addNewChatButton(newChatName);
        switchChat(document.querySelector('.chat-button:last-child'), newChatName);
        activeChat = newChatName;
    }
});

document.getElementById('add-chat-button').click();