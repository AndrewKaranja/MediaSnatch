document.getElementById('show-media-btn').addEventListener('click', async () => {
  
  


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



        //Preview code
        const previewContainer = document.getElementById('preview-container');
const preview = document.getElementById('preview');
const noPreviewMessage = 'No Preview';


function showPreview(url, mediaType) {
  preview.innerHTML = '';

  if (mediaType === 'image') {
    const img = document.createElement('img');
    img.style.aspectRatio='auto'
    img.style.height='100px'
    img.src = url;
    preview.appendChild(img);
  } else if (mediaType === 'video' || mediaType === 'audio') {
    const videoOrAudio = document.createElement(mediaType);
    videoOrAudio.src = url;
    videoOrAudio.controls = true;
    preview.appendChild(videoOrAudio);
  } else {
    preview.textContent = noPreviewMessage;
  }
}


//show image dimensions
function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      resolve({ width: this.width, height: this.height });
    };
    img.src = url;
  });
}

console.log(mediaUrls)
  // Check if mediaData is empty
  if (mediaUrls.length === 0) {
    document.getElementById('no-media').style.display = 'block';
    const message = document.createElement('p');
    message.style.color='#000'
    message.style.position='absolute'
    message.style.top='50%'
    message.style.margin='auto'
    message.textContent = "No media found on this page or access is blocked.";
    mediaList.appendChild(message);
    return;
  }

  
        

        

        mediaUrls.forEach(async (url, index) => {
          if(url){
  const li = document.createElement('li');
           const mediaUrl = document.createElement('div');
            mediaUrl.classList.add('media-url');
            mediaUrl.textContent = url;
            mediaUrl.style.overflowWrap='break-word';
            mediaUrl.style.wordBreak = 'break-all';



            //Custom Download button
            const downloadButtonSecondary = document.createElement('button');
    const icon = document.createElement('img');
    icon.src = 'icon.png';
    icon.style.width = '20px'; 
    icon.style.height = '20px'; 
    downloadButtonSecondary.appendChild(icon);
    downloadButtonSecondary.style.position = 'absolute';
    downloadButtonSecondary.style.width='fit-content'
    downloadButtonSecondary.style.right = '0';
    downloadButtonSecondary.style.top = '-10px';
    downloadButtonSecondary.style.border = '1px';
    downloadButtonSecondary.style.background = 'none';
    downloadButtonSecondary.onclick = () => {
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    downloadButtonSecondary.title = 'Download';


  const dimensions = await getImageDimensions(url);
  const dimensionsText = document.createElement('span');
  dimensionsText.textContent = ` (${dimensions.width}x${dimensions.height}) px`;
  dimensionsText.style.fontSize = '0.8em';
    dimensionsText.style.fontWeight = 'bold';
    dimensionsText.style.color = 'white';
    dimensionsText.style.backgroundColor = 'orange';
    dimensionsText.style.borderRadius = '4px';
    dimensionsText.style.padding = '2px 4px';
    dimensionsText.style.marginLeft = '10px';


  const mediaTypeExt = url.match(/\.(jpeg|jpg|gif|png|svg|webp|mp4|webm|ogg)$/i)[0];
    const mediaTypeExtText = document.createElement('span');
    mediaTypeExtText.textContent = ` ${mediaTypeExt.toUpperCase()} `;
    mediaTypeExtText.style.fontSize = '0.8em';
    mediaTypeExtText.style.fontWeight = 'bold';
    mediaTypeExtText.style.color = 'white';
    mediaTypeExtText.style.backgroundColor = '#1E88E5'; // Blue color
    mediaTypeExtText.style.borderRadius = '4px';
    mediaTypeExtText.style.padding = '2px 4px';
    mediaTypeExtText.style.marginLeft = '10px';


    if (mediaType === 'image') {
      const img = document.createElement('img');
  img.style.aspectRatio='auto'
  img.style.height='auto';
  if(dimensions.width<250){
    img.style.width= `${dimensions.width} `;
    img.style.margin='auto'

  }else{
    img.style.width= '100%';

  }
  img.src = url;
  li.appendChild(img);
    } else if (mediaType === 'video' || mediaType === 'audio') {
      const videoOrAudio = document.createElement(mediaType);
      videoOrAudio.src = url;
      videoOrAudio.controls = true;
      li.appendChild(videoOrAudio);
    } else {
      li.textContent = noPreviewMessage;
    }


 
  
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
  li.style.borderRadius = '10px';
  li.style.position='relative';
 
  li.appendChild(mediaUrl);
  li.appendChild(downloadButton);

  li.appendChild(dimensionsText);
  li.appendChild(mediaTypeExtText);
  li.appendChild(downloadButtonSecondary);
  mediaList.appendChild(li);
  mediaList.appendChild(message);
  mediaList.style.marginTop='10px';
 

  li.addEventListener('mouseover', () => {
    chrome.tabs.sendMessage(tab.id, { type: 'highlightMedia', action: 'add', index: index, mediaType: mediaType });
    // showPreview(url, mediaType);
  });

  li.addEventListener('mouseout', () => {
    chrome.tabs.sendMessage(tab.id, { type: 'highlightMedia', action: 'remove', index: index, mediaType: mediaType });
    
  });


  li.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    chrome.tabs.sendMessage(tab.id, { type: 'clickMedia', index: index, mediaType: mediaType });
    showPreview(url, mediaType);
  });
 
}

});

      })
      .catch((error) => {
        console.error('Error in popup script:', error.message);
      });
  });





  
  
  