import { illustrationNote, type Restaurant, type Locale } from '../data/restaurants';

/**
 * "Kuvituskuva" kortin kuvan alle, kortin kermapohjalle. Ei kuvan päälle.
 *
 * Vesa 9.8.2026: tekoälyn tekemä kuvituskuva merkitään joka kortissa, jotta kortti ei
 * väitä esittävänsä juuri tätä ravintolaa. Vesa 28.9.2026 valitsi paikaksi "kuvan alle
 * kortissa": korttiruudukossa merkintä ei kuulu kuvan päälle (26.9.), mutta tämä
 * merkintä kertoo juuri tästä kortista. Siksi se ei siirry ruudukon alle yhteiseen
 * riviin kuten kuvien lähteet (GridPhotoCredits).
 *
 * Rivi piirtyy JOKAISEEN korttiin, myös tyhjänä: muuten kuvituskortin otsikko olisi
 * rivin verran alempana kuin naapurikortin. Vesa 8.9.: saman ruudukon korteissa on
 * oltava samat osiot samalla korkeudella. 🔴 Tyhjä rivi saa sitovan välilyönnin, jotta
 * korkeus tulee rivikorkeudesta (16 px) + kutsupaikan paddingista kuten tekstillä.
 * min-h-4 ei käy: border-boxissa se sisältää paddingin (tyhjä rivi oli 6–8 px matalampi,
 * mitattu 28.9.), eikä `box-content` toimi, koska sivuston kerrostamaton
 * `* { box-sizing: border-box }` voittaa Tailwindin utilities-kerroksen.
 *
 * Kontrasti: warm-text/80 kermalla #FAF7F2 on 6,0:1 (10 px:n tekstin raja 4,5:1).
 * Sivuston warm-muted olisi samassa paikassa 4,36:1.
 */
export default function IllustrationNote({ r, locale, className = '' }: { r: Restaurant; locale: Locale; className?: string }) {
  const note = illustrationNote(r, locale);
  return (
    <p aria-hidden={note ? undefined : true} className={`text-right text-[10px] leading-4 text-warm-text/80 ${className}`}>
      {note ?? <>&nbsp;</>}
    </p>
  );
}
