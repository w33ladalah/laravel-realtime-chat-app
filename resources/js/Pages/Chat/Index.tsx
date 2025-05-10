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

export default function Index({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chat</h2>}
        >
            <Head title="Chat" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ChatWindow />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
