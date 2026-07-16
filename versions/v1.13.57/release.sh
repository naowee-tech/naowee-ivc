#!/usr/bin/env bash
# =============================================================================
#  release.sh — Naowee IVC Release Automation
# =============================================================================
#  Automates the release process following the Naowee Project versioning pattern.
#
#  Usage:
#    ./release.sh 1.1.0                    # interactive release
#    ./release.sh 1.1.0 --dry-run          # show what would happen, don't commit
#    ./release.sh 1.1.0 --skip-confirm     # auto-confirm all prompts (CI mode)
#    ./release.sh --help
#
#  What it does:
#    1. Pre-flight checks (clean tree, on main branch, gh authenticated)
#    2. Updates version badge in index.html and flujos.html
#    3. Creates ACTA-IVC-vX.Y.Z.md from template if missing
#    4. Verifies CHANGELOG.md has a [ivc-vX.Y.Z] entry
#    5. Stages all changes
#    6. Creates commit: release(ivc-vX.Y.Z): <description>
#    7. Creates annotated tag ivc-vX.Y.Z
#    8. Pushes branch and tag
#    9. Creates GitHub release with notes from CHANGELOG.md
# =============================================================================

set -euo pipefail

# ───── Colors ──────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'
  BLUE=$'\033[34m'; CYAN=$'\033[36m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BLUE=''; CYAN=''; BOLD=''; RESET=''
fi

# ───── Constants ───────────────────────────────────────────────────────────
REPO_OWNER="naowee-tech"
REPO_NAME="naowee-ivc"
REPO_FULL="${REPO_OWNER}/${REPO_NAME}"
MAIN_BRANCH="main"
VERSION_PREFIX="ivc-v"
HTML_FILES=("index.html" "flujos.html")
CHANGELOG_FILE="CHANGELOG.md"
TODAY="$(date +%Y-%m-%d)"

# ───── Flags ───────────────────────────────────────────────────────────────
DRY_RUN=false
SKIP_CONFIRM=false
VERSION_ARG=""

# ───── Helpers ─────────────────────────────────────────────────────────────
info()    { echo "${CYAN}ℹ${RESET}  $*"; }
ok()      { echo "${GREEN}✓${RESET}  $*"; }
warn()    { echo "${YELLOW}⚠${RESET}  $*"; }
err()     { echo "${RED}✗${RESET}  $*" >&2; }
step()    { echo ""; echo "${BOLD}${BLUE}▸ $*${RESET}"; }

usage() {
  cat <<EOF
${BOLD}release.sh${RESET} — Naowee IVC release automation

${BOLD}USAGE${RESET}
    ./release.sh <version> [flags]

${BOLD}EXAMPLES${RESET}
    ./release.sh 1.1.0
    ./release.sh 2.0.0 --dry-run
    ./release.sh 1.1.1 --skip-confirm

${BOLD}FLAGS${RESET}
    --dry-run         Show what would happen without making changes
    --skip-confirm    Auto-confirm all prompts (use in CI)
    -h, --help        Show this help

${BOLD}REQUIREMENTS${RESET}
    • git, gh CLI installed and authenticated
    • Clean working tree (or only the files this script will update)
    • Current branch: ${MAIN_BRANCH}
    • ${CHANGELOG_FILE} must have a [ivc-vX.Y.Z] entry for the target version

${BOLD}NAMING${RESET}
    Versions follow semver with prefix: ${VERSION_PREFIX}MAJOR.MINOR.PATCH
    Pass only the numeric part (e.g., "1.1.0" → tag "${VERSION_PREFIX}1.1.0")
EOF
}

confirm() {
  if [[ "${SKIP_CONFIRM}" == "true" ]]; then
    return 0
  fi
  local prompt="${1:-Continuar?}"
  local response
  read -rp "${YELLOW}?${RESET}  ${prompt} [y/N] " response
  [[ "${response}" =~ ^[yYsS]$ ]]
}

run() {
  if [[ "${DRY_RUN}" == "true" ]]; then
    echo "  ${CYAN}[dry-run]${RESET} $*"
  else
    eval "$@"
  fi
}

# ───── Parse args ──────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --skip-confirm) SKIP_CONFIRM=true; shift ;;
    -*) err "Unknown flag: $1"; usage; exit 1 ;;
    *) VERSION_ARG="$1"; shift ;;
  esac
done

if [[ -z "${VERSION_ARG}" ]]; then
  err "Version required"
  usage
  exit 1
fi

# ───── Validate version ────────────────────────────────────────────────────
if ! [[ "${VERSION_ARG}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  err "Invalid version format: ${VERSION_ARG}"
  err "Expected: MAJOR.MINOR.PATCH (e.g., 1.1.0)"
  exit 1
fi

VERSION="${VERSION_ARG}"
TAG="${VERSION_PREFIX}${VERSION}"
ACTA_FILE="ACTA-IVC-${TAG}.md"

# ───── Banner ──────────────────────────────────────────────────────────────
clear
cat <<EOF
${BOLD}${BLUE}╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║              Naowee IVC · Release Automation                       ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝${RESET}

  ${BOLD}Version:${RESET}    ${TAG}
  ${BOLD}Date:${RESET}       ${TODAY}
  ${BOLD}Repo:${RESET}       ${REPO_FULL}
  ${BOLD}Mode:${RESET}       $(if [[ "${DRY_RUN}" == "true" ]]; then echo "${YELLOW}DRY RUN${RESET}"; else echo "${GREEN}LIVE${RESET}"; fi)

EOF

# ───── Pre-flight: tools ───────────────────────────────────────────────────
step "Pre-flight checks"

for tool in git gh; do
  if ! command -v "${tool}" >/dev/null 2>&1; then
    err "Missing tool: ${tool}"
    exit 1
  fi
done
ok "git and gh are installed"

if ! gh auth status >/dev/null 2>&1; then
  err "gh CLI not authenticated. Run: gh auth login"
  exit 1
fi
ok "gh CLI authenticated"

# ───── Pre-flight: repo state ──────────────────────────────────────────────
if [[ ! -d ".git" ]]; then
  err "Not inside a git repository (no .git folder)"
  exit 1
fi
ok "Inside git repository"

CURRENT_BRANCH="$(git symbolic-ref --short HEAD)"
if [[ "${CURRENT_BRANCH}" != "${MAIN_BRANCH}" ]]; then
  err "Not on ${MAIN_BRANCH} branch (currently on ${CURRENT_BRANCH})"
  exit 1
fi
ok "On ${MAIN_BRANCH} branch"

if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  warn "Working tree has uncommitted changes"
  git status --short
  if ! confirm "Continue anyway? Changes will be included in the release commit"; then
    err "Aborted by user"
    exit 1
  fi
fi
ok "Working tree state acknowledged"

# ───── Pre-flight: tag does not exist ──────────────────────────────────────
if git rev-parse "${TAG}" >/dev/null 2>&1; then
  err "Tag ${TAG} already exists locally"
  exit 1
fi
if git ls-remote --tags origin "refs/tags/${TAG}" | grep -q "${TAG}"; then
  err "Tag ${TAG} already exists on remote"
  exit 1
fi
ok "Tag ${TAG} does not exist yet"

# ───── Pre-flight: CHANGELOG entry ─────────────────────────────────────────
if [[ ! -f "${CHANGELOG_FILE}" ]]; then
  err "${CHANGELOG_FILE} not found"
  exit 1
fi

if ! grep -q "^## \[${TAG}\]" "${CHANGELOG_FILE}"; then
  err "${CHANGELOG_FILE} does not have an entry for [${TAG}]"
  err "Add a section starting with: ## [${TAG}] — ${TODAY}"
  exit 1
fi
ok "${CHANGELOG_FILE} has [${TAG}] entry"

# ───── Extract release description from CHANGELOG ──────────────────────────
RELEASE_DESC=$(awk -v tag="${TAG}" '
  $0 ~ "^## \\[" tag "\\]" { found=1; next }
  found && /^>/ { sub(/^> */, ""); print; exit }
' "${CHANGELOG_FILE}")

if [[ -z "${RELEASE_DESC}" ]]; then
  RELEASE_DESC="Release ${TAG}"
  warn "No blockquote summary found in CHANGELOG. Using default."
fi

info "Release description: ${BOLD}${RELEASE_DESC}${RESET}"

# ───── Step 1: Update version badges in HTMLs ──────────────────────────────
step "Updating version badges in HTMLs"

OLD_TAG_PATTERN='ivc-v[0-9]\+\.[0-9]\+\.[0-9]\+'
for html in "${HTML_FILES[@]}"; do
  if [[ ! -f "${html}" ]]; then
    warn "${html} not found, skipping"
    continue
  fi

  CURRENT_BADGE=$(grep -oE 'ivc-v[0-9]+\.[0-9]+\.[0-9]+' "${html}" | head -1 || echo "")
  if [[ -z "${CURRENT_BADGE}" ]]; then
    warn "No version badge found in ${html}"
    continue
  fi

  if [[ "${CURRENT_BADGE}" == "${TAG}" ]]; then
    ok "${html} already has badge ${TAG}"
    continue
  fi

  info "Updating ${html}: ${CURRENT_BADGE} → ${TAG}"
  if [[ "${DRY_RUN}" == "false" ]]; then
    sed -i.bak "s/${OLD_TAG_PATTERN}/${TAG}/g" "${html}"
    rm -f "${html}.bak"
  fi
  ok "${html} updated"
done

# ───── Step 2: Create ACTA file from template if missing ───────────────────
step "Checking ACTA file"

if [[ -f "${ACTA_FILE}" ]]; then
  ok "${ACTA_FILE} already exists (using as-is)"
else
  warn "${ACTA_FILE} does not exist"
  if confirm "Generate skeleton ${ACTA_FILE} now?"; then
    if [[ "${DRY_RUN}" == "false" ]]; then
      cat > "${ACTA_FILE}" <<EOF_ACTA
# ACTA · Naowee IVC · ${TAG}

> Handoff de la versión ${TAG}.

## Metadata

| Campo | Valor |
|---|---|
| Versión | \`${TAG}\` |
| Fecha | ${TODAY} |
| Head of Product | Doug Vargas |
| Cliente | Ministerio del Deporte |

## Cambios principales

- TODO: completar con los cambios de esta versión

## Bloqueantes activos

- TODO: listar bloqueantes vigentes

## Próximos pasos comprometidos

- TODO: listar próximos pasos

---

**Firma de entrega:** Doug Vargas · Head of Product · ${TODAY} · \`${TAG}\`
EOF_ACTA
    fi
    ok "${ACTA_FILE} skeleton created — complétalo después si quieres más detalle"
  else
    warn "Skipping ACTA creation"
  fi
fi

# ───── Step 3: Stage changes ───────────────────────────────────────────────
step "Staging changes"

run "git add -A"
if [[ "${DRY_RUN}" == "false" ]]; then
  STAGED=$(git diff --cached --name-only)
  if [[ -z "${STAGED}" ]]; then
    warn "No changes to commit"
    if ! confirm "Continue with empty commit (creates tag on current HEAD)?"; then
      err "Aborted by user"
      exit 1
    fi
  else
    info "Files staged:"
    echo "${STAGED}" | sed 's/^/    /'
  fi
fi

# ───── Step 4: Confirm before committing ───────────────────────────────────
step "Summary"

cat <<EOF
  ${BOLD}Tag:${RESET}            ${TAG}
  ${BOLD}Description:${RESET}    ${RELEASE_DESC}
  ${BOLD}Commit format:${RESET}  release(${TAG}): ${RELEASE_DESC}
  ${BOLD}Files updated:${RESET}  ${HTML_FILES[*]}, ${ACTA_FILE} (if new)
  ${BOLD}Will push to:${RESET}   ${REPO_FULL} on ${MAIN_BRANCH}

EOF

if ! confirm "${BOLD}Proceed with release ${TAG}?${RESET}"; then
  err "Aborted by user. No commits or tags created."
  if [[ "${DRY_RUN}" == "false" ]]; then
    warn "Reverting staged changes..."
    git reset >/dev/null
  fi
  exit 1
fi

# ───── Step 5: Commit ──────────────────────────────────────────────────────
step "Creating commit"

COMMIT_MSG="release(${TAG}): ${RELEASE_DESC}

Release notes en CHANGELOG.md
ACTA: ${ACTA_FILE}
Tag: ${TAG}
Fecha: ${TODAY}"

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "  ${CYAN}[dry-run]${RESET} git commit -m \"<formatted message>\""
else
  if git diff --cached --quiet; then
    info "Nothing to commit, creating tag on HEAD"
  else
    git commit -m "${COMMIT_MSG}" >/dev/null
    ok "Commit created"
  fi
fi

# ───── Step 6: Tag ─────────────────────────────────────────────────────────
step "Creating annotated tag"

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "  ${CYAN}[dry-run]${RESET} git tag -a ${TAG} -m \"Release ${TAG}\""
else
  git tag -a "${TAG}" -m "Release ${TAG} · ${RELEASE_DESC} · ${TODAY}"
  ok "Tag ${TAG} created"
fi

# ───── Step 7: Push ────────────────────────────────────────────────────────
step "Pushing to origin"

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "  ${CYAN}[dry-run]${RESET} git push origin ${MAIN_BRANCH}"
  echo "  ${CYAN}[dry-run]${RESET} git push origin ${TAG}"
else
  git push origin "${MAIN_BRANCH}" 2>&1 | grep -v "^$" | sed 's/^/    /'
  git push origin "${TAG}" 2>&1 | grep -v "^$" | sed 's/^/    /'
  ok "Pushed branch and tag"
fi

# ───── Step 8: GitHub Release ──────────────────────────────────────────────
step "Creating GitHub Release"

# Extract notes for this release from CHANGELOG
RELEASE_NOTES=$(awk -v tag="${TAG}" '
  $0 ~ "^## \\[" tag "\\]" { found=1; print; next }
  /^## \[/ && found { exit }
  found { print }
' "${CHANGELOG_FILE}")

if [[ -z "${RELEASE_NOTES}" ]]; then
  RELEASE_NOTES="Release ${TAG}"
fi

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "  ${CYAN}[dry-run]${RESET} gh release create ${TAG} --title \"${TAG} · ${RELEASE_DESC}\" --notes \"<from CHANGELOG>\""
else
  echo "${RELEASE_NOTES}" | gh release create "${TAG}" \
    --repo "${REPO_FULL}" \
    --title "${TAG} · ${RELEASE_DESC}" \
    --notes-file - \
    >/dev/null
  ok "GitHub Release published"
fi

# ───── Done ────────────────────────────────────────────────────────────────
echo ""
echo "${GREEN}${BOLD}╔════════════════════════════════════════════════════════════════════╗${RESET}"
echo "${GREEN}${BOLD}║                                                                    ║${RESET}"
echo "${GREEN}${BOLD}║                    Release ${TAG} completado                       ║${RESET}"
echo "${GREEN}${BOLD}║                                                                    ║${RESET}"
echo "${GREEN}${BOLD}╚════════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

if [[ "${DRY_RUN}" == "false" ]]; then
  cat <<EOF
  ${BOLD}Enlaces:${RESET}
    Repo:     https://github.com/${REPO_FULL}
    Release:  https://github.com/${REPO_FULL}/releases/tag/${TAG}
    Live:     https://${REPO_OWNER}.github.io/${REPO_NAME}/

  ${BOLD}Pages tarda ~1-2 min en deployar el nuevo contenido.${RESET}

EOF
else
  cat <<EOF
  ${YELLOW}This was a DRY RUN. No changes were made.${RESET}
  Run again without --dry-run to execute.

EOF
fi
