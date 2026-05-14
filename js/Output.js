// 1.1 Predictions; indien afgelopen x-aantal seconden hetzelfde type wordt gescanned (ononderbroken) 
// wordt de predictions camera disabled
// 1.2 Scan wordt in een localStorage gestopt en result paneel wordt geopend
// 1.3 Afval type wordt stand" gehouden, geen predictions tenzij er op de "Opnieuw scannen" knop wordt geduwd

import { saveStats } from "./Storage.js";
import { setPredicting } from "./State.js";

// Hoelang hetzelfde type aaneengesloten gescand moet worden voor de timer triggert (ms)
const SCAN_DURATION = 3000;

let predictionsCameraDisabled = false;    
let lastClassName = null;   
let scanTimer = null; // setTimeout referentie

export function updateOutput(predictions) {
    // In de functie onScanConfirmed() en resetScan() gaan we dit al dan niet disablen
    if (predictionsCameraDisabled) return;

    // ! 1.1 Afval wordt herkend
    const highest = predictions.reduce((a, b) => a.probability > b.probability ? a : b);

    // Onder threshold → reset alles
    if (highest.probability < 0.99) {
        resetAll();
        clearScanTimer();
        return;
    }

    // ! 1.2 Ander type afval herkent? Reset 
    if (highest.className !== lastClassName) {
        clearScanTimer();
        lastClassName = highest.className;
        resetAll();
    }

    // ! 1.3 Toon visueel welk type herkend is
    if (highest.className === "GFT") {
        activate(".content-output-gft", "%2322C55E", "var(--color-green)");
    }

    if (highest.className === "Papier") {
        activate(".content-output-paper", "%239CA3AF", "var(--color-light-grey)");
    }

    if (highest.className === "PMD") {
        activate(".content-output-pmd", "%232F80ED", "var(--color-blue)");
    }

    if (highest.className === "Restafval") {
        activate(".content-output-rest", "%23000000", "var(--color-black)");
    }

    // ! 1.4 Start timer — na 5s ononderbroken hetzelfde type - bevestig scan
    if (!scanTimer) {
        scanTimer = setTimeout(() => {
            onScanConfirmed(highest.className);
        }, SCAN_DURATION);
    }
}

function activate(selector, fillColor, borderColor) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.backgroundImage = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='${fillColor}' rx='16' ry='16' stroke='${fillColor}' stroke-width='4' stroke-dasharray='10%2c10' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`;
    el.querySelector("i").style.color = "var(--color-floral-white)";
    el.querySelector("p").style.color = "var(--color-floral-white)";
}

function resetAll() {
    document.querySelectorAll(".content-output-list li").forEach(li => {
        li.style.backgroundImage = "";
        li.querySelector("i").style.color = "";
        li.querySelector("p").style.color = "";
    });
}

function clearScanTimer() {
    if (scanTimer) {
        clearTimeout(scanTimer);
        scanTimer = null;
    }
}

function onScanConfirmed(className) {
    // ! Stop met scannen/predictions maken + stop de loop in TeachableMachine.js via State.js
    predictionsCameraDisabled = true;
    setPredicting(false);

    // ! Sla op in localStorage
    saveStats(className);

    // ! Toon stats-panel gefilterd op dit type
    showResultPanel(className);
}

// ! Result panel
const typeInfo = {
    GFT:       { label: "GFT",     message: "Heel gezond bezig, nu nog juist sorteren." },
    Papier:    { label: "Papier",    message: "Bedankt, je geeft mij een tweede leven." },
    PMD:       { label: "PMD",      message: "Neem een herbruikbare drinkbus mee volgende keer." },
    Restafval: { label: "Restafval", message: "De restbak is geen eindstation, maar soms gewoon de realistische keuze." },
};

function showResultPanel(className) {
    const panel = document.querySelector(".result-panel-outer");
    if (!panel) return;

    const info = typeInfo[className];
    panel.querySelector(".result-panel-label").textContent = info.label;
    panel.querySelector(".result-panel-message").textContent = info.message;

    document.querySelector(".content").style.opacity = "0.5";

    // Animaties
    panel.classList.remove("fade-out-up");
    panel.classList.add("fade-in-up");
}

// Opnieuw scannen knop roept dit aan
export function resetScan() {
    // ! Result panel verdwijnen
    const panel = document.querySelector(".result-panel-outer");
    if (!panel) return;

    panel.classList.remove("fade-in-up");
    panel.classList.add("fade-out-up");

    document.querySelector(".content").style.opacity = "1";

    // ! Wacht tot animatie klaar is voor reset
    panel.addEventListener("animationend", () => {
        // Scannen weer toegelaten + start de loop in TeachableMachine.js via State.js
        predictionsCameraDisabled = false;
        lastClassName = null;
        setPredicting(true);
        clearScanTimer();
        resetAll();
    }, { once: true }); // once: true = listener verwijdert zichzelf na 1x
}