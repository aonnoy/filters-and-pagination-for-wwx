window.Wized = window.Wized || [];
window.Wized.push(async (Wized) => {
  if (!Wized || !Wized.data || !Wized.data.v) {
    console.error(
      "Wized is not fully loaded or the data store is not accessible."
    );
    return;
  }

  const wrapperElement = document.querySelector(
    '[wized-pagination-element="wrapper"]'
  );
  const totalPagesVariableName = wrapperElement.getAttribute(
    "wized-pagination-total-pages"
  );
  const currentPageVariableName = wrapperElement.getAttribute(
    "wized-pagination-current-page"
  );
  const wizedRequestName = wrapperElement.getAttribute(
    "wized-pagination-request"
  );
  let lastKnownTotalPages = 0;
  let lastKnownCurrentPage = Wized.data.v[currentPageVariableName] || 1;

  // Function to reset the current page to 1 and execute the Wized request
  const resetCurrentPageAndExecuteWizedRequest = () => {
    const currentPageVariableName = document
      .querySelector('[wized-filter-element="filters"]')
      ?.getAttribute("wized-filter-current-page");

    if (
      currentPageVariableName &&
      Wized.data.v.hasOwnProperty(currentPageVariableName)
    ) {
      Wized.data.v[currentPageVariableName] = 1;
      executeWizedRequest();
      updatePagination(1, Wized.data.v[totalPagesVariableName]);
    }
  };

  // Listening for filter changes to reset the current page
  document.addEventListener(
    "wizedFilterChange",
    resetCurrentPageAndExecuteWizedRequest
  );

  const waitForTotalPagesValue = async () => {
    let value = Wized.data.v[totalPagesVariableName];
    while (value === undefined || value === null) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      value = Wized.data.v[totalPagesVariableName];
    }
    return value;
  };

  const createPageNumber = (i, currentPage) => {
    let activeClass = i === currentPage ? "active" : "";
    return `<a wized-pagination-active-class="active" wized-pagination-element="number" href="#" class="link-block w-inline-block ${activeClass}"><div>${i}</div></a>`;
  };

  const createDots = () => {
    return `<div class="link-block w-inline-block dots"><div>...</div></div>`;
  };

  const updatePagination = (page, totalPages) => {
    let currentPage = page;
    if (Wized.data.v[currentPageVariableName] !== currentPage) {
      Wized.data.v[currentPageVariableName] = currentPage;
      executeWizedRequest();
    }

    let paginationContent = "";

    // Previous button logic
    if (totalPages > 1 && currentPage > 1) {
      paginationContent += `<a wized-pagination-element="previous" href="#" class="w-button">Previous</a>`;
    }

    // Page number logic with non-clickable "..."
    if (totalPages > 5) {
      let startPage, endPage;
      const isMiddle = currentPage > 3 && currentPage < totalPages - 2;
      const middlePagesToShow = 3;

      if (isMiddle) {
        // Three pages in the middle
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      } else if (currentPage <= 3) {
        // At the start
        startPage = 1;
        endPage = 4;
      } else {
        // At the end
        startPage = totalPages - 3;
        endPage = totalPages;
      }

      if (startPage > 1) {
        paginationContent += createPageNumber(1, currentPage);
        paginationContent += createDots();
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationContent += createPageNumber(i, currentPage);
      }

      if (endPage < totalPages) {
        paginationContent += createDots();
        paginationContent += createPageNumber(totalPages, currentPage);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        paginationContent += createPageNumber(i, currentPage);
      }
    }

    // Next button logic
    if (totalPages > 1 && currentPage < totalPages) {
      paginationContent += `<a wized-pagination-element="next" href="#" class="w-button">Next</a>`;
    }

    wrapperElement.innerHTML = paginationContent;
    attachEventListeners(totalPages);
  };

  const attachEventListeners = (totalPages) => {
    const prevButton = wrapperElement.querySelector(
      '[wized-pagination-element="previous"]'
    );
    const nextButton = wrapperElement.querySelector(
      '[wized-pagination-element="next"]'
    );
    const numberButtons = wrapperElement.querySelectorAll(
      '[wized-pagination-element="number"]'
    );

    if (prevButton) {
      prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (Wized.data.v[currentPageVariableName] > 1) {
          isInternalUpdate = true;
          updatePagination(
            Wized.data.v[currentPageVariableName] - 1,
            totalPages
          );
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (Wized.data.v[currentPageVariableName] < totalPages) {
          isInternalUpdate = true;
          updatePagination(
            Wized.data.v[currentPageVariableName] + 1,
            totalPages
          );
        }
      });
    }

    numberButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const pageNum = parseInt(button.querySelector("div").textContent);
        if (pageNum && pageNum !== Wized.data.v[currentPageVariableName]) {
          isInternalUpdate = true;
          updatePagination(pageNum, totalPages);
        }
      });
    });
  };

  const executeWizedRequest = async () => {
    if (
      wizedRequestName &&
      Wized.requests &&
      typeof Wized.requests.execute === "function"
    ) {
      try {
        await Wized.requests.execute(wizedRequestName);
      } catch (error) {
        console.error("Error executing Wized request:", error);
      }
    }
  };

  const checkForPageChange = async () => {
    while (true) {
      const currentTotalPages = Wized.data.v[totalPagesVariableName];
      const currentPage = Wized.data.v[currentPageVariableName];
      if (
        currentTotalPages !== lastKnownTotalPages ||
        currentPage !== lastKnownCurrentPage
      ) {
        lastKnownTotalPages = currentTotalPages;
        lastKnownCurrentPage = currentPage;
        updatePagination(currentPage, currentTotalPages);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const setupPagination = async () => {
    lastKnownTotalPages = await waitForTotalPagesValue();
    lastKnownCurrentPage = Wized.data.v[currentPageVariableName] || 1;
    updatePagination(lastKnownCurrentPage, lastKnownTotalPages);
  };

  await setupPagination();
  checkForPageChange();
});
