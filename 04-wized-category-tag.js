window.Wized = window.Wized || [];
window.Wized.push((Wized) => {
  // Function to create and append a new tag template
  const createTagTemplate = (category, value) => {
    const tagTemplate = document.createElement("div");
    tagTemplate.setAttribute("wized-filter-tag", "tag-template");
    tagTemplate.classList.add("filter_tag");

    const tagText = document.createElement("div");
    tagText.setAttribute("wized-filter-tag", "tag-text");
    tagText.classList.add("filter_tag-text");
    tagText.textContent = `${category}: ${value}`;

    const removeIcon = document.createElement("div");
    removeIcon.setAttribute("wized-filter-tag", "tag-remove");
    removeIcon.classList.add("filter_tag-remove");

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
