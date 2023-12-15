window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Function to disable invalid options based on the other select's value
  const updateSelectOptions = (fromSelect, toSelect) => {
    const fromValue = parseInt(fromSelect.value, 10) || -Infinity;
    const toValue = parseInt(toSelect.value, 10) || Infinity;

    // Disable options in "from" select that are greater than "to" value
    fromSelect.querySelectorAll("option").forEach((option) => {
      const optionValue = parseInt(option.value, 10);
      option.disabled = !isNaN(optionValue) && optionValue > toValue;
    });

    // Disable options in "to" select that are less than or equal to "from" value
    toSelect.querySelectorAll("option").forEach((option) => {
      const optionValue = parseInt(option.value, 10);
      option.disabled = !isNaN(optionValue) && optionValue <= fromValue;
    });
  };

  // Function to initialize select pairs and attach event listeners
  const initializeSelectPairs = () => {
    document
      .querySelectorAll("select[wized-filter-range-from]")
      .forEach((fromSelect) => {
        const rangeIdentifier = fromSelect.getAttribute(
          "wized-filter-range-from"
        );
        const toSelect = document.querySelector(
          `select[wized-filter-range-to="${rangeIdentifier}"]`
        );

        if (toSelect) {
          updateSelectOptions(fromSelect, toSelect);

          // Attach event listener to both selects
          fromSelect.addEventListener("change", () =>
            updateSelectOptions(fromSelect, toSelect)
          );
          toSelect.addEventListener("change", () =>
            updateSelectOptions(fromSelect, toSelect)
          );
        }
      });
  };

  // Mutation observer to handle dynamic content loading
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        // Re-initialize select pairs when new content is added to the DOM
        initializeSelectPairs();
      }
    });
  });

  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial call to set up the selects after DOM content is loaded
  initializeSelectPairs();
});
