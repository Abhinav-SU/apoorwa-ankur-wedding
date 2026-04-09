(function(){
  "use strict";

  const WEDDING_DATE = new Date("2026-04-26T00:00:00+05:30");
  const pages = document.getElementById("pages");
  const PETAL_COUNT = 20;
  const SPARKLE_COUNT = 30;
  const isMobileSnap = ()=> window.innerWidth < 768;
  const scrollRoot = ()=> isMobileSnap() ? pages : document.documentElement;

  function applyVersion(){
    const isFullVersion = new URLSearchParams(location.search).get("v")==="a"
      || location.pathname.endsWith("/all.html")
      || location.pathname.endsWith("/all");
    document.querySelectorAll("[data-version]").forEach(el=>{
      el.style.display = isFullVersion ? "" : "none";
    });
  }

  function initDots(){
    const dots = document.querySelectorAll(".dot");
    const sections = [];
    dots.forEach(d=>{
      const id = d.dataset.target;
      const sec = document.getElementById(id);
      if(sec) sections.push({dot:d,sec});
    });

    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const match = sections.find(s=>s.sec===e.target);
          if(!match) return;
          dots.forEach(d=>d.classList.remove("dot--active"));
          match.dot.classList.add("dot--active");
        }
      });
    },{root: isMobileSnap() ? pages : null, threshold:.5});

    sections.forEach(s=>obs.observe(s.sec));

    dots.forEach(d=>{
      d.addEventListener("click",()=>{
        const sec = document.getElementById(d.dataset.target);
        if(!sec) return;
        if(isMobileSnap() && pages){
          pages.scrollTo({top:sec.offsetTop,behavior:"smooth"});
        } else {
          sec.scrollIntoView({behavior:"smooth"});
        }
      });
    });
  }

  function initReveal(){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add("visible");
      });
    },{root: isMobileSnap() ? pages : null, threshold:.25});

    document.querySelectorAll(".page__content").forEach(el=>obs.observe(el));
  }

  function initTimelineReveal(){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add("visible");
      });
    },{root: isMobileSnap() ? pages : null, threshold:.2});

    document.querySelectorAll(".tl-card").forEach(el=>obs.observe(el));
  }

  function initPetals(){
    const container = document.getElementById("petals");
    if(!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for(let i=0;i<PETAL_COUNT;i++){
      const petal = document.createElement("div");
      petal.className = "petal";
      const size = 6 + Math.random()*12;
      const left = Math.random()*100;
      const dur = 10 + Math.random()*15;
      const delay = Math.random()*20;
      const drift = -50 + Math.random()*100;
      petal.style.cssText =
        "width:"+size+"px;height:"+size+"px;"+
        "left:"+left+"%;top:-20px;"+
        "animation:petal-fall "+dur+"s linear "+delay+"s infinite;"+
        "--drift:"+drift+"px;opacity:0;";
      container.appendChild(petal);
    }
  }

  function initSparkles(){
    const container = document.getElementById("sparkles");
    if(!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for(let i=0;i<SPARKLE_COUNT;i++){
      const spark = document.createElement("div");
      spark.className = "sparkle";
      const size = 2 + Math.random()*3;
      const left = Math.random()*100;
      const top = Math.random()*100;
      const dur = 3 + Math.random()*5;
      const delay = Math.random()*8;
      spark.style.cssText =
        "width:"+size+"px;height:"+size+"px;"+
        "left:"+left+"%;top:"+top+"%;"+
        "animation:sparkle-twinkle "+dur+"s ease-in-out "+delay+"s infinite;"+
        "opacity:0;";
      container.appendChild(spark);
    }
  }

  function initCountdown(){
    const ids = {d:"cdDays",h:"cdHours",m:"cdMins",s:"cdSecs"};
    const els = {};
    for(const k in ids) els[k] = document.getElementById(ids[k]);

    function tick(){
      const diff = Math.max(0, WEDDING_DATE - Date.now());
      const d = Math.floor(diff/864e5);
      const h = Math.floor((diff%864e5)/36e5);
      const m = Math.floor((diff%36e5)/6e4);
      const s = Math.floor((diff%6e4)/1e3);
      if(els.d) els.d.textContent = String(d).padStart(2,"0");
      if(els.h) els.h.textContent = String(h).padStart(2,"0");
      if(els.m) els.m.textContent = String(m).padStart(2,"0");
      if(els.s) els.s.textContent = String(s).padStart(2,"0");
    }
    tick();
    setInterval(tick,1000);
  }

  function initMusic(){
    const btn = document.getElementById("musicToggle");
    const audio = document.getElementById("bgMusic");
    if(!btn||!audio) return;
    btn.addEventListener("click",()=>{
      if(audio.paused){audio.play();btn.setAttribute("aria-pressed","true")}
      else{audio.pause();btn.setAttribute("aria-pressed","false")}
    });
  }

  function initYear(){
    const el = document.getElementById("year");
    if(el) el.textContent = new Date().getFullYear();
  }

  function initAutoScroll(){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const secs = Array.from(document.querySelectorAll(".page"));
    let idx = 0;
    let timer = null;
    let stopped = false;

    function stop(){
      stopped = true;
      if(timer) clearTimeout(timer);
    }

    function scrollNext(){
      if(stopped) return;
      idx++;
      if(idx >= secs.length){ stop(); return; }
      const target = secs[idx];
      if(isMobileSnap() && pages){
        pages.scrollTo({top: target.offsetTop, behavior:"smooth"});
      } else {
        target.scrollIntoView({behavior:"smooth"});
      }
      timer = setTimeout(scrollNext, 5000);
    }

    const stopEvents = ["wheel","touchstart","mousedown","keydown"];
    stopEvents.forEach(evt=>{
      window.addEventListener(evt, stop, {once:true, passive:true});
    });
    if(pages){
      stopEvents.forEach(evt=>{
        pages.addEventListener(evt, stop, {once:true, passive:true});
      });
    }

    timer = setTimeout(scrollNext, 4000);
  }

  applyVersion();
  initDots();
  initReveal();
  initTimelineReveal();
  initPetals();
  initSparkles();
  initCountdown();
  initMusic();
  initYear();
  initAutoScroll();
})();
