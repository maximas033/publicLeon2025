function listenToLockdown() {
    firebase.database().ref('lockdown').on('value', function (snapshot) {
      var data = snapshot.val();
      const lockdownEnabled = data.lockdown === true;
      if (lockdownEnabled) {
        hideSensitiveInformation();
      } else {
        showSensitiveInformation();
      }
    });
  }
  
  function hideSensitiveInformation() {
    document.getElementById("LeonLockdownMessageSettings").style.display = "block"
    document.getElementById("enable_wifi_button").style.display = "none"
    document.getElementById("lockdownButton").style.display = "none"
    console.log("Hiding sensitive information due to lockdown");
  }
  
  function showSensitiveInformation() {
    document.getElementById("LeonLockdownMessageSettings").style.display = "none"
    document.getElementById("enable_wifi_button").style.display = "block"
    document.getElementById("lockdownButton").style.display = "block"
    console.log("Showing sensitive information as lockdown is lifted");
  }

  listenToLockdown();
