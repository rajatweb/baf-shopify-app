// Test script to find the perfect marquee speed that matches the original player
console.log('🎯 Testing marquee speed matching with original player...');

// Speed options to test (lower = faster)
const SPEED_OPTIONS = [
  { value: 0.05, label: 'Very Fast (0.05)' },
  { value: 0.08, label: 'Fast (0.08) - Current Setting' },
  { value: 0.12, label: 'Medium (0.12)' },
  { value: 0.18, label: 'Slow (0.18)' },
  { value: 0.25, label: 'Very Slow (0.25)' }
];

let currentSpeedIndex = 0;
let testInterval;

// Function to test different speeds
function testSpeed(speedValue, speedLabel) {
  console.log(`🧪 Testing speed: ${speedLabel}`);
  
  // Update all marquee elements with new speed
  const marqueeElements = document.querySelectorAll('.marquee3k');
  
  marqueeElements.forEach((element, index) => {
    // Update dataset speed
    element.dataset.speed = speedValue.toString();
    
    // Destroy existing instance
    if (element._marquee3k) {
      element._marquee3k.destroy();
    }
    
    // Reinitialize with new speed
    if (window.Marquee3k) {
      new Marquee3k(element, { 
        selector: 'marquee3k',
        speed: speedValue,
        gap: 0,
        duplicated: true
      });
    }
    
    console.log(`  ✅ Updated marquee ${index + 1} to speed ${speedValue}`);
  });
  
  // Show current speed in UI
  showSpeedIndicator(speedLabel);
}

// Function to show current speed being tested
function showSpeedIndicator(speedLabel) {
  // Remove existing indicator
  const existingIndicator = document.querySelector('.speed-test-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.className = 'speed-test-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  
  indicator.innerHTML = `
    <div style="margin-bottom: 8px;">🎯 Testing Speed:</div>
    <div style="font-size: 16px; color: #00ff88;">${speedLabel}</div>
    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
      Press SPACE to test next speed<br>
      Press ESC to stop testing
    </div>
  `;
  
  document.body.appendChild(indicator);
}

// Function to start speed testing
function startSpeedTesting() {
  console.log('🚀 Starting marquee speed testing...');
  console.log('📋 Speed options to test:');
  SPEED_OPTIONS.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option.label}`);
  });
  
  console.log('\n🎮 Controls:');
  console.log('  - SPACE: Test next speed');
  console.log('  - ESC: Stop testing');
  console.log('  - Current speed will be shown in top-right corner');
  
  // Start with first speed
  testSpeed(SPEED_OPTIONS[0].value, SPEED_OPTIONS[0].label);
  
  // Set up keyboard controls
  document.addEventListener('keydown', handleSpeedTestKeys);
  
  // Auto-advance every 5 seconds
  testInterval = setInterval(() => {
    currentSpeedIndex = (currentSpeedIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[currentSpeedIndex];
    testSpeed(nextSpeed.value, nextSpeed.label);
  }, 5000);
}

// Function to handle keyboard controls
function handleSpeedTestKeys(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    currentSpeedIndex = (currentSpeedIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[currentSpeedIndex];
    testSpeed(nextSpeed.value, nextSpeed.label);
    console.log(`🔄 Manually advanced to: ${nextSpeed.label}`);
  } else if (event.code === 'Escape') {
    stopSpeedTesting();
  }
}

// Function to stop speed testing
function stopSpeedTesting() {
  console.log('⏹️ Stopping speed testing...');
  
  // Clear interval
  if (testInterval) {
    clearInterval(testInterval);
    testInterval = null;
  }
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleSpeedTestKeys);
  
  // Remove indicator
  const indicator = document.querySelector('.speed-test-indicator');
  if (indicator) {
    indicator.remove();
  }
  
  // Reset to current setting (0.08)
  testSpeed(0.08, 'Fast (0.08) - Current Setting');
  
  console.log('✅ Speed testing stopped. Reset to current setting.');
}

// Wait for page to load and marquees to be ready
setTimeout(() => {
  // Check if marquees exist
  const marquees = document.querySelectorAll('.marquee3k');
  
  if (marquees.length === 0) {
    console.log('⚠️ No marquees found. Waiting for them to be created...');
    
    // Wait a bit more and check again
    setTimeout(() => {
      const marquees2 = document.querySelectorAll('.marquee3k');
      if (marquees2.length > 0) {
        console.log(`✅ Found ${marquees2.length} marquees. Ready to test speeds!`);
        startSpeedTesting();
      } else {
        console.log('❌ Still no marquees found. Make sure to add a long track title to trigger marquee.');
      }
    }, 2000);
  } else {
    console.log(`✅ Found ${marquees.length} marquees. Ready to test speeds!`);
    startSpeedTesting();
  }
}, 3000);

// Instructions for user
console.log('\n📖 SPEED TESTING INSTRUCTIONS:');
console.log('1. Wait for the speed indicator to appear in the top-right corner');
console.log('2. Watch how the marquee text moves at different speeds');
console.log('3. Compare with your original music player\'s marquee speed');
console.log('4. Use SPACE to manually advance through speeds');
console.log('5. Use ESC to stop testing and return to current setting');
console.log('6. Note which speed feels closest to your original player');
console.log('7. Update the speed in the code to match your preference');

// Speed reference guide
console.log('\n📊 SPEED REFERENCE GUIDE:');
console.log('• 0.05: Very Fast - Text moves quickly across screen');
console.log('• 0.08: Fast - Text moves at good pace (current setting)');
console.log('• 0.12: Medium - Text moves at moderate pace');
console.log('• 0.18: Slow - Text moves slowly across screen');
console.log('• 0.25: Very Slow - Text moves very slowly');
console.log('\n💡 TIP: Lower numbers = Faster movement in Marquee3k');
