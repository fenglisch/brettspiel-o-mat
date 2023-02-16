///////////////////////////////////////////////////////////////////////
// DEFINITIONEN *** DEFINITIONS
// http://www.mat-o-wahl.de

// FUNKTION / FUNCTION
// * Liest ein DATA-Tag aus der CSV-Beschreibung aus, liest dann eine JSON-API aus und erstellt schließlich ein Modal-Popup  
// * Reads a DATA-Tag from the description in the CSV-file, then requests a JSON-API, and finally creates a modal-popup.


// 1.) Allgemeine Angaben
// General Settings

// Zeige einen Button für den Kontakt an? Ja/Nein? 1/0?
const AE_CONTACT_ACTIVE_EMAIL = 1
const AE_CONTACT_ACTIVE_TEL = 1	// ohne Funktion - nicht eingebaut

// Beschriftung der Buttons - im Modal-Popup - immer
const AE_CONTACT_BUTTON_EMAIL = "Kontakt aufnehmen"
const AE_CONTACT_BUTTON_TEL = "Ruf uns an!"	// ohne Funktion - nicht eingebaut

// E-Mailadresse und Telefonnummer - im Modal-Popup (Rückfall-Lösung, falls keine Adresse der Initiative vorhanden ist)
const AE_CONTACT_ADDRESS_EMAIL = "info@agenda-varel.de"
const AE_CONTACT_ADDRESS_TEL = "+49123456789"	// ohne Funktion - nicht eingebaut

// Hinweistexte über den Buttons mit dem Name des Angebots 
const AE_TEXT_OFFERS_NONE = ""
const AE_TEXT_OFFERS_SOME = "<p><strong>Aktuell gibt es folgende Engagement-Angebote:</strong>"

// Hinweistext falls gar keine Informationen zum Angebot vorhanden sind (passiert manchmal, da ist nur der Titel)
let AE_TEXT_OFFER_NO_INFORMATION = "<p><em> Zu diesem Angebot sind keine weiteren Informationen hinterlegt. Nimm Kontakt auf, um mehr zu erfahren.</em></p>"

// E-Mail-BETREFF für die Kontaktaufnahme - aktiv NUR bei Initiativen ##### MIT Angeboten %%%%%
// 1. - wenn ein DATA-EMAIL-Tag in der CSV-Datei vorhanden ist.
let AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_DATATAG  = "[Mitwirk-O-Mat] - Interesse am Angebot %%%%%"
// 2. - Rückfall-Lösung falls kein DATA-EMAIL-Tag in der CSV angegeben wurde.
let AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_DEFAULT  = '[Mitwirk-O-Mat] Interesse am Angebot "%%%%%" des Vereins "#####"'


// E-Mail-INHALT für die Kontaktaufnahme - aktiv NUR bei Initiativen ##### MIT Angeboten %%%%%
// 1. - wenn ein DATA-EMAIL-Tag in der CSV-Datei vorhanden ist.
let AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_DATATAG = "Guten Tag, \n\nich habe eben den Mitwirk-O-Mat ausgefüllt. Folgendes Angebot von euch hat dabei besonders mein Interesse geweckt: %%%%% \n \n\nIch würde gerne mehr darüber erfahren, wie ich mich bei euch engagieren kann. Bitte schreibt mir doch mal oder ruft mich an.\n\n\nViele Grüße" 
// 2. - Rückfall-Lösung falls kein DATA-EMAIL-Tag in der CSV angegeben wurde.
let AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_DEFAULT = "Guten Tag, \n\n\nich habe eben den Mitwirk-O-Mat auf eurer Website ausgefüllt. Folgendes Angebot hat dabei besonders mein Interesse geweckt: %%%%% (#####)\n\nBitte schreibt mir doch mal, sodass ich mehr über dieses Angebot sowie über weitere lokale Engagement-Möglichkeiten erfahren kann. \n\n\nViele Grüße"


// ohne Funktion - nicht eingebaut
const AE_CONTACT_TEXT_TEL = ""

// Adresse der API 
const AE_JSON_URL = "https://mitwirk-o-mat.de/freinet/?eid="
// const AE_JSON_URL = "https://mat-o-wahl.de/temp/2022-10-freinet/freinet/?eid="


// EXTRAWUNSCH:
// https://freinet-online.de/portal/visits_api.php?img=1&portalId=78&agencyId={OfferAgencyID}&offerId={OfferId}&count_typ=201
// https://freinet-online.de/portal/visits_api.php?img=1&portalId=78&agencyId=1156&offerId=27271&count_typ=201


// 2.) In der DEFINITION.JS in den Erweiterten Einstellungen das Add-On eintragen.
// Add the add-on to the advanced settings in DEFINITION.JS
// var addons = ["extras/addon_angebote+einrichtungen.js"]

// 3.) Fertig. 
// That's it.


///////////////////////////////////////////////////////////////////////  


// Hier kommt nur noch Quellcode. Bitte gehen Sie weiter. Hier gibt es nichts zu sehen.
// That's just source code. Please move on. Nothing to see here.


///////////////////////////////////////////////////////////////////////


// Popup-Fenster / Bootstrap-Modal als Variable hinterlegt
const MODAL_POPUP = `
		<div class="modal fade" id="modalAngebote" tabindex="-1" role="dialog" aria-labelledby="modalAngeboteLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
				
					<div class="modal-header" id="modalAngeboteLabel">
						<div id="modalAngeboteLabelIntern">
							<!-- hier darunter erscheinen später die Überschriften <H5> mit der ID "modalTitleAngebot12345" -->
						</div>
						
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					
					<div class="modal-body" id="modalAngeboteBody">
					  <!-- hier darunter erscheinen später die DIVS mit den Angeboten mit der ID "modalBodyAngebot12345" --> 
					  
					</div>
					
					<div class="modal-footer" id="modalAngeboteFooter">
						<button type="button" id="modalAngeboteButtonNo" class="btn btn-outline-dark" data-dismiss="modal">Schlie&szlig;en</button>
						<div id="modalAngeboteFooterIntern">
							<!-- hier darunter erscheinen später die KONTAKT-BUTTONS mit der ID "modalFooterAngebot12345" -->
						</div>
					</div>
				</div>
			</div>
		</div> `


// MutationObserver starten - prüft Änderungen im DOM
// https://medium.com/better-programming/js-mutationobserver-1d7aed479da2
// https://developer.mozilla.org/de/docs/Web/API/MutationObserver
function mow_addon_angebote_einrichtungen_MutationObserver() {

	// zu überwachende Zielnode (target) auswählen
	var target = document.querySelector('#resultsHeading');
	 
	// eine Instanz des Observers erzeugen und Callback-Funktion aufrufen
	var observer = new MutationObserver(mow_addon_angebote_einrichtungen_start)
	 
	// Konfiguration des Observers: alles melden - Änderungen an Daten, Kindelementen und Attributen
	var config = { 
		attributes: true, 
		childList: true, 
		subtree: true };
	 
	// eigentliche Observierung starten und Zielnode und Konfiguration übergeben
	observer.observe(target, config);
	 
	// später: Observation wieder einstellen
	// observer.disconnect();
}




// Buttons in Addon-DIV in INDEX.HTML schreiben
function mow_addon_angebote_einrichtungen_start() {

	// id "#resultsHeading" wird in fnStart() am Anfang geleert (empty()).
	// -> mutationObserver erkennt Änderung und aktiviert diese Funktion :(
	// -> prüfen, ob Inhalt in DIV existiert 
	resultsHeadingContent = $("#resultsHeading").text()

	if (!resultsHeadingContent) {
		// nix. Noch keine Ergebnisse im DIV
	}
	// schreibe Kontakt-Buttons
	else {


		// einen Platz für das Modal-Popup bereitstellen
		// Das kann irgendwo sein. Hier kommt es eben nach dem Footer. 
		let element_footer = document.getElementById("sectionFooter")
		element_footerDiv = document.createElement('div');
		element_footerDiv.innerHTML = MODAL_POPUP;
		element_footer.after(element_footerDiv);


		// Bereite eine leere Zeile <div class='row'> unter "#resultsShortPartyX" vor. Dort werden die Angebote später eingefügt.
		for (let i = 0; i <= (intParties-1); i++)
		{
			let partyNum=arSortParties[i];				
			
			// Richtige Nummer der Partei wurde gefunden.
			// Nun eine neue ROW-Zeile hinter der Ergebniszeile #resultsShortPartyX einfügen.
			// So ist die Zeile bereits im DOM, wenn sie später benötigt wird. 
			let element_resultsShortParty = document.getElementById("resultsShortParty"+partyNum)
			
			let element_resultsShortPartyAddonRow = document.createElement('div');
			element_resultsShortPartyAddonRow.setAttribute("class", "row"); // Bootstrap ROW-Klasse vergeben
			element_resultsShortPartyAddonRow.setAttribute("id", "resultsShortPartyAddonAngeboteEinrichtungen"+partyNum+""); // ID vergeben
			element_resultsShortParty.after(element_resultsShortPartyAddonRow)	
		} // end: for-intParties



		// Starte die Suche nach dem DATASET mit Wert XYZ im <SPAN>
		// und schreibe dann die Kontakt-Buttons 
		mow_addon_angebote_einrichtungen_search_dataTag_in_partyDescritpion()

		// Klick-Funktion auf die gesamte Ergebnis-Zeile legen und am Anfang ausblenden
		mow_addon_angebote_einrichtungen_add_click_on_row()

	} // end: else

}





// Starte die Suche nach dem DATASET mit Wert XYZ im <SPAN>
// und schreibe dann die Kontakt-Buttons 
function mow_addon_angebote_einrichtungen_search_dataTag_in_partyDescritpion() {
	
		// console.log("Suche nach DATA-Tag")	
	
		// gehe durch das CSV-Array und schreibe Inhalt
		for (let j = 0; j <= (intParties-1); j++)
		{
			let partyNum=arSortParties[j];	

			// Das DATASET mit der ID befindet sch in der Beschreibung der Partei (im CSV-Array)
			let partyDescription = arPartyDescription[partyNum]
						
			// Die Zeichenkette aus dem CSV-Array in ein HTML-Objekt umwandeln, so dass man später damit arbeiten kann.   
			let partyDescriptionHTML = stringToHTML(partyDescription)	
			
			// Alle Vorkommen von <span> im neuen HTML-Objekt suchen
			let arSpanTags = partyDescriptionHTML.getElementsByTagName("span")

			// Alten "ID-Zähler" löschen, falls die neue SPAN-Zeile keine Informationen enthält. 
			// So dass die alte ID in der folgenden FOR-Schleife nicht mitgeschleppt wird.			
			let dataEinrichtungsIdFound = false
			let dataEmailFound = false

			let dataEinrichtungsId = "";
			let dataEmail = "";

			// Die DATA-Tags müssen getrennt gesucht werden, da sonst nur der letzte Wert in der FOR-Schleife gespeichert wird. :( 
			// 1. Suche nach EINRICHTUNGSID			
			for (let k = 0; k <= arSpanTags.length-1; k++) {

				// suche nach DATA-XYZ
				dataEinrichtungsId = arSpanTags[k].dataset.einrichtungsid
				
				if (dataEinrichtungsId) {	
					dataEinrichtungsIdFound = true;
					k = arSpanTags.length; // FOR-Schleife beenden 	
					} 
				else 
					{	} // end: if-else (einrichtungsid)
			
			} // end: for-arSpanTags

			// 2. Suche nach E-MAIL
			for (let k = 0; k <= arSpanTags.length-1; k++) {

				// suche nach DATA-XYZ
				dataEmail = arSpanTags[k].dataset.email
				
				if (dataEmail) {	
					dataEmailFound = true;
					k = arSpanTags.length; // FOR-Schleife beenden
					}
				else 
					{	} // end: if-else (dataEmail)
			
			} // end: for-arSpanTags
			
			



			// Fehlerbehandlung: Wenn KEIN DATA-Tag gefunden wurde, einen Hinweis ausgeben.
			if (!dataEinrichtungsIdFound) {
				
				// Einen neuen DIV mit Bootstrap-Klasse COL erstellen und einen Hinweistext ausgeben
				let element_resultsShortPartyAddonCol_No_Offer = document.createElement('div');	
				element_resultsShortPartyAddonCol_No_Offer.setAttribute("class", "col text-center"); // Bootstrap COL-Klasse vergeben
				element_resultsShortPartyAddonCol_No_Offer.innerHTML += AE_TEXT_OFFERS_NONE;
				
		 		// Inhalte ins DOM schreiben
				let element_resultsShortPartyAddonAngeboteEinrichtungen = document.getElementById("resultsShortPartyAddonAngeboteEinrichtungen"+partyNum)
				element_resultsShortPartyAddonAngeboteEinrichtungen.appendChild(element_resultsShortPartyAddonCol_No_Offer)

				
			} // end: if (!einrichtungsIdGefunden)
			else {

			// console.log("j: "+j+" partyNum: "+partyNum+" ID: "+dataEinrichtungsId+" E-Mail: "+dataEmail)
			// JSON-Abfrage und dann Inhalte schreiben

				mow_addon_angebote_einrichtungen_JSON_API_request(partyNum, dataEinrichtungsId, dataEmail)
			}
						
		} // end: for intParties
	
	
} // end: mow_addon_angebote_einrichtungen_search_dataTag_in_partyDescritpion()



// Abfrage der JSON-API
// Danach wird das Ergebnis an die nächste Funktion übergeben
async function mow_addon_angebote_einrichtungen_JSON_API_request(partyNum, dataEinrichtungsId, dataEmail) {

// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
// https://github.com/mdn/learning-area/blob/main/javascript/oojs/json/heroes-finished.html

	console.log("Mitwirk-o-Mat: JSON-Abfrage für Einrichtungs-ID "+dataEinrichtungsId+" ausführen.")

   // const requestURL = 'http://localhost/standard/freinet/?eid='+dataEinrichtungsId;
   const requestURL = AE_JSON_URL+dataEinrichtungsId;
   const request = new Request(requestURL);

   const response = await fetch(request);
   const jsonData = await response.json();

	
	mow_addon_angebote_einrichtungen_write_buttons_to_dom(jsonData, partyNum, dataEinrichtungsId, dataEmail);
   
}


// Ergebnis der JSON-Abfrage ins DOM schreiben
function mow_addon_angebote_einrichtungen_write_buttons_to_dom(jsonData, partyNum, dataEinrichtungsId, dataEmail) {

	// Einen neuen DIV mit Bootstrap-Klasse COL erstellen (immer) ... 
	let element_resultsShortPartyAddonCol_Offer = document.createElement('div');
	element_resultsShortPartyAddonCol_Offer.setAttribute("class", "col text-center freinet-container"); // Bootstrap COL-Klasse vergeben
 
 	// ... und einen Hinweistext ausgeben WENN auch Angebote gefunden wurden (IF Angebote > 0)
 	// Es kann nämlich sein, dass eine Einrichtungs-ID im DATA-Tag angegeben wurde aber kein Angebot in der JSON-API hinterlegt ist.
 	if (jsonData.angebote.length > 0) {
		element_resultsShortPartyAddonCol_Offer.innerHTML += AE_TEXT_OFFERS_SOME;
	}
	else {
		element_resultsShortPartyAddonCol_Offer.innerHTML += AE_TEXT_OFFERS_NONE;
	}


	// Titel-Element des MODAL-Popups finden
	var element_modalAngeboteLabel = document.getElementById("modalAngeboteLabelIntern")
	// Inhalts-Element des MODAL-Popups finden
	var element_modalAngeboteBody = document.getElementById("modalAngeboteBody")
	// Footer-Element des MODAL-Popups finden
	var element_modalAngeboteFooter = document.getElementById("modalAngeboteFooterIntern")

	// JSON-Objekte durchlaufen
   const angebote = jsonData.angebote;
   for (const angebot of angebote) {
   	
   	// console.log("eId: "+dataEinrichtungsId+" - Anzahl Angebote: "+angebote.length)

		// Button mit Titel des Angebots und ONCLICK-Funktion (für Modal-Popup) unter Ergebnis-Zeile schreiben
		element_resultsShortPartyAddonCol_Offer.innerHTML += `
					<button type="button" onclick="mow_addon_angebote_einrichtungen_modalInhalte_Einblenden_Ausblenden(${angebot.angebotID})" class="btn btn-primary" data-toggle="modal" data-target="#modalAngebote"> ${angebot.angebotName} </button>`;

		// Titel-Element des MODAL-Popups bearbeiten
		element_modalAngeboteLabel.innerHTML += ` <h5 class="modal-title" id="modalTitleAngebot${angebot.angebotID}"> ${angebot.angebotName} </h5>`


		// Inhalts-Element des MODAL-Popups bearbeiten - Vorbereitung
		// Hier werden die einzelnen Elemente der JSON-Abfrage geprüft.
		// Wenn ein Eintrag leer ist, kommt ein leerer String zurück.
		// Ansonsten wird es angezeigt.
		let angebot_Beschreibung 		= mow_addon_angebote_einrichtungen_JsonErgebnisse_auf_Inhalt_pruefen("Beschreibung", angebot.Beschreibung)
		let angebot_ZeitlicherRahmen 	= mow_addon_angebote_einrichtungen_JsonErgebnisse_auf_Inhalt_pruefen("Zeitlicher Rahmen", angebot.ZeitlicherRahmen)
		let angebot_Anforderungen 		= mow_addon_angebote_einrichtungen_JsonErgebnisse_auf_Inhalt_pruefen("Anforderungen", angebot.Anforderungen)
		let angebot_Leistungen 			= mow_addon_angebote_einrichtungen_JsonErgebnisse_auf_Inhalt_pruefen("Leistungen", angebot.Leistungen)
		let angebot_keine_Zusatzinformationen = ""

		// ... und noch eine letzte Sicherheitsabfrage, falls eine Initiative gar keine Informationen zur Verfügung gestellt hat,
		// wird wenigstens ein Hinweis angezeigt, dass nichts zu sehen ist.
		if ( (angebot_Beschreibung == "") && (angebot_ZeitlicherRahmen == "") && (angebot_Anforderungen == "") && (angebot_Leistungen == "") ) 
			{ 
				// console.log(`Keine extra Angaben bei Angebot: ${angebot.angebotName}`)
				angebot_keine_Zusatzinformationen = AE_TEXT_OFFER_NO_INFORMATION;
			}


		// Inhalts-Element des MODAL-Popups bearbeiten - Daten schreiben
		// Das erfolgt in einem Rutsch (<div> ... </div>) weil sonst der Browser das abschließende </div> selbst setzt. 
		element_modalAngeboteBody.innerHTML += ` <div id="modalBodyAngebot${angebot.angebotID}"> 
				${angebot_Beschreibung} 
				${angebot_ZeitlicherRahmen}
				${angebot_Anforderungen}
				${angebot_Leistungen}
				${angebot_keine_Zusatzinformationen}
				</div>`;

		// Schreibe den Kontakt-Button, falls gewünscht
		if (AE_CONTACT_ACTIVE_EMAIL > 0) {

			// Variablen definieren			
			let AE_CONTACT_ADDRESS_EMAIL_Current
			let AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_Current
			let AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_Current
			 
			// WENN eine E-Mailadresse im DATA-Tag gefunden wurde, benutzte diese ...
			if (dataEmail) {
				AE_CONTACT_ADDRESS_EMAIL_Current = mow_addon_angebote_einrichtungen_validate_email_address(dataEmail);
				// Ersetze "#####" bzw. "%%%%%" in der Betreffzeile und im E-Mailinhalt mit dem Namen der Initiative bzw. des Angebots 
				AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_Current = fnTextErsetzen(AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_DATATAG, ""+arPartyNamesLong[partyNum]+"",""+angebot.angebotName+"");
				AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_Current 	= fnTextErsetzen(AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_DATATAG, ""+arPartyNamesLong[partyNum]+"",""+angebot.angebotName+"");
			}
			// ansonsten benutzte die Standard-Daten vom Anfang dieser Datei (oben).
			else {
				AE_CONTACT_ADDRESS_EMAIL_Current = mow_addon_angebote_einrichtungen_validate_email_address(AE_CONTACT_ADDRESS_EMAIL);
				// Ersetze "#####" bzw. "%%%%%" in der Betreffzeile und im E-Mailinhalt mit dem Namen der Initiative bzw. des Angebots
				AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_Current = fnTextErsetzen(AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_DEFAULT, ""+arPartyNamesLong[partyNum]+"",""+angebot.angebotName+"");
				AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_Current 	= fnTextErsetzen(AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_DEFAULT, ""+arPartyNamesLong[partyNum]+"",""+angebot.angebotName+"");
			}

			
			// Daten ins DOM schreiben
			element_modalAngeboteFooter.innerHTML += ` <div id="modalFooterAngebot${angebot.angebotID}"> 
				<a href="mailto:${AE_CONTACT_ADDRESS_EMAIL_Current}subject=${AE_CONTACT_SUBJECT_EMAIL_OFFERS_SOME_Current}&amp;body=${AE_CONTACT_TEXT_EMAIL_OFFERS_SOME_Current}" role="button" class="btn btn-success" target="_blank" rel=noopener noreferrer>${AE_CONTACT_BUTTON_EMAIL}</a>
				</div>`
		}
		else {
			// Leeren Inhalt schreiben, der in "modalInhalteEinblendenAusblenden()" durchlaufen werden kann
			element_modalAngeboteFooter.innerHTML += ` <div id="modalFooterAngebot${angebot.angebotID}"></div> `;
		}
	} // end: for JSON-angebote
 
 		// Inhalte ins DOM schreiben
	let element_resultsShortPartyAddonAngeboteEinrichtungen = document.getElementById("resultsShortPartyAddonAngeboteEinrichtungen"+partyNum)
	element_resultsShortPartyAddonAngeboteEinrichtungen.appendChild(element_resultsShortPartyAddonCol_Offer)
 
} // end: mow_addon_angebote_einrichtungen_write_buttons_to_dom()



// In der Funktion "fnJsonErgebnisseSchreiben()" wurden alle Ergebnisse in das Modal-Popup geschrieben. (weil man sowieso schon alles eingelesen hatte!)
// Hier wird nun nach der ANGEBOTS-ID gefiltert und nur das entspr. Angebot eingeblendet.
function mow_addon_angebote_einrichtungen_modalInhalte_Einblenden_Ausblenden(angebotsID) {
	// console.log(angebotsID)

	// Suche den TITLE-Teil des Modals
	divModalTitle = document.getElementById("modalAngeboteLabel");
	// Finde alle "MODAL-TITLE"-Klassen unterhalb des Modal-Titels		
	divModalTitleClasses = divModalTitle.getElementsByClassName("modal-title");


	// Suche den BODY-Teil des Modals (übergeordnet)
	// divModalBody = document.getElementById("modalAngeboteBody");
	// Finde alle DIVs unterhalb des Modal-Bodys		
	// divModalBodyDivs = divModalBody.getElementsByTagName("div");
	divModalBodyDivs = document.querySelectorAll('[id^=modalBodyAngebot]');


	// Suche den FOOTER-Teil des Modals
	divModalFooter = document.getElementById("modalAngeboteFooterIntern");
	// Finde alle DIVs unterhalb des Modal-Footer
	divModalFooterDivs = divModalFooter.getElementsByTagName("div");
	
	// console.log("Anzahl divModalTitleClasses: "+divModalTitleClasses.length+" divModalBodyDivs: "+divModalBodyDivs.length+" divModalFooterDivs: "+divModalFooterDivs.length)
	
	// Alle Klassen "modal-title" unterhalb von "#divModalTitle" wurden gezählt und nun durchlaufen 
   for (i = 0; i <= divModalTitleClasses.length-1; i++) {
   	
   	// ID des DIV auslesen
   	divModalBodyDivsId = divModalBodyDivs[i].id
   	
		// Wenn die ID übereinstimmt, DIV einblenden ...
		if (divModalBodyDivsId == "modalBodyAngebot"+angebotsID) {
			divModalBodyDivs[i].style.display = "";
			divModalTitleClasses[i].style.display = "";
			divModalFooterDivs[i].style.display = "";
			// console.log("AN: i: "+i+" id: "+divModalBodyDivs[i])
		}
		// ... sonst DIV ausblenden
		else {
			divModalBodyDivs[i].style.display = "none";
			divModalTitleClasses[i].style.display = "none";
			divModalFooterDivs[i].style.display = "none";
			// console.log("aus i: "+i+" id: "+divModalBodyDivs[i].id)
		} // end: if-else ID gleich
   	      	
   } // end: for divModalBodyDivs

} // end: mow_addon_angebote_einrichtungen_modalInhalte_Einblenden_Ausblenden


// Hier werden die einzelnen Elemente der JSON-Abfrage geprüft.
// Wenn ein Eintrag leer ist, kommt ein leerer String zurück.
// Ansonsten wird es angezeigt.
function mow_addon_angebote_einrichtungen_JsonErgebnisse_auf_Inhalt_pruefen(erklaerung, jsontext) {
	
		if ( jsontext.length > 0 ) { 
			return "	<p> <strong>"+erklaerung+":</strong> "+jsontext+" </p> "; }
		else { return ""; }
	}



// Ersetze "#####" in der Betreffzeile und im E-Mailinhalt mit dem Namen der Initiative. 
// Ersetze "%%%%%" in der Betreffzeile und im E-Mailinhalt mit dem Namen des Angebots.
function fnTextErsetzen(alterText, ersatzTextVerein, ersatzTextAngebot) {
	let neuerText = alterText.replace("#####",ersatzTextVerein);
		 neuerText = neuerText.replace("%%%%%",ersatzTextAngebot);
		 neuerText = encodeURIComponent(neuerText)
	return neuerText; 
	}


// https://gomakethings.com/converting-a-string-into-markup-with-vanilla-js/
/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
var stringToHTML = function (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};


// Im Feld für die E-Mailadresse KÖNNTE ein zweiter Empfänger stehen.
// z.B. info@banane.ba?cc=vorstand@banane.ba
// Das Fragezeichen (?) darf laut RFC nur 1x am Anfang vorkommen. Danach wird "&" als Trenner benutzt.
function mow_addon_angebote_einrichtungen_validate_email_address(emailaddress) {
	
	// Wenn es bereits ein Fragezeichen in der E-Mailadresse gibt, füge ein "&" ans Ende ...
	if (emailaddress.indexOf("?") > 0) {
			emailaddress += "&amp;"
	}
	// ... ansonsten füge ein Fragezeichen als ersten Parameter hinzu. 
	else {
		emailaddress += "?"
	}
	// console.log(emailaddress)
	return emailaddress;
	
}


// Klick-Funktion auf die gesamte Ergebnis-Zeile legen und am Anfang ausblenden
function mow_addon_angebote_einrichtungen_add_click_on_row() {
	// Click-Funktion auf PARTEINAME-Zeile legen zum Anzeigen der BUTTONS 
	// kopiert / angepasst aus "output.js" - ca. Zeile 450
	
	for (let i = 0; i <= (intParties-1); i++)
	{
		// Klickfunktion - bei Überschrift
		$("#resultsShortParty"+i).click(function () { 
				$("#resultsShortPartyAddonAngeboteEinrichtungen"+i).toggle(500);
				
			});	

		// am Anfang ausblenden
		$("#resultsShortPartyAddonAngeboteEinrichtungen"+i).hide(500);
		
	}
	
}


// Start
window.addEventListener("load", mow_addon_angebote_einrichtungen_MutationObserver)
