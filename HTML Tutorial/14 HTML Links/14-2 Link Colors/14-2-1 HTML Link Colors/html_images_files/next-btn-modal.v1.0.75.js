"use strict";

/*
  NextButtonModal script
*/

// Next Button Modal Interceptor
window.NextButtonModal = {
  _elm: null,
  _rendered: false,
  _originalNextUrl: null,
  _debugMode: true,
  // Set to true for local testing
  _initialized: false,
  _countdownTimer: null,
  _showTimeout: null // Store the show debounce timeout
};
NextButtonModal._logDebug = function (message, data, logRawData) {
  if (NextButtonModal._debugMode && typeof Util !== 'undefined') {
    return Util.logDebug('NextButtonModal', message, data, logRawData);
  }
};
NextButtonModal._logError = function (message, data, logRawData) {
  if (typeof Util !== 'undefined') {
    return Util.logError('NextButtonModal', message, data, logRawData);
  } else {
    console.error('NextButtonModal:', message, data);
  }
};
NextButtonModal._getUserProfilePicture = function () {
  return UserSession.getCachedProfilePictureUrl();
};

// Inject CSS for locked state
NextButtonModal._injectLockedCss = function () {
  var styleId = 'next-btn-modal-locked-style';
  if (document.getElementById(styleId)) return;
  var css = '.next-btn-modal-avatar-progress-container{position:relative}' + '.next-btn-modal-avatar-progress-container.-locked::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.3);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);border-radius:12px;z-index:1}' + '.next-btn-modal-avatar-progress-container.-locked .-lock-overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;display:flex;align-items:center;justify-content:center;width:16px;height:21px}' + '.next-btn-modal-avatar-progress-container.-locked .-lock-overlay svg{width:16px;height:21px;stroke:#333;color:#333;transition:stroke 0.2s ease}';
  var style = document.createElement('style');
  style.id = styleId;
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};
NextButtonModal._getTutorialInfo = function () {
  // Get tutorial info from MyLearning data or page context
  var info = {
    tutorialName: 'Tutorial',
    lessonName: 'this lesson',
    progress: null
  };

  // First try to get from global subjectFolder variable if available
  var topicId = null;

  // Check if subjectFolder exists (defined in inc_meta.inc)
  if (typeof subjectFolder !== 'undefined' && subjectFolder) {
    var cleanSubject = subjectFolder.replace(/\//g, '').toLowerCase();
    // Extract first part if it has underscore (e.g., python_intro -> python)
    if (cleanSubject.indexOf('_') > -1) {
      cleanSubject = cleanSubject.split('_')[0];
    }
    topicId = cleanSubject;
  }

  // If no subjectFolder, try MyLearning.topicId
  if (!topicId && MyLearning.topicId) {
    // Check if topicId is a UUID (contains dashes)
    topicId = MyLearning.topicId;
    if (topicId && topicId.indexOf('-') > -1) {
      // It's a UUID, not useful
      topicId = null;
    }
  }

  // Map topicId to readable tutorial name
  var topicMap = {
    accessibility: 'Accessibility',
    ai: 'AI',
    angular: 'Angular',
    angularjs: 'AngularJS',
    asp: 'ASP',
    aws: 'AWS',
    bash: 'Bash',
    bootstrap: 'Bootstrap',
    c: 'C',
    canvas: 'Canvas',
    colors: 'Colors',
    cpp: 'C++',
    cs: 'C#',
    css: 'CSS',
    cybersecurity: 'Cybersecurity',
    datascience: 'Data Science',
    django: 'Django',
    dsa: 'DSA',
    excel: 'Excel',
    genai: 'Gen AI',
    git: 'Git',
    go: 'Go',
    graphics: 'Graphics',
    howto: 'How To',
    html: 'HTML',
    htmlcss: 'HTML & CSS',
    icons: 'Icons',
    introprogramming: 'Intro to Programming',
    java: 'Java',
    jquery: 'jQuery',
    js: 'JavaScript',
    kotlin: 'Kotlin',
    ml: 'Machine Learning',
    mongodb: 'MongoDB',
    mysql: 'MySQL',
    nodejs: 'Node.js',
    numpy: 'NumPy',
    pandas: 'Pandas',
    php: 'PHP',
    postgresql: 'PostgreSQL',
    python: 'Python',
    r: 'R',
    react: 'React',
    rust: 'Rust',
    sass: 'Sass',
    scipy: 'SciPy',
    sheets: 'Google Sheets',
    sql: 'SQL',
    statistics: 'Statistics',
    svg: 'SVG',
    swift: 'Swift',
    typescript: 'TypeScript',
    vue: 'Vue',
    w3css: 'W3.CSS',
    xml: 'XML'
  };
  if (topicId && topicMap[topicId]) {
    info.tutorialName = topicMap[topicId] + ' Tutorial';
  }

  // Get progress if available (from MyLearning)
  if (MyLearning.pages_read_count && MyLearning.total_pages_count) {
    info.progress = {
      current: MyLearning.pages_read_count,
      total: MyLearning.total_pages_count,
      percentage: Math.round(MyLearning.pages_read_count / MyLearning.total_pages_count * 100)
    };
  }

  // If still no tutorial name, fallback to URL for tutorial name
  if (!info.tutorialName || info.tutorialName === 'Tutorial') {
    // Fallback: try to guess from URL
    var pathname = window.location.pathname;
    var pathParts = pathname.split('/');
    if (pathParts.length > 1 && pathParts[1]) {
      var topic = pathParts[1].toUpperCase();
      // Special cases
      if (topic === 'JS') topic = 'JavaScript';
      if (topic === 'CPP') topic = 'C++';
      if (topic === 'CS') topic = 'C#';
      if (topic === 'DSA') topic = 'DSA';
      info.tutorialName = topic + ' Tutorial';
    }
  }

  // Get current lesson name
  var h1Element = document.querySelector('#main h1');
  if (h1Element) {
    info.lessonName = h1Element.textContent.trim();
  } else {
    var pageTitle = document.title || 'this lesson';
    info.lessonName = pageTitle.replace(' - W3Schools', '').replace('W3Schools', '').trim();
  }
  return info;
};
NextButtonModal._shouldShowModal = function () {
  if (typeof UserSession !== 'undefined') {
    if (UserSession.loggedIn === true) {
      var subscriptionPlan = UserSession.getUserSubscriptionPlan();

      // Don't show modal if lesson was already completed before
      var wasAlreadyCompleted = false;
      if (MyLearning.lessonFinishedOnInit === true) {
        wasAlreadyCompleted = true;
      }
      return ['free', 'closed'].includes(subscriptionPlan) && !wasAlreadyCompleted;
    }
  }
  return false;
};

// Returns true if the current page was completed during this session (not already completed on init)
NextButtonModal._wasCompletedThisRun = function () {
  try {
    return MyLearning.lessonFinished === true && MyLearning.lessonFinishedOnInit !== true;
  } catch (e) {
    return false;
  }
};
NextButtonModal._createModal = function () {
  // Create modal overlay
  var overlay = document.createElement('div');
  overlay.id = 'nextButtonModalOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999998;display:none;';

  // Create modal container
  var modal = document.createElement('div');
  modal.id = 'nextButtonModal';

  // Check if mobile - improved breakpoint and better mobile detection
  var isMobile = window.innerWidth <= 768;
  if (isMobile) {
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;overflow-y:auto;z-index:999999;display:none;-webkit-overflow-scrolling:touch;';
  } else {
    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:8px;width:90%;max-width:900px;max-height:80vh;overflow-y:auto;z-index:999999;display:none;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
  }
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Close modal when clicking overlay (and navigate to next page)
  overlay.addEventListener('click', function () {
    NextButtonModal._closeModal();
  });
  return modal;
};
NextButtonModal._closeModal = function (shouldNavigate) {
  var modal = document.getElementById('nextButtonModal');
  var overlay = document.getElementById('nextButtonModalOverlay');
  if (modal) modal.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
  NextButtonModal._rendered = false;

  // Clear any existing countdown timer
  if (NextButtonModal._countdownTimer) {
    clearInterval(NextButtonModal._countdownTimer);
    NextButtonModal._countdownTimer = null;
  }

  // Clear any existing show timeout
  if (NextButtonModal._showTimeout) {
    clearTimeout(NextButtonModal._showTimeout);
    NextButtonModal._showTimeout = null;
  }

  // Navigate to the next page if requested (default: true for backwards compatibility)
  if (shouldNavigate !== false && NextButtonModal._originalNextUrl) {
    window.location.href = NextButtonModal._originalNextUrl;
  }
};
NextButtonModal._show = function (nextUrl) {
  // Prevent rapid successive calls
  if (NextButtonModal._showTimeout) {
    return;
  }
  NextButtonModal._showTimeout = setTimeout(function () {
    NextButtonModal._showTimeout = null;
  }, 100); // 100ms debounce

  // If modal is already rendered, check if it's actually visible
  if (NextButtonModal._rendered) {
    var modal = document.getElementById('nextButtonModal');
    var overlay = document.getElementById('nextButtonModalOverlay');
    if (modal && overlay) {
      // Check if modal is actually visible
      var modalVisible = modal.style.display !== 'none' && modal.offsetParent !== null;
      var overlayVisible = overlay.style.display !== 'none' && overlay.offsetParent !== null;
      if (modalVisible && overlayVisible) {
        var isMobile = window.innerWidth <= 480;
        if (!isMobile) {
          // Flash the modal slightly to show it's already open (desktop only)
          modal.style.transform = 'translate(-50%, -50%) scale(1.02)';
          setTimeout(function () {
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
          }, 100);
        }
        return;
      } else {
        // Modal exists but not visible, force it to show
        modal.style.display = 'block';
        overlay.style.display = 'block';
        return;
      }
    } else {
      // Modal elements don't exist, reset the flag and recreate
      NextButtonModal._rendered = false;
    }
  }
  NextButtonModal._originalNextUrl = nextUrl;
  NextButtonModal._rendered = true;

  // Get current page title
  var pageTitle = document.title || 'this lesson';
  // Clean up title - remove "W3Schools" suffix if present
  pageTitle = pageTitle.replace(' - W3Schools', '').replace('W3Schools', '').trim();

  // Get tutorial and lesson info
  var tutorialInfo = NextButtonModal._getTutorialInfo();
  var tutorialName = tutorialInfo.tutorialName;
  var lessonName = tutorialInfo.lessonName;

  // Calculate progress percentage with fallbacks
  var progressPercentage = 10; // Default
  var computedPercentage = null;

  // Try TopNavBar cached progress first (most reliable)
  if (TopNavBar.cachedUserData !== null && typeof TopNavBar.cachedUserData !== 'undefined' && TopNavBar.cachedUserData.currentProgress !== null && typeof TopNavBar.cachedUserData.currentProgress !== 'undefined' && typeof TopNavBar.cachedUserData.currentProgress.progress === 'number') {
    computedPercentage = TopNavBar.cachedUserData.currentProgress.progress;
  }
  // Try tutorialInfo progress
  else if (tutorialInfo.progress && typeof tutorialInfo.progress.percentage === 'number' && isFinite(tutorialInfo.progress.percentage)) {
    computedPercentage = tutorialInfo.progress.percentage;
  }
  // Try MyLearning progress data
  else if (typeof MyLearning.pages_read_count === 'number' && typeof MyLearning.total_pages_count === 'number' && MyLearning.total_pages_count > 0) {
    computedPercentage = Math.round(MyLearning.pages_read_count / MyLearning.total_pages_count * 100);
  }
  if (typeof computedPercentage === 'number' && isFinite(computedPercentage)) {
    progressPercentage = Math.max(0, Math.min(100, computedPercentage));
  }

  // Ensure nextUrl is absolute
  var absoluteNextUrl = nextUrl;
  if (nextUrl && !nextUrl.startsWith('http') && !nextUrl.startsWith('/')) {
    // It's a relative URL, make it absolute
    var currentPath = window.location.pathname;
    var basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    absoluteNextUrl = basePath + '/' + nextUrl;
  }

  // Check if the current page/lesson has been completed
  var isPageCompleted = MyLearning.lessonFinished === true;

  // Check if plan is closed
  var isClosed = UserSession.getUserSubscriptionPlan() === 'closed';

  // Get or create modal
  var modal = document.getElementById('nextButtonModal');
  if (!modal) {
    try {
      modal = NextButtonModal._createModal();
    } catch (error) {
      console.error('Error creating modal:', error);
      return;
    }
  } else {}

  // Check if mobile - improved breakpoint and better mobile detection
  var isMobile = window.innerWidth <= 768;
  var userIsOnboarding = UserSession.userIsOnboarding('NextButtonModal -> _show');

  // Build modal content
  var modalHTML = '';

  // Add close button (navigate to next page when clicked) - mobile friendly
  modalHTML += '<button onclick="NextButtonModal._closeModal()" style="position:absolute;top:' + (isMobile ? '15px' : '10px') + ';right:' + (isMobile ? '10px' : '10px') + ';background:none;border:none;font-size:' + (isMobile ? '32px' : '28px') + ';color:#666;cursor:pointer;padding:' + (isMobile ? '0px 5px' : '5px 10px') + ';line-height:1;z-index:1;touch-action:manipulation;">&times;</button>';
  modalHTML += '<div class="-next-btn-modal-body" style="display:flex;align-items:stretch;' + (isMobile ? 'flex-direction:column;min-height:100vh;padding-top:20px;' : 'height:500px;') + 'width:100%;max-width:100%;">';

  // Left content (or top on mobile)
  modalHTML += '<div class="-next-btn-modal-progress-content" style="width:' + (isMobile ? '100%' : '50%') + ';flex:' + (isMobile ? '1 1 auto' : '0 0 50%') + ';padding:' + (isMobile ? '20px 16px 30px' : '50px 40px') + ';display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' + (isMobile ? 'order:2;' : 'min-height:0;') + '">';
  if (userIsOnboarding) {
    modalHTML += '<div style="background:#FFDED7;border-radius:8px;padding:5px 16px;margin:0 auto ' + (isMobile ? '12px' : '16px') + ';display:inline-flex;align-items:center;justify-content:center;text-align:center;">' + '<span style="font-family:\'Source Sans Pro\',sans-serif;font-weight:400;font-size:18px;line-height:22px;letter-spacing:0.05em;color:#B41819;font-variant:all-small-caps;padding-bottom:3px;">FINISH ONBOARDING TO TRACK PROGRESS</span>' + '</div>';
  } else if (isClosed) {
    modalHTML += '<div style="background:#FFDED7;border-radius:8px;padding:5px 16px;margin:0 auto ' + (isMobile ? '12px' : '16px') + ';display:inline-flex;align-items:center;justify-content:center;text-align:center;">' + '<span style="font-family:\'Source Sans Pro\',sans-serif;font-weight:400;font-size:18px;line-height:22px;letter-spacing:0.05em;color:#B41819;font-variant:all-small-caps;padding-bottom:3px;">YOUR FREE TRIAL HAS ENDED</span>' + '</div>';
    modalHTML += '<div style="font-size:24px;font-weight:600;color:#000;margin:0 0 ' + (isMobile ? '8px' : '12px') + ';line-height:30px;">Nice progress!</div>';
    modalHTML += '<p style="font-size:16px;line-height:21px;color:#555;max-width:80%;margin:0 0 ' + (isMobile ? '20px' : '28px') + '">Upgrade your plan to keep your progress and unlock all activities</p>';
  } else if (isPageCompleted) {
    modalHTML += '<div style="font-size:' + (isMobile ? '11px' : '12px') + ';font-weight:600;letter-spacing:.08em;color:#666;text-transform:uppercase;margin-bottom:' + (isMobile ? '12px' : '16px') + '">Activity Completed</div>';
    modalHTML += '<h1 style="font-size:' + (isMobile ? '28px' : '32px') + ';font-weight:600;color:#000;margin:0 0 ' + (isMobile ? '8px' : '12px') + ';line-height:1.2;">Nice Work!</h1>';
    modalHTML += '<p style="font-size:' + (isMobile ? '16px' : '18px') + ';color:#555;margin:0 0 ' + (isMobile ? '20px' : '28px') + '">You\'ve finished <strong style="color:#333;">' + (lessonName || pageTitle) + '</strong></p>';
  } else {
    modalHTML += '<div style="font-size:' + (isMobile ? '11px' : '12px') + ';font-weight:600;letter-spacing:.08em;color:#666;text-transform:uppercase;margin-bottom:' + (isMobile ? '12px' : '16px') + '">ACTIVITY IN PROGRESS</div>';
    modalHTML += '<h1 style="font-size:' + (isMobile ? '28px' : '32px') + ';font-weight:600;color:#000;margin:0 0 ' + (isMobile ? '8px' : '12px') + ';line-height:1.2;">Keep going!</h1>';
    modalHTML += '<p style="font-size:' + (isMobile ? '16px' : '18px') + ';color:#555;margin:0 0 ' + (isMobile ? '20px' : '28px') + '">You\'ve started <strong style="color:#333;">' + (lessonName || pageTitle) + '</strong>.<br>Complete the lesson to unlock your XP.</p>';
  }

  // Inject CSS for locked state
  NextButtonModal._injectLockedCss();

  // Wrap avatar and progress bar in a container
  modalHTML += '<div class="next-btn-modal-avatar-progress-container' + (isClosed || userIsOnboarding ? ' -locked' : '') + '">';

  // Profile avatar - use user's avatar if available, otherwise default lynx
  var userAvatarUrl = NextButtonModal._getUserProfilePicture();
  var avatarSrc = userAvatarUrl || '/images/lynx.svg';
  var avatarAlt = userAvatarUrl ? 'User Avatar' : 'Lynx';
  var avatarStyle = userAvatarUrl ? 'object-fit:cover;width:85%;height:85%;border-radius:12px;margin:7.5%;' : 'object-fit:contain;width:100%;height:100%;';
  modalHTML += '<div style="width:' + (isMobile ? '80px' : '100px') + ';height:' + (isMobile ? '80px' : '100px') + ';border-radius:12px;background:#f0f0f0;margin:0 auto ' + (isMobile ? '16px' : '24px') + ';min-height:100px;display:flex;align-items:center;justify-content:center;overflow:hidden;">';
  modalHTML += '<img src="' + avatarSrc + '" alt="' + avatarAlt + '" style="' + avatarStyle + '" />';
  modalHTML += '</div>';
  if (isPageCompleted) {
    // Calculate XP amount based on subscription plan
    var xpAmount = parseInt(10 * MyLearning.getXpRate());
    modalHTML += '<div style="display:flex;align-items:center;gap:12px;margin:10px 0 10px;">';
    modalHTML += '<span style="background:#2374ff;color:#fff;border-radius:6px;padding:8px 12px;font-weight:700;font-size:14px;">XP</span>';
    modalHTML += '<span style="font-size:18px;font-weight:600;color:#333;">+' + xpAmount + ' XP</span>';
    modalHTML += '</div>';
  }

  // Progress section - mobile friendly
  modalHTML += '<div style="width:' + (isMobile ? '90%' : '70%') + ';max-width:420px;min-width:' + (isMobile ? '200px' : '240px') + '">';
  modalHTML += '<div style="display:flex;justify-content:space-between;margin-top:10px;margin-bottom:10px;font-size:' + (isMobile ? '13px' : '14px') + ';font-weight:500;color:#666;">';
  modalHTML += '<span>' + tutorialName + '</span>';
  modalHTML += '<span>' + progressPercentage + '% complete</span>';
  modalHTML += '</div>';
  modalHTML += '<div style="width:100%;height:' + (isMobile ? '8px' : '10px') + ';background:#eaeaea;border-radius:6px;overflow:hidden;margin-bottom:' + (isMobile ? '20px' : '24px') + '">';
  modalHTML += '<div style="height:100%;background:#04aa6d;transition:width 0.3s ease;width:' + progressPercentage + '%;"></div>';
  modalHTML += '</div>';
  modalHTML += '</div>'; // Close progress section wrapper

  // Lock overlay icon (only shown when locked)
  if (isClosed || userIsOnboarding) {
    modalHTML += '<div class="-lock-overlay"><svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6667 9.83301H3.33333C2.59695 9.83301 2 10.43 2 11.1663V15.833C2 16.5694 2.59695 17.1664 3.33333 17.1664H12.6667C13.403 17.1664 14 16.5694 14 15.833V11.1663C14 10.43 13.403 9.83301 12.6667 9.83301Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.66675 9.83301V7.16635C4.66675 6.28229 5.01794 5.43445 5.64306 4.80932C6.26818 4.1842 7.11602 3.83301 8.00008 3.83301C8.88413 3.83301 9.73198 4.1842 10.3571 4.80932C10.9822 5.43445 11.3334 6.28229 11.3334 7.16635V9.83301" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }

  // Close container
  modalHTML += '</div>';

  // Continue button centered below progress bar - mobile friendly
  modalHTML += '<div style="text-align:center;margin-top:' + (isMobile ? '16px' : '20px') + ';">';
  if (isClosed || userIsOnboarding) {
    // Two buttons for closed plan: Upgrade Now and Go Next
    modalHTML += '<div style="display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;">';
    var leftBtnUrl = userIsOnboarding ? MyLearning._dashboardBaseUrl : MyLearning._orderBaseUrl + '/plans';
    var leftBtnLabel = userIsOnboarding ? 'Onboarding' : 'Upgrade Now';
    modalHTML += '<a href="' + leftBtnUrl + '" target="_blank" style="padding:' + (isMobile ? '14px 28px' : '12px 32px') + ';background:#9763f6;color:#fff;border:none;border-radius:8px;border-bottom:1px solid #9763f6;font-size:' + (isMobile ? '18px' : '16px') + ';font-weight:600;cursor:pointer;touch-action:manipulation;min-height:48px;text-decoration:none;display:inline-block;font-family:sans-serif;">' + leftBtnLabel + '</a>';
    // Go Next button (white with border)
    modalHTML += '<button id="modalContinueBtn" style="padding:' + (isMobile ? '14px 22px' : '12px 20px') + ';background:#fff;color:#000;border:1px solid #000;border-radius:8px;font-size:' + (isMobile ? '18px' : '16px') + ';font-weight:600;cursor:pointer;touch-action:manipulation;min-height:48px;font-family:sans-serif;">Go Next</button>';
    modalHTML += '</div>';
  } else {
    // Single button for non-closed plans
    modalHTML += '<button id="modalContinueBtn" style="padding:' + (isMobile ? '14px 28px' : '12px 32px') + ';background:#04aa6d;color:#fff;border:none;border-radius:6px;font-size:' + (isMobile ? '18px' : '16px') + ';font-weight:600;cursor:pointer;touch-action:manipulation;min-height:48px;">Go Next ›</button>';
  }
  modalHTML += '</div>';
  modalHTML += '</div>'; // Close -next-btn-modal-progress-content

  // Divider
  modalHTML += '<div style="' + (isMobile ? 'width:100%;height:1px;' : 'width:1px;') + 'background:#e0e0e0;' + (isMobile ? 'order:1;' : '') + '"></div>';

  // Right content (ad placeholder) - appears at top on mobile
  modalHTML += '<div class="-next-btn-modal-ad-container" style="width:' + (isMobile ? '100%' : '50%') + ';flex:' + (isMobile ? '1 1 auto' : '0 0 50%') + ';padding:' + (isMobile ? '16px' : '40px') + ';display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f8f8f8;' + (isMobile ? 'order:0;min-height:200px;' : 'min-height:0;') + '">';
  modalHTML += '<div style="' + (isMobile ? 'width:100%' : '') + ';max-width:100%;min-height:' + (isMobile ? '120px' : '138px') + ';display:flex;align-items:center;justify-content:center;">' + '<div id="adngin-modal_banner-0"></div>' + '</div>';
  modalHTML += '<div style="margin-top:' + (isMobile ? '16px' : '20px') + '">';
  modalHTML += '<a href="' + MyLearning._orderBaseUrl + '/plans" class="ga-featured ga-featured-modal-removeads" target="_blank" style="font-size:' + (isMobile ? '13px' : '14px') + ';font-weight:600;color:#2374ff;text-decoration:none;touch-action:manipulation;">REMOVE ADS</a>';
  modalHTML += '</div>';
  modalHTML += '</div>'; // Close -next-btn-modal-ad-container
  modalHTML += '</div>'; // Close -next-btn-modal-body

  modal.innerHTML = modalHTML;

  // Show modal
  modal.style.display = 'block';
  var overlay = document.getElementById('nextButtonModalOverlay');
  if (overlay) {
    overlay.style.display = 'block';
  }
  // Initialize ad after modal is created and shown
  NextButtonModal._initializeModalAd();

  // Setup continue button (no countdown, instant activation) - mobile friendly
  var continueBtn = document.getElementById('modalContinueBtn');
  if (continueBtn) {
    continueBtn.disabled = false;
    continueBtn.style.opacity = '1';
    // Only update text if not closed (closed case already has "Go Next" text)
    if (!isClosed && !userIsOnboarding) {
      continueBtn.innerHTML = 'Go Next >';
    }

    // Add click handler for instant navigation
    continueBtn.onclick = function () {
      NextButtonModal._closeModal();
    };
  }
};
NextButtonModal._uiTemplates = {};
NextButtonModal._uiFetchTemplate = function (fetchUrl, _callback) {
  if (typeof NextButtonModal._uiTemplates[fetchUrl] !== 'undefined') {
    return NextButtonModal._uiTemplates[fetchUrl];
  }
  Util.fetch({
    context: 'NextButtonModal',
    method: 'GET',
    url: fetchUrl,
    sendCookies: false,
    withUserSession: false,
    prepareResponseData: false,
    callback: function callback(fetchRes) {
      NextButtonModal._logDebug('_uiFetchTemplate -> fetchUrl, fetchRes: ', {
        fetchUrl: fetchUrl,
        fetchRes: fetchRes
      });
      var output = {
        error: {
          code: '1',
          description: 'Failed performing "NextButtonModal._uiFetchTemplate"'
        },
        data: null
      };
      if (fetchRes.error.code === '0') {
        output.data = fetchRes.dataStr;
        output.error = {
          code: '0'
        };
      } else {
        output.error = fetchRes.error;
      }
      NextButtonModal._uiTemplates[fetchUrl] = output;
      if (typeof _callback !== 'undefined') {
        _callback(output);
      }
    }
  });
};
NextButtonModal._uiPrepareTemplateHtml = function (template, params) {
  var output = template;
  NextButtonModal._logDebug('_uiPrepareTemplateHtml -> input template: ', template);
  NextButtonModal._logDebug('_uiPrepareTemplateHtml -> params: ', params);
  Object.keys(params).forEach(function (key) {
    // Try multiple placeholder formats to be more flexible
    var placeholders = ['{{ ' + key + ' }}',
    // with spaces
    '{{' + key + '}}',
    // without spaces
    '{{ ' + key + '}}',
    // space before only
    '{{' + key + ' }}' // space after only
    ];
    NextButtonModal._logDebug('_uiPrepareTemplateHtml -> processing key: ' + key + ' with value: ' + params[key]);
    placeholders.forEach(function (placeholder) {
      var regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      var beforeReplace = output;
      output = output.replace(regex, params[key]);
      if (beforeReplace !== output) {
        NextButtonModal._logDebug('_uiPrepareTemplateHtml -> replaced placeholder: ' + placeholder + ' with: ' + params[key]);
      }
    });
  });
  NextButtonModal._logDebug('_uiPrepareTemplateHtml -> final output: ', output);
  return output;
};
NextButtonModal._initializeModalAd = function () {
  // Check if ad container exists
  var adContainer = document.getElementById('adngin-modal_banner-0');
  if (!adContainer) {
    NextButtonModal._logError('_initializeModalAd -> ad container not found');
    return;
  }

  // Get tutorial info for template parameters first to determine ad range
  var tutorialInfo = NextButtonModal._getTutorialInfo();
  var tutorialName = 'by practising'; // default fallback

  // Try to get a clean, human-readable name from the topicMap
  var topicId = null;

  // Get topicId from subjectFolder if available
  if (typeof subjectFolder !== 'undefined' && subjectFolder) {
    var cleanSubject = subjectFolder.replace(/\//g, '').toLowerCase();
    if (cleanSubject.indexOf('_') > -1) {
      cleanSubject = cleanSubject.split('_')[0];
    }
    topicId = cleanSubject;
  }

  // Extended topicMap with campus URLs and icon paths
  var topicMap = {
    accessibility: {
      name: 'Accessibility',
      campusUrl: 'https://campus.w3schools.com/products/accessibility-course',
      iconPath: '/lib/my-learning/html/ads/icons/accessibility.png'
    },
    angular: {
      name: 'Angular',
      campusUrl: 'https://campus.w3schools.com/products/angularjs-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/angular.png'
    },
    asp: {
      name: 'ASP',
      campusUrl: 'https://campus.w3schools.com/products/asp-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/asp.png'
    },
    bash: {
      name: 'Bash',
      campusUrl: 'https://campus.w3schools.com/products/bash-certification-exam',
      iconPath: '/lib/my-learning/html/ads/icons/bash.png'
    },
    bootstrap: {
      name: 'Bootstrap 3',
      campusUrl: 'https://campus.w3schools.com/products/bootstrap-course',
      iconPath: '/lib/my-learning/html/ads/icons/bootstrap.png'
    },
    bootstrap4: {
      name: 'Bootstrap 4',
      campusUrl: 'https://campus.w3schools.com/products/bootstrap-4-course',
      iconPath: '/lib/my-learning/html/ads/icons/bootstrap.png'
    },
    bootstrap5: {
      name: 'Bootstrap 5',
      campusUrl: 'https://campus.w3schools.com/products/learn-bootstrap-5',
      iconPath: '/lib/my-learning/html/ads/icons/bootstrap.png'
    },
    c: {
      name: 'C',
      campusUrl: 'https://campus.w3schools.com/products/learn-c',
      iconPath: '/lib/my-learning/html/ads/icons/c.png'
    },
    cpp: {
      name: 'C++',
      campusUrl: 'https://campus.w3schools.com/products/c-course',
      iconPath: '/lib/my-learning/html/ads/icons/cpp.png'
    },
    cs: {
      name: 'C#',
      campusUrl: 'https://campus.w3schools.com/products/c-course',
      iconPath: '/lib/my-learning/html/ads/icons/csharp.png'
    },
    css: {
      name: 'CSS',
      campusUrl: 'https://campus.w3schools.com/products/css-course',
      iconPath: '/lib/my-learning/html/ads/icons/css.png'
    },
    cybersecurity: {
      name: 'Cybersecurity',
      campusUrl: 'https://campus.w3schools.com/products/cyber-security-course',
      iconPath: '/lib/my-learning/html/ads/icons/cybersecurity.png'
    },
    datascience: {
      name: 'Data Science',
      campusUrl: 'https://campus.w3schools.com/products/data-science-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/datascience.png'
    },
    django: {
      name: 'Django',
      campusUrl: 'https://campus.w3schools.com/products/learn-django',
      iconPath: '/lib/my-learning/html/ads/icons/django.png'
    },
    dsa: {
      name: 'DSA',
      campusUrl: 'https://campus.w3schools.com/products/dsa-certification-exam',
      iconPath: '/lib/my-learning/html/ads/icons/dsa.png'
    },
    excel: {
      name: 'Excel',
      campusUrl: 'https://campus.w3schools.com/products/learn-excel',
      iconPath: '/lib/my-learning/html/ads/icons/excel.png'
    },
    git: {
      name: 'Git',
      campusUrl: 'https://campus.w3schools.com/products/learn-git',
      iconPath: '/lib/my-learning/html/ads/icons/git.png'
    },
    go: {
      name: 'Go',
      campusUrl: 'https://campus.w3schools.com/products/go-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/go.png'
    },
    html: {
      name: 'HTML',
      campusUrl: 'https://campus.w3schools.com/products/html-course',
      iconPath: '/lib/my-learning/html/ads/icons/html.png'
    },
    htmlcss: {
      name: 'HTML & CSS',
      campusUrl: 'https://order.w3schools.com/',
      iconPath: '/lib/my-learning/html/ads/icons/htmlcss.png'
    },
    java: {
      name: 'Java',
      campusUrl: 'https://campus.w3schools.com/products/java-course',
      iconPath: '/lib/my-learning/html/ads/icons/java.png'
    },
    jquery: {
      name: 'jQuery',
      campusUrl: 'https://campus.w3schools.com/products/jquery-course',
      iconPath: '/lib/my-learning/html/ads/icons/jquery.png'
    },
    js: {
      name: 'JavaScript',
      campusUrl: 'https://campus.w3schools.com/products/javascript-course',
      iconPath: '/lib/my-learning/html/ads/icons/javascript.png'
    },
    kotlin: {
      name: 'Kotlin',
      campusUrl: 'https://campus.w3schools.com/products/learn-kotlin',
      iconPath: '/lib/my-learning/html/ads/icons/kotlin.png'
    },
    mongodb: {
      name: 'MongoDB',
      campusUrl: 'https://campus.w3schools.com/products/learn-mongodb',
      iconPath: '/lib/my-learning/html/ads/icons/mongodb.png'
    },
    mysql: {
      name: 'MySQL',
      campusUrl: 'https://campus.w3schools.com/products/learn-mysql-1',
      iconPath: '/lib/my-learning/html/ads/icons/mysql.png'
    },
    nodejs: {
      name: 'Node.js',
      campusUrl: 'https://campus.w3schools.com/products/learn-node-js',
      iconPath: '/lib/my-learning/html/ads/icons/nodejs.png'
    },
    numpy: {
      name: 'NumPy',
      campusUrl: 'https://campus.w3schools.com/products/numpy-course',
      iconPath: '/lib/my-learning/html/ads/icons/numpy.png'
    },
    pandas: {
      name: 'Pandas',
      campusUrl: 'https://campus.w3schools.com/products/pandas-course',
      iconPath: '/lib/my-learning/html/ads/icons/pandas.png'
    },
    php: {
      name: 'PHP',
      campusUrl: 'https://campus.w3schools.com/products/php-course',
      iconPath: '/lib/my-learning/html/ads/icons/php.png'
    },
    postgresql: {
      name: 'PostgreSQL',
      campusUrl: 'https://campus.w3schools.com/products/learn-postgresql',
      iconPath: '/lib/my-learning/html/ads/icons/postgres.png'
    },
    python: {
      name: 'Python',
      campusUrl: 'https://campus.w3schools.com/products/python-course',
      iconPath: '/lib/my-learning/html/ads/icons/python.png'
    },
    r: {
      name: 'R',
      campusUrl: 'https://campus.w3schools.com/products/r-course',
      iconPath: '/lib/my-learning/html/ads/icons/r.png'
    },
    react: {
      name: 'React',
      campusUrl: 'https://campus.w3schools.com/products/react-js-course',
      iconPath: '/lib/my-learning/html/ads/icons/react.png'
    },
    sass: {
      name: 'Sass',
      campusUrl: 'https://campus.w3schools.com/products/sass-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/sass.png'
    },
    scipy: {
      name: 'SciPy',
      campusUrl: 'https://campus.w3schools.com/products/learn-scipy',
      iconPath: '/lib/my-learning/html/ads/icons/scipy.png'
    },
    sql: {
      name: 'SQL',
      campusUrl: 'https://campus.w3schools.com/products/sql-course',
      iconPath: '/lib/my-learning/html/ads/icons/sql.png'
    },
    statistics: {
      name: 'Statistics',
      campusUrl: 'https://campus.w3schools.com/products/statistics-certificate',
      iconPath: '/lib/my-learning/html/ads/icons/statistics.png'
    },
    swift: {
      name: 'Swift',
      campusUrl: 'https://order.w3schools.com/',
      iconPath: '/lib/my-learning/html/ads/icons/swift.png'
    },
    typescript: {
      name: 'TypeScript',
      campusUrl: 'https://campus.w3schools.com/products/learn-typescript',
      iconPath: '/lib/my-learning/html/ads/icons/typescript.png'
    },
    vue: {
      name: 'Vue',
      campusUrl: 'https://campus.w3schools.com/products/learn-vue-js',
      iconPath: '/lib/my-learning/html/ads/icons/vue.png'
    },
    w3css: {
      name: 'W3.CSS',
      campusUrl: 'https://order.w3schools.com/',
      iconPath: '/lib/my-learning/html/ads/icons/w3css.png'
    },
    xml: {
      name: 'XML',
      campusUrl: 'https://campus.w3schools.com/products/xml-course',
      iconPath: '/lib/my-learning/html/ads/icons/xml.png'
    }
  };
  var tutorialData = {
    name: 'by practising',
    campusUrl: 'https://order.w3schools.com/',
    iconPath: '/lib/my-learning/html/ads/w3schools.svg'
  };
  if (topicId && topicMap[topicId]) {
    tutorialData = topicMap[topicId];
  }

  // Generate random ad number based on whether we have a campusUrl
  var randomAdNumber;
  if (tutorialData.campusUrl === 'https://order.w3schools.com/') {
    // No specific campusUrl (fallback) - use ads 1-4
    randomAdNumber = Math.floor(Math.random() * 4) + 1;
  } else {
    // We have a specific campusUrl - use ads 1-8
    randomAdNumber = Math.floor(Math.random() * 8) + 1;
  }
  var templateUrl = '/lib/my-learning/html/ads/ad' + randomAdNumber + '.tmpl.html';

  // Load and inject the random ad template
  NextButtonModal._uiFetchTemplate(templateUrl, function (templateFetchRes) {
    if (templateFetchRes.error.code === '0') {
      var templateParams = {
        tutorialName: tutorialData.name,
        campusUrl: tutorialData.campusUrl,
        iconPath: tutorialData.iconPath
      };
      var preparedHtml = NextButtonModal._uiPrepareTemplateHtml(templateFetchRes.data, templateParams);

      // Inject the template into the ad container
      adContainer.innerHTML = preparedHtml;

      // Post-injection: toggle tech icon and divider visibility
      // Note: <script> tags inside injected HTML won't execute via innerHTML
      try {
        var fallbackIcon = '/lib/my-learning/html/ads/w3schools.svg';
        var hasTechIcon = tutorialData.iconPath && tutorialData.iconPath !== fallbackIcon;
        if (hasTechIcon) {
          var techIconElm = adContainer.querySelector('#tech-icon');
          if (techIconElm) {
            techIconElm.style.display = 'block';
          }
          var dividerElm = adContainer.querySelector('#divider');
          if (dividerElm) {
            dividerElm.style.display = 'block';
          }
        }
      } catch (exc) {
        // swallow
      }
    } else {
      // Fallback: show a simple placeholder
      adContainer.innerHTML = '<div style="width:336px;height:280px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;font-family:Arial,sans-serif;">Ad placeholder</div>';
    }
  });
};
NextButtonModal._onClose = function () {
  if (NextButtonModal._elm) {
    NextButtonModal._elm.style.display = 'none';
    setTimeout(function () {
      if (NextButtonModal._elm) {
        NextButtonModal._elm.remove();
        NextButtonModal._elm = null;
      }
    }, 300);
    NextButtonModal._rendered = false;
  }
};
NextButtonModal._onContinue = function () {
  if (NextButtonModal._originalNextUrl) {
    window.location.href = NextButtonModal._originalNextUrl;
  }
  NextButtonModal._onClose();
};
NextButtonModal._onDashboard = function () {
  window.open('https://pathfinder.w3schools.com', '_blank');
  NextButtonModal._onClose();
};
NextButtonModal._interceptNextButtons = function () {
  MyLearning._logDebug('NextButtonModal._interceptNextButtons -> called');
  // Prevent multiple initializations
  if (NextButtonModal._initialized) {
    return;
  }

  // Find all nextprev containers (usually 2: top and bottom)
  var nextPrevContainers = document.querySelectorAll('.nextprev');

  // if no nextPrevContainers, return
  if (nextPrevContainers.length === 0) {
    return;
  }
  MyLearning._logDebug('NextButtonModal._interceptNextButtons -> nextPrevContainers: ', nextPrevContainers);
  var interceptedCount = 0;

  // Always target ONLY the bottom next button (last .nextprev container)
  var targetContainer = nextPrevContainers[nextPrevContainers.length - 1];
  if (targetContainer) {
    var nextButton = targetContainer.querySelector('a.w3-right.w3-btn');
    if (nextButton && nextButton.innerHTML.indexOf('Next') > -1) {
      // Check if already intercepted
      if (nextButton.getAttribute('data-intercepted') !== 'true') {
        // Store original href
        var originalHref = nextButton.getAttribute('href');

        // Mark as intercepted
        nextButton.setAttribute('data-intercepted', 'true');

        // Add click interceptor in capture phase
        nextButton.addEventListener('click', function (e) {
          if (NextButtonModal._shouldShowModal()) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            NextButtonModal._show(originalHref);
            return false;
          } else {}
        }, true); // Use capture phase

        interceptedCount++;
      }
    }
  }

  // Additionally, hook the TOP next button, but only show modal if completed this run
  var topContainer = nextPrevContainers[0];
  if (topContainer && topContainer !== targetContainer) {
    var topNextButton = topContainer.querySelector('a.w3-right.w3-btn');
    if (topNextButton && topNextButton.innerHTML.indexOf('Next') > -1) {
      if (topNextButton.getAttribute('data-intercepted') !== 'true') {
        var topOriginalHref = topNextButton.getAttribute('href');
        topNextButton.setAttribute('data-intercepted', 'true');
        topNextButton.addEventListener('click', function (e) {
          if (NextButtonModal._shouldShowModal() && NextButtonModal._wasCompletedThisRun()) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            NextButtonModal._show(topOriginalHref);
            return false;
          }
        }, true);
        interceptedCount++;
      }
    }
  }
  if (interceptedCount > 0) {
    NextButtonModal._initialized = true;
  }
};

// // Initialize next button interceptor after page loads
// NextButtonModal.init = function () {
//   // Multiple initialization strategies to ensure we catch the buttons
//   var interceptButtons = function () {
//     NextButtonModal._interceptNextButtons();
//   };

//   // Strategy 1: DOMContentLoaded
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', interceptButtons);
//   }

//   // Strategy 2: Window load event
//   window.addEventListener('load', function () {
//     setTimeout(interceptButtons, 50);
//   });

//   // Strategy 3: When MyLearning is initialized (fast)
//   if (typeof MyLearning.lessonFinishedListeners !== 'undefined') {
//     setTimeout(interceptButtons, 100);
//   }

//   // Strategy 4: Fallback with longer delay
//   setTimeout(interceptButtons, 500);
// };
