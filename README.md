### Preface

This repository demonstrates bad code that was previously used in Taskworld. The ultimate goal of this web is allowing users to delete their account, but before doing so, they must transfer their ownership to another user and do our exit survey. To confirm the account deletion, users need to type their emails, and tick the acknowledgment check-box. After deleting accounts, users will be redirected to `www.example.com`.

You can bring up the web by going to `client` directory, running `npm install` and `npm run serve` respectively, then open http://localhost:1234/ in your browser. You may also [view this project on CodeSandbox.io](https://codesandbox.io/s/github/taskworld/account-deletion-challenge/tree/master/client).

### Specifications

You are logged in as _Ross Lynch_, the owner of the workspace _Lightning strike_.

Initially, the web needs to download the workspace data that belong to you by calling the REST API `fetchWorkspaces`.

Once the web has the workspace data, the web prompts you to transfer your tasks, projects, and admin rights to another person. Note that the ownership transfer operation will actually happen once you finish the email confirmation (the last step).

Moving on, you are forced to do the exit survey. Marking one or multiple answers allow you to proceed to the final step. Your answers and comments will be sent to the REST API `submitSurvey` for further analysis. Note that the request payload must be conform with [SurveyMonkey®](https://developer.surveymonkey.com/api/v3/#collectors-id-responses).

Finally, you need to confirm the account deletion by typing your email, hard-coded as `ross@example.com`, and tick the acknowledgment check-box. After that, calling the REST API `terminateAccount` will tell the server to transfer the ownership that is previously chosen in the first step, delete your account, and the web will redirect you to http://www.example.com.

You can go back and forth through the steps anytime, but the whole process is considered complete only when clicking _Delete my account_ button.

### Instructions

- You are instructed to improve the code mainly in JavaScript files inside `client/src` directory. There are many bugs hidden in the codebase, try to fix as many as you can and refactor the code so it becomes easier to maintain.
- You may amend, move, or delete some of the existing functionality even it breaks the specifications as long as you see fit.
- You may add new functionality in addition to the specifications as you see fit.
- You may rename the files and React components as you see fit.
- **You must** be able to explain the reasons behind your code changes along with its trade-off in a verbal review or a written document.
- **You must** be able to go to `client` directory, run `npm run serve` against your code without any errors, and open http://localhost:1234/ to perform the intended tasks according to the specifications using the original set of the REST APIs.
- **You must** add at least one test case of your choice using black-box testing technique.
- **You must** use Git as a version control.
- You will not be judged by the appearance of the web, which means you may leave `index.css` and every `style={{ ... }}` prop untouched.

### Expectations

You will be judged by the following criteria.
- Functionality is correct with respect to the specifications, while breaking changes are acceptable only if rational.
- Bugs are fixed as many as possible. It should be hard for the reviewers to find a remaining bug.
- Good software engineering principles are followed, for example, [SOLID principles](https://en.wikipedia.org/wiki/SOLID).
- Identifiers are named meaningfully and consistently.
- High coupling code blocks are adjacent to each other.
- Errors are handled and exposed to users beautifully. Any REST API call may randomly take longer than usual or result in an error due to an invalid input or an unknown server error.
- Good choice of data structure is used.
- Consistent indentation and formatting are followed.
- Indirection is minimized as much as possible, while still maintaining flexibility.
- Git commit messages clearly state the reason of the change.
- Over-engineering and under-engineering are avoided.
- Automation testing covers the main functionality of the under-testing components.

**Taskworld expects you to put great effort into your work with the highest attention to detail.**

Taskworld reserves the right, in its sole discretion, to disqualify any candidate that does not comply with any of the above, even before the work is submitted.

By submitting this challenge you agree that any writings or images you submitted may be used by Taskworld.
