//fetch Drink based on name
async function getCocktails(searchTerm) {
  const response = await $.ajax(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`
  ).catch((e) => {
    console.log(e);
  });
  console.log(response);
  showCocktails(response, searchTerm);
}

//fetch drink based on ID
async function getCocktailById(id) {
  const response = await $.ajax(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
  ).catch((e) => {
    console.log(e);
  });
  console.log(response.drinks[0]);
  showDetails(response.drinks[0]);
}

//Show result based on cocktail search by ID
function showDetails(data) {
  const ingredients = [];
  for (let i = 1; i <= 10; i++) {
    if (data[`strIngredient${i}`]) {
      //check if there is an actual ingredient
      ingredients.push(
        `${data[`strIngredient${i}`]} - ${data[`strMeasure${i}`]}`
      );
    } else {
      break; //break the loop
    }
  }
  console.log(ingredients);
  $("#single-cocktail").append(
    `
    <div class="single-drink">
      <h1 class="mt-5">${data.strDrink}</h1>
      <img src="${data.strDrinkThumb}" alt="${data.strDrink}"/>
      <div class="single-drink-info">
        <h2 clsss="my-4">Instructions:</h2>
        <p>${data.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
         <li>${ingredients.join("</li><li>")}</li>
        </ul>
      </div>
    </div>
    `
  );
}

//Show result based on cocktail search by name
function showCocktails(data, title) {
  if (data.drinks === null) {
    //if type something that is not valid or is not in the api I want to give me feedback
    $("#result-heading").append(
      `<p class="text-white m-5">There are no search result for '${title}' ,try again!</p>`
    );
  } else {
    $("#result-heading").empty();
    $("#result-heading").append(
      `<h4 class="text-white m-5">Search Result for ${title}:</h4>`
    );
    data.drinks.forEach((drink) => {
      $("#cocktails").append(`
       <div class="drink" data-drinkID="${drink.idDrink}">
         <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
         <div class="drink-info">
           <h6>${drink.strDrink}</h6>
         </div>
       </div>
      `);
    });
  }
  //add event listener
  $("[data-drinkID]").on("click", (e) => {
    console.log(e.currentTarget);
    $("#single-cocktail").empty();
    const drinkID = e.currentTarget.dataset.drinkid;
    console.log(drinkID);
    getCocktailById(drinkID);
  });
}

//Clear Dom
function ClearDom() {
  $("#alert").empty();
  $("#search").val("");
  $("#cocktails").empty();
  $("#single-cocktail").empty();
  $("#result-heading").empty();
}

//on ready
$(() => {
  $("#submit").on("submit", (e) => {
    e.preventDefault();
    const searchTerm = $("#search").val();
    if (searchTerm.trim()) {
      getCocktails(searchTerm);
    } else {
      $("#alert").append(
        `<p class="text-danger m-3">please enter a search term .</p>` //give alert if we dont put anything and press enter
      );
    }
    ClearDom();
  });
});
