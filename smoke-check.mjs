import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { initialRecords } from './maintenance-data.js';
import { equipment, pmSchedule, getEquipment } from './config.js';
import { renderKpis } from './dashboard.js';
import { renderCharts } from './charts.js';
import { renderTable, populateFilters } from './table.js';
import { formatDate, formatMoney, formatNumber, escapeHtml } from './utils.js';


const root = new URL('./', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');

const requiredIds = [
  'addMaintenanceBtn','printBtn','resetBtn','themeBtn','dataNotice','kpiGrid',
  'chartFailures','chartDowntime','chartParts','pmSchedule','recordCount',
  'searchInput','equipmentFilter','typeFilter','exportBtn','historyBody',
  'maintenanceDialog','maintenanceForm','formTitle','closeDialogBtn','equipmentInput',
  'dateInput','typeInput','conditionInput','causeInput','actionInput','partsInput',
  'personInput','responseInput','downtimeInput','costInput','verificationInput',
  'nextDateInput','cancelBtn'
];
const idList = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(idList).size, idList.length, 'HTML IDs must be unique');
for (const id of requiredIds) assert.ok(idList.includes(id), `Missing HTML ID: ${id}`);
assert.match(html, /<script\s+type="module"\s+src="\.\/app\.js"\s*>/);
for (const file of ['app.js','style.js','config.js','dashboard.js','charts.js','table.js','form.js','storage.js','utils.js','maintenance-data.js']) {
  await access(new URL(file, root));
}
assert.equal(initialRecords.length, 17, 'Seed data should contain 17 rows');
assert.equal(new Set(initialRecords.map(r => r.id)).size, initialRecords.length, 'Seed record IDs should be unique');
for (const r of initialRecords) {
  assert.ok(getEquipment(r.equipmentId), `Unknown equipment ID ${r.equipmentId}`);
  assert.ok(r.date && r.condition && r.action, `Missing required field in record ${r.id}`);
  assert.ok(['CM','PM'].includes(r.type), `Unexpected maintenance type ${r.type}`);
  for (const key of ['responseHours','downtimeHours','cost']) assert.ok(Number.isFinite(Number(r[key])) && Number(r[key]) >= 0, `Invalid ${key} in record ${r.id}`);
}
assert.equal(equipment.length, 21, 'Equipment list should contain 21 items');
assert.equal(pmSchedule.length, equipment.length, 'PM schedule should cover every equipment item');
assert.equal(new Set(equipment.map(e=>e.id)).size, equipment.length, 'Equipment IDs should be unique');
assert.ok(formatDate('2026-01-05').includes('05/01/2026'));
assert.ok(formatMoney(1000).includes('1.000'));
assert.equal(formatNumber(1.25), '1,3');
assert.equal(escapeHtml('<b>"&'), '&lt;b&gt;&quot;&amp;');

// Minimal DOM mocks for rendering tests (no browser dependency).
class MockElement {
  constructor(id='') { this.id=id; this.innerHTML=''; this.textContent=''; this.value=''; this.listeners={}; this.events=[]; }
  addEventListener(type,fn) { (this.listeners[type] ||= []).push(fn); }
  dispatchEvent(event) { this.events.push(event); return true; }
}
const elements = new Map();
const get = id => { if (!elements.has(id)) elements.set(id,new MockElement(id)); return elements.get(id); };
globalThis.document = { querySelector(selector) { return get(selector.replace(/^#/,'')); }, getElementById(id) { return get(id); } };
renderKpis(initialRecords);
assert.equal((get('kpiGrid').innerHTML.match(/class="kpi-card"/g)||[]).length,4,'Should render 4 KPI cards');
renderCharts(initialRecords);
assert.ok(get('chartFailures').innerHTML.includes('chart-row'));
assert.ok(get('chartDowntime').innerHTML.includes('chart-row'));
assert.ok(get('chartParts').innerHTML.includes('chart-row'));
assert.ok(get('pmSchedule').innerHTML.includes('schedule-row'));
get('searchInput').value='';get('equipmentFilter').value='';get('typeFilter').value='';
populateFilters();
const tableRows=renderTable(initialRecords);
assert.equal(tableRows.length,17,'Default table should show all 17 records');
assert.ok(get('historyBody').innerHTML.includes('data-edit='));
assert.ok(get('historyBody').innerHTML.includes('data-delete='));
console.log('PASS: static paths, IDs, module references, seed data, helpers, KPIs, charts, filters, table rendering');

// CRUD behavior checks with lightweight form/dialog mocks.
const formModule = await import('./form.js');
const formIds = ['maintenanceDialog','maintenanceForm','addMaintenanceBtn','formTitle','dateInput','responseInput','downtimeInput','costInput','closeDialogBtn','cancelBtn','equipmentInput','typeInput','conditionInput','causeInput','actionInput','partsInput','personInput','verificationInput','nextDateInput','historyBody'];
for (const id of formIds) get(id);
get('maintenanceForm').reset = () => { for (const id of ['dateInput','conditionInput','causeInput','actionInput','partsInput','personInput','responseInput','downtimeInput','costInput','nextDateInput']) get(id).value=''; };
get('maintenanceDialog').showModal = () => { get('maintenanceDialog').opened=true; };
get('maintenanceDialog').close = () => { get('maintenanceDialog').opened=false; };
let formRecords = structuredClone(initialRecords);
let saveCount=0, renderCount=0;
formModule.setupForm({getRecords:()=>formRecords,setRecords:value=>{formRecords=value;saveCount++;},rerender:()=>renderCount++});
(get('addMaintenanceBtn').listeners.click[0])();
assert.equal(get('maintenanceDialog').opened,true,'Add form should open dialog');
get('equipmentInput').value='P01';get('dateInput').value='2026-11-19';get('typeInput').value='CM';get('conditionInput').value='Smoke test';get('causeInput').value='Test';get('actionInput').value='Test action';get('partsInput').value='Test part';get('personInput').value='Tester';get('responseInput').value='1';get('downtimeInput').value='2';get('costInput').value='1000';get('verificationInput').value='Normal';get('nextDateInput').value='2026-12-19';
(get('maintenanceForm').listeners.submit[0])({preventDefault(){}});
assert.equal(formRecords.length,18,'Add should append one record');assert.equal(formRecords.at(-1).condition,'Smoke test');assert.equal(saveCount,1);assert.equal(renderCount,1);assert.equal(get('maintenanceDialog').opened,false);
console.log('PASS: add-maintenance form submit behavior');
// Edit and delete delegated table-action checks.
const addedId=formRecords.at(-1).id;
const editTarget={closest(selector){return selector==='[data-edit]'?{dataset:{edit:String(addedId)}}:null;}};
get('historyBody').listeners.click[0]({target:editTarget});
assert.equal(get('maintenanceDialog').opened,true,'Edit action should open the form');
get('conditionInput').value='Edited smoke test';
(get('maintenanceForm').listeners.submit[0])({preventDefault(){}});
assert.equal(formRecords.length,18,'Edit should not append a row');
assert.equal(formRecords.find(r=>r.id===addedId).condition,'Edited smoke test');
assert.equal(saveCount,2);
globalThis.confirm=()=>true;
const deleteTarget={closest(selector){return selector==='[data-edit]'?null:selector==='[data-delete]'?{dataset:{delete:String(addedId)}}:null;}};
get('historyBody').listeners.click[0]({target:deleteTarget});
assert.equal(formRecords.length,17,'Delete should remove the selected row');
assert.equal(saveCount,3);
console.log('PASS: edit/delete maintenance record actions');
