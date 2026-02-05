# Workout CLI - All Commands

## Dashboard
- `wout` - Open interactive workout dashboard (default command)
- `wout dashboard` - Open interactive workout dashboard

## Daily Workout Commands
- `wout add <exercise> <amount>` - Add to today's exercise progress (increments current value)
- `wout set <exercise> <amount>` - Set exact value for today's exercise
- `wout status` - Show today's workout status with progress bars
- `wout list` - List all configured exercises with daily targets

## Exercise Configuration
- `wout config-add <name> <unit> <dailyTarget>` - Add a new exercise to your configuration
- `wout config-remove <name>` - Remove an exercise from your configuration

## Weekly Timetable
- `wout weekly-add <day> <exercise> <reps>` - Add workout to a specific day's schedule
- `wout weekly-remove <day> <exercise>` - Remove workout from a specific day's schedule
- `wout weekly-list` - List entire weekly timetable (all days)
- `wout weekly-list <day>` - List workouts for a specific day
- `wout weekly-clear` - Clear entire weekly timetable (all days)
- `wout weekly-clear <day>` - Clear a specific day's schedule

## Git Integration
- `wout git-init` - Initialize git repository in data directory (~/.workout)
- `wout git-status` - Show git status of workout data
- `wout push` - Push workout data to GitHub (commit and push)

## Help & Info
- `wout help` - Display all available commands
- `wout --version` - Show version number
- `wout help <command>` - Display help for a specific command

## Dashboard Keyboard Shortcuts
- `←/→` - Navigate day by day
- `↑/↓` - Navigate week by week
- `p/n` - Previous/Next month
- `t` - Jump to today
- `a` - Add exercise progress
- `w` - Open weekly timetable editor
- `g` - Git push
- `q` - Quit dashboard

## Weekly Timetable Editor Shortcuts (Press 'w' in dashboard)
- `←/→` - Switch between days
- `↑/↓` - Select workout in list
- `a` - Add new workout
- `e` - Edit selected workout
- `d` - Delete selected workout
- `q` - Back to dashboard
- `Tab` - Switch input field (when adding/editing)
- `Enter` - Submit form (when adding/editing)
- `Esc` - Cancel form (when adding/editing)

## Valid Days for Weekly Commands
- `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`

## Examples
```bash
# Daily workout
wout add pushups 20
wout set running 5
wout status

# Configure exercises
wout config-add squats reps 50
wout list

# Weekly planning
wout weekly-add monday pushups 100
wout weekly-add wednesday running 5
wout weekly-list

# Git sync
wout git-init
wout push
```
