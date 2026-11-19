export const escapeHtml = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
export const formatDate = value => { if(!value) return "—"; const [y,m,d]=value.split("-"); return `${d}/${m}/${y}`; };
export const formatMoney = value => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value||0));
export const formatNumber = value => Number(value||0).toLocaleString("id-ID",{maximumFractionDigits:1});
