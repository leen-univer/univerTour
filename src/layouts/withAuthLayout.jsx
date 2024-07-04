import { Card, Container } from "@mui/material";

const withAuthLayout = (Page) => {
  const AuthLayout = () => (
    <div className="auth_page">
      <Container
        maxWidth="md"
        className="d-flex h-75vh place-content-center place-items-center"
      >
        <Card>
          <Page />
        </Card>
      </Container>
    </div>
  );
  return AuthLayout;
};

export default withAuthLayout;
