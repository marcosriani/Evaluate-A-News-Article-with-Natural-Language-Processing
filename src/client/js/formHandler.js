function handleSubmit(event) {
  event.preventDefault();

  // Hide instructions paragraphs and result title
  const instructions = document.querySelector('.description');
  const buttonShowInstructions = document.querySelector('.button');
  const resultTitle = document.querySelector('.result-title');
  const containerDiv = document.querySelector('#result');

  instructions.style.display = 'none';
  resultTitle.style.display = 'block';

  instructions.style.display === 'none'
    ? (buttonShowInstructions.style.display = 'block')
    : null;

  //  text was put into the form field
  const formField = document.getElementById('name');
  let formText = formField.value;

  // Execute button clicked function
  Client.validatorAndButton(formText, resultTitle, containerDiv);

  const url = 'http://localhost:3000/apicall?input=';

  // Query data with a GET request
  const apiCall = async (url = '', textOrUrlAnalyser) => {
    const response = await fetch(
      url + encodeURIComponent(`${textOrUrlAnalyser}`)
    );

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error here: ', error);
    }
  };

  // Post data returned from API to a database variable in server.js
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
  const createWrapperElement = (title, elementClass) => {
    //   Wrapper div
    const divElement = document.createElement('div');
    const spanElement = document.createElement('span');

    // Adding class
    divElement.classList.add(elementClass);

    // Appending elements
    containerDiv.appendChild(divElement);
    divElement.innerHTML = title;
    divElement.appendChild(spanElement);

    return spanElement;
  };

  const updateUI = async () => {
    const result = await fetch('http://localhost:3000/all');
    try {
      const returnedData = await result.json();
      const latestData = returnedData[returnedData.length - 1];

      // Reset form field and clear all HTML elements before rebuilding
      containerDiv.innerHTML = '';
      formField.value = '';

      // Creating elements and appending content
      createWrapperElement('Text: ', 'text').innerHTML = latestData.text;
      createWrapperElement('Polarity : ', 'polarity').innerHTML =
        latestData.polarity;
      createWrapperElement(
        'Polarity Confidence : ',
        'polarity-confidence'
      ).innerHTML = latestData.polarity_confidence;
      createWrapperElement('Subjectivity : ', 'subjectivity').innerHTML =
        latestData.subjectivity;
      createWrapperElement(
        'Subjectivity Confidence : ',
        'subjectivity-confidence'
      ).innerHTML = latestData.subjectivity_confidence;

      return returnedData;
    } catch (error) {
      console.log('Update UI error', error);
    }
  };

  // Calling the GET, POST request and GET request to update UI
  // Making sure the input is not just numbers
  if (formText.match(/^[0-9]+$/) && formText.length > 10) {
    alert('Error, too many numerical characters');
    location.reload();
  } else {
    apiCall(url, formText)
      .then((data) => {
        postData('http://localhost:3000/database', data);
      })
      .then(() => {
        updateUI();
      });
  }
}

export { handleSubmit };
