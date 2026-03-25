async function loadListing() {
  const response = await fetch("https://pokedextr.uwista.dev/pokemon");
  const pokemon = await response.json();
  displayListing(pokemon);
}
 
function displayListing(pokemon) {
  const listing = document.getElementById("listing");
  let html = "";
 
  for (let i = 0; i < pokemon.length; i++) {
    html += `
<a href="#${pokemon[i].name}" id="${pokemon[i].name}" onclick="getPokemon(${pokemon[i].id})" class="collection-item">${pokemon[i].name}</a>`;
  }
 
  listing.innerHTML = html;
}
 
async function getPokemon(id) {
  const response = await fetch(`https://pokedextr.uwista.dev/pokemon/${id}`);
  const pokemon = await response.json();
  displayPokemon(pokemon);
}
 
function displayPokemon(pokemon) {
  const result = document.getElementById("result");
 
  result.innerHTML = `
<div id="pokemon-detail" class="card col m12 l10 offset-l1" style="margin-top: 20px">
  <div class="card-image">
    <img class="teal" src="${pokemon.image}" alt="${pokemon.name} Image">
  </div>
  <div class="card-content">
    <span class="card-title"><p>${pokemon.name} #${pokemon.id}</p></span>
    <p>Type1: ${pokemon.type1}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Height: ${pokemon.height}</p>
    <a onclick="catchPokemon(${pokemon.id})" id="catchBtn" style="position:absolute; right:15px; bottom:80px" class="btn-floating btn-large waves-effect waves-light red">
      <span class="iconify" style="font-size:40px; margin-top:8px" data-icon="mdi-pokeball" data-inline="false"></span>
    </a>
  </div>
</div>`;
}
 
async function catchPokemon(pokemon_id) {
  const user_id = getId();
  const name = prompt("Please enter a name");
 
  if (!name) {
    return;
  }
 
  const url = `${server}/mypokemon/${user_id}`;
  const data = {
    pokemon_id: pokemon_id,
    name: name
  };
 
  await sendRequest(url, "POST", data);
  toast(`Successfully captured ${name}!`);
  getMyPokemon();
}
 
async function getMyPokemon() {
  const user_id = getId();
  const url = `${server}/mypokemon/${user_id}`;
  const mypokemon = await sendRequest(url, "GET");
  displayMyPokemon(mypokemon);
}
 
function displayMyPokemon(mypokemon) {
  const tbody = document.getElementById("myPokeListing");
  let rows = "";
 
  for (let i = 0; i < mypokemon.length; i++) {
    rows += `
<tr>
  <td>${mypokemon[i].name}</td>
  <td>${mypokemon[i].species}</td>
  <td>
    <button class="waves-effect waves-light btn" onclick="releasePokemon(${mypokemon[i].user_pokemon_id})">Release</button>
  </td>
</tr>`;
  }
 
  tbody.innerHTML = rows;
}
 
async function releasePokemon(user_pokemon_id) {
  const user_id = getId();
  const url = `${server}/mypokemon/${user_id}/${user_pokemon_id}`;
 
  await sendRequest(url, "DELETE");
  getMyPokemon();
  toast("Pokémon released!");
}
