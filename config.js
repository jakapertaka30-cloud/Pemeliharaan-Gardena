export const equipmentNames = [
"Palu","Gergaji tangan","Pahat (Chisel)","Obeng","Meteran & siku","Serut kayu manual","Klem (Clamp)","Mesin potong kayu","Mesin serut listrik","Mesin bor","Mesin amplas (Sander)","Mesin bubut kayu","Mesin router kayu","Paku tembak (Nail gun)","Staples gun","Glue gun / lem kayu","Mesin jahit","Gunting kain","Kuas / roller","Spray gun sederhana","Amplas manual"
];
export const equipment = equipmentNames.map((name,i)=>({id:`P${String(i+1).padStart(2,"0")}`,name}));
const freqByEquipment = {8:["Harian","Operator Produksi"],9:["Harian","Operator Produksi"],10:["Harian","Operator Produksi"],11:["Harian","Operator Produksi"],12:["Mingguan","Staff Maintenance"],13:["Mingguan","Staff Maintenance"],14:["Mingguan","Staff Maintenance"],15:["Mingguan","Staff Maintenance"],17:["Mingguan","Staff Maintenance"],20:["Setiap selesai pakai","Operator Produksi"],16:["Bulanan","Staff Maintenance"],18:["Bulanan","Coordinator Produksi"],19:["Mingguan","Operator Finishing"],21:["Mingguan","Operator Finishing"]};
export const pmSchedule = equipment.map((e,i)=>({ ...e, frequency:(freqByEquipment[i+1]||["Bulanan","Coordinator Produksi"])[0], responsible:(freqByEquipment[i+1]||["Bulanan","Coordinator Produksi"])[1]}));
export const getEquipment = id=>equipment.find(e=>e.id===id);
