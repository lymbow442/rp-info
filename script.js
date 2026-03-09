import { supabase } from './config.js'

let data = []
let users = []
let selected = null

// Charger utilisateurs assignables
async function loadUsers(){
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  users = authUsers
  const assignedSelect = document.getElementById("assigned")
  assignedSelect.innerHTML = '<option value="">Assignée à...</option>'
  users.forEach(u=>{
    const opt = document.createElement("option")
    opt.value = u.id
    opt.textContent = u.email || u.user_metadata?.pseudo || u.id
    assignedSelect.appendChild(opt)
  })
}

// Charger les fiches
async function loadData(){
  const { data: persons, error } = await supabase
    .from('personnes')
    .select('*')
    .order('nom',{ascending:true})
  if(error){alert(error.message); return}
  data = persons
  render()
}

// Rendu tableau
function render(list=data){
  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""
  list.forEach((p,i)=>{
    const row = document.createElement("tr")
    row.innerHTML=`<td>${p.nom}</td><td>${p.prenom}</td><td>${p.orga}</td><td>${p.statut}</td>`
    row.onclick=()=>showDossier(i)
    tbody.appendChild(row)
  })
}

// Afficher fiche
function showDossier(i){
  selected = i
  const p = data[i]
  const div = document.getElementById("dossier")
  const assignedUser = users.find(u=>u.id===p.assigned)?.email || p.assigned || "Non assignée"
  div.innerHTML=`
    <h2>${p.nom} ${p.prenom}</h2>
    ${p.photo?`<img src="${p.photo}" onclick="viewImage('${p.photo}')">`:''}
    <p><b>Orga :</b> ${p.orga}</p>
    <p><b>Rang :</b> ${p.rang}</p>
    <p><b>Téléphone :</b> ${p.phone}</p>
    <p><b>Statut :</b> ${p.statut}</p>
    <p><b>Assignée à :</b> ${assignedUser}</p>
    <h3>Notes</h3><p>${p.notes}</p>
    <button onclick="editPerson()">Modifier</button>
    <button onclick="deletePerson()">Supprimer</button>
  `
}

function openForm(){document.getElementById("form").classList.toggle("hidden")}

// Ajouter / Modifier fiche
async function savePerson(){
  const file = document.getElementById("photo").files[0]
  let photoURL = selected!==null?data[selected].photo:null
  if(file){
    const { data: uploadData, error: upErr } = await supabase.storage
      .from('photos')
      .upload(`personnes/${Date.now()}_${file.name}`, file)
    if(upErr){alert(upErr.message); return}
    const { publicURL } = supabase.storage.from('photos').getPublicUrl(uploadData.path)
    photoURL = publicURL
  }
  const p = {
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    orga: document.getElementById("orga").value,
    rang: document.getElementById("rang").value,
    phone: document.getElementById("phone").value,
    statut: document.getElementById("statut").value,
    notes: document.getElementById("notes").value,
    photo: photoURL,
    assigned: document.getElementById("assigned").value || null
  }
  if(selected!==null){
    const { error } = await supabase.from('personnes').update(p).eq('id', data[selected].id)
    if(error){alert(error.message); return}
  } else {
    const { error } = await supabase.from('personnes').insert(p)
    if(error){alert(error.message); return}
  }
  selected = null
  document.getElementById("form").classList.add("hidden")
  loadData()
}

// Modifier fiche
function editPerson(){
  const p = data[selected]
  document.getElementById("nom").value=p.nom
  document.getElementById("prenom").value=p.prenom
  document.getElementById("orga").value=p.orga
  document.getElementById("rang").value=p.rang
  document.getElementById("phone").value=p.phone
  document.getElementById("statut").value=p.statut
  document.getElementById("notes").value=p.notes
  document.getElementById("assigned").value=p.assigned || ""
  document.getElementById("form").classList.remove("hidden")
}

// Supprimer fiche
async function deletePerson(){if(confirm("Supprimer ?")){
  const { error } = await supabase.from('personnes').delete().eq('id', data[selected].id)
  if(error){alert(error.message); return}
  selected=null
  loadData()
}}

// Zoom photo
function viewImage(src){document.getElementById("bigImage").src=src; document.getElementById("imageViewer").classList.remove("hidden")}
function closeViewer(){document.getElementById("imageViewer").classList.add("hidden")}

// Recherche
document.getElementById("search").addEventListener("input",e=>{
  const val = e.target.value.toLowerCase()
  render(data.filter(p=>p.nom.toLowerCase().includes(val)||p.prenom.toLowerCase().includes(val)||p.orga.toLowerCase().includes(val)))
})

// Tri
document.getElementById("sort").addEventListener("change",e=>{
  const val=e.target.value
  const sorted=[...data]
  if(val==="nom"){sorted.sort((a,b)=>a.nom.localeCompare(b.nom))}
  if(val==="orga"){sorted.sort((a,b)=>a.orga.localeCompare(b.orga))}
  render(sorted)
})

// Initialisation
loadUsers().then(loadData)