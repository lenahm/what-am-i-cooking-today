# what-am-i-cooking-today
what-am-i-cooking-today is a web application that works with the themealdb.com-API to let a user look for a recipe for a specific meal or to get the user inspired by random meals.

In addition to the search for a specific or random meal the user can furthermore search for meals by categories or countries/nationalities. 

## Endpoints

As already mentioned, the application is working with themealdb.com-API - for details see https://www.themealdb.com/api.php. 

In detail, the application uses the following endpoints: 

- https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString} to search for a meal by name 
- https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName} to search for a meal by category
- https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryName} to search for a meal by country/nationality 
- https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id} to get all meal-details by a specific meal-id 
- https://www.themealdb.com/api/json/v1/1/random.php to get all meal-details for a random meal 
- https://www.themealdb.com/api/json/v1/1/categories.php to get all meals for a specific category
- https://www.themealdb.com/api/json/v1/1/list.php?a=list to get all meals for a specific country/nationality 

As suggested, the application is using the developer test-key '1' as the API-key.
