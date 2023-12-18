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
    if (isLoading) {
      console.log("Loading already in progress");
      return;
    }
    isLoading = true;

    if (Wized.data.v[nextPageVariable] === null) {
      console.log("No more pages to load");
      isLoading = false; // Ensure to reset isLoading
      return;
    }

    console.log(`Executing ${requestName} request`);
    try {
      const result = await Wized.requests.execute(requestName);
      if (result && result.data && result.data.items) {
        console.log("Data received:", result.data.items.length, "items");
        Wized.data.v[variableName].push(...result.data.items);
        console.log(`Updated ${variableName} with new items`);
      } else {
        console.log("No data received or invalid result format");
        // Potentially update nextPageVariable if no more data is available
      }
    } catch (error) {
      console.error("Error executing request:", error);
    } finally {
      isLoading = false;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreItems();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(loadMoreWrapper);
});
