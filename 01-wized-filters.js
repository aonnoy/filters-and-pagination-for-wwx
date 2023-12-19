window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  let debounceTimer;
  let previousFilterState = getCurrentFilterState(); // Initialize previous filter state

  // Function to get the current state of filters
  function getCurrentFilterState() {
    const filterState = {};
    const filterElements = document.querySelectorAll("[wized-variable]");
    filterElements.forEach((element) => {
      const variableName = element.getAttribute("wized-variable");
      filterState[variableName] = Wized.data.v[variableName];
    });
    return filterState;
  }

  // Function to check if filters have changed
  function haveFiltersChanged() {
    const currentFilterState = getCurrentFilterState();
    return (
      JSON.stringify(currentFilterState) !== JSON.stringify(previousFilterState)
    );
  }

  // Global function to execute Wized request
  window.executeWizedRequest = async () => {
    if (haveFiltersChanged()) {
      const filtersElement = document.querySelector(
        '[wized-filter-element="filters"]'
      );
      if (
        filtersElement &&
        filtersElement.hasAttribute("wized-filter-request")
      ) {
        const requestName = filtersElement.getAttribute("wized-filter-request");
        try {
          await Wized.requests.execute(requestName);
          console.log(`Request ${requestName} executed successfully`);
          previousFilterState = getCurrentFilterState(); // Update the filter state
        } catch (error) {
          console.error(`Error executing request ${requestName}:`, error);
        }
      }
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Function to update Wized variable
  const updateWizedVariable = (variableName, value) => {
    Wized.data.v[variableName] = value;
  };

  // Function to reset current page and execute Wized request
  const resetCurrentPageAndExecuteWizedRequest = () => {
    const currentPageVariableName = document
      .querySelector('[wized-filter-element="filters"]')
      ?.getAttribute("wized-filter-current-page");
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
      window.executeWizedRequest();
    }
  };

  // Function to apply filters and update page
  const applyFiltersAndUpdatePage = debounce(() => {
    if (haveFiltersChanged()) {
      resetCurrentPageAndExecuteWizedRequest();
      previousFilterState = getCurrentFilterState(); // Update previous state
    }
  }, 500);

  // Event handler functions
  const handleCheckboxChange = (checkbox) => {
    const variableName = checkbox
      .closest("[wized-variable]")
      .getAttribute("wized-variable");
    const checkboxes = document.querySelectorAll(
      `[wized-variable="${variableName}"] input[type="checkbox"]`
    );
    const checkedValues = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.nextElementSibling.textContent.trim());
    updateWizedVariable(variableName, checkedValues);
    applyFiltersAndUpdatePage();
    window.updateFilterButtonVisibility(); // Add this line
  };

  const handleRadioChange = (radio) => {
    const variableName = radio
      .closest("[wized-variable]")
      .getAttribute("wized-variable");
    const value = radio.checked
      ? radio.nextElementSibling.textContent.trim()
      : "";
    updateWizedVariable(variableName, value);
    applyFiltersAndUpdatePage();
    window.updateFilterButtonVisibility(); // Add this line
  };

  const handleSelectChange = (select) => {
    const variableName = select.getAttribute("wized-variable");
    const value = select.value;
    updateWizedVariable(variableName, value);
    applyFiltersAndUpdatePage();
    window.updateFilterButtonVisibility(); // Add this line
  };

  // Function to execute Wized request based on the trigger element
  const executeTriggeredWizedRequest = async () => {
    const triggerElement = document.querySelector(
      "[wized-filter-request-trigger]"
    );
    if (triggerElement) {
      const requestName = triggerElement.getAttribute(
        "wized-filter-request-trigger"
      );
      if (requestName) {
        resetCurrentPageVariable(); // Reset current page variable to 1
        try {
          await Wized.requests.execute(requestName);
          console.log(`Triggered request ${requestName} executed successfully`);
        } catch (error) {
          console.error(
            `Error executing triggered request ${requestName}:`,
            error
          );
        }
      }
    }
  };

  // Function to reset the current page variable to 1
  const resetCurrentPageVariable = () => {
    const currentPageVariableName = document
      .querySelector('[wized-filter-element="filters"]')
      ?.getAttribute("wized-filter-current-page");
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
    }
  };

  // Function to prevent default form submission
  const preventDefaultFormSubmission = () => {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        executeTriggeredWizedRequest(); // Optionally trigger a Wized request on form submission
      });
    });
  };

  // Function to handle keypress event in search input
  const handleSearchInputKeypress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      // Optionally, add any logic here to handle the search action
    }
  };

  // Function to handle button and link clicks within the form
  const handleFormElementClick = (event) => {
    event.preventDefault(); // Prevent default action (like form submission)
    // Optionally, add any specific logic for button or link click here
  };

  // Function to attach event listeners
  const attachListeners = () => {
    document
      .querySelectorAll('[wized-variable] input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () =>
          handleCheckboxChange(checkbox)
        );
      });

    document
      .querySelectorAll('[wized-variable] input[type="radio"]')
      .forEach((radio) => {
        radio.addEventListener("change", () => handleRadioChange(radio));
      });

    document.querySelectorAll("select[wized-variable]").forEach((select) => {
      select.addEventListener("change", () => handleSelectChange(select));
    });

    preventDefaultFormSubmission(); // Attach form submission preventer
    // Attach keypress listener to search input
    const searchInput = document.querySelector(
      "input[wized-filter-search-variable]"
    );
    if (searchInput) {
      searchInput.addEventListener("keypress", handleSearchInputKeypress);
    }

    const formButtonsAndLinks = document.querySelectorAll(
      'form button, form a, form input[type="button"], form input[type="submit"]'
    );
    formButtonsAndLinks.forEach((element) => {
      element.addEventListener("click", handleFormElementClick);
    });
  };

  // Attach event listener to the trigger element
  const attachTriggerListener = () => {
    const triggerElement = document.querySelector(
      "[wized-filter-request-trigger]"
    );
    if (triggerElement) {
      triggerElement.addEventListener("click", executeTriggeredWizedRequest);
    }
  };

  // Function to attach all event listeners
  const attachAllListeners = () => {
    attachListeners(); // Attach filter listeners
    attachTriggerListener(); // Attach trigger listener
  };

  // MutationObserver to observe dynamic changes in filter elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        attachAllListeners();
      }
    });
  });

  observer.observe(document.querySelector('[wized-filter-element="filters"]'), {
    childList: true,
    subtree: true,
  });

  attachAllListeners(); // Initialize all event listeners
});
