document.getElementById('download-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const mediaType = document.getElementById('media-type').value;
  
    // Inject the content script
    chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] })
      .then(async () => {
        // Call the getMediaUrls function directly
        const mediaUrls = await new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tab.id, { type: 'getMediaUrls', mediaType: mediaType }, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
              return;
            }
  
            if (response.error) {
              reject(new Error(response.error));
              return;
            }
  
            resolve(response.mediaUrls);
          });
        });
  
        console.log('Received mediaUrls:', mediaUrls);
  
        const mediaList = document.getElementById('media-list');
        mediaList.innerHTML = '';
  
        mediaUrls.forEach((url) => {
          // ... (the same logic to create media list items from previous popup.js)
          if (url) {
            const listItem = document.createElement('div');
            listItem.classList.add('media-item');
            
            const mediaUrl = document.createElement('div');
            mediaUrl.classList.add('media-url');
            mediaUrl.textContent = url;
            
            const downloadButton = document.createElement('button');
            downloadButton.classList.add('download-button');
            downloadButton.textContent = 'Download';
            downloadButton.onclick = () => {
              const link = document.createElement('a');
              link.href = url;
              link.download = '';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };
            
            listItem.appendChild(mediaUrl);
            listItem.appendChild(downloadButton);
            mediaList.appendChild(listItem);
          }
        });
      })
      .catch((error) => {
        console.error('Error in popup script:', error.message);
      });
  });





  
  
  