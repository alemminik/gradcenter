function getVerticalPadding(element) {
  if (!element) return { paddingTop: 0, paddingBottom: 0, verticalPadding: 0 };

  const styles = window.getComputedStyle(element);

  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;

  return {
    paddingTop,
    paddingBottom,
    verticalPadding: paddingTop + paddingBottom,
  };
}

function onClickOutside(element, callback, extraIgnore = []) {
  function handler(event) {
    const ignoreElements = [element, ...extraIgnore];
    const isClickInsideIgnored = ignoreElements.some((el) => el.contains(event.target));

    if (!isClickInsideIgnored) {
      callback(event);
    }
  }

  document.addEventListener("click", handler);

  return () => document.removeEventListener("click", handler);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
    const windowWidth = window.innerWidth;

    if (windowWidth <= 860) return;

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
          } else {
            btn.style.transform = "translate(0, 0) scale(1)";
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
    const phoneEls = document.querySelectorAll("[data-mask]");
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
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      breakpoints: {
        391: {
          slidesPerView: 1.1,
        },
        466: {
          slidesPerView: 1.2,
        },
        705: {
          slidesPerView: 1.7,
          spaceBetween: 18,
        },
        796: {
          spaceBetween: 24,
          slidesPerView: 2.1,
        },
        1171: {
          slidesPerView: 3,
          spaceBetween: 24,
        }
      },
      navigation: {
        nextEl: ".recent-posts-slider__btn-next",
        prevEl: ".recent-posts-slider__btn-prev",
      },
    });
  };

  const newsSwiperLogic = () => {
    const slider = document.querySelector(".news-slider");
    if (!slider) return;

    const newsSlider = new Swiper(slider, {
      direction: "horizontal",
      loop: false,
      slidesPerView: 1,
      grabCursor: true,
      spaceBetween: 24,

      pagination: {
        el: ".news-slider__pagination",
        type: "fraction",
        renderFraction: function (currentClass, totalClass) {
          return (
            '<span class="' +
            currentClass +
            '"></span>' +
            "<span class='pagination-separator'>/</span>" +
            '<span class="' +
            totalClass +
            '"></span>'
          );
        },
        formatFractionCurrent: function (number) {
          return number < 10 ? "0" + number : number; // добавляем 0
        },
        formatFractionTotal: function (number) {
          return number < 10 ? "0" + number : number;
        },
      },

      navigation: {
        nextEl: ".news-slider__btn-next",
        prevEl: ".news-slider__btn-prev",
      },
    });
  };

  const directionsSwiperLogic = () => {
    const slider = document.querySelector(".directions__swiper");
    if (!slider) return;

    const directionsSlider = new Swiper(slider, {
      direction: "horizontal",
      loop: false,
      slidesPerView: 1.15,
      grabCursor: true,
      spaceBetween: 12,

      breakpoints: {
        390: {
          slidesPerView: 1.2,
          spaceBetween: 18,
        },
      },
    });
  };

  const casesSwiperLogic = () => {
    const sliders = document.querySelectorAll(".case-slider");
    if (!sliders.length) return;

    sliders.forEach((slider) => {
      const nextEl = slider.parentElement.querySelector(".case-slider__btn-next");
      const prevEl = slider.parentElement.querySelector(".case-slider__btn-prev");
      if (!nextEl || !prevEl) return;

      const casesSlider = new Swiper(slider, {
        direction: "horizontal",

        loop: false,
        slidesPerView: 1,
        spaceBetween: 15,
        grabCursor: true,
        ceneteredSlides: true,
        breakpoints: {
          801: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
        },

        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
      });
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
        if (window.innerWidth <= 1010) return;
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
      onShow: () => document.body.classList.add("locked"),
      onClose: () => document.body.classList.remove("locked"),
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

  const hoverResourceLinksLogic = () => {
    const resourceLinks = document.querySelectorAll(".resource__link");
    if (!resourceLinks.length) return;

    resourceLinks.forEach((link) => {
      const btn = link.querySelector(".resource__btn");
      if (!btn) return;

      link.addEventListener("mouseenter", () => {
        btn.classList.add("hovered");
      });
      link.addEventListener("mouseleave", () => {
        btn.classList.remove("hovered");
      });
    });
  };

  const choicesLogic = () => {
    const selects = document.querySelectorAll(".js-choices");

    if (!selects.length) return;

    selects.forEach((select) => {
      if (select.classList.contains("js-choices-search")) {
        const choices = new Choices(select, {
          searchEnabled: true,
          itemSelectText: "",
          shouldSort: false,
          allowHTML: true,
          noResultsText: "Не найдено",
          placeholder: true,
          placeholderValue: "Поиск",
          searchPlaceholderValue: "Начните ввод...",
        });
      } else {
        const choices = new Choices(select, {
          searchEnabled: false,
          itemSelectText: "",
          shouldSort: false,
          allowHTML: true,
        });
      }
    });
  };

  const casesAccordionsLogic = async () => {
    const accordions = document.querySelectorAll("[data-accordion]");
    if (!accordions.length) return;

    accordions.forEach((accordion) => {
      const arrow = accordion.querySelector("[data-accordion-icon]");
      const control = accordion.querySelector("[data-accordion-control]");
      const body = accordion.querySelector("[data-accordion-body]");
      if (!arrow || !body || !control) return;

      body.style.transition = "0s";
      const offsetHeight = getComputedStyle(body).height;
      const { paddingTop, paddingBottom } = getVerticalPadding(body);
      body.style.paddingTop = "0px";
      body.style.paddingBottom = "0px";
      body.style.maxHeight = "0px";
      body.style.opacity = "1";
      setTimeout(() => {
        body.style.transition = "0.7s";
      }, 0);

      control.addEventListener("mouseenter", () => {
        arrow.classList.add("hovered");
      });

      control.addEventListener("mouseleave", () => {
        arrow.classList.remove("hovered");
      });

      control.addEventListener("click", () => {
        const wasOpen = accordion.classList.contains("isOpen");

        if (wasOpen) {
          body.style.maxHeight = "0px";
          accordion.classList.remove("isOpen");
          arrow.classList.remove("_active");
          body.style.paddingTop = "0px";
          body.style.paddingBottom = "0px";
        } else {
          body.style.maxHeight = `${offsetHeight}`;
          accordion.classList.add("isOpen");
          arrow.classList.add("_active");
          body.style.paddingTop = `${paddingTop}px`;
          body.style.paddingBottom = `${paddingBottom}px`;
        }

        accordions.forEach((otherAccordion) => {
          if (otherAccordion === accordion) return;

          const otherArrow = otherAccordion.querySelector("[data-accordion-icon]");
          const otherBody = otherAccordion.querySelector("[data-accordion-body]");
          if (!otherArrow || !otherBody) return;

          otherBody.style.maxHeight = "0px";
          otherAccordion.classList.remove("isOpen");
          otherArrow.classList.remove("_active");
          otherBody.style.paddingTop = "0px";
          otherBody.style.paddingBottom = "0px";
        });
      });
    });
  };

  const burgerMenuLogic = () => {
    const burger = document.querySelector(".burger");
    const headerNav = document.querySelector(".header__nav");
    const headerNavItems = document.querySelectorAll(".header__nav-item");
    const windowWidth = window.innerWidth;

    if (!burger || !headerNav || !headerNavItems.length) return;

    if (windowWidth <= 1010) {
      headerNavItems.forEach((item) => {
        item.setAttribute("data-accordion", "");
      });
    }

    onClickOutside(
      headerNav,
      () => {
        if (!headerNav.classList.contains("active")) return;
        headerNav.classList.remove("active");
        burger.classList.remove("active");
        document.body.classList.remove("locked");
      },
      [burger],
    );

    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      headerNav.classList.toggle("active");
      document.body.classList.toggle("locked");
    });
  };

  const main = () => {
    burgerMenuLogic();
    casesAccordionsLogic();
    animateNumberLogic();
    servicesGridLogic();
    photosStackLogic();
    serviceOptionsHoverLogic();
    formMaskInputLogic();
    recentSwiperLogic();
    newsSwiperLogic();
    casesSwiperLogic();
    headerSubmenuLogic();
    hoverDirectionsLogic();
    hoverResourceLinksLogic();
    ymapsLogic();
    modalLogic();
    headerHeightLogic();
    listenersLogic();
    choicesLogic();
    directionsSwiperLogic();
  };

  main();
});
