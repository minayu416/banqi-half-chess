import "../globals.css";

import { useTranslation } from '../i18n/index'
import { languages, fallbackLng } from '../i18n/settings'

// TODO: Metadata
export async function generateMetadata({ params: { lng } }) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng
  const { t } = await useTranslation(lng)
  return {
    // head metadata
    title: t('head.title'),
    description: t('head.description'),
    generator: 'Next.js',
    applicationName: t('head.title'),
    referrer: 'origin-when-cross-origin',
    authors: [{ name: t('head.author') }, { name: t('head.author2'), url: t('head.authorURL') }],
    creator: t('head.author'),
    publisher: t('head.author'),
    // favicon
    icons: {
      icon: "/static/favicon.jpg",
    },
  // OG
  openGraph: {
    title: t('head.title'),
    description: t('head.description'),
    url: t('head.url'),
    siteName: t('head.title'),
    images: [
      {
        url: 'https://banqi-half-chess.vercel.app/static/favicon.jpg', // Must be an absolute URL
        width: 800,
        height: 600,
        alt: 'Banqi Chinese Chess',
      },
    ],
    locale: t('lang'),
    type: 'website',
  },
  // Twitter
  twitter: {
    card: 'summary',
    title: t('head.title'),
    description: t('head.description'),
    creator: t('head.author'),
    images: {
      url: 'https://banqi-half-chess.vercel.app/static/favicon.jpg',
      alt: 'Banqi Chinese Chess',
    }
}
}
}

export default function RootLayout({
  children,
}) {
  return (
    <div>
      {children}
    </div>
  );
}