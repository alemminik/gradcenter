document.addEventListener("DOMContentLoaded", () => {
  const animateNumberLogic = () => {
    const countersSection = document.getElementById("counters-section");
    const numberElements = document.querySelectorAll(".counters__number");

    const animateNumber = (el) => {
      const target = +el.dataset.target;
      const duration = 1500;
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        const easedProgress = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
        const currentValue = Math.floor(easedProgress * target);

        el.textContent = currentValue;

        if (progress < duration) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };

      window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            numberElements.forEach((numEl) => animateNumber(numEl));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    if (countersSection) {
      observer.observe(countersSection);
    }
  };

  const servicesGridLogic = () => {
    const servicesGrid = document.querySelector(".ecosystem__grid");
    const serviceButtons = document.querySelectorAll(".ecosystem__tag");

    if (servicesGrid) {
      servicesGrid.addEventListener("mousemove", (e) => {
        const gridRect = servicesGrid.getBoundingClientRect();

        const mouseX = e.clientX - gridRect.left;
        const mouseY = e.clientY - gridRect.top;

        serviceButtons.forEach((btn) => {
          const btnRect = btn.getBoundingClientRect();

          const btnCenterX = btnRect.left - gridRect.left + btnRect.width / 2;
          const btnCenterY = btnRect.top - gridRect.top + btnRect.height / 2;

          const dx = mouseX - btnCenterX;
          const dy = mouseY - btnCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 220; // can be 150

          if (distance < maxDistance) {
            const scaleFactor = 1.15;
            const pushFactor = 0.2;

            const proximity = 1 - distance / maxDistance;

            const scale = 1 + (scaleFactor - 1) * proximity;
            const translateX = -dx * pushFactor * proximity;
            const translateY = -dy * pushFactor * proximity;

            btn.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            btn.classList.add("hovered");
          } else {
            btn.style.transform = "translate(0, 0) scale(1)";
            btn.classList.remove("hovered");
          }
        });
      });

      servicesGrid.addEventListener("mouseleave", () => {
        serviceButtons.forEach((btn) => {
          btn.style.transform = "translate(0, 0) scale(1)";
          btn.classList.remove("hovered");
        });
      });
    }
  };

  const photosStackLogic = () => {
    const photosWrapper = document.querySelectorAll(".photos-stack__img-wrapper");

    if (!photosWrapper.length) return;

    photosWrapper.forEach((photoWrapper, index) => {
      const zIndex = index + 1;
      let enterTimeout;
      let leaveTimeout;

      photoWrapper.addEventListener("mouseenter", () => {
        clearTimeout(leaveTimeout);
        enterTimeout = setTimeout(() => {
          photoWrapper.style.zIndex = 10;
        }, 250);
      });
      photoWrapper.addEventListener("mouseleave", () => {
        clearTimeout(enterTimeout);
        leaveTimeout = setTimeout(() => {
          photoWrapper.style.zIndex = zIndex;
        }, 150);
      });
    });
  };

  const serviceOptionsHoverLogic = () => {
    const serviceItems = document.querySelectorAll(".service__option");

    if (!serviceItems.length) return;

    serviceItems.forEach((item) => {
      const optionIcon = item.querySelector(".option__icon");
      if (!optionIcon) return;
      item.addEventListener("mouseenter", () => {
        optionIcon.classList.add("hovered");
      });
      item.addEventListener("mouseleave", () => {
        optionIcon.classList.remove("hovered");
      });
    });
  };

  const formMaskInputLogic = () => {
    const phoneEls = document.querySelectorAll("[aria-mask]");
    if (!phoneEls.length) return;

    phoneEls.forEach((phoneEl) => {
      const mask = IMask(phoneEl, {
        mask: "+{7} (000) 000 00 00",
        lazy: false,
        placeholderChar: "_",
        overwrite: true,
      });

      phoneEl.classList.add("empty");

      phoneEl.addEventListener("input", () => {
        const digits = phoneEl.value.replace(/\D/g, "");

        if (digits.length === 1) {
          phoneEl.classList.add("empty");
        } else {
          phoneEl.classList.remove("empty");
        }
      });
    });
  };

  const recentSwiperLogic = () => {
    const slider = document.querySelector(".recent-posts__slider");
    if (!slider) return;

    const recentSlider = new Swiper(slider, {
      direction: "horizontal",
      effect: "coverflow",
      loop: true,
      slidesPerView: 3,
      spaceBetween: 24,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
      },
    });
  };

  const headerSubmenuLogic = () => {
    const headerItems = document.querySelectorAll(".header__nav-item");
    if (!headerItems.length) return;

    headerItems.forEach((link) => {
      const submenu = link.querySelector(".header__submenu");
      const arrowIcon = link.querySelector(".header__nav-item-arrow");
      if (!submenu || !arrowIcon) return;

      link.addEventListener("mouseenter", () => {
        submenu.classList.add("active");
        arrowIcon.classList.add("active");
      });
      link.addEventListener("mouseleave", () => {
        submenu.classList.remove("active");
        arrowIcon.classList.remove("active");
      });
    });
  };

  const hoverDirectionsLogic = () => {
    const element = document.querySelectorAll(".direction");
    if (!element.length) return;

    element.forEach((el) => {
      const btn = el.querySelector(".direction__btn");
      if (!btn) return;
      el.addEventListener("mouseenter", () => {
        el.classList.add("hovered");
        btn.classList.add("hovered");
      });
      el.addEventListener("mouseleave", () => {
        el.classList.remove("hovered");
        btn.classList.remove("hovered");
      });
    });
  };

  const ymapsLogic = async () => {
    const ymap = document.getElementById("map");
    if (!ymap) return;

    let currentZoom = 14;

    await ymaps3.ready;
    const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } = ymaps3;

    const map = new YMap(ymap, {
      location: { center: [30.314997, 59.938784], zoom: currentZoom },
      mode: "vector",
      behaviors: ["drag", "pinchZoom"],
    });

    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer());

    document.getElementById("zoom-in").addEventListener("click", () => {
      currentZoom = Math.min(currentZoom + 1, 21);
      map.update({ location: { zoom: currentZoom } });
    });

    document.getElementById("zoom-out").addEventListener("click", () => {
      currentZoom = Math.max(currentZoom - 1, 0);
      map.update({ location: { zoom: currentZoom } });
    });

    const markerElement = document.createElement("div");
    markerElement.style.width = "72px";
    markerElement.style.height = "90px";
    markerElement.classList.add("ymaps-marker");
    markerElement.style.backgroundImage = "url(/img/decor/marker.png)";
    markerElement.style.backgroundSize = "contain";
    markerElement.style.backgroundRepeat = "no-repeat";
    markerElement.style.pointerEvents = "none";
    markerElement.style.transform = "translate(-50%, -100%)";

    const marker = new YMapMarker(
      { coordinates: [30.314997, 59.938784], draggable: false },
      markerElement,
    );

    map.addChild(marker);
  };

  const modalLogic = () => {
    MicroModal.init({
      awaitOpenAnimation: true,
      onShow: () => document.body.classList.add("modal-open"),
      onClose: () => document.body.classList.remove("modal-open"),
    });
  };

  const headerHeightLogic = () => {
    const header = document.querySelector(".header");
    if (!header) return;

    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
  };

  const listenersLogic = () => {
    window.addEventListener("load", headerHeightLogic);
    window.addEventListener("resize", headerHeightLogic);
    const header = document.querySelector(".header");
    if (header) {
      const resizeObserver = new ResizeObserver(headerHeightLogic);
      resizeObserver.observe(header);
    }
  };

  const main = () => {
    animateNumberLogic();
    servicesGridLogic();
    photosStackLogic();
    serviceOptionsHoverLogic();
    formMaskInputLogic();
    recentSwiperLogic();
    headerSubmenuLogic();
    hoverDirectionsLogic();
    ymapsLogic();
    modalLogic();
    headerHeightLogic();
    listenersLogic();
  };

  main();
});
