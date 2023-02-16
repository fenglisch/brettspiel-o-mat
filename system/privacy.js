
function fnShowImprint() {

	// Versionsnummer aus GENERAL.JS
	$("#versionNumber").append(version);


	var textNoInformation = "keine Angaben / No information available."
	
	
	if (!privacyTitle)
	{
		$("#privacyTitle").append("Datenschutzhinweise zum Mitwirk-O-Mat");
	}
	else
	{
		$("#privacyTitle").append(privacyTitle);
	}


	if (!privacyGeneral)
	{
		$("#privacyGeneral").append(textNoInformation);
	}
	else
	{
		$("#privacyGeneral").append(privacyGeneral);
	}

}