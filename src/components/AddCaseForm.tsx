import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalCase, CaseStatus, CasePriority } from '@/types/legalCase';
import { NOMENCLATURES, getNextCaseNumber } from '@/config/nomenclature';

interface AddCaseFormProps {
  onAddCase: (caseData: Omit<LegalCase, 'id'>) => void;
  onCancel: () => void;
  existingCases: LegalCase[];
}

const AddCaseForm = ({ onAddCase, onCancel, existingCases }: AddCaseFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    caseNumber: '',
    nomenclatureCode: '',
    status: 'En cours' as CaseStatus,
    priority: 'Moyenne' as CasePriority,
    description: '',
    lawyer: '',
    court: '',
    nextHearing: ''
  });

  const handleNomenclatureChange = (code: string) => {
    const newCaseNumber = getNextCaseNumber(code, existingCases);
    setFormData(prev => ({
      ...prev,
      nomenclatureCode: code,
      caseNumber: newCaseNumber
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomenclatureCode) {
      alert('Veuillez sélectionner une nomenclature');
      return;
    }

    const newCase: Omit<LegalCase, 'id'> = {
      title: formData.title,
      client: formData.client,
      caseNumber: formData.caseNumber,
      status: formData.status,
      priority: formData.priority,
      description: formData.description,
      lawyer: formData.lawyer,
      court: formData.court || undefined,
      nextHearing: formData.nextHearing || undefined,
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    onAddCase(newCase);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedNomenclature = NOMENCLATURES.find(n => n.code === formData.nomenclatureCode);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">
            Nouveau dossier juridique
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du dossier *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                placeholder="Ex: Affaire de divorce Martin vs Dupont"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomenclature">Nomenclature *</Label>
              <Select value={formData.nomenclatureCode} onValueChange={handleNomenclatureChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la nomenclature" />
                </SelectTrigger>
                <SelectContent>
                  {NOMENCLATURES.map((nomenclature) => (
                    <SelectItem key={nomenclature.code} value={nomenclature.code}>
                      {nomenclature.code} - {nomenclature.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.caseNumber && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-blue-900">Numéro de dossier généré</Label>
                  <p className="text-lg font-bold text-blue-800">{formData.caseNumber}</p>
                  {selectedNomenclature && (
                    <p className="text-xs text-blue-600">
                      {selectedNomenclature.label} ({selectedNomenclature.arabicLabel})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
                required
                placeholder="Nom du client"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lawyer">Avocat responsable *</Label>
              <Input
                id="lawyer"
                value={formData.lawyer}
                onChange={(e) => handleChange('lawyer', e.target.value)}
                required
                placeholder="Nom de l'avocat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextHearing">Prochaine audience</Label>
              <Input
                id="nextHearing"
                type="date"
                value={formData.nextHearing}
                onChange={(e) => handleChange('nextHearing', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="court">Tribunal</Label>
            <Input
              id="court"
              value={formData.court}
              onChange={(e) => handleChange('court', e.target.value)}
              placeholder="Ex: Tribunal de Grande Instance de Paris"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description détaillée du dossier..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Créer le dossier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCaseForm;
