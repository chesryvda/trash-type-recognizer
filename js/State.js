// Al dan niet doorgeven of er predictions of niet gemaakt moet worden (Gedeelde JS tussen Output.js en TeachableMachine.js)

// ! Voorkomt circular imports: 
// TeachableMachine.js importeert uit Output.js
// Output.js importeert uit TeachableMachine.js (voor setPredicting)

export const state = {
    isPredicting: true
};
export function setPredicting(value) {
    state.isPredicting = value;
}