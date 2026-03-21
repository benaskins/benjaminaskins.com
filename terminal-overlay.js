// Terminal overlay — retro terminal card carousel
(function() {
  var eras = [
    { name: 'IBM 3270 / MVS TSO', year: '1989' },
    { name: 'VMS / DCL', year: '1992' },
    { name: 'UNIX / xterm', year: '1994' },
    { name: 'CDE / Solaris', year: '1997' },
    { name: 'Windows NT', year: '1999' },
    { name: 'macOS Terminal', year: '2006' },
    { name: 'Claude Code', year: '2025' }
  ];

  var currentEra = 0;
  var cycleTimer = null;
  var paused = false;
  var CYCLE_MS = 5000;

  var overlay = document.getElementById('terminalOverlay');
  var eraNameEl = document.getElementById('eraName');
  var dotsEl = document.getElementById('terminalDots');
  var pauseBtn = document.getElementById('pauseBtn');
  var screens = overlay.querySelectorAll('.t-screen');

  // Build dots
  eras.forEach(function(_, i) {
    var dot = document.createElement('span');
    dot.className = 'terminal-dot' + (i === 0 ? ' active' : '');
    dot.onclick = function() { goToScreen(i); };
    dotsEl.appendChild(dot);
  });

  function showEra(idx) {
    currentEra = idx;
    screens.forEach(function(s) { s.classList.remove('active'); });
    screens[idx].classList.add('active');
    eraNameEl.textContent = eras[idx].name + ' // ' + eras[idx].year;
    dotsEl.querySelectorAll('.terminal-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === idx);
    });
  }

  function goToScreen(idx) {
    showEra(idx);
    resetCycle();
  }

  function startCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
    if (!paused) {
      cycleTimer = setInterval(function() {
        showEra((currentEra + 1) % eras.length);
      }, CYCLE_MS);
    }
  }

  function resetCycle() {
    if (cycleTimer) clearInterval(cycleTimer);
    startCycle();
  }

  window.openTerminalOverlay = function() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    paused = false;
    pauseBtn.innerHTML = '\u23F8';
    showEra(0);
    startCycle();
  };

  window.closeTerminalOverlay = function() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (cycleTimer) clearInterval(cycleTimer);
  };

  window.nextScreen = function() {
    goToScreen((currentEra + 1) % eras.length);
  };

  window.prevScreen = function() {
    goToScreen((currentEra - 1 + eras.length) % eras.length);
  };

  window.togglePause = function() {
    paused = !paused;
    pauseBtn.innerHTML = paused ? '\u25B6' : '\u23F8';
    if (paused) {
      if (cycleTimer) clearInterval(cycleTimer);
    } else {
      startCycle();
    }
  };

  // Keyboard nav
  document.addEventListener('keydown', function(e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeTerminalOverlay();
    if (e.key === 'ArrowRight') { nextScreen(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { prevScreen(); e.preventDefault(); }
    if (e.key === ' ') { togglePause(); e.preventDefault(); }
  });
})();
