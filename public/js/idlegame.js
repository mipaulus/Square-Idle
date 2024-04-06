let counter = 1000;
let spawnDelay = 3000;
let spawnDelayUpgradeCost = 1;
let totalMultiplier = 1;
let totalMultiplierUpgradeCost = 1;
let UnlockGreenBool = false;

//Sleep function used for timed things
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

//Normal Function for incrementing the Counter, gets called by button and collecting
function incCounter() {
    counter = counter + totalMultiplier;
    roundOutput();
    document.getElementById("counter").innerHTML = counter.toString();
}

//Upgrade TotalMultiplier Function, cost *10 every iteration
function UpgradeTotalMultiplier() {
    if (totalMultiplierUpgradeCost <= counter){
        totalMultiplier++;
        counter -= totalMultiplierUpgradeCost;
        totalMultiplierUpgradeCost *=10;
        document.getElementById("counter").innerHTML = counter.toString();
        document.getElementById("totalMultiplierButtonText").innerHTML = totalMultiplier.toString();
        document.getElementById("totalMultiplierCostButtonText").innerHTML = totalMultiplierUpgradeCost.toString();
    }
    else {
        alert("not enough points");
    }
}

//Upgrade spawn Delay Function, cost increases, spawn Delay reduces somewhat linearly
function UpgradeSpawnDelay(){
    if (counter >= spawnDelayUpgradeCost && spawnDelay > 3) {
        counter -= spawnDelayUpgradeCost;
        spawnDelayUpgradeCost = spawnDelayUpgradeCost+spawnDelayUpgradeCost*0.1 + 1;
        spawnDelay = spawnDelay*0.9;
        roundOutput();
        document.getElementById("counter").innerHTML = counter.toString();
        document.getElementById("spawDelayButtonText").innerHTML = spawnDelayUpgradeCost.toString();
        console.log("spawnDelay set to:"+spawnDelay);
    }
    else {
        alert("not enough points");
    }
}

//function that Unlocks Green Squares which are worth more
function UnlockGreen() {
    if (counter >= 10000 && UnlockGreenBool === false) {
        counter -= 10000;
        UnlockGreenBool = true;
        document.getElementById("UnlockGreen").style.color = "green";
        document.getElementById("counter").innerHTML = counter.toString();
    }
}

//function for rounding numbers before changing in the html
function roundOutput() {
    counter = Math.round(counter);
    spawnDelayUpgradeCost = Math.round(spawnDelayUpgradeCost);
}

//init function for creating collection Area
function createSpawnArea() {
    let spawnArea = "";
    for (let y = 0; y < 50 ; y++) {
        spawnArea = spawnArea.concat("<br>")

        for (let x = 0; x < 50; x++) {
            let xString = x.toString();
            let yString = y.toString();
            let idString = xString.concat("/").concat(yString);
            spawnArea = spawnArea.concat('<span onmouseover="collect(this.id)" id="'+idString+'">□</span>');
        }
    }
    document.getElementById("spawnArea").innerHTML = spawnArea;
}

//function that gets called whenever you hover a square
function collect(id){
    if (document.getElementById(id).innerHTML === "□") {
        return;
    }
    document.getElementById(id).innerHTML = "□";
    gridElements.push(id);
    if (document.getElementById(id).style.color === "green"){
        incCounter();
    }
    incCounter();
}

//Initializing the array to track still available squares, could probably be implemented somewhere else
let gridElements = [];
for (let n = 0; n < 50 ; n++){
    for (let m = 0; m < 50 ; m++){
        let mString = m.toString();
        let nString = n.toString();
        let idString = mString.concat("/").concat(nString);
        gridElements.push(idString);
    }
}

// function for continuously spawning new targets
async function spawnTargets() {
    while (true) {
        await Sleep(spawnDelay);
        if (gridElements.length === 0) {
            continue;
        }
        let rarityCheckRNG = Math.floor(Math.random() * 100);
        let gridElementSize = gridElements.length;
        let randomID = Math.floor(Math.random() * gridElementSize);
        let chosenID = gridElements.splice(randomID, 1)[0];
        document.getElementById(chosenID).innerHTML = "■";
        document.getElementById(chosenID).style.color = "black";
        if (rarityCheckRNG >= 70 && UnlockGreenBool === true) {
            document.getElementById(chosenID).style.color = "green";
        }
    }
}


//init function that calls all initially needed functions
async function init() {
    createSpawnArea();
    await spawnTargets();
}

init();
