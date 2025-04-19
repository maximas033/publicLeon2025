// FUNCTION BELOW WORKS ---- GEMINI
function startLockdown() {
    var lockdown = {
      lockdown: true
    };
  
    firebase.database().ref('lockdown').update(lockdown)
      .then(() => {
        console.log("Lockdown started successfully!");
      })
      .catch((error) => {
        console.error("Error starting lockdown:", error);
      });
  }

  async function LeonUnlockLeon() {
    const password = "leonunlock";
    const passwordInput = prompt("Enter your password to unlock Leon:");
  
    if (!passwordInput) {
      alert("Please enter your password.");
      return;
    }
  
    try {
      if (passwordInput === password) {
            // Create lockdown object
            var lockdown = {
                lockdown: false
            };
        firebase.database().ref('lockdown').update(lockdown)
        .then(() => {
          console.log("Lockdown unlocked successfully!");
        })
        .catch((error) => {
          console.error("Error starting lockdown:", error);
  
        });        
      } else {
        alert("Wrong password. Please try again.");
      }
    } catch (error) {
      const errorMessage = error.message || "An error occurred. Please try again.";
      alert(errorMessage);
    }
  }

  function checkBatteryStatus() {
    if (!navigator.getBattery) {
      console.error("Battery Status API is not supported on this browser.");
      return;
    }
  
    navigator.getBattery().then(battery => {
      const batteryPercentage = Math.round(battery.level * 100) + "%";
      document.getElementById("batteryStatus").innerText = `Battery: ${batteryPercentage}`;

      // if battery is lover or equal to 20 %
      if (battery.level <= 0.2) {
        document.getElementById("warningLowBattery").style.paddingTop = "10px"

        document.getElementById("warningLowBattery").innerHTML = "LOW BATTERY!"
        document.getElementById("warningLowBattery").style.color = "orange"
      }

      // detect if the battery is getting charged or not
      if (battery.charging) {
        document.getElementById("chargingStatus").style.display = "block"
        document.getElementById("chargingStatus").style.paddingTop = "10px"
        document.getElementById("chargingStatus").innerHTML = "CHARGING"
        document.getElementById("chargingStatus").style.color = "lime"
      }else{
        document.getElementById("chargingStatus").style.display = "none"
      }
    }).catch(error => {
      console.error("Error fetching battery status:", error);
    });
  }
  
  checkBatteryStatus();
  setInterval(checkBatteryStatus, 2000);
  


  // check the online status
  function checkOnlineStatus() {
    if (navigator.onLine) {
      document.getElementById("displayOnlineStats").style.color = "lime";
      document.getElementById("displayOnlineStats").innerText = "O N L I N E";
      document.getElementById("displayOnlineStats").style.fontSize = "20px"
      document.getElementById("displayOnlineStats").style.fontWeight = "lighter"
    } else {
      document.getElementById("displayOnlineStats").style.color = "red";
      document.getElementById("displayOnlineStats").innerText = "O F F L I N E";
      document.getElementById("displayOnlineStats").style.fontSize = "20px"
      document.getElementById("displayOnlineStats").style.fontWeight = "lighter"
    }
  }
    
    checkOnlineStatus();
    setInterval(checkBatteryStatus, 2000);





    function getSystemReport() {
      const ram = navigator.deviceMemory || 'Unknown';
      const cores = navigator.hardwareConcurrency || 'Unknown';
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const pixelRatio = window.devicePixelRatio;
      const touchSupport = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      const platform = navigator.platform || 'Unknown';
      const userAgent = navigator.userAgent;
      const language = navigator.language || 'Unknown';
    
      // Basic browser detection
      let browser = 'Unknown';
      if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Edg')) browser = 'Edge';
    
      const systemHTML = `
        <ul>
          <li><strong>💾 RAM:</strong> ${ram} GB</li>
          <li><strong>🧠 CPU Cores:</strong> ${cores}</li>
          <li><strong>🖥️ Screen:</strong> ${screenWidth} × ${screenHeight} (${pixelRatio}x)</li>
          <li><strong>📱 Touch Support:</strong> ${touchSupport ? 'Yes' : 'No'}</li>
          <li><strong>💻 Platform:</strong> ${platform}</li>
          <li><strong>🌐 Browser:</strong> ${browser}</li>
          <li><strong>🗣️ Language:</strong> ${language}</li>
          <li><strong>🕵️ User Agent:</strong> ${userAgent}</li>
        </ul>
      `;
    
      document.getElementById('systemReport').innerHTML = systemHTML;
    }

    // onload display
    getSystemReport();



    const coords = { x: -1, y: 0, targetX: -1, targetY: 0 };

    const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
    const mapRange = (aMin, aMax, bMin, bMax, value) => {
      const rangeA = Math.abs(aMax - aMin);
      const rangeB = Math.abs(bMax - bMin);
      const distance = Math.abs(value - aMin) / rangeA;
      return bMin + distance * rangeB;
    };
    const coordinatesToDegrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI + 180;

    const canvas = document.getElementById('compassCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.1;
      width = canvas.width;
      height = canvas.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      coords.targetX = mapRange(0, window.innerWidth, -1, 1, e.clientX);
      coords.targetY = mapRange(0, window.innerHeight, -1, 1, e.clientY);
    });

    function drawCompass(degrees) {
      const WIDTH_6_DEG = (width * 2) / 360;
      const offset = width / 2 - (degrees / 360) * width * 2;

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#fff';
      ctx.font = '10px B612 Mono, monospace';

      for (let i = 0; i < 360; i += 6) {
        const x = WIDTH_6_DEG * i + offset;

        ctx.beginPath();
        if (i % 30 === 0) {
          ctx.moveTo(x + 0.5, height / 2 + 0);
          ctx.lineTo(x + 0.5, height / 2 + 15);
        } else {
          ctx.moveTo(x + 0.5, height / 2 + 5);
          ctx.lineTo(x + 0.5, height / 2 + 10);
        }
        ctx.stroke();

        if (i === 0 || i === 360) ctx.fillText('N', x - 5, height / 2 - 10);
        else if (i === 90) ctx.fillText('E', x - 5, height / 2 - 10);
        else if (i === 180) ctx.fillText('S', x - 5, height / 2 - 10);
        else if (i === 270) ctx.fillText('W', x - 5, height / 2 - 10);
        else if (i % 30 === 0) ctx.fillText(i, x - 5, height / 2 - 10);
      }

      // Draw heading
      const heading = Math.round(degrees).toString().padStart(3, '0');
      ctx.fillStyle = 'rgba(1, 119, 209, 0.605)';
      ctx.fillRect(width / 2 - 30, height / 2 - 30, 60, 25);
      ctx.fillStyle = 'white';
      ctx.fillText(heading, width / 2 - ctx.measureText(heading).width / 2, height / 2 - 10);
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      coords.x = lerp(coords.x, coords.targetX, 0.01);
      coords.y = lerp(coords.y, coords.targetY, 0.01);

      // slow the speed down 
      const degrees = coordinatesToDegrees(coords.x, coords.y);
      drawCompass(degrees);
    }

    animate();