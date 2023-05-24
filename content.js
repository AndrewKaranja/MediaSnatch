function getMediaElements(mediaType) {
  const mediaElements = document.querySelectorAll('img, video, audio, source, a');
  return Array.from(mediaElements).filter((el) => {
    // ... (the same filter logic from the previous content.js)
    // if (mediaType === 'all') return true;
    
    if (el.tagName === 'A') {
      const fileExtension = el.href.split('.').pop().toLowerCase();
      if (mediaType === 'image') {
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(fileExtension);
      } else if (mediaType === 'video') {
        return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'].includes(fileExtension);
      } else if (mediaType === 'audio') {
        return ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(fileExtension);
      } else if (mediaType === 'document') {
        return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(fileExtension);
      }
    } else {
      if (mediaType === 'image') {
        return el.tagName === 'IMG';
      } else if (mediaType === 'video') {
        return el.tagName === 'VIDEO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'VIDEO');
      } else if (mediaType === 'audio') {
        return el.tagName === 'AUDIO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'AUDIO');
      }
    }
    return false;
  });
}

function getMediaUrls(mediaType) {
  const mediaElements = getMediaElements(mediaType);
  return mediaElements.map((el) => {
    // ... (the same map logic from the previous content.js)
    if (el.tagName === 'A') {
      return el.href;
    } else {
      return el.src;
    }
  });
}

function highlightMediaElement(el, action) {
  if (action === 'add') {
    el.style.outline = '3px solid red';
  } else if (action === 'remove') {
    el.style.outline = '';
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getMediaUrls') {
    // ... (the same logic as before)
    try {
      const mediaUrls = getMediaUrls(message.mediaType);
      sendResponse({ mediaUrls: mediaUrls });
    } catch (error) {
      console.error('Error in content script:', error);
      sendResponse({ error: error.message });
    }
  } else if (message.type === 'highlightMedia') {
    const mediaElements = getMediaElements(message.mediaType);
    const el = mediaElements[message.index];
    if (el) {
      highlightMediaElement(el, message.action);
    }
  } else if (message.type === 'clickMedia') {
    const mediaElements = getMediaElements(message.mediaType);
    const el = mediaElements[message.index];
    if (el && el.href) {
      window.open(el.href, '_blank');
    }
  }

  return true;
});







// function getMediaUrls(mediaType) {
//     const mediaElements = document.querySelectorAll('img, video, audio, source, a');
  
//     const mediaUrls = Array.from(mediaElements).filter((el) => {
//       // ... (the same filter logic from the previous content.js)
//       if (mediaType === 'all') return true;
    
//       if (el.tagName === 'A') {
//         const fileExtension = el.href.split('.').pop().toLowerCase();
//         if (mediaType === 'image') {
//           return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(fileExtension);
//         } else if (mediaType === 'video') {
//           return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'].includes(fileExtension);
//         } else if (mediaType === 'audio') {
//           return ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(fileExtension);
//         } else if (mediaType === 'document') {
//           return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(fileExtension);
//         }
//       } else {
//         if (mediaType === 'image') {
//           return el.tagName === 'IMG';
//         } else if (mediaType === 'video') {
//           return el.tagName === 'VIDEO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'VIDEO');
//         } else if (mediaType === 'audio') {
//           return el.tagName === 'AUDIO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'AUDIO');
//         }
//       }
//       return false;
//     }).map((el) => {
//       // ... (the same map logic from the previous content.js)
//       if (el.tagName === 'A') {
//         return el.href;
//       } else {
//         return el.src;
//       }
//     });
  
//     return mediaUrls;
//   }
  
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === 'getMediaUrls') {
//       try {
//         const mediaUrls = getMediaUrls(message.mediaType);
//         sendResponse({ mediaUrls: mediaUrls });
//       } catch (error) {
//         console.error('Error in content script:', error);
//         sendResponse({ error: error.message });
//       }
//     }
//     return true; // Indicate that the response function will be called asynchronously
//   });



//OPTION3.........................

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === 'getMediaUrls') {
//       try {
//         const mediaType = message.mediaType;
//         const mediaElements = document.querySelectorAll('img, video, audio, source, a');
  
//         const mediaUrls = Array.from(mediaElements).filter((el) => {
//             // ... (the same filter logic from the previous content.js)
//             if (mediaType === 'all') return true;
    
//             if (el.tagName === 'A') {
//               const fileExtension = el.href.split('.').pop().toLowerCase();
//               if (mediaType === 'image') {
//                 return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'].includes(fileExtension);
//               } else if (mediaType === 'video') {
//                 return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv'].includes(fileExtension);
//               } else if (mediaType === 'audio') {
//                 return ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(fileExtension);
//               } else if (mediaType === 'document') {
//                 return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(fileExtension);
//               }
//             } else {
//               if (mediaType === 'image') {
//                 return el.tagName === 'IMG';
//               } else if (mediaType === 'video') {
//                 return el.tagName === 'VIDEO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'VIDEO');
//               } else if (mediaType === 'audio') {
//                 return el.tagName === 'AUDIO' || (el.tagName === 'SOURCE' && el.parentElement.tagName === 'AUDIO');
//               }
//             }
//             return false;
//           }).map((el) => {
//             // ... (the same map logic from previous popup.js)
//             if (el.tagName === 'A') {
//                 return el.href;
//               } else {
//                 return el.src;
//               }
//           });
  
//         console.log('Sending mediaUrls:', mediaUrls);
//         sendResponse({ mediaUrls: mediaUrls });
//       } catch (error) {
//         console.error('Error in content script:', error);
//         sendResponse({ error: error.message });
//       }
//     }
//     return true; // Indicate that the response function will be called asynchronously
//   });



  