window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Function to enable all options in range selects
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

  // Function to reset visibility of parent wrappers
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

  // Function to find the corresponding category for a given variable name
  const findTagCategory = (variableName) => {
    const filterElement = document.querySelector(
      `[wized-variable="${variableName}"]`
    );
    return filterElement
      ? filterElement.getAttribute("wized-filter-tag-category")
      : null;
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

  // Function to reset an individual filter
  const resetIndividualFilter = (variableName) => {
    variableName.split(",").forEach((name) => {
      const trimmedName = name.trim();
      // Reset the data store variable
      Wized.data.v[trimmedName] = Array.isArray(Wized.data.v[trimmedName])
        ? []
        : null;

      // Handle checkboxes and radio buttons
      document
        .querySelectorAll(
          `[wized-variable="${trimmedName}"] input[type="checkbox"], [wized-variable="${trimmedName}"] input[type="radio"]`
        )
        .forEach((input) => {
          input.checked = false;
          // Remove Webflow's visual checked class if present
          const customInput = input.previousElementSibling;
          if (
            customInput &&
            customInput.classList.contains("w--redirected-checked")
          ) {
            customInput.classList.remove("w--redirected-checked");
          }
        });

      // Reset select elements
      const select = document.querySelector(
        `select[wized-variable="${trimmedName}"]`
      );
      if (select) {
        select.selectedIndex = 0;
      }

      // Clear search input fields
      const searchInput = document.querySelector(
        `input[wized-filter-search*="${trimmedName}"]`
      );
      if (searchInput) {
        searchInput.value = "";
      }

      // Remove associated tag(s)
      const tagCategory = findTagCategory(trimmedName);
      if (tagCategory) {
        removeCategoryTags(tagCategory);
      }
    });

    // Re-enable all options in the range selects and reset visibility
    enableRangeSelectOptions();
    resetParentWrapperVisibility();

    // Reset the current page to 1 and execute the Wized request
    resetPageAndExecuteWizedRequest();
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    document.querySelectorAll("[wized-filter-clear]").forEach((clearButton) => {
      const variableNames = clearButton.getAttribute("wized-filter-clear");
      if (variableNames !== "clear-all") {
        resetIndividualFilter(variableNames);
      }
    });

    // Re-enable all options in the range selects and reset visibility
    enableRangeSelectOptions();
    resetParentWrapperVisibility();

    // Remove all tags
    const tagsWrapper = document.querySelector('[wized-filter-tag="wrapper"]');
    if (tagsWrapper) {
      tagsWrapper.innerHTML = "";
    }

    // Reset the current page to 1 and execute the Wized request
    resetPageAndExecuteWizedRequest();
  };

  // Function to reset the current page to 1 and execute the Wized request
  const resetPageAndExecuteWizedRequest = () => {
    // Reset content for infinite loading
    resetInfiniteLoadingContent();

    // Retrieve the current page variable name from the filters element
    const filtersElement = document.querySelector(
      '[wized-filter-element="filters"]'
    );
    const currentPageVariableName = filtersElement?.getAttribute(
      "wized-filter-current-page"
    );

    // Reset current page to 1 when filters are applied
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
      console.log(
        `Current page reset to 1 for variable ${currentPageVariableName}`
      );
    }

    // Execute Wized request
    executeWizedRequest();
  };

  // Function to execute the Wized request
  const executeWizedRequest = () => {
    const filtersElement = document.querySelector(
      '[wized-filter-element="filters"]'
    );
    if (filtersElement && filtersElement.hasAttribute("wized-filter-request")) {
      const requestName = filtersElement.getAttribute("wized-filter-request");

      if (
        requestName &&
        Wized.requests &&
        typeof Wized.requests.execute === "function"
      ) {
        Wized.requests
          .execute(requestName)
          .then(() => {
            console.log(`Wized request ${requestName} executed successfully.`);
          })
          .catch((error) => {
            console.error(
              `Error executing Wized request ${requestName}:`,
              error
            );
          });
      }
    } else if (window.executeWizedRequestDebounced) {
      window.executeWizedRequestDebounced();
    }
  };

  // Function to reset content related to infinite loading
  function resetInfiniteLoadingContent() {
    // Assuming 'variableName' holds the content for infinite loading
    const variableName = document
      .querySelector("[wized-load-more-variable]")
      ?.getAttribute("wized-load-more-variable");
    console.log("Variable Name for content reset:", variableName);
    if (variableName && Wized.data.v.hasOwnProperty(variableName)) {
      Wized.data.v[variableName] = []; // Reset the content to an empty array
      console.log("Content reset for infinite loading");
    } else {
      console.log("Variable for content reset not found or not in Wized data");
    }
  }

  // Event listener for individual clear buttons
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

  // Attach event listeners on document load and mutation
  const attachListeners = () => {
    // Existing code to attach listeners for checkboxes, radios, selects, and search inputs
  };

  // Existing mutation observer code
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

  // Call to attach listeners and to enable range select options on initial load
  attachListeners();
  enableRangeSelectOptions();
});
