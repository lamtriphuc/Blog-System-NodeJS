import TagComponent from "../TagComponent/TagComponent";
import "./SidebarRightComponent.css";

const SidebarRightComponent = () => {
  return (
    <div className="sidebar-right p-2">
      <h6 className="pt-3">Thẻ thịnh hành</h6>
      <TagComponent tagName="java" />
      <TagComponent tagName="python" />
    </div>
  );
};

export default SidebarRightComponent;
