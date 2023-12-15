window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  let debounceTimer;

  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const updateWizedVariable = (variableName, value) => {
    Wized.data.v[variableName] = value;
  };

  const executeWizedRequest = async () => {
    const filtersElement = document.querySelector(
      '[wized-filter-element="filters"]'
    );
    if (filtersElement && filtersElement.hasAttribute("wized-filter-request")) {
      const requestName = filtersElement.getAttribute("wized-filter-request");
      try {
        await Wized.requests.execute(requestName);
        console.log(`Request ${requestName} executed successfully`);
      } catch (error) {
        console.error(`Error executing request ${requestName}:`, error);
      }
    }
  };

  const debouncedExecuteWizedRequest = debounce(executeWizedRequest, 500);

  const resetCurrentPageAndExecuteWizedRequest = () => {
    const currentPageVariableName = document
      .querySelector('[wized-filter-element="filters"]')
      ?.getAttribute("wized-filter-current-page");
    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
    }
    debouncedExecuteWizedRequest();
  };

  const applyFiltersAndUpdatePage = () => {
    // Check if 'wized-filter-request' attribute is present
    const filtersElement = document.querySelector(
      '[wized-filter-element="filters"]'
    );
    if (filtersElement && filtersElement.hasAttribute("wized-filter-request")) {
      // Dispatch a custom event to indicate filters have changed
      document.dispatchEvent(new Event("wizedFilterChange"));
    }
    resetCurrentPageAndExecuteWizedRequest();
  };

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
  };

  const handleSelectChange = (select) => {
    const variableName = select.getAttribute("wized-variable");
    const value = select.value;
    updateWizedVariable(variableName, value);
    applyFiltersAndUpdatePage();
  };

  const handleSearchInput = (input) => {
    const targetVariables = input
      .getAttribute("wized-filter-search")
      .split(",");
    const searchValue = input.value.toLowerCase();
    targetVariables.forEach((target) => {
      const elements = document.querySelectorAll(`[wized="${target}"]`);
      elements.forEach((element) => {
        const parentWrapper = element.closest(
          '[wized-filter-element="parent-wrapper"]'
        );
        const hiddenClass = parentWrapper.getAttribute("wized-hidden-class");
        const elementText = element.textContent.toLowerCase().trim();
        const isVisible = elementText.includes(searchValue);
        parentWrapper.classList.toggle(hiddenClass, !isVisible);
      });
    });
    updateWizedVariable(input.getAttribute("wized-filter-search"), searchValue);
    resetCurrentPageAndExecuteWizedRequest();
  };

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

    document.querySelectorAll("input[wized-filter-search]").forEach((input) => {
      input.addEventListener("input", () => handleSearchInput(input));
    });
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
});
