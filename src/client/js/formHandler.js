function handleSubmit(event) {
  event.preventDefault();

  // check what text was put into the form field
  let formText = document.getElementById('name').value;

  Client.checkForName(formText);

  const url = 'http://localhost:3000/apicall?input=';

  // Query data with a GET request
  const apiCall = async (url = '', textToQuery) => {
    const response = await fetch(url + textToQuery);
    console.log(response);

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error here: ', error);
    }
  };

  // Post request
  const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    try {
      const newData = await response.json();
      return newData;
    } catch (error) {
      console.log('error', error);
    }
  };

  // Update the UI
  const updateUI = async () => {
    const result = await fetch('http://localhost:3000/all');
    try {
      const returnedData = await result.json();
      // const resultText = document.querySelector('#result');
      // resultText.innerHTML = returnedData.text;
      console.log('update UI', returnedData);
      return returnedData;
    } catch (error) {
      console.log('Update UI error', error);
    }
  };

  apiCall(url, formText)
    .then((data) => {
      postData('http://localhost:3000/database', data);
      console.log('data posted');
    })
    .then(() => {
      console.log('UI updated');
      updateUI();
    });
}

export { handleSubmit };
