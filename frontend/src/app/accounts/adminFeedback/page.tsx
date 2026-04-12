'use client';

import { useState, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from 'lucide-react';
import { apiClient } from '@/api/clients';

interface User {
    id: number;
    username: string;
    profilePic?: string;
    firstName?: string;
    lastName?: string;
}

interface Feedback {
    id: number;
    content: string;
    images: string[];
    createdAt: string;
    sentiment: string;
    userId: number;
    user: User;
    likedBy: number[];
    dislikedBy: number[];
    adminReply?: string;
    adminReplyAt?: string;
}

import { useToast } from '@/Components/Toast/toast';

export default function AdminFeedbackPage() {
    const { showSuccess, showError, showWarning } = useToast();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/feedback');
            setFeedbacks(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (feedbackId: number) => {
        // Show confirmation toast
        showWarning('Are you sure you want to delete this feedback?', {
            description: 'This action cannot be undone.',
            duration: 5000,
            action: {
                label: 'Delete',
                onClick: () => deleteFeedback(feedbackId)
            },
            cancel: {
                label: 'Cancel',
            }
        });
    };

    const deleteFeedback = async (feedbackId: number) => {
        try {
            await apiClient.delete(`/feedback/${feedbackId}`);
            setFeedbacks((prev) => prev.filter(f => f.id !== feedbackId));
            showSuccess('Feedback deleted successfully');
        } catch (err: any) {
            showError(err.response?.data?.message || err.message || 'Failed to delete feedback');
        }
    };

    const handleReply = async (feedbackId: number) => {
        if (!replyText.trim()) {
            showWarning('Please enter a reply');
            return;
        }

        try {
            setSubmitting(true);
            const response = await apiClient.post(`/feedback/${feedbackId}/admin-reply`, {
                adminReply: replyText
            });

            const updated = response.data;
            setFeedbacks(feedbacks.map(f => f.id === feedbackId ? updated : f));
            setReplyingTo(null);
            setReplyText('');
            showSuccess('Reply sent successfully!');
        } catch (err: any) {
            showError(err.response?.data?.message || err.message || 'Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading feedback...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-lg mb-6 shadow-sm">
                <h1 className="md:text-2xl text-xl sm:text-xl font-bold text-gray-900"><span className="text-amber-400">Admin</span> Feedback Management</h1>
                <p className="text-gray-500 mt-1 text-sm">View and respond to user feedback</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-100 text-sm">
                    {error}
                </div>
            )}

            <div className="grid gap-4">
                {feedbacks.map((feedback) => {
                    const isReplying = replyingTo === feedback.id;

                    return (
                        <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow relative">
                            {/* User Info & Actions Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {feedback.user?.profilePic ? (
                                        <img
                                            src={feedback.user.profilePic}
                                            alt={feedback.user.username}
                                            className="w-10 h-10 rounded-full ring-2 ring-gray-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                                            {feedback.user?.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900 text-base">
                                                {feedback.user?.firstName && feedback.user?.lastName
                                                    ? `${feedback.user.firstName} ${feedback.user.lastName}`
                                                    : feedback.user?.username || 'Anonymous'}
                                            </p>
                                            {/* Sentiment Badge moved next to name or kept right? Let's keep right but grouped with delete */}
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {new Date(feedback.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Sentiment Badge */}
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${feedback.sentiment === 'POSITIVE'
                                            ? 'bg-green-50 text-green-700 border border-green-100'
                                            : feedback.sentiment === 'NEGATIVE'
                                                ? 'bg-red-50 text-red-700 border border-red-100'
                                                : 'bg-gray-50 text-gray-700 border border-gray-100'
                                            }`}
                                    >
                                        {feedback.sentiment}
                                    </span>

                                    {/* Delete Button - Moved here */}
                                    <button
                                        onClick={() => handleDelete(feedback.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-red-50"
                                        title="Delete Feedback"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Feedback Content */}
                            <div className="bg-gray-50/50 rounded-lg p-3 mb-3 border border-gray-100/50">
                                <p className="text-gray-800 leading-relaxed text-sm">{feedback.content}</p>
                            </div>

                            {/* Images */}
                            {feedback.images && feedback.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                    {feedback.images.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`Feedback image ${idx + 1}`}
                                            className="w-full h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Reactions Stats */}
                            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-1.5">
                                    <ThumbsUp size={14} className="text-amber-500" />
                                    <span>{feedback.likedBy.length} likes</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ThumbsDown size={14} className="text-gray-400" />
                                    <span>{feedback.dislikedBy.length} dislikes</span>
                                </div>
                            </div>

                            {/* Admin Reply Section */}
                            {feedback.adminReply ? (
                                <div className="bg-amber-50/50 border-l-[3px] border-amber-500 pl-3 py-2 pr-2 rounded-r">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MessageSquare size={14} className="text-amber-500" />
                                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                                            Admin Reply
                                        </p>
                                    </div>
                                    <p className="text-gray-800 mb-1 text-sm">{feedback.adminReply}</p>
                                    <p className="text-[10px] text-amber-800/50">
                                        {new Date(feedback.adminReplyAt!).toLocaleString()}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {!isReplying ? (
                                        <button
                                            onClick={() => setReplyingTo(feedback.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-sm rounded bg-opacity-90 hover:bg-opacity-100 transition-all shadow-sm"
                                        >
                                            <MessageSquare size={14} />
                                            Reply
                                        </button>
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                Your Reply:
                                            </label>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="w-full border border-gray-300 rounded p-2 mb-2 text-sm focus:ring-1 focus:ring-amber-500 focus:border-transparent outline-none bg-white font-normal"
                                                rows={3}
                                                placeholder="Write a reply..."
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReply(feedback.id)}
                                                    disabled={submitting}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-sm rounded hover:bg-amber-800 transition-colors disabled:opacity-50 shadow-sm"
                                                >
                                                    <Send size={14} />
                                                    {submitting ? 'Sending...' : 'Reply'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyText('');
                                                    }}
                                                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {feedbacks.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
                        No feedback available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
