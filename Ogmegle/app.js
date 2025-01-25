let username = '';
let email = '';
let peerConnection;
let localStream;
let remoteStream;
let chatSocket;  // WebSocket or any signaling system for sending messages

const signUp = () => {
    email = document.getElementById('email').value;
    username = document.getElementById('username').value;
    if (!email || !username) return alert("Please enter both email and username.");
    
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    startVideo();
};

const logIn = () => {
    email = document.getElementById('email').value;
    username = document.getElementById('username').value;
    if (!email || !username) return alert("Please enter both email and username.");
    
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    startVideo();
};

// Request media access (camera and microphone)
const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('user-video').srcObject = stream;
            initiatePeerConnection();
        })
        .catch(err => {
            console.log("Error accessing camera and microphone: ", err);
            alert("We need access to your camera and microphone to start the video chat. Please click 'Allow' when prompted.");
            // Optionally, you can display a UI prompt or guide the user on enabling the permission manually
        });
};

const initiatePeerConnection = () => {
    peerConnection = new RTCPeerConnection();
    peerConnection.addStream(localStream);

    peerConnection.onaddstream = (event) => {
        document.getElementById('peer-video').srcObject = event.stream;
        remoteStream = event.stream;
    };

    peerConnection.createOffer()
        .then(offer => {
            peerConnection.setLocalDescription(offer);
            // Send the offer to another user (via signaling server)
        }).catch(err => {
            console.log("Error creating offer: ", err);
        });
};

const sendMessage = (event) => {
    if (event && event.key !== "Enter") return;  // Only send on "Enter" key press

    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();

    if (message) {
        // Display message in the local chat window
        displayMessage(username, message);
        
        // Send the message to the remote peer via signaling server (for example, WebSocket)
        if (chatSocket) {
            chatSocket.send(JSON.stringify({ type: 'text', message: message }));
        }
        
        messageInput.value = '';  // Clear the input field
    }
};

const displayMessage = (sender, message) => {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Auto-scroll to latest message
};

const skipChat = () => {
    // Reset video and chat, and start a new chat
    resetVideo();
    clearChat();
    startVideo();
    alert("Skipping chat...");
};

const reportUser = () => {
    alert("User reported!");
    // Logic for reporting user (send report data to backend)
};

const resetVideo = () => {
    document.getElementById('peer-video').srcObject = null;
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
};

const clearChat = () => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';  // Clear all messages in the chat window
};

// Example WebSocket for text chat (replace with your own server or signaling system)
const setupWebSocket = () => {
    chatSocket = new WebSocket('wss://your-websocket-server.com');
    chatSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'text' && data.message) {
            displayMessage('Peer', data.message);  // Display received message from the other user
        }
    };
};
