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
