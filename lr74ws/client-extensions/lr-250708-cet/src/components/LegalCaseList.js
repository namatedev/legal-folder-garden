
import React, { useState } from 'react';
import LegalCaseCard from './LegalCaseCard';
import AddCaseForm from './AddCaseForm';

const LegalCaseList = ({ cases, onAddCase, onEditCase }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = cases.filter(legalCase => {
    const matchesSearch = legalCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legalCase.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         legalCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || legalCase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddCase = (caseData) => {
    onAddCase(caseData);
    setShowAddForm(false);
  };

  const getStatusCounts = () => {
    return cases.reduce((acc, legalCase) => {
      acc[legalCase.status] = (acc[legalCase.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <AddCaseForm
          onAddCase={handleAddCase}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold">⚖️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dossiers Juridiques</h1>
                <p className="text-sm text-gray-600">Gestion des affaires en cours</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              + Nouveau dossier
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts['En cours'] || 0}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts['Terminé'] || 0}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts['En attente'] || 0}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher par titre, client ou numéro de dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Cases Display */}
        {filteredCases.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <span className="text-6xl text-gray-300 mb-4 block">⚖️</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Aucun dossier trouvé' : 'Aucun dossier'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier dossier juridique'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <button 
                onClick={() => setShowAddForm(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                + Créer un dossier
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((legalCase) => (
              <LegalCaseCard
                key={legalCase.id}
                legalCase={legalCase}
                onEdit={onEditCase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalCaseList;
