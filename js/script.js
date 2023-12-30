const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".To select"),
  getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    // selecting USD by default as FROM currency and NPR as TO currency
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "EGP" ? "selected" : "";
    }
    //creating option tag with passing currency code as a text and value
    let optiontag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optiontag);
  }
  dropList[i].addEventListener("change", (e) => {
    // When the value of the drop-down changes, invoke the 'loadFlag' function and pass the target element
    loadFlag(e.target);
  });
}

// Function to load the flag image based on the selected country code
function loadFlag(element) {
  // Iterate through the properties of the 'country_code' object
  for (code in country_code) {
    // Check if the current code matches the value of the selected
    if (code == element.value) {
      // If there is a match, get the <img> tag within the parent element of the selected element
      let imgtag = element.parentElement.querySelector("img");
      imgtag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}
window.addEventListener("load", () => {
  // When the window has fully loaded, invoke the 'getExchangeRate' function
  getExchangeRate();
});

// Add a click event listener to the getButton element
getButton.addEventListener("click", (e) => {
  // Prevent the default behavior of the button
  e.preventDefault();
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  // Swap the values between 'fromCurrency' and 'toCurrency'
  // This allows users to quickly switch between the source and target
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

// Function to handle obtaining the exchange rate
function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  exchangeRateTxt = document.querySelector(".exchange-rate");
  // Get the current value of the input
  let amountVal = amount.value;

  // Check if the input value is not a number
  if (isNaN(amountVal)) {
    // Print a warning message
    exchangeRateTxt.innerText = "Please enter a valid number";
    return;
  }

  // Check if the input value is empty or "0"
  if (amountVal == "" || amountVal == "0") {
    // If true, set the input value to "1" and update amountVal to 1
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  // Construct the URL for the exchange rate API, using the value of 'fromCurrency' as a parameter
  let url = ` https://v6.exchangerate-api.com/v6/4e2d592d0960127a063fb843/latest/${fromCurrency.value}`;
  // Fetch data from the API
  fetch(url)
    // Parse the response as JSON
    .then((response) => response.json())
    .then((result) => {
      // Extract the exchange rate for the specified 'toCurrency'
      let exchangerate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangerate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value}=${totalExchangeRate}${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
