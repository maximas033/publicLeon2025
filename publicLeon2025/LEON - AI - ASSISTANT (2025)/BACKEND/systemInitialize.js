function simulateSystemInitialization(outputElementId) {
    const steps = [
        "Boot sequence initiated...",
        "Power core online.",
        "Activating neural network modules...",
        "Loading system protocols...",
        "Establishing biometric scan...",
        "✔ Retina scan recognized.",
        "✔ Voice ID matched: 'Dima'.",
        "Decrypting user access token...",
        "Access level: OPERATIONS MANAGER",
        "Initializing system core...",
        "Loading modules: [■□□□□□] 17%",
        "Loading modules: [■■■□□□] 50%",
        "Loading modules: [■■■■■□] 83%",
        "Loading modules: [■■■■■■] 100%",
        "Running diagnostics...",
        "✔ CPU: Optimal",
        "✔ Memory: Stable",
        "✔ Disk: Secure",
        "✔ Network: Connected",
        "Synchronizing time with atomic clock...",
        "Fetching latest AI directives...",
        "Establishing secure connection...",
        "Verifying user credentials...",
        "✔ Credentials authorized.",
        "Encrypting communication channels...",
        "System check complete.",
        "Launching command interface...",
        "Calibrating voice assistant...",
        "Hello Dima, all systems are green.",
        "Initialization complete. Welcome back, Commander."
      ];
      

    const outputElement = document.getElementById(outputElementId);
    outputElement.innerHTML = ""; // Clear previous output

      // Play the bootup sound
  const bootupSound = document.getElementById("bootupSound");
  if (bootupSound) {
    bootupSound.play().catch(error => {
      console.warn("Autoplay failed or user interaction needed:", error);
    });
  }

    let index = 0;

    const interval = setInterval(() => {
      if (index < steps.length) {
        const line = document.createElement("div");
        line.textContent = steps[index];
        outputElement.appendChild(line);
        outputElement.scrollTop = outputElement.scrollHeight;
        index++;
      } else {
        clearInterval(interval);
      }
    }, 700); // Adjust speed if needed
  }

  // Start on page load
  window.onload = () => {
    simulateSystemInitialization("systemOutput");
  };