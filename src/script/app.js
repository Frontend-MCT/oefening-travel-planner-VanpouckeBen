let countryHolder;
let amountHolder;
const localkey = 'travel-planner';
let selectedCountries = [];
let choosenCountry = "europe";
let notificationsHolder;
const enableListeners = () => {
    //1. get some buttonsjs-region-select
    const regionButtons = document.querySelectorAll(".js-region-select");


    //2. listen to the clicks
    // regionButtons.forEach(element => {
    //     element.addEventListener("click", function () {
    //         console.log(this);
    //     })
    // });
    // 
    //2.listen to the clicks
    for (const button of regionButtons) {
        button.addEventListener("click", function () {
            //2.1 look up the data property
            choosenCountry = this.getAttribute('data-region');

            //2.2 get data from api
            fetchCountries(choosenCountry);
        })
    }

    const resetbutton = document.querySelector(".js-reset-progress");
    resetbutton.addEventListener("click", resetLocalCountries);
    // globaal toevoegen want de dom aanspreken vertraagd ons proces dus zo weinig mogelijk dit doen.
    countryHolder = document.querySelector(".js-country-holder");
    amountHolder = document.querySelector(".js-amount");
    notificationsHolder = document.querySelector(".js-notification-holder");
    //always start with europe.
    fetchCountries(choosenCountry);
    updateCounter();
};

const fetchCountries = (region) => {
    fetch("https://restcountries.eu/rest/v2/region/" + region)
        .then(res => res.json())
        .then(response => showCountries(response))
        .catch(error => console.error('Error:', error));
}

const showCountries = (countries) => {

    let countriesString = ""

    for (const country of countries) {
        let code = `${country.cioc}-${country.alpha2Code}`
        let checked = hasLocalCountry(code) ? "checked" : "";
        // maak nieuw article aan
        countriesString +=
            `<article><input type="checkbox" id="${code}" class="o-hide c-country-input" ${checked}>
        <label for="${code}" class="c-country js-country" data-country-name="${country.name}">
            <div class="c-country-header">
                <h2 class="c-country-header__name">${country.name}</h2>
                <img src="${country.flag}" alt="The flag of ${country.name.toLowerCase()}" class="c-country-header__flag">
            </div>
            <p class="c-country__native-name">${country.nativeName}</p>
        </label>
    </article>`
        // vul article


    }
    countryHolder.innerHTML = countriesString;

    addListenersToCountries('.js-country');


}

const addListenersToCountries = function (classSelector) {
    const countries = document.querySelectorAll(classSelector);
    for (const country of countries) {
        country.addEventListener('click', function () {

            //console.log(this.getAttribute('for'));
            countryKey = this.getAttribute('for');

            //sla op of verwijder uit local storage
            hasLocalCountry(countryKey) ? removeLocalCountry(countryKey) : addLocalCountry(countryKey);

            //shownotification => we moeten naar de vorige status terug keren (aangezien we deze hierboven al weizeigen)
            showNotification(country, !hasLocalCountry(countryKey))

            //getal updaten.
            updateCounter()
        })

    }
}
const showNotification = (element, isRemoved) => {
    //1. zin opbouwen
    let countryName = element.dataset.countryName;
    let notificationText = isRemoved ? "You have removed " + countryName : "You have selected " + countryName;
    //2. show in js-notification-holder;
    let notification = document.createElement('div');
    notification.classList.add('c-notification');

    notification.innerHTML = `
    
                <h2 class="c-notification__header">
                    ${notificationText}
                </h2>
               
            
    `
    //undo button
    let undoButton = document.createElement("button");
    undoButton.classList.add('c-notification__action');
    undoButton.innerHTML = 'Undo';
    undoButton.addEventListener("click", function () {
        //haal for attribute op (country key)
        countryKey = element.getAttribute('for');
        //kijk wat de vorige status was. bij verwijderen voeg je hem weer toe en omgekeerd      
        isRemoved ? addLocalCountry(countryKey) : removeLocalCountry(countryKey);

        //input attribute checked switchen.
        element.previousElementSibling.checked = !element.previousElementSibling.checked
        //haal alle countries terug op om de verandering in de ui te tonen. --> slechter alternatief.        
        //fetchCountries(choosenCountry);
    });
    notification.append(undoButton);

    //voeg notficatie toe aan holder
    notificationsHolder.append(notification);



    //4. fade out after 800ms;
    setTimeout(() => {
        fadeAndRemoveNotification(notification);
    }, 1500);


}
const fadeAndRemoveNotification = notification => {
    notification.classList.add('u-fade-out');
    notification.addEventListener('transitionend', function () {

        notificationsHolder.removeChild(notification);
    })
}

const updateCounter = () => {
    amountHolder.innerHTML = countLocalCountries();
}
const getLocalCountries = key => {
    return JSON.parse(localStorage.getItem(localkey)) || [];
}
const addLocalCountry = key => {
    //void / (true || false)?
    selectedCountries.push(key);
    localStorage.setItem(localkey, JSON.stringify(selectedCountries));
}
const hasLocalCountry = key => {
    //true ,false
    return selectedCountries.includes(key);
}
const removeLocalCountry = key => {
    //void / (true || flase)
    selectedCountries = selectedCountries.filter(c => c !== key);
    localStorage.setItem(localkey, JSON.stringify(selectedCountries));
}
const countLocalCountries = key => {
    //int --> 0 - 250
    return selectedCountries.length;
}
const resetLocalCountries = () => {
    localStorage.clear();
    selectedCountries = [];
    fetchCountries(choosenCountry);
    updateCounter();
}

const init = () => {
    console.log("dom geladen");
    //haal countries op uit local storage
    selectedCountries = getLocalCountries();
    //enableListeners en haal data op
    enableListeners();

}
document.addEventListener('DOMContentLoaded', init);
