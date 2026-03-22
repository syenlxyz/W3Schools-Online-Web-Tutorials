"use strict";

/*
  BottomStatus (modern)
  - Compact bottom status bar with avatar, XP and streak
  - Self-contained: injects CSS, renders HTML, and wires JS behaviors
  - Prepared for API integration (profile, XP, streak)
*/

(function () {
  if (window.BottomStatus) {
    return;
  }
  var BottomStatus = {
    _rendered: false,
    _styleId: 'bottom-status-modern-style',
    _lessonFinishedListenerId: 'bottom-status-on-finish',
    _defaults: {
      xp: 0,
      streakDays: 0
    },
    _apiDataLoaded: false
  };

  // CSS
  BottomStatus._injectCss = function () {
    if (document.getElementById(BottomStatus._styleId)) return;
    var css = '' + '.bs-status{--bs-bg:#fff;--bs-border:#e5e5e5;--bs-text:#000;--bs-avatar-bg:#fff;--bs-inc-color:#04aa6d}' + '.darkpagetheme .bs-status{--bs-bg:#1d2a35;--bs-border:#38444d;--bs-text:#ddd;--bs-avatar-bg:#1d2a35}' + '.bs-status .bs-compact-bar{display:inline-flex;align-items:center;gap:12px;border:1px solid var(--bs-border);border-radius:8px;padding:6px 14px;background:var(--bs-bg);position:relative}' + '.bs-status .bs-compact-bar .-avatar{width:32px;height:32px;border-radius:50%;background:var(--bs-avatar-bg) center/cover no-repeat;flex:0 0 auto;border:none}' + '.bs-status .bs-compact-bar .-meta{display:inline-flex;align-items:center;gap:10px;font-family:"Source Sans Pro",sans-serif;font-size:15px;color:var(--bs-text)}' + '.bs-status .bs-compact-bar .-sep{opacity:.6}' + '.bs-status .bs-compact-bar .-xp{position:relative;display:inline-flex;gap:6px;align-items:center}' + '.bs-status .bs-compact-bar .-xp .-inc{position:absolute;right:-22px;bottom:50%;transform:translateY(50%);color:var(--bs-inc-color);font-weight:600;opacity:0;pointer-events:none;transition:opacity .5s ease,transform .35s ease}' + '.bs-status .bs-compact-bar .-xp .-inc.-show{opacity:1;transform:translateY(-10px);}' + '.bs-status .bs-compact-bar .-xp .-inc.-fade{opacity:0;}' + '.bs-status .bs-compact-bar.-locked::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.3);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border-radius:8px;z-index:1}' + '.darkpagetheme .bs-status .bs-compact-bar.-locked::before{background:rgba(29,42,53,0.7)}' + '.bs-status .bs-compact-bar.-locked .-lock-overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;display:flex;align-items:center;justify-content:center;width:16px;height:21px}' + '.bs-status .bs-compact-bar.-locked .-lock-overlay svg{width:16px;height:21px;stroke:var(--bs-text);transition:stroke 0.2s ease}' + '.bs-status .bs-compact-bar.-link{cursor:pointer;transition:opacity 0.2s ease}' + '.bs-status .bs-compact-bar.-link:hover{opacity:0.85}' + '.bs-status .bs-compact-bar.-locked.-link:hover .-lock-overlay svg{stroke:#2374ff}' + '@media (max-width:768px){.bs-status .bs-compact-bar{display:flex;width:100%;margin-top:70px;text-align:center;justify-content:center;align-items:center}}';
    var style = document.createElement('style');
    style.id = BottomStatus._styleId;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  };

  // HTML render
  BottomStatus._render = function (wrapper) {
    try {
      wrapper.style.textAlign = 'center';
    } catch (e) {}
    var container = document.createElement('div');
    container.className = 'bs-status';
    var bar = document.createElement('div');
    bar.className = 'bs-compact-bar';

    // Get the appropriate XP increment amount for display
    var xpIncrement = parseInt(10 * MyLearning.getXpRate());
    bar.innerHTML = '' + '<div class="-avatar" aria-label="Your profile"></div>' + '<div class="-meta">' + '<span class="-xp" aria-label="Experience points">XP <span class="-val">' + BottomStatus._defaults.xp + '</span><span class="-inc">+' + xpIncrement + '</span></span>' + '<span class="-sep">•</span>' + '<span class="-streak" aria-label="Learning streak">🔥 <span class="-val">' + BottomStatus._defaults.streakDays + ' days</span></span>' + '</div>' + '<div class="-lock-overlay" style="display:none"><svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6667 9.83301H3.33333C2.59695 9.83301 2 10.43 2 11.1663V15.833C2 16.5694 2.59695 17.1664 3.33333 17.1664H12.6667C13.403 17.1664 14 16.5694 14 15.833V11.1663C14 10.43 13.403 9.83301 12.6667 9.83301Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.66675 9.83301V7.16635C4.66675 6.28229 5.01794 5.43445 5.64306 4.80932C6.26818 4.1842 7.11602 3.83301 8.00008 3.83301C8.88413 3.83301 9.73198 4.1842 10.3571 4.80932C10.9822 5.43445 11.3334 6.28229 11.3334 7.16635V9.83301" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    container.appendChild(bar);

    // Check if mobile viewport
    var isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // On mobile, append after all buttons
      wrapper.appendChild(container);
    } else {
      // On desktop, always append at the end to ensure it stays with bottom buttons
      // This prevents it from appearing between top buttons
      wrapper.appendChild(container);
    }
    BottomStatus._rendered = true;
    BottomStatus._updateMetaFromKnownSources();
    BottomStatus._checkAndApplyLockedState();
  };

  // JS behaviors
  BottomStatus._getBar = function () {
    return document.querySelector('.bs-status .bs-compact-bar');
  };

  // Load API data lazily
  BottomStatus._loadAPIData = function () {
    if (BottomStatus._apiDataLoaded) {
      return;
    }
    if (typeof SharedAPI === 'undefined') {
      // Retry after a short delay if SharedAPI is not yet loaded
      setTimeout(BottomStatus._loadAPIData, 100);
      return;
    }
    BottomStatus._apiDataLoaded = true;
    SharedAPI.lazyFetchAll(function (data) {
      BottomStatus._updateWithAPIData(data);
    });
  };

  // Update UI with API data
  BottomStatus._updateWithAPIData = function (data) {
    try {
      var bar = BottomStatus._getBar();
      if (!bar) return;

      // Update XP
      if (data.xp !== null) {
        var xpValElm = bar.querySelector('.-xp .-val');
        if (xpValElm) xpValElm.textContent = data.xp;
      }

      // Update streak
      if (data.streaks !== null) {
        var streakElm = bar.querySelector('.-streak .-val');
        if (streakElm) {
          var days = data.streaks;
          streakElm.textContent = days + ' day' + (days === 1 ? '' : 's');
        }
      }
    } catch (e) {
      console.error('Error updating bottom status with API data:', e);
    }
  };
  BottomStatus._updateMetaFromKnownSources = function () {
    try {
      var bar = BottomStatus._getBar();
      if (!bar) return;

      // Avatar: use same method as right-hand-side-menu
      var avatarElm = bar.querySelector('.-avatar');
      var profilePictureUrl = null;
      if (typeof UserSession !== 'undefined' && typeof UserSession.getCachedProfilePictureUrl === 'function') {
        profilePictureUrl = UserSession.getCachedProfilePictureUrl();
      }
      if (avatarElm) {
        if (profilePictureUrl) {
          avatarElm.style.backgroundImage = "url('" + profilePictureUrl + "')";
        } else {
          avatarElm.style.backgroundImage = '';
        }
      }

      // XP: from Pathfinder._userXp if available
      var xpValElm = bar.querySelector('.-xp .-val');
      if (xpValElm) {
        var xpAmount = typeof Pathfinder !== 'undefined' && typeof Pathfinder._userXp !== 'undefined' && Pathfinder._userXp !== null ? Pathfinder._userXp : BottomStatus._defaults.xp;
        xpValElm.textContent = xpAmount;
      }

      // Streak: try common fields from TopNavBar.mylUserLiteState
      var streakElm = bar.querySelector('.-streak .-val');
      if (streakElm) {
        var days = BottomStatus._defaults.streakDays;
        if (TopNavBar.mylUserLiteState) {
          var s = TopNavBar.mylUserLiteState.streak || TopNavBar.mylUserLiteState.dailyStreak || TopNavBar.mylUserLiteState.currentStreak;
          if (typeof s === 'number') days = s;
          if (s && typeof s.days === 'number') days = s.days;
        }
        streakElm.textContent = days + ' day' + (days === 1 ? '' : 's');
      }
    } catch (e) {
      // swallow
    }
  };
  BottomStatus.incrementXp = function (amount) {
    try {
      var bar = BottomStatus._getBar();
      if (!bar) return;
      var xpValElm = bar.querySelector('.-xp .-val');
      var incElm = bar.querySelector('.-xp .-inc');
      if (!xpValElm || !incElm) return;
      var current = parseInt(xpValElm.textContent, 10);
      if (isNaN(current)) current = BottomStatus._defaults.xp;
      var inc = typeof amount === 'number' ? amount : 10;
      var next = current + inc;
      xpValElm.textContent = next;
      incElm.textContent = '+' + inc;
      // show rise then fade (no drop back down)
      incElm.classList.remove('-fade');
      incElm.classList.remove('-show');
      void incElm.offsetWidth; // reflow
      incElm.classList.add('-show');
      clearTimeout(incElm._fadeTimeout);
      clearTimeout(incElm._cleanupTimeout);
      incElm._fadeTimeout = setTimeout(function () {
        incElm.classList.add('-fade');
      }, 500);
      incElm._cleanupTimeout = setTimeout(function () {
        incElm.classList.remove('-fade');
        incElm.classList.remove('-show');
      }, 1200);
      if (typeof Pathfinder !== 'undefined') {
        var base = typeof Pathfinder._userXp === 'number' ? Pathfinder._userXp : current;
        Pathfinder._userXp = base + inc;
      }
    } catch (e) {
      // swallow
    }
  };
  BottomStatus._hideLegacyWrapper = function () {
    try {
      var legacy = document.getElementById('user-profile-bottom-wrapper');
      if (legacy) {
        legacy.style.display = 'none';
      }
    } catch (e) {}
  };
  BottomStatus._findBottomNextPrev = function () {
    var containers = document.querySelectorAll('.nextprev');
    if (!containers || !containers.length) return null;
    return containers[containers.length - 1];
  };

  // Check if plan is closed and apply locked state
  BottomStatus._checkAndApplyLockedState = function () {
    try {
      var bar = BottomStatus._getBar();
      if (!bar) return;
      var lockOverlay = bar.querySelector('.-lock-overlay');
      if (!MyLearning.isProgressTrackingEnabled()) {
        bar.classList.add('-locked', '-link');
        if (lockOverlay) {
          lockOverlay.style.display = 'flex';
        }

        // Ensure only locked click handler is active
        bar.removeEventListener('click', BottomStatus._handleUnlockedClick);
        // Add click handler to navigate to orders plans page
        bar.addEventListener('click', BottomStatus._handleLockedClick);
      } else {
        bar.classList.remove('-locked');
        bar.classList.add('-link');
        if (lockOverlay) {
          lockOverlay.style.display = 'none';
        }
        // Ensure only unlocked click handler is active
        bar.removeEventListener('click', BottomStatus._handleLockedClick);
        bar.addEventListener('click', BottomStatus._handleUnlockedClick);
      }
    } catch (e) {
      console.error('Error checking locked state:', e);
    }
  };

  // Handle click on locked bar
  BottomStatus._handleLockedClick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    var destUrl;
    if (UserSession.userIsOnboarding()) {
      destUrl = MyLearning._dashboardBaseUrl;
    } else {
      destUrl = "".concat(MyLearning._orderBaseUrl, "/plans");
    }
    window.open(destUrl, '_blank');
  };
  BottomStatus._handleUnlockedClick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.open(MyLearning._dashboardBaseUrl, '_blank');
  };
  BottomStatus.init = function () {
    BottomStatus._injectCss();
    BottomStatus._hideLegacyWrapper();
    var target = BottomStatus._findBottomNextPrev();
    if (!target) return;
    if (!BottomStatus._rendered) {
      BottomStatus._render(target);
    }

    // Wire up to lesson finished event for XP based on subscription plan
    if (MyLearning.lessonFinishedListeners) {
      MyLearning.lessonFinishedListeners[BottomStatus._lessonFinishedListenerId] = function () {
        if (MyLearning.isProgressTrackingEnabled()) {
          // Get XP amount based on subscription plan
          var xpAmount = parseInt(10 * MyLearning.getXpRate());
          BottomStatus.incrementXp(xpAmount);
        }
      };
    }

    // Initial refresh from known sources after a slight delay
    setTimeout(BottomStatus._updateMetaFromKnownSources, 200);

    // Check locked state after a slight delay to ensure UserSession is available
    setTimeout(BottomStatus._checkAndApplyLockedState, 200);

    // Load API data lazily (non-blocking)
    BottomStatus._loadAPIData();
  };
  window.BottomStatus = BottomStatus;
})();
