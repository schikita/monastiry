// === ОПТИМИЗИРОВАННЫЙ ГЛАВНЫЙ СКРИПТ ===

// Debounce функция для оптимизации
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// === ПЛАВНАЯ ПРОКРУТКА ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// === НАВИГАЦИЯ: СКРОЛЛ И ГАМБУРГЕР ===
(function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.querySelector(".hamburger");
  const menu = document.querySelector(".menu");

  // Фон навигации при скролле
  const handleScroll = debounce(() => {
    if (window.scrollY > 100) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  }, 50);

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Гамбургер меню
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      menu.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "";
    });

    // Закрытие меню при клике на ссылку
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }
})();

// === КНОПКА "НАВЕРХ" ===
(function initScrollToTop() {
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.setAttribute("aria-label", "Наверх");
  scrollBtn.title = "Вернуться наверх";
  document.body.appendChild(scrollBtn);

  const toggleButton = debounce(() => {
    if (window.scrollY > 500) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  }, 100);

  window.addEventListener("scroll", toggleButton, { passive: true });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();

// === ЛОАДЕР ===
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("hidden");
    setTimeout(() => {
      loader?.remove();
    }, 700);
  }

  // Скрываем через 2 секунды или когда страница загружена
  setTimeout(hideLoader, 2000);
  
  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }
})();

// === СМЕНА ФОНОВ В HERO ===
(function initHeroBackgrounds() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const imgs = ["../img/hero.jpg", "../img/hero-2.jpg", "../img/hero-3.jpg"];

  // Предзагрузка изображений
  imgs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  let currentIndex = 0;

  function cycleBackground() {
    const nextIndex = (currentIndex + 1) % imgs.length;
    const nextImg = imgs[nextIndex];

    hero.style.setProperty("--hero-next", `url("${nextImg}")`);
    hero.classList.add("is-fading");

    setTimeout(() => {
      hero.style.setProperty("--hero-url", `url("${nextImg}")`);
      hero.classList.remove("is-fading");
      currentIndex = nextIndex;
    }, 800);
  }

  // Первая смена через 5 секунд, затем каждые 5 секунд
  setTimeout(cycleBackground, 5000);
  setInterval(cycleBackground, 5000);
})();

// === LIGHTBOX ДЛЯ ГАЛЕРЕИ ===
(function initLightbox() {
  const grid = document.getElementById("photo-grid");
  const dialog = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-cap");
  const closeBtn = dialog?.querySelector(".lb-close");

  if (!grid || !dialog || !img || !caption) return;

  grid.addEventListener("click", (e) => {
    const photoCard = e.target.closest(".ph");
    if (!photoCard) return;

    const photo = photoCard.querySelector("img");
    const figcaption = photoCard.querySelector("figcaption");

    if (photo) {
      img.src = photo.currentSrc || photo.src;
      img.alt = photo.alt || "";
      caption.textContent = figcaption ? figcaption.textContent.trim() : "";
      dialog.showModal();
    }
  });

  closeBtn?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog.open) dialog.close();
  });
})();

// === КАРУСЕЛЬ ПРОЕКТОВ ===
(function initProjectsCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const nextBtn = document.querySelector(".projects-section .carousel-next");
  const prevBtn = document.querySelector(".projects-section .carousel-prev");

  let currentIndex = 0;
  let autoplayInterval;

  function getSlidesToShow() {
    const width = window.innerWidth;
    if (width > 968) return 3;
    if (width > 640) return 2;
    return 1;
  }

  function updateCarousel() {
    const visibleSlides = getSlidesToShow();
    const slideWidth = 100 / visibleSlides;

    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}%`;
    });

    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
  }

  function goNext() {
    const maxIndex = slides.length - getSlidesToShow();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function goPrev() {
    const maxIndex = slides.length - getSlidesToShow();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(goNext, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  nextBtn?.addEventListener("click", () => {
    goNext();
    stopAutoplay();
    startAutoplay();
  });

  prevBtn?.addEventListener("click", () => {
    goPrev();
    stopAutoplay();
    startAutoplay();
  });

  // Пауза при наведении
  const carouselContainer = track.closest(".projects-carousel-container");
  carouselContainer?.addEventListener("mouseenter", stopAutoplay);
  carouselContainer?.addEventListener("mouseleave", startAutoplay);

  // Адаптивность
  const handleResize = debounce(() => {
    currentIndex = 0; // Сброс при изменении размера
    updateCarousel();
  }, 250);

  window.addEventListener("resize", handleResize);

  // Инициализация
  updateCarousel();
  startAutoplay();
})();

// === INTERSECTION OBSERVER ДЛЯ АНИМАЦИЙ ===
(function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target); // Оптимизация: отключаем после анимации
      }
    });
  }, observerOptions);

  document.querySelectorAll(".gallery-item, .video-card, .audio-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
})();

// === ЛЕНИВАЯ ЗАГРУЗКА ВИДЕО ===
(function initLazyVideo() {
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.play().catch(() => {
            // Игнорируем ошибки автовоспроизведения
          });
          videoObserver.unobserve(video);
        }
      });
    });

    document.querySelectorAll("video[autoplay]").forEach((video) => {
      video.removeAttribute("autoplay");
      videoObserver.observe(video);
    });
  }
})();

// === ПРОИЗВОДИТЕЛЬНОСТЬ: ОТКЛЮЧЕНИЕ АНИМАЦИЙ ПРИ СКРОЛЛЕ ===
(function optimizeScrollPerformance() {
  let scrollTimer;
  const body = document.body;

  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimer);
      body.classList.add("is-scrolling");

      scrollTimer = setTimeout(() => {
        body.classList.remove("is-scrolling");
      }, 150);
    },
    { passive: true }
  );
})();

console.log("✅ Все скрипты загружены и оптимизированы");