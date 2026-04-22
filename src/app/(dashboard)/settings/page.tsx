"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState("daily");
  const [preferredTime, setPreferredTime] = useState("7");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [selectedRank, setSelectedRank] = useState("expert");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch user data
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEmailEnabled(data.emailPreferences?.enabled ?? false);
        setFrequency(data.emailPreferences?.frequency ?? "daily");
        setPreferredTime(String(data.emailPreferences?.preferredHour ?? 7));
        setTimezone(data.emailPreferences?.timezone ?? "UTC");
        setSelectedRank(data.targetRank ?? "expert");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRank: selectedRank,
          emailPreferences: {
            enabled: emailEnabled,
            frequency,
            preferredHour: parseInt(preferredTime),
            timezone,
          },
        }),
      });

      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save settings");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: "2rem" }}>Failed to load user data</div>;
  }

  return (
    <>


    <header className="settings-header">
      <h1 className="settings-header__title">Settings</h1>
      <button 
        className="btn-save-all" 
        id="save-btn"
        onClick={handleSave}
        disabled={saving}
        style={{ opacity: saving ? 0.6 : 1 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </header>

    <div className="settings-content">

      <div className="settings-top-row">

      {/**/}
      <div className="s-panel">
        <div className="s-panel__header">
          <div className="s-panel__header-icon s-panel__header-icon--indigo">👤</div>
          <div>
            <div className="s-panel__title">Profile</div>
            <div className="s-panel__sub">Your personal information from Google Sign-In</div>
          </div>
        </div>
        <div className="s-panel__body">
          <div className="profile-avatar-row">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5865F2&color=fff&size=128&bold=true`}
                 className="profile-avatar" alt="avatar" />
            <div className="profile-avatar-info">
              <div className="profile-avatar-info__name" id="profile-name">{user.name}</div>
              <div className="profile-avatar-info__email" id="profile-email">{user.email}</div>
              <div>
                <span className="google-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Signed in with Google
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/**/}
      <div className="s-panel">
        <div className="s-panel__header">
          <div className="s-panel__header-icon s-panel__header-icon--teal">⚡</div>
          <div>
            <div className="s-panel__title">Codeforces Account</div>
            <div className="s-panel__sub">Your verified handle and current rating</div>
          </div>
        </div>
        <div className="s-panel__body">
          <div className="cf-handle-box">
            <div className="cf-handle-box__left">
              <div className="cf-handle-box__verified">✓</div>
              <div>
                <div className="cf-handle-box__handle" id="cf-handle-display">{user.cfHandle || "Not connected"}</div>
                <div className="cf-handle-box__rating" id="cf-rating-display">
                  {user.cfProfile?.rating || "—"} · {user.cfProfile?.rank || "—"} · Peak: {user.cfProfile?.maxRating || "—"}
                </div>
              </div>
            </div>
            <button 
              className="btn-reverify"
              onClick={() => router.push("/onboarding")}
            >
              Re-verify Handle
            </button>
          </div>
        </div>
      </div>

      </div>{/**/}

      {/**/}
      <div className="s-panel">
        <div className="s-panel__header">
          <div className="s-panel__header-icon s-panel__header-icon--indigo">🎯</div>
          <div>
            <div className="s-panel__title">Learning Goal</div>
            <div className="s-panel__sub">Your target CF rank — affects topic recommendations</div>
          </div>
        </div>
        <div className="s-panel__body">
          <div className="rank-mini-grid" id="rank-grid">
            <div 
              className={`rank-mini-card ${selectedRank === "specialist" ? "selected" : ""}`}
              data-rank="specialist"
              onClick={() => setSelectedRank("specialist")}
              style={{ cursor: "pointer" }}
            >
              <div className="rank-mini-card__icon">🟢</div>
              <div className="rank-mini-card__name">Specialist</div>
              <div className="rank-mini-card__range">1400 – 1599</div>
            </div>
            <div 
              className={`rank-mini-card ${selectedRank === "expert" ? "selected" : ""}`}
              data-rank="expert"
              onClick={() => setSelectedRank("expert")}
              style={{ cursor: "pointer" }}
            >
              <div className="rank-mini-card__icon">🔵</div>
              <div className="rank-mini-card__name">Expert</div>
              <div className="rank-mini-card__range">1600 – 1899</div>
            </div>
            <div 
              className={`rank-mini-card ${selectedRank === "candidate_master" ? "selected" : ""}`}
              data-rank="candidate_master"
              onClick={() => setSelectedRank("candidate_master")}
              style={{ cursor: "pointer" }}
            >
              <div className="rank-mini-card__icon">🟣</div>
              <div className="rank-mini-card__name">Candidate Master</div>
              <div className="rank-mini-card__range">1900 – 2099</div>
            </div>
            <div 
              className={`rank-mini-card ${selectedRank === "master" ? "selected" : ""}`}
              data-rank="master"
              onClick={() => setSelectedRank("master")}
              style={{ cursor: "pointer" }}
            >
              <div className="rank-mini-card__icon">🟠</div>
              <div className="rank-mini-card__name">Master</div>
              <div className="rank-mini-card__range">2100+</div>
            </div>
          </div>
        </div>
      </div>

      {/**/}
      <div className="s-panel">
        <div className="s-panel__header">
          <div className="s-panel__header-icon s-panel__header-icon--amber">✉️</div>
          <div>
            <div className="s-panel__title">Email Notifications</div>
            <div className="s-panel__sub">Daily problem reminders delivered to your inbox</div>
          </div>
        </div>
        <div className="s-panel__body">

          {/**/}
          <div className="form-row">
            <div className="form-label-group">
              <span className="form-label">Problem Reminders</span>
              <span className="form-hint">Receive 3 personalised CF problems matching your level every morning</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                id="email-toggle" 
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
              />
              <div className="toggle__track"></div>
            </label>
          </div>

          {/**/}
          <div className="email-sub-options" id="email-sub">

            {/**/}
            <div className="s-select-row">
              <div>
                <label className="s-select-label" htmlFor="freq-select">Send Frequency</label>
                <select 
                  className="s-select" 
                  id="freq-select"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="every2days">Every 2 Days</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label className="s-select-label" htmlFor="time-select">Preferred Time</label>
                <select 
                  className="s-select" 
                  id="time-select"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                >
                  <option value="6">6:00 AM</option>
                  <option value="7">7:00 AM</option>
                  <option value="8">8:00 AM</option>
                  <option value="9">9:00 AM</option>
                  <option value="10">10:00 AM</option>
                  <option value="18">6:00 PM</option>
                  <option value="20">8:00 PM</option>
                  <option value="22">10:00 PM</option>
                </select>
              </div>
            </div>

            {/**/}
            <div>
              <label className="s-select-label" htmlFor="tz-select">Timezone</label>
              <select 
                className="s-select" 
                id="tz-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="UTC">UTC (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/**/}
      <div className="s-panel" style={{ border: "1px solid rgba(255,180,171,0.15)" }}>
        <div className="s-panel__header" style={{ borderBottomColor: "rgba(255,180,171,0.15)" }}>
          <div className="s-panel__header-icon s-panel__header-icon--red">⚠️</div>
          <div>
            <div className="s-panel__title" style={{ color: "var(--error)" }}>Danger Zone</div>
            <div className="s-panel__sub">Irreversible actions — proceed with caution</div>
          </div>
        </div>
        <div className="s-panel__body">
          <div className="danger-zone-row">
            <div className="danger-zone-row__info">
              <div className="danger-zone-row__label">Disconnect Codeforces Handle</div>
              <div className="danger-zone-row__hint">Removes your CF data and puts you back in onboarding</div>
            </div>
            <button className="btn-danger" >Disconnect</button>
          </div>
          <div className="danger-zone-row">
            <div className="danger-zone-row__info">
              <div className="danger-zone-row__label">Delete AlgoBoard Account</div>
              <div className="danger-zone-row__hint">Permanently delete all your data — this cannot be undone</div>
            </div>
            <button className="btn-danger" >Delete Account</button>
          </div>
        </div>
      </div>

    </div>{/**/}
  
    </>
  );
}
