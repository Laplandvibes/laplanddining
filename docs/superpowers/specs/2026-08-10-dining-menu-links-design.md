# LaplandDining: ruokalistalinkit ravintolakortteihin

**Päivä:** 2026-08-10
**Sivusto:** laplanddining.com (`laplanddining-new/`, branch `canonical-sweep-2026-05-03`)
**Tila:** suunnitelma hyväksytty (Vesa 10.8.), toteutus ei aloitettu

## Ongelma

Ravintolakortin ainoat ulkolinkit ovat `Verkkosivu →` (joka vie ravintolan **etusivulle**) ja
`Kartta →`. Ihminen joka etsii ruokalistaa saa etusivun ja joutuu kaivamaan itse.

Miksi menuja ei ole:

1. Data tulee Google Places API:sta (`scripts/sync-restaurants.mjs`). **Places-rajapinnassa ei ole
   menu-kenttää lainkaan**, joten automaattinen putki ei voi tuottaa sitä. Field mask hakee
   `websiteUri`, `priceLevel` ja `regularOpeningHours`.
2. Toimitukselliselle menudatalle on ollut paikka 3.5.2026 lähtien: `Restaurant.menuHighlights`
   ([restaurants.ts:93](../../../src/data/restaurants.ts)) ja se on override-listalla. **0 ravintolaa
   käyttää sitä eikä yksikään komponentti renderöi sitä.** Kenttä suunniteltiin eikä koskaan täytetty.
3. `hasMenu` puuttuu Restaurant-JSON-LD:stä, vaikka schema.org tukee sitä.

## Rajaus

Tehdään **vain linkki ruokalistaan**. Ei annoksia, ei hintoja, ei menun sisältöä sivustolle.

Perustelu: menun *osoite* on pysyvä ja elää vuosia, menun *sisältö* vaihtuu. Sisällön kopioiminen
omaan dataan tuottaisi vanhentuvia hintoja ruokasivustolle, mikä on sama virhetyyppi kuin verkoston
katteettomat lupaukset joita on jouduttu purkamaan. Linkki ei vanhene samalla tavalla.

Vaiheet 2 ja 3 (pysyvät faktat hintoineen + kumppanien elävä menu) on tietoisesti jätetty
myöhemmäksi. Vaihetta 3 ei kannata rakentaa ennen kuin maksavia kumppaneita on.

## Mittaustulos (10.8.2026)

Ravintoloita on **87**: 81 Maps-synkasta plus 6 käsin kuratoitua gemsiä. Maps-joukosta 80:llä on
verkkosivu, joista 10 on pelkkä Facebook tai Instagram. Kaikilla 6 gemsillä on oma verkkosivu.
Oikeita koeajettavia verkkosivuja on siis **76**, joista koeajo 10.8. kattoi 70 (gemsit vielä
ajamatta).

Koeajo haki etusivun ja etsi menulinkkiehdokkaita:

| | kpl |
|---|---|
| Menu-ehdokas löytyi pelkältä etusivulta | 43 / 70 |
| joista käyttökelpoisia (oma domain, oikea sivu, uniikki URL) | **36** |
| roskaa: kuvatiedosto (hulluporo.fi ×3), vieras domain (`ruokalistasivut.fi`, `order.site`) | 5 |
| sama URL kahdelle ravintolalle, molemmat hylätään automaattisesti: Pizzeria San Milano sai Puistopaviljongin à la carten (sama talo ja domain) | 2 |
| etusivulla ei mitään (menu alasivulla tai JS-navissa) | 23 |
| verkkosivu ei vastaa lainkaan | **4** |

Niistä 36 käyttökelpoisesta **6 on PDF-muotoisia** ja osa kausileimattuja (esim. "Ryhmämenu
kesä-syksy 2026"). Ne julkaistaan, mutta kuukausivahti nostaa ne esiin kun ne katoavat.

Kaksi johtopäätöstä:

- **Automaatti osuu noin puoleen ja erehtyy näyttävästi.** Se tarjosi ruoka-annoksen valokuvaa
  menuksi ja antoi pizzerialle naapuriravintolan à la carten. Sama kuvio kuin 8.8. kuva-auditissa,
  jossa 36 kuvaa läpäisi tekniset portit ja 9 oli logoja. Skripti ei saa julkaista suoraan.
- **Neljä `Verkkosivu →` -linkkiä on tällä hetkellä livenä rikki**: Tori-Kioski Mikkola, Luoston Hovi
  ja CAMP Kitchen Pyhä (404) sekä Niestapaikka (ei vastaa). Korjataan samalla käynnillä.

## Arkkitehtuuri

### 1. Datataso

Uusi `src/data/generated/restaurant-menus.json`. Sama kuvio kuin `restaurant-images.json`: skripti
ehdottaa, ihminen kuittaa, tiedosto committoidaan ja se on ainoa lähde jota sivusto lukee.

**Avaimena `slug`**, kuten kuvarekisterissä. Ei `googlePlaceId`, koska 6 käsin kuratoitua gemsiä
(`restaurant-gems.ts`) kulkee eri polkua kuin Maps-data ja niiden Place ID on tekaistu
(`manual-saariselka-laanilan-kievari`). Slug kattaa molemmat joukot yhdellä avaimella.

```json
{
  "rovaniemi-nili-restaurant": {
    "url": "https://www.nili.fi/ruokalista",
    "kind": "page",
    "title": "Ruokalista – Ravintola Nili",
    "evidence": 14,
    "checkedAt": "2026-08-10"
  },
  "sodankyla-tori-kioski-mikkola-ky": {
    "status": "none",
    "reason": "vain Facebook-sivu, ei omaa verkkosivua",
    "checkedAt": "2026-08-10"
  }
}
```

`status: "none"` -rivit ovat tarkoituksellisia. Niistä näkee että kohta on käyty läpi eikä vain
unohtunut. **87 riviä = 87 tarkistettua ravintolaa**, kattavuus on todistettavissa tiedostosta.

`restaurants.ts` sulauttaa rekisterin sisään samalla tavalla kuin kuvarekisterin. Kortti saa
`r.menuUrl` ja `r.menuKind`. Maps-sync ei koske tähän tiedostoon koskaan.

### 2. Löytöskripti `scripts/discover-menu-links.mjs`

Hakee etusivun **ja yhden navitason syvemmälle**, mikä kattaa suurimman osan niistä 23 tapauksesta
joissa etusivulta ei löytynyt mitään.

Ehdokkaat pisteytetään kotimaisten termien mukaan (`ruokalista`, `meny`, `speisekarte`,
`à la carte`, `annokset`, `lounaslista`) ennen yleistä sanaa `menu`, joka osuu myös navigaatio- ja
evästevimpaimiin.

**Todisteportti.** Tämä erottaa tarkistetun arvatusta. Skripti hakee ehdokassivun ja vaatii todisteen
siitä että kyseessä on oikeasti ruokalista:

- vähintään 3 hintamerkintää sivun tekstissä (`12,50 €`, `€ 24`, `24,00`)
- `<title>` haetaan talteen ja kirjataan tiedostoon
- automaattinen hylkäys: kuvatiedostot (`.jpg/.png/.webp`), vieras domain, sama URL kahdelle eri
  ravintolalle

Pelkkä HTTP 200 ei kelpaa läpäisyksi. Juuri se päästi koeajossa läpi hulluporo.fi:n annoskuvan ja
`ruokalistasivut.fi`:n etusivun.

Skripti tulostaa katselmussivun `scripts/_menu-review.html`: ravintola, ehdokas-URL, sivun otsikko,
hintaosumien määrä, klikattava linkki. Rivit varmimmasta epävarmimpaan.

### 3. Kuittauskierros

Katselmussivu käydään läpi. Vahvat osumat kuittautuvat silmäyksellä, loput katsotaan yksitellen.
**Mikään ei päädy JSON-tiedostoon ilman että ihminen on katsonut sen.** Kuittaamaton rivi jää pois.

### 4. Käyttöliittymä

Yksi jaettu `src/components/MenuLink.tsx`, käytössä kaikilla neljällä korttipinnalla: `/restaurants`,
`/fine-dining`, `CityTopPicksGrid` ja `EditorsPicks`. Yksi komponentti siksi että neljä kopiota
ajautuu erilleen, kuten AppPromon kanssa kävi 28 sivustolla.

- `Ruokalista →` ensimmäisenä linkkirivillä, ennen `Verkkosivu →` -linkkiä
- PDF saa oman merkintänsä `Ruokalista (PDF) →`, koska PDF käyttäytyy mobiilissa eri tavalla ja se on
  rehellistä kertoa etukäteen
- sama amber-tyyli kuin muilla korttilinkeillä, `rel="nofollow noopener"`,
  `withReferral(url, 'dining_menu')`
- ei linkkiä → ei nappia, ei koskaan kuollutta painiketta
- uudet i18n-avaimet `restaurants.menuLabel` ja `restaurants.menuLabelPdf` kaikkiin 12 kieleen,
  ei em-viivoja

### 5. SEO

`hasMenu` lisätään Restaurant-entiteettiin `/restaurants`-sivun ItemList-JSON-LD:hen niille
ravintoloille joilla linkki on. Schema.org tukee kenttää ja tällä hetkellä se puuttuu kokonaan.

### 6. Rikkinäisten verkkosivulinkkien korjaus

Ne 4 kuollutta osoitetta: etsitään oikea, ja jos sitä ei ole, kenttä poistetaan kortilta. Korjaus
menee toimitukselliseen override-tasoon, koska seuraava Maps-sync pyyhkisi generoituun tiedostoon
tehdyn muutoksen. Vaatii pienen muutoksen: `'website'` lisätään `Override`-tyypin `Pick`-listaan
([restaurant-overrides.ts:26](../../../src/data/restaurant-overrides.ts)).

### 7. Mätänemisen esto

`scripts/check-menu-links.mjs` ajaa saman todisteportin jo julkaistuille linkeille ja raportoi mitkä
ovat lakanneet olemasta ruokalistoja. Ajetaan kuukausittain samaan aikaan Maps-syncin kanssa, joka on
jo kuukausirytmissä. URL on pysyvä mutta ei ikuinen.

## Virhetilanteet

| Tilanne | Käsittely |
|---|---|
| Verkkosivu ei vastaa | `status: "none"`, syy kirjataan, verkkosivulinkki korjataan tai poistetaan |
| Vain Facebook-sivu (10 kpl) | `status: "none"`, syy `"vain Facebook-sivu"`. Facebook torjuu botit eikä sinne voi luotettavasti linkata ruokalistaa. Nämä 10 ovat valmis liidilista, sama joukko joka nousi esiin kuvakampanjassa. |
| Menu löytyy mutta on PDF | Julkaistaan, `kind: "pdf"`, käyttöliittymä kertoo sen |
| Menu on kausikohtainen (esim. "kesä-syksy 2026") | Julkaistaan, mutta kuukausivahti nostaa sen esiin kun se katoaa |
| Ehdokas ei läpäise todisteporttia | Ei mene tiedostoon. Käsin etsintä kuittauskierroksella tai `status: "none"` |
| Kaksi ravintolaa samassa talossa jakaa domainin | Ei automaattista kuittausta, aina käsin (San Milano / Puistopaviljonki) |

## Muutettavat tiedostot

**Uudet**
- `src/data/generated/restaurant-menus.json`
- `src/components/MenuLink.tsx`
- `scripts/discover-menu-links.mjs`
- `scripts/check-menu-links.mjs`

**Muutettavat**
- `src/data/restaurants.ts` (rekisterin sulautus, `menuUrl` + `menuKind` tyyppiin)
- `src/data/restaurant-overrides.ts` (`'website'` Pick-listaan + 4 korjausta)
- `src/pages/Restaurants.tsx` (linkki kortille + `hasMenu` JSON-LD:hen)
- `src/pages/FineDining.tsx` (linkki kortille)
- `src/components/CityTopPicksGrid.tsx` (linkki kortille)
- `src/components/EditorsPicks.tsx` (labelit)
- `src/locales/*/pages.json` × 12 kieltä (2 uutta avainta)

## Määritelmä valmiille

1. 87/87 ravintolaa kirjattu `restaurant-menus.json`:iin, joko URL tai `status: "none"` syineen.
   Koneellinen tarkistus (`scripts/verify-menu-registry.mjs`) varmistaa kattavuuden, ei silmämäärä.
2. Jokainen julkaistu URL läpäissyt todisteportin **ja** ihmissilmän
3. 4 rikkinäistä verkkosivulinkkiä korjattu tai poistettu
4. Build vihreä, prerender läpi
5. Deploy tehty ja **livestä tarkistettu**: napit renderöityvät, hrefit osoittavat oikeisiin
   osoitteisiin, `hasMenu` näkyy JSON-LD:ssä. Ei pelkkä deploy-kuittaus.
6. Mobiili 375 px tarkistettu, ei vaakavuotoa uudesta linkistä
7. Muisti + Command Center -detaljisivu päivitetty (LV end-of-task -rituaali)

## Mitä ei tehdä

- Ei menun sisältöä, annoksia eikä hintoja sivustolle (vaihe B, myöhemmin)
- Ei kumppanien elävää menupaneelia (vaihe C, vasta kun kumppaneita on)
- Ei skriptiä joka julkaisee löytönsä suoraan ilman kuittausta
- Ei menulinkkien reititystä affiliate-Workerin kautta, nämä eivät ole affiliate-linkkejä
- Ei muiden verkoston sivustojen koskemista tällä kierroksella
