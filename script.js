// Vérifie la session au chargement
window.addEventListener("load", async () => {

const { data } = await db.auth.getSession()

if (data.session) {

openApp()

}

})


// Connexion utilisateur
async function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

const { data, error } = await db.auth.signInWithPassword({

email: email,
password: password

})

if(error){

alert("Erreur connexion : " + error.message)
return

}

openApp()

}



// ouvre l'application
function openApp(){

document.getElementById("loginPage").style.display="none"
document.getElementById("app").style.display="block"

loadPersons()

}



// ajout personne
async function createPerson(){

let file = document.getElementById("photo").files[0]

let filename = Date.now()+"_"+file.name

// upload photo
await db.storage
.from("photos")
.upload(filename, file)

const { data } = db.storage
.from("photos")
.getPublicUrl(filename)


let person = {

firstname: document.getElementById("firstname").value,
lastname: document.getElementById("lastname").value,
birthdate: document.getElementById("birthdate").value,
phone: document.getElementById("phone").value,
organization: document.getElementById("organization").value,
rank_org: document.getElementById("rank_org").value,
company: document.getElementById("company").value,
note: document.getElementById("note").value,
photo: data.publicUrl

}

const { error } = await db
.from("persons")
.insert([person])

if(error){

alert(error.message)
return

}

loadPersons()

}



// charger les personnes
async function loadPersons(){

const { data, error } = await db
.from("persons")
.select("*")
.order("lastname")

if(error){

console.error(error)
return

}

let content = document.getElementById("content")

content.innerHTML = ""

data.forEach(p=>{

content.innerHTML += `

<div class="card">

<img src="${p.photo}" width="100">

<h3>${p.firstname} ${p.lastname}</h3>

<p>${p.organization || ""}</p>

</div>

`

})

}