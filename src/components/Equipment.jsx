import React from 'react';
import Card from './Card';
import { Wrench } from 'lucide-react';

const Equipment = ({ user, equipment, db }) => {
  return (
    <Card title="Equipment Tracking" titleIcon={Wrench}>
      This module is for adding and monitoring all plant equipment by tag number and location.
    </Card>
  );
};

export default Equipment;
