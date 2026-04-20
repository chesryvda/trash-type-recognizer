// Variables
const POPUP_TIMER = 2000; // om de x-aantal seconden verschijnt er een popup
let tips = [];
let currentIndex = 0;

// Data
async function init() {
    const response = await fetch("../assets/data/popup-messages.json");
    // JSON in array steken
    tips = await response.json();    

    // Toon popup na x-aantal seconden wanneer pagina laad
    setTimeout(showNextPopup, POPUP_TIMER);
}
init();

function showNextPopup() {
    const tip = tips[currentIndex];
    currentIndex++;
    if (currentIndex >= tips.length) {
        currentIndex = 0;
    } 

    const popup = buildPopup(tip);
    document.body.appendChild(popup);
}

function buildPopup(data) {
    const div = document.createElement('div');
    div.className = 'content-popup';
    div.innerHTML = 
    `
        <div class="content-popup-container">
            <button class="content-popup-outer" aria-label="Sluit popup">
                <i class="fa-solid fa-x"></i>
            </button>
            <div class="content-popup-inner">
                <p>${data.tip}</p>
            </div>
        </div>
    `;

    div.querySelector('.content-popup-outer').addEventListener('click', () => {
        closePopup(div);
    });
    return div;
}

function closePopup(div) {
    if (div.classList.contains('hiding')) return;
    div.classList.add('hiding');

    // Wanneer de animatie af is...
    div.addEventListener('animationend', function() {
        // Toon popup na x-aantal seconden wanneer voorgaande popup weg is
        div.remove();
        setTimeout(showNextPopup, POPUP_TIMER);

        // Luister 1 keer
    }, { once: true });
}