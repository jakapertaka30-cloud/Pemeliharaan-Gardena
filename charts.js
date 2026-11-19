import { getEquipment,pmSchedule } from "./config.js";
import { formatNumber,escapeHtml } from "./utils.js";
function aggregate(records,key,metric){
 const totals=new Map();
 records.forEach(record=>{const label=key(record);if(label)totals.set(label,(totals.get(label)||0)+metric(record));});
 return [...totals.entries()].sort((a,b)=>b[1]-a[1]);
}
function drawChart(selector,items){
 const target=document.querySelector(selector);
 if(!items.length){target.innerHTML='<div class="empty">Belum ada data</div>';return;}
 const maxValue=Math.max(1,...items.map(item=>item[1]));
 target.innerHTML=items.map(([label,value])=>`<div class="chart-row"><span class="chart-label" title="${escapeHtml(label)}">${escapeHtml(label)}</span><div class="chart-track"><div class="chart-bar" style="width:${Math.max(2,value/maxValue*100)}%"></div></div><span class="chart-value">${formatNumber(value)}</span></div>`).join("");
}
export function renderCharts(records){
 drawChart("#chartFailures",aggregate(records,r=>getEquipment(r.equipmentId)?.name||r.equipmentId,()=>1));
 drawChart("#chartDowntime",aggregate(records,r=>getEquipment(r.equipmentId)?.name||r.equipmentId,r=>Number(r.downtimeHours||0)));
 drawChart("#chartParts",aggregate(records,r=>r.parts?.trim(),()=>1));
 const grouped={};pmSchedule.forEach(item=>(grouped[item.frequency]??=[]).push(item.name));
 document.querySelector("#pmSchedule").innerHTML=Object.entries(grouped).map(([frequency,names])=>`<div class="schedule-row"><span class="schedule-chip">${escapeHtml(frequency)} · ${names.length}</span><span class="schedule-equipment">${escapeHtml(names.join(", "))}</span></div>`).join("");
}
