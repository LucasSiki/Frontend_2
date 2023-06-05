const api = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
  });
  
  async function totalInformation(endpoint) {
    const res = await api.get(endpoint);
    if (res.status === 200) {
      return res.data.info.count;
    } else {
      console.log(res.error);
      return 0;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    //
    updateTotalInformation();
    search(event);
  });

  let pageNow = 1;
  let pageTotal = 1;
  
  async function updateTotalInformation() {
    const characterCount = await totalInformation("/character");
    const locationCount = await totalInformation("/location");
    const episodeCount = await totalInformation("/episode");
  
    document.getElementById("characters").textContent = characterCount;
    document.getElementById("locations").textContent = locationCount;
    document.getElementById("episodes").textContent = episodeCount;
  }

  async function search(event) {
    event.preventDefault();
  
    let searchBar = document.getElementById("search-text").value;
  
    let apiUrl = "https://rickandmortyapi.com/api/character";
    let params = {
      page: pageNow,
    };
  
    if (searchBar) {
      params.name = searchBar;
    }
  
    try {
      const res = await api.get(apiUrl, { params });
      const filterCharacter = res.data.results;
      let cards = document.querySelector(".cards-box");
      cards.innerHTML = "";
  
      for (const character of filterCharacter) {
        const episodeRes = await axios.get(character.episode[0]);
        const episode = episodeRes.data.name;
  
        let status_Color = ""; 
  
        if (character.status === "Alive") {
          status_Color= "green-status";
        } else if (character.status === "Dead") {
          status_Color = "red-status";
        } else {
          status_Color = "gray-status";
        }
  
        cards.innerHTML += `
          <div class="card">
            <img src="https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg"/>
            <div class="informations">
              <div class="name">${character.name}</div> 
              <div class="status">
                <div class="status-Color ${status_Color}"></div>
                <div class="status-Text">${character.status} - ${character.species}</div>
              </div>
              <div class="lastCharaterLocation">
                <p>Last known location:</p>
                <span>${character.location.name}</span>
              </div>
              <div>
                <p>Last seen on:</p>
                <span>${episode}</span>
              </div>
            </div>
          </div>`;
  
        if (
          (filterCharacter.indexOf(character) + 1) % 2 === 0 &&
          filterCharacter.indexOf(character) !== filterCharacter.length - 1
        ) {
          cards.innerHTML += `<hr class="line"/>`;
        }
      }
  
      const pagination = res.data.info;
      pageTotal = pagination.pages;
      
    if (res.data.info.next) {
      const remainingPages = res.data.info.pages - res.data.info.next.split("=")[1] + 1;
      
      for (let i = 1; i <= remainingPages; i++) {
        const nextPageRes = await api.get(apiUrl, { params: { ...params, page: i + 1 } });
        const nextPageCharacters = nextPageRes.data.results;
        
      }
    }

    document.getElementById("characters").textContent = totalCharacters;
      navigationBtn();
    } catch (error) {
      console.log(error);
    }
  }
  
  function back() {
    if (pageNow > 1) {
      pageNow--;
      search(event);
    }
  }

  function next(){
    if (pageNow < pageTotal) {
      pageNow++;
      search(event);
    }
  }
  
  

