import type { ComponentProps } from 'react';
import SharedFooter from '../shared/Footer';
import JobNetworkBanner from '../shared/JobNetworkBanner';

/**
 * Maksetun Network-tason ilmoituskortti tämän sivuston footerin yläpuolella
 * (10.9.2026, Vesa: "kytke banner").
 *
 * 🔴 Footerin sisältöä EI kosketa: alkuperäinen komponentti on yhä SharedFooter ja
 * tämä kääre vain renderöi bannerin sen eteen.
 *
 * 🔴 Kääre asuu sivuston omassa koodissa, EI vendoroidussa src/shared/Footer.tsx:ssä
 * (siirretty sieltä 24.9.2026): jaettu footer on tavu tavulta sama kaikilla
 * sivustoilla, eikä siihen voi kirjoittaa sivustokohtaista siteId:tä. Samalla
 * tavalla kytkevät bannerin 12 muuta sivustoa (src/components/Footer.tsx).
 *
 * Banneri palauttaa null kun tämän sivuston nimeä ei ole ostettu yhteenkään
 * ilmoitukseen, joten näkyvä muutos on nolla ennen ensimmäistä Network-kauppaa.
 */
export default function FooterWithNetworkJobs(props: ComponentProps<typeof SharedFooter>) {
  return (
    <>
      <JobNetworkBanner siteId="laplanddining" />
      <SharedFooter {...props} />
    </>
  );
}
