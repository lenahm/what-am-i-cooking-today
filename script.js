const newSearchBtn = document.getElementById('new-search-btn'); 
const searchBtn = document.getElementById('search-btn'); 
const randomBtn = document.getElementById('random-btn'); 
const backBtn = document.getElementById('back-btn'); 

const search = document.querySelector('.search'); 
const submit = document.getElementById('submit'); 
const inputMeal = document.getElementById('input-meal'); 
const countriesAndCategories = document.querySelector('.countries-and-categories');
const resultHeading = document.querySelector('.result-heading'); 
const meals = document.querySelector('.meals'); 
const singleMealInfo = document.querySelector('.single-meal-info'); 

showCategoriesOnStartPage(); 
showCountriesOnStartPage();

// -------------------- main functionalites - search for a specific meal, get a random meal and search by categories or countries --------------------

function showAllMealsForSearchString(e) {
    e.preventDefault();

    const searchString = inputMeal.value;
    
    if (searchString.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString}`)
        .then(res => res.json())
        .then(data => {
                if (data.meals === null) {
                    // received data can be empty (no search-results for search-string) -> display message in UI 
                    showAlert('There is no match for your keywords - please try again'); 
                } else {
                    hideElementsForMealsOverviewPage(); 
                
                    resultHeading.innerHTML = `<h3>Results for "${searchString}"</h3>`;
                    meals.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h5>${meal.strMeal}</h5>
                            </div>
                        </div>
                    `).join('');
                }
            }); 
    } else {
        // input search-string is empty -> display message in UI 
        // alert should only be shown on start page (in this case the new-search-button is not displayed because it contains the class 'hide')
        if (newSearchBtn.classList.contains('hide')) {
            showAlert('Please enter some keywords for the meal you are looking for');
        }
    }
}

function getMealDetailsById(id, isRandomMeal) {
    console.log(isRandomMeal); 
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]; 

            // putting ingredients and measures together in an array
            const ingredients = []; 
            // i <= 20 according to the API-structure (strIngredient1, strIngredient2, ..., strIngredient20 and strMeasure1, strMeasure2, ..., strMeasure20)
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`); 
                } else {
                    break; 
                }
            }

            hideElementsForSingleMealInfoPage(isRandomMeal);

            singleMealInfo.innerHTML = `
                <div class="single-meal-info">
                    <h3>${meal.strMeal}</h3>
                    <div class="flex-row">
                        <div class="flex-column">
                            <img src="${meal.strMealThumb}">
                            <div class="box mt-20">
                                <span class="tags">${meal.strArea}</span>
                                <span class="tags">${meal.strCategory}</span>
                            </div>
                        </div>
                        <div class="flex-column ml-20">
                            <p class="instructions">${meal.strInstructions}</p>
                            <h4>Ingredients</h4>
                            <div class="box">
                                <ul>
                                    ${ingredients.map(ingredient => `
                                        <li class="tags">${ingredient}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `; 
        });
}

function getRandomMealId() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => getMealDetailsById(data.meals[0].idMeal, true)); 
}

function showCategoriesOnStartPage() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(res => res.json())
        .then(data => {
            data.categories.map(category => {
                // get parent- and insert-after-element 
                const categories = document.querySelector('.categories'); 
                const categoriesHeading = document.querySelector('#categories-heading'); 

                addTagElementToDOM(category.strCategory, categories, categoriesHeading); 
            }); 
        }); 
}

function showCountriesOnStartPage() {
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
        .then(res => res.json())
        .then(data => {
            data.meals.map(country => {
                // get parent- and insert-after-element 
                const countries = document.querySelector('.countries'); 
                const countriesHeading = document.querySelector('#countries-heading'); 

                addTagElementToDOM(country.strArea, countries, countriesHeading); 
            })
        })
}

function addTagElementToDOM(categoryName, parentElement, insertAfterElement) {
    const span = document.createElement('span'); 
    span.className = 'tags'; 
    span.appendChild(document.createTextNode(categoryName)); 

    insertAfterElement.parentNode.insertBefore(span, insertAfterElement.nextSibling);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// -------------------- utility functions for alerts to display error messages --------------------

function showAlert(message) {
    // clear any remaining alert
    this.clearAlert(); 

    // create div
    const div = document.createElement('div'); 
    div.className = 'alert'; 
    div.appendChild(document.createTextNode(message)); 

    // get parent- and insert-before-element 
    const container = document.querySelector('.container'); 
    const countriesAndCategories = document.querySelector('.countries-and-categories'); 

    // insert alert with timeout after 4 seconds
    container.insertBefore(div, countriesAndCategories);
    setTimeout(() => {
        this.clearAlert();
    }, 4000); 
}

function clearAlert() {
    const currentAlert = document.querySelector('.alert'); 
    if (currentAlert) {
        currentAlert.remove(); 
    }
}

// -------------------- utility functions to hide and unhide html-elements --------------------

function hideElementsForStartPage() {
    // searchbar and boxes for countries and categories should be available, the rest should be hidden
    unhideHtmlElement(search); 
    unhideHtmlElement(countriesAndCategories); 

    hideHtmlElement(resultHeading); 
    hideHtmlElement(meals); 
    hideHtmlElement(newSearchBtn); 
    hideHtmlElement(backBtn); 
}

function hideElementsForMealsOverviewPage() {
    // result-heading, meals-overview and new-search-button should be available, the rest should be hidden 
    unhideHtmlElement(resultHeading);
    unhideHtmlElement(meals);
    unhideHtmlElement(newSearchBtn);

    hideHtmlElement(search); 
    hideHtmlElement(countriesAndCategories); 
    hideHtmlElement(backBtn); 
}

function hideElementsForSingleMealInfoPage(isRandomMeal) {
    // new-search-button (to return to the meals-overview) should be available in every case, back-btn should only be available if it is no random meal, the rest should be hidden 
    unhideHtmlElement(newSearchBtn); 
    isRandomMeal ? hideHtmlElement(backBtn) : unhideHtmlElement(backBtn); 

    hideHtmlElement(search);
    hideHtmlElement(countriesAndCategories);
    hideHtmlElement(resultHeading);
    hideHtmlElement(meals);
}

function hideHtmlElement(htmlElement) {
    // hide (undisplaying) means adding the utility css-class .hide (display: none)
    htmlElement.classList.add('hide'); 
}

function unhideHtmlElement(htmlElement) {
    // unhide (displaying) means removing the utility css-class .hide (display: none)
    htmlElement.classList.remove('hide'); 
}

// -------------------- event listeners --------------------

submit.addEventListener('submit', showAllMealsForSearchString);

randomBtn.addEventListener('click', getRandomMealId); 

meals.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info'); 
        } else {
            return false; 
        }
    }); 

    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealid');
        getMealDetailsById(mealId); 
    }
}); 

newSearchBtn.addEventListener('click', () => {
    hideElementsForStartPage();

    // clear elements
    resultHeading.innerHTML = ''; 
    meals.innerHTML = '<div class="meal"></div>';
    singleMealInfo.innerHTML = '<div class="single-meal-info"></div>';
    inputMeal.value = '';
})

backBtn.addEventListener('click', (e) => {
    // clear single-meal-info-element
    singleMealInfo.innerHTML = '<div class="single-meal-info"></div>';

    showAllMealsForSearchString(e);
});