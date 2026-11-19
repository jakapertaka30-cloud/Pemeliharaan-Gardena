import { equipment } from "./config.js";
const $ = id => document.getElementById(id);
let editingId = null;

function readForm(){
 return {
  equipmentId:$("equipmentInput").value,date:$("dateInput").value,type:$("typeInput").value,
  condition:$("conditionInput").value.trim(),cause:$("causeInput").value.trim(),
  action:$("actionInput").value.trim(),parts:$("partsInput").value.trim(),
  person:$("personInput").value.trim(),responseHours:Number($("responseInput").value||0),
  downtimeHours:Number($("downtimeInput").value||0),cost:Number($("costInput").value||0),
  verification:$("verificationInput").value,nextDate:$("nextDateInput").value
 };
}
function fillForm(record){
 const values={equipmentInput:record.equipmentId,dateInput:record.date,typeInput:record.type,
 conditionInput:record.condition,causeInput:record.cause,actionInput:record.action,
 partsInput:record.parts,personInput:record.person,responseInput:record.responseHours,
 downtimeInput:record.downtimeHours,costInput:record.cost,verificationInput:record.verification,
 nextDateInput:record.nextDate};
 Object.entries(values).forEach(([id,value])=>$(id).value=value??"");
}
export function setupForm({getRecords,setRecords,rerender}){
 const dialog=$("maintenanceDialog"),form=$("maintenanceForm");
 $("addMaintenanceBtn").addEventListener("click",()=>{
  editingId=null;form.reset();$("formTitle").textContent="Catat Maintenance";
  const today=new Date();
  $("dateInput").value=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  $("responseInput").value="0";$("downtimeInput").value="0";$("costInput").value="0";
  dialog.showModal();
 });
 ["closeDialogBtn","cancelBtn"].forEach(id=>$(id).addEventListener("click",()=>dialog.close()));
 form.addEventListener("submit",event=>{
  event.preventDefault();
  const item=readForm();
  if(!item.date||!item.condition||!item.action){alert("Tanggal, gangguan/kondisi, dan tindakan wajib diisi.");return;}
  const records=getRecords();
  if(editingId!==null){
   const index=records.findIndex(record=>record.id===editingId);
   if(index>=0)records[index]={...records[index],...item};
  } else records.push({...item,id:Date.now()});
  setRecords(records);dialog.close();rerender();
 });
 // Delegated handlers: reliably survive table rerender.
 $("historyBody").addEventListener("click",event=>{
  const edit=event.target.closest("[data-edit]");
  if(edit){
   const id=Number(edit.dataset.edit),record=getRecords().find(r=>r.id===id);
   if(record){editingId=id;fillForm(record);$("formTitle").textContent="Edit Catatan Maintenance";dialog.showModal();}
   return;
  }
  const del=event.target.closest("[data-delete]");
  if(del){
   const id=Number(del.dataset.delete);
   if(confirm("Hapus catatan ini?")){setRecords(getRecords().filter(r=>r.id!==id));rerender();}
  }
 });
}
