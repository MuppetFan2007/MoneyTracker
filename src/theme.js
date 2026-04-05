import { buildTheme as buildBaseTheme } from './themes/base';
import { racingMiku } from './themes/racingMiku';
import { nier }       from './themes/nier';
import { bunny }      from './themes/bunny';

export function buildTheme(themeId) {
  switch (themeId) {
    case 'racing-miku': return racingMiku;
    case 'nier':        return nier;
    case 'bunny':       return bunny;
    case 'light':       return buildBaseTheme('light');
    default:            return buildBaseTheme('dark');
  }
}
