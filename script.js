const SITE_CONFIG={phone:"010-3666-8255",businessHours:"평일 09:00–18:00",footerInfo:"대표자·사업자번호·주소 입력 필요"};
const cleanPhone=phone=>phone.replace(/[^0-9+]/g,"");
function applyConfig(){const href=`tel:${cleanPhone(SITE_CONFIG.phone)}`;document.querySelectorAll("#phoneLink,#contactCall").forEach(el=>el.href=href);document.querySelector("#phoneLink").textContent=SITE_CONFIG.phone;document.querySelector("#businessHours").textContent=SITE_CONFIG.businessHours;document.querySelector("#footerInfo").textContent=SITE_CONFIG.footerInfo;document.querySelector("#year").textContent=new Date().getFullYear();}
const navToggle=document.querySelector(".nav-toggle"),nav=document.querySelector(".nav");
navToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));navToggle.textContent=open?"×":"☰";});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");navToggle.textContent="☰";}));
applyConfig();
