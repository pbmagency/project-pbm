<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $allowedSorts = ['order_number', 'name', 'email', 'amount', 'status', 'created_at'];

        if (in_array($sortField, $allowedSorts, true)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return back()->with('success', 'Order deleted.');
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,paid,failed'],
        ]);

        $order->update(['status' => $request->status]);

        return response()->json(['success' => true]);
    }

    public function markAsPaid(Order $order): JsonResponse
    {
        if ($order->status === 'paid') {
            return response()->json(['success' => true, 'message' => 'Already paid']);
        }

        $order->update(['status' => 'paid']);

        Mail::to($order->email)->queue(new OrderConfirmationMail($order));

        return response()->json(['success' => true]);
    }
}