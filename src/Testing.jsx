function Testing() {
  function sendDirectMessage() {
    const templateOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'key_z6hIuLo8GC'  // Replace with your actual API key
      },
      body: JSON.stringify({
        name: 'otp_template',
        language: 'en',
        components: [
          {
            type: 'BODY',  // Setting the type to BODY
            parameters: [  // Adding parameters for placeholders
              {
                type: 'text',
                text: 'Nithish'  // This will replace {{1}} in the template
              },
              {
                type: 'text',
                text: '974382'  // This will replace {{2}} in the template
              }
            ]
          }
        ],
        category: 'UTILITY',  // Category is required
        allowCategoryUpdate: true
      })
    };

    fetch('https://public.doubletick.io/template', templateOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Template creation response:', data);
      })
      .catch(error => {
        console.error('Error creating template:', error);
      });
  }

  return (
    <div className="flex gap-4">
      <button onClick={sendDirectMessage}>Send Direct Message</button>
    </div>
  );
}

export default Testing;
