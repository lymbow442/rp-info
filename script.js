let people=[]
let editing=null

function openForm(){
document.getElementById("popup").style.display="block"
}

function closeForm(){
document.getElementById("popup").style.display="none"
}

async function loadPeople(){

const { data } = await supabase
.from("mdt")
.select("*")

people=data

display(data)

}

function display(list){

const container=document.getElementById("cards")
container.innerHTML=""

list.forEach(p=>{

container.innerHTML+=`

<div class="card">

<img src="${p.photo}" onclick="zoom('${p.photo}')">

<h3 onclick="openPerson('${p.id}')">${p.prenom} ${p.nom}</h3>

<p>☎ ${p.telephone}</p>

<p>Organisation : ${p.organisation}</p>
<p>Rang : ${p.rangorganisation}</p>

<p>Entreprise : ${p.entreprise}</p>
<p>Rang : ${p.rangentreprise}</p>

<p>${p.notes}</p>

<button onclick="edit('${p.id}')">Modifier</button>
<button onclick="remove('${p.id}')">Supprimer</button>

</div>
`
})

}

function zoom(src){
document.getElementById("photoViewer").style.display="flex"
document.getElementById("bigPhoto").src=src
}

function closeViewer(){
document.getElementById("photoViewer").style.display="none"
}

function openForm(){
editing=null
document.getElementById("popup").style.display="block"
}

function closeForm(){
document.getElementById("popup").style.display="none"
}

function advancedSearch(){

let name=search.value.toLowerCase()

let org=filterOrganisation.value
let ent=filterEntreprise.value

let filtered=people.filter(p=>{

return (

(p.nom.toLowerCase().includes(name) ||
p.prenom.toLowerCase().includes(name))

&&

(org=="" || p.organisation==org)

&&

(ent=="" || p.entreprise==ent)

)

})

display(filtered)

}

function compressImage(file){

const canvas=document.createElement("canvas")
const ctx=canvas.getContext("2d")

const img=new Image()

img.onload=()=>{

canvas.width=800
canvas.height=(img.height/img.width)*800

ctx.drawImage(img,0,0,canvas.width,canvas.height)

canvas.toBlob(blob=>{

upload(blob)

},"image/jpeg",0.7)

}

img.src=URL.createObjectURL(file)

}

async function savePerson(){

let photoFile=document.getElementById("photo").files[0]
let photoURL=""

if(photoFile){

let name=Date.now()+photoFile.name

await supabase.storage
.from("photos")
.upload(name,photoFile)

photoURL=`${SUPABASE_URL}/storage/v1/object/public/photos/${name}`

}

const person={

prenom:prenom.value,
nom:nom.value,
telephone:telephone.value,

organisation:organisation.value,
rangorganisation:rangOrganisation.value,

entreprise:entreprise.value,
rangentreprise:rangEntreprise.value,

notes:notes.value,
photo:photoURL

}

if(editing){

await supabase
.from("mdt")
.update(person)
.eq("id",editing)

}else{

await supabase
.from("mdt")
.insert(person)

}

closeForm()
loadPeople()

}

async function remove(id){

await supabase
.from("mdt")
.delete()
.eq("id",id)

loadPeople()

}

function edit(id){

let p=people.find(x=>x.id==id)

editing=id

prenom.value=p.prenom
nom.value=p.nom
telephone.value=p.telephone
organisation.value=p.organisation
rangOrganisation.value=p.rangorganisation
entreprise.value=p.entreprise
rangEntreprise.value=p.rangentreprise
notes.value=p.notes

openForm()

}

search.addEventListener("input",e=>{

let v=e.target.value.toLowerCase()

let filtered=people.filter(p=>

p.nom.toLowerCase().includes(v)||
p.prenom.toLowerCase().includes(v)||
p.telephone.includes(v)

)

display(filtered)

})

loadPeople()

const dropzone=document.getElementById("dropzone")

dropzone.addEventListener("dragover",(e)=>{
e.preventDefault()
})

dropzone.addEventListener("drop",(e)=>{
e.preventDefault()

document.getElementById("files").files=e.dataTransfer.files
})


async function addHistory() {
  await supabase.from("history").insert({
    person_id: id,
    action: "Modification fiche",
    date: new Date()
  })
}

addHistory()

function openPerson(id){
window.location="person.html?id="+id

}
