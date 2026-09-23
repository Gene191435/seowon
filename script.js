/* 운영 전 이 설정값을 실제 정보와 실제 견적 기준으로 수정하세요. */
const SITE_CONFIG = {
  phone: "000-0000-0000",
  businessHours: "평일 09:00–18:00",
  serviceArea: "지역정보 입력 필요",
  footerInfo: "대표자·사업자번호·주소 입력 필요"
};

/* 단위: 만원. 아래 금액은 화면 테스트용 예시이며 실제 단가가 아닙니다. */
const ESTIMATE_RULES = {
  cooling: { name: "냉난방 설비", base: 150, perArea: 8.5 },
  ventilation: { name: "환기 설비", base: 90, perArea: 5.2 },
  duct: { name: "덕트 공사", base: 120, perArea: 6.8 },
  maintenance: { name: "점검·유지보수", base: 25, perArea: 1.2 }
};
const FACILITY_FACTOR = { home: 1, store: 1.15, office: 1.1, factory: 1.35 };
const CONDITION_FACTOR = { new: 1, replace: 1.2, repair: .65 };

const won = value => `${Math.round(value).toLocaleString("ko-KR")}만원`;
const cleanPhone = phone => phone.replace(/[^0-9+]/g, "");

function applyConfig() {
  const phoneHref = `tel:${cleanPhone(SITE_CONFIG.phone)}`;
  document.querySelectorAll("#phoneLink,#contactCall").forEach(el => el.href = phoneHref);
  document.querySelector("#phoneLink").textContent = SITE_CONFIG.phone;
  document.querySelector("#businessHours").textContent = SITE_CONFIG.businessHours;
  document.querySelector("#serviceArea").textContent = SITE_CONFIG.serviceArea;
  document.querySelector("#footerInfo").textContent = SITE_CONFIG.footerInfo;
  document.querySelector("#year").textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "×" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.textContent = "☰";
}));

let latestText = "";
document.querySelector("#estimateForm").addEventListener("submit", event => {
  event.preventDefault();
  const facility = document.querySelector("#facility").value;
  const service = document.querySelector("#service").value;
  const area = Number(document.querySelector("#area").value);
  const condition = document.querySelector("#condition").value;
  if (!ESTIMATE_RULES[service] || !FACILITY_FACTOR[facility] || !area || area < 1) return;

  const rule = ESTIMATE_RULES[service];
  const center = (rule.base + rule.perArea * area) * FACILITY_FACTOR[facility] * CONDITION_FACTOR[condition];
  const low = Math.max(10, center * .85);
  const high = center * 1.2;
  const labels = { home: "아파트·주택", store: "상가·음식점", office: "사무실", factory: "공장·창고" };

  document.querySelector("#resultTitle").textContent = `${rule.name} 예상 범위`;
  document.querySelector("#resultPrice").textContent = `${won(low)} ~ ${won(high)}`;
  document.querySelector("#resultText").textContent = `${labels[facility]} ${area}평 기준의 참고용 예상금액입니다. 담당자 상담과 현장 확인 후 정확한 견적을 안내해 드립니다.`;
  latestText = `[서원공조시스템 간편견적]\n공사: ${rule.name}\n장소: ${labels[facility]}\n면적: ${area}평\n예상범위: ${won(low)}~${won(high)}\n※ 현장조사 전 참고용 금액`;
  document.querySelector("#estimateForm").hidden = true;
  const result = document.querySelector("#estimateResult"); result.hidden = false; result.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#resultClose").addEventListener("click", () => {
  document.querySelector("#estimateResult").hidden = true;
  document.querySelector("#estimateForm").hidden = false;
});
document.querySelector("#copyEstimate").addEventListener("click", async event => {
  try { await navigator.clipboard.writeText(latestText); event.currentTarget.textContent = "복사되었습니다"; }
  catch { event.currentTarget.textContent = "복사 실패"; }
  setTimeout(() => event.currentTarget.textContent = "결과 복사", 1800);
});

applyConfig();
