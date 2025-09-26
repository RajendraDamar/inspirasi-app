## Security Incident Response (brief)

1. If secret scanning alerts are raised, pause feature work.
2. Collect alert metadata (secret type, file path, commit SHA(s), detection time) — do not paste secret values.
3. Rotate affected credentials immediately (Firebase/EAS/GitHub/Google APIs).
4. Purge secrets from git history using `git filter-repo` and force-push, then re-enable branch protections.
5. Document the rotation and notify maintainers; require all collaborators to rebase.
