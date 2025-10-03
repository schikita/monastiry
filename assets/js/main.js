// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".gallery-item, .video-card, .audio-card, .timeline-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });


  document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('loader');
    if (!loader) return;

    function hide() {
      if (!loader) return;
      loader.classList.add('hidden');
      setTimeout(function () { loader && loader.remove && loader.remove(); }, 700);
      loader = null; // чтобы не повторять скрытие
    }

    // Прячем в любом случае через 3 сек.
    setTimeout(hide, 2000);
  });


  (function () {
   const hero = document.querySelector('.hero');
    if(!hero) return;

    // Массив фонов (добавьте свои пути)
    const imgs = [
      '../img/hero.jpg',
      '../img/hero-2.jpg',
      '../img/hero-3.jpg'
    ];

    // Предзагрузка, чтобы не мигало
    imgs.forEach(src => { const im = new Image(); im.src = src; });

    let i = 0;
    function cycle(){
      const next = imgs[(i+1) % imgs.length];

      // кладём следующий фон на верхний слой и плавно проявляем
      hero.style.setProperty('--hero-next', `url("${next}")`);
      hero.classList.add('is-fading');

      // после фейда меняем базовый фон и убираем верхний слой
      setTimeout(() => {
        hero.style.setProperty('--hero-url', `url("${next}")`);
        hero.classList.remove('is-fading');
        i = (i+1) % imgs.length;
      }, 800); // длительность фейда должна совпадать с CSS
    }

    // старт через 3 сек и далее каждые 3 сек
    setTimeout(cycle, 5000);
    setInterval(cycle, 5000);
    })();


    (function(){
    const grid = document.getElementById('photo-grid');
    const dlg  = document.getElementById('lightbox');
    const img  = document.getElementById('lightbox-img');
    const cap  = document.getElementById('lightbox-cap');
    const btn  = dlg.querySelector('.lb-close');

    if (!grid || !dlg) return;

    grid.addEventListener('click', (e) => {
      const ph = e.target.closest('.ph');
      if (!ph) return;
      const pic = ph.querySelector('img');
      const fc  = ph.querySelector('figcaption');
      img.src = pic.currentSrc || pic.src;
      img.alt = pic.alt || '';
      cap.textContent = fc ? fc.textContent.trim() : '';
      dlg.showModal();
    });

    btn.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dlg.open) dlg.close();
    });
  })();