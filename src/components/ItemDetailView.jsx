import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Input from './Input';

const ItemDetailView = ({ item, onBack, onSave, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  if (!item) {
    return (
      <Card title="Item Not Found">
        <p>The requested item could not be found or you don't have permission to view it.</p>
        <Button onClick={onBack} className="mt-4"><ArrowLeft className="mr-2" />Back to List</Button>
      </Card>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack}><ArrowLeft className="mr-2" />Back</Button>
        {canEdit && !isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-blue-500"><Edit className="mr-2" />Edit</Button>
        )}
      </div>
      <Card title={isEditing ? `Editing: ${item.name}` : (item.name || 'Item Detail')}>
        {isEditing ? (
          <div className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-500 uppercase">{key}</label>
                <Input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  disabled={key === 'id' || key === 'createdByUid'}
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-6">
              <Button onClick={() => setIsEditing(false)} className="bg-gray-300"><X className="mr-2" />Cancel</Button>
              <Button onClick={handleSave} className="bg-green-500"><Save className="mr-2" />Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="flex flex-col py-2 border-b">
                <span className="text-sm font-semibold text-gray-500 uppercase">{key}</span>
                <span className="text-lg text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ItemDetailView;
