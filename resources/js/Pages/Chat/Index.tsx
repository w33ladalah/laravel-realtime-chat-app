import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { User } from '@/types';
import ChatWindow from '@/Components/Chat/ChatWindow';

interface Message {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
}

export default function Index({ auth, messages }: PageProps<{ messages: Message[] }>) {
    const [wsStatus, setWsStatus] = useState<string>('Not connected');

    const testWebSocketConnection = () => {
        setWsStatus('Connecting...');

        // Use native WebSockets to test connection
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 8080; // Reverb port
        const appKey = import.meta.env.VITE_REVERB_APP_KEY || 'testbae'; // Your Reverb app key
        const wsUrl = `${protocol}//${host}:${port}/app/${appKey}?protocol=7&client=js&version=7.0.0`;

        console.log('Test connecting to WebSocket:', wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket test connection successful');
            setWsStatus('Connected successfully!');

            // Close after 3 seconds
            setTimeout(() => {
                ws.close();
                setWsStatus('Closed test connection');
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket test connection error:', error);
            setWsStatus('Connection failed - see console for details');
        };

        ws.onclose = () => {
            console.log('WebSocket test connection closed');
        };
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat</h2>}
        >
            <Head title="Chat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center space-x-4 mb-4">
                                <button
                                    onClick={testWebSocketConnection}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Test WebSocket Connection
                                </button>
                                <div className="text-gray-700">
                                    Status: <span className={
                                        wsStatus.includes('Connected') ? 'text-green-500' :
                                        wsStatus.includes('Connecting') ? 'text-yellow-500' :
                                        'text-red-500'
                                    }>{wsStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ChatWindow initialMessages={messages} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
