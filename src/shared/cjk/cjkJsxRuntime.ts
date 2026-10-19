/**
 * JSX-ajonaika (tuotanto), johon cjkOtsikotPlugin ohjaa sovelluksen `react/jsx-runtime`-tuonnit.
 * Sama kuin Reactin oma, mutta h1–h6:n CJK-merkkijonolapsiin lisätään <wbr>-fraasirajat (otsikko.ts).
 */
import { Fragment, jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { otsikonPropsit } from './otsikko';

type Args = Parameters<typeof reactJsx>;

export { Fragment };

export function jsx(type: Args[0], props: Args[1], key?: Args[2]) {
  return reactJsx(type, otsikonPropsit(type, props), key);
}

export function jsxs(type: Args[0], props: Args[1], key?: Args[2]) {
  return reactJsxs(type, otsikonPropsit(type, props), key);
}
