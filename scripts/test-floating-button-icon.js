// Test script to verify floating button music icon visibility
console.log('🧪 Testing floating button music icon visibility...');

// Wait for the page to load
setTimeout(() => {
  // Check if the floating button exists
  const floatingButton = document.querySelector('.music-toggle-btn');
  if (!floatingButton) {
    console.error('❌ Floating button not found');
    return;
  }
  
  console.log('✅ Floating button found');
  
  // Check if the music icon exists
  const musicIcon = floatingButton.querySelector('.music-icon');
  if (!musicIcon) {
    console.error('❌ Music icon not found');
    return;
  }
  
  console.log('✅ Music icon found');
  
  // Check if the disc container exists
  const discContainer = floatingButton.querySelector('.disc-container');
  if (!discContainer) {
    console.error('❌ Disc container not found');
    return;
  }
  
  console.log('✅ Disc container found');
  
  // Check current state
  const audioPlayer = document.querySelector('.audio-player-container');
  const isPlaying = audioPlayer && audioPlayer.classList.contains('playing');
  
  console.log('🎵 Music player state:');
  console.log('  - Is playing:', isPlaying);
  console.log('  - Has playing class:', audioPlayer ? audioPlayer.classList.contains('playing') : 'No player found');
  
  // Check music icon visibility
  const musicIconOpacity = window.getComputedStyle(musicIcon).opacity;
  const musicIconVisibility = window.getComputedStyle(musicIcon).visibility;
  
  console.log('🎵 Music icon visibility:');
  console.log('  - Opacity:', musicIconOpacity);
  console.log('  - Visibility:', musicIconVisibility);
  console.log('  - Is visible:', musicIconOpacity !== '0' && musicIconVisibility !== 'hidden');
  
  // Check disc container visibility
  const discOpacity = window.getComputedStyle(discContainer).opacity;
  const discVisibility = window.getComputedStyle(discContainer).visibility;
  const hasDiscHiddenClass = discContainer.classList.contains('disc-hidden');
  
  console.log('💿 Disc container visibility:');
  console.log('  - Opacity:', discOpacity);
  console.log('  - Visibility:', discVisibility);
  console.log('  - Has disc-hidden class:', hasDiscHiddenClass);
  console.log('  - Is visible:', discOpacity !== '0' && discVisibility !== 'hidden');
  
  // Test the logic
  console.log('🔍 Logic Test:');
  
  if (isPlaying) {
    if (musicIconOpacity === '0' && musicIconVisibility === 'hidden') {
      console.log('✅ CORRECT: Music is playing and music icon is hidden');
    } else {
      console.log('❌ ISSUE: Music is playing but music icon is still visible');
      console.log('   This indicates the CSS rule .playing .music-toggle-btn .music-icon is not working');
    }
    
    if (discOpacity !== '0' && discVisibility !== 'hidden') {
      console.log('✅ CORRECT: Music is playing and disc is visible');
    } else {
      console.log('❌ ISSUE: Music is playing but disc is not visible');
      console.log('   This indicates the disc visibility logic is not working');
    }
  } else {
    if (musicIconOpacity !== '0' && musicIconVisibility !== 'hidden') {
      console.log('✅ CORRECT: Music is not playing and music icon is visible');
    } else {
      console.log('❌ ISSUE: Music is not playing but music icon is hidden');
      console.log('   This indicates the music icon should be visible when not playing');
    }
    
    if (discOpacity === '0' || discVisibility === 'hidden') {
      console.log('✅ CORRECT: Music is not playing and disc is hidden');
    } else {
      console.log('❌ ISSUE: Music is not playing but disc is visible');
      console.log('   This indicates the disc should be hidden when not playing');
    }
  }
  
  // Check CSS rules
  console.log('🎨 CSS Rules Check:');
  
  // Test if the playing rule is working
  const testElement = document.createElement('div');
  testElement.className = 'music-icon';
  testElement.style.position = 'absolute';
  testElement.style.left = '-9999px';
  document.body.appendChild(testElement);
  
  // Add playing class to parent
  const testParent = document.createElement('div');
  testParent.className = 'playing music-toggle-btn';
  testParent.appendChild(testElement);
  document.body.appendChild(testParent);
  
  const hiddenOpacity = window.getComputedStyle(testElement).opacity;
  const hiddenVisibility = window.getComputedStyle(testElement).visibility;
  
  console.log('  - .playing .music-toggle-btn .music-icon opacity:', hiddenOpacity);
  console.log('  - .playing .music-toggle-btn .music-icon visibility:', hiddenVisibility);
  
  // Clean up test elements
  document.body.removeChild(testParent);
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log('  - Floating button: ✅ Found');
  console.log('  - Music icon: ✅ Found');
  console.log('  - Disc container: ✅ Found');
  console.log('  - Current state:', isPlaying ? 'Playing (icon should be hidden)' : 'Not playing (icon should be visible)');
  
  if (isPlaying && musicIconOpacity === '0' && musicIconVisibility === 'hidden') {
    console.log('🎉 SUCCESS: Music icon is properly hidden when playing!');
  } else if (!isPlaying && musicIconOpacity !== '0' && musicIconVisibility !== 'hidden') {
    console.log('🎉 SUCCESS: Music icon is properly visible when not playing!');
  } else {
    console.log('🔧 RECOMMENDATION: Check the CSS rules for .playing .music-toggle-btn .music-icon');
  }
  
  // Test recommendations
  console.log('\n🧪 TEST RECOMMENDATIONS:');
  console.log('1. Start playing music and verify the music icon disappears');
  console.log('2. Pause music and verify the music icon reappears');
  console.log('3. Check that the disc is visible when playing and hidden when not playing');
  console.log('4. Verify smooth transitions between states');
  
}, 2000);
