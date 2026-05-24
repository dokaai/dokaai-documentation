import Link from 'next/link';
import { BriefcaseBusiness, Camera, Globe, Play } from 'lucide-react';
import { withBasePath } from '@/lib/shared';

const footerSections = [
  {
    title: 'Services',
    links: [
      { label: 'Notification', href: '/' },
      { label: 'Engagement', href: '/' },
      { label: 'Rewards', href: '/' },
      { label: 'Search', href: '/' },
    ],
  },
  {
    title: 'Industry Solutions',
    links: [
      { label: 'Education', href: '/' },
      { label: 'Retail & E-commerce', href: '/' },
      { label: 'Fintech', href: '/' },
      { label: 'Health care', href: '/' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { label: 'Realtime Messaging', href: '/' },
      { label: 'Omnichannel communication', href: '/' },
      { label: 'Developer flexibility', href: '/' },
      { label: 'Marketing campaigns', href: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'About us', href: '/' },
      { label: 'Integrations', href: '/integration' },
      { label: 'Documentation', href: '/' },
      { label: 'Privacy policy', href: '/' },
      { label: 'Terms of use', href: '/' },
    ],
  },
];

const socialLinks = [
  { label: 'Website', href: 'https://dokaai.com', icon: Globe },
  { label: 'Instagram', href: 'https://instagram.com', icon: Camera },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: BriefcaseBusiness },
  { label: 'YouTube', href: 'https://youtube.com', icon: Play },
];

export function DocsFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1440px] bg-[#fafafa]">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))]">
        <div className="max-w-[240px]">
          <Link href="/" className="inline-flex items-center gap-3">
            <img
              src={withBasePath('/dokkai-logo.svg')}
              alt="Dokaai"
              className="h-8 w-auto shrink-0"
            />
            <span className="text-lg font-semibold tracking-[0.18em] text-fd-primary">DOKAAI</span>
          </Link>
          <p className="mt-5 text-sm leading-8 text-fd-foreground/80">
            The comprehensive notification platform tailored for developers
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.04em] text-fd-foreground">
              {section.title}
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-fd-muted-foreground">
              {section.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-fd-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-5 border-t border-black/8 pt-6 text-sm text-fd-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Copyright © 2024 Swift. All rights reserved</p>
        <div className="flex items-center gap-3">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={item.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fd-foreground text-white transition-opacity hover:opacity-85"
              >
                <Icon className="size-3.5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
