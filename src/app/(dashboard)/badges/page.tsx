export default function BadgesPage() {
  return (
    <>


    {/**/}
    <header className="badges-header">
      <div>
        <h1 className="badges-header__title">Badges &amp; Profile</h1>
        <p className="badges-header__sub">Track your XP, streak, and achievements</p>
      </div>
    </header>

    {/**/}
    <div className="badges-content">

      {/**/}
      <div className="level-card" id="level-card">

        {/**/}
        <div className="level-badge">
          <div className="level-badge__icon" id="badge-icon">⚡</div>
          <div className="level-badge__name" id="badge-level-name">Problem<br />Solver</div>
        </div>

        {/**/}
        <div className="level-xp">
          <div className="level-xp__level" id="level-name">Problem Solver</div>
          <div className="level-xp__label">
            <strong id="xp-value">24,500</strong> XP &nbsp;·&nbsp; Next: <strong id="next-level-name">Algorithm Adept</strong>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" id="xp-bar" style={{ width: "0%" }}></div>
          </div>
          <div className="level-xp__next">
            <span><strong id="xp-remaining">10,500</strong> XP to next level</span>
            <span id="xp-range-label">5,000 → 35,000</span>
          </div>
        </div>

        {/**/}
        <div className="level-streak">
          <div className="streak-main">
            <span className="streak-main__icon">🔥</span>
            <span id="streak-count">5</span>
          </div>
          <div className="streak-label">
            Day streak &nbsp;·&nbsp; Longest: <strong id="longest-streak">12 days</strong>
          </div>
          <div className="streak-shield" id="streak-shield">
            🛡️ Streak Shield Active
          </div>
        </div>
      </div>

      {/**/}
      <div>
        <div className="section-header">
          <span className="section-title">Your Badges</span>
          <span className="section-count"><strong id="earned-count">3</strong> / <span id="total-count">10</span> earned</span>
        </div>
        <div className="badges-grid" id="badges-grid"></div>
      </div>

    </div>
  
    </>
  );
}
