import { register } from 'tsconfig-paths';
import tsConfigFile from '../../../tsconfig.json';

console.log('⚙️  Registrando paths ');

const { baseUrl, paths } = tsConfigFile.compilerOptions; // Either absolute or relative path. If relative it's resolved to current working directory.

register({ baseUrl, paths });

// When path registration is no longer needed
// cleanup();
