# TaskFlow

> Plan it. Track it. **Finish it.**

## Contributors

1. Channy Bennedick Thomas
2. Marvelie Renata Rumondor
3. Fabiola Marcia Walean

## About

TaskFlow is a task management website for teams. We built it to help a group plan work, follow deadlines, and see who is doing what. The site has a glassmorphism design (frosted glass cards over a purple gradient) and supports light and dark mode.

## Pages

| Page | File | What it does |
|------|------|--------------|
| Dashboard | `index.html` | Greeting, project progress, stats, streak, goals, upcoming deadlines |
| Tasks | `tasks.html` | Kanban board with drag and drop, search, and filters |
| Timeline | `timeline.html` | Weekly Gantt-style view per member |
| Calendar | `calendar.html` | Monthly calendar of deadlines |
| Pomodoro | `pomodoro.html` | Focus timer with break modes and session history |
| Analytics | `analytics.html` | Charts, completion rate, and workload per member |
| Members | `members.html` | Team profiles, team chat, and activity log |

All pages are connected through the sidebar menu.

## Features

- Add, edit, and delete tasks with priority, status, dates, and assignees
- Drag cards between Open, In Progress, and Done
- Daily streak that grows when you finish a task or a focus session
- Dark mode toggle
- Responsive layout (the sidebar becomes a drawer on mobile)
- Data is saved in the browser (localStorage), so it stays when you switch pages

## Built With

- HTML, CSS, JavaScript
- [Bootstrap 5](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Poppins](https://fonts.google.com/specimen/Poppins) font (Google Fonts)

## Project Structure

```
TaskFlow/
├── index.html
├── tasks.html
├── timeline.html
├── calendar.html
├── pomodoro.html
├── analytics.html
├── members.html
├── style.css      # shared styles
├── app.js         # shared logic and page rendering
└── README.md
```

## How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/Fabiola701/TaskFlow.git
   ```
2. Open the folder and double-click `index.html`, or use the **Live Server** extension in VS Code.

No installation is needed. An internet connection is required to load Bootstrap and the font.
