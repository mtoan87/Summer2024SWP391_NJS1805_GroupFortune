import React, { useState, useEffect } from 'react';
import { CommentOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import api from '../../../../../../config/axios';
import '../Styles/comment.scss'; // Import CSS file for Comment component

function Comment({ auctionId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showOtherComments, setShowOtherComments] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/api/Comments/GetByAuctionId/${auctionId}`);
                setComments(response.data);
            } catch (err) {
                console.error('Error fetching comments:', err);
            }
        };

        fetchComments();
    }, [auctionId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simulate adding the new comment to the comments list
            const newCommentObj = {
                name: 'You', // Replace with the actual user name or identifier
                content: newComment,
                createdAt: new Date().toISOString(), // Use the current date/time
            };
            setComments([newCommentObj, ...comments]); // Add new comment to the beginning

            setNewComment('');

            // Uncomment below if you want to post comment to API (not necessary for simulation)
            // await api.post('/api/Comments', { auctionId, content: newComment });

        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    const toggleOtherComments = () => {
        setShowOtherComments(!showOtherComments);
    };

    return (
        <div className="comment-section">
            <h3><CommentOutlined /> Comments</h3>
            <ul>
                {/* Show all comments including the user's comment */}
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p><strong>{comment.name}:</strong> {comment.content}</p>
                        <p><em>{new Date(comment.createdAt).toLocaleString()}</em></p>
                    </li>
                ))}
                {showOtherComments && (
                    <li className="other-comments">
                        <p><strong>Other Comments:</strong></p>
                        <ul>
                            {/* Show other comments excluding the user's comment */}
                            {comments.filter((comment, index) => comment.name !== 'You').map((comment, index) => (
                                <li key={index}>
                                    <p><strong>{comment.name}:</strong> {comment.content}</p>
                                    <p><em>{new Date(comment.createdAt).toLocaleString()}</em></p>
                                </li>
                            ))}
                        </ul>
                    </li>
                )}
            </ul>
            <button onClick={toggleOtherComments}>
                {showOtherComments ? <EyeInvisibleOutlined /> : <EyeOutlined />} {showOtherComments ? 'Hide Other Comments' : 'Show Other Comments'}
            </button>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    required
                />
                <button type="submit"><CommentOutlined /> Submit</button>
            </form>
        </div>
    );
}

export default Comment;
