let countryHolder;
const localkey = 'travel-planner';

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
            const region = this.getAttribute('data-region');

            //2.2 get data from api
            fetchCountries(region);
        })
    }
    // globaal toevoegen want de dom aanspreken vertraagd ons proces dus zo weinig mogelijk dit doen.
    countryHolder = document.querySelector(".js-country-holder");

    //always start with europe.
    fetchCountries('europe');
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

        // maak nieuw article aan
        countriesString +=
            `<article><input type="checkbox" id="${country.cioc}-${country.alpha2Code}" class="o-hide c-country-input">
        <label for="${country.cioc}-${country.alpha2Code}" class="c-country js-country">
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
    for (const Country of countries) {
        Country.addEventListener('click', function () {
            console.log(this.getAttribute('for'));
        })

    }
}

const getLocalCountries = key => {

}
const addLocalCountry = key => {
    //void / (true || false)?
}
const hasLocalCountry = key => {
    //true ,false

}
const removeLocalCountries = key => {
    //void / (true || flase)
}
const countLocalCountries = key => {
    //int --> 0 - 250
}
const init = () => {
    console.log("dom geladen")
    enableListeners();

}
document.addEventListener('DOMContentLoaded', init);
