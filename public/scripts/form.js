window.onload = () => {
    document.getElementById("body").removeAttribute("class")
    document.getElementById("formICS").addEventListener("submit", submitFormICS)
    document.getElementById("url").addEventListener("change", urlCompeleted)
    document.getElementById("searchTeams").addEventListener("click", searchTeams)
    document.getElementById("generateTeams").addEventListener("click", submitFormICS)
};

function setLoadingState(button) {
    button.textContent = "Chargement...";
    button.disabled = true;
    document.getElementsByTagName("body")[0].classList.add("loading");
}

function unsetLoadingState(button) {
    button.textContent = button.id === "searchTeams" ? "Chercher les Équipes" : "Générer";
    button.disabled = false;
    document.getElementsByTagName("body")[0].classList.remove("loading");
}

const urlCompeleted = (event) => {
    event.preventDefault()
    const paramsElement  = document.querySelectorAll(".paramPoule:nth-child(1) div:nth-child(1) .input-container .input")
    if(event.target.value){
        paramsElement.forEach( (el )=>{
            el.removeAttribute("required")
        })
    }else{
        paramsElement.forEach( (el )=>{
            el.setAttribute("required","")
        })
    }
}

const hideError = () => {
    try { // if error div is showing
        let errorDiv = document.querySelector("#formICS .errorDiv")
        errorDiv.classList.remove("show");
    } catch (e) {}
}
const buildParamffvb = (form) => {
    const formData = new FormData(form)
    let params =new URLSearchParams(formData)
    let url  = params.get("url")
    let paramString
    if(url){
        params.delete("url")
        try{
            paramString = url.split("?")[1]
            if ( !paramString.includes("saison") ||
                !paramString.includes("poule") ||
                !paramString.includes("codent")){
                throw new Error('Missing parameter in url');
            }
        }catch (e) {
            let errorDiv = document.querySelector("#formICS .errorDiv")
            errorDiv.querySelector("p").innerText = "URL Invalide"
            errorDiv.classList.add("show")
            console.error("URL Invalide")
            return false
        }
        params.delete("url")
        params.delete("saison")
        params.delete("poule")
        params.delete("codent")
        paramString += "&"+params.toString()
    }else{
        paramString = params.toString()
    }
    return paramString
}
const searchTeams = (event) => {
    event.preventDefault()
    setLoadingState(event.target);
    hideError()
    const urlReq = `api/getteams?${buildParamffvb(event.target.form)}` // Ajoute les paramètres GET à l'URL
    if (!urlReq) return;

    fetch(urlReq.toString())
        .then(async response => {
            if (!response.ok) {
                let resJson = await response.json()
                throw new Error(resJson.message);
            }
            const teamArray = (await response.json()).data
            return replaceTeamWithSelect(teamArray);
        }).then( () => {
            unsetLoadingState(event.target);
    })
}

const replaceTeamWithSelect = (teamsArray) => {
    const teamDiv = document.getElementById("team-div");

// Étape 3 : Créer un nouvel élément <select>
    const selectTeam = document.createElement("select");
    selectTeam.setAttribute("id", "team");
    selectTeam.setAttribute("type", "text");
    selectTeam.setAttribute("name", "team");

// Étape 4 : Parcourir la liste de chaînes et créer les options
    teamsArray.forEach((chaine) => {
        const option = document.createElement("option");
        option.textContent = chaine;
        selectTeam.appendChild(option);
    });

// Étape 5 : Remplacer l'élément <input> par l'élément <select> dans le DOM
    teamDiv.innerHTML = selectTeam.outerHTML
   // inputTeam.replaceWith(selectTeam);
    return true
}



const submitFormICS = (event) => {
    event.preventDefault()
    setLoadingState(event.target);
    hideError()
    const urlReq = `api/calendar/ics?${buildParamffvb(event.target.form)}` // Ajoute les paramètres GET à l'URL
    let filename = "file.ics"

    if (!urlReq) return;

    fetch(urlReq.toString())
        .then(async response => {
            if (!response.ok) {
                let resJson = await response.json()
                throw new Error(resJson.message);
            }
            const disposition = response.headers.get("content-disposition");
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : filename; // Si le nom de fichier n'est pas présent dans la réponse, utilisez un nom de fichier par défaut.
            const contentType = response.headers.get("content-type");
            if (contentType.includes("application/json")) {
                return response.json();
            } else {
                return response.blob();
            }
        })
        .then(data => {
            if (data instanceof Blob) {
                // Traitement du fichier
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(data);
                downloadLink.download = filename;
                downloadLink.click();
            } else {
                // Traitement du JSON
                console.log("Données reçues :", data);
            }
        }).catch(error => {
        let form = document.querySelector("#formICS")
        let errorDiv = form.querySelector(".errorDiv")
        errorDiv.querySelector("p").innerText = error.message
        errorDiv.classList.add("show");
        console.error(`${error.message}`);
        return;
    }).then(()=> {
        unsetLoadingState(event.target);
    });
};