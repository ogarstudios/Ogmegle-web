let username = '';
let email = '';

// Sign up process
const signUp = () => {
    email = document.getElementById('email').value;
    username = document.getElementById('username').value;
    if (!email || !username) {
        alert("Please enter both email and username.");
        return;
    }

    // Hide the login page and show the chat page
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // Start the video after sign-up
    startVideo();
};

// Log in process
const logIn = () => {
    email = document.getElementById('email').value;
    username = document.getElementById('username').value;
    if (!email || !username) {
        alert("Please enter both email and username.");
        return;
    }

    // Hide the login page and show the chat page
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // Start the video after logging in
    startVideo();
};

// Request media access (camera and microphone)
const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById('user-video').srcObject = stream;
        })
        .catch(err => {
            console.log("Error accessing camera and microphone: ", err);
            alert("We need access to your camera and microphone. Please click 'Allow' when prompted.");
        });
};

// Send a text message
const sendMessage = (event) => {
    if (event && event.key !== "Enter") return;

    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();

    if (message) {
        displayMessage(username, message);
        messageInput.value = '';
    }
};

// Display message in the chat area
const displayMessage = (sender, message) => {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll to the bottom
};

// Skip chat functionality (reset and start a new chat)
const skipChat = () => {
    alert("Skipping chat...");
    document.getElementById('peer-video').srcObject = null;
    startVideo();
};

// Report user functionality
const reportUser = () => {
    alert("User reported!");
};
