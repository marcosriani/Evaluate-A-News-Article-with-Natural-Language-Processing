function buttonClicked(inputText) {
  const buttonShowInstructions = document.querySelector('.button');
  const instructions = document.querySelector('.description');

  buttonShowInstructions.addEventListener('click', () => {
    instructions.style.display = 'block';
    buttonShowInstructions.style.display = 'none';
  });
}

export { buttonClicked };
