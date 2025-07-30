import TagDetailsComponent from "../../components/TagDetailsComponent/TagDetailsComponent";
import type { tagData } from "../../types";
import "./TagPage.css";

const TagPage = () => {
  const tagList: tagData[] = [
    {
      tagName: "java",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
    {
      tagName: "python",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
    {
      tagName: "java",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
    {
      tagName: "java",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
    {
      tagName: "java",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
    {
      tagName: "java",
      desciption:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos molestiae culpa placeat, doloremque voluptate voluptatum optio at soluta perspiciatis explicabo sapiente quasi blanditiis quod pariatur provident aliquam? Illo, vero necessitatibus!",
      totalPost: 200,
      postToday: 20,
    },
  ];
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
          />
        </div>
      </div>
      <div className="tag-container w-100 d-flex flex-wrap gap-2">
        {tagList.map((tag, index) => (
          <TagDetailsComponent key={index} tag={tag} />
        ))}
      </div>
    </div>
  );
};

export default TagPage;
