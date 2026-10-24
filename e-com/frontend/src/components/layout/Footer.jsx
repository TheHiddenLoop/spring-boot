import { Link } from "react-router-dom";
import Container from "../ui/Container";
import { APP_NAME, APP_TAGLINE } from "../../config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-6 text-ink-3">
        <strong className="text-ink">{APP_NAME}</strong>
        <span>{APP_TAGLINE}</span>
        <span className="ml-auto">&copy; {new Date().getFullYear()} {APP_NAME}</span>
        <Link to="/admin" className="hover:text-accent">Admin</Link>
      </Container>
    </footer>
  );
}
