// Pastikan Firebase CDN sudah di-load di HTML
// firebase-app.js, firebase-auth.js, firebase-database.js

// Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBcu0iAcSMLMkEsLYU3JcLA2hf9WW9h-LQ",
  authDomain: "anonymous-chat-4b578.firebaseapp.com",
  databaseURL: "https://anonymous-chat-4b578-default-rtdb.firebaseio.com",
  projectId: "anonymous-chat-4b578",
  storageBucket: "anonymous-chat-4b578.appspot.com",
  messagingSenderId: "498262294762",
  appId: "1:498262294762:web:c077c7295c2657b5bfd793"
};

firebase.initializeApp(firebaseConfig);

// Referensi Firebase services
const auth = firebase.auth();
const database = firebase.database();
const messagesRef = database.ref('messages');

// Elemen DOM
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Variabel user (nama + avatar) akan disimpan setelah login anonim
let username = '';
let avatarUrl = '';

// Login anonim
auth.signInAnonymously()
  .then(() => {
    // Generate nama & avatar sekali saja untuk user ini
    username = generateRandomName();
    avatarUrl = generateRandomAvatar();
    console.log('Logged in anonymously as:', auth.currentUser.uid, username);
  })
  .catch((error) => {
    console.error('Error signing in anonymously:', error);
  });

// Generate nama acak
function generateRandomName() {
  const names = ['Anon1', 'Ghost', 'Shadow', 'Mystery', 'Whisper', 'Echo', 'Phantom', 'Stranger'];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate avatar acak
function generateRandomAvatar() {
  const styles = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'micah'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${Math.random()}`;
}

// Tampilkan pesan
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-container');

  // Avatar
  const avatarElement = document.createElement('img');
  avatarElement.src = message.avatar || generateRandomAvatar();
  avatarElement.classList.add('avatar');
  avatarElement.alt = 'Avatar';

  // Bubble pesan
  const bubbleElement = document.createElement('div');
  bubbleElement.classList.add('message');

  // Aman dari XSS
  const nameElement = document.createElement('strong');
  nameElement.textContent = message.name || 'Anon';
  bubbleElement.appendChild(nameElement);

  const br = document.createElement('br');
  bubbleElement.appendChild(br);

  const textNode = document.createTextNode(message.text);
  bubbleElement.appendChild(textNode);

  // Gabungkan
  messageElement.appendChild(avatarElement);
  messageElement.appendChild(bubbleElement);
  chatMessages.appendChild(messageElement);

  // Auto scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Dengarkan perubahan database
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  displayMessage(message);
});

// Kirim pesan
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText && auth.currentUser) {
    const userId = auth.currentUser.uid;
    messagesRef.push({
      text: messageText,
      timestamp: Date.now(),
      userId: userId,
      name: username, // Nama tetap
      avatar: avatarUrl // Avatar tetap
    });
    messageInput.value = '';
  }
}

// Event listener tombol send
sendButton.addEventListener('click', sendMessage);

// Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
