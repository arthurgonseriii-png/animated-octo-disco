import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { MASTER_ADMIN_USER, MASTER_ADMIN_PASS } from '../constants';

const AuthPage = ({ handleLogin, error }) => {
  const [username, setUsername] = useState(MASTER_ADMIN_USER);
  const [password, setPassword] = useState(MASTER_ADMIN_PASS);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100">
      <Card title="BQC-Nav Login" className="w-full max-w-md space-y-6" titleIcon={Lock}>
        <div className="text-center">
          <p className="text-gray-600">Vistra Energy Plant I&C Access</p>
        </div>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}
        <Input id="username" label="Username (Email)" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={() => handleLogin(username, password)} className="w-full">
          <Lock size={18} className="mr-2" /> Secure Sign In
        </Button>
        <p className="text-xs text-center text-gray-500 mt-4">Default Admin: arthur.gonser1@yahoo.com / Hollywood1</p>
      </Card>
    </div>
  );
};

export default AuthPage;
