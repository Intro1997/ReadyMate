const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the path to the CLI file
const cliFile = path.join(__dirname, '..', 'bin', 'readymate.js');

// Check if we're on Windows
const isWindows = os.platform() === 'win32';

if (!isWindows) {
  try {
    // On Unix-like systems, make the file executable
    fs.chmodSync(cliFile, '755');
  } catch (error) {
    console.error('Failed to make CLI file executable:', error);
    process.exit(1);
  }
} 