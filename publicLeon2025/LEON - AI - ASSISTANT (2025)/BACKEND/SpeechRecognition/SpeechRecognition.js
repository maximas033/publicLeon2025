// if ('webkitSpeechRecognition' in window) {
//     window.onload = () => {
//         console.log("Script loaded!");  // this should always show
//     }
//     const recognition = new webkitSpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';

//     let isRecognizing = false;
//     let restartTimeout;

//     window.onload = () => {
//         console.log("Page loaded. Trying to start recognition...");
//         startRecognition();
//     };

//     function startRecognition() {
//         if (!isRecognizing) {
//             try {
//                 recognition.start();
//                 isRecognizing = true;
//                 console.log("Speech recognition started...");
//             } catch (err) {
//                 console.error("Speech recognition failed to start:", err);
//             }
//         }
//     }

//     recognition.onstart = () => {
//         console.log("Recognition is active.");
//         isRecognizing = true;
//     };

//     recognition.onresult = (event) => {
//         const result = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
//         console.log('You said:', result);
//         document.getElementById('transcript').innerText = "You said: " + result;
//         processCommand(result);
//     };

//     recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//         // Restart only if needed
//         if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//             alert("Microphone access denied or not allowed.");
//         }
//     };

//     recognition.onend = () => {
//         console.warn("Recognition ended. Restarting in 2 seconds...");
//         isRecognizing = false;
//         clearTimeout(restartTimeout);
//         restartTimeout = setTimeout(() => {
//             startRecognition();
//         }, 2000); // avoid spamming restarts
//     };

//     function processCommand(command) {
//         fetch('http://127.0.0.1:5000/process-command', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ command }),
//         })
//         .then(response => response.json())
//         .then(data => {
//             const responseText = data.response || "No response received.";
//             console.log("Backend says:", responseText);
//             document.getElementById('response').innerText = responseText;
//             speakResponse(responseText);
//         })
//         .catch(error => {
//             console.error("Error communicating with backend:", error);
//             document.getElementById('response').innerText = "Error connecting to server.";
//         });
//     }

//     function speakResponse(text) {
//         if ('speechSynthesis' in window) {
//             const utterance = new SpeechSynthesisUtterance(text);
//             utterance.lang = 'en-US';
//             speechSynthesis.speak(utterance);
//         } else {
//             console.warn("Speech synthesis not supported.");
//         }
//     }
// } else {
//     alert("Sorry, your browser doesn't support speech recognition.");
// }






// Check if the browser supports the Speech Recognition API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Create a new SpeechRecognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let lastCommand = "";
    let lastCommandTime = 0;

    // Set properties for the recognition
    recognition.continuous = true; // Allow continuous recognition
    recognition.lang = 'en-US'; // Set the language
    recognition.interimResults = true; // Show interim results

    let finalTranscript = ''; // Store the final, combined transcript

    // Event handler for when speech is recognized
    recognition.onresult = function (event) {
        let result = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            result += transcript; // Combine all parts of the sentence

            // If the result is final, process the command
            if (event.results[i].isFinal) {
                finalTranscript = result.trim(); // Set the final transcript
                console.log('Final result:', finalTranscript);
                document.getElementById('transcript').innerText = "You said: " + finalTranscript;
                
                // Call processCommand only if the command is new or not duplicated
                const currentTime = Date.now();
                if (finalTranscript !== lastCommand || currentTime - lastCommandTime > 5000) {
                    processCommand(finalTranscript);
                    lastCommand = finalTranscript;
                    lastCommandTime = currentTime;
                } else {
                    console.log("Duplicate command ignored:", finalTranscript);
                }
                finalTranscript = ''; // Reset the final transcript after processing
            }
        }
    };

    // Event handlers for start and end of speech recognition
    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
        recognition.start(); // Restart recognition to keep it continuous
    };

    // Event handler for errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    function processCommand(command) {
        fetch('http://127.0.0.1:5000/process-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command }),
        })
        .then(response => response.json())
        .then(data => {
            const responseText = data.response || "No response received.";
            console.log("Backend says:", responseText);
            document.getElementById('response').innerText = responseText;
            speakResponse(responseText);
        })
        .catch(error => {
            console.error("Error communicating with backend:", error);
            document.getElementById('response').innerText = "Error connecting to server.";
        });
    }

    function speakResponse(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        } else {
            console.warn("Speech synthesis not supported.");
        }
    }

    // Start speech recognition
    recognition.start();
} else {
    console.error('Speech Recognition API is not supported in this browser.');
}
