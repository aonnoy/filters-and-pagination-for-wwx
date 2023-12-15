window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  console.log("Script initialized");

  let isLoading = false;
  const loadMoreWrapper = document.querySelector(
    '[wized-load-more-element="wrapper"]'
  );
  if (!loadMoreWrapper) {
    console.error("Load more wrapper not found");
    return;
  }

  // Retrieve the dynamic variable names from the HTML attributes
  const requestName = loadMoreWrapper.getAttribute("wized-load-more-request");
  const variableName = loadMoreWrapper.getAttribute("wized-load-more-variable");
  const nextPageVariable = loadMoreWrapper.getAttribute(
    "wized-load-more-next-page"
  );

  if (!requestName || !variableName || !nextPageVariable) {
    console.error("Required attributes not found on the element");
    return;
  }

  async function loadMoreItems() {
    console.log("Attempting to load more items");

    // Use the dynamically retrieved variable names to access Wized data
    if (Wized.data.v[nextPageVariable] === null) {
      console.log("No more pages to load");
      return;
    }

    if (
      !Wized.data.v[variableName] ||
      Wized.data.v[variableName].length === 0
    ) {
      console.log("Initial load not completed");
      return;
    }

    if (isLoading) {
      console.log("Loading already in progress");
      return;
    }

    isLoading = true;
    console.log(`Executing ${requestName} request`);

    try {
      const result = await Wized.requests.execute(requestName);
      if (result && result.data && result.data.items) {
        console.log("Data received:", result.data.items.length, "items");
        // Use the dynamically retrieved variable name to update Wized data
        Wized.data.v[variableName].push(...result.data.items);
        console.log(`Updated ${variableName} with new items`);
      } else {
        console.log("No data received or invalid result format");
      }
    } catch (error) {
      console.error("Error executing request:", error);
    }

    isLoading = false;
    observer.unobserve(loadMoreWrapper);
    observer.observe(loadMoreWrapper);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreItems();
        }
      });
    },
    {
      threshold: 0.5, // Adjust as necessary
    }
  );

  observer.observe(loadMoreWrapper);
});
