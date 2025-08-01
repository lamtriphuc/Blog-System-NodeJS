import "./TagComponent.css";

type tagProps = {
  tagName: string;
};
const TagComponent = ({ tagName }: tagProps) => {
  console.log(tagName)
  return <div className="tag text-dark fw-medium px-3 mb-2">{tagName}</div>;
};

export default TagComponent;
