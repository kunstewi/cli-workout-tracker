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
wout
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
| `w` | Open weekly timetable |
| `g` | Git push |
| `q` | Quit |

### Quick Commands

```bash
# Add to exercise (increments current value)
wout add pushups 20
wout add running 5

# Set exact value
wout set pushups 50

# View today's status
wout status

# List all exercises
wout list

# Configure exercises
wout config-add squats reps 50
wout config-remove squats

# Git commands
wout git-init
wout git-status
wout push
```

### Weekly Timetable

Manage your weekly workout schedule (Monday - Saturday):

```bash
# Add workout to a specific day
wout weekly-add monday pushups 100
wout weekly-add wednesday running 5

# Remove workout from a day
wout weekly-remove monday pushups

# List all weekly workouts
wout weekly-list

# List workouts for a specific day
wout weekly-list monday

# Clear a specific day's schedule
wout weekly-clear monday

# Clear entire weekly timetable
wout weekly-clear
```

**Weekly Timetable in Dashboard:**
- Press `w` in the dashboard to open the weekly timetable editor
- Use `←/→` to switch between days
- Use `↑/↓` to select workouts
- Press `a` to add a new workout
- Press `e` to edit selected workout
- Press `d` to delete selected workout
- Press `q` to return to dashboard

The weekly timetable shows which exercises are scheduled for each day. On the dashboard, scheduled exercises are marked with a 📅 icon.

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
  },
  "weeklyTemplate": {
    "monday": [
      { "exerciseName": "pushups", "reps": 100 },
      { "exerciseName": "running", "reps": 5 }
    ],
    "tuesday": [
      { "exerciseName": "pullups", "reps": 50 }
    ],
    "wednesday": [],
    "thursday": [],
    "friday": [],
    "saturday": []
  }
}
```

## GitHub Sync

1. Initialize git in the data directory:
   ```bash
   wout git-init
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
   wout push
   ```

## Default Exercises

The tracker comes with these default exercises:
- 🏃 Running: 10 km/day
- 🧘 Plank: 10 min/day  
- 💪 Pushups: 100 reps/day
- 🏋️ Pullups: 50 reps/day

Customize with `wout config-add` and `wout config-remove`.

## Tech Stack

- **TypeScript** - Type-safe development
- **Ink** - React for CLIs
- **Commander** - CLI argument parsing
- **date-fns** - Date manipulation

## License

MIT
