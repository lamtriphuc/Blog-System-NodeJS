import { useQuery } from "@tanstack/react-query";
import TagDetailsComponent from "../../components/TagDetailsComponent/TagDetailsComponent";
import "./TagPage.css";
import { getAllTag } from "../../api/tagApi";
import type { TagData } from "../../types";
import { toast } from "react-toastify";
import { useState } from "react";



const TagPage = () => {
  const [search, setSearch] = useState("");

  // FETCH
  const fetchAllTags = async () => {
    try {
      const response = await getAllTag();
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      console.log('Lỗi: ', message);
      toast.error('Lỗi: ', message);
      return [];
    }
  }


  // QUERY 
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchAllTags,
  })


  // Lọc theo input
  const filteredTags = tags?.filter((tag: TagData) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex flex-column align-items-start gap-4 w-100">
      <div className="d-flex justify-content-between w-100 ">
        <h5 className="d-inline w-25">Các thẻ</h5>
        <div className="input-group input-search w-50">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm thẻ"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="tag-container w-100 d-flex flex-wrap gap-2">
        {filteredTags?.map((tag: TagData, index: number) => (
          <TagDetailsComponent key={index} tag={tag} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;
