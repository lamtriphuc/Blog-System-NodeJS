import { useParams } from 'react-router-dom'
import { getPostDetails } from '../../api/postApi'
import './PostDetailsPage.css'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TagComponent from '../../components/TagComponent/TagComponent';
import dayjs from '../../utils/dayjs';

const PostDetailsPage = () => {
    const { id } = useParams();
    const postId = Number(id);

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

    const { data: postDeails } = useQuery({
        queryKey: ['post-details'],
        queryFn: fetchPostDetails,
        enabled: !!postId && !isNaN(postId),
    })

    console.log(postDeails)

    return (
        <div>
            <div className="post-title">
                <h4>{postDeails?.title}</h4>
                <div className='post-info d-flex gap-3 my-3'>
                    <span>Đăng: {dayjs(postDeails?.createdAt).fromNow()}</span>
                    <span>Chỉnh sửa: {dayjs(postDeails?.updatedAt).fromNow()}</span>
                </div>
            </div>
            <div className="answers d-flex gap-5 mt-4">

                <div className="post-answers">
                    <div className='post-details-content pb-3 mb-4'>
                        <p>{postDeails?.content}</p>
                        <div className='post-images'>
                            {postDeails?.images?.map((image: string, index: number) => {
                                return <img key={index} src={image} alt="" />
                            })}
                        </div>
                        <div className='post-tags mt-3 d-flex gap-2'>
                            {postDeails?.tags?.map((tag: string, index: number) => {
                                return <TagComponent key={index} tagName={tag} />
                            })}
                        </div>
                    </div>
                    <h5>10 Câu trả lời</h5>
                    <div className='post-answer'>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem hic vitae, temporibus voluptate nam sit iure magnam ut at, iste natus vel beatae fuga quis a architecto magni minus soluta!
                        </p>
                        <div className='post-info d-flex gap-3 my-3'>
                            <span>Đăng: 1 ngày</span>
                        </div>
                    </div>
                    <div className='post-answer'>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem hic vitae, temporibus voluptate nam sit iure magnam ut at, iste natus vel beatae fuga quis a architecto magni minus soluta!
                        </p>
                        <div className='post-info d-flex gap-3 my-3'>
                            <span>Đăng: 1 ngày</span>
                        </div>
                    </div>
                    <div className="my-4">
                        <label style={{
                            fontSize: '20px'
                        }} htmlFor="exampleFormControlTextarea1" className="your-answer">Câu trả lời của bạn</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={5}></textarea>
                        <button className="btn btn-primary mt-3">Đăng câu trả lời</button>
                    </div>
                </div>
                <div className="post-related">
                    <h6>Bài viết liên quan</h6>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                    <div>bài post 1</div>
                </div>
            </div>
        </div>
    )
}

export default PostDetailsPage