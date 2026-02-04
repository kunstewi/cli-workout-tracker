# Workout CLI

A terminal-based workout tracker with an interactive dashboard, progress tracking, and GitHub sync.

## Installation

```bash
# Clone or navigate to the project
cd /Users/kanai/Projects/workout

# Install dependencies
npm install

# Build and link globally
npm run link
```

## Usage

### Interactive Dashboard

```bash
workout
```

Opens an interactive TUI dashboard where you can:
- 📅 View a monthly calendar with color-coded workout status
- 📋 See today's exercises with progress bars
- ⌨️ Navigate using keyboard shortcuts

**Dashboard Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `←/→` | Change day |
| `↑/↓` | Change week |
| `p/n` | Previous/Next month |
| `t` | Go to today |
| `a` | Add exercise progress |
| `g` | Git push |
| `q` | Quit |

### Quick Commands

```bash
# Add to exercise (increments current value)
workout add pushups 20
workout add running 5

# Set exact value
workout set pushups 50

# View today's status
workout status

# List all exercises
workout list

# Configure exercises
workout config-add squats reps 50
workout config-remove squats

# Git commands
workout git-init
workout git-status
workout push
```

## Data Storage

All data is stored in `~/.workout/data.json`:

```json
{
  "exercises": {
    "running": { "unit": "km", "dailyTarget": 10 },
    "pushups": { "unit": "reps", "dailyTarget": 100 }
  },
  "logs": {
    "2026-02-05": {
      "running": 5,
      "pushups": 25
    }
  }
}
```

## GitHub Sync

1. Initialize git in the data directory:
   ```bash
   workout git-init
   ```

2. Create a GitHub repository and add it as remote:
   ```bash
   cd ~/.workout
   git remote add origin https://github.com/yourusername/workout-data.git
   git branch -M main
   git push -u origin main
   ```

3. Push your workout data anytime:
   ```bash
   workout push
   ```

## Default Exercises

The tracker comes with these default exercises:
- 🏃 Running: 10 km/day
- 🧘 Plank: 10 min/day  
- 💪 Pushups: 100 reps/day
- 🏋️ Pullups: 50 reps/day

Customize with `workout config-add` and `workout config-remove`.

## Tech Stack

- **TypeScript** - Type-safe development
- **Ink** - React for CLIs
- **Commander** - CLI argument parsing
- **date-fns** - Date manipulation

## License

MIT
