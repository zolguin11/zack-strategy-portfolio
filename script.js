const progress = document.querySelector(".progress");
const revealItems = document.querySelectorAll(".reveal");

document.documentElement.classList.add("js");

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${percent}%`;
};

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
