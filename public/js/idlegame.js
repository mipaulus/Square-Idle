let counter = 0;

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function fncCounter() {
    counter++;
    document.getElementById("idlegame").innerHTML = counter.toString();
}

function createSpawnArea() {
    let spawnArea = "";
    for (let y = 0; y < 25 ; y++) {
        spawnArea = spawnArea.concat("<br>")

        for (let x = 0; x < 50; x++) {
            let xString =x.toString();
            let yString =y.toString();
            let idString =xString.concat("/").concat(yString);
            spawnArea = spawnArea.concat('<span id="'+idString+'">□</span>');
        }
    }
    document.getElementById("spawnArea").innerHTML = spawnArea;
}

async function spawnTargets() {
    while (true) {
        let randomX = Math.floor(Math.random() * 50);
        let randomY = Math.floor(Math.random() * 25);
        let randomxString =randomX.toString();
        let randomyString =randomY.toString();
        let randomidString =randomxString.concat("/").concat(randomyString);
        await Sleep(300);
        document.getElementById(randomidString).innerHTML = "■";
        console.log(randomidString);

    }
}


async function init() {
    createSpawnArea();
    await spawnTargets();
}

init();
