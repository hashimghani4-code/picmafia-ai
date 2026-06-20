document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt');
  const styleSelect = document.getElementById('style');
  const sizeSelect = document.getElementById('size');
  const generateBtn = document.getElementById('generate-btn');
  const btnText = generateBtn.querySelector('.btn-text');
  const spinner = generateBtn.querySelector('.spinner');
  const errorBox = document.getElementById('error-message');
  
  const previewPlaceholder = document.getElementById('preview-placeholder');
  const imageContainer = document.getElementById('image-container');
  const outputImage = document.getElementById('output-image');
  const downloadBtn = document.getElementById('download-btn');
  const exampleBtns = document.querySelectorAll('.example-btn');

  // Load example values cleanly into prompt field
  exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      promptInput.value = btn.getAttribute('data-prompt');
      promptInput.focus();
    });
  });

  // Main Generation Handler
  generateBtn.addEventListener('click', async () => {
    const rawPrompt = promptInput.value.trim();
    const chosenStyle = styleSelect.value;
    const chosenSize = sizeSelect.value;

    // Validate empty prompt
    if (!rawPrompt) {
      showError('Please write down an image concept or choose a quick example.');
      return;
    }

    // Front-end sanity length safeguard
    if (rawPrompt.length > 1000) {
      showError('Prompt exceeds limit of 1000 characters.');
      return;
    }

    // Reset visibility states
    hideError();
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: rawPrompt,
          style: chosenStyle,
          size: chosenSize
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected the request.');
      }

      // Handle response injection
      if (data.url || data.b64_json) {
        const sourceData = data.url ? data.url : `data:image/png;base64,${data.b64_json}`;
        outputImage.src = sourceData;
        
        // Setup download listener safely
        downloadBtn.onclick = () => {
          const dlLink = document.createElement('a');
          dlLink.href = sourceData;
          dlLink.download = `picmafia-${Date.now()}.png`;
          document.body.appendChild(dlLink);
          dlLink.click();
          document.body.removeChild(dlLink);
        };

        // Render visibility state
        previewPlaceholder.classList.add('hidden');
        imageContainer.classList.remove('hidden');
      } else {
        throw new Error('Invalid image payload returned from endpoint.');
      }

    } catch (err) {
      showError(err.message || 'An unexpected error has occurred.');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (isLoading) {
      generateBtn.disabled = true;
      btnText.textContent = 'Crafting Image...';
      spinner.classList.remove('hidden');
    } else {
      generateBtn.disabled = false;
      btnText.textContent = 'Generate Masterpiece';
      spinner.classList.add('hidden');
    }
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }

  function hideError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
  }
});
