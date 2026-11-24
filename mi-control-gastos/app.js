const STORAGE_KEY = "mi-finanzas-transacciones-v1";
const categories = {
  expense: ["Alimentación","Transporte","Vivienda","Servicios","Salud","Educación","Entretenimiento","Compras","Otros"],
  income: ["Sueldo","Negocio","Freelance","Inversiones","Regalo","Otros"]
};
const colors = ["#0e7490","#42a5a0","#e9a23b","#8b78c8","#df7181","#6b9bd2","#9ab85c","#d58b55","#87949d"];
const $ = id => document.getElementById(id);
let transactions = loadTransactions();
let selectedType = "expense";

function loadTransactions(){
  try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }
function money(n){ return new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN"}).format(n); }
function localDate(d=new Date()){ const x=new Date(d.getTime()-d.getTimezoneOffset()*60000); return x.toISOString().slice(0,10); }
function monthNow(){ return localDate().slice(0,7); }
function monthTransactions(){ const m=$("monthFilter").value; return transactions.filter(t=>t.date.startsWith(m)); }
function showToast(message){ const t=$("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300); }

function populateCategories(){
  $("category").innerHTML = categories[selectedType].map(c=>`<option value="${c}">${c}</option>`).join("");
}
function setType(type){
  selectedType=type;$("type").value=type;
  document.querySelectorAll(".type-btn").forEach(b=>b.classList.toggle("active",b.dataset.type===type));
  $("submitBtn").textContent=type==="expense"?"Guardar gasto":"Guardar ingreso";
  populateCategories();
}
document.querySelectorAll(".type-btn").forEach(b=>b.addEventListener("click",()=>setType(b.dataset.type)));

function renderSummary(items){
  const income=items.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense=items.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  $("incomeValue").textContent=money(income);$("expenseValue").textContent=money(expense);$("balanceValue").textContent=money(income-expense);
  $("currentMonth").textContent=new Date($("monthFilter").value+"-02T12:00:00").toLocaleDateString("es-PE",{month:"long",year:"numeric"}).toUpperCase();
}
function renderChart(items){
  const expenses=items.filter(t=>t.type==="expense");
  const totals={};expenses.forEach(t=>totals[t.category]=(totals[t.category]||0)+t.amount);
  const entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);const total=expenses.reduce((s,t)=>s+t.amount,0);
  if(!total){$("categoryChart").innerHTML='<div class="empty-state">Registra gastos para ver tu distribución.</div>';$("categoryLegend").innerHTML="";return;}
  let start=0;const segments=entries.map(([name,val],i)=>{const end=start+val/total*100;const part=`${colors[i%colors.length]} ${start}% ${end}%`;start=end;return part;}).join(",");
  $("categoryChart").innerHTML=`<div class="donut" style="background:conic-gradient(${segments})"><div class="donut-label"><strong>${money(total)}</strong><span>Total gastado</span></div></div>`;
  $("categoryLegend").innerHTML=entries.map(([name,val],i)=>`<div class="legend-item"><i class="dot" style="background:${colors[i%colors.length]}"></i><span>${escapeHtml(name)}</span><strong>${Math.round(val/total*100)}%</strong></div>`).join("");
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderList(){
  const items=monthTransactions().filter(t=>{
    const q=$("searchInput").value.toLowerCase();const type=$("typeFilter").value;
    return (type==="all"||t.type===type)&&(`${t.description} ${t.category}`).toLowerCase().includes(q);
  }).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt-a.createdAt);
  $("transactionList").innerHTML=items.map(t=>`<tr><td>${escapeHtml(t.description)}</td><td>${escapeHtml(t.category)}</td><td>${new Date(t.date+"T12:00:00").toLocaleDateString("es-PE")}</td><td class="amount-cell ${t.type==="income"?"positive":"negative"}">${t.type==="income"?"+":"−"} ${money(t.amount)}</td><td><button class="delete-btn" data-delete="${t.id}" aria-label="Eliminar ${escapeHtml(t.description)}">Eliminar</button></td></tr>`).join("");
  $("emptyList").style.display=items.length?"none":"block";
  document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteTransaction(b.dataset.delete)));
}
function render(){const items=monthTransactions();renderSummary(items);renderChart(items);renderList();}
function deleteTransaction(id){if(!confirm("¿Eliminar este movimiento?"))return;transactions=transactions.filter(t=>t.id!==id);save();render();showToast("Movimiento eliminado.");}

$("transactionForm").addEventListener("submit",e=>{
  e.preventDefault();const description=$("description").value.trim();const amount=Number($("amount").value);const date=$("date").value;
  if(!description||!Number.isFinite(amount)||amount<=0||!date){showToast("Revisa los datos ingresados.");return;}
  transactions.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),type:selectedType,description,amount:Math.round(amount*100)/100,date,category:$("category").value,createdAt:Date.now()});
  save();$("transactionForm").reset();$("date").value=localDate();$("monthFilter").value=date.slice(0,7);setType("expense");render();showToast("Movimiento guardado en este dispositivo.");
});
$("monthFilter").value=monthNow();$("date").value=localDate();populateCategories();
$("monthFilter").addEventListener("change",render);$("searchInput").addEventListener("input",renderList);$("typeFilter").addEventListener("change",renderList);

function exportCsv(){
  const rows=[["Tipo","Descripción","Categoría","Fecha","Monto"],...transactions.map(t=>[t.type==="income"?"Ingreso":"Gasto",t.description,t.category,t.date,t.amount])];
  const csv="\uFEFF"+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
  downloadBlob(csv,"mis-movimientos.csv","text/csv;charset=utf-8");
}
function backup(){downloadBlob(JSON.stringify({app:"Mi Finanzas",version:1,exportedAt:new Date().toISOString(),transactions},null,2),"copia-mi-finanzas.json","application/json");}
function downloadBlob(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);showToast("Archivo descargado.");}
$("exportBtn").addEventListener("click",exportCsv);$("backupBtn").addEventListener("click",backup);

if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
render();