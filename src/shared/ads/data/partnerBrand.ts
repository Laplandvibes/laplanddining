// GENEROITU — node scripts/partner_logos.mjs. Logot Adtractionin ohjelmatiedoista
// (kumppanin oma tiedosto) tai kaupan omalta sivulta; aksentti mitattu logosta.
// null = logo on mustavalkoinen ⇒ rivi käyttää mustetta, ei keksittyä sävyä.
export interface PartnerBrand {
  logo: string
  logoW: number
  logoH: number
  accent: string | null
  accentDark: string | null
}
const partnerBrand: Record<string, PartnerBrand> = {
  "addnature": {
    "logo": "/images/partners/addnature/logo.png",
    "logoW": 480,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "finlayson": {
    "logo": "/images/partners/finlayson/logo.png",
    "logoW": 295,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "halti": {
    "logo": "/images/partners/halti/logo.png",
    "logoW": 307,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "icebug": {
    "logo": "/images/partners/icebug/logo.png",
    "logoW": 90,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "ivalo": {
    "logo": "/images/partners/ivalo/logo.png",
    "logoW": 587,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "jollyroom": {
    "logo": "/images/partners/jollyroom/logo.png",
    "logoW": 411,
    "logoH": 88,
    "accent": "#bf3a71",
    "accentDark": "#e24585"
  },
  "makia": {
    "logo": "/images/partners/makia/logo.png",
    "logoW": 560,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "metsola": {
    "logo": "/images/partners/metsola/logo.png",
    "logoW": 473,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "nanso": {
    "logo": "/images/partners/nanso/logo.png",
    "logoW": 409,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "nordicnest": {
    "logo": "/images/partners/nordicnest/logo.png",
    "logoW": 210,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "northoutdoor": {
    "logo": "/images/partners/northoutdoor/logo.png",
    "logoW": 616,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "onnipyora": {
    "logo": "/images/partners/onnipyora/logo.png",
    "logoW": 465,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "polarnopyret": {
    "logo": "/images/partners/polarnopyret/logo.png",
    "logoW": 1071,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "scandinavianoutdoor": {
    "logo": "/images/partners/scandinavianoutdoor/logo.png",
    "logoW": 314,
    "logoH": 88,
    "accent": "#771138",
    "accentDark": "#f04283"
  },
  "silvantimanttikorut": {
    "logo": "/images/partners/silvantimanttikorut/logo.png",
    "logoW": 108,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "smartphoto": {
    "logo": "/images/partners/smartphoto/logo.png",
    "logoW": 385,
    "logoH": 88,
    "accent": "#1278a0",
    "accentDark": "#179acd"
  },
  "sukkamestarit": {
    "logo": "/images/partners/sukkamestarit/logo.png",
    "logoW": 500,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "svala": {
    "logo": "/images/partners/svala/logo.png",
    "logoW": 204,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "suomikauppa": {
    "logo": "/images/partners/suomikauppa/logo.png",
    "logoW": 381,
    "logoH": 88,
    "accent": "#1c409a",
    "accentDark": "#4a83ff"
  },
  "nordicbuddies": {
    "logo": "/images/partners/nordicbuddies/logo.png",
    "logoW": 400,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  },
  "kalevala": {
    "logo": "/images/partners/kalevala/logo.png",
    "logoW": 982,
    "logoH": 88,
    "accent": null,
    "accentDark": null
  }
}

export default partnerBrand
