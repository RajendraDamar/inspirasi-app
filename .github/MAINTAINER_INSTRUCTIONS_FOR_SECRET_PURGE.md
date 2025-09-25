# Maintainer Instructions: Purge Exposed Firebase API Key from Repository History

DO NOT RUN THESE STEPS UNLESS YOU ARE A MAINTAINER WITH THE NECESSARY CREDENTIALS.
This file contains the exact commands and a safety checklist for purging secrets using git-filter-repo.

1) Verify you have backups and coordinated downtime

   git branch backup-before-purge
   git bundle create repo-backup.bundle --all

2) Install git-filter-repo (Python)

   pip install --user git-filter-repo

3) Create replacement rule file

   echo 'regex:AIzaSyDsoaDNqf58PDadXLQFBP1YGbX5LbAWWNA==>REDACTED_FIREBASE_API_KEY' > secret-replace.txt

4) Run git-filter-repo to rewrite history (this modifies all refs)

   git filter-repo --replace-text secret-replace.txt

5) Remove the replacement file

   rm secret-replace.txt

6) Force push rewritten history to remote (ALL collaborators must re-clone)

   git push --force --all
   git push --force --tags

7) Notify collaborators and rotate credentials

   echo "⚠️ Git history rewritten - all collaborators must re-clone"

8) Post-purge verification commands (should return nothing)

   git log --all --full-history -- "*" | grep -i "AIzaSyDsoaDNqf58PDadXLQFBP1YGbX5LbAWWNA" || echo "✅ Secret purged from history"
   grep -r "AIzaSyDsoaDNqf58PDadXLQFBP1YGbX5LbAWWNA" . || echo "✅ Secret removed from working tree"

9) Update documentation and create a security PR comment (already prepared in .github/PR_COMMENT.md)

10) Important notes and rollback plan

   - All collaborators must re-clone the repository after force-push.
   - If anything goes wrong, restore from the backup bundle:
       git clone repo-backup.bundle repo-restore
   - Ensure the new Firebase API key is created and restricted in the Firebase Console before updating any public CI/CD variables.

-- End of instructions --
