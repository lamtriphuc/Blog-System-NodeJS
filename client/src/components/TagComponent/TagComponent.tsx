import { useNavigate } from "react-router-dom";
import "./TagComponent.css";

type tagProps = {
  tagId: number;
  tagName: string;
  isAllowDel: boolean;
  onDelete: () => void;
};
const TagComponent = ({ tagId, tagName, isAllowDel = false, onDelete }: tagProps) => {
  const navigate = useNavigate();

  return <div
    style={{ cursor: 'pointer' }}
    onClick={() => navigate(`/tag/${tagId}/post`)}
    className="tag text-dark fw-medium px-3 mb-2"
  >{tagName} {isAllowDel && (
    <i className="bi bi-x"
      onClick={onDelete}
    ></i>
  )}
  </div>;
};

export default TagComponent;
