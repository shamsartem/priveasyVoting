import { Link } from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/create">Create</Link>
      <Link to="/vote">Vote</Link>
      <Link to="/results">Results</Link>
    </nav>
  );
}
