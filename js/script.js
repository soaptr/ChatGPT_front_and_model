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
    if (message.trim() === '') {
        return;
    }

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
    if (message.trim() === '') {
        return;
    }

    // Update the chat interface
    if (isUser) {
        updateUserChat(message);
    } else {
        updateChatGPTChat(message);
    }
}

// Event listeners for sending messages using Enter key or Send button
document.getElementById('send-button').addEventListener('click', () => {
    const inputField = document.getElementById('input-field');
    const message = inputField.value;
    sendMessageAndUpdateHistory(activeChat, message, true);
    inputField.value = '';
    // Simulate ChatGPT's reply (you can replace this with your actual ChatGPT interaction)
    const chatGPTReply = "ChatGPT: I am a response from ChatGPT.";
    sendMessageAndUpdateHistory(activeChat, chatGPTReply, false);
});

document.getElementById('input-field').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const inputField = document.getElementById('input-field');
        const message = inputField.value;
        sendMessageAndUpdateHistory(activeChat, message, true);
        inputField.value = '';
        // Simulate ChatGPT's reply (you can replace this with your actual ChatGPT interaction)
        const chatGPTReply = "ChatGPT: I am a response from ChatGPT.";
        sendMessageAndUpdateHistory(activeChat, chatGPTReply, false);
    }
});


// Function to add a new chat
function addNewChat(chatName) {
    const chatList = document.querySelector('.chat-list');
    const chatButton = document.createElement('a');
    chatButton.href = '#';
    chatButton.className = 'chat-button';
    chatButton.textContent = chatName;
    chatList.appendChild(chatButton);
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

// Example of populating the chat list with initial demo chats
addNewChat('Chat 1');
addNewChat('Chat 2');
addNewChat('Chat 3');

// Example of switching to a chat and displaying chat history
let activeChat = 'Chat 1'; // Set an initial active chat
const chatButtons = document.querySelectorAll('.chat-button');
chatButtons[0].classList.add('active-chat-button');
chatButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        switchChat(button, button.textContent);
        activeChat = button.textContent; // Update the active chat
    });
});