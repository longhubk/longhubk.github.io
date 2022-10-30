// Get the input field

const btnSearch = () => {
  const input = document.getElementById("is");
  insertParam("keyword", input.value, "keyword");
};

const injectSearch = (keyword) => {
  const searchHTML = `
        <input id="is" type="text" value="" placeholder="Type something..." autofocus  />
        <button id="bs" onclick="btnSearch()">Search</button>`;

  const searchBox = document.getElementById("sb");
  searchBox.innerHTML = searchHTML;

  const input = document.getElementById("is");
  if (keyword) {
    input.value = keyword;
  }
  // Execute a function when the user presses a key on the keyboard

  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      console.log("press here");
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("bs").click();
    }
  });
  return;
};
