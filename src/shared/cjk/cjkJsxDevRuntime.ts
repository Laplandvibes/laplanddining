/**
 * JSX-ajonaika (kehityspalvelin), johon cjkOtsikotPlugin ohjaa sovelluksen `react/jsx-dev-runtime`-tuonnit.
 * Sama muutos kuin cjkJsxRuntime.ts:ssä, jotta `npm run dev` näyttää otsikot kuten tuotanto.
 */
import { Fragment, jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { otsikonPropsit } from './otsikko';

type Args = Parameters<typeof reactJsxDEV>;

export { Fragment };

export function jsxDEV(type: Args[0], props: Args[1], key: Args[2], isStatic: Args[3], source?: Args[4], self?: Args[5]) {
  return reactJsxDEV(type, otsikonPropsit(type, props), key, isStatic, source, self);
}
