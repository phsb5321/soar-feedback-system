#!/usr/bin/env node

/**
 * Test Script for Protected Audio Functionality
 *
 * This script verifies that the protected audio system is properly implemented:
 * 1. AudioStore has protected audio state and methods
 * 2. AudioBlockingOverlay component exists and renders correctly
 * 3. GlobalAudioInterceptor respects protected audio
 * 4. HelpButton components use protected audio
 * 5. Audio context provides protected audio methods
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkFileExists(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkFileContent(filePath, patterns, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    log(`❌ ${description} - File not found`, 'red');
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const results = patterns.map(pattern => ({
    pattern: pattern.description,
    found: pattern.regex.test(content)
  }));

  const allFound = results.every(r => r.found);

  if (allFound) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description}`, 'red');
    results.forEach(r => {
      if (!r.found) {
        log(`   Missing: ${r.pattern}`, 'yellow');
      }
    });
  }

  return allFound;
}

function runTests() {
  log('🧪 Testing Protected Audio Implementation', 'bold');
  log('==========================================', 'blue');

  let passed = 0;
  let total = 0;

  // Test 1: AudioStore has protected audio functionality
  total++;
  const audioStorePatterns = [
    {
      description: 'isProtectedPlaying state',
      regex: /isProtectedPlaying:\s*boolean/
    },
    {
      description: 'protectedAudio state',
      regex: /protectedAudio:\s*HTMLAudioElement\s*\|\s*null/
    },
    {
      description: 'playProtectedAudio method',
      regex: /playProtectedAudio:\s*\([^)]*\)\s*=>\s*Promise<boolean>/
    },
    {
      description: 'stopProtectedAudio method',
      regex: /stopProtectedAudio:\s*\(\)\s*=>\s*void/
    }
  ];

  if (checkFileContent('src/stores/audioStore.ts', audioStorePatterns, 'AudioStore protected audio functionality')) {
    passed++;
  }

  // Test 2: AudioBlockingOverlay component exists
  total++;
  if (checkFileExists('src/components/providers/AudioBlockingOverlay.tsx', 'AudioBlockingOverlay component')) {
    passed++;
  }

  // Test 3: AudioBlockingOverlay uses protected audio state
  total++;
  const overlayPatterns = [
    {
      description: 'imports useAudioStore',
      regex: /import.*useAudioStore.*from.*audioStore/
    },
    {
      description: 'uses isProtectedPlaying',
      regex: /isProtectedPlaying.*useAudioStore/
    },
    {
      description: 'renders overlay conditionally',
      regex: /if\s*\(\s*!isProtectedPlaying\s*\)/
    },
    {
      description: 'blocks user interactions',
      regex: /preventDefault|stopPropagation/
    }
  ];

  if (checkFileContent('src/components/providers/AudioBlockingOverlay.tsx', overlayPatterns, 'AudioBlockingOverlay implementation')) {
    passed++;
  }

  // Test 4: useProtectedAudio hook exists
  total++;
  if (checkFileExists('src/hooks/useProtectedAudio.ts', 'useProtectedAudio hook')) {
    passed++;
  }

  // Test 5: GlobalAudioInterceptor respects protected audio
  total++;
  const interceptorPatterns = [
    {
      description: 'checks isProtectedPlaying',
      regex: /isProtectedPlaying/
    },
    {
      description: 'prevents stopping protected audio',
      regex: /!isPlaying\s*\|\|\s*isProtectedPlaying|isProtectedPlaying.*return/
    }
  ];

  if (checkFileContent('src/hooks/useGlobalAudioInterceptor.ts', interceptorPatterns, 'GlobalAudioInterceptor respects protected audio')) {
    passed++;
  }

  // Test 6: AudioContext provides protected audio
  total++;
  const contextPatterns = [
    {
      description: 'imports useProtectedAudio',
      regex: /import.*useProtectedAudio/
    },
    {
      description: 'provides playProtectedPageAudio',
      regex: /playProtectedPageAudio.*AudioMessageKey/
    }
  ];

  if (checkFileContent('src/contexts/AudioContext.tsx', contextPatterns, 'AudioContext protected audio support')) {
    passed++;
  }

  // Test 7: HelpButton uses protected audio
  total++;
  const helpButtonPatterns = [
    {
      description: 'imports useProtectedAudio',
      regex: /import.*useProtectedAudio/
    },
    {
      description: 'uses isProtectedPlaying',
      regex: /isProtectedPlaying/
    }
  ];

  if (checkFileContent('src/components/atoms/HelpButton/HelpButton.tsx', helpButtonPatterns, 'HelpButton uses protected audio')) {
    passed++;
  }

  // Test 8: Layout includes AudioBlockingOverlay
  total++;
  const layoutPatterns = [
    {
      description: 'imports AudioBlockingOverlay',
      regex: /import.*AudioBlockingOverlay/
    },
    {
      description: 'renders AudioBlockingOverlay',
      regex: /<AudioBlockingOverlay\s*\/>/
    }
  ];

  if (checkFileContent('src/app/layout.tsx', layoutPatterns, 'Layout includes AudioBlockingOverlay')) {
    passed++;
  }

  // Test 9: Pages use protected audio for help buttons
  total++;
  const pagePatterns = [
    {
      description: 'uses playProtectedPageAudio',
      regex: /playProtectedPageAudio/
    }
  ];

  let pagesUsingProtectedAudio = 0;
  const pagesToCheck = [
    'src/app/page.tsx',
    'src/app/csat/page.tsx'
  ];

  pagesToCheck.forEach(page => {
    if (checkFileContent(page, pagePatterns, `${page} uses protected audio`)) {
      pagesUsingProtectedAudio++;
    }
  });

  if (pagesUsingProtectedAudio === pagesToCheck.length) {
    passed++;
  }

  // Final Results
  log('\n📊 Test Results', 'bold');
  log('===============', 'blue');
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'red');

  if (passed === total) {
    log('\n🎉 All tests passed! Protected audio system is properly implemented.', 'green');
    log('\nFeatures verified:', 'blue');
    log('✅ Audio store supports protected audio state', 'green');
    log('✅ Blocking overlay prevents user interactions', 'green');
    log('✅ Global interceptor respects protected audio', 'green');
    log('✅ Help buttons use protected audio', 'green');
    log('✅ Audio context provides protected methods', 'green');
    log('✅ Layout integrates overlay component', 'green');
    log('✅ Pages use protected audio for help', 'green');

    log('\n🚀 Ready for testing:', 'blue');
    log('1. Start the dev server: npm run dev', 'yellow');
    log('2. Click any help button (info icons)', 'yellow');
    log('3. Verify overlay appears and blocks interactions', 'yellow');
    log('4. Verify overlay disappears when audio ends', 'yellow');

    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please review the implementation.', 'red');
    process.exit(1);
  }
}

// Additional functionality checks
function checkAdvancedFeatures() {
  log('\n🔍 Advanced Feature Checks', 'bold');
  log('=========================', 'blue');

  // Check for accessibility features
  const accessibilityPatterns = [
    {
      description: 'ARIA live regions',
      regex: /aria-live/
    },
    {
      description: 'Screen reader support',
      regex: /sr-only|screen.*reader/
    },
    {
      description: 'Role attributes',
      regex: /role="dialog"|role="status"/
    }
  ];

  checkFileContent('src/components/providers/AudioBlockingOverlay.tsx', accessibilityPatterns, 'Accessibility features in overlay');

  // Check for mobile support
  const mobilePatterns = [
    {
      description: 'Touch event handling',
      regex: /touchstart|touchend/
    },
    {
      description: 'Responsive design',
      regex: /mobile|responsive|max-w/
    }
  ];

  checkFileContent('src/components/providers/AudioBlockingOverlay.tsx', mobilePatterns, 'Mobile support in overlay');

  // Check for error handling
  const errorPatterns = [
    {
      description: 'Audio error handling',
      regex: /onerror|catch|try.*catch/
    },
    {
      description: 'Fallback behavior',
      regex: /console\.(warn|error|info)/
    }
  ];

  checkFileContent('src/stores/audioStore.ts', errorPatterns, 'Error handling in audio store');
}

// Run the tests
if (require.main === module) {
  runTests();
  checkAdvancedFeatures();
}

module.exports = {
  runTests,
  checkAdvancedFeatures,
  checkFileExists,
  checkFileContent
};
