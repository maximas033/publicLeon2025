// Get element to drag
const ipAdressWidget = document.getElementById("ipAdress");

// Set initial positions
let xPosition = 0,
  yPosition = 0,
  lastXPosition = 0,
  lastYPosition = 0,
  windowHeight = window.innerHeight - ipAdressWidget.offsetHeight,
  windowWidth = window.innerWidth - ipAdressWidget.offsetWidth;

// Add event listener
ipAdressWidget.addEventListener("mousedown", startDrag);

// Function to start dragging
function startDrag(e) {
  e.preventDefault();
  // get the mouse cursor position at startup:
  lastXPosition = e.clientX;
  lastYPosition = e.clientY;
  document.addEventListener("mouseup", endDrag);
  // call a function whenever the cursor moves:
  document.addEventListener("mousemove", moveElement);
}

// Function to move element
function moveElement(e) {
  e.preventDefault();
  // calculate the new cursor position:
  xPosition = lastXPosition - e.clientX;
  yPosition = lastYPosition - e.clientY;
  lastXPosition = e.clientX;
  lastYPosition = e.clientY;
  // set the element's new position:
  let top = ipAdressWidget.offsetTop - yPosition;
  let left = ipAdressWidget.offsetLeft - xPosition;

  if (top > windowHeight) {
    top = windowHeight;
  } else if (top < 0) {
    top = 0;
  }

  if (left > windowWidth) {
    left = windowWidth;
  } else if (left < 0) {
    left = 0;
  }

  ipAdressWidget.style.top = `${top}px`;
  ipAdressWidget.style.left = `${left}px`;
}

// Function to end dragging
function endDrag() {
  // stop moving when mouse button is released:
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("mousemove", moveElement);
  // YOU CAN SAVE THE POSITION OF THE WIDGET INSIDE THE FIREBASE, SO THE NEXT TIME THE PROGRAM OPENS BACK UP IT WILL BE IN THAT POSITION
}