import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from './i18n/useLocale';
import LocaleAutoRedirect from './i18n/LocaleAutoRedirect';
import Navbar from './components/Navbar';
import SharedFooter from '../../shared/Footer';
import type { FooterDict } from '../../shared/Footer';
import SharedCookieBanner from '../../shared/CookieBanner';
import NewsletterPopup from './components/NewsletterPopup';
import SponsorStrip from '../../shared/SponsorStrip';
import { AD_SLOTS } from './data/partners';
const Home = lazy(() => import('./pages/Home'))
const Restaurants = lazy(() => import('./pages/Restaurants'))
const FineDining = lazy(() => import('./pages/FineDining'))
const About = lazy(() => import('./pages/About'))
const FoodHistory = lazy(() => import('./pages/FoodHistory'))
const LocalFood = lazy(() => import('./pages/LocalFood'))
const MidnightSunDining = lazy(() => import('./pages/MidnightSunDining'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
function useFooterPillarLinks() {
  const { t, i18n } = useTranslation('common');
  const tx = (key: string, fallback: string): string =>
    i18n.exists(`common:${key}`) ? (t(key) as string) : fallback;
  return [
    { name: tx('footer.pillars.restaurants', 'Restaurants'),         href: '/restaurants' },
    { name: tx('footer.pillars.fineDining',  'Fine Dining'),         href: '/fine-dining' },
    { name: tx('footer.pillars.midnightSun', 'Midnight Sun Dining'), href: '/midnight-sun-dining' },
    { name: tx('footer.pillars.foodHistory', 'Food Story'),          href: '/food-history' },
    { name: tx('footer.pillars.localFood',   'Local Food'),          href: '/local-food' },
  ];
}

function useFooterDict(): FooterDict {
  const { t, i18n } = useTranslation('common');
  const tx = (key: string): string | undefined =>
    i18n.exists(`common:${key}`) ? (t(key) as string) : undefined;
  return {
    networkBadge: tx('footer.networkBadge'),
    tagline: tx('footer.tagline'),
    groups: {
      stay:       tx('footer.groups.stay'),
      eatDrink:   tx('footer.groups.eatDrink'),
      do:         tx('footer.groups.do'),
      explore:    tx('footer.groups.explore'),
      essentials: tx('footer.groups.essentials'),
    },
    travelGuideKicker: tx('footer.travelGuideKicker'),
    about: {
      eyebrow: tx('footer.about.eyebrow'),
      body:    tx('footer.about.body'),
      badge:   tx('footer.about.badge'),
    },
    spottedError: {
      title: tx('footer.spottedError.title'),
      body:  tx('footer.spottedError.body'),
      cta:   tx('footer.spottedError.cta'),
    },
    partner: {
      title: tx('footer.partner.title'),
      body:  tx('footer.partner.body'),
      cta:   tx('footer.partner.cta'),
    },
    press: {
      title: tx('footer.press.title'),
      body:  tx('footer.press.body'),
      cta:   tx('footer.press.cta'),
    },
    affiliate: tx('footer.affiliate'),
    copyright: tx('footer.copyright'),
    websiteBy: tx('footer.websiteBy'),
    legal: {
      privacy: tx('footer.legal.privacy'),
      cookie:  tx('footer.legal.cookie'),
      terms:   tx('footer.legal.terms'),
      contact: tx('footer.legal.contact'),
    },
    siteLabels: {
      hotelDeals: tx('footer.siteLabels.hotelDeals'),
      staysCabins: tx('footer.siteLabels.staysCabins'),
      whereToStay: tx('footer.siteLabels.whereToStay'),
      familyFriendly: tx('footer.siteLabels.familyFriendly'),
      localFood: tx('footer.siteLabels.localFood'),
      fineDining: tx('footer.siteLabels.fineDining'),
      barsPubs: tx('footer.siteLabels.barsPubs'),
      activities: tx('footer.siteLabels.activities'),
      huskySafaris: tx('footer.siteLabels.huskySafaris'),
      skiResorts: tx('footer.siteLabels.skiResorts'),
      snowmobileTours: tx('footer.siteLabels.snowmobileTours'),
      spaWellness: tx('footer.siteLabels.spaWellness'),
      nightlife: tx('footer.siteLabels.nightlife'),
      natureParks: tx('footer.siteLabels.natureParks'),
      travelGuide: tx('footer.siteLabels.travelGuide'),
      christmas: tx('footer.siteLabels.christmas'),
      giftsSouvenirs: tx('footer.siteLabels.giftsSouvenirs'),
      travelBlog: tx('footer.siteLabels.travelBlog'),
      dealsOffers: tx('footer.siteLabels.dealsOffers'),
      transport: tx('footer.siteLabels.transport'),
      carRental: tx('footer.siteLabels.carRental'),
      workInLapland: tx('footer.siteLabels.workInLapland'),
    },
  };
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // honour anchor jumps from in-page links
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function LocaleSync() { useLocale(); return null; }

function AppLayout() {
  const { i18n } = useTranslation('common');
  const { locale } = useLocale();
  const pillarLinks = useFooterPillarLinks();
  const dict = useFooterDict();
  return (
    <div className="min-h-screen bg-night text-white">
      <ScrollToTop />
      <LocaleAutoRedirect />
      <LocaleSync />
      <Navbar />
      <main className="pt-16">
        {/* Pääkumppaninauha — sivuston näkyvin mainospaikka, joka sivulla
            heti navin alla. Tyhjänä myyntinauha → LV Media -portaali. */}
        <SponsorStrip
          partner={AD_SLOTS.mainPartner ?? null}
          siteSlug={AD_SLOTS.siteSlug}
          locale={locale}
          showHouseAd
        />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
          {(['', '/fi', '/de', '/ja', '/es', '/br', '/cn', '/kr', '/fr', '/it', '/nl'] as const).flatMap((prefix) => [
            <Route key={`${prefix}/`} path={prefix === '' ? '/' : prefix} element={<Home />} />,
            <Route key={`${prefix}/restaurants`} path={`${prefix}/restaurants`} element={<Restaurants />} />,
            <Route key={`${prefix}/fine-dining`} path={`${prefix}/fine-dining`} element={<FineDining />} />,
            <Route key={`${prefix}/midnight-sun-dining`} path={`${prefix}/midnight-sun-dining`} element={<MidnightSunDining />} />,
            <Route key={`${prefix}/food-history`} path={`${prefix}/food-history`} element={<FoodHistory />} />,
            <Route key={`${prefix}/local-food`} path={`${prefix}/local-food`} element={<LocalFood />} />,
            <Route key={`${prefix}/about`} path={`${prefix}/about`} element={<About />} />,
            <Route key={`${prefix}/privacy`} path={`${prefix}/privacy`} element={<PrivacyPolicy />} />,
            <Route key={`${prefix}/terms`} path={`${prefix}/terms`} element={<Terms />} />,
            <Route key={`${prefix}/cookie-policy`} path={`${prefix}/cookie-policy`} element={<CookiePolicy />} />,
          ])}
        </Routes>
        </Suspense>
      </main>
      <SharedFooter pillarLinks={pillarLinks} dict={dict} />
      <SharedCookieBanner consentKey="laplanddining_cookie_consent" lang={i18n.language} />
      <NewsletterPopup />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
