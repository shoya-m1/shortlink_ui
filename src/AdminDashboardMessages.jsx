import React, { useState, useEffect } from 'react';
import {
    getAdminDashboardMessages,
    createDashboardMessage,
    updateDashboardMessage,
    deleteDashboardMessage
} from './auth';
import { Trash2, Edit, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminDashboardMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        link: '',
        type: 'latest',
        is_active: true
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await getAdminDashboardMessages();
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMessage) {
                await updateDashboardMessage(editingMessage.id, formData);
            } else {
                await createDashboardMessage(formData);
            }
            setIsModalOpen(false);
            setEditingMessage(null);
            setFormData({ title: '', content: '', link: '', type: 'latest', is_active: true });
            fetchMessages();
        } catch (error) {
            console.error("Failed to save message", error);
            alert("Failed to save message");
        }
    };

    const handleEdit = (msg) => {
        setEditingMessage(msg);
        setFormData({
            title: msg.title,
            content: msg.content,
            link: msg.link || '',
            type: msg.type,
            is_active: msg.is_active
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteDashboardMessage(id);
                fetchMessages();
            } catch (error) {
                console.error("Failed to delete message", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingMessage(null);
        setFormData({ title: '', content: '', link: '', type: 'latest', is_active: true });
        setIsModalOpen(true);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'latest': return 'bg-blue-100 text-blue-800'; // Info Terbaru
            case 'important': return 'bg-red-100 text-red-800'; // Info Penting
            case 'event': return 'bg-green-100 text-green-800'; // Event
            case 'warning': return 'bg-yellow-100 text-yellow-800'; // Peringatan
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'latest': return 'Info Terbaru';
            case 'important': return 'Info Penting';
            case 'event': return 'Event';
            case 'warning': return 'Peringatan';
            default: return type;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Messages</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Message
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(msg.type)} uppercase`}>
                                        {getTypeLabel(msg.type)}
                                    </span>
                                    {msg.is_active ? (
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle size={12} /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                            <XCircle size={12} /> Inactive
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800">{msg.title}</h3>
                                <p className="text-gray-600 mt-1">{msg.content}</p>
                                {msg.link && (
                                    <a href={msg.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-sm mt-1 hover:underline block">
                                        {msg.link}
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(msg)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No messages found.</div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingMessage ? 'Edit Message' : 'Create Message'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 text-black">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="latest">Info Terbaru</option>
                                    <option value="important">Info Penting</option>
                                    <option value="event">Event</option>
                                    <option value="warning">Peringatan</option>
                                </select>
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    id="is_active"
                                    className="mr-2 h-4 text-black w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardMessages;
