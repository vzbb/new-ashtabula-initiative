#!/usr/bin/env bash
# Wire the canonical .agents/skills protocols into Claude Code skill discovery.
#
# Additive and idempotent: creates two symlinks and nothing else. Never edits,
# moves, stages, or deletes existing repository content. Run from the repository
# root.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if [[ ! -d .agents/skills ]]; then
  echo "error: .agents/skills not found in $repo_root" >&2
  echo "       run this from the repository root that holds the canonical skills" >&2
  exit 1
fi

mkdir -p .claude/skills

for skill in nai-mvp-orchestrator nai-mvp-worker; do
  src=".agents/skills/$skill"
  dest=".claude/skills/$skill"

  if [[ ! -d "$src" ]]; then
    echo "skip  $skill (missing $src)"
    continue
  fi

  if [[ -L "$dest" ]]; then
    echo "ok    $dest -> $(readlink "$dest")"
    continue
  fi

  if [[ -e "$dest" ]]; then
    echo "leave $dest (exists and is not a symlink; not touching it)" >&2
    continue
  fi

  ln -s "../../$src" "$dest"
  echo "link  $dest -> ../../$src"
done

echo
echo "Claude Code skills:"
ls -1 .claude/skills
echo
echo "Next: start Claude Code in $repo_root and run /nai-bootstrap"
