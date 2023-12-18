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
