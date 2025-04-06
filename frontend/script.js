const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessage = document.querySelector(".chat__message");

const user = { id: "", name: "", color: "" };

const colors = [
  "#FF0000", // vermelho puro
  "#00FF00", // verde puro
  "#0000FF", // azul puro
  "#FFFF00", // amarelo neon
  "#FF00FF", // magenta
  "#00FFFF", // ciano
  "#FF8800", // laranja vibrante
  "#FF1493", // pink forte
  "#8A2BE2", // roxo elétrico
  "#00CED1", // azul piscina
  "#FF4500", // laranja queimado
  "#7FFF00", // verde chartreuse
  "#DC143C", // vermelho cereja
  "#1E90FF", // azul dodger
  "#FFD700", // dourado vibrante
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

const scrollScreen = ({ top, behavior = "smooth" } = {}) => {
  const scrollTarget = top ?? document.documentElement.scrollHeight;

  if (typeof window !== "undefined") {
    window.scrollTo({ top: scrollTarget, behavior });
  }
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessage.appendChild(message);

  scrollScreen();
};

const handleSubmit = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  websocket = new WebSocket("wss://echo.websocket.org");

  websocket.onopen = () => {
    login.style.display = "none";
    chat.style.display = "flex";
  };

  websocket.onmessage = processMessage;
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
