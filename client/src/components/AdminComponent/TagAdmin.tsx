import React from 'react'

const TagAdmin = () => {
    return (
        <div style={{ width: '100%' }}>
            <h3 className='mb-5'>Dashboard</h3>
            <div className="manage d-flex justify-content-between">
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: 'orange'
                    }}>
                    <h4>400</h4>
                    <span>Người dùng</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#87CEFA'
                    }}>
                    <h4>400</h4>
                    <span>Bài viết</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#F0FFF0'
                    }}>
                    <h4>400</h4>
                    <span>Thẻ</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#FFDE21'
                    }}>
                    <h4>400</h4>
                    <span>Báo cáo</span>
                </div>
            </div>
        </div>
    )
}

export default TagAdmin