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
    <div className="w-full overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_95%,rgba(0,0,0,0)_100%)]">
      <div className="flex gap-1 min-w-max pb-2">
        {gridWeeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map(day => (
              <div
                key={day.date}
                title={day.date}
                className={`w-[10px] h-[10px] sm:w-3 sm:h-3 rounded-sm shrink-0 transition-colors ${day.active ? 'bg-[#00a572]' : 'bg-primary-text/15'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}