(function(){
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var sideLinks = Array.prototype.slice.call(document.querySelectorAll('#side-nav a'));
  var topLinks = Array.prototype.slice.call(document.querySelectorAll('#topbar a'));
  var allLinkGroups = [sideLinks, topLinks];

  var topbar = document.getElementById('topbar');
  var topbarMenu = document.getElementById('topbar-menu');
  var topbarToggle = document.getElementById('topbar-toggle');
  var topbarCurrent = document.getElementById('topbar-current');

  function setActive(id){
    allLinkGroups.forEach(function(group){
      group.forEach(function(a){
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', on);
        if(on && a.parentNode === topbarMenu && topbarCurrent){
          topbarCurrent.textContent = a.textContent.trim();
        }
      });
    });
  }

  /* --- mobile index: stays an inline row while it fits, otherwise hamburger --- */
  function closeMenu(){
    if(!topbar) return;
    topbar.classList.remove('is-open');
    if(topbarToggle){
      topbarToggle.setAttribute('aria-expanded','false');
      topbarToggle.setAttribute('aria-label','Apri il menu');
    }
  }

  function openMenu(){
    if(!topbar) return;
    topbar.classList.add('is-open');
    if(topbarToggle){
      topbarToggle.setAttribute('aria-expanded','true');
      topbarToggle.setAttribute('aria-label','Chiudi il menu');
    }
  }

  function syncTopbarFit(){
    if(!topbar || !topbarMenu) return;
    if(getComputedStyle(topbar).display === 'none'){ closeMenu(); return; }
    closeMenu();
    topbar.classList.remove('is-collapsed');
    /* measured as an inline row: content wider than the space left in the bar = collapse */
    if(topbarMenu.scrollWidth > topbarMenu.clientWidth + 1){
      topbar.classList.add('is-collapsed');
    }
  }

  if(topbarToggle){
    topbarToggle.addEventListener('click', function(){
      if(topbar.classList.contains('is-open')){ closeMenu(); } else { openMenu(); }
    });
  }

  document.addEventListener('click', function(e){
    if(topbar && topbar.classList.contains('is-open') && !topbar.contains(e.target)){ closeMenu(); }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' || e.keyCode === 27){ closeMenu(); }
  });

  var fitTimer = null;
  window.addEventListener('resize', function(){
    clearTimeout(fitTimer);
    fitTimer = setTimeout(syncTopbarFit, 120);
  });
  window.addEventListener('orientationchange', function(){ setTimeout(syncTopbarFit, 200); });
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(syncTopbarFit); }
  syncTopbarFit();

  var suppress = false, suppressTimer = null;

  function onClick(e){
    var href = this.getAttribute('href');
    if(!href || href.charAt(0) !== '#') return;
    var id = href.slice(1);
    var target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    closeMenu();
    setActive(id);
    suppress = true;
    clearTimeout(suppressTimer);
    target.scrollIntoView({behavior:'smooth', block:'start'});
    suppressTimer = setTimeout(function(){ suppress = false; }, 900);
    history.replaceState(null, '', '#' + id);
  }

  sideLinks.concat(topLinks).forEach(function(a){ a.addEventListener('click', onClick); });

  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      if(suppress) return;
      entries.forEach(function(entry){
        if(entry.isIntersecting){ setActive(entry.target.id); }
      });
    }, { root:null, rootMargin:'-45% 0px -50% 0px', threshold:0 });
    sections.forEach(function(s){ observer.observe(s); });
  }

  setActive('presentazione');

  /* Fluid scroll-reveal: content blocks fade/slide in as they enter view */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window && revealEls.length){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { root:null, rootMargin:'0px 0px -8% 0px', threshold:0.08 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }
})();
