// valdrada_questions.js

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("valdrada-app");

  // ==== Add eye image at top ====
  const eyeContainer = document.createElement("div");
  eyeContainer.style.width = "100%";
  eyeContainer.style.display = "flex";
  eyeContainer.style.justifyContent = "center";
  eyeContainer.style.margin = "30px 0";

  const eyeImg = document.createElement("img");
  eyeImg.src = "images/eye1.png";
  eyeImg.alt = "Eye symbol";
  eyeImg.style.width = "min(300px, 60%)";
  eyeImg.style.height = "auto";
  eyeImg.style.cursor = "pointer";

  // Hover swap effect
  eyeImg.addEventListener("mouseenter", () => {
    eyeImg.src = "images/eye.png";
  });
  eyeImg.addEventListener("mouseleave", () => {
    eyeImg.src = "images/eye1.png";
  });

  eyeContainer.appendChild(eyeImg);
  app.insertBefore(eyeContainer, app.firstChild);
  // ==== End eye image ====

  const choiceHistory = {
    seek: null,
    react: null,
    path: null
  };

  // Utility: automatically break sentences into separate lines
  function formatSentences(text) {
    return text
      .replace(/([\.!?;,])\s+/g, "$1<br>")
      .replace(/([\.!?;,])$/g, "$1<br>");
  }

  // =========================
  // STORY DATA
  // =========================

  const steps = [
    {
      id: "seek",
      prompt: "When you face the water, what are you trying to find?",
      choices: [
        {
          id: "clear-outline",
          label: "A clearer outline",
          story: [
            "You want the water to tell you something definite. You realize you’ve been waiting for something outside you to confirm your shape.",
            "So the reflection sharpens itself, trimming away anything that wavers.",
            "It answers you with clean edges, as if it knows you're trying to hold still."
          ]
        },
        {
          id: "softer-self",
          label: "A softer version of yourself",
          story: [
            "You want gentleness, not precision. You notice how much effort it takes to appear gentler than you feel.",
            "The reflection pulls back from clarity, letting the surface blur and settle."
          ]
        },
        {
          id: "break-pattern",
          label: "A break in the pattern",
          story: [
            "You are looking for interruption. Only when the reflection disobeys you do you see how rigid you’ve become.",
            "The reflection hesitates, then shifts.",
            "Some movements match yours; others drift away like a delayed echo."
          ]
        },
        {
          id: "forget-original",
          label: "A way to forget the original",
          story: [
            "You want the past to loosen its grip. You recognize the quiet wish you’ve been hiding: to step out of your own past.",
            "The reflection lets its lines drift, widening the distance between what is and what was.",
            "Small ghost-images trail behind you, then dissolve."
          ]
        }
      ]
    },
    {
      id: "react",
      prompt: "When the reflection follows your movements, how do you feel?",
      choices: [
        {
          id: "pulled",
          label: "Pulled toward it",
          story: [
            "You trust the version of yourself the lake returns. You suddenly see how long you’ve been wanting someone—anything—to mirror you faithfully.",
            "The reflection grows close, warm in its attention, waiting for your next move.",
            "You follow it. Or it follows you. Hard to tell."
          ]
        },
        {
          id: "uneasy",
          label: "Uneasy",
          story: [
            "The reflection feels too watchful. You realize the reflection isn’t too close. You are.",
            "A small tremor runs through it whenever you move, as if it sees more than it should.",
            "It doesn't turn away, and neither can you."
          ]
        },
        {
          id: "detached",
          label: "Detached",
          story: [
            "You give the reflection no special meaning. You finally recognize that indifference has become your safest posture.",
            "The surface grows quieter, like a page with only a few words left on it."
          ]
        },
        {
          id: "unable",
          label: "Unable to turn away",
          story: [
            "You can't look elsewhere. You see the truth: you are not staring at the reflection; you are waiting to be understood.",
            "The reflection stays close to your motions, anticipating them by a fraction of a second.",
            "You lean in without meaning to."
          ]
        }
      ]
    },
    {
      id: "path",
      prompt:
        "If you could step away from the mirrored city, which direction would you take?",
      choices: [
        {
          id: "harbour",
          label: "Toward the harbour",
          endingId: "harbour"
        },
        {
          id: "valdrada",
          label: "Back into Valdrada's reflection",
          endingId: "valdrada"
        },
        {
          id: "between",
          label: "Stay in the space between",
          endingId: "between"
        },
        {
          id: "lake-decides",
          label: "Let the lake decide",
          endingId: "lakeDecides"
        }
      ]
    }
  ];

  const endings = {
    harbour: {
      title: "The Harbour",
      paragraphs: [
        "You turn away from the mirrored city. The water still holds your outline, but you no longer wait for it to finish the gesture. Ahead is the permission to leave, a harbour.",
        "The docks rise in cold light. Steps shine with seaweed. No one here watches your reflection; they watch the horizon.",
        "A boat waits. You hear the scrape of a chain. The water does not mirror you. It simply carries you forward.",
        "You leave the mirrored city behind. What you carry now is the forward pull of the world."
      ]
    },
    valdrada: {
      title: "The Mirrored City",
      paragraphs: [
        "You return to the mirrored streets. The reflection moves with you immediately, relieved to recover what it had almost lost. Its attention sharpens, point by point. You realize the reflection has never copied you. It has been showing you what you avoid seeing.",
        "The city above you seems lighter now. <br>The city below grows stronger, as if it gains strength from your recognition. Every motion you make completes itself in the water with exact patience.",
        "You settle into the rhythm of the twin cities. Here, nothing slips out of sight, and nothing goes unanswered. You stay in the presence of your own outline, endlessly returned to you."
      ]
    },
    between: {
      title: "The Space Between",
      paragraphs: [
        "You choose neither city fully. You stay at the point where reflection and reality almost touch, but do not merge. The air and the water share the same quiet distance. You recognize a truth you’ve always known: you live most of your life in the in-between.",
        "The upper city loses a little weight. The lower one rises by the same amount. They meet in your field of vision like two halves that refuse symmetry.",
        "You remain between versions of yourself. Not choosing one, not refusing the other. The moment holds, so do you."
      ]
    },
    lakeDecides: {
      title: "The Lake's Choice",
      paragraphs: [
        "You step back and let the water choose. A ripple widens. The city waits, then shifts its answer toward you. <br>When the water chooses, you feel a strange relief.",
        "You follow the path the lake selects. The reflection moves with you, but now it seems less like a mirror and more like a guide.",
      ]
    }
  };

  // =========================
  // RENDER HELPERS
  // =========================

  function clearApp() {
    /* no clearing — we keep previous content */
  }

  function createSceneContainer() {
    const section = document.createElement("section");
    section.className = "scene dynamic-scene";

    const inner = document.createElement("div");
    inner.className = "scene-inner";

    section.appendChild(inner);
    return { section, inner };
  }

  // --------- Step rendering ---------

  function renderStep(stepIndex) {
    const step = steps[stepIndex];
    // clearApp();

    const { section, inner } = createSceneContainer();

    const promptEl = document.createElement("h2");
    promptEl.className = "prompt";
    promptEl.innerHTML = formatSentences(step.prompt);
    inner.appendChild(promptEl);

    const choiceGroup = document.createElement("div");
    choiceGroup.className = "choice-group";
    inner.appendChild(choiceGroup);

    step.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-option";
      btn.textContent = choice.label;

      btn.addEventListener("click", () => {
        choiceHistory[steps[stepIndex].id] = choice.id;

        handleChoice(stepIndex, choice, inner, choiceGroup);
      });

      choiceGroup.appendChild(btn);
    });

    app.appendChild(section);
    // Smoothly scroll so the start of the ending is fully visible
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChoice(stepIndex, choice, inner, choiceGroup) {
    // Remove choices after selection
    // choiceGroup.remove();
    choiceGroup.style.display = "none";

    const step = steps[stepIndex];

    // For seek + react: show short story + continue button
    if (step.id === "seek" || step.id === "react") {
      const storyBlock = document.createElement("div");
      storyBlock.className = "story-block";

      choice.story.forEach((line, index) => {
        const p = document.createElement("p");
        p.className = "story-text fade-in";
        p.style.animationDelay = `${0.3 * index}s`;
        p.innerHTML = formatSentences(line);
        storyBlock.appendChild(p);
      });

      inner.appendChild(storyBlock);

      const continueBtn = document.createElement("button");
      continueBtn.className = "choice-option continue-button";
      continueBtn.textContent = "Continue";
      continueBtn.addEventListener("click", () => {
        renderStep(stepIndex + 1);
      });
      inner.appendChild(continueBtn);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    // For final path step: go straight to ending
    if (step.id === "path") {
      renderEnding(choice.endingId);
    }
  }

  // --------- Ending rendering ---------

  function renderEnding(endingId) {
    const ending = endings[endingId];

    const section = document.createElement("section");
    section.className = "scene scene-ending scene-" + endingId;

    const inner = document.createElement("div");
    inner.className = "scene-inner";
    section.appendChild(inner);

    const titleEl = document.createElement("h2");
    titleEl.className = "ending-title";
    titleEl.textContent = ending.title;
    inner.appendChild(titleEl);

    // ==== Hybrid variant logic ====
    const seek = choiceHistory.seek;
    const react = choiceHistory.react;

    let variantLine = "";

    // SEEK influence
    if (seek === "clear-outline") {
      variantLine += "The outline you sought returns with a certain sincerity. <br>";
    } else if (seek === "softer-self") {
      variantLine += "A gentler version of yourself seems to walk beside you. <br>";
    } else if (seek === "break-pattern") {
      variantLine += "The need for interruption lingers.<br>";
    } else if (seek === "forget-original") {
      variantLine += "You feel the distance from your past widened.<br>";
    }

    // REACT influence
    if (react === "pulled") {
      variantLine += "A part of you still yearns for those who faithfully reflect your presence. <br>";
    } else if (react === "uneasy") {
      variantLine += "A vague unease crept in, <br>as though the reflection still lurked in the corner.<br>";
    } else if (react === "detached") {
      variantLine += "Your serene detachment settled comfortably.<br>";
    } else if (react === "unable") {
      variantLine += "You can still distinctly feel the pull of being understood.<br>";
    }

    // append paragraphs with fade-in
    ending.paragraphs.forEach((text, index) => {
      const p = document.createElement("p");
      p.className = "story-text fade-in";
      p.style.animationDelay = `${0.3 * index}s`;

      if (index === 1) {
        p.innerHTML = formatSentences(variantLine + text);
      } else {
        p.innerHTML = formatSentences(text);
      }

      inner.appendChild(p);
    });

    app.appendChild(section);

    // Add "back to home" button at the end
    const homeBtn = document.createElement("button");
    homeBtn.className = "choice-option continue-button";
    homeBtn.textContent = "back to home";
    homeBtn.style.marginTop = "40px";
    homeBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
    inner.appendChild(homeBtn);

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  // Start story on load
  renderStep(0);
});