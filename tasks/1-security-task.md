Security checklist for this public repository. Local file changes require review and merge before they become active on GitHub.

## Required before merging PR #53

### Repository code

- [x] Use the configured `DOCS_ENV_SECRET` environment secret in the deployment workflow.
- [x] Fail deployment when `DOCS_ENV_SECRET` is missing instead of silently retaining old Cloud Run values.
- [x] Owner-only dispatcher implemented and reviewed:
  - Workflow must run from `dev`.
  - Only `ajoshi31` may dispatch.
  - Feature code is selected using its immutable commit SHA.
  - Manual dispatch must never select production.
- [x] Keep sensitive server configuration and `INTERNAL_ADMIN_SECRET_KEY` out of the Docker build. Only the public site URL may enter as a build argument.
- [x] Keep Google authentication after the Docker build.
- [x] Configure `NEXT_PUBLIC_SITE_URL` as a GitHub environment secret for both `dev` and `prod`, as requested. Its value is still public in the generated browser bundle.
- [x] Pass `NEXT_PUBLIC_SITE_URL=${{ secrets.NEXT_PUBLIC_SITE_URL }}` explicitly as a Docker build argument.
- [x] Declare `ARG NEXT_PUBLIC_SITE_URL` and builder-stage `ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL` in the Dockerfile before `pnpm build`.
- [x] Remove committed `.env.production` and `.env.development`; retain `.env.example` without secrets and ignore environment-specific files.
- [x] Keep server-only configuration in `DOCS_ENV_SECRET` at Cloud Run runtime.
- [x] Keep GitHub Actions pinned to immutable commit SHAs.
- [x] Keep `gha-creds-*.json` excluded from Git and Docker.
- [x] Keep pull-request CI completely secret-free.

Most of these changes are already proposed in PR #53, but they are not active until merged.

## GitHub settings already completed

- [x] Ruleset protects `dev` and `main`.
- [x] Pull requests are required.
- [x] One approval is required.
- [x] Stale approvals are dismissed.
- [x] Latest push approval is required.
- [x] Conversations must be resolved.
- [x] CI must pass.
- [x] Review dismissal is restricted to `ajoshi31`.
- [x] Owner is the only PR bypass actor.
- [x] `dev` environment allows only workflow runs from `dev`.
- [x] `prod` environment allows only workflow runs from `main`.
- [x] Only `ajoshi31` can approve deployments.
- [x] Administrator environment bypass is disabled.
- [x] Default `GITHUB_TOKEN` permission is read-only.
- [x] Actions cannot approve pull requests.
- [x] No repository-level Actions secrets currently exist.

## GitHub settings still to verify

- [x] Confirm no organization-level secret named `DOCS_ENV_SECRET` is granted to this repository.
- [x] Keep developers at Write access—do not grant Maintain or Admin.
- [x] Enable the free GitHub secret scanning and push protection features for this public repository.
- [x] Enable free CodeQL default setup for JavaScript/TypeScript using the standard query suite and weekly scanning.
- [x] Enable free Dependabot security updates.
- [x] Configure free grouped Dependabot security updates for pnpm dependencies and GitHub Actions in `.github/dependabot.yml` (local; active after merge into the default branch). This configuration works independently of the UI grouping toggle.
- [x] Configure free weekly Dependabot version updates for pnpm dependencies and GitHub Actions, grouping minor/patch updates and limiting open version-update PRs to five per ecosystem (local; active after merge into the default branch).
- [ ] Restrict push-protection bypass to `deploy-admins` (currently only `ajoshi31`) using GitHub Settings → Advanced Security → Specific roles or teams. Do not grant an Exempt exemption. Current screenshot permits anyone with Write access; browser access is unavailable for applying this setting.
- [x] Enable free private vulnerability reporting.
- [x] Keep security-alert access restricted to organization/repository administrators, security managers, and `deploy-admins` (only `ajoshi31`), as shown in the latest screenshot. No ordinary developer was granted additional alert access.
- [x] Confirm optional secret-scanning AI detection, generic patterns, validity checks, and delegated alert dismissal are disabled in the latest screenshots. These disabled states do not establish whether a feature is paid.
- [x] Confirm CodeQL and Copilot Autofix suggestions are enabled and available without a paid security/Copilot subscription for this public repository. Agentic Autofix is separate and can incur usage charges; it was not enabled by this task.
- [ ] Review the existing Dependabot alerts; GitHub reported 102 alerts on the default branch.
- [ ] Restrict allowed third-party Actions where supported.
- [ ] Prefer enforcing full commit-SHA pinning for Actions at the organization level.
- [x] Remove unused Azure variables from `dev` and `prod` environments (completed by owner).
- [ ] Ensure dev and production use separate runtime secrets and service accounts.

## Google Cloud security still required

This is the most important remaining security control.

- [x] Require environment `dev` for the dev identity.
- [x] Require environment `prod` for the production identity.
- [x] Use separate dev and production deployment service accounts.
- [ ] Reduce those accounts to confirmed least-privilege Artifact Registry, Cloud Run, and required service-account permissions. Current project-level roles are broader than necessary.
- [ ] Ensure a feature-branch OIDC token is independently rejected by the Google WIF condition, not only by GitHub environment protection.
- [ ] Move `INTERNAL_ADMIN_SECRET_KEY` to Google Secret Manager through Terraform.

## Deferred hardening — not required now

- [ ] Optionally replace the repository-name WIF restriction with the immutable numeric GitHub repository ID. The current exact repository-name condition is sufficient while repository administration remains restricted to trusted administrators.
- [ ] Optionally restrict `job_workflow_ref` to the trusted deployment workflow on `dev` or `main`. The current repository, environment, branch-policy, and owner-approval controls are sufficient for the present deployment model.

## Public-repository limitation

Developers with Write access can always:

- View workflow YAML and logs.
- Edit workflows on feature branches.
- Attempt to run those workflows.

GitHub cannot hide those things in a public repository. The security design must ensure those runs receive no environment secret and no Google Cloud identity.

The immediate blockers before merge are:

1. Review PR #53 carefully.
2. Verify the GCP WIF trust conditions before allowing feature deployment.
