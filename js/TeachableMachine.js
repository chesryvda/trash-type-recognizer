import { updateOutput, resetScan } from "./Output.js";
import { displayStats } from "./Storage.js";
import { state } from "./State.js";

// Naam van de folder waarin de teachable machine inzit
const URL = "./assets/model/";
let model, webcam, labelContainer, maxPredictions;

// Teachable machine opstart en webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);

    try {
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);
        // Webcam
        document.querySelector(".content-right").appendChild(webcam.canvas);
    } catch (err) {
        // ! Gebruiker heeft camera geweigerd of camera niet beschikbaar
        showCameraFallback();
    }

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // Opnieuw scannen, reset alles en herstart predictions
    document.querySelector("#result-restart-button")?.addEventListener("click", resetScan);
}

function showCameraFallback() {
    const contentRight = document.querySelector(".content-right");
    contentRight.innerHTML = 
    `<img 
        src="assets/images/freepik__realistic-photo-taken-from-a-camera-perspective-of-a-man-holding-a-water-bottle.png" 
        alt="Realistic photo taken from a camera perspective of a man holding a water bottle"
    >`;
}

async function loop() {
    webcam.update();

    // Enkel predicten als isPredicting true is (State.js)
    if (state.isPredicting) await predict();

    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }

    // Update UI output
    updateOutput(prediction);
}

// Toon bij het laden van de pagina de localStorage
displayStats();
init();