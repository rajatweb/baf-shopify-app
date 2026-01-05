// Test script to find the perfect marquee speed
console.log('🎯 Testing marquee speeds...');

// Speed options to test
const SPEEDS = [10, 15, 20, 25, 30]; // in seconds
let currentSpeedIndex = 0;

function testSpeed(seconds) {
  console.log(`🧪 Testing speed: ${seconds}s`);
  
  // Update CSS variable
  document.documentElement.style.setProperty('--moving-scroll-speed', `${seconds}s`);
  
  // Update all existing marquees
  const scrollingElements = document.querySelectorAll('.scrolling');
  scrollingElements.forEach((element, index) => {
    // Remove and re-add scrolling class to restart animation
    element.classList.remove('scrolling');
    setTimeout(() => {
      element.classList.add('scrolling');
    }, 50);
  });
  
  // Show current speed
  showSpeedIndicator(`${seconds}s`);
}

function showSpeedIndicator(speed) {
  // Remove existing indicator
  const existing = document.querySelector('.speed-indicator');
  if (existing) existing.remove();
  
  // Create new indicator
  const indicator = document.createElement('div');
  indicator.className = 'speed-indicator';
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
    <div style="margin-bottom: 8px;">🎯 Current Speed:</div>
    <div style="font-size: 16px; color: #00ff88;">${speed}</div>
    <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
      Press SPACE to test next speed<br>
      Press ESC to stop testing
    </div>
  `;
  
  document.body.appendChild(indicator);
}

function startSpeedTesting() {
  console.log('🚀 Starting speed testing...');
  console.log('📋 Speed options:', SPEEDS.join('s, ') + 's');
  console.log('🎮 Controls: SPACE = next speed, ESC = stop');
  
  // Start with first speed
  testSpeed(SPEEDS[0]);
  
  // Set up keyboard controls
  document.addEventListener('keydown', handleKeys);
  
  // Auto-advance every 8 seconds
  const interval = setInterval(() => {
    currentSpeedIndex = (currentSpeedIndex + 1) % SPEEDS.length;
    testSpeed(SPEEDS[currentSpeedIndex]);
  }, 8000);
  
  // Store interval for cleanup
  window.speedTestInterval = interval;
}

function handleKeys(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    currentSpeedIndex = (currentSpeedIndex + 1) % SPEEDS.length;
    testSpeed(SPEEDS[currentSpeedIndex]);
    console.log(`🔄 Manually advanced to: ${SPEEDS[currentSpeedIndex]}s`);
  } else if (event.code === 'Escape') {
    stopSpeedTesting();
  }
}

function stopSpeedTesting() {
  console.log('⏹️ Stopping speed testing...');
  
  // Clear interval
  if (window.speedTestInterval) {
    clearInterval(window.speedTestInterval);
    window.speedTestInterval = null;
  }
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleKeys);
  
  // Remove indicator
  const indicator = document.querySelector('.speed-indicator');
  if (indicator) indicator.remove();
  
  // Reset to current setting (15s)
  document.documentElement.style.setProperty('--moving-scroll-speed', '15s');
  console.log('✅ Speed testing stopped. Reset to 15s.');
}

// Wait for page to load
setTimeout(() => {
  console.log('📖 SPEED TESTING INSTRUCTIONS:');
  console.log('1. Watch the speed indicator in the top-right corner');
  console.log('2. Observe how the marquee text moves at different speeds');
  console.log('3. Use SPACE to manually advance through speeds');
  console.log('4. Use ESC to stop testing and return to 15s');
  console.log('5. Note which speed feels most comfortable');
  
  // Check if marquees exist
  const marquees = document.querySelectorAll('.marquee-active');
  
  if (marquees.length > 0) {
    console.log(`✅ Found ${marquees.length} marquees. Starting speed test...`);
    startSpeedTesting();
  } else {
    console.log('⚠️ No marquees found. Waiting for them to be created...');
    
    // Wait a bit more and check again
    setTimeout(() => {
      const marquees2 = document.querySelectorAll('.marquee-active');
      if (marquees2.length > 0) {
        console.log(`✅ Found ${marquees2.length} marquees. Starting speed test...`);
        startSpeedTesting();
      } else {
        console.log('❌ Still no marquees found. Make sure to add a long track title.');
      }
    }, 3000);
  }
}, 2000);
