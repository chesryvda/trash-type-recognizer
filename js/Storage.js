// 1.1 Wanneer de teachable machine iet scant, wordt dit gevoegd aan een localStorage
// 1.2 Wegens het om de 60FPS scant, zou het kunnen dat het zelfde type weer wordt gescand en zich weer bij optelt in de localStorage
// 1.3 Om dit te voorkomen werken we met een COOLDOWN, indien de volgende scan minder dan 3s geleden is en hetzelfde type is negeren we het
// 1.4 We koppelen een object met de statistieken (tellers) aan een datum

const COOLDOWN = 3000;
const lastScan = {
    GFT: 0,
    PMD: 0,
    Papier: 0,
    Restafval: 0
};

// saveStats krijgt class naam binnen van de teachable machine
// Wordt bijna om 60FPS opgeroepen vandaag onder "UPDATE" de cooldown check
export function saveStats(className) {
    // ! LOAD
    // Haal huidige tellers op vandaag 
    const today = new Date().toLocaleDateString();
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

    // ! UPDATE
    // Controleer per type of de cooldown voorbij is
    const now = Date.now(); // Huidge moment in tijd
    // Als dit type (className) minder dan 3 seconden geleden nog gescand werd = negeren
    if (now - lastScan[className] < COOLDOWN) return; 
    lastScan[className] = now;
    counts[className]++;

    // ! SAVE
    localStorage.setItem(today, JSON.stringify(counts));
    displayStats();
}

export function displayStats() {

}