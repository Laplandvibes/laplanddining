/**
 * Vite-liitännäinen: sovelluksen `react-router-dom`-tuonnit → trailingSlashRouter.tsx.
 * Miksi ja mitä korjataan: ks. trailingSlashRouter.tsx.
 *
 * Käyttö vite.config.ts:ssä:
 *   import { trailingSlashLinks } from './src/shared/router/trailingSlashPlugin';
 *   plugins: [trailingSlashLinks(), react(), …]
 *
 * Ohjausta EI tehdä kahdelle tuojalle: itse korvaajalle (se tarvitsee alkuperäisen
 * paketin) ja node_modules-paketeille (kirjastojen sisäiset tuonnit pysyvät ennallaan).
 *
 * 🔴 Kuusi sivustoa aliasoi `react-router-dom`in `resolve.alias`issa absoluuttiseen
 * polkuun, ja Viten alias ajetaan ENNEN tätä liitännäistä: tuonti saapuu tänne muodossa
 * `…/node_modules/react-router-dom`. Pelkkä nimivertailu ohitti ne hiljaa (18.9.2026).
 */
import type { Plugin } from 'vite';

const norm = (p: string) => p.replace(/\\/g, '/').toLowerCase();
const isRouterDom = (source: string) =>
  source === 'react-router-dom' || norm(source).endsWith('/node_modules/react-router-dom');

export function trailingSlashLinks(): Plugin {
  let shim = '';
  return {
    name: 'lv-trailing-slash-links',
    enforce: 'pre',
    configResolved(config) {
      shim = `${config.root}/src/shared/router/trailingSlashRouter.tsx`;
    },
    resolveId(source, importer) {
      if (!isRouterDom(source) || !importer) return null;
      const from = norm(importer);
      if (from === norm(shim) || from.includes('/node_modules/')) return null;
      return shim;
    },
  };
}
