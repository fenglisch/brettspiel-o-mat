/* eslint-disable no-shadow */
/* eslint-disable quotes */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

// atob() does not decode base64 to UTF-8, so characters like ä or ß would need to be replaced by regex functions
// Solution from https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

function createChecklist() {
  // eslint-disable-next-line no-undef
  arrCitiesAndIds.forEach((cityAndId) => {
    // Array is declared in survey-list.js
    const checkbox = document.createElement("input");
    checkbox.classList.add("cityCheckbox");
    checkbox.setAttribute("id", cityAndId[1]);
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", cityAndId[0]);
    const labelCheckbox = document.createElement("label");
    labelCheckbox.setAttribute("for", cityAndId[1]);
    labelCheckbox.textContent = cityAndId[1];
    const labelStartFrom = document.createElement("label");
    labelStartFrom.classList.add("label-start-from", "hidden");
    labelStartFrom.setAttribute("for", `${cityAndId[1]}-start-from`);
    labelStartFrom.textContent = "- ab*";
    const inputStartFrom = document.createElement("input");
    inputStartFrom.classList.add("input-start-from", "hidden");
    inputStartFrom.setAttribute("type", "text");
    inputStartFrom.setAttribute("id", `${cityAndId[1]}-start-from`);
    inputStartFrom.setAttribute("value", "GET ALL");
    document
      .querySelector(".selection")
      .append(checkbox, labelCheckbox, labelStartFrom, inputStartFrom);
  });
}

createChecklist();

const arrCityCheckboxes = document.querySelectorAll(".cityCheckbox");

function checkAll(trueOrFalse) {
  // eslint-disable-next-line no-return-assign
  arrCityCheckboxes.forEach((checkbox) => (checkbox.checked = trueOrFalse));
  document
    .querySelectorAll(".label-start-from")
    .forEach((label) =>
      label.classList[trueOrFalse ? "remove" : "add"]("hidden")
    );
  document.querySelectorAll(".input-start-from").forEach((input) => {
    input.classList[trueOrFalse ? "remove" : "add"]("hidden");
    if (!trueOrFalse) input.value = "GET ALL";
  });
}

document.querySelector("#check-all").addEventListener("click", () => {
  checkAll(true);
});
document.querySelector("#uncheck-all").addEventListener("click", () => {
  checkAll(false);
});

arrCityCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const inputStartFrom = document.querySelector(`#${checkbox.id}-start-from`);
    const labelStartFrom = document.querySelector(
      `[for="${checkbox.id}-start-from"]`
    );
    if (inputStartFrom.classList.contains("hidden")) {
      inputStartFrom.value = "GET ALL";
      inputStartFrom.classList.remove("hidden");
      labelStartFrom.classList.remove("hidden");
    } else {
      inputStartFrom.classList.add("hidden");
      labelStartFrom.classList.add("hidden");
    }
  });
});

let areInstructionsShown = false;

document.querySelector("#submit").addEventListener("click", (e) => {
  e.preventDefault();

  const arrStartFrom = [];
  document.querySelectorAll(".input-start-from").forEach((input) => {
    if (input.value !== "GET ALL") arrStartFrom.push(input.value);
    else arrStartFrom.push(null);
  });

  const arrCities = [];
  for (let i = 0; i < arrCityCheckboxes.length; i++) {
    const cityCheckbox = arrCityCheckboxes[i];
    if (cityCheckbox.checked) {
      arrCities.push({
        name: cityCheckbox.id,
        surveyId: +cityCheckbox.value,
        from: arrStartFrom[i],
      });
    }
  }

  const additionalSurveyIds = document.querySelector(
    "#additional-survey-ids"
  ).value;

  if (additionalSurveyIds) {
    const arrAdditionalSurveyIds = additionalSurveyIds.split(",");
    arrAdditionalSurveyIds.forEach((id) => {
      arrCities.push({ name: "Unbekannt", surveyId: +id });
    });
  }

  const paramsGetSessionKey = {
    method: "get_session_key",
    params: [
      document.querySelector("#username").value,
      document.querySelector("#password").value,
      "Authdb",
    ],
    id: 1,
  };
  const optionsGetSessionKey = {
    method: "POST",
    mode: "same-origin",
    body: JSON.stringify(paramsGetSessionKey),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(
    "https://mitwirk-o-mat.de/formular/index.php/admin/remotecontrol",
    optionsGetSessionKey
  )
    .then((responseGetSessionKey) => responseGetSessionKey.json())
    .then((responseGetSessionKey) => {
      const errorMessage = document.querySelector("#error-message");
      if (responseGetSessionKey.result.status) { // Invalid user name or password
        errorMessage.textContent = responseGetSessionKey.result.status;
        return;
      }
      errorMessage.textContent = "";
      const sessionKey = responseGetSessionKey.result;

      arrCities.forEach((city) => {
        const paramsExportResponses = {
          method: "export_responses",
          params: {
            sSessionKey: sessionKey,
            iSurveyID: city.surveyId,
            sDocumentType: "csv",
            sResponseType: "long",
          },
          jsonrpc: "2.0",
          id: 1,
        };
        const optionsExportResponses = {
          method: "POST",
          body: JSON.stringify(paramsExportResponses),
          dataType: "text",
          contentType: "application/json",
          mode: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch(
          "https://mitwirk-o-mat.de/formular/index.php/admin/remotecontrol",
          optionsExportResponses
        )
          .then((responseExport) => responseExport.json())
          .then((responseExport) => {
            function reformatWithRegex(csv) {
              if (city.from) {
                const entriesUntilFrom = new RegExp( // Has to be new RegExp, because you can't pass a variable into /this/
                  `(.|[\r\n])+?"${city.from}".*`, // Has to be (.|[\r\n]), because [\s\S] would only capture same line, not everything before as well
                  "gm"
                );
                csv = csv.replace(entriesUntilFrom, "");
              }

              csv = csv.split("\n"); // Split, delete first line (question codes), and re-join
              csv.splice(0, 1);
              csv = csv.join("\n");

             return csv
                .replace(/("Details";"[^"]*)";"([^"]*)/g, "$1<br><span id='detailsGrid'><span>Autor:innen</span><span>$2</span>")
                .replace(/("Details";"[^"]*)";"([^"]*)/g, "$1<span>Grafik</span><span>$2</span>")
                .replace(/("Details";"[^"]*)";"([^"]*)/g, "$1<span>Verlag</span><span>$2</span>")
                .replace(/("Details";"[^"]*)";"([^"]*)/g, "$1<span>Erschienen</span><span>$2</span></span>")
                .replace(/.+?(?="Abkürzung")/g, "") // Delete all the unwanted survey data like id oder timestamp
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"Ja";/g, "$1&#32;7 oder mehr,")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"(Nein|(N\/A|Nein))";/g, "$1")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"Ja";/g, "$1&#32;6,")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"(N\/A|Nein)";/g, "$1") 
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"Ja";/g, "$1&#32;5,")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";"[^"]*";)"(N\/A|Nein)";/g, "$1")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";)"Ja";/g, "$1&#32;3/4,")
                .replace(/("Details";"[^"]*";"[^"]*";"[^"]*";)"(N\/A|Nein)";/g, "$1")
                .replace(/("Details";"[^"]*";"[^"]*";)"Ja";/g, "$1&#32;2,")
                .replace(/("Details";"[^"]*";"[^"]*";)"(N\/A|Nein)";/g, "$1")
                .replace(/("Details";"[^"]*";)"Ja";/g, "$1&#32;Solo,")
                .replace(/("Details";"[^"]*";)"(N\/A|Nein)";/g, "$1")
                .replace(/("Details";"[^"]*)";/g, "$1<br><strong>Geeignet für:</strong>")
                .replace(/,"Link"/g,'";"Link"')
                .replace(/("Details";"[^<]*)(<span.*?<\/span><\/span>)([^"]*)/g,'$1$3$2')
                .replace(
                  /";"[{ ""title"":"""",""comment"":"""",""size"":""[0-9]+.[0-9]+"",""name"":""/g,
                  ""
                ) // Remove strings before and after logo file name
                .replace(
                  /"",""filename"":""fu_[a-z0-9]+"",""ext"":""(jpg|png|jpeg|gif)"" }]/g,
                  ""
                )
                .replace(
                  /data\/logos\/";"\[\]"/g,
                  'https://mitwirk-o-mat.de/blank.png"'
                ) // Insert placeholder for missing files
                .replace(
                  /(data\/logos\/";"")|(data\/logos\/";)/g,
                  'https://mitwirk-o-mat.de/blank.png"'
                )
                .replace(
                  /("Logo";".*?";)"\d";/gm,
                  "$1"
                ) // Delete filecount
                .replace(/.*"Abkürzung";"";"Name";"";"Details";"".*/g, "") // Delete (mostly) empty data sets
                .replace(/.*"";"";"";"";"";"";"";"";"".*/g, "")
                .replace(/(jpg"|JPG"|jpeg"|JPEG"|gif"|GIF"|"PNG")/g, 'png"') // Change all file extensions to .png
                .replace(/("data\/logos\/.+\.png")/g, (match) =>
                  match.toLowerCase()
                ) // Make all file names lower case
                .replace(/Details";"/g, 'Details";" ') // If the Detailss wouldn't start with a white space, the first letter would be visible before clicking on a result
                .replace(/(^")|("$)/g, "$temp$") // Replace all necessary quotes with temporary placeholders
                .replace(/";"/g, "$temp$;$temp$")
                .replace(/""/g, "&quot;") // Replace all unwanted quotes with HTML symbol
                .replace(/\$temp\$/g, '"') // Replace placeholders back with quotes
                .replace(/("[^"]*";"[^"]*";)/g, "$1\n") // Add line breaks after every second cell
                .replace(/^""/gm, '"99"') // Replace missing answer codes with skip value;
                .replace(/^\s*[\r\n]/gm, ""); // Remove empty lines
            }

            function generateNamesOnlyTxt(csvFull) {
              const namesOnly = csvFull
                .replace(/^(?!"Name").*/gm, "") // Remove all lines except for the name lines
                .replace(/^\s*[\r\n]/gm, "") // Delete empty lines
                .replace(/("Name";)/gm, "") // Delete the "name" string (or column)
                .replace(/^"([^"]*)";/gm, "$1"); // Delete quotes and semicolons
              return namesOnly;
            }

            function getTimestamp() {
              // For the names of the download files
              const date = new Date();
              const month =
                date.getMonth() + 1 > 9
                  ? date.getMonth() + 1
                  : `0${date.getMonth() + 1}`;
              const day =
                date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
              return `${date.getFullYear()}-${month}-${day}`;
            }

            if (responseExport.result.status) { // Permission denied
              errorMessage.textContent = `${responseExport.result.status} for ${city.name} (${city.surveyId}). Operation stopped.`;
              return;
            }

            const csvOriginal = b64DecodeUnicode(responseExport.result);

            console.log(csvOriginal);

            isResultShown = true;

            const csvFull = reformatWithRegex(csvOriginal);

            const linkFullCsv = document.createElement("a");
            linkFullCsv.setAttribute(
              "href",
              `data:text/plain;charset=utf-8,${encodeURIComponent(csvFull)}`
            );
            linkFullCsv.setAttribute(
              "download",
              `${getTimestamp()}_${city.name}_full.csv`
            );
            linkFullCsv.textContent = "Full CSV";

            const linkNamesOnly = document.createElement("a");
            linkNamesOnly.setAttribute(
              "href",
              `data:text/plain;charset=utf-8,${encodeURIComponent(
                generateNamesOnlyTxt(csvFull)
              )}`
            );
            linkNamesOnly.setAttribute(
              "download",
              `${getTimestamp()}_${city.name}_names-only.txt`
            );
            linkNamesOnly.textContent = "Names only";
            const rowTitle = document.createElement("p");
            rowTitle.textContent = `${city.name} (${city.surveyId})`;
            document
              .getElementById("download-area")
              .append(rowTitle, linkFullCsv, linkNamesOnly);
            if (!areInstructionsShown) {
              const instructionValidate = document.createElement("p")
              instructionValidate.textContent = 'Wenn die folgende Regex-Suche in jeder der "Full CSV"-Dateien keine Treffer ergibt, sollte alles stimmen:'
              const instructionValidateRegex = document.createElement("code");
              instructionValidateRegex.textContent = '^(?!"Abk|"Nam|"Mot|"Lin|"Log|"1"|"0"|"-1"|"99"|"###).*$'
              document.querySelector("body").append(instructionValidate, instructionValidateRegex)
              areInstructionsShown = true;
            }
          });
      });
    });
});
