
$(document).ready(function () {
    const loader = $(".my-spinner");
    const spinner = $(".my-spinner-2");
    const leftNav = $(".left-nav");
    const openCloseIcon = $(".open-close-icon");

    loader.fadeOut(1000, function () {
        loader.removeClass("d-flex");
        $("body").css("overflow", "visible");
    });
    getMealsBySearch("")

    $(".change-icon .open-close-icon").click(function () {
        $(this).toggleClass("fa-x fa-align-justify");

        if (leftNav.css("left") == "-250px") {
            leftNav.animate({ left: "0px" }, 500);
            openCloseIcon.animate({ left: "0%" }, 500);
            $(".right-nav").animate({ left: "82%" }, 500);

            $('nav a').each(function (index) {
                if (index === 0) {
                    $(this).delay(200).animate({
                        opacity: 1,
                        top: "0px"
                    }, 250);
                } else {
                    $(this).delay(300 * index).animate({
                        opacity: 1,
                        top: "0px"
                    }, 350);
                }
            });
        } else {
            const totalLinks = $('nav a').length;
            $('nav a').each(function (index) {
                $(this).delay(100 * (totalLinks - index)).animate({
                    opacity: 0,
                    top: "40px"
                }, 100);
            });

            leftNav.animate({ left: "-250px" }, 500);
            openCloseIcon.animate({ left: "100%" }, 500);
            $(".right-nav").animate({ left: "100%" }, 500);
        }
    });

    $(".left-nav a").click(function () {
        const targetSection = $(this).data("section");
        const selector = document.querySelector(`#${targetSection}`);
        if (selector.id == "meals") {
            document.querySelector(".my-input").classList.remove("d-none")
            document.querySelector(".row-food").classList.add("d-none")
        }
        if (selector) {
            const sections = ["#meals", "#categories", "#area", "#ingredients", "#contact-us"];
            sections.forEach(section => {
                document.querySelector(section).classList.add("d-none");
            });

            selector.classList.remove("d-none");
            $(".change-icon .open-close-icon").toggleClass("fa-x fa-align-justify");

            const totalLinks = $('nav a').length;
            $('nav a').each(function (index) {
                $(this).delay(100 * (totalLinks - index)).animate({
                    opacity: 0,
                    top: "40px"
                }, 100);
            });

            leftNav.animate({ left: "-250px" }, 500);
            openCloseIcon.animate({ left: "100%" }, 500);
            $(".right-nav").animate({ left: "100%" }, 500);
        }
    });

    $("#SearchByName").keyup(async function () {
        spinner.removeClass("d-none").addClass("d-flex");
        try {
            const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.value}`);
            const res = await Api.json();
            const fetchMeals = res.meals;

            displayMealsByName(fetchMeals);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            spinner.removeClass("d-flex").addClass("d-none");
        }
    });

    $("#SearchByLetter").keyup(async function () {
        spinner.removeClass("d-none").addClass("d-flex");
        try {
            const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${this.value}`);
            const res = await Api.json();
            const fetchAllMeals = res.meals;
            displayMealsByName(fetchAllMeals);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            spinner.removeClass("d-flex").addClass("d-none");
        }
    });

    $(".categories").click(async function () {
        spinner.removeClass("d-none").addClass("d-flex");
        try {
            const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
            const res = await Api.json();
            const fetchAllMeals = res.categories;
            displayCategories(fetchAllMeals);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            spinner.removeClass("d-flex").addClass("d-none");
        }
    });

    $(".area").click(async function () {
        spinner.removeClass("d-none").addClass("d-flex");
        try {
            const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
            const res = await Api.json();
            const fetchAllMeals = res.meals;
            displayArea(fetchAllMeals);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            spinner.removeClass("d-flex").addClass("d-none");
        }
    });
    $(".ingredients").click(async function () {
        spinner.removeClass("d-none").addClass("d-flex");
        try {
            const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
            const res = await Api.json();
            const fetchAllMeals = res.meals.slice(0, 20);
            displayIngredients(fetchAllMeals)

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            spinner.removeClass("d-flex").addClass("d-none");
        }
    });

});

function displayMealsByName(meals) {
    let allMeals = "";

    for (const meal of meals) {
        allMeals += `
            <div class="col-md-3">
                <figure class="position-relative rounded-2 overflow-hidden my-card" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="w-100" alt="meal">
                    <figcaption class="des-img d-flex align-items-center rounded-2">
                        <h4 class="fw-bold text-black">${meal.strMeal}</h4>
                    </figcaption>
                </figure>
            </div>
        `;
    }
    document.querySelector(".row-food").classList.remove("d-none")
    document.querySelector(".row-food").innerHTML = allMeals;
    $(".my-card").click(function () {
        const idMeal = $(this).data('id');
        getDetails(idMeal);




    });
}

async function getDetails(idMeal) {
    const spinner = $(".my-spinner-2");
    spinner.removeClass("d-none").addClass("d-flex");
    try {
        const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        const res = await Api.json();
        const fetchAllMealsDetails = res.meals[0];
        displayDetails(fetchAllMealsDetails);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        spinner.removeClass("d-flex").addClass("d-none");
    }
}

function displayDetails(data) {
    const spinner = $(".my-spinner-2");
    spinner.removeClass("d-none").addClass("d-flex");
    const content = `
        <div class="col-md-4">
            <figure>
                <img src="${data.strMealThumb}" class="w-100 rounded-3" alt="">
                <figcaption>
                    <h3 class="text-white">${data.strMeal}</h3>
                </figcaption>
            </figure>
        </div>
        <div class="col-md-8">
            <article>
                <h3 class="fw-bold">Instructions</h3>
                <p class="fw-semibold">${data.strInstructions}</p>
                <h3 class="fw-bold">Area: ${data.strArea}</h3>
                <h3 class="fw-bold">Category: ${data.strCategory}</h3>
                <h3 class="fw-bold">Recipes:</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${data.strIngredient1 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure1} ${data.strIngredient1}</li>` : ''}
                    ${data.strIngredient2 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure2} ${data.strIngredient2}</li>` : ''}
                    ${data.strIngredient3 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure3} ${data.strIngredient3}</li>` : ''}
                    ${data.strIngredient4 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure4} ${data.strIngredient4}</li>` : ''}
                    ${data.strIngredient5 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure5} ${data.strIngredient5}</li>` : ''}
                    ${data.strIngredient6 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure6} ${data.strIngredient6}</li>` : ''}
                    ${data.strIngredient7 ? `<li class="alert alert-info m-2 p-1">${data.strMeasure7} ${data.strIngredient7}</li>` : ''}
                </ul>
                <h3 class="fw-bold">Tags: ${data.strTags ? data.strTags : "No Tags"}</h3>
                <ul class="list-unstyled d-flex flex-wrap g-3 mt-3">
                    <a target="_blank" href="${data.strSource}" class="btn btn-success me-2">Source</a>
                    <a target="_blank" href="${data.strYoutube}" class="btn btn-danger">Youtube</a>
                </ul>
            </article>
        </div>`;
    $(".row-details").html(content);


    const sections = ["#meals", "#categories", "#area", "#ingredients", "#contact-us"];
    sections.forEach(section => {
        document.querySelector(section).classList.add("d-none");

    });


    document.querySelector("#details").classList.remove("d-none");

}
document.querySelectorAll("nav a").forEach(navLink => {
    navLink.addEventListener("click", (event) => {
        event.preventDefault();
        const targetSection = event.target.getAttribute("href");


        const sections = ["#meals", "#categories", "#area", "#ingredients", "#contact-us"];
        sections.forEach(section => {
            document.querySelector(section).classList.add("d-none");
        });


        document.querySelector(targetSection).classList.remove("d-none");


        if (!document.querySelector("#details").classList.contains("d-none")) {
            document.querySelector("#details").classList.add("d-none");
        }
    });
});


function displayCategories(meals) {
    let allMeals = "";

    for (const meal of meals) {
        allMeals += `
            <div class="col-md-3">
                <figure class="my-card text-center position-relative overflow-hidden" data-categories="${meal.strCategory}" data-id="${meal.idCategory}">
                    <img src="${meal.strCategoryThumb}" class="w-100" alt="${meal.strCategory}">
                    <figcaption class="text-center text-black p-2 position-absolute top-0 w-100 h-100 rounded-2 des-img">
                        <h3>${meal.strCategory}</h3>
                        <p>${meal.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </figcaption>
                </figure>
            </div>
        `;
    }
    document.querySelector(".row-categories").innerHTML = allMeals;

    $(".my-card").click(function () {
        
        const datacat = $(this).data('categories');
        getCategoryMeals(datacat);
    });
}

async function getCategoryMeals(category) {
    const spinner = $(".my-spinner-2");
    document.querySelector(".row-categories").innerHTML = "";

    spinner.removeClass("d-none").addClass("d-flex");
    try {
        const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const res = await Api.json();
        displayMealsByCategory(res.meals);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        spinner.removeClass("d-flex").addClass("d-none");
    }
}

function displayMealsByCategory(meals) {
    let allMeals = "";

    for (const meal of meals) {
        allMeals += `
            <div class="col-md-3">
                <figure class="position-relative rounded-2 overflow-hidden my-card" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="w-100" alt="meal">
                    <figcaption class="des-img d-flex align-items-center rounded-2">
                        <h4 class="fw-bold text-black">${meal.strMeal}</h4>
                    </figcaption>
                </figure>
            </div>
        `;
    }

    document.querySelector(".row-categories").innerHTML = allMeals;
    $(".my-card").click(function () {
        const idMeal = $(this).data('id');
        getDetails(idMeal);

    });
}

function displayArea(areas) {
    let allArea = "";
    for (const area of areas) {
        allArea += `
            <div class="col-md-3">
                <figure class="text-center text-white my-card" data-area="${area.strArea}">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${area.strArea}</h3>
                </figure>
            </div>`;
    }
    $(".row-area").html(allArea);

    $(".my-card").click(function () {
        const dataArea = $(this).data('area');
        getAreaMeals(dataArea);
    });
}

async function getAreaMeals(area) {
    const spinner = $(".my-spinner-2");
    document.querySelector(".row-area").innerHTML = "";

    spinner.removeClass("d-none").addClass("d-flex");
    try {
        const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const res = await Api.json();
        displayMealsByArea(res.meals);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        spinner.removeClass("d-flex").addClass("d-none");
    }
}

function displayMealsByArea(meals) {
    let allMeals = "";

    for (const meal of meals) {
        allMeals += `
            <div class="col-md-3">
                <figure class="position-relative rounded-2 overflow-hidden my-card" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="w-100" alt="meal">
                    <figcaption class="des-img d-flex align-items-center rounded-2">
                        <h4 class="fw-bold text-black">${meal.strMeal}</h4>
                    </figcaption>
                </figure>
            </div>
        `;
    }

    document.querySelector(".row-area").innerHTML = allMeals;
    $(".my-card").click(function () {
        const idMeal = $(this).data('id');
        getDetails(idMeal);
    });
}

function displayIngredients(meals) {
    let allMeals = "";

    for (const meal of meals) {
        allMeals += `
            <div class="col-md-3">
                <figure class="my-card text-center position-relative overflow-hidden text-white" data-categories="${meal.strIngredient}">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${meal.strIngredient}</h3>
                        <p>${meal.strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </figure>
            </div>
        `;
    }
    document.querySelector(".row-ingredients").innerHTML = allMeals;

    $(".my-card").click(function () {
        const datacat = $(this).data('categories');
        console.log(datacat);
        getIngredientsMeals(datacat)
    });
}
async function getIngredientsMeals(category) {
    const spinner = $(".my-spinner-2");
    document.querySelector(".row-ingredients").innerHTML = "";

    spinner.removeClass("d-none").addClass("d-flex");
    try {
        const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${category}`);
        const res = await Api.json();
        const fetchAllMeals = res.meals;

        displayMealsByIngredients(fetchAllMeals);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        spinner.removeClass("d-flex").addClass("d-none");
    }
}


function displayMealsByIngredients(meals) {
    let allMeals = "";
    for (const meal of meals) {
        allMeals += `
        <div class="col-md-3">
            <figure class="position-relative rounded-2 overflow-hidden my-card" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" class="w-100" alt="meal">
                <figcaption class="des-img d-flex align-items-center rounded-2">
                    <h4 class="fw-bold text-black">${meal.strMeal}</h4>
                </figcaption>
            </figure>
        </div>
    `;
    }
    document.querySelector(".row-ingredients").innerHTML = allMeals;
    $(".my-card").click(function () {
        const idMeal = $(this).data('id');
        getDetails(idMeal);
    });
}


const nameRegax = /^[a-zA-Z0-9 ]{3,}$/;
const passwordRegax = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const Repassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegax = /^[0-9]{3,16}$/;
const ageRegax = /^(1[0-9]|[2-8][0-9]|90)$/;


const nameAlert = document.getElementById("nameAlert")
const passwordAlert = document.getElementById("passwordAlert")
const repasswordAlert = document.getElementById("repasswordAlert")
const emailAlert = document.getElementById("emailAlert")
const phoneAlert = document.getElementById("phoneAlert")
const ageAlert = document.getElementById("ageAlert")
const submitButton = document.getElementById("submitButton");

function validatePasswordsMatch() {
    const password = document.getElementById("userPassword").value;
    const repassword = document.getElementById("userRepassword").value;
    return password === repassword;
}

function validateForm() {
    return (
        nameRegax.test(document.getElementById("userName").value) &&
        emailRegax.test(document.getElementById("userEmail").value) &&
        phoneRegax.test(document.getElementById("userPhone").value) &&
        ageRegax.test(document.getElementById("userAge").value) &&
        passwordRegax.test(document.getElementById("userPassword").value) &&
        validatePasswordsMatch()
    );
}

function valid(element) {
    switch (element.id) {
        case 'userName':
            if (nameRegax.test(element.value)) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                nameAlert.classList.add("d-none");
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                nameAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        case 'userEmail':
            if (emailRegax.test(element.value)) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                emailAlert.classList.add("d-none");
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                emailAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        case 'userPhone':
            if (phoneRegax.test(element.value)) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                phoneAlert.classList.add("d-none");
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                phoneAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        case 'userAge':
            if (ageRegax.test(element.value)) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                ageAlert.classList.add("d-none");
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                ageAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        case 'userPassword':
            if (passwordRegax.test(element.value)) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                passwordAlert.classList.add("d-none");


                if (!validatePasswordsMatch()) {
                    repasswordAlert.classList.remove("d-none");
                    document.getElementById("userRepassword").classList.add('is-invalid');
                    document.getElementById("userRepassword").classList.remove('is-valid');
                } else {
                    repasswordAlert.classList.add("d-none");
                    document.getElementById("userRepassword").classList.remove('is-invalid');
                    document.getElementById("userRepassword").classList.add('is-valid');
                }
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                passwordAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        case 'userRepassword':
            if (validatePasswordsMatch()) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
                repasswordAlert.classList.add("d-none");
            } else {
                element.classList.add('is-invalid');
                element.classList.remove('is-valid');
                repasswordAlert.classList.remove("d-none");
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.remove("btn-success")
                submitButton.classList.add("btn-danger")
            }
            break;

        default:
            return;
    }


    if (validateForm()) {

        submitButton.removeAttribute('disabled');
        submitButton.classList.add("btn-success")
        submitButton.classList.remove("btn-danger")
    } else {
        submitButton.setAttribute('disabled');
        submitButton.classList.remove("btn-success")
        submitButton.classList.add("btn-danger")
    }
}

async function getMealsBySearch(value) {
    try {
        const Api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
        const res = await Api.json();
        const fetchMeals = res.meals;
        document.querySelector(".my-input").classList.add("d-none")

        displayMealsByName(fetchMeals);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        console.log("fetched");
    }
}

