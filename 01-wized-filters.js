window.Wized=window.Wized||[],window.Wized.push(e=>{let t,r=(e,r)=>(...i)=>{clearTimeout(t),t=setTimeout(()=>e.apply(this,i),r)},i=(t,r)=>{e.data.v[t]=r},l=async()=>{let t=document.querySelector('[wized-filter-element="filters"]');if(t&&t.hasAttribute("wized-filter-request")){let r=t.getAttribute("wized-filter-request");try{await e.requests.execute(r),console.log(`Request ${r} executed successfully`)}catch(i){console.error(`Error executing request ${r}:`,i)}}},a=r(l,500),d=()=>{let t=document.querySelector('[wized-filter-element="filters"]')?.getAttribute("wized-filter-current-page");t&&e.data.v.hasOwnProperty(t)&&(e.data.v[t]=1),a()},c=()=>{let e=document.querySelector('[wized-filter-element="filters"]');e&&e.hasAttribute("wized-filter-request")&&document.dispatchEvent(new Event("wizedFilterChange")),d()},s=e=>{let t=e.closest("[wized-variable]").getAttribute("wized-variable"),r=document.querySelectorAll(`[wized-variable="${t}"] input[type="checkbox"]`),l=Array.from(r).filter(e=>e.checked).map(e=>e.nextElementSibling.textContent.trim());i(t,l),c()},n=e=>{let t=e.closest("[wized-variable]").getAttribute("wized-variable"),r=e.checked?e.nextElementSibling.textContent.trim():"";i(t,r),c()},u=e=>{let t=e.getAttribute("wized-variable"),r=e.value;i(t,r),c()},o=e=>{let t=e.getAttribute("wized-filter-search").split(","),r=e.value.toLowerCase();t.forEach(e=>{let t=document.querySelectorAll(`[wized="${e}"]`);t.forEach(e=>{let t=e.closest('[wized-filter-element="parent-wrapper"]'),i=t.getAttribute("wized-hidden-class"),l=e.textContent.toLowerCase().trim(),a=l.includes(r);t.classList.toggle(i,!a)})}),i(e.getAttribute("wized-filter-search"),r),d()},w=()=>{document.querySelectorAll('[wized-variable] input[type="checkbox"]').forEach(e=>{e.addEventListener("change",()=>s(e))}),document.querySelectorAll('[wized-variable] input[type="radio"]').forEach(e=>{e.addEventListener("change",()=>n(e))}),document.querySelectorAll("select[wized-variable]").forEach(e=>{e.addEventListener("change",()=>u(e))}),document.querySelectorAll("input[wized-filter-search]").forEach(e=>{e.addEventListener("input",()=>o(e))})},h=new MutationObserver(e=>{e.forEach(e=>{"childList"===e.type&&e.addedNodes.length>0&&w()})});h.observe(document.querySelector('[wized-filter-element="filters"]'),{childList:!0,subtree:!0}),w()});
