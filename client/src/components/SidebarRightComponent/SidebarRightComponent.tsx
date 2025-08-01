import { useQuery } from "@tanstack/react-query";
import { getTagTrending } from "../../api/tagApi";
import TagComponent from "../TagComponent/TagComponent";
import "./SidebarRightComponent.css";
import type { TagData } from "../../types";

const fetchTagTrending = async () => {
  const { data } = await getTagTrending();
  return data;
}

const SidebarRightComponent = () => {
  const { data: tagTrending } = useQuery({
    queryKey: ['tag-trending'],
    queryFn: fetchTagTrending
  })

  return (
    <div className="sidebar-right p-2">
      <h6 className="pt-3">Thẻ thịnh hành</h6>
      {tagTrending?.map((tag: TagData, index: number) => {
        return <TagComponent key={index} tagName={tag.name} />
      })}
    </div>
  );
};

export default SidebarRightComponent;
