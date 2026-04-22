import BattleList from "@/components/dashboard/BattleList";

export const metadata = {
  title: "Code Battle - AlgoBoard",
  description: "1v1 Problem Solving Battles",
};

export default function BattlesPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "var(--color-on-surface)",
          marginBottom: "0.5rem"
        }}>
          Code Battle ⚔️
        </h1>
        <p style={{
          color: "var(--color-on-surface-variant)",
          fontSize: "1rem"
        }}>
          Challenge your friends to 1v1 problem solving duels
        </p>
      </div>

      <BattleList />
    </div>
  );
}
