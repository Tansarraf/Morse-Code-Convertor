document.addEventListener("DOMContentLoaded", function () {
  const resetButton = document.getElementById("resetButton");
  const inputText = document.getElementById("inputText");
  const conversionForm = document.getElementById("conversionForm");
  const conversionType = document.getElementById("conversionType");
  const morseOutput = document.getElementById("morse-output");
  const resultText = morseOutput.querySelector(".result-text");
  const copyMessage = morseOutput.querySelector(".copy-message");
  const historyList = document.getElementById("historyList");
  const clearHistoryBtn = document.getElementById("clearHistory");
  const convertBtn = conversionForm.querySelector('button[type="submit"]');
  const loadingOverlay = morseOutput.querySelector(".loading-overlay");

  // Load history from localStorage
  let conversionHistory = JSON.parse(
    localStorage.getItem("morseHistory") || "[]"
  );

  // Update history display
  function updateHistoryDisplay() {
    historyList.innerHTML = "";
    conversionHistory.forEach((item, index) => {
      if (index < 10) {
        // Keep only last 10 conversions visible
        const li = document.createElement("li");
        li.className = "history-item";
        li.innerHTML = `
          <div class="history-text">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div>${item.text}</div>
                <div class="text-primary mt-1">→ ${item.result}</div>
              </div>
              <small class="history-type ms-2">${item.type}</small>
            </div>
          </div>
        `;
        li.addEventListener("click", () => {
          inputText.value = item.text;
          conversionType.value =
            item.type === "Text → Morse" ? "text_to_morse" : "morse_to_text";
        });
        historyList.prepend(li);
      }
    });
  }

  // Update history on form submission
  conversionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading states
    convertBtn.classList.add("btn-loading");
    loadingOverlay.classList.add("show");

    const formData = new FormData(conversionForm);
    fetch(window.location.href, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newResult = doc.querySelector(".result-text").textContent;
        resultText.textContent = newResult;

        // Add to history
        const type =
          conversionType.value === "text_to_morse"
            ? "Text → Morse"
            : "Morse → Text";
        conversionHistory.unshift({
          text: inputText.value,
          result: newResult,
          type: type,
          timestamp: new Date().toISOString(),
        });

        // Keep only last 10 items
        conversionHistory = conversionHistory.slice(0, 10);

        // Save to localStorage
        localStorage.setItem("morseHistory", JSON.stringify(conversionHistory));

        // Update display
        updateHistoryDisplay();
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => {
        // Hide loading states after a minimum delay of 300ms for better UX
        setTimeout(() => {
          convertBtn.classList.remove("btn-loading");
          loadingOverlay.classList.remove("show");
        }, 300);
      });
  });

  // Clear history
  clearHistoryBtn.addEventListener("click", function () {
    conversionHistory = [];
    localStorage.removeItem("morseHistory");
    updateHistoryDisplay();
  });

  // Initialize history display
  updateHistoryDisplay();

  // Copy to clipboard functionality
  morseOutput.addEventListener("click", function () {
    const textToCopy = resultText.textContent;
    if (textToCopy.trim() === "") return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(function () {
        // Show copy message
        resultText.classList.add("hide");
        copyMessage.classList.add("show");

        // Hide copy message after 1 second
        setTimeout(() => {
          copyMessage.classList.remove("show");
          resultText.classList.remove("hide");
        }, 1000);
      })
      .catch(function (err) {
        console.error("Failed to copy text: ", err);
      });
  });

  // Reset functionality
  resetButton.addEventListener("click", function () {
    inputText.value = "";
    resultText.textContent = "";
    conversionType.value = "text_to_morse";
  });
});

// Add floating dots animation
function createDots() {
  const dotsContainer = document.getElementById("morseDots");
  const numberOfDots = 20;

  for (let i = 0; i < numberOfDots; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";

    // Random size between 5px and 15px
    const size = Math.random() * 10 + 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    // Random position
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;

    // Random animation delay
    dot.style.animationDelay = `${Math.random() * 2}s`;

    dotsContainer.appendChild(dot);
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  createDots();
});
