import { equipment, getEquipment } from "./config.js";
import { formatDate, formatMoney, formatNumber, escapeHtml } from "./utils.js";

export function populateFilters() {
  const options = equipment.map(item =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.id)} — ${escapeHtml(item.name)}</option>`
  ).join("");
  document.querySelector("#equipmentFilter").innerHTML = '<option value="">Semua peralatan</option>' + options;
  document.querySelector("#equipmentInput").innerHTML = options;
}


export function renderTable(records) {
  const query = document.querySelector("#searchInput").value.trim().toLowerCase();
  const equipmentFilter = document.querySelector("#equipmentFilter").value;
  const typeFilter = document.querySelector("#typeFilter").value;
  const filtered = records
    .filter(record =>
      (!equipmentFilter || record.equipmentId === equipmentFilter) &&
      (!typeFilter || record.type === typeFilter) &&
      (!query || [record.condition, record.cause, record.action, record.parts, record.person,
        getEquipment(record.equipmentId)?.name, record.equipmentId]
        .join(" ").toLowerCase().includes(query)
      )
    )
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  document.querySelector("#recordCount").textContent = `${filtered.length} dari ${records.length} catatan`;
  const tbody = document.querySelector("#historyBody");
  tbody.innerHTML = filtered.map((record, index) => {
    const safeType = record.type === "PM" ? "PM" : "CM";
    const safeVerification = ["Normal", "Perbaikan"].includes(record.verification) ? record.verification : "Normal";
    const equipmentName = getEquipment(record.equipmentId)?.name || record.equipmentId || "—";
    return `<tr>
      <td>${index + 1}</td>
      <td>${formatDate(record.date)}</td>
      <td><b>${escapeHtml(equipmentName)}</b><span class="sub">${escapeHtml(record.equipmentId || "—")}</span></td>
      <td><span class="tag tag-${safeType}">${safeType}</span></td>
      <td>${escapeHtml(record.condition || "—")}<span class="sub">${escapeHtml(record.cause || "")}</span></td>
      <td>${escapeHtml(record.cause || "—")}</td>
      <td>${escapeHtml(record.action || "—")}</td>
      <td>${escapeHtml(record.parts || "—")}</td>
      <td>${formatNumber(record.responseHours)} jam</td>
      <td>${formatNumber(record.downtimeHours)} jam</td>
      <td>${formatMoney(record.cost)}</td>
      <td>${escapeHtml(record.person || "—")}</td>
      <td><span class="tag tag-${safeVerification}">${safeVerification}</span></td>
      <td>${formatDate(record.nextDate)}</td>
      <td class="actions-cell"><button class="table-action" data-edit="${Number(record.id)}">Edit</button><button class="table-action delete" data-delete="${Number(record.id)}">Hapus</button></td>
    </tr>`;
  }).join("") || '<tr><td colspan="15" class="empty">Tidak ada data ditemukan.</td></tr>';

  tbody.dispatchEvent(new CustomEvent("table-rendered", { detail: { filtered } }));
  return filtered;
}


export function exportCsv(records) {
  const header = ["Tanggal", "ID Peralatan", "Peralatan", "Jenis", "Gangguan", "Penyebab", "Tindakan", "Suku Cadang", "Respons (jam)", "Downtime (jam)", "Biaya", "Pelaksana", "Verifikasi", "Pemeriksaan Berikutnya"];
  const rows = records.map(record => [
    record.date, record.equipmentId, getEquipment(record.equipmentId)?.name || "", record.type,
    record.condition, record.cause, record.action, record.parts, record.responseHours,
    record.downtimeHours, record.cost, record.person, record.verification, record.nextDate
  ]);
  const csvCell = value => '"' + String(value ?? "").replace(/"/g, '""') + '"';
  const csv = [header, ...rows].map(row => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "gardena-maintenance-records.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
