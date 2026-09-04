export default function ChartOverview({ data }) {
  if (!data || data.length === 0) return <p className="muted">No chart data available</p>;

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const colors = {
    Scheduled: "#2563eb", // Blue
    Completed: "#10b981", // Green
    Cancelled: "#ef4444"  // Red
  };

  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const heightPercent = Math.max(Math.round((item.count / maxCount) * 100), 8);
          const color = colors[item.status] || "#0284c7";

          return (
            <div key={item.status} className="chart-col">
              <div className="bar-val">{item.count}</div>
              <div className="bar-wrapper">
                <div
                  className="bar-fill"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: color
                  }}
                />
              </div>
              <div className="bar-label">{item.status}</div>
              <div className="bar-sub">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
