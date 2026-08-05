const progress = document.querySelector(".progress");
const revealItems = document.querySelectorAll(".reveal");

document.documentElement.classList.add("js");

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
  window.setTimeout(() => {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }, 1200);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const sentenceVariations = [
  "Meaning.",
  "Make sense.",
  "I help people understand.",
  "I help people understand ideas.",
  "I turn ideas into something people understand.",
  "I make complicated ideas easier to connect with.",
  "I like making complicated ideas easier to understand.",
  "I like turning complicated ideas into something people can connect with.",
  "I like turning complicated ideas into language people can actually connect with.",
  "I like translating complicated ideas into language that feels intuitive and emotionally accessible.",
  "I enjoy translating layered or abstract ideas into communication that people can emotionally recognize and meaningfully connect with.",
  "I like transforming complex ideas into language that reduces friction and helps people feel personally connected to what's being communicated.",
  "I enjoy turning dense or complicated concepts into language that feels clear, human, emotionally intuitive, and genuinely accessible to the people hearing it.",
  "I like translating complicated ideas into language structures that preserve nuance while still allowing people to emotionally recognize themselves inside the meaning.",
  "I enjoy transforming complex and often abstract ideas into language that lowers cognitive friction while creating a stronger sense of emotional clarity and personal resonance.",
  "I like taking layered, ambiguous, or highly conceptual ideas and reshaping them into language that people can intuitively process, emotionally connect with, and meaningfully apply to themselves.",
  "I enjoy translating complicated conceptual frameworks into emotionally legible and cognitively accessible language systems that help people feel both intellectually oriented and personally understood.",
  "I like transforming multidimensional and often emotionally abstract ideas into communication frameworks that preserve strategic nuance while simultaneously maximizing interpretive clarity, emotional resonance, and audience self-recognition.",
  "I enjoy architecting linguistically accessible yet strategically sophisticated communication structures capable of translating conceptually dense, emotionally layered, and contextually ambiguous ideas into forms that facilitate intuitive audience comprehension, emotional alignment, and personally meaningful interpretive connection.",
];

const startingSentence =
  "I like turning complicated ideas into something people can connect with.";
const sentenceOutput = document.querySelector("#sentenceOutput");
const complexitySlider = document.querySelector("#complexitySlider");
const setSentence = (index) => {
  const safeIndex = Math.min(Math.max(index, 0), sentenceVariations.length - 1);
  sentenceOutput.textContent = sentenceVariations[safeIndex];
  complexitySlider.value = String(safeIndex);
  complexitySlider.max = String(sentenceVariations.length - 1);
};

if (sentenceOutput && complexitySlider) {
  complexitySlider.addEventListener("input", (event) => {
    setSentence(Number(event.target.value));
  });

  setSentence(sentenceVariations.indexOf(startingSentence));
}

const storyScenes = document.querySelectorAll(".storybook .story-section");
let parallaxFrame = null;

const updateSceneMotion = () => {
  parallaxFrame = null;
  storyScenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = Math.max(-1, Math.min(1, (viewport * 0.5 - rect.top) / viewport));
    scene.style.setProperty("--scene-progress", progress.toFixed(3));
  });
};

const requestSceneMotion = () => {
  if (parallaxFrame === null) {
    parallaxFrame = window.requestAnimationFrame(updateSceneMotion);
  }
};

if (storyScenes.length) {
  window.addEventListener("scroll", requestSceneMotion, { passive: true });
  window.addEventListener("resize", requestSceneMotion);
  updateSceneMotion();
}

const inquiryForm = document.querySelector("#inquiryForm");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = inquiryForm.querySelector("#inquiryName").value.trim();
    const subject = inquiryForm.querySelector("#inquirySubject").value.trim();
    const message = inquiryForm.querySelector("#inquiryMessage").value.trim();
    const body = ["Hi Zack,", "", message, "", "From: " + name].join("\n");
    const mailto = "mailto:zolguin11@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
  });
}

const questionCarousels = document.querySelectorAll("[data-carousel]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

questionCarousels.forEach((carousel, carouselIndex) => {
  const questions = Array.from(carousel.querySelectorAll("li"));
  let currentIndex = 0;
  let rotationTimer = null;
  let rotationStartTimer = null;
  let transitionTimer = null;
  let activeQuestionAnimations = [];

  const renderQuestions = () => {
    questions.forEach((question) => {
      question.classList.remove("is-current", "is-next", "is-next-two", "is-next-three");
    });

    questions[currentIndex].classList.add("is-current");
    questions[(currentIndex + 1) % questions.length].classList.add("is-next");
    questions[(currentIndex + 2) % questions.length].classList.add("is-next-two");
    questions[(currentIndex + 3) % questions.length].classList.add("is-next-three");
  };

  const advanceQuestions = () => {
    const visibleQuestions = [
      carousel.querySelector(".is-current"),
      carousel.querySelector(".is-next"),
      carousel.querySelector(".is-next-two"),
      carousel.querySelector(".is-next-three"),
    ];

    if (!visibleQuestions[0] || typeof visibleQuestions[0].animate !== "function") {
      currentIndex = (currentIndex + 1) % questions.length;
      renderQuestions();
      return;
    }

    const questionRects = visibleQuestions.map((question) => question.getBoundingClientRect());
    const questionListRect = carousel.querySelector("ul").getBoundingClientRect();
    const incomingQuestion = questions[(currentIndex + 4) % questions.length];
    const incomingDistance = questionRects[3].top - questionRects[2].top;
    const endingOpacities = [0, 1, 0.5, 0.3];

    incomingQuestion.classList.add("is-incoming");
    incomingQuestion.style.top = `${questionRects[3].top - questionListRect.top + incomingDistance}px`;

    activeQuestionAnimations = visibleQuestions.map((question, index) => {
      const distance = index === 0
        ? questionRects[1].top - questionRects[0].top
        : questionRects[index].top - questionRects[index - 1].top;

      return question.animate(
        [
          {
            opacity: getComputedStyle(question).opacity,
            transform: "translateY(0)",
          },
          {
            opacity: endingOpacities[index],
            transform: `translateY(${-distance}px)`,
          },
        ],
        {
          duration: 520,
          delay: index * 35,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "forwards",
        }
      );
    });

    activeQuestionAnimations.push(
      incomingQuestion.animate(
        [
          { opacity: 0, transform: "translateY(0)" },
          {
            opacity: 0.16,
            transform: `translateY(${-incomingDistance}px)`,
          },
        ],
        {
          duration: 520,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "forwards",
        }
      )
    );

    transitionTimer = window.setTimeout(() => {
      currentIndex = (currentIndex + 1) % questions.length;
      renderQuestions();

      activeQuestionAnimations.forEach((animation) => animation.cancel());
      activeQuestionAnimations = [];
      incomingQuestion.classList.remove("is-incoming");
      incomingQuestion.style.top = "";

      transitionTimer = null;
    }, 640);
  };

  const stopRotation = () => {
    if (transitionTimer !== null) {
      window.clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    activeQuestionAnimations.forEach((animation) => animation.cancel());
    activeQuestionAnimations = [];
    carousel.querySelectorAll(".is-incoming").forEach((question) => {
      question.classList.remove("is-incoming");
      question.style.top = "";
    });

    if (rotationStartTimer !== null) {
      window.clearTimeout(rotationStartTimer);
      rotationStartTimer = null;
    }

    if (rotationTimer !== null) {
      window.clearInterval(rotationTimer);
      rotationTimer = null;
    }
  };

  const startRotation = () => {
    stopRotation();
    if (reduceMotion.matches) return;
    rotationStartTimer = window.setTimeout(() => {
      advanceQuestions();
      rotationTimer = window.setInterval(advanceQuestions, 4000);
      rotationStartTimer = null;
    }, 4000 + carouselIndex * 500);
  };

  carousel.addEventListener("focusin", stopRotation);
  carousel.addEventListener("focusout", startRotation);
  reduceMotion.addEventListener("change", startRotation);

  renderQuestions();
  startRotation();
});
