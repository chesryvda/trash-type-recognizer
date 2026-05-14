// Beide function moeten eventuele huidige tellers opnemen en updaten of displayen

export function saveStats(className) {
    // ! LOAD — haal tellers op van vandaag
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(today);

    // Als er vandaag nog niets gescand is (localStorage is leeg)
    // Koppel we die datum aan een object met statistieken (tellers = 0)
    // Indien er al gescand is, nemen we het object van die dag
    let counts;
    if (saved === null) {
        counts = { GFT: 0, Papier: 0, PMD: 0, Restafval: 0 };
    } else {
        counts = JSON.parse(saved);
    }

    // ! UPDATE — verhoog teller voor dit type
    counts[className]++;

    // ! SAVE
    localStorage.setItem(today, JSON.stringify(counts));
    displayStats();
}

export function displayStats(filterType = null) {
    // ! LOAD — haal tellers op van vandaag
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem(today);

    // Als er vandaag nog niets gescand is (localStorage is leeg)
    // Koppel we die datum aan een object met statistieken (tellers = 0)
    // Indien er al gescand is, nemen we het object van die dag
    let counts;
    if (saved === null) {
        counts = { GFT: 0, Papier: 0, PMD: 0, Restafval: 0 };
    } else {
        counts = JSON.parse(saved);
    }

    // ! DISPLAY
    const outputStats = document.querySelector("#label-stats-container");
    const types = ["GFT", "Papier", "PMD", "Restafval"];
    let outputText = types
        .filter(type => counts[type] > 0)
        .map(type => `${counts[type]}× ${type}`)
        .join(" · ");

    outputStats.innerHTML = outputText 
        ? `Vandaag gescand: ${outputText}` 
        : "Nog niets gescand.";
}