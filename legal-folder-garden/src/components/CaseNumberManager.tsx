
import { useState } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface CaseNumber {
  id: string;
  number: string;
  year: string;
  description?: string;
  isUsed: boolean;
}

const CaseNumberManager = () => {
  const [caseNumbers, setCaseNumbers] = useState<CaseNumber[]>([
    { id: '1', number: '2024-001', year: '2024', description: 'Affaire de divorce Martin vs Dupont', isUsed: true },
    { id: '2', number: '2024-002', year: '2024', description: 'Litige commercial TechCorp vs StartupXYZ', isUsed: true },
    { id: '3', number: '2024-003', year: '2024', description: 'Succession de Mme Leclerc', isUsed: true },
    { id: '4', number: '2024-004', year: '2024', description: 'Défense pénale - Affaire Roussel', isUsed: true },
    { id: '5', number: '2024-005', year: '2024', isUsed: false },
    { id: '6', number: '2024-006', year: '2024', isUsed: false },
  ]);

  const [newNumber, setNewNumber] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNumber, setEditingNumber] = useState('');

  const handleAddNumber = () => {
    if (!newNumber.trim()) {
      toast.error('Veuillez saisir un numéro de dossier');
      return;
    }

    const fullNumber = `${newYear}-${newNumber.padStart(3, '0')}`;
    
    // Vérifier si le numéro existe déjà
    if (caseNumbers.some(cn => cn.number === fullNumber)) {
      toast.error('Ce numéro de dossier existe déjà');
      return;
    }

    const newCaseNumber: CaseNumber = {
      id: Date.now().toString(),
      number: fullNumber,
      year: newYear,
      isUsed: false
    };

    setCaseNumbers(prev => [...prev, newCaseNumber]);
    setNewNumber('');
    toast.success('Numéro de dossier ajouté avec succès');
  };

  const handleEditNumber = (caseNumber: CaseNumber) => {
    setEditingId(caseNumber.id);
    setEditingNumber(caseNumber.number);
  };

  const handleSaveEdit = () => {
    if (!editingNumber.trim()) {
      toast.error('Veuillez saisir un numéro valide');
      return;
    }

    // Vérifier si le nouveau numéro existe déjà (sauf pour le numéro actuel)
    if (caseNumbers.some(cn => cn.number === editingNumber && cn.id !== editingId)) {
      toast.error('Ce numéro de dossier existe déjà');
      return;
    }

    setCaseNumbers(prev => 
      prev.map(cn => 
        cn.id === editingId 
          ? { ...cn, number: editingNumber }
          : cn
      )
    );

    setEditingId(null);
    setEditingNumber('');
    toast.success('Numéro de dossier modifié avec succès');
  };

  const handleDeleteNumber = (id: string) => {
    const caseNumber = caseNumbers.find(cn => cn.id === id);
    if (caseNumber?.isUsed) {
      toast.error('Impossible de supprimer un numéro utilisé dans un dossier');
      return;
    }

    setCaseNumbers(prev => prev.filter(cn => cn.id !== id));
    toast.success('Numéro de dossier supprimé');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNumber('');
  };

  const availableNumbers = caseNumbers.filter(cn => !cn.isUsed);
  const usedNumbers = caseNumbers.filter(cn => cn.isUsed);

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter nouveau numéro de dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="2024"
                className="w-24"
              />
            </div>
            <div className="flex-2">
              <Label htmlFor="number">Numéro séquentiel</Label>
              <Input
                id="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="001"
                maxLength={3}
              />
            </div>
            <Button onClick={handleAddNumber} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Format final: {newYear}-{newNumber.padStart(3, '0') || '000'}
          </p>
        </CardContent>
      </Card>

      {/* Numéros disponibles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Numéros disponibles ({availableNumbers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableNumbers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun numéro disponible</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableNumbers.map((caseNumber) => (
                <div key={caseNumber.id} className="border rounded-lg p-3 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    {editingId === caseNumber.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingNumber}
                          onChange={(e) => setEditingNumber(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Button size="sm" onClick={handleSaveEdit} className="h-8 px-2">
                          ✓
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8 px-2">
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="font-mono font-semibold text-green-800">
                          {caseNumber.number}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditNumber(caseNumber)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNumber(caseNumber.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Numéros utilisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Numéros utilisés ({usedNumbers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usedNumbers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun numéro utilisé</p>
          ) : (
            <div className="space-y-2">
              {usedNumbers.map((caseNumber) => (
                <div key={caseNumber.id} className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-blue-800">
                        {caseNumber.number}
                      </span>
                      {caseNumber.description && (
                        <p className="text-sm text-gray-600 mt-1">{caseNumber.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Utilisé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseNumberManager;
