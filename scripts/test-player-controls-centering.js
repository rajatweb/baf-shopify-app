// Test script to verify player controls centering on desktop
console.log('🧪 Testing player controls centering on desktop...');

// Wait for the page to load
setTimeout(() => {
  // Check if the modal exists
  const modal = document.querySelector('.audio-player-modal');
  if (!modal) {
    console.error('❌ Modal not found');
    return;
  }
  
  console.log('✅ Modal found');
  
  // Check if the main controls exist
  const mainControls = document.querySelector('.main-controls');
  if (!mainControls) {
    console.error('❌ Main controls not found');
    return;
  }
  
  console.log('✅ Main controls found');
  
  // Check current screen size
  const isMobile = window.innerWidth <= 767;
  const isDesktop = window.innerWidth >= 800;
  console.log('📱 Screen size:', isMobile ? 'Mobile (≤767px)' : isDesktop ? 'Desktop (≥800px)' : 'Tablet (768-799px)');
  
  // Check main controls positioning
  const mainControlsPosition = window.getComputedStyle(mainControls).position;
  const mainControlsLeft = window.getComputedStyle(mainControls).left;
  const mainControlsTransform = window.getComputedStyle(mainControls).transform;
  
  console.log('📋 Main Controls Positioning:');
  console.log('  - Position:', mainControlsPosition);
  console.log('  - Left offset:', mainControlsLeft);
  console.log('  - Transform:', mainControlsTransform);
  
  // Check main controls layout
  const mainControlsDisplay = window.getComputedStyle(mainControls).display;
  const mainControlsJustifyContent = window.getComputedStyle(mainControls).justifyContent;
  const mainControlsAlignItems = window.getComputedStyle(mainControls).alignItems;
  const mainControlsWidth = window.getComputedStyle(mainControls).width;
  
  console.log('📋 Main Controls Layout:');
  console.log('  - Display:', mainControlsDisplay);
  console.log('  - Justify content:', mainControlsJustifyContent);
  console.log('  - Align items:', mainControlsAlignItems);
  console.log('  - Width:', mainControlsWidth);
  
  // Check if controls are centered within their container
  const controlButtons = mainControls.querySelectorAll('.play-btn, .prev-btn, .next-btn, .volume-btn');
  console.log('📋 Control Buttons:');
  console.log('  - Number of buttons:', controlButtons.length);
  
  controlButtons.forEach((button, index) => {
    const buttonType = button.className.includes('play-btn') ? 'Play' : 
                      button.className.includes('prev-btn') ? 'Previous' : 
                      button.className.includes('next-btn') ? 'Next' : 'Volume';
    console.log(`  - ${buttonType} button ${index + 1}:`, button.className);
  });
  
  // Check the centering logic
  console.log('🔍 Centering Logic Test:');
  
  if (isDesktop) {
    // Desktop specific checks
    if (mainControlsLeft === '0px' || mainControlsLeft === 'auto') {
      console.log('✅ CORRECT: Main controls have no left offset on desktop');
    } else {
      console.log('❌ ISSUE: Main controls still have left offset on desktop:', mainControlsLeft);
    }
    
    if (mainControlsJustifyContent === 'center') {
      console.log('✅ CORRECT: Main controls use center justification on desktop');
    } else {
      console.log('❌ ISSUE: Main controls should use center justification but have:', mainControlsJustifyContent);
    }
  } else if (isMobile) {
    // Mobile specific checks
    if (mainControlsJustifyContent === 'center') {
      console.log('✅ CORRECT: Main controls use center justification on mobile');
    } else {
      console.log('❌ ISSUE: Main controls should use center justification on mobile but have:', mainControlsJustifyContent);
    }
  }
  
  // Check if controls are visually centered
  console.log('🔍 Visual Centering Check:');
  
  if (mainControls && mainControls.parentElement) {
    const parentRect = mainControls.parentElement.getBoundingClientRect();
    const controlsRect = mainControls.getBoundingClientRect();
    
    const parentCenter = parentRect.left + (parentRect.width / 2);
    const controlsCenter = controlsRect.left + (controlsRect.width / 2);
    const offset = Math.abs(parentCenter - controlsCenter);
    
    console.log('📐 Centering Analysis:');
    console.log('  - Parent container width:', parentRect.width);
    console.log('  - Controls width:', controlsRect.width);
    console.log('  - Parent center:', parentCenter);
    console.log('  - Controls center:', controlsCenter);
    console.log('  - Offset from center:', offset);
    
    if (offset < 10) {
      console.log('✅ EXCELLENT: Controls are very well centered (offset < 10px)');
    } else if (offset < 20) {
      console.log('✅ GOOD: Controls are reasonably centered (offset < 20px)');
    } else if (offset < 50) {
      console.log('⚠️  ACCEPTABLE: Controls are somewhat centered (offset < 50px)');
    } else {
      console.log('❌ POOR: Controls are significantly off-center (offset >= 50px)');
    }
  }
  
  // Check for any remaining positioning issues
  console.log('🔍 Positioning Issues Check:');
  
  const hasInlineLeft = mainControls.style.left;
  const hasInlinePosition = mainControls.style.position;
  
  if (hasInlineLeft) {
    console.log('⚠️  WARNING: Main controls have inline left style:', hasInlineLeft);
  } else {
    console.log('✅ No inline left positioning issues');
  }
  
  if (hasInlinePosition) {
    console.log('⚠️  WARNING: Main controls have inline position style:', hasInlinePosition);
  } else {
    console.log('✅ No inline position issues');
  }
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Modal: ✅ Found');
  console.log('  - Main controls: ✅ Found');
  console.log('  - Screen size:', isMobile ? 'Mobile' : isDesktop ? 'Desktop' : 'Tablet');
  console.log('  - Position:', mainControlsPosition);
  console.log('  - Left offset:', mainControlsLeft);
  console.log('  - Justify content:', mainControlsJustifyContent);
  console.log('  - Number of buttons:', controlButtons.length);
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Verify the player controls appear centered on desktop');
  console.log('2. Check that controls are not shifted to the left or right');
  console.log('3. Test on different desktop screen sizes');
  console.log('4. Compare with mobile version (should look similar)');
  console.log('5. Ensure controls are visually balanced within the modal');
  
  if (isDesktop && (mainControlsLeft === '0px' || mainControlsLeft === 'auto') && mainControlsJustifyContent === 'center') {
    console.log('🎉 SUCCESS: Player controls are properly centered on desktop!');
  } else if (isMobile && mainControlsJustifyContent === 'center') {
    console.log('🎉 SUCCESS: Player controls are properly centered on mobile!');
  } else {
    console.log('🔧 RECOMMENDATION: Check the CSS rules for .main-controls centering');
  }
  
}, 2000);
