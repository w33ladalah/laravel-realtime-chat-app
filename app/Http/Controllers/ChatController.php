<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $messages = Message::with('user')->latest()->take(50)->get()->reverse();
        return Inertia::render('Chat/Index', [
            'messages' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = $request->user()->messages()->create($validated);

        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return response()->json($message->load('user'));
    }
}
