// ==UserScript==
// @name         EntranceIQ — Royal Entrances
// @namespace    https://github.com/swilliams9114-collab/EntranceIQ
// @version      0.1.2
// @description  Manual-send royal entrances for Torn faction chat.
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/swilliams9114-collab/EntranceIQ/main/EntranceIQ.user.js
// @downloadURL  https://raw.githubusercontent.com/swilliams9114-collab/EntranceIQ/main/EntranceIQ.user.js
// ==/UserScript==
(function(){
'use strict';
if(window.__entranceIQLoaded)return;window.__entranceIQLoaded=true;
const KEY='entranceiq-settings-v1';
const defaults={character:'sam',rating:'adult',length:'medium',roasts:true,clipboard:false,confirmReplace:true};
let settings;try{settings={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{settings={...defaults}}
const save=()=>localStorage.setItem(KEY,JSON.stringify(settings));
const data={
oce:{
pg:['👑 Hear ye! King Oce arrives. His ego entered ten minutes early to reserve a throne.','⚔️ The gates swing open! Lord Oce enters with twelve knights and absolutely no humility.','📜 Oce declares himself a god. The actual gods have filed a complaint.'],
adult:['👑 Bow, bitches! King Oce has arrived. His divine bullshit knows no bounds.','⚔️ His Royal Fuckery enters! Kneel before the most arrogant bastard in the kingdom.','🍺 King Oce stumbles in, drunk on power and probably cheap ale.'],
roastpg:['👑 Oce enters! _samara_ reminds him his throne is actually her footstool.','⚔️ Oce declares himself a god. _samara_ asks which discount Olympus hired him.'],
roastadult:['👑 King Oce arrives! _samara_ says even his royal bullshit needs a permit.','⚔️ Oce calls himself a god. _samara_ tells him to take his divine ass outside.']
},
sam:{
pg:['💋 _samara_ descends from Olympus. Beauty, danger, and zero patience.','⚡ Aphrodite’s beauty. Athena’s wisdom. Hades’ attitude. Bow, mortals.','🏛️ The Goddess has arrived. Compliments accepted. Stupidity punished.'],
adult:['💋 _samara_ enters. Sexy as sin, mean as hell, and fresh out of fucks.','🔥 Olympus’ hottest nightmare arrives. Look respectfully or get wrecked.','🍷 _samara_ arrives looking divine and ready to ruin somebody’s fucking day.'],
roastpg:['💋 _samara_ arrives! Oce kneels. He calls it worship. She calls it training.','⚡ The Goddess enters. Oce’s crown is cute. She lets him wear it for confidence.'],
roastadult:['💋 _samara_ enters. Oce calls himself King. She calls him her favorite dumbass.','⚡ Olympus trembles! _samara_ arrives to remind Oce who runs this shit.']
}};
const openings={oce:['📯 HEAR YE, HEAR YE!','🏰 BY ROYAL DECREE!','⚔️ BEHOLD THE ALMIGHTY KING!'],sam:['⚡ THE HEAVENS HAVE OPENED!','🏛️ OLYMPUS TREMBLES!','💋 MORTALS, BOW BEFORE DIVINITY!']};
const closings={oce:['The peasants tremble, the knights salute, and his royal ego requires its own castle.','His crown shines brightly, although nobody remembers voting for this delusional monarch.'],sam:['Aphrodite hides in jealousy, Hades locks the gates, and mortals pray they survive her mood.','The heavens applaud, the mortals swoon, and fools learn why beauty comes with a warning.']};
let draft='',last='';
const pick=a=>a[Math.floor(Math.random()*a.length)];
function generate(){
const d=data[settings.character];let pool=[...d[settings.rating]];
if(settings.roasts)pool.push(...d[settings.rating==='pg'?'roastpg':'roastadult']);
let result=pick(pool);if(result===last&&pool.length>1)result=pool[(pool.indexOf(result)+1)%pool.length];last=result;
if(settings.length!=='short')result=pick(openings[settings.character])+' '+result+' '+pick(closings[settings.character]);
if(settings.length==='long')result+=' '+pick(closings[settings.character]);
draft=result;
const p=document.getElementById('ei-preview');if(p)p.textContent=draft;
const n=document.getElementById('ei-count');if(n)n.textContent=draft.length+' characters';
}
const style=document.createElement('style');
style.textContent='#ei-launch{position:fixed!important;left:8px!important;right:auto!important;top:40%!important;bottom:auto!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483646!important;background:#292536;color:white;border:1px solid #ad9aca;border-radius:50%;width:44px;height:44px;font-size:23px;cursor:pointer;box-shadow:0 2px 12px #0008}#ei-panel{position:fixed;right:10px;bottom:165px;z-index:2147483001;width:min(380px,calc(100vw - 20px));max-height:75vh;overflow:auto;background:#20212b;color:#fff;border:1px solid #7c6a93;border-radius:12px;padding:14px;box-sizing:border-box;font:14px Arial,sans-serif;box-shadow:0 5px 24px #000a}#ei-panel *{box-sizing:border-box}#ei-panel label{display:block;margin:10px 0}#ei-panel select{display:block;width:100%;margin-top:4px}#ei-panel select,#ei-panel button{background:#383241;color:#fff;border:1px solid #82748f;border-radius:7px;padding:9px}#ei-panel button{cursor:pointer}#ei-preview{background:#302c39;padding:12px;border-radius:7px;white-space:pre-wrap;line-height:1.5;max-height:190px;overflow:auto}#ei-panel .ei-actions{display:flex;gap:7px;margin:10px 0}#ei-panel .ei-actions button{flex:1}#ei-panel small{color:#cbbfd6}';
document.head.append(style);
function getInput(){
const elements=[...document.querySelectorAll('textarea,[contenteditable="true"],[role="textbox"],input[type="text"]')].filter(e=>!e.closest('#ei-panel')&&e.getBoundingClientRect().width>70&&getComputedStyle(e).visibility!=='hidden');
const ranked=elements.map(e=>{
const ancestor=e.closest('[class*="chat" i],[id*="chat" i],[class*="faction" i],[id*="faction" i]');
const a=((ancestor?.className||'')+' '+(ancestor?.id||'')).toLowerCase(),b=((e.getAttribute('placeholder')||'')+' '+(e.getAttribute('aria-label')||'')).toLowerCase();
return {e,score:(a.includes('faction')?10:0)+(a.includes('chat')?4:0)+(b.includes('message')?3:0)};
}).sort((a,b)=>b.score-a.score);
return ranked[0]?.score>=4?ranked[0].e:null;
}
function insert(){
const e=getInput();if(!e){alert('EntranceIQ: Open faction chat first. No compatible chat field found; nothing was sent.');return}
const existing=e.isContentEditable?e.textContent:e.value;
if(existing?.trim()&&settings.confirmReplace&&!confirm('Replace your existing chat draft?'))return;
e.focus();
if(e.isContentEditable){e.textContent=draft;e.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:draft}))}
else{const proto=e.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(e,draft);e.dispatchEvent(new Event('input',{bubbles:true}))}
e.focus();
}
function select(label,key,choices){
const l=document.createElement('label');l.textContent=label;const s=document.createElement('select');
for(const [v,t] of choices){const o=document.createElement('option');o.value=v;o.textContent=t;s.append(o)}
s.value=settings[key];s.onchange=()=>{settings[key]=s.value;save();generate()};l.append(s);return l;
}
function toggle(label,key){const l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=settings[key];c.onchange=()=>{settings[key]=c.checked;save();generate();};l.append(c,document.createTextNode(' '+label));return l}
function openPanel(){
document.getElementById('ei-panel')?.remove();
const p=document.createElement('section');p.id='ei-panel';
const h=document.createElement('div');h.style.cssText='display:flex;justify-content:space-between;align-items:center';
const title=document.createElement('strong');title.textContent='👑 EntranceIQ';
const x=document.createElement('button');x.textContent='✕';x.onclick=()=>p.remove();h.append(title,x);p.append(h);
p.append(select('Character','character',[['oce','👑 Oceileachair'],['sam','💋 _samara_']]));
p.append(select('Humor rating','rating',[['pg','PG-13'],['adult','18+']]));
p.append(select('Entrance length','length',[['short','Short'],['medium','Medium'],['long','Long']]));
p.append(toggle('Royal Roasts','roasts'));
const preview=document.createElement('div');preview.id='ei-preview';p.append(preview);
const count=document.createElement('small');count.id='ei-count';p.append(count);
const actions=document.createElement('div');actions.className='ei-actions';
const g=document.createElement('button');g.textContent='🎲 Regenerate';g.onclick=generate;
const i=document.createElement('button');i.textContent='💬 Insert into Chat';i.onclick=insert;actions.append(g,i);p.append(actions);
const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='⚙️ Settings / TOS';details.append(summary);
details.append(toggle('Confirm before replacing existing text','confirmReplace'));
details.append(toggle('Enable clipboard button','clipboard'));
const copy=document.createElement('button');copy.textContent='Copy entrance';copy.onclick=()=>{if(!settings.clipboard)return;navigator.clipboard?.writeText(draft).then(()=>alert('Copied')).catch(()=>alert('Clipboard unavailable'))};
if(settings.clipboard)details.append(copy);
const compliance=document.createElement('p');compliance.style.fontSize='12px';compliance.textContent='TOS review (not official approval): local generation — low risk; user-initiated insertion — requires live validation; automatic sending — never performed; Torn API — not used; background chat monitoring — not used. Torn staff have final authority.';
details.append(compliance);p.append(details);document.body.append(p);generate();
}
const launch=document.createElement('button');launch.type='button';launch.id='ei-launch';launch.textContent='👑';launch.title='EntranceIQ — tap to open';launch.setAttribute('aria-label','Open EntranceIQ');launch.onclick=openPanel;
function mount(){if(document.body&&!document.getElementById('ei-launch'))document.body.append(launch)}
mount();new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
})();