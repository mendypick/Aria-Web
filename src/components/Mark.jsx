const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export function Lockup({ onClick }) {
  return (
    <a className="lockup" href="#top" onClick={onClick}>
      <img className="wordmark" src={asset("brand/wordmark.png")} alt="Aria" />
    </a>
  );
}

export function AppIcon({ className = "app-icon" }) {
  return <img className={className} src={asset("brand/icon.png")} alt="" />;
}
