// ======================
// Inisialisasi Firebase
// ======================
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

const auth = firebase.auth();
const database = firebase.database();
const messagesRef = database.ref('messages');

// ======================
// Elemen DOM
// ======================
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// ======================
// Variabel user
// ======================
let username = '';
let avatarUrl = '';

// Matikan tombol dulu sampai login selesai
sendButton.disabled = true;

// ======================
// Login anonim
// ======================
auth.signInAnonymously()
  .then(() => {
    username = generateRandomName();
    avatarUrl = generateRandomAvatar();
    console.log('Logged in anonymously as:', auth.currentUser.uid, username);
    sendButton.disabled = false;
  })
  .catch((error) => {
    console.error('Error signing in anonymously:', error);
  });

// ======================
// Generate nama & avatar acak
// ======================
function generateRandomName() {
  const names = ['Anon1', 'Ghost', 'Shadow', 'Mystery', 'Whisper', 'Echo', 'Phantom', 'Stranger'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateRandomAvatar() {
  const styles = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'micah'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${Math.random()}`;
}

// ======================
// Tampilkan pesan di chat
// ======================
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-container');

  const avatarElement = document.createElement('img');
  avatarElement.src = message.avatar || generateRandomAvatar();
  avatarElement.classList.add('avatar');
  avatarElement.alt = 'Avatar';

  const bubbleElement = document.createElement('div');
  bubbleElement.classList.add('message');

  const nameElement = document.createElement('strong');
  nameElement.textContent = message.name || 'Anon';
  bubbleElement.appendChild(nameElement);

  bubbleElement.appendChild(document.createElement('br'));
  bubbleElement.appendChild(document.createTextNode(message.text));

  messageElement.appendChild(avatarElement);
  messageElement.appendChild(bubbleElement);
  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ======================
// Dengarkan pesan baru
// ======================
messagesRef.on('child_added', (snapshot) => {
  const message = snapshot.val();
  displayMessage(message);
});

// ======================
// Kirim pesan
// ======================
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (!messageText || !auth.currentUser) return;

  messagesRef.push({
    text: messageText,
    timestamp: Date.now(),
    userId: auth.currentUser.uid,
    name: username,
    avatar: avatarUrl
  });

  messageInput.value = '';
}

// ======================
// 
// ======================
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});
