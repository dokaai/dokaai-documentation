# Task 2: Triage Dependabot alerts and update PRs

## Merge policy

- [ ] Keep Dependabot merges manual for now. Every dependency PR must receive owner approval and pass the required checks before merge.
- [ ] Do not bypass or disable CI for Dependabot. Run `pnpm lint`, `pnpm types:check`, and `pnpm build` for dependency changes.
- [ ] Do not automatically merge major upgrades or changes to deployment GitHub Actions. Review their release notes and validate the affected workflow separately because the normal PR build does not exercise a real deployment.
- [ ] Reconsider automatic merging only for low-risk patch updates after the current backlog is cleared. If enabled later, restrict it to patch updates with all required checks passing; keep security-sensitive, major, and deployment updates under manual review.

## Current backlog

- [ ] Review open [Dependabot alerts](https://github.com/dokaai/dokaai-documentation/security/dependabot) and group them by dependency and severity.
- [ ] Fix Critical and High alerts first, beginning with the Next.js/Sharp security update, followed by the PostCSS security update.
- [ ] Allow Dependabot to rebase or recreate conflicting security PRs before review; do not merge a conflicted or stale dependency PR.
- [ ] Merge security fixes before overlapping routine version updates, then rebase or close any routine PRs made obsolete by those fixes.
- [ ] Review patch and grouped minor updates after the security fixes.
- [ ] Review each major GitHub Actions upgrade independently and verify deployment behavior before merge.
- [ ] Document remaining alerts and any upgrades requiring separate work.
- [ ] Prepare dependency changes as separate PRs for owner review.

## Noise control follow-up

- [ ] After the initial backlog is cleared, review the Dependabot schedule and open-PR limits so routine updates arrive in smaller batches while security updates remain enabled.
