import React from 'react';
import Card from './Card';
import { User as UserIcon } from 'lucide-react';

const Profile = ({ user }) => (
    <Card title={`User Profile: ${user.name}`} titleIcon={UserIcon}>
        <div className="space-y-4">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
        </div>
    </Card>
);

export default Profile;
