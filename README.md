# CommitStreak
Try it out! https://commit-streak-two.vercel.app/

CommitStreak is web application acting as a centralized streak tracker. Consistency indicators like daily streaks are easily broken simply due to oversight or 
forgetting to complete the required problems. But using CommitStreak, users can connect the application with their Codeforces, LeetCode and GitHub handles to see
their heatmap and streak at one place. Additionally, the platform allows users to create custom manual tasks with daily, weekly, or monthly frequencies to track personal 
goals. It provides a single ecosystem revealing the streaks on various platforms so there's no need to check all platforms individually.

## Tech Stack

### Frontend
* **Framework:** Next.js
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion

### Backend & Authentication
* **Runtime:** Node.js
* **Framework:** Express.js
* **Authentication:** NextAuth
* **OTP Verification:** Google Apps Script

### Database
* **Database:** MongoDB
* **ODM:** Mongoose

### API Integration
* **Codeforces API:** Fetches daily submissions and codeforces rating and rank.
* **LeetCode GraphQL API:** Retrieves runtime ratings and problem submission data.
* **GitHub API:** Tracks commit histories and public contribution events.

## Features

* **Centralized Dashboard:** View your Codeforces, LeetCode and GitHub activity in a single layout.
* **Aggregated Heatmaps:** Interactive calendar charts showing submission/commit frequency over time.
* **Custom Goal Setting:** Define the specific number of competitive programming problems you target to solve.
* **Flexible Personal Tasks:** Create custom daily, weekly, or monthly manual trackers for your personal goals.
* **Secure OTP Authentication:** Sign in smoothly using email verification powered by Google Apps Script.
