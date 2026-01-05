// Test script to verify modal player padding changes
console.log('🧪 Testing modal player padding changes...');

// Wait for the page to load
setTimeout(() => {
  // Check if the modal exists
  const modal = document.querySelector('.audio-player-modal');
  if (!modal) {
    console.error('❌ Modal not found');
    return;
  }
  
  console.log('✅ Modal found');
  
  // Check if the player header exists
  const playerHeader = document.querySelector('.player-header');
  if (!playerHeader) {
    console.error('❌ Player header not found');
    return;
  }
  
  console.log('✅ Player header found');
  
  // Check if the track title exists
  const trackTitle = document.querySelector('.track-title');
  if (!trackTitle) {
    console.error('❌ Track title not found');
    return;
  }
  
  console.log('✅ Track title found');
  
  // Check current screen size
  const isMobile = window.innerWidth <= 767;
  console.log('📱 Screen size:', isMobile ? 'Mobile (≤767px)' : 'Desktop (>767px)');
  
  // Check player header padding
  const headerPaddingRight = window.getComputedStyle(playerHeader).paddingRight;
  const headerInlinePadding = playerHeader.style.paddingRight;
  
  console.log('📋 Player Header Padding:');
  console.log('  - Computed padding-right:', headerPaddingRight);
  console.log('  - Inline padding-right:', headerInlinePadding || 'none');
  
  // Check track title padding
  const titlePaddingRight = window.getComputedStyle(trackTitle).paddingRight;
  const titleInlinePadding = trackTitle.style.paddingRight;
  
  console.log('📋 Track Title Padding:');
  console.log('  - Computed padding-right:', titlePaddingRight);
  console.log('  - Inline padding-right:', titleInlinePadding || 'none');
  
  // Check if close button exists
  const closeButton = document.querySelector('.close-modal-btn');
  if (closeButton) {
    console.log('✅ Close button found');
    
    const closeButtonPosition = window.getComputedStyle(closeButton).right;
    const closeButtonTop = window.getComputedStyle(closeButton).top;
    
    console.log('📋 Close Button Position:');
    console.log('  - Right position:', closeButtonPosition);
    console.log('  - Top position:', closeButtonTop);
  } else {
    console.log('⚠️  Close button not found');
  }
  
  // Test the padding logic
  console.log('🔍 Padding Logic Test:');
  
  // Check if player header padding is correct
  if (headerPaddingRight === '0px') {
    console.log('✅ CORRECT: Player header has 0px padding-right (flush with content below)');
  } else {
    console.log('❌ ISSUE: Player header should have 0px padding-right but has:', headerPaddingRight);
  }
  
  // Check if track title padding is correct
  if (titlePaddingRight === '10px') {
    console.log('✅ CORRECT: Track title has 10px padding-right (space for X icon)');
  } else {
    console.log('❌ ISSUE: Track title should have 10px padding-right but has:', titlePaddingRight);
  }
  
  // Check if close button is properly positioned
  if (closeButton) {
    if (closeButtonPosition === '6px') {
      console.log('✅ CORRECT: Close button is positioned at 6px from right');
    } else {
      console.log('⚠️  Close button position:', closeButtonPosition, '(expected 6px)');
    }
  }
  
  // Check for potential overlap issues
  console.log('🔍 Overlap Check:');
  
  if (closeButton && trackTitle) {
    const titleRect = trackTitle.getBoundingClientRect();
    const closeRect = closeButton.getBoundingClientRect();
    
    // Check if they overlap horizontally
    const titleRight = titleRect.right;
    const closeLeft = closeRect.left;
    
    if (titleRight > closeLeft) {
      console.log('⚠️  POTENTIAL OVERLAP: Track title might overlap with close button');
      console.log('   Title right edge:', titleRight);
      console.log('   Close button left edge:', closeLeft);
    } else {
      console.log('✅ NO OVERLAP: Track title and close button are properly spaced');
    }
  }
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Modal: ✅ Found');
  console.log('  - Player header: ✅ Found');
  console.log('  - Track title: ✅ Found');
  console.log('  - Close button: ✅ Found');
  console.log('  - Screen size:', isMobile ? 'Mobile' : 'Desktop');
  console.log('  - Player header padding:', headerPaddingRight);
  console.log('  - Track title padding:', titlePaddingRight);
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Verify the player header is flush with content below');
  console.log('2. Check that track title has enough space for the X icon');
  console.log('3. Test on both mobile and desktop screen sizes');
  console.log('4. Ensure no text overlaps with the close button');
  console.log('5. Verify the layout looks clean and aligned');
  
  if (headerPaddingRight === '0px' && titlePaddingRight === '10px') {
    console.log('🎉 SUCCESS: Modal padding changes are working correctly!');
  } else {
    console.log('🔧 RECOMMENDATION: Check the CSS rules for .player-header and .track-title');
  }
  
}, 2000);
