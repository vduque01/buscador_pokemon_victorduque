import "modern-css-reset";
import "./../assets/styles/tailwind.css";
import "./../assets/styles/style.css";
import "./../assets/styles/main.scss";
import "phosphor-icons";
import * as $ from "jquery";




// Buscador de pokemon

// Tenemos un input de texto y botón de enviar
// Buscamos Pokemon por su nombre
// Si el Pokemon existe, pintar una tarjeta en HTML con nombre, imagen y habilidades
// Si no existe, pintamos una tarjetita diciendpo que el Pokemon que buscas no existe,* y esta tarjetita nos da la posibilidad de resetear el 
// Tenemos que tener un histórico de las búsquedas que se han hecho. Hacer para el próximo día un diseño de el buscador en FIgma y de el histórico


window.addEventListener("load", () => {
    readLocalStorage();
    initFormEvents();
    initDeleteButtonEvents();
    initResetEvents();
})

let searchedPokemon = ""
let pokemon 
let resultPokemon
let pokemonArray = []
const form = document.querySelector("form")
const alert = document.querySelector(".alert_holder")
const deleteButton = alert.querySelector(".delete_button")
const resetButton = document.querySelector(".reset_button")
const historial = document.querySelector(".historial")
const cardsHistorialHolder = document.querySelector(".cards_historial")
const cardsResultHolder = document.querySelector(".result_pokemon")


// const loader = document.querySelector(".loader")


const readLocalStorage = () => {
    const isPokemonSet = localStorage.getItem("pokemonArray") !== null
    // Si en el localstorage hay, se hace el parse
    if (isPokemonSet) {
        pokemonArray = JSON.parse(localStorage.getItem("pokemonArray"))
    }

    renderHistorialPokemon()
}

const initFormEvents = () => {
    form.addEventListener("submit", (ev) => {
        ev.preventDefault()
        const input = form.querySelector("input")
        searchedPokemon = input.value
        fetchPokemon();
    })
}

const initResetEvents = () => {
    resetButton.addEventListener("click", () => {
        alert.classList.add("hidden")
        
        localStorage.clear()
        pokemonArray = []
        cardsHistorialHolder.innerHTML = ""

        // resultPokemon = ""
        // cardsResultHolder.innerHTML = ""
    })
}

const fetchPokemon = async () => {
    
    // Combinamos la URL del API con el valor que el usuario pone en el input
    const url = "https://pokeapi.co/api/v2/pokemon/" + searchedPokemon

    // Escondemos el loader cada vez que se ejecuta la función
    // loader.classList.remove(".hidden")

    // Aquí pedimos el Pokemon, y le ponemos await para indicarle al programa que no avance hasta que no complete esta tarea asíncrona. Cuando recibamos la petición, lo pasamos a JSON para tenerlo en "modo objeto" y poder acceder a la info que queramos.
    
    // Si todo va bien (then), o si todo va mal (catch)
    pokemon = await fetch(url)
        .then(pokemonData => pokemonData.json()).then(pokemonObject => {
            pokemon = pokemonObject

            pokemonArray.unshift(pokemon)
            localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray))
            renderHistorialPokemon()

            resultPokemon = pokemon
            renderResultPokemon()

            alert.classList.add("hidden")
            // console.log(pokemon)
            // loader.classList.add("hidden")
        })
        .catch(() => {
            renderError()
            pokemonArrayHTML = ""
            readLocalStorage()
            // loader.classList.add(".hidden")
        })
}

const renderHistorialPokemon = () => {
    let pokemonArrayHTML = ""
    pokemonArray.forEach(pokemon => {
        pokemonArrayHTML += `
        <div class="card">
            <div class="poke_sprite">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="poke_info">
            <div class="name_type">
                <h2 class="poke_name">
                <span class="number">#${pokemon.id}</span> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h2>
                <div class="types">
                    <div class="type">
                        <p>${pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}</p>
                    </div>
                    ${hasSecondType(pokemon)}
                </div>
            </div>

            <hr class="divider">
            <div class="poke_hab">
                <div class="hab">
                <p class="hab_title">HABILIDAD</p>
                <p class="hab_name">${pokemon.abilities[0].ability.name.replace("-", " ").charAt(0).toUpperCase() + pokemon.abilities[0].ability.name.replace("-", " ").slice(1)}</p>
                </div>
                <div class="hidden_hab">
                <p class="hidden_hab_title">HABILIDAD OCULTA</p>
                <p class="hidden_hab_name">${hasHiddenHab(pokemon)}</p>
                </div>
            </div>
            </div>
        </div>
        `
    })

    cardsHistorialHolder.innerHTML = pokemonArrayHTML
}

const renderResultPokemon = () => {
    let resultPokemonHTML = `
    <div class="card">
        <div class="poke_sprite">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div class="poke_info">
        <div class="name_type">
            <h2 class="poke_name">
            <span class="number">#${pokemon.id}</span> ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>
            <div class="types">
                <div class="type">
                    <p>${pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}</p>
                </div>
                ${hasSecondType(pokemon)}
            </div>
        </div>

        <hr class="divider">
        <div class="poke_hab">
            <div class="hab">
            <p class="hab_title">HABILIDAD</p>
            <p class="hab_name">${pokemon.abilities[0].ability.name.replace("-", " ").charAt(0).toUpperCase() + pokemon.abilities[0].ability.name.replace("-", " ").slice(1)}</p>
            </div>
            <div class="hidden_hab">
            <p class="hidden_hab_title">HABILIDAD OCULTA</p>
            <p class="hidden_hab_name">${hasHiddenHab(pokemon)}</p>
            </div>
        </div>
        </div>
    </div>
    `
    cardsResultHolder.innerHTML = resultPokemonHTML
}


const renderError = () => {
    alert.classList.remove("hidden")
    // cardsHistorialHolder.innerHTML = "" 
}


const hasSecondType = (pokemon) => {
    if(pokemon.types.length > 1){
        return `
        <div class="type">
            <p>${pokemon.types[1].type.name.charAt(0).toUpperCase() + pokemon.types[1].type.name.slice(1)}</p>
        </div>
        `
    } else {
        return ""
    }
}

const hasHiddenHab = (pokemon) => {
    if(pokemon.abilities.length > 1) {
        return pokemon.abilities[1].ability.name.replace("-", " ").charAt(0).toUpperCase() + pokemon.abilities[1].ability.name.replace("-", " ").slice(1)
    } else {
        return "Ninguna"
    }
}

const initDeleteButtonEvents = () => {
    deleteButton.addEventListener("click", () => {
        alert.classList.add("hidden")
        form.reset()
    })
}



