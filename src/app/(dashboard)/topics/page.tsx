export default function TopicsPage() {
  return (
    <>


    {/**/}
    <header className="topics-header">
      <h1 className="topics-header__title">Learning Path</h1>
      <div className="goal-pill" id="goal-pill">
        🎯 Your goal: Expert (1600)
      </div>
    </header>

    {/**/}
    <div className="topics-content">

      {/**/}
      <div className="topics-banner">
        <p className="topics-banner__text">
          <strong>Topics recommended for your level are highlighted.</strong>
          Complete all 6 problems per topic to unlock the next layer. Click any topic to view its curated problem list.
        </p>
      </div>

      {/**/}
      <div className="layer-filter" id="layer-filter">
        <button className="filter-tab active" data-layer="all"          >All</button>
        <button className="filter-tab"        data-layer="1"            >Foundation</button>
        <button className="filter-tab"        data-layer="2"            >Intermediate</button>
        <button className="filter-tab"        data-layer="3"            >Advanced</button>
        <button className="filter-tab"        data-layer="4"            >Expert</button>
      </div>

      {/**/}
      <div id="topics-sections"></div>

    </div>
  
    </>
  );
}
