const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function loadPerson(){

const { data } = await supabase
.from("mdt")
.select("*")
.eq("id",id)
.single()

displayPerson(data)

}

function displayPerson(p){

const container = document.getElementById("person")

container.innerHTML = `
<h1>${p.prenom} ${p.nom}</h1>

<img src="${p.photo}" style="width:200px">

<p>Téléphone : ${p.telephone}</p>

<p>Organisation : ${p.organisation}</p>
<p>Rang organisation : ${p.rangorganisation}</p>

<p>Entreprise : ${p.entreprise}</p>
<p>Rang entreprise : ${p.rangentreprise}</p>

<p>${p.notes}</p>
`

}

loadPerson()