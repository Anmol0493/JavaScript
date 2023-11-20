const currencyOne = document.getElementById("currency-one");
const currencyTwo = document.getElementById("currency-two");
const amountOne = document.getElementById("amount-one");
const amountTwo = document.getElementById("amount-two");
const rateE1 = document.getElementById("rate");
const swap = document.getElementById("swap");

function calculate(){
    const currency_one = currencyOne.value;
    const currency_two = currencyTwo.value;

    fetch("https://open.exchangerate-api.com/v6/latest").then(res => res.json()).then(data => {
        const rate = data.rates[currency_two] / data.rates[currency_one];
        rateE1.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
        amountTwo.value = (amountOne.value * (rate)).toFixed(3);
    });
}

currencyOne.addEventListener("change",calculate);
currencyTwo.addEventListener("change",calculate);
amountOne.addEventListener("input",calculate);
amountTwo.addEventListener("input",calculate);

swap.addEventListener("click",() => {
    const tempValue = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = tempValue;
})

calculate();