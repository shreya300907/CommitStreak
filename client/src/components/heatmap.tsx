export default function Heatmap({ data, weeks = 52 }) {
  const gridWeeks = [];
  const today = new Date();
  for (let w = weeks - 1; w >= 0; w--) {
    const days = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + d));
      const dateStr = date.toISOString().split('T')[0];
      days.push({ date: dateStr, active: !!data[dateStr] });
    }
    gridWeeks.push(days);
  }

  return (
    <div className="flex gap-1 overflow-x-auto">
      {gridWeeks.map((week, i) => (
        <div key={i} className="flex flex-col gap-1">
          {week.map(day => (
            <div
              key={day.date}
              title={day.date}
              className={`w-3 h-3 rounded-sm ${day.active ? 'bg-[#00a572]' : 'bg-primary-text/15'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}