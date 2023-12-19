window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  let debounceTimer;

  // Debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Function to execute Wized request
  const executeWizedRequest = async (requestName) => {
    try {
      await Wized.requests.execute(requestName);
      console.log(`Request ${requestName} executed successfully`);
    } catch (error) {
      console.error(`Error executing request ${requestName}:`, error);
    }
  };

  // Function to handle search input changes
  const handleSearchInputChange = debounce((input) => {
    const searchVariableName = input.getAttribute(
      "wized-filter-search-variable"
    );
    const currentPageVariableName = document
      .querySelector("[wized-filter-current-page]")
      .getAttribute("wized-filter-current-page");
    const requestName = document
      .querySelector("[wized-filter-search-request]")
      .getAttribute("wized-filter-search-request");

    // Update Wized variable with search value
    Wized.data.v[searchVariableName] = input.value;

    // Reset current page to 1
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
    }

    // Execute the Wized request
    if (requestName) {
      executeWizedRequest(requestName);
    }
  }, 500);

  // Function to attach event listeners
  const attachListeners = () => {
    document
      .querySelectorAll("input[wized-filter-search-variable]")
      .forEach((input) => {
        input.removeEventListener("input", handleSearchInputChange); // Remove existing listener
        input.addEventListener("input", () => handleSearchInputChange(input)); // Reattach listener
      });
  };

  attachListeners(); // Initialize event listeners
});
