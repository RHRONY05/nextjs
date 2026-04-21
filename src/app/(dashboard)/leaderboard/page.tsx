export default function LeaderboardPage() {
  return (
    <>

    <header className="page-header">
      <div>
        <h1 className="page-header__title">Leaderboard</h1>
        <p className="page-header__sub">See how you rank against other AlgoBoard users</p>
      </div>
    </header>

    <div className="cs-wrap">

      {/**/}
      <div className="cs-preview">
        {/**/}
        <div className="lb-filters">
          <button className="lb-filter-btn active">Global</button>
          <button className="lb-filter-btn">Friends</button>
          <button className="lb-filter-btn">Country</button>
          <button className="lb-filter-btn">University</button>
          <div className="lb-filter-spacer"></div>
          <input className="lb-search" placeholder="Search handle…" />
        </div>

        {/**/}
        <div className="lb-table-wrap">
          <table className="lb-table">
            <thead>
              <tr>
                <th style={{ width: "52px" }}>#</th>
                <th>User</th>
                <th>Rating</th>
                <th>Max Rating</th>
                <th>Problems Solved</th>
                <th>Contests</th>
                <th>7-Day Δ</th>
              </tr>
            </thead>
            <tbody id="lb-body"></tbody>
          </table>
        </div>
      </div>

      {/**/}
      <div className="cs-overlay">
        <div className="cs-overlay__icon">🏆</div>
        <span className="cs-overlay__label">Coming Soon</span>
        <h2 className="cs-overlay__title">Leaderboard is on the way</h2>
        <p className="cs-overlay__sub">Compete with friends, country-mates, and the global AlgoBoard community — ranked by improvement, not just raw rating.</p>

        <div className="cs-features">
          <div className="cs-feature">
            <div className="cs-feature__icon">🌍</div>
            <div className="cs-feature__label">Global Rank</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">👥</div>
            <div className="cs-feature__label">Friend League</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">📈</div>
            <div className="cs-feature__label">Weekly Δ Score</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">🎓</div>
            <div className="cs-feature__label">University Board</div>
          </div>
        </div>

        <div className="cs-notify-row">
          <input className="cs-notify-input" type="email" placeholder="Get notified at your email…" />
          <button className="cs-notify-btn" >Notify Me</button>
        </div>
      </div>
    </div>
  
    </>
  );
}
