const which = require('which');

/**
 * Check if a command exists in the system
 * @param {string} command Command to check
 * @returns {boolean} Whether the command exists
 */
function checkCommand(command) {
  try {
    return !!which.sync(command);
  } catch (error) {
    return false;
  }
}

module.exports = {
  checkCommand
}; 