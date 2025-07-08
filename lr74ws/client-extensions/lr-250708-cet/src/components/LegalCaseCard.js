
import React from 'react';
import { LegalCase } from '../types/legalCase';

const LegalCaseCard = ({ legalCase, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Terminé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Annulé':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Moyenne':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Basse':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-l-blue-600 p-6" onClick={() => onEdit(legalCase.id)}>
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {legalCase.title}
          </h3>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(legalCase.priority)}`}>
              {legalCase.priority}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(legalCase.status)}`}>
              {legalCase.status}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Dossier n° {legalCase.caseNumber}
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              <strong>Client:</strong> {legalCase.client}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              <strong>Avocat:</strong> {legalCase.lawyer}
            </span>
          </div>
        </div>
        
        {legalCase.nextHearing && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
            <span className="text-sm text-blue-800">
              <strong>Prochaine audience:</strong> {new Date(legalCase.nextHearing).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2">
          {legalCase.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div>
            Créé le {new Date(legalCase.createdDate).toLocaleDateString('fr-FR')}
          </div>
          <div>
            Mis à jour le {new Date(legalCase.lastUpdate).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalCaseCard;
