import { useQuery } from "@tanstack/react-query";
import { getTagTrending } from "../../api/tagApi";
import TagComponent from "../TagComponent/TagComponent";
import "./SidebarRightComponent.css";
import type { TagData } from "../../types";
import { data } from "react-router-dom";

const fetchTagTrending = async () => {
  try {
    const response = await getTagTrending();
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
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
        return <TagComponent tagId={tag.id} key={index} tagName={tag.name} isAllowDel={false} onDelete={() => { }} />
      })}
    </div>
  );
};

export default SidebarRightComponent;
