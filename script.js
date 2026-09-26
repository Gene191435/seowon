const SITE_CONFIG={phone:"010-3666-8255",businessHours:"평일 09:00–18:00",footerInfo:"대표자·사업자번호·주소 입력 필요",formEndpoint:""};
const SERVICE_INFO={
  cold_chilled:{name:"냉장 저온창고 설치",unit:"평",rate:200,installation:180,guide:"가로·세로·높이, 보관품목, 목표온도, 전기조건과 실외기 위치를 확인해야 합니다."},
  cold_frozen:{name:"냉동 저온창고 설치",unit:"평",rate:200,installation:180,guide:"가로·세로·높이, 목표 냉동온도, 단열조건, 전기조건과 실외기 위치를 확인해야 합니다."},
  coldrepair:{name:"저온창고 점검·수리",unit:"평",guide:"현재 온도, 이상 증상, 장비 모델명과 설치연도를 알려주시면 상담에 도움이 됩니다."},
  aircon:{name:"에어컨 신규·이전 설치",unit:"평",guide:"공간 면적, 제품 종류, 실내기·실외기 위치와 예상 배관거리를 확인해야 합니다."},
  aircare:{name:"에어컨 점검·유지보수",unit:"평",guide:"냉방 불량, 누수, 소음 등 증상과 제품 모델명을 알려주세요."},
  leak_pressure:{name:"누수 공압검사",fixed:35,exact:true,guide:"누수 위치, 발생 시기와 물 사용 시 증상을 알려주시면 검사 준비에 도움이 됩니다."},
  leak_repair:{name:"누수 보수공사",fixed:50,guide:"보수범위와 철거·복구 여부에 따라 금액이 달라질 수 있습니다."},
  waterproof:{name:"방수공사",unit:"평",rate:10,guide:"바닥면 상태가 양호한 경우를 기준으로 하며, 바탕면 보수 여부에 따라 금액이 달라질 수 있습니다."}
};
const cleanPhone=phone=>phone.replace(/[^0-9+]/g,"");
function applyConfig(){const href=`tel:${cleanPhone(SITE_CONFIG.phone)}`;document.querySelectorAll("#phoneLink,#contactCall").forEach(el=>el.href=href);document.querySelector("#phoneLink").textContent=SITE_CONFIG.phone;document.querySelector("#businessHours").textContent=SITE_CONFIG.businessHours;document.querySelector("#footerInfo").textContent=SITE_CONFIG.footerInfo;document.querySelector("#year").textContent=new Date().getFullYear();}
const navToggle=document.querySelector(".nav-toggle"),nav=document.querySelector(".nav");
navToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));navToggle.textContent=open?"×":"☰";});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");navToggle.textContent="☰";}));
const serviceSelect=document.querySelector("#service"),areaField=document.querySelector("#areaField"),areaInput=document.querySelector("#area"),areaUnit=document.querySelector("#areaUnit");
serviceSelect.addEventListener("change",()=>{const info=SERVICE_INFO[serviceSelect.value];if(!info)return;if(info.fixed){areaField.hidden=true;areaInput.required=false;}else{areaField.hidden=false;areaInput.required=true;areaUnit.textContent=info.unit||"평";}});
document.querySelector("#estimateForm").addEventListener("submit",event=>{
  event.preventDefault();const info=SERVICE_INFO[serviceSelect.value];if(!info)return;
  const area=Number(areaInput.value),breakdown=document.querySelector("#resultBreakdown");
  let price="현장정보 확인이 필요합니다";breakdown.replaceChildren();breakdown.hidden=true;
  if(info.fixed)price=`${info.fixed.toLocaleString("ko-KR")}만원${info.exact?"":"부터"}`;
  else if(info.rate&&area>0){
    const work=info.rate*area;
    price=`약 ${(work+(info.installation||0)).toLocaleString("ko-KR")}만원부터`;
    if(info.installation){
      const items=[[`저온창고 ${area.toLocaleString("ko-KR")}평 × ${info.rate}만원`,`${work.toLocaleString("ko-KR")}만원부터`],["시공비",`${info.installation.toLocaleString("ko-KR")}만원`]];
      for(const [label,value] of items){const row=document.createElement("div"),name=document.createElement("span"),amount=document.createElement("strong");name.textContent=label;amount.textContent=value;row.append(name,amount);breakdown.append(row);}
      breakdown.hidden=false;
    }
  }
  document.querySelector("#resultTitle").textContent=`${info.name} 예상 견적`;
  document.querySelector("#resultPrice").textContent=price;
  document.querySelector("#resultText").textContent=`${info.guide} 견적은 고객님께서 참조하실 수 있는 대략적인 정보이며, 부가세는 별도입니다. 자세한 견적은 현장 확인 후 가능합니다.`;
  document.querySelector("#estimateForm").hidden=true;const result=document.querySelector("#estimateResult");result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"center"});
});
document.querySelector("#resultClose").addEventListener("click",()=>{document.querySelector("#estimateResult").hidden=true;document.querySelector("#estimateForm").hidden=false;});
const photos=document.querySelector("#sitePhotos"),preview=document.querySelector("#photoPreview");
photos.addEventListener("change",()=>{preview.innerHTML="";const files=[...photos.files];if(files.length>5){photos.value="";preview.textContent="사진은 최대 5장까지 선택할 수 있습니다.";return;}if(files.some(file=>file.size>5*1024*1024)){photos.value="";preview.textContent="장당 5MB 이하의 사진만 올려주세요.";return;}files.forEach(file=>{const item=document.createElement("span");item.textContent=`${file.name} (${(file.size/1024/1024).toFixed(1)}MB)`;preview.appendChild(item);});});
document.querySelector("#photoConsultForm").addEventListener("submit",async event=>{event.preventDefault();const status=document.querySelector("#formStatus");if(!SITE_CONFIG.formEndpoint){status.innerHTML=`사진 전송 서비스 연결이 필요합니다. 현재는 <a href="tel:${cleanPhone(SITE_CONFIG.phone)}">${SITE_CONFIG.phone}</a>로 전화 상담해 주세요.`;return;}const button=event.currentTarget.querySelector("button[type=submit]");button.disabled=true;button.textContent="전송 중…";status.textContent="사진과 상담내용을 안전하게 전송하고 있습니다.";try{const response=await fetch(SITE_CONFIG.formEndpoint,{method:"POST",body:new FormData(event.currentTarget),headers:{Accept:"application/json"}});if(!response.ok)throw new Error("submit failed");status.textContent="접수되었습니다. 확인 후 담당자가 연락드리겠습니다.";event.currentTarget.reset();preview.innerHTML="";}catch{status.textContent="접수 중 오류가 발생했습니다. 대표번호로 연락해 주세요.";}finally{button.disabled=false;button.textContent="사진상담 신청하기";}});
applyConfig();
