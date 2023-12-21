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

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  const enableRangeSelectOptions = () => {
    document
      .querySelectorAll(
        "select[wized-filter-range-from], select[wized-filter-range-to]"
      )
      .forEach((select) => {
        select.querySelectorAll("option").forEach((option) => {
          option.disabled = false;
        });
      });
  };

  const resetParentWrapperVisibility = () => {
    const parentWrappers = document.querySelectorAll(
      '[wized-filter-element="parent-wrapper"]'
    );
    parentWrappers.forEach((parentWrapper) => {
      const hiddenClass = parentWrapper.getAttribute("wized-hidden-class");
      if (hiddenClass && parentWrapper.classList.contains(hiddenClass)) {
        parentWrapper.classList.remove(hiddenClass);
      }
    });
  };

  const findTagCategory = (variableName) => {
    const filterElement = document.querySelector(
      `[wized-variable="${variableName}"]`
    );
    return filterElement
      ? filterElement.getAttribute("wized-filter-tag-category")
      : null;
  };

  const removeCategoryTags = (category) => {
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    const tagsToRemove = [
      ...tagsWrapper.querySelectorAll('[wized-filter-tag="tag-template"]'),
    ].filter((tag) =>
      tag
        .querySelector('[wized-filter-tag="tag-text"]')
        .textContent.startsWith(`${category}:`)
    );
    tagsToRemove.forEach((tag) => tag.remove());
  };

  const resetIndividualFilter = (variableName) => {
    variableName.split(",").forEach((name) => {
      const trimmedName = name.trim();
      Wized.data.v[trimmedName] = Array.isArray(Wized.data.v[trimmedName])
        ? []
        : null;
      document
        .querySelectorAll(
          `[wized-variable="${trimmedName}"] input[type="checkbox"], [wized-variable="${trimmedName}"] input[type="radio"]`
        )
        .forEach((input) => {
          input.checked = false;
          const customInput = input.previousElementSibling;
          if (
            customInput &&
            customInput.classList.contains("w--redirected-checked")
          ) {
            customInput.classList.remove("w--redirected-checked");
          }
        });
      const select = document.querySelector(
        `select[wized-variable="${trimmedName}"]`
      );
      if (select) {
        select.selectedIndex = 0;
      }
      const searchInput = document.querySelector(
        `input[wized-filter-search*="${trimmedName}"]`
      );
      if (searchInput) {
        searchInput.value = "";
      }
      const tagCategory = findTagCategory(trimmedName);
      if (tagCategory) {
        removeCategoryTags(tagCategory);
      }
    });
    enableRangeSelectOptions();
    resetParentWrapperVisibility();
    debouncedResetPageAndExecuteWizedRequest();
    window.updateFilterButtonVisibility(); // Add this line
  };

  const clearAllFilters = () => {
    let filtersWereActive = areFiltersActive();
    console.log("Filters were active before clearing:", filtersWereActive);

    // Reset all individual filters
    document.querySelectorAll("[wized-filter-clear]").forEach((clearButton) => {
      const variableNames = clearButton.getAttribute("wized-filter-clear");
      if (variableNames !== "clear-all") {
        resetIndividualFilter(variableNames);
      }
    });

    // Common reset operations
    enableRangeSelectOptions();
    resetParentWrapperVisibility();
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    if (tagsWrapper) {
      tagsWrapper.innerHTML = "";
    }

    // Reset current page to 1 only if filters were active
    if (filtersWereActive) {
      resetCurrentPageToFirst();
      debouncedResetPageAndExecuteWizedRequest();
      window.updateFilterButtonVisibility(); // Add this line
    } else {
      console.log(
        "Skipping Wized request execution as no filters were active."
      );
    }
  };

  // Function to reset current page variable to 1
  const resetCurrentPageToFirst = () => {
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

  // Function to check if any filters are active
  const areFiltersActive = () => {
    const filterElements = document.querySelectorAll("[wized-variable]");
    return Array.from(filterElements).some((filterElement) => {
      const variableName = filterElement.getAttribute("wized-variable");
      const variableValue = Wized.data.v[variableName];
      const isActive =
        (Array.isArray(variableValue) && variableValue.length > 0) ||
        (typeof variableValue === "string" && variableValue.trim() !== "");
      console.log(`Filter ${variableName}: Active - ${isActive}`);
      return isActive;
    });
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const executeWizedRequestTrigger = async () => {
    const triggerElement = document.querySelector(
      "[wized-filter-request-trigger]"
    );
    if (triggerElement) {
      const requestName = triggerElement.getAttribute(
        "wized-filter-request-trigger"
      );
      if (requestName) {
        try {
          console.log(`Executing request: ${requestName}`);
          await Wized.requests.execute(requestName);
          console.log(`Request ${requestName} executed successfully`);
        } catch (error) {
          console.error(`Error executing request ${requestName}:`, error);
        }
      }
    }
  };

  const resetPageAndExecuteWizedRequest = () => {
    // Modify this function to reset the page only if there were active filters
    if (areFiltersActive()) {
      resetInfiniteLoadingContent();
      const currentPageVariableName = document
        .querySelector('[wized-filter-element="filters"]')
        ?.getAttribute("wized-filter-current-page");
      if (
        currentPageVariableName &&
        Wized.data.v.hasOwnProperty(currentPageVariableName)
      ) {
        Wized.data.v[currentPageVariableName] = 1;
      }
    }
    executeWizedRequestTrigger();
  };

  const debouncedResetPageAndExecuteWizedRequest = debounce(
    resetPageAndExecuteWizedRequest,
    1000
  );

  function resetInfiniteLoadingContent() {
    // Assuming 'variableName' holds the content for infinite loading
    const variableName = document
      .querySelector("[wized-load-more-variable]")
      ?.getAttribute("wized-load-more-variable");
    if (variableName && Wized.data.v.hasOwnProperty(variableName)) {
      Wized.data.v[variableName] = []; // Reset the content to an empty array
    }
  }

  document.querySelectorAll("[wized-filter-clear]").forEach((clearButton) => {
    clearButton.addEventListener("click", (e) => {
      e.preventDefault();
      const variableNames = clearButton.getAttribute("wized-filter-clear");
      if (variableNames === "clear-all") {
        clearAllFilters();
      } else {
        resetIndividualFilter(variableNames);
      }
      debouncedResetPageAndExecuteWizedRequest();
    });
  });

  const attachListeners = () => {
    // Existing code to attach listeners for checkboxes, radios, selects, and search inputs
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        attachListeners();
      }
    });
  });

  observer.observe(document.querySelector('[wized-filter-element="filters"]'), {
    childList: true,
    subtree: true,
  });

  attachListeners();
  enableRangeSelectOptions();
});

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

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOMContentLoaded event fired");
  window.updateFilterButtonVisibility();
});

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

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  const enableRangeSelectOptions = () => {
    document
      .querySelectorAll(
        "select[wized-filter-range-from], select[wized-filter-range-to]"
      )
      .forEach((select) => {
        select.querySelectorAll("option").forEach((option) => {
          option.disabled = false;
        });
      });
  };

  const resetParentWrapperVisibility = () => {
    const parentWrappers = document.querySelectorAll(
      '[wized-filter-element="parent-wrapper"]'
    );
    parentWrappers.forEach((parentWrapper) => {
      const hiddenClass = parentWrapper.getAttribute("wized-hidden-class");
      if (hiddenClass && parentWrapper.classList.contains(hiddenClass)) {
        parentWrapper.classList.remove(hiddenClass);
      }
    });
  };

  const findTagCategory = (variableName) => {
    const filterElement = document.querySelector(
      `[wized-variable="${variableName}"]`
    );
    return filterElement
      ? filterElement.getAttribute("wized-filter-tag-category")
      : null;
  };

  const removeCategoryTags = (category) => {
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    const tagsToRemove = [
      ...tagsWrapper.querySelectorAll('[wized-filter-tag="tag-template"]'),
    ].filter((tag) =>
      tag
        .querySelector('[wized-filter-tag="tag-text"]')
        .textContent.startsWith(`${category}:`)
    );
    tagsToRemove.forEach((tag) => tag.remove());
  };

  const resetIndividualFilter = (variableName) => {
    variableName.split(",").forEach((name) => {
      const trimmedName = name.trim();
      Wized.data.v[trimmedName] = Array.isArray(Wized.data.v[trimmedName])
        ? []
        : null;
      document
        .querySelectorAll(
          `[wized-variable="${trimmedName}"] input[type="checkbox"], [wized-variable="${trimmedName}"] input[type="radio"]`
        )
        .forEach((input) => {
          input.checked = false;
          const customInput = input.previousElementSibling;
          if (
            customInput &&
            customInput.classList.contains("w--redirected-checked")
          ) {
            customInput.classList.remove("w--redirected-checked");
          }
        });
      const select = document.querySelector(
        `select[wized-variable="${trimmedName}"]`
      );
      if (select) {
        select.selectedIndex = 0;
      }
      const searchInput = document.querySelector(
        `input[wized-filter-search*="${trimmedName}"]`
      );
      if (searchInput) {
        searchInput.value = "";
      }
      const tagCategory = findTagCategory(trimmedName);
      if (tagCategory) {
        removeCategoryTags(tagCategory);
      }
    });
    enableRangeSelectOptions();
    resetParentWrapperVisibility();
    debouncedResetPageAndExecuteWizedRequest();
  };

  const clearAllFilters = () => {
    document.querySelectorAll("[wized-filter-clear]").forEach((clearButton) => {
      const variableNames = clearButton.getAttribute("wized-filter-clear");
      if (variableNames !== "clear-all") {
        resetIndividualFilter(variableNames);
      }
    });
    enableRangeSelectOptions();
    resetParentWrapperVisibility();
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    if (tagsWrapper) {
      tagsWrapper.innerHTML = "";
    }
    debouncedResetPageAndExecuteWizedRequest();
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const resetPageAndExecuteWizedRequest = () => {
    resetInfiniteLoadingContent();
    const filtersElement = document.querySelector(
      '[wized-filter-element="filters"]'
    );
    const currentPageVariableName = filtersElement?.getAttribute(
      "wized-filter-current-page"
    );
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
    }
    if (window.executeWizedRequest) {
      window.executeWizedRequest();
    } else {
      console.error("Global executeWizedRequest function not found.");
    }
  };

  const debouncedResetPageAndExecuteWizedRequest = debounce(
    resetPageAndExecuteWizedRequest,
    1000
  );

  function resetInfiniteLoadingContent() {
    // Assuming 'variableName' holds the content for infinite loading
    const variableName = document
      .querySelector("[wized-load-more-variable]")
      ?.getAttribute("wized-load-more-variable");
    if (variableName && Wized.data.v.hasOwnProperty(variableName)) {
      Wized.data.v[variableName] = []; // Reset the content to an empty array
    }
  }

  document.querySelectorAll("[wized-filter-clear]").forEach((clearButton) => {
    clearButton.addEventListener("click", (e) => {
      e.preventDefault();
      const variableNames = clearButton.getAttribute("wized-filter-clear");
      if (variableNames === "clear-all") {
        clearAllFilters();
      } else {
        resetIndividualFilter(variableNames);
      }
    });
  });

  const attachListeners = () => {
    // Existing code to attach listeners for checkboxes, radios, selects, and search inputs
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        attachListeners();
      }
    });
  });

  observer.observe(document.querySelector('[wized-filter-element="filters"]'), {
    childList: true,
    subtree: true,
  });

  attachListeners();
  enableRangeSelectOptions();
});

window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Function to create and append a new tag template
  const createTagTemplate = (category, value) => {
    const tagTemplate = document.createElement("div");
    tagTemplate.setAttribute("wized-filter-tag", "tag-template");
    tagTemplate.className =
      tagTemplate.getAttribute("wized-filter-tag-class") || "filter_tag";

    const tagText = document.createElement("div");
    tagText.setAttribute("wized-filter-tag", "tag-text");
    tagText.className =
      tagText.getAttribute("wized-filter-tag-class") || "filter_tag-text";
    tagText.textContent = `${category}: ${value}`;

    const removeIcon = document.createElement("div");
    removeIcon.setAttribute("wized-filter-tag", "tag-remove");
    removeIcon.className =
      removeIcon.getAttribute("wized-filter-tag-class") || "filter_tag-remove";

    tagTemplate.appendChild(tagText);
    tagTemplate.appendChild(removeIcon);

    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    if (tagsWrapper) {
      tagsWrapper.appendChild(tagTemplate);
    }
  };

  // Function to handle changes on input elements (checkbox, radio) and select elements
  const handleInputAndSelectChange = (event) => {
    const element = event.target;
    const categoryElement = element.closest("[wized-filter-tag-category]");
    if (categoryElement) {
      const category = categoryElement.getAttribute(
        "wized-filter-tag-category"
      );
      if (element.type === "checkbox") {
        handleCheckboxChange(element, category);
      } else if (element.type === "radio") {
        handleRadioChange(element, category);
      } else if (element.tagName.toLowerCase() === "select") {
        handleSelectChange(element, category);
      }
    }
  };

  const handleCheckboxChange = (checkbox, category) => {
    const label = checkbox.nextElementSibling;
    if (checkbox.checked) {
      createTagTemplate(category, label.textContent.trim());
    } else {
      removeTag(category, label.textContent.trim());
    }
  };

  const handleRadioChange = (radio, category) => {
    removeCategoryTags(category);
    if (radio.checked) {
      createTagTemplate(category, radio.nextElementSibling.textContent.trim());
    }
  };

  const handleSelectChange = (select, category) => {
    removeCategoryTags(category);
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
      createTagTemplate(category, selectedOption.text.trim());
    }
  };

  // Function to remove all tags of a specific category
  const removeCategoryTags = (category) => {
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    const tagsToRemove = [
      ...tagsWrapper.querySelectorAll('[wized-filter-tag="tag-template"]'),
    ].filter((tag) =>
      tag
        .querySelector('[wized-filter-tag="tag-text"]')
        .textContent.startsWith(`${category}:`)
    );
    tagsToRemove.forEach((tag) => tag.remove());
  };

  // Revised Function to reset the corresponding input element
  const resetInputElement = (category, value) => {
    const categoryElements = document.querySelectorAll(
      `[wized-filter-tag-category="${category}"]`
    );
    categoryElements.forEach((categoryElement) => {
      if (categoryElement.querySelector('input[type="checkbox"]')) {
        const checkbox = Array.from(
          categoryElement.querySelectorAll('input[type="checkbox"]')
        ).find((cb) => cb.nextElementSibling.textContent.trim() === value);
        if (checkbox) {
          // Manually update the checkbox state
          checkbox.checked = false; // Uncheck the checkbox
          // Manually trigger a 'change' event
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          checkbox.dispatchEvent(event); // Dispatch the event
        }
      } else if (categoryElement.querySelector('input[type="radio"]')) {
        const radioGroup = categoryElement.querySelector(
          'input[type="radio"]'
        ).name;
        resetRadioGroup(radioGroup, category);
      } else if (categoryElement.tagName.toLowerCase() === "select") {
        categoryElement.selectedIndex = 0;
        categoryElement.dispatchEvent(new Event("change"));
      }
    });
  };

  // Revised Function to reset a radio group
  const resetRadioGroup = (radioGroupName, category) => {
    const radios = document.querySelectorAll(
      `input[type="radio"][name="${radioGroupName}"]`
    );
    radios.forEach((radio) => {
      if (radio.checked) {
        radio.checked = false;

        // Find and reset the custom radio button control
        const customRadio = radio
          .closest(`[wized-filter-tag-category="${category}"]`)
          .querySelector(".w-radio-input");
        if (
          customRadio &&
          customRadio.classList.contains("w--redirected-checked")
        ) {
          customRadio.classList.remove("w--redirected-checked");
        }

        // Update the Wized variable for this radio group
        const variableName = radio.getAttribute("wized-variable");
        if (variableName) {
          Wized.data.v[variableName] = null;
          if (window.executeWizedRequestDebounced) {
            window.executeWizedRequestDebounced();
          }
        }
      }
    });
  };

  // Function to remove a specific tag
  const removeTag = (category, value) => {
    const tagText = `${category}: ${value}`;
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    const tagToRemove = [
      ...tagsWrapper.querySelectorAll('[wized-filter-tag="tag-template"]'),
    ].find(
      (tag) =>
        tag.querySelector('[wized-filter-tag="tag-text"]').textContent ===
        tagText
    );
    if (tagToRemove) {
      tagToRemove.remove();
    }
  };

  // Function to handle click on tag-remove element
  const handleTagRemoveClick = (event) => {
    const removeIcon = event.target.closest('[wized-filter-tag="tag-remove"]');
    if (removeIcon) {
      const tagTemplate = removeIcon.closest(
        '[wized-filter-tag="tag-template"]'
      );
      const tagText = tagTemplate
        .querySelector('[wized-filter-tag="tag-text"]')
        .textContent.trim();
      const [category, value] = tagText.split(":").map((s) => s.trim());

      // Reset the corresponding Wized variable
      updateWizedVariableOnTagRemoval(category, value);

      // Reset input element and remove the tag
      resetInputElement(category, value);
      tagTemplate.remove();

      // Reset current page to 1 and call the centralized function to execute Wized request
      resetCurrentPageToFirst();
      window.executeWizedRequest();
    }
  };

  // Function to reset current page variable to 1
  const resetCurrentPageToFirst = () => {
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

  // Function to update the Wized variable when a tag is removed
  const updateWizedVariableOnTagRemoval = (category, value) => {
    const variableElement = document.querySelector(
      `[wized-filter-tag-category="${category}"][wized-variable]`
    );
    if (variableElement) {
      const variableName = variableElement.getAttribute("wized-variable");
      const currentValue = Wized.data.v[variableName];

      // Update or clear the variable based on its type (array, string, etc.)
      if (Array.isArray(currentValue)) {
        Wized.data.v[variableName] = currentValue.filter(
          (item) => item !== value
        );
      } else {
        Wized.data.v[variableName] = null; // or any default value you prefer
      }

      // Trigger any necessary updates
      if (window.executeWizedRequestDebounced) {
        window.executeWizedRequestDebounced();
      }
    }
  };

  // Attach event listeners to input elements and select elements
  document.addEventListener("change", handleInputAndSelectChange);
  document.addEventListener("click", handleTagRemoveClick);
});

window.Wized = window.Wized || [];
window.Wized.push(() => {
  const listElement = document.querySelector('[wized-filter-element="list"]');
  const emptyStateElement = document.querySelector(
    '[wized-filter-element="empty-state"]'
  );
  const hiddenClass = emptyStateElement.getAttribute("wized-hidden-class");

  const updateEmptyStateVisibility = () => {
    if (listElement.children.length === 0) {
      emptyStateElement.classList.remove(hiddenClass);
    } else {
      emptyStateElement.classList.add(hiddenClass);
    }
  };

  const observer = new MutationObserver(updateEmptyStateVisibility);

  observer.observe(listElement, {
    childList: true, // observe direct children addition or removal
  });

  // Initial check in case the list is already empty when the script runs
  updateEmptyStateVisibility();
});
