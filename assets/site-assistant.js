/* Portfolio helper: real Botpress AI can be connected with its PUBLIC
 * embed script, and private project inquiries with a PUBLIC Formspree endpoint.
 * Neither is represented as operational until actually configured. */
(() => {
"use strict";
const init = () => {
  if (document.getElementById("lr-help-trigger")) return;
  const cfg = window.LR_SITE_ASSISTANT || {};
  const aiScript = typeof cfg.botpressConfigScript === "string" ? cfg.botpressConfigScript.trim() : "";
  const formEndpoint = typeof cfg.formspreeEndpoint === "string" ? cfg.formspreeEndpoint.trim() : "";
  const aiEnabled = /^https:\/\/files\.bpcontent\.cloud\/[\w\/-]+\.js(?:\?[\w=&-]+)?$/.test(aiScript);
  const formEnabled = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(formEndpoint);
  const add = (tag, props, parent) => { const el=document.createElement(tag); for(const [k,v] of Object.entries(props||{})){if(k==="text")el.textContent=v;else el.setAttribute(k,v);} (parent||document.body).append(el);return el; };
  const launcher=add("button",{id:"lr-help-trigger",class:"lr-help-trigger",type:"button",text:"💬 Ask a question", "aria-expanded":"false","aria-controls":"lr-help-panel"});
  const panel=add("section",{id:"lr-help-panel",class:"lr-help-panel",role:"dialog","aria-label":"Portfolio assistant and project inquiries","aria-modal":"false",hidden:""});
  panel.innerHTML=`<header class="lr-help-header"><div><strong>Project Questions &amp; Inquiries</strong><small>Information about Lukas Rudolph's projects</small></div><button type="button" class="lr-help-close" aria-label="Close assistant">×</button></header>
  <div class="lr-help-tabs" role="tablist" aria-label="Choose how to contact">
    <button type="button" id="lr-tab-ai" role="tab" aria-selected="true" aria-controls="lr-view-ai">Ask AI</button>
    <button type="button" id="lr-tab-inquiry" role="tab" aria-selected="false" aria-controls="lr-view-inquiry">Project inquiry</button>
  </div>
  <div class="lr-help-body">
  <section id="lr-view-ai" role="tabpanel" aria-labelledby="lr-tab-ai">
    <p class="lr-help-intro">Ask about the public projects, CAD capabilities, or how to start a conversation. AI may be inaccurate; project quotes, pricing, and commitments require direct confirmation.</p>
    <div id="lr-ai-message" class="lr-help-connect" role="status"></div>
    <div id="lr-botpress-chat" aria-label="AI chatbot"></div>
    <div class="lr-help-links"><a href="/cad-3d-printing.html">See CAD and 3D printing work →</a><a href="/projects/magnetic-lanyard-screwdriver-holder-case-study.html">Magnetic bit-holder design →</a><a href="/projects/laser-engraver-ventilation-adapter.html">Laser ventilation adapter →</a><a href="/free-oee-tracker.html">Free OEE calculator →</a></div>
  </section>
  <section id="lr-view-inquiry" role="tabpanel" aria-labelledby="lr-tab-inquiry" hidden>
    <p class="lr-help-intro">Have a part, prototype, or technical problem you'd like to discuss? Describe the intended use and constraints. Do not include confidential or regulated information.</p>
    <form id="lr-help-form" class="lr-help-form" novalidate>
      <label for="lr-name">Your name *</label><input id="lr-name" name="name" autocomplete="name" maxlength="100" required>
      <label for="lr-preference">Preferred way to hear back *</label>
      <select id="lr-preference" name="preferred_contact" required><option value="">Select one</option><option value="Email">Email</option><option value="Phone">Phone</option><option value="LinkedIn">LinkedIn</option></select>
      <label for="lr-contact">Your email, phone number, or LinkedIn profile *</label><input id="lr-contact" name="contact_detail" autocomplete="off" maxlength="160" required placeholder="Enter the matching contact detail">
      <label for="lr-topic">What are you asking about? *</label>
      <select id="lr-topic" name="project_type" required><option value="">Select a topic</option><option>CAD modeling / drawing</option><option>3D printing / prototype</option><option>Existing part or design improvement</option><option>Manufacturing / process tool</option><option>Other technical question</option></select>
      <label for="lr-message">Your question or project description *</label><textarea id="lr-message" name="message" minlength="15" maxlength="5000" required placeholder="What are you trying to accomplish? Include approximate dimensions, intended use, materials, and constraints if known."></textarea>
      <div class="lr-help-trap" aria-hidden="true"><label>Leave this blank <input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
      <label class="lr-help-consent"><input type="checkbox" name="contact_consent" value="yes" id="lr-consent" required><span>I understand these details will be sent to an external form provider and shared with Lukas Rudolph for replying to my inquiry. See the <a href="/privacy-notice.html" target="_blank" rel="noopener">privacy notice</a>.</span></label>
      <button type="submit" id="lr-submit" class="lr-help-submit">Send private inquiry</button>
      <p id="lr-form-status" class="lr-help-status" aria-live="polite"></p>
    </form>
    <div class="lr-help-links"><a href="https://www.linkedin.com/in/lukas-rudolph-377b45100/" target="_blank" rel="noopener noreferrer">Or message Lukas on LinkedIn →</a></div>
  </section></div>`;
  const tabAi=panel.querySelector("#lr-tab-ai"), tabInquiry=panel.querySelector("#lr-tab-inquiry"), viewAi=panel.querySelector("#lr-view-ai"), viewInquiry=panel.querySelector("#lr-view-inquiry");
  function selectTab(tab){
    const inquiry=tab==="inquiry";
    tabAi.setAttribute("aria-selected",String(!inquiry)); tabInquiry.setAttribute("aria-selected",String(inquiry));
    viewAi.hidden=inquiry;viewInquiry.hidden=!inquiry;
  }
  const close=()=>{panel.hidden=true;launcher.setAttribute("aria-expanded","false");launcher.focus();};
  launcher.addEventListener("click",()=>{const wasHidden=panel.hidden;panel.hidden=!wasHidden;launcher.setAttribute("aria-expanded",String(wasHidden));if(wasHidden)panel.querySelector(".lr-help-close").focus();});
  panel.querySelector(".lr-help-close").addEventListener("click",close);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)close();});
  tabAi.addEventListener("click",()=>selectTab("ai"));
  tabInquiry.addEventListener("click",()=>selectTab("inquiry"));
  document.querySelectorAll('a[href="#contact"]').forEach(a=>{a.addEventListener("click",e=>{if(!a.closest("#lr-help-panel")){e.preventDefault();panel.hidden=false;launcher.setAttribute("aria-expanded","true");selectTab("inquiry");panel.querySelector("#lr-name").focus();}});});
  const aiMsg=panel.querySelector("#lr-ai-message");
  if (!aiEnabled){
    aiMsg.textContent="Live AI answers are not connected yet. The project links below work now. For a personal question, use the Project inquiry tab or LinkedIn.";
    panel.querySelector("#lr-botpress-chat").hidden=true;
  } else {
    aiMsg.textContent="Connecting to the independent AI assistant…";
    const loader=(src)=>new Promise((resolve,reject)=>{const tag=document.createElement("script");tag.src=src;tag.async=true;tag.onload=resolve;tag.onerror=reject;document.head.append(tag);});
    loader("https://cdn.botpress.cloud/webchat/v3.3/inject.js")
      .then(()=>loader(aiScript)).then(()=>{aiMsg.textContent="AI is provided by Botpress. Avoid entering private information in chat. For a project quote or personal reply, use the Project inquiry tab.";})
      .catch(()=>{aiMsg.textContent="AI chat is temporarily unavailable. Use the project links or the Project inquiry tab.";});
  }
  const form=panel.querySelector("#lr-help-form"),btn=panel.querySelector("#lr-submit"),status=panel.querySelector("#lr-form-status"),pref=panel.querySelector("#lr-preference"),contact=panel.querySelector("#lr-contact");
  const setStatus=(message,error=false)=>{status.textContent=message;status.dataset.error=String(error);};
  pref.addEventListener("change",()=>{const p=pref.value;contact.type=p==="Email"?"email":p==="Phone"?"tel":"text";contact.placeholder=p==="Email"?"your@email.com":p==="Phone"?"Preferred phone number":p==="LinkedIn"?"LinkedIn profile link or username":"Enter the matching contact detail";});
  if(!formEnabled){btn.disabled=true;setStatus("Private email delivery is not connected yet. Please use the LinkedIn link below. No inquiry will be submitted or saved.",true);}
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!formEnabled){setStatus("Email delivery is not connected yet. Use LinkedIn instead.",true);return;}
    if(!form.reportValidity())return;
    const preference=pref.value,detail=contact.value.trim();
    if(preference==="Email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detail)){contact.setCustomValidity("Enter a valid email address");contact.reportValidity();contact.setCustomValidity("");return;}
    btn.disabled=true;setStatus("Sending your inquiry…");
    try{
      const data=new FormData(form);data.append("source_page",location.href);data.append("_subject","Website project inquiry for Lukas Rudolph");
      const response=await fetch(formEndpoint,{method:"POST",body:data,headers:{"Accept":"application/json"}});
      if(!response.ok)throw new Error("Form delivery failed");
      form.reset();contact.type="text";setStatus("Your inquiry was accepted by the form service. Lukas can reply using your preferred contact details.");
    }catch(err){setStatus("The message could not be confirmed as sent. Please try again or contact Lukas on LinkedIn.",true);}
    finally{btn.disabled=false;}
  });
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
