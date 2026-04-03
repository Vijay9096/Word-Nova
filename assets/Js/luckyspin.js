(function(){
  window.waitForButtonActive = window.waitForButtonActive || function(callback, delay = 120) {
    setTimeout(() => {
      try { callback(); } catch (e) { /* ignore */ }
    }, delay);
  };
  const SPIN_COST=30;
  const DAILY_KEY="luckyspin_free_date";
  const REWARDS=[
    {type:"coins",value:50,color:"#FFD54F",labelNumber:"50",labelEmoji:"â­"},
    {type:"coins",value:100,color:"#FFB300",labelNumber:"100",labelEmoji:"â­"},
    {type:"hints",value:1,color:"#80DEEA",labelNumber:"+1",labelEmoji:"ðŸ’¡"},
    {type:"coins",value:200,color:"#A5D6A7",labelNumber:"200",labelEmoji:"â­"},
    {type:"hints",value:2,color:"#CE93D8",labelNumber:"+2",labelEmoji:"ðŸ’¡"},
    {type:"coins",value:500,color:"#FF8A65",labelNumber:"500",labelEmoji:"â­"},
    {type:"coins",value:300,color:"#4FC3F7",labelNumber:"300",labelEmoji:"â­"},
    {type:"coins",value:1000,color:"#FF7043",labelNumber:"1000",labelEmoji:"â­"}
  ];
  if(typeof window.coins==="undefined")window.coins=Number(localStorage.getItem("coins")||100);
  if(typeof window.hints==="undefined")window.hints=Number(localStorage.getItem("hints")||3);
  const canvas=document.getElementById("spinCanvas");
  if(!canvas)return console.warn("LuckySpin: #spinCanvas missing");
  const overlay=document.getElementById("luckySpin");
  const elFree=document.getElementById("freeSpinBtn");
  const elBuy=document.getElementById("buySpinBtn");
  const elClose=document.getElementById("closeSpinBtn");
  const elResult=document.getElementById("spinResult");
  const elCoin=document.getElementById("coinCount");
  const elHint=document.getElementById("hintCount");
  const ctx=canvas.getContext("2d");
function scaleCanvasForDPR(){
  const dpr=window.devicePixelRatio||1;
  const cssW=canvas.clientWidth||canvas.width;
  const cssH=canvas.clientHeight||canvas.height;
  canvas.width=Math.round(cssW*dpr);
  canvas.height=Math.round(cssH*dpr);
  canvas.style.width=cssW+"px";
  canvas.style.height=cssH+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
 }
  scaleCanvasForDPR();
  window.addEventListener("resize",()=>{scaleCanvasForDPR();drawWheel();});
  let spinning=false;
  let cumulativeRotation=0;
  function saveAll(){
    localStorage.setItem("coins",String(window.coins));
    localStorage.setItem("hints",String(window.hints));
    localStorage.setItem("persistentHintsBackup",String(window.hints));
  }
  function updateAll(){
    if(typeof updateCoinDisplay==="function"){
      try{updateCoinDisplay();}catch(e){console.warn("updateCoinDisplay err:",e);}
    } else if(elCoin)elCoin.textContent=window.coins;
    if(typeof updateHintDisplay==="function"){
      try{updateHintDisplay();}catch(e){console.warn("updateHintDisplay err:",e);}
    } else if(elHint)elHint.textContent=window.hints;
  }
  function todayStr(){return new Date().toISOString().slice(0,10);}
  function drawWheel(){
    const cssW=canvas.clientWidth||canvas.width;
    const cssH=canvas.clientHeight||canvas.height;
    const w=cssW,h=cssH;
    const cx=w/2,cy=h/2;
    const radius=Math.min(cx,cy)-8;
    const N=REWARDS.length;
    const anglePer=(2*Math.PI)/N;
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate(cx,cy);
    for(let i=0;i<N;i++){
      const p=REWARDS[i];
      const start=i*anglePer;
      const end=start+anglePer;
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.arc(0,0,radius,start,end);
      ctx.closePath();
      ctx.fillStyle=p.color;
      ctx.fill();
      ctx.strokeStyle="rgba(0,0,0,0.08)";
      ctx.stroke();
      const mid=start+anglePer/2;
      ctx.save();
      ctx.rotate(mid);
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      ctx.fillStyle="#111";
      ctx.font="bold 14px system-ui, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(p.labelNumber,radius*0.58-8,0);
      ctx.font="18px 'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji', sans-serif";
      ctx.fillText(p.labelEmoji,radius*0.58+20,0);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0,0,radius*0.18,0,Math.PI*2);
    ctx.fillStyle="#111";
    ctx.fill();
    ctx.fillStyle="#fff";
    ctx.font="bold 14px sans-serif";
    ctx.textAlign="center";
    ctx.fillText("SPIN",0,0);
    ctx.restore();
  }
  function awardPrize(prize){
    if(!prize)return;
    if(prize.type==="coins"){
      window.coins+=prize.value;
      saveAll();updateAll();
      if(elResult)elResult.textContent=`ðŸŽ‰ You won ${prize.value}â­ coins! (Total: ${window.coins}â­)`;
      return;
    }
    if (prize.type === "hints") {
      window.hints = Number(window.hints || 0) + Number(prize.value || 0);
      try { hints = Number(window.hints); } catch(e) { /* ignore if not defined */ }
      localStorage.setItem("hints", String(window.hints));
      localStorage.setItem("persistentHintsBackup", String(window.hints));
      if (typeof updateHintDisplay === "function") {
        try { updateHintDisplay(); } catch (e) { console.warn("updateHintDisplay failed", e); }
      }
      const elHint = document.getElementById("hintCount");
      if (elHint) elHint.textContent = window.hints;
      try { window.dispatchEvent(new CustomEvent("hintsChanged", { detail: { hints: window.hints } })); } catch(e){}
      if (elResult) elResult.textContent = `ðŸ’¡ You won ${prize.value} hints! (Total: ${window.hints})`;
      return;
    }
    if(elResult)elResult.textContent="ðŸŽ You got a prize!";
  }
  function updateButtons(){
    const used=localStorage.getItem(DAILY_KEY)===todayStr();
    if(elFree){elFree.disabled=used||spinning;elFree.style.opacity=elFree.disabled?0.6:1;}
    if(elBuy){elBuy.disabled=(window.coins<SPIN_COST)||spinning;elBuy.style.opacity=elBuy.disabled?0.6:1;}
  }
  function openSpin(){
    if(overlay)overlay.classList.remove("hidden");
    drawWheel();
    if(elResult)elResult.textContent="";
    updateButtons();
  }
  function closeSpin(){
    if(overlay)overlay.classList.add("hidden");
  }
  function startSpin(buy=false){
    if(spinning)return;
    if(buy){
      if(window.coins<SPIN_COST){if(elResult)elResult.textContent="âš ï¸ Not enough coins!";return;}
      window.coins-=SPIN_COST;saveAll();updateAll();
    } else {
      const today=todayStr();
      if(localStorage.getItem(DAILY_KEY)===today){if(elResult)elResult.textContent="âš ï¸ Free spin used today!";return;}
      localStorage.setItem(DAILY_KEY,today);
    }
    spinning=true;
    if(elResult)elResult.textContent="";
    const N=REWARDS.length;
    const anglePerDeg=360/N;
    const targetIndex=Math.floor(Math.random()*N);
    const rounds=Math.floor(Math.random()*3)+4;
    const centerDeg=(targetIndex*anglePerDeg)+anglePerDeg/2;
    const rotationNeeded=-90-centerDeg;
    const jitter=(Math.random()*(anglePerDeg*0.4))-(anglePerDeg*0.2);
    const finalRotation=cumulativeRotation+(360*rounds+rotationNeeded+jitter);
    const finalRotationNormalized=((finalRotation%360)+360)%360;
    canvas.style.transition="transform 3.6s cubic-bezier(.15,.9,.2,1)";
    canvas.style.transform=`rotate(${finalRotation}deg)`;
    updateButtons();
    const onEnd=function(e){
      if(e.target!==canvas)return;
      canvas.removeEventListener("transitionend",onEnd);
      const normalized=finalRotation%360;
      canvas.style.transition="";
      canvas.style.transform=`rotate(${normalized}deg)`;
      cumulativeRotation=((normalized%360)+360)%360;
      const R=finalRotationNormalized;
      const pointerTargetDeg=270;
      const angleAtPointer=((pointerTargetDeg-R)+360)%360;
      const landedIndex=Math.floor(angleAtPointer/anglePerDeg)%N;
      awardPrize(REWARDS[landedIndex]);
      spinning=false;
      updateButtons();
    };
    canvas.addEventListener("transitionend",onEnd,{once:true});
  }
  window.openSpin=window.openSpin||openSpin;
  window.closeSpin=window.closeSpin||closeSpin;
  window.startLuckySpin=window.startLuckySpin||startSpin;
if(elFree){
    elFree.addEventListener('click', function () {
      waitForButtonActive(function () { startSpin(false); });
    });
  }
  if(elBuy){
    elBuy.addEventListener('click', function () {
      waitForButtonActive(function () { startSpin(true); });
    });
  }
  if(elClose){
    elClose.addEventListener('click', function () {
      waitForButtonActive(function () { closeSpin(); });
    });
  }
  drawWheel();
  updateAll();
  updateButtons();
})();