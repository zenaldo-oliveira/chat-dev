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

  div.appendChild(span);

  span.innerHTML = sender;
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
  const { userId, userName, userColor, content, system } = JSON.parse(data);

  let message;

  if (system) {
    message = document.createElement("div");
    message.classList.add("message--system");
    message.textContent = content;
  } else {
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

    // Envia mensagem de boas-vindas como mensagem do sistema
    const welcomeMessage = {
      system: true,
      content: `👋 ${user.name} entrou no chat!`,
    };

    websocket.send(JSON.stringify(welcomeMessage));
  };
};

const sendMessage = (event) => {
  event.preventDefault();

  const message = {
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
