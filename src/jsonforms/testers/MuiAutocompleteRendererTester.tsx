import {
  rankWith,
  optionIs,
  scopeEndsWith,
  isOneOfControl,
  and,
  or,
} from '@jsonforms/core';

const MuiAutocompleteRendererTester = rankWith(
  30, // priority will be higher if the number is bigger
  // scopeEndsWith('rating')
  and(
    optionIs('autocomplete', true),
    or(optionIs('multiple', true), optionIs('multiple', false))
    // , isOneOfControl
    // , optionIs('format', 'multiple')
  )
);

export default MuiAutocompleteRendererTester;

