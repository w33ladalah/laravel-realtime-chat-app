import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { User, PageProps } from '@/types';

interface Message {
    id: number;
    content: string;
    user: User;
    created_at: string;
}

export default function ChatWindow() {
    const { auth } = usePage<PageProps>().props;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: window.location.hostname,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: false,
            enabledTransports: ['ws', 'wss'],
        });

        echo.channel('chat')
            .listen('MessageSent', (e: { message: Message }) => {
                setMessages(prev => [...prev, e.message]);
            });

        return () => {
            echo.leave('chat');
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        router.post(route('chat.store'), {
            content: newMessage,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewMessage('');
            },
        });
    };

    return (
        <div className="h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.user.id === auth.user.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.user.id === auth.user.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <div className="text-sm font-semibold mb-1">
                                {message.user.name}
                            </div>
                            <div>{message.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Type your message..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
