/**
 * Amann Prakash Portfolio — Premium Animations
 * GSAP + AOS + custom effects (Framer Motion-style motion via GSAP)
 */

document.body.classList.add("loading");

/* ── Loader ── */
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof gsap !== "undefined") {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          loader.classList.add("hidden");
          document.body.classList.remove("loading");
          initAnimations();
        },
      });
    } else {
      loader.classList.add("hidden");
      document.body.classList.remove("loading");
      initAnimations();
    }
  }, 900);
});

function initAnimations() {
  initAOS();
  initTyping();
  initCounters();
  initMagnetic();
  initProjectSpotlight();
}

/* ── AOS ── */
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "all" : false,
    });
  }
}

/* ── GSAP ScrollTrigger ── */
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-name", {
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: "power4.out",
    delay: 0.3,
  });

  gsap.utils.toArray(".gradient-orb").forEach((orb, i) => {
    gsap.to(orb, {
      y: (i + 1) * 60,
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });
  });

  gsap.utils.toArray(".section-title").forEach((title) => {
    // gsap.from(title, {
    //   opacity: 0,
    //   y: 30,
    //   duration: 0.8,
    //   scrollTrigger: {
    //     trigger: title,
    //     start: "top 85%",
    //     toggleActions: "play none none none",
    //   },
    // });
  });
}

/* ── Typing Animation ── */
function initTyping() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const phrases = [
    "DevOps Engineer",
    "Cloud Enthusiast",
    "Linux & Networking Learner",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  el.innerHTML = '<span class="typed-text"></span><span class="typed-cursor"></span>';
  const textSpan = el.querySelector(".typed-text");

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      textSpan.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 70);
    } else {
      textSpan.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }

  setTimeout(type, 1200);
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ── Magnetic Buttons ── */
function initMagnetic() {
  if (window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = parseFloat(el.dataset.strength) || 0.3;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (typeof gsap !== "undefined") {
        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      }
    });

    el.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
      } else {
        el.style.transform = "";
      }
    });
  });
}

/* ── Project Card Spotlight ── */
function initProjectSpotlight() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });
}

/* ── Particles ── */
(function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId;
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(50, Math.floor(w / 24));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelAnimationFrame(animId);
  }
})();

/* ── Cursor Glow ── */
(function initCursorGlow() {
  if (window.matchMedia("(hover: none)").matches) return;

  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = `${cx}px`;
    glow.style.top = `${cy}px`;
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ── Cursor Trail ── */
(function initCursorTrail() {
  if (window.matchMedia("(hover: none)").matches) return;

  const canvas = document.getElementById("cursor-trail");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const trail = [];
  const maxTrail = 20;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  document.addEventListener("mousemove", (e) => {
    trail.push({ x: e.clientX, y: e.clientY, life: maxTrail });
    if (trail.length > maxTrail) trail.shift();
  });

  function drawTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((point, i) => {
      point.life--;
      const alpha = (point.life / maxTrail) * 0.4;
      const size = (point.life / maxTrail) * 6;

      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
      ctx.fill();
    });

    while (trail.length && trail[0].life <= 0) trail.shift();
    requestAnimationFrame(drawTrail);
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawTrail();
  }
})();

/* ── Header Scroll ── */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

/* ── Mobile Nav ── */
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const nav = document.querySelector(".nav");

navToggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("open");
  navMenu?.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const id = anchor.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ── Contact Form ── */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email client…";
  contactForm.reset();
});

/* ── Footer Year ── */
document.getElementById("year").textContent = new Date().getFullYear();
