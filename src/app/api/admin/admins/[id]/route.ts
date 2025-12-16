import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { authOptions } from '@/lib/auth';

// GET - Get single admin
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const admin = await Admin.findById(id).select('-password');

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ admin }, { status: 200 });
    } catch (error) {
        console.error('Error fetching admin:', error);
        return NextResponse.json({ error: 'Failed to fetch admin' }, { status: 500 });
    }
}

// PATCH - Update admin details
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const { name, email } = await request.json();

        // Build update object
        const updateData: { name?: string; email?: string } = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        // Check if email is being changed and if it's already taken
        if (email) {
            const existingAdmin = await Admin.findOne({ email, _id: { $ne: id } });
            if (existingAdmin) {
                return NextResponse.json(
                    { error: 'An admin with this email already exists' },
                    { status: 400 }
                );
            }
        }

        const admin = await Admin.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ admin }, { status: 200 });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
    }
}

// DELETE - Delete admin
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        // Prevent deleting the last admin
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 1) {
            return NextResponse.json(
                { error: 'Cannot delete the last admin' },
                { status: 400 }
            );
        }

        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
    }
}
