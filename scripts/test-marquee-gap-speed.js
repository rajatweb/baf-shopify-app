// Test script to verify marquee gap and speed improvements
console.log('🧪 Testing marquee gap and speed improvements...');

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
  
  // Check marquee states and gap implementation
  console.log('🔍 Marquee Gap and Speed Check:');
  
  if (miniTrackTitle) {
    const miniClasses = miniTrackTitle.className;
    const miniText = miniTrackTitle.textContent;
    const miniSpeed = miniTrackTitle.dataset.speed;
    console.log('  - Mini track title:');
    console.log(`    - Classes: ${miniClasses}`);
    console.log(`    - Text content: ${miniText}`);
    console.log(`    - Speed setting: ${miniSpeed}`);
    console.log(`    - Has marquee3k class: ${miniClasses.includes('marquee3k')}`);
    
    // Check for gap in text
    if (miniText) {
      const hasBullets = miniText.includes('••••••••');
      const hasMultipleSpaces = miniText.includes('        ');
      console.log(`    - Has bullet gap: ${hasBullets}`);
      console.log(`    - Has space gap: ${hasMultipleSpaces}`);
      console.log(`    - Gap implementation: ${hasBullets && hasMultipleSpaces ? '✅ Complete' : '❌ Incomplete'}`);
    }
  }
  
  if (modalTrackTitle) {
    const modalClasses = modalTrackTitle.className;
    const modalText = modalTrackTitle.textContent;
    const modalSpeed = modalTrackTitle.dataset.speed;
    console.log('  - Modal track title:');
    console.log(`    - Classes: ${modalClasses}`);
    console.log(`    - Text content: ${modalText}`);
    console.log(`    - Speed setting: ${modalSpeed}`);
    console.log(`    - Has marquee3k class: ${modalClasses.includes('marquee3k')}`);
    
    // Check for gap in text
    if (modalText) {
      const hasBullets = modalText.includes('••••••••');
      const hasMultipleSpaces = modalText.includes('        ');
      console.log(`    - Has bullet gap: ${hasBullets}`);
      console.log(`    - Has space gap: ${hasMultipleSpaces}`);
      console.log(`    - Gap implementation: ${hasBullets && hasMultipleSpaces ? '✅ Complete' : '❌ Incomplete'}`);
    }
  }
  
  playlistTitles.forEach((title, index) => {
    const titleClasses = title.className;
    const titleText = title.textContent;
    const titleSpeed = title.dataset.speed;
    console.log(`  - Playlist title ${index + 1}:`);
    console.log(`    - Classes: ${titleClasses}`);
    console.log(`    - Text content: ${titleText}`);
    console.log(`    - Speed setting: ${titleSpeed}`);
    console.log(`    - Has marquee3k class: ${titleClasses.includes('marquee3k')}`);
    
    // Check for gap in text
    if (titleText) {
      const hasBullets = titleText.includes('••••••••');
      const hasMultipleSpaces = titleText.includes('        ');
      console.log(`    - Has bullet gap: ${hasBullets}`);
      console.log(`    - Has space gap: ${hasMultipleSpaces}`);
      console.log(`    - Gap implementation: ${hasBullets && hasMultipleSpaces ? '✅ Complete' : '❌ Incomplete'}`);
    }
  });
  
  // Check for active marquee instances
  const activeMarquees = document.querySelectorAll('.marquee3k');
  console.log('🔍 Active Marquee Instances:');
  console.log('  - Number of active marquees:', activeMarquees.length);
  
  activeMarquees.forEach((marquee, index) => {
    const hasInstance = marquee._marquee3k;
    const speed = marquee.dataset.speed;
    const textContent = marquee.textContent;
    
    console.log(`  - Marquee ${index + 1}:`);
    console.log(`    - Has instance: ${hasInstance}`);
    console.log(`    - Speed: ${speed}`);
    console.log(`    - Text content: ${textContent}`);
    
    // Check for gap implementation
    if (textContent) {
      const hasBullets = textContent.includes('••••••••');
      const hasMultipleSpaces = textContent.includes('        ');
      const hasRepeatedText = textContent.split('••••••••').length > 1;
      
      console.log(`    - Gap analysis:`);
      console.log(`      - Has bullet separator: ${hasBullets}`);
      console.log(`      - Has space separator: ${hasMultipleSpaces}`);
      console.log(`      - Has repeated text: ${hasRepeatedText}`);
      console.log(`      - Gap quality: ${hasBullets && hasMultipleSpaces && hasRepeatedText ? '✅ Excellent' : '⚠️ Needs improvement'}`);
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
    
    // Check child div styles
    const childDiv = marquee.querySelector('div');
    if (childDiv) {
      const childStyle = window.getComputedStyle(childDiv);
      const childWhiteSpace = childStyle.whiteSpace;
      const childDisplay = childStyle.display;
      const childLetterSpacing = childStyle.letterSpacing;
      const childPaddingRight = childStyle.paddingRight;
      
      console.log(`    - Child div CSS:`);
      console.log(`      - White-space: ${childWhiteSpace}`);
      console.log(`      - Display: ${childDisplay}`);
      console.log(`      - Letter-spacing: ${childLetterSpacing}`);
      console.log(`      - Padding-right: ${childPaddingRight}`);
    }
  });
  
  // Test marquee functionality
  console.log('🧪 Marquee Functionality Test:');
  
  let marqueeWorking = 0;
  let marqueeWithGap = 0;
  let marqueeWithCorrectSpeed = 0;
  
  activeMarquees.forEach((marquee, index) => {
    if (marquee._marquee3k) {
      console.log(`  ✅ Marquee ${index + 1} is working`);
      marqueeWorking++;
      
      // Check speed
      const speed = marquee.dataset.speed;
      if (speed === '0.08') {
        console.log(`    ✅ Speed is correct: ${speed}`);
        marqueeWithCorrectSpeed++;
      } else {
        console.log(`    ⚠️ Speed is not optimal: ${speed}`);
      }
      
      // Check gap
      const textContent = marquee.textContent;
      if (textContent && textContent.includes('••••••••')) {
        console.log(`    ✅ Gap is properly implemented`);
        marqueeWithGap++;
      } else {
        console.log(`    ❌ Gap is missing or incomplete`);
      }
    } else {
      console.log(`  ❌ Marquee ${index + 1} is not working`);
    }
  });
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Modal: ✅ Found');
  console.log('  - Active marquees:', activeMarquees.length);
  console.log('  - Working marquees:', marqueeWorking);
  console.log('  - Marquees with gap:', marqueeWithGap);
  console.log('  - Marquees with correct speed:', marqueeWithCorrectSpeed);
  console.log('  - Screen size:', isMobile ? 'Mobile' : 'Desktop');
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Verify that marquees have visible gaps between repeated text');
  console.log('2. Check that the bullet separator (••••••••) is visible');
  console.log('3. Test that marquee speed is consistent (0.12)');
  console.log('4. Ensure gaps are visible on both desktop and mobile');
  console.log('5. Test with long track titles to trigger marquee');
  
  if (marqueeWorking > 0 && marqueeWithGap > 0 && marqueeWithCorrectSpeed > 0) {
    console.log('🎉 SUCCESS: Marquee gap and speed improvements are working!');
  } else {
    console.log('🔧 RECOMMENDATION: Some improvements needed - check the implementation');
  }
  
}, 3000);
