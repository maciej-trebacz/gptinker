export const getErrorPrompt = (command: string) => `Command "${command}" failed to execute. Give the user up to three options on how to proceed in the 'options' field. Use the following format:
{
  "thought": "Running the tests failed because there is no test runner installed. Please choose one of the following options:",
  "options": [
    "Install Jest and React Testing Library and try again",
    "Install Mocha and try again"
  ]
}`;