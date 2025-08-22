import React, { useState } from 'react'
import { useAppDispatch } from '../../store/hooks';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createTag, deleteTag, getAllTagPanigate } from '../../api/tagApi';
import { setLoading } from '../../store/uiSlice';
import { Button, Modal } from 'react-bootstrap';

interface TagState {
    name: string;
    description: string;
}

const TagAdmin = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const [selectedTagId, setSelectedTagId] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newTag, setNewTag] = useState<TagState>({
        name: '',
        description: ''
    })

    const updateTagState = (field: keyof TagState, value: string) => {
        setNewTag(prev => ({ ...prev, [field]: value }))
    }

    const fetchAllTags = async ({ queryKey }: any) => {
        const [, page] = queryKey // lấy page từ queryKey
        try {
            const response = await getAllTagPanigate(page);
            return response.data;
        } catch (error: any) {
            const message = error?.response?.data?.message;
            console.log('Lỗi: ', message);
            toast.error('Lỗi: ', message);
        }
    }

    const delTag = async (tagId: number) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteTag(tagId);
            //  { data, statusCode, message }
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['all-tag'] })
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

    const AddTag = async () => {
        try {
            dispatch(setLoading(true));
            const response = await createTag(newTag);
            //  { data, statusCode, message }
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['all-tag'] })
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

    const { data: tagData } = useQuery({
        queryKey: ['all-tag', page],
        queryFn: fetchAllTags,
        placeholderData: keepPreviousData,
    })


    const mutation = useMutation({
        mutationKey: ['delete-tag'],
        mutationFn: delTag,
    })

    const mutationAddTag = useMutation({
        mutationKey: ['add-tag'],
        mutationFn: AddTag,
    })

    const handleDeleteTag = (tagId: number) => {
        if (tagId === 0) return;
        mutation.mutate(tagId);
    }

    const handleAddTag = () => {
        mutationAddTag.mutate();
        handleClose();
    }

    return (
        <div style={{ width: '100%' }}>
            <div className='d-flex justify-content-between'>
                <h3 className='mb-5 w-50'>Quản lý thẻ</h3>
                <span>
                    <button className='btn btn-primary' onClick={handleShow}>Thêm thẻ</button>
                </span>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm thẻ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="">Tên thẻ</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTag.name}
                        onChange={e => updateTagState('name', e.target.value)}
                    />
                    <label htmlFor="">Mô tả</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTag.description}
                        onChange={e => updateTagState('description', e.target.value)}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddTag}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>


            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th style={{ width: '300px' }}>Tagname</th>
                        <th style={{ width: '600px' }}>Description</th>
                        <th>Total Post</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tagData?.tags?.map((tag: any) => (
                        <tr key={tag.id}>
                            <td>{tag.id}</td>
                            <td>{tag.name}</td>
                            <td>{tag.description}</td>
                            <td>{tag.totalPost}</td>

                            <td className="d-flex justify-content-evenly">
                                <button
                                    type="button"
                                    className="btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteTagModal"
                                    onClick={() => setSelectedTagId(tag.id)}
                                >
                                    <span><i className="bi bi-trash3-fill" style={{ color: 'red' }}></i></span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <div className="modal" id="deleteTagModal" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xóa người dùng</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa thẻ ID = {selectedTagId}?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={() => handleDeleteTag(selectedTagId)}
                                >Xóa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </table>
        </div>
    )
}

export default TagAdmin