const apiKey = 'dd70926177fd83c59f2bd69b';
const apiURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

// Get references to html elements
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const convertBtn = document.getElementById('convertBtn');
const spinner = document.getElementById('spinner');
const btnAnim = document.getElementById('btnAnim');

let rates = {}; // Will hold all currency rates

// Fetch API data and populate dropdowns
function fetchCurrencies() {
    spinner.style.display = 'block'; // for loading spinner

    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            rates = data.conversion_rates;
            populateDropdowns(rates);
            spinner.style.display = 'none'; // Hide spinner
        })
        .catch(error => {
            resultDiv.textContent = 'Failed to load rates.';
            spinner.style.display = 'none';
        });
}

function populateDropdowns(ratesObj) {
    // Remove any previous options
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';
    const currencyList = Object.keys(ratesObj);

    // it adds a slide-in animation for dropdowns
    fromCurrency.parentElement.style.transform = 'translateY(-18px)';
    toCurrency.parentElement.style.transform = 'translateY(-18px)';

    currencyList.forEach(curr => {
        let opt1 = document.createElement('option');
        opt1.value = curr;
        opt1.textContent = curr;
        fromCurrency.appendChild(opt1);

        let opt2 = document.createElement('option');
        opt2.value = curr;
        opt2.textContent = curr;
        toCurrency.appendChild(opt2);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';

    setTimeout(() => {
        fromCurrency.parentElement.style.transform = 'translateY(0)';
        toCurrency.parentElement.style.transform = 'translateY(0)';
    }, 200);
}

// Button click event with animation
convertBtn.addEventListener('click', (event) => {
    // Animate button on click
    btnAnim.style.background = 'rgba(255,255,255,0.13)';
    setTimeout(() => btnAnim.style.background = 'transparent', 350);

    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amount = parseFloat(amountInput.value);

    // Validate input
    if (!amount || amount <= 0) {
        resultDiv.textContent = 'Please enter a valid amount.';
        return;
    }

    // Show spinner while calculating
    spinner.style.display = 'block';

    // Simulate API delay for animation
    setTimeout(() => {
        spinner.style.display = 'none';
        if (rates[from] && rates[to]) {
            // Convert via USD base
            const usdAmount = amount / rates[from];
            const converted = usdAmount * rates[to];
            // Animated result display
            resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
            resultDiv.classList.remove('animated');
            void resultDiv.offsetWidth; // Force reflow to restart animation
            resultDiv.classList.add('animated');
        } else {
            resultDiv.textContent = 'Select valid currencies.';
        }
    }, 700); // 0.7 sec delay for smooth feel
});

// Fetch the rates and populate dropdowns on page load
window.onload = fetchCurrencies;

// // Live conversion on currency dropdown change
// fromCurrency.addEventListener('change', autoConvert);
// toCurrency.addEventListener('change', autoConvert);

function autoConvert() {
    // Only convert if user has entered a valid amount
    const amount = parseFloat(amountInput.value);
    if (amount > 0) {
        convertBtn.click();
    }
}
