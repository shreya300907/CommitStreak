// A day counts toward the streak only if every active daily task
// that existed on that day was completed.
export function computeDailyStreak(dailyTasks, logsByDate) {
  let streak = 0;
  let date = new Date();

  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    const logsToday = logsByDate[dateStr] || {};

    if (dailyTasks.length === 0) break; // nothing to base a streak on

    const allCompleted = dailyTasks.every(task => logsToday[task._id]?.goalMet);
    if (!allCompleted) break;

    streak++;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}