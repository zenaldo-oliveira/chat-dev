const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessage = document.querySelector(".chat__message");

const user = { id: "", name: "", color: "" };

const colors = [
  "aqua",
  "cadetblue",
  "blueviolet",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
  "navy",
];

let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");
  div.classList.add("message--self");
  div.innerHTML = content;
  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;

  span.innerHTML = sender;
  div.appendChild(span);
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const messageData = JSON.parse(data);
  const { type, userId, userName, userColor, content } = messageData;

  let message;

  if (type === "system") {
    message = document.createElement("div");
    message.classList.add("message--system");
    message.textContent = content;
  } else if (type === "message") {
    message =
      userId === user.id
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, userName, userColor);
  }

  chatMessage.appendChild(message);
  scrollScreen();
};

const handleSubmit = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("wss://chet-dev-backend.onrender.com");

  websocket.onmessage = processMessage;

  websocket.onopen = () => {
    console.log("🟢 Conectado ao WebSocket com sucesso.");

    // Envia mensagem de login (servidor vai gerar a mensagem de sistema)
    const loginMessage = {
      type: "login",
      userId: user.id,
      userName: user.name,
    };

    websocket.send(JSON.stringify(loginMessage));
  };
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
    type: "message",
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };

  websocket.send(JSON.stringify(message));
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleSubmit);
chatForm.addEventListener("submit", sendMessage);
