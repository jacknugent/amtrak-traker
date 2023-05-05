import { Spinner } from "react-bootstrap";

const ConditionalSpinner = ({ when }: { when: boolean }) => {
  if (!when) {
    return null;
  }

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export default ConditionalSpinner;
