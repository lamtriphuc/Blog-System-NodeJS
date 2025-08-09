import "./TagComponent.css";

type tagProps = {
  tagName: string;
  isAllowDel: boolean;
};
const TagComponent = ({ tagName, isAllowDel = false }: tagProps) => {
  return <div className="tag text-dark fw-medium px-3 mb-2">{tagName} {isAllowDel && (<i className="bi bi-x"></i>)}</div>;
};

export default TagComponent;
