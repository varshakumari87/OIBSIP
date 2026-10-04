# To-Do App

A responsive to-do list app with a soft pink glassmorphism design, built as part of the **Oasis Infobyte Web Development Internship (Level 2)**.

## Features
- Add tasks with the button or the Enter key
- Mark tasks as complete or incomplete
- Edit tasks (Enter to save, Escape to cancel)
- Delete tasks
- Filter by All, Active and Completed
- Live counter of remaining tasks
- Clear all completed tasks in one click
- Tasks are saved in the browser with `localStorage`, so they stay after a refresh
- Empty-state messages and smooth animations
- Responsive layout for desktop and mobile

## Technologies Used
- HTML5
- CSS3 (Flexbox, CSS variables, glassmorphism with `backdrop-filter`, animations)
- JavaScript (DOM manipulation, event delegation, `localStorage`, `JSON`)

## Project Structure
```
WebDev-L2-TodoApp/
├── screenshots/
│   ├── desktop.png
│   └── mobile.png
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run
1. Clone the repository:
   `git clone https://github.com/varshakumari87/OIBSIP.git`
2. Open the `WebDev-L2-TodoApp` folder
3. Open `index.html` in any browser (or use the Live Server extension in VS Code)

## How It Works
- Tasks are stored in an array of objects (`id`, `text`, `completed`).
- Every action updates the array, saves it to `localStorage`, and re-renders the list.
- A single click listener on the list handles all task buttons (event delegation).
- Task text is inserted with `textContent`, so typed HTML is never executed.

## Screenshots

### Desktop View
![Desktop View](screenshots/desktop.png)

### Mobile View
![Mobile View](screenshots/mobile.png)

## Credits
- Font: Quicksand, via Google Fonts

## Author
**Varsha Kumari**
Web Development Intern, Oasis Infobyte