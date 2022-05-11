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

// main functionalites - search for a specific meal, get a random meal and search by categories or countries 

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
                    // heading "results for search-string", meals-grid and new-search-button should now be shown 
                    resultHeading.classList.remove('hide');
                    meals.classList.remove('hide'); 
                    newSearchBtn.classList.remove('hide'); 
                    // searchbar and boxes for countries and categories should not be shown any longer
                    search.classList.add('hide'); 
                    countriesAndCategories.classList.add('hide');
                
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

function getMealDetailsById(id) {
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

            // single meal info page needs back-button to return to the meals-overview so the back-button must now be shown 
            backBtn.classList.remove('hide'); 
            // heading "results for search-string" and meals-grid should not be shown any longer
            resultHeading.classList.add('hide');
            meals.classList.add('hide'); 

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

// function getRandomMeal() {
//     // TODO
//     // https://www.themealdb.com/api/json/v1/1/random.php
// }

// function searchMealByCategories() {
//     // TODO 
//     // https://www.themealdb.com/api/json/v1/1/categories.php delivers categories 
//     // https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood search for a meal by a categorie (e.g. seafood)
// }

// function searchMealByNationality() {
//     // TODO
//     // https://www.themealdb.com/api/json/v1/1/list.php?a=list delivers nationalities 
//     // https://www.themealdb.com/api/json/v1/1/filter.php?a=Canadian search for a meal by a nationality (e.g. canadian)
// }

// utility functions

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

// event listeners 

submit.addEventListener('submit', showAllMealsForSearchString);

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
    // searchbar and boxes for countries and categories should now be shown 
    search.classList.remove('hide'); 
    countriesAndCategories.classList.remove('hide');
    // new-search- and back-button should not be shown any longer 
    newSearchBtn.classList.add('hide'); 
    backBtn.classList.add('hide');

    // clear elements
    resultHeading.innerHTML = ''; 
    meals.innerHTML = '<div class="meal"></div>';
    singleMealInfo.innerHTML = '<div class="single-meal-info"></div>';
    inputMeal.value = '';
})

backBtn.addEventListener('click', (e) => {
    // back-button should not be shown any longer
    backBtn.classList.add('hide'); 

    // clear single-meal-info-element
    singleMealInfo.innerHTML = '<div class="single-meal-info"></div>';

    showAllMealsForSearchString(e);
});