// Test script to verify complete rounded corners functionality
console.log('🧪 Testing complete rounded corners functionality...');

// Wait for the page to load
setTimeout(() => {
  // Check if the music player is loaded
  const audioPlayer = document.querySelector('.audio-player-container');
  if (!audioPlayer) {
    console.error('❌ Audio player container not found');
    return;
  }
  
  console.log('✅ Audio player found');
  
  // Get all elements that should be affected by rounded corners
  const elementsToCheck = [
    { selector: '.mini-music-bar', name: 'Mini Bar' },
    { selector: '.audio-player-modal', name: 'Modal Background' },
    { selector: '.audio-player-playlist', name: 'Modal Content' },
    { selector: '.track-item', name: 'Track Items' },
    { selector: '.mini-thumbnail', name: 'Mini Thumbnails' },
    { selector: '.album-art img', name: 'Album Art Images' },
    { selector: '.track-thumbnail img', name: 'Track Thumbnails' },
    { selector: '.prev-btn', name: 'Previous Button' },
    { selector: '.next-btn', name: 'Next Button' },
    { selector: '.volume-btn', name: 'Volume Button' },
    { selector: '.mini-play-btn', name: 'Mini Play Button' },
    { selector: '.mini-expand-btn', name: 'Mini Expand Button' },
    { selector: '.progress-bar', name: 'Progress Bar' },
    { selector: '.mini-progress-container', name: 'Mini Progress Container' },
    { selector: '.music-toggle-btn', name: 'Floating Button' },
    { selector: '.disc-container', name: 'Disc Container' },
    { selector: '.mini-disc-container', name: 'Mini Disc Container' },
    { selector: '.modal-disc-container', name: 'Modal Disc Container' },
    { selector: '.webexp-watermark-badge', name: 'Watermark Badge' },
    { selector: '.playlist-container', name: 'Playlist Container' },
    { selector: '.track-list', name: 'Track List' }
  ];
  
  console.log('🔍 Checking rounded corners on all elements...');
  
  let totalElements = 0;
  let elementsWithBorderRadius = 0;
  let elementsWithZeroBorderRadius = 0;
  
  elementsToCheck.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    totalElements += elements.length;
    
    if (elements.length > 0) {
      console.log(`📋 ${name} (${elements.length} elements):`);
      
      elements.forEach((element, index) => {
        const borderRadius = window.getComputedStyle(element).borderRadius;
        const inlineBorderRadius = element.style.borderRadius;
        
        console.log(`  ${index + 1}. Computed: ${borderRadius}, Inline: ${inlineBorderRadius || 'none'}`);
        
        if (borderRadius !== '0px' && borderRadius !== '0') {
          elementsWithBorderRadius++;
        } else {
          elementsWithZeroBorderRadius++;
        }
      });
    } else {
      console.log(`📋 ${name}: No elements found`);
    }
  });
  
  // Check if settings are loaded
  console.log('\n⚙️ Settings Check:');
  
  // Try to access the WEBEXP_MUSIC_PLAYER object
  if (typeof WEBEXP_MUSIC_PLAYER !== 'undefined') {
    const settings = WEBEXP_MUSIC_PLAYER.state.settings;
    if (settings) {
      console.log('✅ Settings loaded');
      console.log('  - Rounded corners setting:', settings.roundedCorners);
      console.log('  - Color scheme:', settings.colorScheme);
      console.log('  - Display mode:', settings.displayMode);
    } else {
      console.log('⚠️  Settings object exists but no settings data');
    }
  } else {
    console.log('⚠️  WEBEXP_MUSIC_PLAYER object not found');
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`  - Total elements checked: ${totalElements}`);
  console.log(`  - Elements with border radius: ${elementsWithBorderRadius}`);
  console.log(`  - Elements with zero border radius: ${elementsWithZeroBorderRadius}`);
  
  // Determine if rounded corners are enabled or disabled
  const hasRoundedCorners = elementsWithBorderRadius > elementsWithZeroBorderRadius;
  
  if (hasRoundedCorners) {
    console.log('🎯 Rounded corners appear to be ENABLED');
  } else {
    console.log('🎯 Rounded corners appear to be DISABLED');
  }
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Go to the dashboard and toggle the "Rounded Corners" setting');
  console.log('2. Refresh the page and run this test again');
  console.log('3. Check that all elements change their border radius accordingly');
  console.log('4. Verify that the modal, track blocks, and thumbnails all respond to the setting');
  
  // Check for specific issues
  if (elementsWithBorderRadius > 0 && elementsWithZeroBorderRadius > 0) {
    console.log('\n⚠️  MIXED STATE DETECTED:');
    console.log('   Some elements have rounded corners while others don\'t');
    console.log('   This might indicate the rounded corners setting is not being applied consistently');
  }
  
  // Check if modal has rounded corners when it shouldn't
  const modal = document.querySelector('.audio-player-modal');
  if (modal) {
    const modalBorderRadius = window.getComputedStyle(modal).borderRadius;
    if (modalBorderRadius !== '0px' && modalBorderRadius !== '0') {
      console.log('\n⚠️  MODAL ISSUE:');
      console.log('   The modal background has rounded corners but should always be 0');
      console.log('   Modal border radius:', modalBorderRadius);
    }
  }
  
  console.log('\n🎉 Test complete!');
  
}, 3000);
