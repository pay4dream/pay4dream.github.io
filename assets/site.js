(function () {
  document.body.classList.add("js-enabled");

  var header = document.querySelector("[data-site-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A") {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var platformMessage = document.querySelector("[data-platform-message]");
  var ua = navigator.userAgent || "";
  var platform = /Windows/i.test(ua) ? "windows" : /Macintosh|Mac OS X/i.test(ua) ? "mac" : "";
  if (platform) {
    var card = document.querySelector('[data-platform-card="' + platform + '"]');
    if (card) card.classList.add("is-recommended");
    if (platformMessage) {
      platformMessage.textContent = platform === "mac" ? "已识别为 macOS，推荐下载 macOS 版。" : "已识别为 Windows，推荐下载 Windows 版。";
    }
  } else if (platformMessage) {
    platformMessage.textContent = "如果不确定系统版本，先确认你正在使用 macOS 还是 Windows。";
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var original = button.textContent;
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "";
      var copyAction = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : fallbackCopy(text);
      copyAction
        .then(function () {
          button.textContent = "已复制";
          window.setTimeout(function () {
            button.textContent = original;
          }, 1600);
        })
        .catch(function () {
          button.textContent = "复制失败";
          window.setTimeout(function () {
            button.textContent = original;
          }, 1600);
        });
    });
  });
})();
