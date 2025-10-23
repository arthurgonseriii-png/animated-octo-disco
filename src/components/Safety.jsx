import React from 'react';
import Card from './Card';
import { ShieldCheck } from 'lucide-react';

const Safety = ({ user, safetyChecklists, db }) => {
  return (
    <Card title="Safety Checklists" titleIcon={ShieldCheck}>
      This module is for creating and reviewing daily safety checklists to ensure compliance.
    </Card>
  );
};

export default Safety;
