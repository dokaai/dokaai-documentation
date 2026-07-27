import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig, withBasePath } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center">
          <img
            src={withBasePath('/logos/logo-primary.svg')}
            alt="Dokaai"
            className="h-8 w-auto max-w-[150px] shrink-0"
          />
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    themeSwitch: {
      enabled: false,
    },
  };
}
