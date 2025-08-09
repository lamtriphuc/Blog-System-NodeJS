import { useState } from 'react';
import TagComponent from '../../components/TagComponent/TagComponent';
import './CreatePostPage.css'
import { getAllTag } from '../../api/tagApi';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import type { TagData } from '../../types';

const CreatePostPage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

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
    const { data: allTags } = useQuery({
        queryKey: ['all-tags'],
        queryFn: fetchAllTags,
    })


    // HANDLE
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);

        const urls: string[] = [];
        selectedFiles.forEach((file) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    urls.push(reader.result as string);
                    // Khi đủ preview cho tất cả file → set state
                    if (urls.length === selectedFiles.length) {
                        setPreviewUrls(urls);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                urls.push(""); // file không phải ảnh → không có preview URL
                if (urls.length === selectedFiles.length) {
                    setPreviewUrls(urls);
                }
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setSuggestions([]);
        } else {
            const filtered = allTags.filter((tag: any) =>
                tag.name.toLowerCase().includes(value.toLowerCase())
                && !selectedTags.some((selected: any) => selected.id === tag.id)
            );
            setSuggestions(filtered);
        }
    };

    const handleSelect = (tag: any) => {
        setQuery('');
        selectedTags.push(tag)
        setSuggestions([]);
    };

    console.log(selectedTags)

    return (
        <div>
            <h5 className='text-center'>Tạo bài viết của bạn</h5>
            <div className='create-post-title mb-4'>
                <label>Tiêu đề</label>
                <p className='mini-title my-1'>Hãy đặt câu hỏi của bạn (ít nhất 10 ký tự)</p>
                <input type="text" className="form-control" placeholder="Tiêu đề bài viết"></input>
            </div>
            <div className='create-post-content mb-4'>
                <label>Nội dung</label>
                <p className='mini-title my-1'>Hãy nêu rõ, chi tiết câu hỏi của bạn (ít nhất 20 ký tự)</p>
                <textarea className="form-control" rows={4}></textarea>
            </div>
            <div className='create-post-image mb-4'>
                <label>Ảnh minh họa (nếu có)</label>
                <input className="form-control form-control-sm" onChange={handleFileChange} type="file" multiple></input>
                {/* {previewUrl && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                    </div>
                )} */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                    {files.map((file, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            {previewUrls[index] ? (
                                <img
                                    src={previewUrls[index]}
                                    alt={file.name}
                                    style={{ width: "100px", height: "100px", display: "block", objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                                    {file.name} ({Math.round(file.size / 1024)} KB)
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='create-post-tag'>
                <label>Thẻ</label>
                <p className='mini-title my-1'>Hãy chọn các thẻ (nhập vào ô tiềm kiếm)</p>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập các thẻ"
                    value={query}
                    onChange={handleChange}></input>
                {suggestions.length > 0 && (
                    <ul
                        style={{
                            position: "relative",
                            background: "#fff",
                            border: "1px solid #ddd",
                            margin: 0,
                            padding: 0,
                            listStyle: "none",
                            zIndex: 100,
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        {suggestions.map((tag: any) => (
                            <li
                                key={tag.id}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                }}
                                onClick={() => handleSelect(tag)}
                            >
                                <strong>{tag.name}</strong>
                                <br />
                                <small style={{ color: "#666" }}>{tag.description}</small>
                            </li>
                        ))}
                    </ul>
                )}
                <div className='tags-area mt-2 d-flex gap-1'>
                    <TagComponent tagName='ok' isAllowDel={true} />
                </div>
            </div>
            <button className="btn btn-primary w-100 mt-4">Tạo bài viết</button>
        </div>
    )
}

export default CreatePostPage;