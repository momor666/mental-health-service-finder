function mandatorySelectionMessage() {
  return 'You must choose one of the options.';
}

function emptyPostcodeMessage() {
  return 'You must enter a postcode.';
}

function invalidPostcodeMessage(location) {
  return `We can't find the postcode '${location.toUpperCase()}'. Check the postcode is correct and try again.`;
}

function technicalProblems() {
  return 'Sorry, we are experiencing technical problems.';
}

module.exports = {
  emptyPostcodeMessage,
  invalidPostcodeMessage,
  mandatorySelectionMessage,
  technicalProblems,
};
