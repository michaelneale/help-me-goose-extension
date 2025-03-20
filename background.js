// Initialize context menu items when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "helpMeGoose",
    title: "Help Me Goose",
    contexts: ["page"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "helpMeGoose") {
    // For entire page content, we need to inject a content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePageContent
    }, (results) => {
      if (results && results[0]) {
        sendToGoose(results[0].result, tab.title);
      }
    });
  }
});

// Function to scrape page content
function scrapePageContent() {
  // Get the main content of the page
  const content = document.body.innerText;
  return content;
}

// Function to safely handle base64 encoding across browsers
function safeBase64Encode(str) {
  // First, encode as UTF-8
  try {
    // Modern browsers
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
  } catch (e) {
    console.error("Base64 encoding error:", e);
    // Fallback for very long strings that might cause issues in some browsers
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      return btoa(String.fromCharCode(...new Uint8Array(data)));
    } catch (e2) {
      console.error("Fallback encoding error:", e2);
      return btoa(unescape(encodeURIComponent(str))); // Last resort fallback
    }
  }
}

// Function to send data to Goose app
function sendToGoose(content, pageTitle) {
  // Create the JSON object
  const data = {
    instructions: `Help me understand this content from "${pageTitle}": ${content}`,
    activities: ["from browser"]
  };
  
  // Convert to JSON string and then to base64
  const jsonStr = JSON.stringify(data);
  const base64Encoded = safeBase64Encode(jsonStr);
  
  // Create the URL and open it
  const gooseUrl = `goose://bot?config=${encodeURIComponent(base64Encoded)}`;
  
  // Try to open the URL in a way that works across browsers
  try {
    // Standard approach - works in most browsers
    chrome.tabs.create({ url: gooseUrl }, (tab) => {
      // Handle potential errors with custom protocol
      setTimeout(() => {
        // Check if the tab is still loading the protocol URL after a short delay
        // If so, it might indicate the protocol isn't registered
        chrome.tabs.get(tab.id, (checkTab) => {
          if (chrome.runtime.lastError) {
            // Tab might have been closed by the browser if protocol handler worked
            return;
          }
          
          if (checkTab && checkTab.url && checkTab.url.startsWith("goose://")) {
            // Show a helpful message if the tab is still trying to load the protocol
            chrome.tabs.update(tab.id, {
              url: "protocol-error.html"
            });
          }
        });
      }, 1000);
    });
  } catch (e) {
    console.error("Error opening Goose URL:", e);
    // Fallback for browsers that might handle custom protocols differently
    window.open(gooseUrl, "_blank");
  }
}