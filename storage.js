import { initialRecords } from "./maintenance-data.js";
const STORAGE_KEY="gardena_maintenance_dashboard_v3";
export function loadRecords(){try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY));return Array.isArray(parsed)?parsed:structuredClone(initialRecords)}catch{return structuredClone(initialRecords)}}
export function saveRecords(records){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(records));return true}catch{return false}}
export function resetRecords(){const fresh=structuredClone(initialRecords);saveRecords(fresh);return fresh}
