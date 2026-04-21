export default function BoardPage() {
  return (
    <>


    {/**/}
    <header className="board-header">
      <div className="board-header__left">
        <h1 className="board-header__title">Upsolve Board</h1>
      </div>
      <div className="board-header__right">
        <button className="btn-sync" >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" id="sync-icon">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Sync Contests
        </button>
        <button className="btn-add-problem" >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Problem
        </button>
      </div>
    </header>

    {/**/}
    <div className="board-area" id="board-area">

      {/**/}
      <div className="kanban-col" id="col-to_upsolve">
        <div className="kanban-col__header">
          <span className="kanban-col__title">To Upsolve</span>
          <span className="kanban-col__badge" id="badge-to_upsolve">0</span>
        </div>
        <div className="kanban-col__body" id="body-to_upsolve">
          <div className="drop-zone-hint">Drop here</div>
        </div>
      </div>

      {/**/}
      <div className="kanban-col kanban-col--trying" id="col-trying">
        <div className="kanban-col__header">
          <span className="kanban-col__title">Trying</span>
          <span className="kanban-col__badge" id="badge-trying">0</span>
        </div>
        <div className="kanban-col__body" id="body-trying">
          <div className="drop-zone-hint">Drop here</div>
        </div>
      </div>

      {/**/}
      <div className="kanban-col kanban-col--solved" id="col-solved">
        <div className="kanban-col__header">
          <span className="kanban-col__title">Solved</span>
          <span className="kanban-col__badge" id="badge-solved">0</span>
        </div>
        <div className="kanban-col__body" id="body-solved">
          <div className="drop-zone-hint">Drop here</div>
        </div>
      </div>

    </div>
  
    </>
  );
}
