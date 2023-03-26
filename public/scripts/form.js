window.onload = () => {
    document.getElementById("body").removeAttribute("class")
    document.getElementById("formICS").addEventListener("submit", submitFormICS)
};

const submitFormICS = (event) => {
    event.preventDefault()
    try { // if error div is showing
        let errorDiv = document.querySelector("#formICS .errorDiv")
        errorDiv.classList.remove("show");
    } catch (e) {
    }

    const formData = new FormData(event.target); // Récupère les données du formulaire
    const urlReq = `${event.target.action}?${new URLSearchParams(formData).toString()}`; // Ajoute les paramètres GET à l'URL
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