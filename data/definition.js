const fileQuestions = "fragen.csv";

const intQuestions = 18;

const fileAnswers = "spiele.csv";

const intPartyLogosImgWidth = "100px";
const intPartyLogosImgHeight = "100px";

const descriptionShowOnStart = 1;

const descriptionHeading1 = "Brettspiel-O-Mat";

const descriptionHeading2 = "Spielerisch das passende Brettspiel finden";

const descriptionExplanation =
  "Beantworte die kurzen Fragen, um zu erfahren, welches Spiel aus meiner Sammlung am besten zu deinen Interessen passt!";
// 2023-01-19, FE: Anstatt des Impressums wird eine Datenschutzerklärung generiert und verlinkt, da diese beim Mitwirk-O-Mat eher gebraucht wird.
// 				   Variablen und IDs entsprechend umbenannt, Funktionen heißen noch "...imprint..."
// Änderungen in folgenden Dateien: definition.js, index.html, imprint.js (NEU: privacy.js), imprint.html (NEU: datenschutzhinweise.html), i18n_de.js,
// 									output.js, CSS-Datei

const privacyLink = "system/datenschutzhinweise.html";

const privacyTitle = "Datenschutzhinweise zum Mitwirk-O-Mat Varel";

const privacyGeneral = `<p>Im Rahmen der Nutzung des Mitwirk-O-Mat werden einige personenbezogene Daten an die Firma wechange eG, c/o Thinkfarm, Oberlandstraße 26-35, 12099 Berlin, https://wechange.de/cms/impressum/ übermittelt. Wir beachten dabei die gesetzlichen Vorgaben und schließen mit den Empfängern Ihrer Daten insbesondere entsprechende Verträge bzw. Vereinbarungen ab, die dem Schutz Ihrer Daten dienen.</p>
<p>Für die Funktion des Mitwirk-O-Mat binden wir einen Inlineframe der wechange eG ein, der auf die URL https://mitwirk-o-mat.de/lagfa-nds/varel/mom/ umleitet. Dabei verarbeitet die wechange eG die durch den Inlineframe erzeugten personenbezogenen Daten auf Web-Servern in Deutschland. Die Einbindung setzt immer voraus, dass die Drittanbieter dieser Inhalte die IP-Adresse der Nutzer verarbeiten, da sie ohne die IP-Adresse die Inhalte nicht an deren Browser senden könnten. Die IP-Adresse ist damit für die Darstellung dieser Inhalte oder Funktionen erforderlich. Beim Laden des Inlineframe der Firma wechange eG werden keine Cookies verwendet.</p>
<p>Wenn Sie den Mitwirk-O-Mat aufgerufen haben, setzt die wechange eG zur bedarfsorientierten Bereitstellung und zur Optimierung der Funktionen das Webanalyse-Tool „Matomo“ ein. Matomo hilft dabei, anonyme Nutzungsinformationen zu statistischen Zwecken auszuwerten. Folgende Informationen werden dabei erfasst:</p>
<ul>
<li>IP-Adresse</li>
<li>Referrer-URL</li>
<li>Ausgehende Verweise</li>
<li>Verweildauer</li>
<li>Informationen, die von Ihrem Endgerät übermittelt werden (Betriebssystem, Bildschirmauflösung, Browser, Spracheinstellung des Browsers)</li>
</ul>
<p>Bei der IP-Adresse werden die zwei letzten Oktette maskiert. Hierdurch ist eine Zuordnung zu Ihrem Endgerät nicht mehr möglich.</p>
<p>Die Software ist auf dem Webserver der wechange eG eingebunden. Eine Datenweitergabe findet nicht statt. Es werden keine Cookies gesetzt.</p>
<p>Wenn Sie mit der anonymen Verarbeitung und Auswertung der Daten aus Ihrer Nutzung nicht einverstanden sind, können Sie diese in den meisten Browsern unterbinden, etwa durch eine Do-Not-Track-Option oder durch Surfen in einem privaten Modus; auch verhindern aktive AdBlocker oder das Deaktivieren von JavaScript für Ihren Browser eine Erfassung durch Matomo.</p>
<p>Ihre Antworten auf die Fragen des Mitwirk-O-Mat werden lediglich in Ihrem Browser gespeichert und verarbeitet. Die Berechnung des Rankings erfolgt also auf Ihrem Gerät. Hierzu werden keine Daten an unseren Server weitergeleitet.<p>

<!-- DEN FOLGENDEN ABSCHNITT LÖSCHEN, FALLS DAS STATISTIK-MODUL N I C H T AKTIVIERT IST -->

<p>Nachdem Sie die Fragen beantwortet haben und bevor Ihr individuelles Ranking angezeigt wird, haben Sie jedoch die Möglichkeit, der anonymisierten Übertragung Ihrer Antwortdaten zuzustimmen. Sofern Sie Ihre Zustimmung geben, werden das Datum (nicht der exakte Zeitstempel), Ihre Antworten auf die Fragen und das sich daraus ergebende persönliche Ranking an den Server der wechange eG gesendet und in einer Datenbank gespeichert. Ihre IP-Adresse wird mit diesen Daten nicht gespeichert. Daher ist es nicht möglich, die Antworten einzelnen Nutzern zuzuordnen.</p>
<p>Der Zweck der Datenspeicherung ist die statistische Auswertung, aus der wir und die wechange eG Rückschlüsse darauf ziehen können, wie beliebt der Mitwirk-O-Mat ist, welche Interessen unter den Nutzern wie stark ausgeprägt sind und wie gut die Fragen für den Mitwirk-O-Mat geeignet sind.</p>
<p>Hinweise zu Rechtsgrundlagen: Sofern wir die Nutzer um deren Einwilligung in den Einsatz der statistischen Auswertung bitten, ist die Rechtsgrundlage der Verarbeitung von Daten Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ansonsten werden die Daten der Nutzer auf Grundlage unserer berechtigten Interessen (d. h. Interesse an effizienten, wirtschaftlichen und empfängerfreundlichen Leistungen) verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).</p>`;

const separator = ";";

const design = ["brettspiele.css"];

const addons = [
  "extras/addon_check_iframe_resize_client.js",
  "extras/addon_custom_voting_buttons.js",
  "extras/addon_results_textfilter_by_button.js",
  "extras/addon_tooltips.js",
  "extras/addon_show_first_results.js"
];

const language = "de";

const statsRecord = 0;
const statsServer = "extras/statistics/vote_db.php";
