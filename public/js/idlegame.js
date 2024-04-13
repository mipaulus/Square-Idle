let counter = 11111111;
let spawnDelay = 3000;
let spawnDelayUpgradeCost = 1;
let totalMultiplier = 1;
let totalMultiplierUpgradeCost = 1;
let UnlockGreenBool = false;
let UnlockBlueBool = false;
let rarityIncrease = 0;
let UpgradeRarityCost = 1;
let UnlockCardsBool = false;
let shopRerollDelay = 1000;
let availableCards = ["/rsc/Square-Plant-Card.png","/rsc/Square-Hole-Card.png"];
let cardDeck = [];
let cardShopSlots = 7;

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
        totalMultiplierUpgradeCost *= 10;
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
        spawnDelayUpgradeCost = spawnDelayUpgradeCost+spawnDelayUpgradeCost*0.2 + 1;
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

//function for Upgrading all Rarities(making better colors more likely to appear)
function UpgradeRarity(){
    if (counter >= UpgradeRarityCost && UnlockGreenBool === true){
        counter -= UpgradeRarityCost;
        rarityIncrease++;
        UpgradeRarityCost += Math.floor(1 + UpgradeRarityCost*0.15);
        document.getElementById("counter").innerHTML = counter.toString();
        document.getElementById("UpgradeRarityCostButtonText").innerHTML = UpgradeRarityCost.toString();
        console.log("rarityIncrease set to:"+rarityIncrease);
    }
    else {
        alert("not enough points");
    }
}

//function that Unlocks Green Squares which are worth 2x
function UnlockGreen() {
    if (counter >= 10000 && UnlockGreenBool === false) {
        counter -= 10000;
        UnlockGreenBool = true;
        document.getElementById("UnlockGreen").style.color = "green";
        document.getElementById("counter").innerHTML = counter.toString();
    }
}

//function that Unlocks Blue Squares which are worth 4x
function UnlockBlue() {
    if (counter >= 30000 && UnlockBlueBool === false) {
        counter -= 30000;
        UnlockBlueBool = true;
        document.getElementById("UnlockBlue").style.color = "blue";
        document.getElementById("counter").innerHTML = counter.toString();
    }
}

//Unlock the Card-System
function UnlockCards() {
    if (counter >= 100000 && UnlockCardsBool === false) {
        counter -= 100000;
        UnlockCardsBool = true;
        document.getElementById("card-shop").hidden = false;
        rerollShop();
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
    switch (document.getElementById(id).style.color) {
        case "green":
            incCounter();
            incCounter();
            break;

        case "blue":
            for (let i= 0; i < 4; i++) {
                incCounter();
            }
            break;

        case "yellow":
            counter = Math.floor(counter * 1.05);
            document.getElementById("counter").innerHTML = counter.toString();
            break;

        default:
            incCounter();
    }
    document.getElementById(id).style.color="black";
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

//Handles shop Rerolls, gets called as soon as cards are unlocked
async function rerollShop(){
    while (true) {
        await Sleep(shopRerollDelay);
        let i = 0;
        for (i = 0; i < cardShopSlots; i++){
            document.getElementById("card-shop-slot" + i).removeAttribute("hidden");
            let cardSpawnChoiceRNG = Math.floor(Math.random() * availableCards.length);
            document.getElementById("card-shop-slot" + i).src = availableCards[cardSpawnChoiceRNG];
        }
        i = 0;
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
        let rarityCheckTotal = rarityCheckRNG + rarityIncrease;
        let gridElementSize = gridElements.length;
        let randomID = Math.floor(Math.random() * gridElementSize);
        let chosenID = gridElements.splice(randomID, 1)[0];
        document.getElementById(chosenID).innerHTML = "■";
        document.getElementById(chosenID).style.color = "black";
        if (rarityCheckTotal >= 70 && UnlockGreenBool === true) {
            document.getElementById(chosenID).style.color = "green";
        }
        if (rarityCheckTotal >= 100 && UnlockBlueBool === true) {
            document.getElementById(chosenID).style.color = "blue";
        }
        if (rarityCheckRNG === 55 && Math.floor(Math.random() * 10) === 5) {
            document.getElementById(chosenID).style.color = "yellow";
        }
    }
}


//init function that calls all initially needed functions
async function init() {
    createSpawnArea();
    await spawnTargets();
}

init();
