(window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    let t,
      r = i();
    function i() {
      const t = {};
      return (
        document.querySelectorAll("[wized-variable]").forEach((r) => {
          const i = r.getAttribute("wized-variable");
          t[i] = e.data.v[i];
        }),
        t
      );
    }
    function l() {
      const e = i();
      return JSON.stringify(e) !== JSON.stringify(r);
    }
    window.executeWizedRequest = async () => {
      if (l()) {
        const t = document.querySelector('[wized-filter-element="filters"]');
        if (t && t.hasAttribute("wized-filter-request")) {
          const l = t.getAttribute("wized-filter-request");
          try {
            await e.requests.execute(l), (r = i());
          } catch (e) {}
        }
      }
    };
    const c = (t, r) => {
        e.data.v[t] = r;
      },
      a = (
        (e, r) =>
        (...i) => {
          clearTimeout(t), (t = setTimeout(() => e.apply(this, i), r));
        }
      )(() => {
        l() &&
          ((() => {
            const t = document
              .querySelector('[wized-filter-element="filters"]')
              ?.getAttribute("wized-filter-current-page");
            t &&
              e.data.v.hasOwnProperty(t) &&
              ((e.data.v[t] = 1), window.executeWizedRequest());
          })(),
          (r = i()));
      }, 500),
      o = async () => {
        const t = document.querySelector("[wized-filter-request-trigger]");
        if (t) {
          const r = t.getAttribute("wized-filter-request-trigger");
          if (r) {
            n();
            try {
              await e.requests.execute(r);
            } catch (e) {}
          }
        }
      },
      n = () => {
        const t = document
          .querySelector('[wized-filter-element="filters"]')
          ?.getAttribute("wized-filter-current-page");
        t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = 1);
      },
      d = (e) => {
        "Enter" === e.key && e.preventDefault();
      },
      u = (e) => {
        e.preventDefault();
      },
      s = () => {
        document
          .querySelectorAll('[wized-variable] input[type="checkbox"]')
          .forEach((e) => {
            e.addEventListener("change", () =>
              ((e) => {
                const t = e
                    .closest("[wized-variable]")
                    .getAttribute("wized-variable"),
                  r = document.querySelectorAll(
                    `[wized-variable="${t}"] input[type="checkbox"]`
                  ),
                  i = Array.from(r)
                    .filter((e) => e.checked)
                    .map((e) => e.nextElementSibling.textContent.trim());
                c(t, i), a(), window.updateFilterButtonVisibility();
              })(e)
            );
          }),
          document
            .querySelectorAll('[wized-variable] input[type="radio"]')
            .forEach((e) => {
              e.addEventListener("change", () =>
                ((e) => {
                  const t = e
                      .closest("[wized-variable]")
                      .getAttribute("wized-variable"),
                    r = e.checked
                      ? e.nextElementSibling.textContent.trim()
                      : "";
                  c(t, r), a(), window.updateFilterButtonVisibility();
                })(e)
              );
            }),
          document.querySelectorAll("select[wized-variable]").forEach((e) => {
            e.addEventListener("change", () =>
              ((e) => {
                const t = e.getAttribute("wized-variable"),
                  r = e.value;
                c(t, r), a(), window.updateFilterButtonVisibility();
              })(e)
            );
          }),
          document.querySelectorAll("form").forEach((e) => {
            e.addEventListener("submit", (e) => {
              e.preventDefault(), o();
            });
          });
        const e = document.querySelector("input[wized-filter-search-variable]");
        e && e.addEventListener("keypress", d);
        document
          .querySelectorAll(
            'form button, form a, form input[type="button"], form input[type="submit"]'
          )
          .forEach((e) => {
            e.addEventListener("click", u);
          });
      },
      w = () => {
        s(),
          (() => {
            const e = document.querySelector("[wized-filter-request-trigger]");
            e && e.addEventListener("click", o);
          })();
      };
    new MutationObserver((e) => {
      e.forEach((e) => {
        "childList" === e.type && e.addedNodes.length > 0 && w();
      });
    }).observe(document.querySelector('[wized-filter-element="filters"]'), {
      childList: !0,
      subtree: !0,
    }),
      w();
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    const t = () => {
        document
          .querySelectorAll(
            "select[wized-filter-range-from], select[wized-filter-range-to]"
          )
          .forEach((e) => {
            e.querySelectorAll("option").forEach((e) => {
              e.disabled = !1;
            });
          });
      },
      r = () => {
        document
          .querySelectorAll('[wized-filter-element="parent-wrapper"]')
          .forEach((e) => {
            const t = e.getAttribute("wized-hidden-class");
            t && e.classList.contains(t) && e.classList.remove(t);
          });
      },
      i = (i) => {
        i.split(",").forEach((t) => {
          const r = t.trim();
          (e.data.v[r] = Array.isArray(e.data.v[r]) ? [] : null),
            document
              .querySelectorAll(
                `[wized-variable="${r}"] input[type="checkbox"], [wized-variable="${r}"] input[type="radio"]`
              )
              .forEach((e) => {
                e.checked = !1;
                const t = e.previousElementSibling;
                t &&
                  t.classList.contains("w--redirected-checked") &&
                  t.classList.remove("w--redirected-checked");
              });
          const i = document.querySelector(`select[wized-variable="${r}"]`);
          i && (i.selectedIndex = 0);
          const l = document.querySelector(
            `input[wized-filter-search*="${r}"]`
          );
          l && (l.value = "");
          const c = ((e) => {
            const t = document.querySelector(`[wized-variable="${e}"]`);
            return t ? t.getAttribute("wized-filter-tag-category") : null;
          })(r);
          var a;
          c &&
            ((a = c),
            [
              ...document
                .querySelector('[wized-filter-tag="wrapper"]')
                .querySelectorAll('[wized-filter-tag="tag-template"]'),
            ]
              .filter((e) =>
                e
                  .querySelector('[wized-filter-tag="tag-text"]')
                  .textContent.startsWith(`${a}:`)
              )
              .forEach((e) => e.remove()));
        }),
          t(),
          r(),
          a(),
          window.updateFilterButtonVisibility();
      },
      l = () => {
        const t = document
          .querySelector('[wized-filter-element="filters"]')
          ?.getAttribute("wized-filter-current-page");
        t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = 1);
      },
      c = () => {
        const t = document.querySelectorAll("[wized-variable]");
        return Array.from(t).some((t) => {
          const r = t.getAttribute("wized-variable"),
            i = e.data.v[r];
          return (
            (Array.isArray(i) && i.length > 0) ||
            ("string" == typeof i && "" !== i.trim())
          );
        });
      },
      a = ((e, t) => {
        let r;
        return function (...i) {
          const l = this;
          clearTimeout(r), (r = setTimeout(() => e.apply(l, i), t));
        };
      })(() => {
        if (c()) {
          !(function t() {
            const t = document
              .querySelector("[wized-load-more-variable]")
              ?.getAttribute("wized-load-more-variable");
            t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = []);
          })();
          const t = document
            .querySelector('[wized-filter-element="filters"]')
            ?.getAttribute("wized-filter-current-page");
          t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = 1);
        }
        (async () => {
          const t = document.querySelector("[wized-filter-request-trigger]");
          if (t) {
            const r = t.getAttribute("wized-filter-request-trigger");
            if (r)
              try {
                await e.requests.execute(r);
              } catch (e) {}
          }
        })();
      }, 1e3);
    document.querySelectorAll("[wized-filter-clear]").forEach((e) => {
      e.addEventListener("click", (o) => {
        o.preventDefault();
        const n = e.getAttribute("wized-filter-clear");
        "clear-all" === n
          ? (() => {
              let e = c();
              document.querySelectorAll("[wized-filter-clear]").forEach((e) => {
                const t = e.getAttribute("wized-filter-clear");
                "clear-all" !== t && i(t);
              }),
                t(),
                r();
              const o = document.querySelector('[wized-filter-tag="wrapper"]');
              o && (o.innerHTML = ""),
                e && (l(), a(), window.updateFilterButtonVisibility());
            })()
          : i(n),
          a();
      });
    });
    new MutationObserver((e) => {
      e.forEach((e) => {
        "childList" === e.type && e.addedNodes.length;
      });
    }).observe(document.querySelector('[wized-filter-element="filters"]'), {
      childList: !0,
      subtree: !0,
    }),
      t();
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    const t = () => {
      document.querySelectorAll("[wized-filter-clear]").forEach((t) => {
        const r = t
          .getAttribute("wized-filter-clear")
          .split(",")
          .some((t) => e.data.v[t] && e.data.v[t].length > 0);
        t.style.display = r ? "block" : "none";
      });
      const t = document.querySelector("[wized-filter-clear='clear-all']"),
        r = document.querySelectorAll("[wized-variable]"),
        i = Array.from(r)
          .map((e) => e.getAttribute("wized-variable"))
          .some((t) => {
            const r = e.data.v[t];
            return Array.isArray(r) ? r.length > 0 : r;
          });
      t.style.display = i ? "block" : "none";
    };
    (window.updateFilterButtonVisibility = t), t();
  }),
  document.addEventListener("DOMContentLoaded", (e) => {
    window.updateFilterButtonVisibility();
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    let t;
    const r = (
      (e, r) =>
      (...i) => {
        clearTimeout(t), (t = setTimeout(() => e.apply(this, i), r));
      }
    )((t) => {
      const r = t.getAttribute("wized-filter-search-variable"),
        i = document
          .querySelector("[wized-filter-current-page]")
          .getAttribute("wized-filter-current-page"),
        l = document
          .querySelector("[wized-filter-search-request]")
          .getAttribute("wized-filter-search-request");
      (e.data.v[r] = t.value),
        i && e.data.v.hasOwnProperty(i) && (e.data.v[i] = 1),
        l &&
          (async (t) => {
            try {
              await e.requests.execute(t);
            } catch (e) {}
          })(l);
    }, 500);
    document
      .querySelectorAll("input[wized-filter-search-variable]")
      .forEach((e) => {
        e.removeEventListener("input", r),
          e.addEventListener("input", () => r(e));
      });
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    const t = () => {
        document
          .querySelectorAll(
            "select[wized-filter-range-from], select[wized-filter-range-to]"
          )
          .forEach((e) => {
            e.querySelectorAll("option").forEach((e) => {
              e.disabled = !1;
            });
          });
      },
      r = () => {
        document
          .querySelectorAll('[wized-filter-element="parent-wrapper"]')
          .forEach((e) => {
            const t = e.getAttribute("wized-hidden-class");
            t && e.classList.contains(t) && e.classList.remove(t);
          });
      },
      i = (i) => {
        i.split(",").forEach((t) => {
          const r = t.trim();
          (e.data.v[r] = Array.isArray(e.data.v[r]) ? [] : null),
            document
              .querySelectorAll(
                `[wized-variable="${r}"] input[type="checkbox"], [wized-variable="${r}"] input[type="radio"]`
              )
              .forEach((e) => {
                e.checked = !1;
                const t = e.previousElementSibling;
                t &&
                  t.classList.contains("w--redirected-checked") &&
                  t.classList.remove("w--redirected-checked");
              });
          const i = document.querySelector(`select[wized-variable="${r}"]`);
          i && (i.selectedIndex = 0);
          const l = document.querySelector(
            `input[wized-filter-search*="${r}"]`
          );
          l && (l.value = "");
          const c = ((e) => {
            const t = document.querySelector(`[wized-variable="${e}"]`);
            return t ? t.getAttribute("wized-filter-tag-category") : null;
          })(r);
          var a;
          c &&
            ((a = c),
            [
              ...document
                .querySelector('[wized-filter-tag="wrapper"]')
                .querySelectorAll('[wized-filter-tag="tag-template"]'),
            ]
              .filter((e) =>
                e
                  .querySelector('[wized-filter-tag="tag-text"]')
                  .textContent.startsWith(`${a}:`)
              )
              .forEach((e) => e.remove()));
        }),
          t(),
          r(),
          l();
      },
      l = ((e, t) => {
        let r;
        return function (...i) {
          const l = this;
          clearTimeout(r), (r = setTimeout(() => e.apply(l, i), t));
        };
      })(() => {
        !(function t() {
          const t = document
            .querySelector("[wized-load-more-variable]")
            ?.getAttribute("wized-load-more-variable");
          t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = []);
        })();
        const r = document.querySelector('[wized-filter-element="filters"]'),
          i = r?.getAttribute("wized-filter-current-page");
        i && e.data.v.hasOwnProperty(i) && (e.data.v[i] = 1),
          window.executeWizedRequest && window.executeWizedRequest();
      }, 1e3);
    document.querySelectorAll("[wized-filter-clear]").forEach((e) => {
      e.addEventListener("click", (c) => {
        c.preventDefault();
        const a = e.getAttribute("wized-filter-clear");
        "clear-all" === a
          ? (() => {
              document.querySelectorAll("[wized-filter-clear]").forEach((e) => {
                const t = e.getAttribute("wized-filter-clear");
                "clear-all" !== t && i(t);
              }),
                t(),
                r();
              const e = document.querySelector('[wized-filter-tag="wrapper"]');
              e && (e.innerHTML = ""), l();
            })()
          : i(a);
      });
    });
    new MutationObserver((e) => {
      e.forEach((e) => {
        "childList" === e.type && e.addedNodes.length;
      });
    }).observe(document.querySelector('[wized-filter-element="filters"]'), {
      childList: !0,
      subtree: !0,
    }),
      t();
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push((e) => {
    const t = (e, t) => {
        const r = document.createElement("div");
        r.setAttribute("wized-filter-tag", "tag-template"),
          (r.className =
            r.getAttribute("wized-filter-tag-class") || "filter_tag");
        const i = document.createElement("div");
        i.setAttribute("wized-filter-tag", "tag-text"),
          (i.className =
            i.getAttribute("wized-filter-tag-class") || "filter_tag-text"),
          (i.textContent = `${e}: ${t}`);
        const l = document.createElement("div");
        l.setAttribute("wized-filter-tag", "tag-remove"),
          (l.className =
            l.getAttribute("wized-filter-tag-class") || "filter_tag-remove"),
          r.appendChild(i),
          r.appendChild(l);
        const c = document.querySelector('[wized-filter-tag="wrapper"]');
        c && c.appendChild(r);
      },
      r = (e, r) => {
        const i = e.nextElementSibling;
        e.checked ? t(r, i.textContent.trim()) : o(r, i.textContent.trim());
      },
      i = (e, r) => {
        c(r), e.checked && t(r, e.nextElementSibling.textContent.trim());
      },
      l = (e, r) => {
        c(r);
        const i = e.options[e.selectedIndex];
        i && i.value && t(r, i.text.trim());
      },
      c = (e) => {
        [
          ...document
            .querySelector('[wized-filter-tag="wrapper"]')
            .querySelectorAll('[wized-filter-tag="tag-template"]'),
        ]
          .filter((t) =>
            t
              .querySelector('[wized-filter-tag="tag-text"]')
              .textContent.startsWith(`${e}:`)
          )
          .forEach((e) => e.remove());
      },
      a = (t, r) => {
        document
          .querySelectorAll(`input[type="radio"][name="${t}"]`)
          .forEach((t) => {
            if (t.checked) {
              t.checked = !1;
              const i = t
                .closest(`[wized-filter-tag-category="${r}"]`)
                .querySelector(".w-radio-input");
              i &&
                i.classList.contains("w--redirected-checked") &&
                i.classList.remove("w--redirected-checked");
              const l = t.getAttribute("wized-variable");
              l &&
                ((e.data.v[l] = null),
                window.executeWizedRequestDebounced &&
                  window.executeWizedRequestDebounced());
            }
          });
      },
      o = (e, t) => {
        const r = `${e}: ${t}`,
          i = [
            ...document
              .querySelector('[wized-filter-tag="wrapper"]')
              .querySelectorAll('[wized-filter-tag="tag-template"]'),
          ].find(
            (e) =>
              e.querySelector('[wized-filter-tag="tag-text"]').textContent === r
          );
        i && i.remove();
      },
      n = () => {
        const t = document
          .querySelector('[wized-filter-element="filters"]')
          ?.getAttribute("wized-filter-current-page");
        t && e.data.v.hasOwnProperty(t) && (e.data.v[t] = 1);
      },
      d = (t, r) => {
        const i = document.querySelector(
          `[wized-filter-tag-category="${t}"][wized-variable]`
        );
        if (i) {
          const t = i.getAttribute("wized-variable"),
            l = e.data.v[t];
          Array.isArray(l)
            ? (e.data.v[t] = l.filter((e) => e !== r))
            : (e.data.v[t] = null),
            window.executeWizedRequestDebounced &&
              window.executeWizedRequestDebounced();
        }
      };
    document.addEventListener("change", (e) => {
      const t = e.target,
        c = t.closest("[wized-filter-tag-category]");
      if (c) {
        const e = c.getAttribute("wized-filter-tag-category");
        "checkbox" === t.type
          ? r(t, e)
          : "radio" === t.type
          ? i(t, e)
          : "select" === t.tagName.toLowerCase() && l(t, e);
      }
    }),
      document.addEventListener("click", (e) => {
        const t = e.target.closest('[wized-filter-tag="tag-remove"]');
        if (t) {
          const e = t.closest('[wized-filter-tag="tag-template"]'),
            r = e
              .querySelector('[wized-filter-tag="tag-text"]')
              .textContent.trim(),
            [i, l] = r.split(":").map((e) => e.trim());
          d(i, l),
            ((e, t) => {
              document
                .querySelectorAll(`[wized-filter-tag-category="${e}"]`)
                .forEach((r) => {
                  if (r.querySelector('input[type="checkbox"]')) {
                    const e = Array.from(
                      r.querySelectorAll('input[type="checkbox"]')
                    ).find(
                      (e) => e.nextElementSibling.textContent.trim() === t
                    );
                    if (e) {
                      e.checked = !1;
                      const t = new Event("change", {
                        bubbles: !0,
                        cancelable: !0,
                      });
                      e.dispatchEvent(t);
                    }
                  } else if (r.querySelector('input[type="radio"]')) {
                    const t = r.querySelector('input[type="radio"]').name;
                    a(t, e);
                  } else
                    "select" === r.tagName.toLowerCase() &&
                      ((r.selectedIndex = 0),
                      r.dispatchEvent(new Event("change")));
                });
            })(i, l),
            e.remove(),
            n(),
            window.executeWizedRequest();
        }
      });
  }),
  (window.Wized = window.Wized || []),
  window.Wized.push(() => {
    const e = document.querySelector('[wized-filter-element="list"]'),
      t = document.querySelector('[wized-filter-element="empty-state"]'),
      r = t.getAttribute("wized-hidden-class"),
      i = () => {
        0 === e.children.length ? t.classList.remove(r) : t.classList.add(r);
      };
    new MutationObserver(i).observe(e, { childList: !0 }), i();
  });

