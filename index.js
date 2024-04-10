//  API 
const api = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

// Elements from the HTML
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const cocktailList = document.getElementById('cocktailList');
const cocktailDetails = document.getElementById('cocktailDetails');

// Change the background color of the input field
searchInput.addEventListener('focus', function() {
    searchInput.style.backgroundColor = 'lightgreen';
});

// Add a resize event listener to the window object
window.addEventListener('resize', function() {
    // Get the new window width and height
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Update the webpage layout based on the window size
    if (windowWidth < 768) {
        // Adjust layout for smaller screens
    } else {
        // Default layout for larger screens
    }
});

// Event listener for toggling dark/light mode
const toggleButton = document.getElementById('toggle');
let isDarkMode = false;
toggleButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.style.backgroundColor = isDarkMode ? 'black' : 'white';
    document.body.style.color = isDarkMode ? 'white' : 'black';
});


// Event listener for search button click
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;

    // Fetch cocktails based on search term
    fetch(api + searchTerm)
        .then(response => response.json())
        .then(data => {
            displayCocktails(data.drinks);
        })
        .catch(error => console.error('Error fetching cocktails:', error));
});


// Function to display cocktails in the list
function displayCocktails(cocktails) {
    cocktailList.innerHTML = '';

    if (cocktails) {
        cocktails.forEach(cocktail => {
            const cocktailItem = document.createElement('div');
            cocktailItem.classList.add('cocktail-item');
            cocktailItem.textContent = cocktail.strDrink;

            cocktailItem.addEventListener('click', () => {
                displayCocktailDetails(cocktail);
            });

            cocktailList.appendChild(cocktailItem);
        });
    } else {
        cocktailList.textContent = 'No cocktails found.';
    }
}

// Function to display details of a selected cocktail
function displayCocktailDetails(cocktail) {
    cocktailDetails.innerHTML = '';

    const cocktailName = document.createElement('h2');
    cocktailName.textContent = cocktail.strDrink;
    cocktailDetails.appendChild(cocktailName);

    const category =document.createElement('div');
    category.textContent =`It\'s ${cocktail.strCategory}`;
    cocktailDetails.appendChild(category);

    const cocktailAlcoholic = document.createElement('h3');
    cocktailAlcoholic.textContent = cocktail.strAlcoholic;
    cocktailDetails.appendChild(cocktailAlcoholic);


    // A mouseover event listener to the element h3
    cocktailAlcoholic.addEventListener('mouseover', function() {
        // Change the text color of the element when the mouse is over it
        cocktailAlcoholic.style.color = 'red';
    });

    const cocktailImage = document.createElement('img');
    cocktailImage.src = cocktail.strDrinkThumb;
    cocktailDetails.appendChild(cocktailImage);


    const cocktailInstructions = document.createElement('p');
    cocktailInstructions.textContent = cocktail.strInstructions;
    cocktailDetails.appendChild(cocktailInstructions);

   
    const ingredientsTitle = document.createElement('h4');
    ingredientsTitle.textContent = 'Ingredients:';
    cocktailDetails.appendChild(ingredientsTitle);


    const ingredientsList = document.createElement('ul');

    // Loop through the ingredients 
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail['strIngredient' + i];

        if (ingredient) {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = `${ingredient}`;
            ingredientsList.appendChild(ingredientItem);
        } else {
            break;
        }
    }
    cocktailDetails.appendChild(ingredientsList);
}

