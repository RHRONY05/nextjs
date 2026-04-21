export default function ComparePage() {
  return (
    <>

    <header className="page-header">
      <div>
        <h1 className="page-header__title">Friend Compare</h1>
        <p className="page-header__sub">Go head-to-head with any Codeforces user</p>
      </div>
    </header>

    <div className="cs-wrap">

      {/**/}
      <div className="cs-preview">

        {/**/}
        <div className="compare-search-bar">
          <span className="compare-search-bar__label">Compare with:</span>
          <input className="compare-search-input" value="tourist" readOnly />
          <button className="compare-search-btn">Search</button>
        </div>

        {/**/}
        <div className="compare-grid">

          {/**/}
          <div className="compare-col compare-col--you">
            <div className="compare-col__header">
              <img src="https://ui-avatars.com/api/?name=Rony&background=5865F2&color=fff&size=64&bold=true"
                   style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--secondary)" }} alt="you"/>
              <div>
                <div className="compare-col__who">You</div>
                <div className="compare-col__handle">rony_cf</div>
                <div className="compare-col__rating">1342 · Specialist</div>
              </div>
            </div>
            <div className="compare-stat-list">
              <div className="compare-stat-row"><span className="compare-stat-label">Current Rating</span><span className="compare-stat-value lose">1,342</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Max Rating</span><span className="compare-stat-value lose">1,398</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Problems Solved</span><span className="compare-stat-value lose">312</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Contests Entered</span><span className="compare-stat-value lose">42</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Best Rank</span><span className="compare-stat-value lose">#881</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Current Streak</span><span className="compare-stat-value win">5 days 🔥</span></div>
            </div>
            <div className="compare-charts">
              <div className="compare-chart-label">Top Topics</div>
              <div className="compare-mini-bar-row">
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Binary Search</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "78%", background: "var(--secondary)" }}></div></div>
                  <span className="compare-mini-bar-val">47</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Greedy</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "62%", background: "var(--secondary)" }}></div></div>
                  <span className="compare-mini-bar-val">38</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">DP</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "45%", background: "var(--secondary)" }}></div></div>
                  <span className="compare-mini-bar-val">27</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Graphs</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "30%", background: "var(--secondary)" }}></div></div>
                  <span className="compare-mini-bar-val">18</span>
                </div>
              </div>
            </div>
          </div>

          {/**/}
          <div className="compare-col compare-col--friend">
            <div className="compare-col__header">
              <img src="https://ui-avatars.com/api/?name=tourist&background=FF4444&color=fff&size=64&bold=true"
                   style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--primary-container)" }} alt="friend"/>
              <div>
                <div className="compare-col__who">Friend</div>
                <div className="compare-col__handle">tourist</div>
                <div className="compare-col__rating">3979 · Legendary GM</div>
              </div>
            </div>
            <div className="compare-stat-list">
              <div className="compare-stat-row"><span className="compare-stat-label">Current Rating</span><span className="compare-stat-value win">3,979</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Max Rating</span><span className="compare-stat-value win">3,979</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Problems Solved</span><span className="compare-stat-value win">4,021</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Contests Entered</span><span className="compare-stat-value win">312</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Best Rank</span><span className="compare-stat-value win">#1</span></div>
              <div className="compare-stat-row"><span className="compare-stat-label">Current Streak</span><span className="compare-stat-value lose">2 days</span></div>
            </div>
            <div className="compare-charts">
              <div className="compare-chart-label">Top Topics</div>
              <div className="compare-mini-bar-row">
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Binary Search</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "100%", background: "var(--primary-container)" }}></div></div>
                  <span className="compare-mini-bar-val">601</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Greedy</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "94%", background: "var(--primary-container)" }}></div></div>
                  <span className="compare-mini-bar-val">565</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">DP</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "90%", background: "var(--primary-container)" }}></div></div>
                  <span className="compare-mini-bar-val">541</span>
                </div>
                <div className="compare-mini-bar-item">
                  <span className="compare-mini-bar-name">Graphs</span>
                  <div className="compare-mini-bar-track"><div className="compare-mini-bar-fill" style={{ width: "88%", background: "var(--primary-container)" }}></div></div>
                  <span className="compare-mini-bar-val">531</span>
                </div>
              </div>
            </div>
          </div>

        </div>{/**/}
      </div>{/**/}

      {/**/}
      <div className="cs-overlay">
        <div className="cs-overlay__icon">⚔️</div>
        <span className="cs-overlay__label">Coming Soon</span>
        <h2 className="cs-overlay__title">Challenge your friends</h2>
        <p className="cs-overlay__sub">Enter any Codeforces handle and get a full side-by-side breakdown — rating, topics, streaks, and head-to-head problem overlap.</p>

        <div className="cs-features">
          <div className="cs-feature">
            <div className="cs-feature__icon">📊</div>
            <div className="cs-feature__label">Stats Diff</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">🗺️</div>
            <div className="cs-feature__label">Topic Map</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">🤝</div>
            <div className="cs-feature__label">Shared Problems</div>
          </div>
          <div className="cs-feature">
            <div className="cs-feature__icon">🏅</div>
            <div className="cs-feature__label">Win/Loss</div>
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
