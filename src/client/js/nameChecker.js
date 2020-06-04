function checkForName(inputText) {
  console.log('::: Running checkForName :::', inputText);
  let names = ['Picard', 'Janeway', 'Kirk', 'Archer', 'Georgiou'];

  const buttonShowInstructions = document.querySelector('.button');
  const instructions = document.querySelector('.description');

  buttonShowInstructions.addEventListener('click', () => {
    instructions.style.display = 'block';
    buttonShowInstructions.style.display = 'none';
  });

  if (names.includes(inputText)) {
    alert('Welcome, Captain!');
  }
}

export { checkForName };
