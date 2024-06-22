import React, { useState, useEffect } from 'react';
import api from '../../../../../../config/axios';

function Comment({ auctionId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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
            await api.post('/api/Comments', { auctionId, content: newComment });
            setNewComment('');
            // Re-fetch comments to include the new one
            const response = await api.get(`/api/Comments/GetByAuctionId/${auctionId}`);
            setComments(response.data);
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p><strong>{comment.name}:</strong> {comment.content}</p>
                        <p><em>{new Date(comment.createdAt).toLocaleString()}</em></p>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Comment;
