(() => {
  const TZ = "America/Moncton"; // Fredericton runs on Atlantic time
  const HOURS = {
    0: null,
    1: [570, 1140],
    2: [570, 1140],
    3: [570, 1140],
    4: [570, 1140],
    5: [570, 1140],
    6: [570, 1080],
  };
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fmt = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h >= 12 ? "pm" : "am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
  };

  const shopNow = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, mins: Number(get("hour")) * 60 + Number(get("minute")) };
  };

  // ---- Open / closed status and today's row ----
  const statusEl = document.querySelector("[data-status]");
  const statusText = document.querySelector("[data-status-text]");

  const renderStatus = () => {
    const { day, mins } = shopNow();

    document.querySelectorAll("[data-day]").forEach((row) => {
      row.classList.toggle("is-today", Number(row.dataset.day) === day);
    });

    if (!statusEl) return;
    const today = HOURS[day];
    let text;
    let open = false;

    if (today && mins >= today[0] && mins < today[1]) {
      open = true;
      text = `Open now, until ${fmt(today[1])}`;
    } else if (today && mins < today[0]) {
      text = `Closed, opens today at ${fmt(today[0])}`;
    } else {
      let next = (day + 1) % 7;
      let steps = 1;
      while (!HOURS[next]) {
        next = (next + 1) % 7;
        steps += 1;
      }
      const label = steps === 1 ? "tomorrow" : DAY_NAMES[next];
      text = `Closed, opens ${label} at ${fmt(HOURS[next][0])}`;
    }

    statusText.textContent = `${text} at 397 King Street`;
    statusEl.classList.toggle("is-open", open);
  };
  renderStatus();
  setInterval(renderStatus, 60000);

  // ---- Header, scroll progress, mobile booking bar ----
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const bookBar = document.querySelector("[data-bookbar]");
  const hero = document.querySelector(".hero");
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-solid", y > 24);
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (bookBar && hero) {
      bookBar.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
    }
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  // ---- Services: photo follows the row you point at ----
  const preview = document.querySelector("[data-preview]");
  const rows = [...document.querySelectorAll(".service")];

  if (preview && rows.length) {
    const imgs = rows.map((row) => {
      const img = new Image();
      img.src = row.dataset.img;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      preview.appendChild(img);
      return img;
    });

    const activate = (index) => {
      rows.forEach((r, i) => r.classList.toggle("is-active", i === index));
      imgs.forEach((im, i) => im.classList.toggle("is-active", i === index));
    };

    rows.forEach((row, i) => {
      row.addEventListener("mouseenter", () => activate(i));
      row.addEventListener("focusin", () => activate(i));
    });
    // On wide screens start on the skin fade, the shop's signature cut.
    // On phones there is no preview, so no row should look selected.
    if (window.matchMedia("(min-width: 62.01rem)").matches) activate(1);
  }

  // ---- Gallery: buttons and drag to scroll ----
  const strip = document.querySelector("[data-strip]");
  if (strip) {
    document.querySelectorAll("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        strip.scrollBy({ left: Number(btn.dataset.scroll) * strip.clientWidth * 0.8, behavior: "smooth" });
      });
    });

    let startX = 0;
    let startLeft = 0;
    let dragging = false;

    strip.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
      strip.classList.add("is-dragging");
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener("pointermove", (e) => {
      if (dragging) strip.scrollLeft = startLeft - (e.clientX - startX);
    });
    const stop = () => {
      dragging = false;
      strip.classList.remove("is-dragging");
    };
    strip.addEventListener("pointerup", stop);
    strip.addEventListener("pointercancel", stop);

    strip.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") strip.scrollBy({ left: strip.clientWidth * 0.5, behavior: "smooth" });
      if (e.key === "ArrowLeft") strip.scrollBy({ left: -strip.clientWidth * 0.5, behavior: "smooth" });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
