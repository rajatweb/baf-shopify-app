const fs = require('fs');
const path = require('path');

function findConsoleStatements(directory) {
  const results = {
    consoleLog: [],
    consoleError: [],
    consoleWarn: []
  };

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.liquid')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Find console.log statements
        const logMatches = content.match(/console\.log\([^)]*\)/g);
        if (logMatches) {
          results.consoleLog.push({
            file: filePath,
            lines: logMatches
          });
        }
        
        // Find console.error statements
        const errorMatches = content.match(/console\.error\([^)]*\)/g);
        if (errorMatches) {
          results.consoleError.push({
            file: filePath,
            lines: errorMatches
          });
        }
        
        // Find console.warn statements
        const warnMatches = content.match(/console\.warn\([^)]*\)/g);
        if (warnMatches) {
          results.consoleWarn.push({
            file: filePath,
            lines: warnMatches
          });
        }
      }
    }
  }
  
  scanDirectory(directory);
  return results;
}

function testConsoleCleanup() {
  console.log('🧪 Testing Console Cleanup');
  console.log('=' .repeat(50));
  
  // Test frontend directory
  const frontendResults = findConsoleStatements('./frontend/src');
  const extensionResults = findConsoleStatements('./extensions');
  
  console.log('📁 Frontend Console Statements:');
  console.log('');
  
  if (frontendResults.consoleLog.length === 0) {
    console.log('✅ console.log statements: REMOVED');
  } else {
    console.log('❌ console.log statements found:');
    frontendResults.consoleLog.forEach(item => {
      console.log(`   ${item.file}:`);
      item.lines.forEach(line => console.log(`     ${line}`));
    });
  }
  
  if (frontendResults.consoleError.length > 0) {
    console.log('✅ console.error statements: KEPT');
    console.log(`   Found ${frontendResults.consoleError.length} error statements`);
  } else {
    console.log('⚠️  No console.error statements found');
  }
  
  if (frontendResults.consoleWarn.length > 0) {
    console.log('⚠️  console.warn statements found:');
    frontendResults.consoleWarn.forEach(item => {
      console.log(`   ${item.file}:`);
      item.lines.forEach(line => console.log(`     ${line}`));
    });
  }
  
  console.log('');
  console.log('🎵 Extension Console Statements:');
  console.log('');
  
  if (extensionResults.consoleLog.length === 0) {
    console.log('✅ console.log statements: REMOVED');
  } else {
    console.log('❌ console.log statements found:');
    extensionResults.consoleLog.forEach(item => {
      console.log(`   ${item.file}:`);
      item.lines.forEach(line => console.log(`     ${line}`));
    });
  }
  
  if (extensionResults.consoleError.length > 0) {
    console.log('✅ console.error statements: KEPT');
    console.log(`   Found ${extensionResults.consoleError.length} error statements`);
  } else {
    console.log('⚠️  No console.error statements found');
  }
  
  console.log('');
  console.log('🎯 Summary:');
  console.log(`   Frontend console.log: ${frontendResults.consoleLog.length === 0 ? '✅ REMOVED' : '❌ FOUND'}`);
  console.log(`   Frontend console.error: ${frontendResults.consoleError.length > 0 ? '✅ KEPT' : '⚠️  NONE'}`);
  console.log(`   Extension console.log: ${extensionResults.consoleLog.length === 0 ? '✅ REMOVED' : '❌ FOUND'}`);
  console.log(`   Extension console.error: ${extensionResults.consoleError.length > 0 ? '✅ KEPT' : '⚠️  NONE'}`);
  
  const totalLogs = frontendResults.consoleLog.length + extensionResults.consoleLog.length;
  const totalErrors = frontendResults.consoleError.length + extensionResults.consoleError.length;
  
  console.log('');
  console.log('🎉 Console cleanup test completed!');
  console.log(`   Total console.log removed: ${totalLogs === 0 ? 'ALL' : totalLogs}`);
  console.log(`   Total console.error kept: ${totalErrors}`);
  
  if (totalLogs === 0) {
    console.log('   ✅ SUCCESS: All console.log statements removed from frontend');
  } else {
    console.log('   ❌ FAILED: Some console.log statements remain');
  }
}

// Run the test
testConsoleCleanup();
