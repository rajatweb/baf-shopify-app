// Test script to verify CSS-based marquee functionality
console.log('🎯 Testing CSS-based marquee functionality...');

// Wait for the page to load
setTimeout(() => {
  // Check if the modal exists
  const modal = document.querySelector('.audio-player-modal');
  if (!modal) {
    console.error('❌ Modal not found');
    return;
  }
  
  console.log('✅ Modal found');
  
  // Check current screen size
  const isMobile = window.innerWidth <= 767;
  console.log('📱 Screen size:', isMobile ? 'Mobile (≤767px)' : 'Desktop (>767px)');
  
  // Check all marquee elements
  const miniTrackTitle = document.querySelector('.mini-track-title');
  const modalTrackTitle = document.querySelector('.track-title');
  const playlistTitles = document.querySelectorAll('.playlist-track-title');
  
  console.log('📋 Marquee Elements Found:');
  console.log('  - Mini track title:', !!miniTrackTitle);
  console.log('  - Modal track title:', !!modalTrackTitle);
  console.log('  - Playlist titles:', playlistTitles.length);
  
  // Check marquee states and structure
  console.log('🔍 Marquee Structure Check:');
  
  if (miniTrackTitle) {
    const miniClasses = miniTrackTitle.className;
    const miniMarqueeContainer = miniTrackTitle.querySelector('.marquee-container');
    const miniMarqueeContent = miniTrackTitle.querySelector('.marquee-content');
    const miniScrolling = miniTrackTitle.querySelector('.scrolling');
    
    console.log('  - Mini track title:');
    console.log(`    - Classes: ${miniClasses}`);
    console.log(`    - Has marquee-active class: ${miniClasses.includes('marquee-active')}`);
    console.log(`    - Has marquee-container: ${!!miniMarqueeContainer}`);
    console.log(`    - Has marquee-content: ${!!miniMarqueeContent}`);
    console.log(`    - Has scrolling class: ${!!miniScrolling}`);
    
    if (miniMarqueeContent) {
      const textSpan = miniMarqueeContent.querySelector('span');
      const gapSpan = miniMarqueeContent.querySelectorAll('span')[1];
      
      console.log(`    - Text content: ${textSpan ? textSpan.textContent : 'N/A'}`);
      console.log(`    - Gap span exists: ${!!gapSpan}`);
      console.log(`    - Gap content: ${gapSpan ? gapSpan.innerHTML : 'N/A'}`);
    }
  }
  
  if (modalTrackTitle) {
    const modalClasses = modalTrackTitle.className;
    const modalMarqueeContainer = modalTrackTitle.querySelector('.marquee-container');
    const modalMarqueeContent = modalTrackTitle.querySelector('.marquee-content');
    const modalScrolling = modalTrackTitle.querySelector('.scrolling');
    
    console.log('  - Modal track title:');
    console.log(`    - Classes: ${modalClasses}`);
    console.log(`    - Has marquee-active class: ${modalClasses.includes('marquee-active')}`);
    console.log(`    - Has marquee-container: ${!!modalMarqueeContainer}`);
    console.log(`    - Has marquee-content: ${!!modalMarqueeContent}`);
    console.log(`    - Has scrolling class: ${!!modalScrolling}`);
    
    if (modalMarqueeContent) {
      const textSpan = modalMarqueeContent.querySelector('span');
      const gapSpan = modalMarqueeContent.querySelectorAll('span')[1];
      
      console.log(`    - Text content: ${textSpan ? textSpan.textContent : 'N/A'}`);
      console.log(`    - Gap span exists: ${!!gapSpan}`);
      console.log(`    - Gap content: ${gapSpan ? gapSpan.innerHTML : 'N/A'}`);
    }
  }
  
  playlistTitles.forEach((title, index) => {
    const titleClasses = title.className;
    const titleMarqueeContainer = title.querySelector('.marquee-container');
    const titleMarqueeContent = title.querySelector('.marquee-content');
    const titleScrolling = title.querySelector('.scrolling');
    
    console.log(`  - Playlist title ${index + 1}:`);
    console.log(`    - Classes: ${titleClasses}`);
    console.log(`    - Has marquee-active class: ${titleClasses.includes('marquee-active')}`);
    console.log(`    - Has marquee-container: ${!!titleMarqueeContainer}`);
    console.log(`    - Has marquee-content: ${!!titleMarqueeContent}`);
    console.log(`    - Has scrolling class: ${!!titleScrolling}`);
    
    if (titleMarqueeContent) {
      const textSpan = titleMarqueeContent.querySelector('span');
      const gapSpan = titleMarqueeContent.querySelectorAll('span')[1];
      
      console.log(`    - Text content: ${textSpan ? textSpan.textContent : 'N/A'}`);
      console.log(`    - Gap span exists: ${!!gapSpan}`);
      console.log(`    - Gap content: ${gapSpan ? gapSpan.innerHTML : 'N/A'}`);
    }
  });
  
  // Check for active marquee elements
  const activeMarquees = document.querySelectorAll('.marquee-active');
  console.log('🔍 Active Marquee Elements:');
  console.log('  - Number of active marquees:', activeMarquees.length);
  
  activeMarquees.forEach((marquee, index) => {
    const hasContainer = marquee.querySelector('.marquee-container');
    const hasContent = marquee.querySelector('.marquee-content');
    const hasScrolling = marquee.querySelector('.scrolling');
    const textContent = marquee.textContent;
    
    console.log(`  - Marquee ${index + 1}:`);
    console.log(`    - Has container: ${hasContainer}`);
    console.log(`    - Has content: ${hasContent}`);
    console.log(`    - Has scrolling: ${hasScrolling}`);
    console.log(`    - Text content: ${textContent}`);
    
    // Check CSS animation
    if (hasScrolling) {
      const computedStyle = window.getComputedStyle(hasScrolling);
      const animation = computedStyle.animation;
      const animationDuration = computedStyle.animationDuration;
      const animationDelay = computedStyle.animationDelay;
      
      console.log(`    - CSS Animation:`);
      console.log(`      - Animation: ${animation}`);
      console.log(`      - Duration: ${animationDuration}`);
      console.log(`      - Delay: ${animationDelay}`);
    }
  });
  
  // Check CSS styles for marquee elements
  console.log('🎨 CSS Styles Check:');
  
  activeMarquees.forEach((marquee, index) => {
    const computedStyle = window.getComputedStyle(marquee);
    const overflow = computedStyle.overflow;
    const whiteSpace = computedStyle.whiteSpace;
    
    console.log(`  - Marquee ${index + 1} CSS:`);
    console.log(`    - Overflow: ${overflow}`);
    console.log(`    - White-space: ${whiteSpace}`);
    
    // Check child container styles
    const container = marquee.querySelector('.marquee-container');
    if (container) {
      const containerStyle = window.getComputedStyle(container);
      const containerOverflow = containerStyle.overflow;
      const containerWidth = containerStyle.width;
      
      console.log(`    - Container CSS:`);
      console.log(`      - Overflow: ${containerOverflow}`);
      console.log(`      - Width: ${containerWidth}`);
    }
    
    // Check content styles
    const content = marquee.querySelector('.marquee-content');
    if (content) {
      const contentStyle = window.getComputedStyle(content);
      const contentDisplay = contentStyle.display;
      const contentWhiteSpace = contentStyle.whiteSpace;
      const contentTransform = contentStyle.transform;
      
      console.log(`    - Content CSS:`);
      console.log(`      - Display: ${contentDisplay}`);
      console.log(`      - White-space: ${contentWhiteSpace}`);
      console.log(`      - Transform: ${contentTransform}`);
    }
  });
  
  // Test marquee functionality
  console.log('🧪 Marquee Functionality Test:');
  
  let marqueeWorking = 0;
  let marqueeWithGap = 0;
  let marqueeWithAnimation = 0;
  
  activeMarquees.forEach((marquee, index) => {
    if (marquee.querySelector('.marquee-container') && marquee.querySelector('.marquee-content')) {
      console.log(`  ✅ Marquee ${index + 1} structure is correct`);
      marqueeWorking++;
      
      // Check gap
      const content = marquee.querySelector('.marquee-content');
      const spans = content.querySelectorAll('span');
      if (spans.length >= 2) {
        console.log(`    ✅ Gap is properly implemented`);
        marqueeWithGap++;
      } else {
        console.log(`    ❌ Gap is missing`);
      }
      
      // Check animation
      if (content.classList.contains('scrolling')) {
        console.log(`    ✅ CSS animation is active`);
        marqueeWithAnimation++;
      } else {
        console.log(`    ⚠️ CSS animation not yet active`);
      }
    } else {
      console.log(`  ❌ Marquee ${index + 1} structure is incomplete`);
    }
  });
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Modal: ✅ Found');
  console.log('  - Active marquees:', activeMarquees.length);
  console.log('  - Working marquees:', marqueeWorking);
  console.log('  - Marquees with gap:', marqueeWithGap);
  console.log('  - Marquees with animation:', marqueeWithAnimation);
  console.log('  - Screen size:', isMobile ? 'Mobile' : 'Desktop');
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Verify that marquees have the correct HTML structure');
  console.log('2. Check that the gap between text is visible');
  console.log('3. Ensure CSS animations are running smoothly');
  console.log('4. Test with long track titles to trigger marquee');
  console.log('5. Verify marquee works on both desktop and mobile');
  
  if (marqueeWorking > 0 && marqueeWithGap > 0) {
    console.log('🎉 SUCCESS: CSS marquee is working correctly!');
  } else {
    console.log('🔧 RECOMMENDATION: Some improvements needed - check the implementation');
  }
  
  // Show current CSS variables
  const rootStyles = getComputedStyle(document.documentElement);
  const scrollSpeed = rootStyles.getPropertyValue('--moving-scroll-speed');
  console.log('\n🎨 CSS Variables:');
  console.log(`  - --moving-scroll-speed: ${scrollSpeed}`);
  
}, 3000);
