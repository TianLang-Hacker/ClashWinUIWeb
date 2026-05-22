const BASE_URL = import.meta.env.BASE_URL

export const footerBrand = {
  name: 'ClashWinUI',
  description: 'TianLang Hacker',
}

export const footerSections = [
  {
    title: 'Projects',
    links: [
      {
        label: 'Download',
        href: 'https://github.com/TianLang-Hacker/ClashWinUI/releases/latest',
      },
    ],
  },
  {
    title: 'Legal',
    links: [
      {
        label: 'Privacy Policy',
        href: '#privacy-policy',
      },
    ],
  },
  {
    title: 'Support',
    links: [
      {
        label: 'Documentation',
        href: `${BASE_URL}docs`
      },
      {
        label: 'Github issues',
        href: 'https://github.com/TianLang-Hacker/ClashWinUI/issues',
      },
    ],
  },
  {
    title: 'Social',
    links: [
      {
        label: 'Github',
        href: 'https://github.com/TianLang-Hacker',
      },
    ],
  },
]
