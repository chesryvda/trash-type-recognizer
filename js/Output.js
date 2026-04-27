import { saveStats } from "./Storage.js";

export function updateOutput(predictions) {
    const highestPrediction = predictions.reduce((a, b) => a.probability > b.probability ? a : b);

    resetAll();

    if (highestPrediction.probability < 0.99) return;

    // Zorg dat class namen van de teachable machine & HTML overeenkomen
    if (highestPrediction.className === "GFT") {
        activate(".content-output-gft", "%2322C55E", "var(--color-green)");
        saveStats("GFT");
    }

    if (highestPrediction.className === "Papier") {
        activate(".content-output-paper", "%239CA3AF", "var(--color-light-grey)");
        saveStats("Papier");
    }

    if (highestPrediction.className === "PMD") {
        activate(".content-output-pmd", "%232F80ED", "var(--color-blue)");
        saveStats("PMD");
    }

    if (highestPrediction.className === "Restafval") { 
        activate(".content-output-rest", "%23000000", "var(--color-black)");
        saveStats("Restafval");
    }
}

function activate(selector, fillColor, borderColor) {
    const el = document.querySelector(selector);
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