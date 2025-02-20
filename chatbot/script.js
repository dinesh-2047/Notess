
document.getElementById('send-btn').addEventListener('click', sendMessage);

async function sendMessage() {
  const userMessage = document.getElementById('user-input').value.trim();

  if (userMessage === '') {
    console.log('User message is empty, nothing to send.');
    return; 
  }


  displayMessage(userMessage, 'user-message');
  document.getElementById('user-input').value = '';

  try {
    const response = await axios.post('http://localhost:3000/send-message', {
      message: userMessage
    });
    const formattedResponse = formatResponse(response.data.response)
    displayMessage(formattedResponse, 'model-message');
  } catch (err) {
    console.error('Error:', err);
    displayMessage('Oops! Something went wrong. Please try again.', 'model-message');
  }
}

function formatResponse(response) {
    
    const lines = response.split('\n');
  let formattedHtml = '';
  
  lines.forEach(line => {
    line = line.trim();

    if (line.includes('**')) {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    if (line.startsWith('*')) {
      formattedHtml += `<ul><li>${line.substring(1).trim()}</li></ul>`;
    } else if (line) {
      formattedHtml += `<p>${line}</p>`;
    }
  });

  return formattedHtml;
  }

function displayMessage(message, messageType) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', messageType);
  messageDiv.innerHTML = message; 
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
