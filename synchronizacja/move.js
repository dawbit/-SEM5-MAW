let x, y, xn, yn, w, h, t, l;

const page = document.querySelector("main");
const canvas = document.querySelector(".canvas");
const canvasWidth = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;
const objects = canvas.querySelectorAll(".object");

function getXY(event) {
  x = event.pageX;
  y = event.pageY;
}

function getXYn(event) {
  xn = event.pageX;
  yn = event.pageY;
}

function getXYchange(event) {
  x = event.changedTouches[0].pageX;
  y = event.changedTouches[0].pageY;
}

function getXYnchanged(event) {
  xn = event.changedTouches[0].pageX;
  yn = event.changedTouches[0].pageY;
}

function gett(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("top"));
}

function getb(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("bottom"));
}

function getl(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("left"));
}

function getr(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("right"));
}

function getw(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("width"));
}

function geth(element) {
  return parseInt(getComputedStyle(element).getPropertyValue("height"));
}

function sett(element, value) {
  element.style.setProperty("top", `${value}px`);
}

function setb(element, value) {
  element.style.setProperty("bottom", `${value}px`);
}

function setl(element, value) {
  element.style.setProperty("left", `${value}px`);
}

function setr(element, value) {
  element.style.setProperty("right", `${value}px`);
}

const move = target => {
  let startt;
  let startl;
  const initializeMoving = event => {
    getXYn(event);
    event.preventDefault();
    startt = gett(target);
    startl = getl(target);
    page.addEventListener("mousemove", moveElement);
    page.addEventListener("mouseup", stopMoving);
  };

  const moveElement = event => {
    getXY(event);
    let newl = x - xn + startl;
    let newt = y - yn + startt;
    if (newt < 0) newt = 0;
    else if (newt + geth(target) > canvasHeight)
      newt = canvasHeight - geth(target);
    if (newl < 0) newl = 0;
    else if (newl + getw(target) > canvasWidth)
      newl = canvasWidth - getw(target);
    sett(target, newt);
    setl(target, newl);
  };

  const stopMoving = () => {
    page.removeEventListener("mousemove", moveElement);
    page.removeEventListener("mouseup", stopMoving);
  };
  target.addEventListener("mousedown", initializeMoving);
};

const moveTouch = target => {
  let startt;
  let startl;
  const initializeMoving = event => {
    getXYnchanged(event);
    event.preventDefault();
    startt = gett(target);
    startl = getl(target);
    page.addEventListener("touchmove", moveElement);
    page.addEventListener("touchend", stopMoving);
  };

  const moveElement = event => {
    getXYchange(event);
    let newl = x - xn + startl;
    let newt = y - yn + startt;
    if (newt < 0) newt = 0;
    else if (newt + geth(target) > canvasHeight)
      newt = canvasHeight - geth(target);
    if (newl < 0) newl = 0;
    else if (newl + getw(target) > canvasWidth)
      newl = canvasWidth - getw(target);
    sett(target, newt);
    setl(target, newl);
  };

  const stopMoving = () => {
    page.removeEventListener("touchmove", moveElement);
    page.removeEventListener("touchend", stopMoving);
  };
  target.addEventListener("touchstart", initializeMoving);
};

const connection = new WebSocket("ws://127.0.0.1:2137");
connection.addEventListener("open", ws => {
  const data = { type: "loadRequest" };
  connection.send(JSON.stringify(data));
});

connection.addEventListener("message", ws => {
  const data = JSON.parse(ws.data);
  refreshPositons(data);
});

const refreshPositons = data => {
  for (let l = 0; l < data.length; l++) {
    const name = data[l].class;
    const element = canvas.querySelector(`.${name}`);
    const t = parseInt(data[l].t);
    const lf = parseInt(data[l].lf);
    sett(element, t);
    setl(element, lf);
  }
};

const start = () => {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const sendData = () => {
      if (connection.readyState == connection.OPEN) {
        data = [];
        for (let j = 0; j < objects.length; j++) {
          var f = {
            type: "moved",
            class: objects[j].className.replace("object ", ""),
            top: gett(objects[j]),
            left: getl(objects[j])
          };
          data.push(f);
        }
        connection.send(JSON.stringify(data));
        removeListeners;
      }
    };

    const removeListeners = () => {
      page.addEventListener("touchend", () => {
        page.removeEventListener("touchmove", sendData);
      });
      page.addEventListener("mouseup", () => {
        page.removeEventListener("mousemove", sendData);
      });
    };

    const initializeOnMove = () => {
      page.addEventListener("mousemove", sendData);
      page.addEventListener("touchmove", sendData);
      removeListeners();
    };

    object.addEventListener("mousedown", initializeOnMove);
    object.addEventListener("touchstart", initializeOnMove);
    move(object);
    moveTouch(object);
  }
};

start();
