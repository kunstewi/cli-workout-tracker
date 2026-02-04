import { execSync } from 'child_process';
import { getDataDir, formatDate } from './data.js';

export function initGitRepo(): boolean {
    const dataDir = getDataDir();

    try {
        // Check if already a git repo
        execSync('git rev-parse --git-dir', { cwd: dataDir, stdio: 'pipe' });
        return true;
    } catch {
        // Not a git repo, initialize it
        try {
            execSync('git init', { cwd: dataDir, stdio: 'pipe' });
            return true;
        } catch {
            return false;
        }
    }
}

export function hasRemote(): boolean {
    const dataDir = getDataDir();

    try {
        const result = execSync('git remote -v', { cwd: dataDir, encoding: 'utf-8' });
        return result.includes('origin');
    } catch {
        return false;
    }
}

export function pushToGithub(): { success: boolean; message: string } {
    const dataDir = getDataDir();
    const today = formatDate(new Date());

    try {
        // Initialize if needed
        initGitRepo();

        // Add all files
        execSync('git add .', { cwd: dataDir, stdio: 'pipe' });

        // Check if there are changes to commit
        try {
            execSync('git diff --cached --quiet', { cwd: dataDir, stdio: 'pipe' });
            return { success: true, message: 'No changes to commit' };
        } catch {
            // There are changes, continue with commit
        }

        // Commit
        execSync(`git commit -m "Workout update: ${today}"`, { cwd: dataDir, stdio: 'pipe' });

        // Check if remote exists
        if (!hasRemote()) {
            return {
                success: false,
                message: 'No remote configured. Run: cd ~/.workout && git remote add origin <your-repo-url>'
            };
        }

        // Push
        execSync('git push origin main', { cwd: dataDir, stdio: 'pipe' });

        return { success: true, message: 'Successfully pushed to GitHub!' };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, message: `Push failed: ${errorMessage}` };
    }
}

export function getGitStatus(): string {
    const dataDir = getDataDir();

    try {
        initGitRepo();
        const status = execSync('git status --short', { cwd: dataDir, encoding: 'utf-8' });
        return status || 'Clean - no changes';
    } catch {
        return 'Git not initialized';
    }
}
