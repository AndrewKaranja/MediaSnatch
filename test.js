const mediaType = 'all';
const mediaList = document.getElementById('media-list');
const searchInput = document.getElementById('search-input');

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];

  chrome.tabs.sendMessage(tab.id, { type: 'getMediaUrls', mediaType: mediaType }, (response) => {
    const mediaUrls = response.mediaUrls;

    function populateMediaList(mediaUrls) {
      mediaList.innerHTML = '';

      mediaUrls.forEach((url, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.textContent = url;

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.style.marginLeft = '10px';

        downloadBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          chrome.downloads.download({ url: url });
        });

        li.appendChild(a);
        li.appendChild(downloadBtn);
        mediaList.appendChild(li);

        li.addEventListener('mouseover', () => {
          chrome.tabs.sendMessage(tab.id, { type: 'highlightMedia', action: 'add', index: index, mediaType: mediaType });
        });

        li.addEventListener('mouseout', () => {
          chrome.tabs.sendMessage(tab.id, { type: 'highlightMedia', action: 'remove', index: index, mediaType: mediaType });
        });

        li.addEventListener('click', (event) => {
          event.preventDefault();
          chrome.tabs.sendMessage(tab.id, { type: 'clickMedia', index: index, mediaType: mediaType });
        });
      });
    }

    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredUrls = mediaUrls.filter((url) => url.toLowerCase().includes(searchTerm));
      populateMediaList(filteredUrls);
    });

    populateMediaList(mediaUrls);
  });
});
