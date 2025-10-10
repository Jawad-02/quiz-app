
The aim of this project is to develop an interactive test application that allows users to receive instant feedback by answering multiple-choice questions and calculates their score. Questions are managed via data.js, separated from the interface, with a state-based flow established using React. Correct/incorrect checks are performed for each selection, and the results are displayed on the screen. At the end of the test, the total score is shown; the user can start a new attempt by clicking ‘Reset’.

In my Quiz App project, I first defined the questions and answer choices in JSON format in the data.js file. Then, I created the Quiz.jsx file and added states that manage the active question, score, and whether the test is complete using the useState hook. I wrote the handleAnswer function, which performs a correct-incorrect check and moves to the next question each time the user selects an answer choice. Finally, I called the Quiz component in the App.jsx file to display the application on the screen. This way, I developed a quiz application that works dynamically and shows the user their results.





# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
