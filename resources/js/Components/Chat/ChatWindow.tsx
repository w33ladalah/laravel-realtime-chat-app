import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { User, PageProps } from '@/types';

interface Message {
    id: number;
    content: string;
    user: User;
    created_at: string;
}

interface ChatWindowProps {
    initialMessages: Message[];
}

export default function ChatWindow({ initialMessages }: ChatWindowProps) {
    const { auth } = usePage<PageProps>().props;
    const [messages, setMessages] = useState<Message[]>(Array.isArray(initialMessages) ? initialMessages : []);
    const [newMessage, setNewMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Use native WebSockets instead
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 8080; // Reverb port
        const appKey = import.meta.env.VITE_REVERB_APP_KEY || 'testbae'; // Your Reverb app key
        const wsUrl = `${protocol}//${host}:${port}/app/${appKey}?protocol=7&client=js&version=7.0.0`;

        console.log('Connecting to WebSocket:', wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setConnected(true);

            // Subscribe to the chat channel
            ws.send(JSON.stringify({
                event: 'pusher:subscribe',
                data: {
                    channel: 'chat'
                }
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data);

            if (data.event === 'MessageSent') {
                console.log('New message received:', data.data.message);
                setMessages(prev => [...prev, data.data.message]);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnected(false);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
            setConnected(false);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        router.post(route('chat.store'), {
            content: newMessage,
        }, {
            preserveScroll: true,
            preserveState: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            onSuccess: () => {
                setNewMessage('');
            },
        });
    };

    return (
        <div className="h-[600px] flex flex-col">
            <div className="mb-4">
                <span className={connected ? "text-green-500" : "text-red-500"}>
                    {connected ? "Connected" : "Disconnected"}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {Array.isArray(messages) && messages.map((message) => (
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
