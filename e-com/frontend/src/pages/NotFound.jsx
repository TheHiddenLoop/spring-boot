import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import StateBlock from "../components/ui/StateBlock";

export default function NotFound() {
  return (
    <Container>
      <StateBlock title="Page not found" text="That link doesn't lead anywhere in the store.">
        <Button to="/">Back to products</Button>
      </StateBlock>
    </Container>
  );
}
