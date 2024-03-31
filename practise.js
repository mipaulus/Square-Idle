var counter=document.getElementById("counter");


function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

let counterNumber = 0;
while (counterNumber < 10000) {
    await Sleep(3000);
    counterNumber++;
    counter.innerHTML = counterNumber.toString();
}