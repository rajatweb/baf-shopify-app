// Debug script to test marquee functionality
console.log('🐛 Debugging marquee functionality...');

// Wait for page to load
setTimeout(() => {
  console.log('🔍 Checking marquee elements...');
  
  // Check if elements exist
  const miniTitle = document.querySelector('.mini-track-title');
  const modalTitle = document.querySelector('.track-title');
  
  console.log('📋 Elements found:');
  console.log('  - Mini title:', !!miniTitle);
  console.log('  - Modal title:', !!modalTitle);
  
  if (miniTitle) {
    console.log('📏 Mini title dimensions:');
    console.log('  - offsetWidth:', miniTitle.offsetWidth);
    console.log('  - clientWidth:', miniTitle.clientWidth);
    console.log('  - scrollWidth:', miniTitle.scrollWidth);
    console.log('  - Classes:', miniTitle.className);
    console.log('  - Content:', miniTitle.textContent);
    
    // Check computed styles
    const computedStyle = window.getComputedStyle(miniTitle);
    console.log('🎨 Mini title computed styles:');
    console.log('  - Width:', computedStyle.width);
    console.log('  - Max-width:', computedStyle.maxWidth);
    console.log('  - Overflow:', computedStyle.overflow);
    console.log('  - White-space:', computedStyle.whiteSpace);
  }
  
  if (modalTitle) {
    console.log('📏 Modal title dimensions:');
    console.log('  - offsetWidth:', modalTitle.offsetWidth);
    console.log('  - clientWidth:', modalTitle.clientWidth);
    console.log('  - scrollWidth:', modalTitle.scrollWidth);
    console.log('  - Classes:', modalTitle.className);
    console.log('  - Content:', modalTitle.textContent);
    
    // Check computed styles
    const computedStyle = window.getComputedStyle(modalTitle);
    console.log('🎨 Modal title computed styles:');
    console.log('  - Width:', computedStyle.width);
    console.log('  - Max-width:', computedStyle.maxWidth);
    console.log('  - Overflow:', computedStyle.overflow);
    console.log('  - White-space:', computedStyle.whiteSpace);
  }
  
  // Check for existing marquee containers
  const marqueeContainers = document.querySelectorAll('.marquee-container');
  const marqueeContents = document.querySelectorAll('.marquee-content');
  const scrollingElements = document.querySelectorAll('.scrolling');
  
  console.log('🔍 Existing marquee elements:');
  console.log('  - Containers:', marqueeContainers.length);
  console.log('  - Contents:', marqueeContents.length);
  console.log('  - Scrolling:', scrollingElements.length);
  
  // Check CSS animations
  console.log('🎬 CSS Animation check:');
  const rootStyles = getComputedStyle(document.documentElement);
  const scrollSpeed = rootStyles.getPropertyValue('--moving-scroll-speed');
  console.log('  - --moving-scroll-speed:', scrollSpeed);
  
  // Test creating a simple marquee manually
  console.log('🧪 Testing manual marquee creation...');
  
  if (miniTitle) {
    // Clear and create a test marquee
    miniTitle.innerHTML = '';
    
    const testContainer = document.createElement('div');
    testContainer.className = 'marquee-container';
    testContainer.style.cssText = 'position: relative; width: 100%; height: 100%; overflow: hidden;';
    
    const testContent = document.createElement('div');
    testContent.className = 'marquee-content';
    testContent.style.cssText = 'display: inline-block; white-space: nowrap; will-change: transform; transform: translateZ(0px);';
    
    const text1 = document.createElement('span');
    text1.textContent = 'TEST MARQUEE TEXT - THIS IS A LONG TITLE TO TEST SCROLLING';
    text1.style.cssText = 'display: inline-block;';
    
    const gap = document.createElement('span');
    gap.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    gap.style.cssText = 'display: inline-block;';
    
    const text2 = document.createElement('span');
    text2.textContent = 'TEST MARQUEE TEXT - THIS IS A LONG TITLE TO TEST SCROLLING';
    text2.style.cssText = 'display: inline-block;';
    
    testContent.appendChild(text1);
    testContent.appendChild(gap);
    testContent.appendChild(text2);
    testContainer.appendChild(testContent);
    miniTitle.appendChild(testContainer);
    
    console.log('✅ Test marquee created');
    
    // Add scrolling class after a delay
    setTimeout(() => {
      testContent.classList.add('scrolling');
      console.log('🎬 Scrolling class added to test marquee');
      
      // Check if animation is active
      const computedStyle = window.getComputedStyle(testContent);
      console.log('🎬 Test marquee animation:');
      console.log('  - Animation:', computedStyle.animation);
      console.log('  - Animation-duration:', computedStyle.animationDuration);
      console.log('  - Transform:', computedStyle.transform);
    }, 500);
  }
  
  // Check for any CSS errors
  console.log('🔍 Checking for CSS issues...');
  
  // Test if keyframes are loaded
  const styleSheets = Array.from(document.styleSheets);
  let marqueeKeyframesFound = false;
  
  styleSheets.forEach((sheet, index) => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      rules.forEach(rule => {
        if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'marquee') {
          marqueeKeyframesFound = true;
          console.log(`✅ Marquee keyframes found in stylesheet ${index}`);
        }
      });
    } catch (e) {
      console.log(`⚠️ Could not access stylesheet ${index}:`, e.message);
    }
  });
  
  if (!marqueeKeyframesFound) {
    console.log('❌ Marquee keyframes not found in any stylesheet');
  }
  
}, 2000);
