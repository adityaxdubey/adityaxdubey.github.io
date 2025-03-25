const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

//this to close navbar
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}


//listener to toggle
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

toggleSwitch.addEventListener("change", switchTheme, false);

//theme for future visit

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark"); //add this
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light"); //add this
  }
}



const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

//Adding date

let myDate = document.querySelector("#datee");
if (myDate) {
  const yes = new Date().getFullYear();
  myDate.innerHTML = yes;
}
//model training
document.addEventListener('DOMContentLoaded', function() {
  const totalEpochs = 5;
  let currentEpoch = 0;
  let accuracy = 0;
  let loss = 2.3024;
  
  const epochCounter = document.getElementById('epoch-counter');
  const accuracyCounter = document.getElementById('accuracy-counter');
  const lossCounter = document.getElementById('loss-counter');
  const progressBar = document.getElementById('progress-bar');
  const trainingLog = document.getElementById('training-log');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  function updateLog(message) {
    trainingLog.innerHTML += message + '\n';
    trainingLog.scrollTop = trainingLog.scrollHeight;
  }
  
  function simulateEpoch() {
    currentEpoch++;
    
    if (epochCounter) epochCounter.textContent = `${currentEpoch}/${totalEpochs}`;
    
    accuracy = Math.min(0.95, accuracy + (0.1 + Math.random() * 0.1));
    loss = Math.max(0.05, loss - (0.2 + Math.random() * 0.1));
    
    accuracyCounter.textContent = `${(accuracy * 100).toFixed(2)}%`;
    lossCounter.textContent = loss.toFixed(4);
    
    //update bar
    const progress = (currentEpoch / totalEpochs) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    
    const randomMessage = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];

    //yaha log daala
    updateLog(`[Epoch ${currentEpoch}/${totalEpochs}] accuracy: ${(accuracy * 100).toFixed(2)}% - loss: ${loss.toFixed(4)}`);
    updateLog(`${randomMessage}`);
    
    // Continue or finish
    if (currentEpoch < totalEpochs) {
      requestAnimationFrame(() => {
        setTimeout(simulateEpoch, 400); 
      });
    } else {
      // updateLog(`\nTraining complete! Model achieved ${(accuracy * 100).toFixed(2)}% accuracy.`);
      updateLog(`\nThis model is about as reliable as weather forecasts, but it'll have to do.`);
      updateLog(`\nLoading portfolio...`);
      
      //overlay hide
      setTimeout(function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay && loadingOverlay.style.display !== 'none') {
          console.log('Force hiding loading screen after timeout');
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
            loadingOverlay.style.display = 'none';
          },150);
        }
      }, 150);
    }
  }
  
  updateLog('Initializing model architecture (or just pretending to understand TensorFlow)...');
  setTimeout(() => {
    // updateLog('Loading training data (aka random numbers I found on the internet)...');
    setTimeout(() => {
      // updateLog('Starting training process (fingers crossed it actually works)...\n');
      simulateEpoch();
    }, 300); 
  }, 300); 
});
const sarcasticMessages = [
  "Training a model that will probably be outsmarted by a toddler...",
  "Converting caffeine into machine learning code...",
  "Pretending to understand neural networks since 2023...",
  "Teaching silicon to think. What could go wrong?",
  "Making random guesses and calling it AI...",
  "Epoch 4/10: Still better accuracy than my life choices",
  "Adding unnecessary complexity to impress recruiters...",
  "If this model works, it's pure luck...",
  "Calculating the probability of you getting hired...",
  "Overfitting to your resume expectations...",
  "Neural network currently experiencing existential crisis...",
  "Gradient descent: Like my career, slowly going downhill",
  "Backpropagating errors (and my poor life decisions)",
  "Optimizing hyperparameters and my chances of employment",
  "This loading bar is about as useful as a degree in ML"
];
