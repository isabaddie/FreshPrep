document.addEventListener('DOMContentLoaded', () => {

    const burgerMenu = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');

    burgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        cookieBanner.style.display = 'flex';
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });

    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');

    togglePasswordBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordBtn.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            togglePasswordBtn.textContent = 'Show';
        }
    });

    const registerForm = document.getElementById('register-form');
    const emailInput = document.getElementById('email');
    const formFeedback = document.getElementById('form-feedback');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!emailRegex.test(emailValue)) {
            formFeedback.style.color = 'red';
            formFeedback.textContent = 'Please enter a valid email address.';
            return; 
        }

        const existingUsers = JSON.parse(localStorage.getItem('freshPrepUsers')) || [];
        const userExists = existingUsers.some(user => user.email === emailValue);

        if (userExists) {
            formFeedback.style.color = 'red';
            formFeedback.textContent = 'This email is already registered!';
        } else {
            const newUser = {
                email: emailValue,
                password: passwordValue 
            };

            existingUsers.push(newUser);
            localStorage.setItem('freshPrepUsers', JSON.stringify(existingUsers));

            formFeedback.style.color = 'var(--primary-color)';
            formFeedback.textContent = 'Success! Your kitchen profile is created.';
            registerForm.reset();
        }
    });

    const groceryInput = document.getElementById('grocery-input');
    const addGroceryBtn = document.getElementById('add-grocery-btn');
    const groceryItemsList = document.getElementById('grocery-items');
    const clearAllBtn = document.getElementById('clear-all-btn');

    addGroceryBtn.addEventListener('click', () => {
        const itemText = groceryInput.value.trim();
        
        if (itemText !== '') {
            const li = document.createElement('li');
            li.textContent = itemText;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.style.padding = '0.2rem 0.5rem';
            deleteBtn.style.backgroundColor = '#e74c3c';
            deleteBtn.style.marginTop = '0';
            
            deleteBtn.addEventListener('click', () => {
                li.remove();
            });

            li.appendChild(deleteBtn);
            groceryItemsList.appendChild(li);
            
            groceryInput.value = '';
        }
    });

    clearAllBtn.addEventListener('click', () => {
        groceryItemsList.innerHTML = '';
    });

    const recipeContainer = document.getElementById('recipe-container');

    async function fetchDailyRecipe() {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            const recipe = data.meals[0];

            recipeContainer.innerHTML = `
                <h3>${recipe.strMeal}</h3>
                <p><strong>Category:</strong> ${recipe.strCategory}</p>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <a href="${recipe.strSource || recipe.strYoutube || '#'}" target="_blank" style="display:inline-block; margin-top:1rem; color:var(--primary-color); font-weight:bold;">View Full Recipe</a>
            `;
        } catch (error) {
            console.error('Error fetching:', error);
            recipeContainer.innerHTML = `<p style="color:red;">Recipe couldn't be loaded, try again later.</p>`;
        }
    }

    fetchDailyRecipe();

    const recipeGrid = document.getElementById('recipe-grid');
    const randomizeBtn = document.getElementById('randomize-btn');

    async function fetchMultipleRandomRecipes(count = 3) {
        recipeGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Loading new recipes...</p>';
        
        try {
            const fetchPromises = Array.from({ length: count }, () =>
                fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
            );
            
            const results = await Promise.all(fetchPromises);
            
            recipeGrid.innerHTML = '';
            
            results.forEach(data => {
                const recipe = data.meals[0];
                const card = document.createElement('div');
                card.className = 'recipe-card-small';
                
                const recipeLink = recipe.strSource || recipe.strYoutube || '#';
                
                card.innerHTML = `
                    <div>
                        <h3>${recipe.strMeal}</h3>
                        <p><strong>Category:</strong> ${recipe.strCategory}</p>
                    </div>
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <a href="${recipeLink}" target="_blank" style="display:inline-block; color:var(--primary-color); font-weight:bold; text-decoration: none;">View Full Recipe</a>
                `;
                recipeGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching multiple recipes:', error);
            recipeGrid.innerHTML = `<p style="color:red; grid-column: 1 / -1; text-align: center;">Recipes couldn't be loaded, try again later.</p>`;
        }
    }

    randomizeBtn.addEventListener('click', () => fetchMultipleRandomRecipes(3));

    fetchMultipleRandomRecipes(3);

});