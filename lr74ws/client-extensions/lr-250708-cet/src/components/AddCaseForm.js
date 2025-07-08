
import React, { useState } from 'react';

const AddCaseForm = ({ onAddCase, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    caseNumber: '',
    status: 'En cours',
    priority: 'Moyenne',
    description: '',
    lawyer: '',
    court: '',
    nextHearing: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCase = {
      ...formData,
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      court: formData.court || undefined,
      nextHearing: formData.nextHearing || undefined
    };

    onAddCase(newCase);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Nouveau dossier juridique
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du dossier *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="Ex: Affaire de divorce Martin vs Dupont"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de dossier *
            </label>
            <input
              type="text"
              value={formData.caseNumber}
              onChange={(e) => handleChange('caseNumber', e.target.value)}
              required
              placeholder="Ex: 2024-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              required
              placeholder="Nom du client"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avocat responsable *
            </label>
            <input
              type="text"
              value={formData.lawyer}
              onChange={(e) => handleChange('lawyer', e.target.value)}
              required
              placeholder="Nom de l'avocat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prochaine audience
            </label>
            <input
              type="date"
              value={formData.nextHearing}
              onChange={(e) => handleChange('nextHearing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tribunal
          </label>
          <input
            type="text"
            value={formData.court}
            onChange={(e) => handleChange('court', e.target.value)}
            placeholder="Ex: Tribunal de Grande Instance de Paris"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description détaillée du dossier..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Créer le dossier
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCaseForm;
