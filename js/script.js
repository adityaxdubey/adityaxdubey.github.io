document.addEventListener("DOMContentLoaded", function () {
  // --- Theme Toggler ---
  const themeToggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Set initial theme from localStorage or system preference
  const currentTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", currentTheme);

  themeToggleButton.addEventListener("click", () => {
    const newTheme = htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // --- Loading Animation ---
  const loadingOverlay = document.getElementById("loading-overlay");
  const sarcasticMessages = [
    "Compiling sarcasm...", "Reticulating splines...", "Optimizing the funnies...",
    "Herding cats... and bits", "Calculating the meaning of life...", "Almost there, maybe..."
  ];

  if (loadingOverlay) {
    const epochCounter = document.getElementById('epoch-counter');
    const accuracyCounter = document.getElementById('accuracy-counter');
    const lossCounter = document.getElementById('loss-counter');
    const progressBar = document.getElementById('progress-bar');
    const trainingLog = document.getElementById('training-log');
    let currentEpoch = 0;
    const totalEpochs = 5;

    function updateLog(message) {
      if (trainingLog) trainingLog.innerHTML += message + '\n';
      if (trainingLog) trainingLog.scrollTop = trainingLog.scrollHeight;
    }

    function simulateEpoch() {
      if (currentEpoch >= totalEpochs) {
        updateLog("\nTraining 'complete'. Let's hope it works.");
        setTimeout(() => {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500);
        }, 1000);
        return;
      }
      
      currentEpoch++;
      const progress = (currentEpoch / totalEpochs) * 100;
      const accuracy = (progress * 0.9 + Math.random() * 5).toFixed(2);
      const loss = (2.3 - progress * 0.02).toFixed(4);
      const randomMessage = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];

      if(epochCounter) epochCounter.textContent = `${currentEpoch}/${totalEpochs}`;
      if(accuracyCounter) accuracyCounter.textContent = `${accuracy}%`;
      if(lossCounter) lossCounter.textContent = loss;
      if(progressBar) progressBar.style.width = `${progress}%`;
      
      updateLog(`[Epoch ${currentEpoch}] ${randomMessage}`);
      setTimeout(simulateEpoch, 500);
    }
    
    updateLog("Initializing... Please wait.");
    setTimeout(simulateEpoch, 500);
  }
});
