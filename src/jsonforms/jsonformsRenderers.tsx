import { materialRenderers } from '@jsonforms/material-renderers';
import MuiAutocompleteControl from './controls/MuiAutocompleteControl';
import MuiAutocompleteRendererTester from './testers/MuiAutocompleteRendererTester';


const jsonformsRenderers = [
  ...materialRenderers,
  { tester: MuiAutocompleteRendererTester, renderer: MuiAutocompleteControl },
];

export default jsonformsRenderers;
