import "./TagComponent.css";

type tagProps = {
  tagName: string;
  isAllowDel: boolean;
  onDelete: () => void;
};
const TagComponent = ({ tagName, isAllowDel = false, onDelete }: tagProps) => {
  return <div
    className="tag text-dark fw-medium px-3 mb-2"
  >{tagName} {isAllowDel && (
    <i className="bi bi-x"
      onClick={onDelete}
    ></i>
  )}
  </div>;
};

export default TagComponent;
