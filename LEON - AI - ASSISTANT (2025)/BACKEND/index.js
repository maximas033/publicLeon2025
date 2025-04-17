// DATE AND TIME 
function LeonTime(){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    // Determine AM or PM
    var meridiem = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // "0" should be displayed as "12"

    // Add leading zeros if the values are less than 10
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    var currentTimeString = hours + ":" + minutes + ":" + seconds + " " + meridiem;
    document.getElementById("DisplayCurrentTime").innerHTML = currentTimeString
    return currentTimeString
}

window.onload = LeonTime()
setInterval(LeonTime, 100)

function LeonDate() {
    var currentDate = new Date();
    var date = currentDate.toDateString();
    document.getElementById("DisplayCurrentDay").innerHTML = date
}
  
window.onload = LeonDate()
setInterval(LeonDate(), 100)

// GREETING
function LeonGreeting(hours) {
    if (hours >= 0 && hours < 12) {
      return "Good morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }
  
  window.onload = function (){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var greeting = LeonGreeting(hours);
    document.getElementById("DisplayGreeting").innerHTML = greeting
  }
  