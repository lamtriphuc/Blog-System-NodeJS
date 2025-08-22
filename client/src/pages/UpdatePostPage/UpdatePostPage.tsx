import { useEffect, useState } from 'react';
import TagComponent from '../../components/TagComponent/TagComponent';
import './UpdatePostPage.css'
import { getAllTag } from '../../api/tagApi';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createPost, getPostDetails, updatePost } from '../../api/postApi';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/uiSlice';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePostPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const postId = Number(id);

    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [oldPreviewUrls, setOldPreviewUrls] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [titlePost, setTitlePost] = useState('');
    const [contentPost, setContentPost] = useState('');

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

    const fetchPostDetails = async () => {
        try {
            const response = await getPostDetails({ id: postId });
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        }
    }

    const updatePostDetails = async (formData: FormData) => {
        try {
            dispatch(setLoading(true));
            const response = await updatePost(postId, formData);
            //  { data, statusCode, message }
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Có lỗi xảy ra';
            console.error('Lỗi khi sửa bài viết:', message);
            toast.error(message);
            throw new Error(message); // phải throw để mutation biết là lỗi
        } finally {
            dispatch(setLoading(false));
        }
    }

    // QUERY 
    const { data: allTags } = useQuery({
        queryKey: ['all-tags'],
        queryFn: fetchAllTags,
    })
    const { data: postDetails } = useQuery({
        queryKey: ['post-details'],
        queryFn: fetchPostDetails,
        enabled: !!postId && !isNaN(postId),
    })

    useEffect(() => {
        setTitlePost(postDetails?.title);
        setContentPost(postDetails?.content);
        setSelectedTags(postDetails?.tags);
        if (postDetails?.images) {
            setOldPreviewUrls(postDetails.images);
        }
    }, [postDetails])

    const mutation = useMutation({
        mutationKey: ['create-post'],
        mutationFn: updatePostDetails,
        onSuccess: () => {
            toast.success('Chỉnh sửa bài viết thành công');
            navigate('/')
        },
        onError: (error: any) => {
            console.error('Mutation lỗi:', error.message);
        }
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

    const handleDeleteTag = (tagId: string) => {
        setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
    };

    const handleUpdatePost = () => {
        const formData = new FormData();
        formData.append('title', titlePost);
        formData.append('content', contentPost)
        formData.append('tagIds', JSON.stringify(selectedTags.map(tag => tag.id)))
        // Nếu không có ảnh mới → gửi danh sách ảnh cũ
        if (!files) {
            console.log(postDetails.images)
            formData.append('imageUrls', JSON.stringify(postDetails.images));
        } else {
            files.forEach(file => {
                formData.append('images', file);
            })
        }
        mutation.mutate(formData);
    }

    return (
        <div>
            <h5 className='text-center'>Chỉnh sửa bài viết của bạn</h5>
            <div className='create-post-title mb-4'>
                <label>Tiêu đề</label>
                <p className='mini-title my-1'>Hãy đặt câu hỏi của bạn (ít nhất 10 ký tự)</p>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tiêu đề bài viết"
                    value={titlePost}
                    onChange={e => setTitlePost(e.target.value)}
                ></input>
            </div>
            <div className='create-post-content mb-4'>
                <label>Nội dung</label>
                <p className='mini-title my-1'>Hãy nêu rõ, chi tiết câu hỏi của bạn (ít nhất 20 ký tự)</p>
                <textarea
                    className="form-control"
                    rows={4}
                    value={contentPost}
                    onChange={e => setContentPost(e.target.value)}
                ></textarea>
            </div>
            <div className='create-post-image mb-4'>
                <label>Ảnh minh họa</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                    {oldPreviewUrls.map((_, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            {oldPreviewUrls[index] ? (
                                <img
                                    src={oldPreviewUrls[index]}
                                    alt={`Ảnh ${index}`}
                                    style={{ width: "100px", height: "100px", display: "block", objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ padding: "10px", border: "1px solid #ccc" }}>
                                    Ảnh {index}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='create-post-image mb-4'>
                <label>Ảnh minh họa (mới nếu cần)</label>
                <input className="form-control form-control-sm" onChange={handleFileChange} type="file" multiple></input>
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
                    {selectedTags?.map((tag: any) => (
                        <TagComponent
                            tagId={tag.id}
                            key={tag.id}
                            tagName={tag.name}
                            isAllowDel={true}
                            onDelete={() => handleDeleteTag(tag.id)}
                        />
                    ))}
                </div>
            </div>
            <button
                className="btn btn-primary w-100 mt-4"
                onClick={handleUpdatePost}
            >Tạo bài viết</button>
        </div>
    )
}

export default UpdatePostPage