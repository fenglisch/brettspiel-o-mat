/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

const CUSTOM_POSITION_BUTTONS = [
  {
    questionNr: 1,
    btnPro: "Einstiegsfreundlich<br><small>(Familienspiel)</small>",
    iconPro: "Leicht",
    btnNeutral: "Fortgeschritten<br><small>(Kennerspiel)</small>",
    iconNeutral: "Mittel",
    btnContra: "Für Geübte<br><small>(Expertenspiel)</small>",
    iconContra: "Schwer",
  },
  {
    questionNr: 2,
    btnPro: "Maximal 45&nbsp;min",
    iconPro: "<&nbsp;45&nbsp;min",
    btnNeutral: "45&nbsp;min&nbsp;&ndash;&nbsp;2&nbsp;h",
    iconNeutral: "45&nbsp;min&nbsp;-&nbsp;2&nbsp;h",
    btnContra: "Mehr als 2&nbsp;h",
    iconContra: ">&nbsp;2&nbsp;h",
  },
];

window.addEventListener("load", () => {
  const arQuestionsToCustomize = [];
  for (i = 0; i < CUSTOM_POSITION_BUTTONS.length; i++) {
    arQuestionsToCustomize.push(CUSTOM_POSITION_BUTTONS[i].questionNr);
  }

  const colVoteDouble = document.querySelector("#votingDouble").parentNode;
  const votingPro = document.querySelector("#votingPro");
  const votingNeutral = document.querySelector("#votingNeutral");
  const votingContra = document.querySelector("#votingContra");

  const observerQuestion = new MutationObserver(fnCustomVotingButtons);
  observerQuestion.observe(document.querySelector("#showQuestionsQuestion"), {
    childList: true,
  });

  function fnCustomVotingButtons() {
    document
      .querySelector("#sectionShowQuestions")
      .setAttribute("data-question-number", activeQuestion); // To add custom CSS, if needed

    CUSTOM_POSITION_BUTTONS.forEach((obj) => {
      const cell = document.querySelector(`#jumpToQuestionNr${obj.questionNr}`);
      if (cell.style.backgroundColor.startsWith("var")) {
        cell.style.backgroundColor = "var(--secondary-color)";
        cell.querySelector("a").style.color = "#000";
      }

      if (activeQuestion + 1 === obj.questionNr) {
        colVoteDouble.classList.add("d-none");
        document.querySelector("#votingDouble").click();
        votingPro.innerHTML = obj.btnPro;
        votingNeutral.innerHTML = obj.btnNeutral;
        votingContra.innerHTML = obj.btnContra;
      } else if (!arQuestionsToCustomize.includes(activeQuestion + 1)) {
        votingPro.innerHTML = TEXT_VOTING_PRO;
        votingNeutral.innerHTML = TEXT_VOTING_NEUTRAL;
        votingContra.innerHTML = TEXT_VOTING_CONTRA;
        colVoteDouble.classList.remove("d-none");
      }
    });

    // This does not belong here
    // TO DO: Move to separate addon
    if (activeQuestion >= 5) {
      const questionPrefix = document.createElement("p");
      questionPrefix.textContent =
        "Spiele mit dieser Mechanik klingen so, als könnten sie mir gut gefallen";
      questionPrefix.classList.add("questionPrefix");
      document
        .querySelector(".card-header")
        .insertBefore(
          questionPrefix,
          document.querySelector(".card-header h2")
        );
    }
  }

  const observerResults = new MutationObserver(fnCustomPositionButtons);
  observerResults.observe(document.querySelector("#resultsHeading"), {
    childList: true,
  });

  function fnCustomPositionButtons() {
    CUSTOM_POSITION_BUTTONS.forEach((obj) => {
      const number = obj.questionNr - 1;
      // Fragen sind bereits doppelt gewichtet, soll nicht geändert werden
      document.querySelector(`#doubleIcon${number}`).classList.add("d-none");

      // Ausgangszustand der Buttons (also vor dem nachträglichen Ändern) anpassen
      // Erstelle einen Array mit allen Party und Self Position Buttons
      const arPositionButtons = document.querySelectorAll(
        `#resultsByThesisAnswersToQuestion${number} button,
         .partyPositionToQuestion${number},
         .selfPosition${number}`
      );
      arPositionButtons.forEach((btn) => {
        if (btn.classList.contains("btn-success")) btn.innerHTML = obj.iconPro;
        else if (btn.classList.contains("btn-warning"))
          btn.innerHTML = obj.iconNeutral;
        else if (btn.classList.contains("btn-danger"))
          btn.innerHTML = obj.iconContra;
      });

      const observerPositionButtons = new MutationObserver(
        fnToggleSelfCustomPosition
      );

      document.querySelectorAll(`.selfPosition${number}`).forEach((button) => {
        observerPositionButtons.observe(button, {
          attributes: true,
          attributeFilter: ["class"],
        });
      });

      function fnToggleSelfCustomPosition(arMutation) {
        arMutation.forEach((mutation) => {
          const button = mutation.target;
          if (button.classList.contains("btn-success"))
            button.innerHTML = obj.iconPro;
          else if (button.classList.contains("btn-warning"))
            button.innerHTML = obj.iconNeutral;
          else if (button.classList.contains("btn-danger"))
            button.innerHTML = obj.iconContra;
        });
      }
    });
  }

  const stylesheet = document.createElement("style");
  stylesheet.setAttribute("id", "customVotingButtonsCSS");
  CUSTOM_POSITION_BUTTONS.forEach((obj) => {
    stylesheet.textContent += `
    #jumpToQuestionNr${obj.questionNr} a {
      font-weight: 400 !important;
    }

    .selfPosition${obj.questionNr - 1}:not(.btn-default),
    .partyPositionToQuestion${obj.questionNr - 1}:not(.btn-default) {
      background-color: var(--secondary-color) !important;
    }`;
  });
  document.head.appendChild(stylesheet);
});
