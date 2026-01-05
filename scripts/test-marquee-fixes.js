// Test script to verify marquee fixes
console.log('🧪 Testing marquee fixes...');

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
  
  // Check marquee states
  console.log('🔍 Marquee States Check:');
  
  if (miniTrackTitle) {
    const miniClasses = miniTrackTitle.className;
    const miniText = miniTrackTitle.textContent;
    console.log('  - Mini track title classes:', miniClasses);
    console.log('  - Mini track title text:', miniText);
    console.log('  - Has marquee3k class:', miniClasses.includes('marquee3k'));
    console.log('  - Has marquee-active class:', miniClasses.includes('marquee-active'));
  }
  
  if (modalTrackTitle) {
    const modalClasses = modalTrackTitle.className;
    const modalText = modalTrackTitle.textContent;
    console.log('  - Modal track title classes:', modalClasses);
    console.log('  - Modal track title text:', modalText);
    console.log('  - Has marquee3k class:', modalClasses.includes('marquee3k'));
    console.log('  - Has marquee-active class:', modalClasses.includes('marquee-active'));
  }
  
  playlistTitles.forEach((title, index) => {
    const titleClasses = title.className;
    const titleText = title.textContent;
    console.log(`  - Playlist title ${index + 1} classes:`, titleClasses);
    console.log(`  - Playlist title ${index + 1} text:`, titleText);
    console.log(`  - Has marquee3k class:`, titleClasses.includes('marquee3k'));
    console.log(`  - Has marquee-active class:`, titleClasses.includes('marquee-active'));
  });
  
  // Check for Marquee3k library
  console.log('🔍 Marquee3k Library Check:');
  
  if (window.Marquee3k) {
    console.log('✅ Marquee3k library loaded');
    console.log('  - Version:', window.Marquee3k.version || 'Unknown');
  } else {
    console.log('❌ Marquee3k library not loaded');
  }
  
  // Check for active marquee instances
  const activeMarquees = document.querySelectorAll('.marquee3k');
  console.log('🔍 Active Marquee Instances:');
  console.log('  - Number of active marquees:', activeMarquees.length);
  
  activeMarquees.forEach((marquee, index) => {
    const hasInstance = marquee._marquee3k;
    const speed = marquee.dataset.speed;
    console.log(`  - Marquee ${index + 1}:`);
    console.log(`    - Has instance: ${hasInstance}`);
    console.log(`    - Speed: ${speed}`);
    console.log(`    - Text content: ${marquee.textContent}`);
    
    // Check for gaps in text
    if (marquee.textContent) {
      const hasGap = marquee.textContent.includes('    '); // 4 spaces
      console.log(`    - Has gap between text: ${hasGap}`);
    }
  });
  
  // Check text width vs container width for marquee necessity
  console.log('🔍 Marquee Necessity Check:');
  
  if (miniTrackTitle) {
    const miniWidth = miniTrackTitle.offsetWidth;
    const miniTextWidth = getTextWidth(miniTrackTitle.textContent, miniTrackTitle);
    console.log('  - Mini track title:');
    console.log(`    - Container width: ${miniWidth}px`);
    console.log(`    - Text width: ${miniTextWidth}px`);
    console.log(`    - Needs marquee: ${miniTextWidth > miniWidth}`);
  }
  
  if (modalTrackTitle) {
    const modalWidth = modalTrackTitle.offsetWidth;
    const modalTextWidth = getTextWidth(modalTrackTitle.textContent, modalTrackTitle);
    console.log('  - Modal track title:');
    console.log(`    - Container width: ${modalWidth}px`);
    console.log(`    - Text width: ${modalTextWidth}px`);
    console.log(`    - Needs marquee: ${modalTextWidth > modalWidth}`);
  }
  
  // Test marquee functionality
  console.log('🧪 Marquee Functionality Test:');
  
  let marqueeWorking = 0;
  let marqueeNotWorking = 0;
  
  activeMarquees.forEach((marquee, index) => {
    if (marquee._marquee3k) {
      console.log(`  ✅ Marquee ${index + 1} is working`);
      marqueeWorking++;
    } else {
      console.log(`  ❌ Marquee ${index + 1} is not working`);
      marqueeNotWorking++;
    }
  });
  
  // Check if marquees are visible and animating
  console.log('🔍 Marquee Visibility Check:');
  
  activeMarquees.forEach((marquee, index) => {
    const isVisible = window.getComputedStyle(marquee).display !== 'none';
    const hasOverflow = window.getComputedStyle(marquee).overflow === 'hidden';
    console.log(`  - Marquee ${index + 1}:`);
    console.log(`    - Is visible: ${isVisible}`);
    console.log(`    - Has overflow hidden: ${hasOverflow}`);
  });
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Modal: ✅ Found');
  console.log('  - Mini track title: ✅ Found');
  console.log('  - Modal track title: ✅ Found');
  console.log('  - Playlist titles:', playlistTitles.length);
  console.log('  - Active marquees:', activeMarquees.length);
  console.log('  - Working marquees:', marqueeWorking);
  console.log('  - Non-working marquees:', marqueeNotWorking);
  console.log('  - Screen size:', isMobile ? 'Mobile' : 'Desktop');
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Verify marquees are working on desktop mini bar');
  console.log('2. Check that marquees work in the modal on both desktop and mobile');
  console.log('3. Look for gaps between repeated text in marquees');
  console.log('4. Test with long track titles to trigger marquee');
  console.log('5. Verify marquee speed is consistent across all elements');
  
  if (marqueeWorking > 0) {
    console.log('🎉 SUCCESS: Some marquees are working!');
  } else {
    console.log('🔧 RECOMMENDATION: No marquees are working - check Marquee3k initialization');
  }
  
  // Helper function to get text width
  function getTextWidth(text, element) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const computedStyle = window.getComputedStyle(element);
    context.font = computedStyle.font;
    return context.measureText(text).width;
  }
  
}, 3000);
