import { formatMoney,formatNumber } from "./utils.js";
export function renderKpis(records){
 const totalDowntime=records.reduce((sum,r)=>sum+Number(r.downtimeHours||0),0);
 const totalResponse=records.reduce((sum,r)=>sum+Number(r.responseHours||0),0);
 const totalCost=records.reduce((sum,r)=>sum+Number(r.cost||0),0);
 const items=[[records.length,"Total catatan gangguan"],[`${formatNumber(totalDowntime)} jam`,"Total downtime"],[`${formatNumber(totalResponse/Math.max(1,records.length))} jam`,"Rata-rata respons"],[formatMoney(totalCost),"Total biaya perbaikan"]];
 document.querySelector("#kpiGrid").innerHTML=items.map(([value,label])=>`<article class="kpi-card"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div></article>`).join("");
}
