function listenToLockdown() {
    firebase.database().ref('lockdown').on('value', function (snapshot) {
      var data = snapshot.val();
      const lockdownEnabled = data.lockdown === true; // Store lockdown status for readability
      // document.getElementById("wifi_connection_qr_code").style.display = "none"
      if (lockdownEnabled) {
        hideSensitiveInformation();
      } else {
        showSensitiveInformation();
      }
    });
  }
  
  function hideSensitiveInformation() {
    //showing lockdown message
    document.getElementById("LeonLockdownMessage").style.display = "block"
    // HIDE THE QR CODE
    document.getElementById("globe").style.display = "none"
    console.log("Hiding sensitive information due to lockdown");
  }
  
  function showSensitiveInformation() {
    document.getElementById("LeonLockdownMessage").style.display = "none"
    document.getElementById("globe").style.display = "block"
    console.log("Showing sensitive information as lockdown is lifted");
  }
  
  listenToLockdown();
