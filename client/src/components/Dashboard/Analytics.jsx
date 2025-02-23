const Analytics = () => {
  const analyticsData = {
    visits: 1234,
    interactions: 567,
    uploads: 89,
    shares: 45
  };

  return (
    <section className="analytics-section">
      <h2>Analytics Overview</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Visits</h3>
          <p className="analytics-value">{analyticsData.visits}</p>
        </div>
        <div className="analytics-card">
          <h3>Interactions</h3>
          <p className="analytics-value">{analyticsData.interactions}</p>
        </div>
        <div className="analytics-card">
          <h3>Uploads</h3>
          <p className="analytics-value">{analyticsData.uploads}</p>
        </div>
        <div className="analytics-card">
          <h3>Shares</h3>
          <p className="analytics-value">{analyticsData.shares}</p>
        </div>
      </div>
    </section>
  );
};

export default Analytics; 