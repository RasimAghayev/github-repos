# github-repos

A tiny static GitHub Pages site that lists the owner's public repositories,
fetched client-side from the GitHub REST API. Two commits total
(`GitHub Repository Showcase`, `Create static.yml`).

## Architecture style

Plain static site — `index.html` + `style.css` + `script.js`, no build
step, no framework, no dependencies (no `package.json` at all).
`script.js` calls the public, unauthenticated GitHub REST API
(`https://api.github.com/users/RasimAghayev/repos`) directly from the
browser and renders a card per repo (name, description, link).

## Running it

Just open `index.html` in a browser — no install step, nothing to build.

## Deployment

[`.github/workflows/static.yml`](.github/workflows/static.yml) deploys the
repo as-is to GitHub Pages on every push to `master`, live at
<https://rasimaghayev.github.io/github-repos/>. Verified via the GitHub
API: Pages reports `status: "built"`, source branch `master`. `gh run
list` shows zero runs for this workflow — most likely the same cause as
seen elsewhere in this portfolio (`master`'s real last commit is
2024-06-21, well past GitHub Actions' ~90-day default log retention);
not independently confirmed beyond that.

## Disclosed findings (documentation pass only — no source changed)

- **Silently shows at most 30 of 54 public repos.** `script.js` calls
  `fetch(\`https://api.github.com/users/${username}/repos\`)` with no
  `per_page` or pagination handling. Verified live: an unauthenticated
  call to that exact endpoint for `RasimAghayev` returns 30 items
  (GitHub's default page size), while a paginated, authenticated count
  (`gh api users/RasimAghayev/repos?per_page=100 --paginate`) shows 54
  public repos — so roughly 24 of them (44%) never render, with no
  indication to the visitor that anything is missing.
- **No error UI on fetch failure.** The `catch` block only
  `console.error`s. If the request fails or is rate-limited (GitHub's
  unauthenticated limit is 60 requests/hour per IP, shared across every
  visitor to this Pages site), `#repo-container` stays blank with no
  message shown to the visitor.
- **No repo metadata beyond name/description/link** — no language,
  stars, or last-updated date, and no visual distinction between repos.
- **Same misleading-push-date pattern as the rest of this portfolio:**
  GitHub reports this repo pushed `2026-06-20T15:51:51Z`, but `master`'s
  real (and only substantive) last commit is `2024-06-21`. Checked all 4
  remote branches individually via `git merge-base --is-ancestor` — none
  merged, all 4 are open Renovate PRs bumping the four GitHub Actions
  used by the Pages workflow (`checkout`, `configure-pages`,
  `upload-pages-artifact`, `deploy-pages`). `renovate/actions-checkout-7.x`'s
  own commit timestamp (`2026-06-20T15:51:41Z`) matches GitHub's reported
  push date to within 10 seconds, confirming that unmerged branch — not
  `master` — is what the push-date banner reflects.
- **No dependency audit or Docker verification applies here** — confirmed
  by inspection, not assumed from the repo being small: no lockfile
  (`package.json` doesn't exist), no `Dockerfile`/`docker-compose.yml`
  anywhere in the tree.
- 4 open PRs (all Renovate, the four Actions bumps above), 3
  closed/autoclosed superseded ones, 0 human-authored PRs.
