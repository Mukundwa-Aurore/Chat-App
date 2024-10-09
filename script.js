const socket = io('http://localhost:3000');
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
let messages = [];

socket.on('chat-message', data => {
    appendMessage(data, false);
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    appendMessage(message, true);
    messageInput.value = '';
});

function appendMessage(message, isOwnMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (isOwnMessage) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }

    const messageText = document.createElement('p');
    messageText.innerText = message;

    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icons');

    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-edit');
    editIcon.addEventListener('click', () => editMessage(messageElement, message));

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt');
    deleteIcon.addEventListener('click', () => deleteMessage(messageElement));

    iconContainer.append(editIcon, deleteIcon);

    messageElement.append(messageText, iconContainer);
    messageContainer.append(messageElement);

    if (isOwnMessage) {
        messages.push({ element: messageElement, text: message });
    }
}

function editMessage(messageElement, oldMessage) {
    const newMessage = prompt("Edit your message:", oldMessage);
    if (newMessage) {
        messageElement.querySelector('p').innerText = newMessage;
        const index = messages.findIndex(m => m.element === messageElement);
        if (index !== -1) {
            messages[index].text = newMessage;
        }
    }
}

function deleteMessage(messageElement) {
    if (confirm("Are you sure you want to delete this message?")) {
        messageElement.remove();
        const index = messages.findIndex(m => m.element === messageElement);
        if (index !== -1) {
            messages.splice(index, 1);
        }
    }
}
