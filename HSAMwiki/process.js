(() => {
  const showcase = document.querySelector("[data-process-showcase]");

  if (!showcase) {
    return;
  }

  const tabs = Array.from(showcase.querySelectorAll("[data-process-tab]"));
  const panels = Array.from(showcase.querySelectorAll("[data-process-panel]"));
  const count = showcase.querySelector("[data-process-count]");
  const track = showcase.querySelector(".process-track");
  const trackFill = showcase.querySelector(".process-track-fill");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const intervalDuration = 5000;
  const layoutSettleDuration = 420;

  let activeIndex = 0;
  let timeoutId = null;
  let segmentDelayId = null;
  let animationFrameId = null;
  let isVisible = false;
  let isPaused = false;

  const getDotPosition = (index) => {
    const dot = tabs[index].querySelector(".flow-dot");

    if (!dot || !track) {
      return "0px";
    }

    const dotBounds = dot.getBoundingClientRect();
    const trackBounds = track.getBoundingClientRect();

    return `${dotBounds.top + dotBounds.height / 2 - trackBounds.top}px`;
  };

  const getSegmentLength = (index) => {
    const start = Number.parseFloat(getDotPosition(index));
    const end =
      index < tabs.length - 1
        ? Number.parseFloat(getDotPosition(index + 1))
        : track?.getBoundingClientRect().height || start;

    return `${Math.max(0, end - start)}px`;
  };

  const resetSegment = (index, visible = false) => {
    showcase.style.setProperty("--flow-duration", "0ms");
    showcase.style.setProperty("--flow-start", getDotPosition(index));
    showcase.style.setProperty("--flow-progress", "0px");
    showcase.style.setProperty("--flow-opacity", visible ? "1" : "0");
  };

  const animateSegment = (index, duration, continueFromCurrent = false) => {
    const currentLength =
      continueFromCurrent && trackFill
        ? window.getComputedStyle(trackFill).height
        : "0px";

    showcase.style.setProperty("--flow-duration", "0ms");
    showcase.style.setProperty("--flow-start", getDotPosition(index));
    showcase.style.setProperty("--flow-progress", currentLength);
    showcase.style.setProperty("--flow-opacity", "1");

    animationFrameId = window.requestAnimationFrame(() => {
      animationFrameId = window.requestAnimationFrame(() => {
        showcase.style.setProperty("--flow-duration", `${duration}ms`);
        showcase.style.setProperty("--flow-progress", getSegmentLength(index));
        animationFrameId = null;
      });
    });
  };

  const activate = (nextIndex, moveFocus = false) => {
    activeIndex = (nextIndex + tabs.length) % tabs.length;

    tabs.forEach((tab, index) => {
      const isActive = index === activeIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel, index) => {
      const isActive = index === activeIndex;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    resetSegment(activeIndex);

    if (count) {
      count.textContent = String(activeIndex + 1).padStart(2, "0");
    }

    if (moveFocus) {
      tabs[activeIndex].focus();
    }
  };

  const stopAutoAdvance = (freezeProgress = false) => {
    if (freezeProgress && trackFill) {
      const currentHeight = window.getComputedStyle(trackFill).height;
      showcase.style.setProperty("--flow-duration", "0ms");
      showcase.style.setProperty("--flow-progress", currentHeight);
    }

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (segmentDelayId !== null) {
      window.clearTimeout(segmentDelayId);
      segmentDelayId = null;
    }

    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const startAutoAdvance = (continueFromCurrent = false) => {
    stopAutoAdvance();

    if (!isVisible || isPaused || reduceMotion.matches || document.hidden) {
      return;
    }

    const nextIndex = (activeIndex + 1) % tabs.length;
    const startDelay = continueFromCurrent ? 0 : layoutSettleDuration;

    if (!continueFromCurrent) {
      resetSegment(activeIndex);
    }

    segmentDelayId = window.setTimeout(() => {
      segmentDelayId = null;
      animateSegment(
        activeIndex,
        intervalDuration - startDelay,
        continueFromCurrent
      );
    }, startDelay);

    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      activate(nextIndex);
      startAutoAdvance();
    }, intervalDuration);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activate(index);
      startAutoAdvance();
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        return;
      }

      event.preventDefault();

      if (event.key === "Home") {
        activate(0, true);
      } else if (event.key === "End") {
        activate(tabs.length - 1, true);
      } else {
        activate(activeIndex + (event.key === "ArrowDown" ? 1 : -1), true);
      }

      startAutoAdvance();
    });
  });

  showcase.addEventListener("focusin", () => {
    isPaused = true;
    stopAutoAdvance(true);
  });

  showcase.addEventListener("focusout", (event) => {
    if (showcase.contains(event.relatedTarget)) {
      return;
    }

    isPaused = false;
    startAutoAdvance(true);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoAdvance(true);
    } else {
      startAutoAdvance(true);
    }
  });

  reduceMotion.addEventListener("change", () => {
    if (reduceMotion.matches) {
      stopAutoAdvance(true);
    } else {
      startAutoAdvance();
    }
  });

  window.addEventListener("resize", () => {
    stopAutoAdvance();
    resetSegment(activeIndex);
    startAutoAdvance();
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        startAutoAdvance();
      } else {
        stopAutoAdvance(true);
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(showcase);
  activate(0);
})();
