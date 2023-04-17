window.onload = () => {
    document.getElementById("body").removeAttribute("class")
    document.getElementById("formICS").addEventListener("submit", submitFormICS)
    document.getElementById("url").addEventListener("change", urlCompeleted)
};

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

const submitFormICS = (event) => {
    event.preventDefault()
    try { // if error div is showing
        let errorDiv = document.querySelector("#formICS .errorDiv")
        errorDiv.classList.remove("show");
    } catch (e) {}

    const formData = new FormData(event.target) // Récupère les données du formulaire
    let params =new URLSearchParams(formData)
    let url  = params.get("url")
    let paramString
    if(url){
        params.delete("url")
        paramString = url.split("?")[1]
        if ( !paramString.includes("saison") &&
            !paramString.includes("poule") &&
            !paramString.includes("codent")){
                let errorDiv = document.querySelector("#formICS .errorDiv")
                errorDiv.querySelector("p").innerText = "URL Invalide"
                errorDiv.classList.add("show")
            return
        }
        params.delete("url")
        params.delete("saison")
        params.delete("poule")
        params.delete("codent")
        paramString += "&"+params.toString()
    }else{
        paramString = params.toString()
    }
    const urlReq = `${event.target.action}?${paramString}` // Ajoute les paramètres GET à l'URL
    let filename = "file.ics"

    fetch(urlReq)
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
    });
};