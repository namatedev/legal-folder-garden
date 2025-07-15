
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LegalCase, CaseStatus, CasePriority } from '@/types/legalCase';
import { NOMENCLATURES } from '@/config/nomenclature';
import { COURTS_OF_APPEAL, FIRST_INSTANCE_TRIBUNALS, getTribunalsByCourtOfAppeal, getCourtOfAppealById } from '@/config/courts';

interface AddCaseFormProps {
  onAddCase: (caseData: Omit<LegalCase, 'id'>) => void;
  onCancel: () => void;
  existingCases: LegalCase[];
}

const AddCaseForm = ({ onAddCase, onCancel, existingCases }: AddCaseFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    year: new Date().getFullYear().toString(),
    nomenclatureCode: '',
    incrementalNumber: '',
    status: 'En cours' as CaseStatus,
    priority: 'Moyenne' as CasePriority,
    description: '',
    lawyer: '',
    court: '',
    courtOfAppeal: '',
    firstInstanceTribunal: '',
    nextHearing: ''
  });

  const generateCaseNumber = () => {
    if (formData.year && formData.nomenclatureCode && formData.incrementalNumber) {
      return `${formData.year}/${formData.nomenclatureCode}/${formData.incrementalNumber.padStart(3, '0')}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomenclatureCode) {
      alert('Veuillez sélectionner une nomenclature');
      return;
    }

    if (!formData.courtOfAppeal) {
      alert('Veuillez sélectionner une cour d\'appel');
      return;
    }

    if (!formData.year || !formData.incrementalNumber) {
      alert('Veuillez remplir l\'année et le numéro de dossier');
      return;
    }

    const caseNumber = generateCaseNumber();

    // Vérifier si le numéro de dossier existe déjà
    const existingCase = existingCases.find(c => c.caseNumber === caseNumber);
    if (existingCase) {
      alert('Ce numéro de dossier existe déjà. Veuillez choisir un autre numéro.');
      return;
    }

    const newCase: Omit<LegalCase, 'id'> = {
      title: formData.title,
      client: formData.client,
      caseNumber: caseNumber,
      status: formData.status,
      priority: formData.priority,
      description: formData.description,
      lawyer: formData.lawyer,
      court: formData.court || undefined,
      courtOfAppeal: formData.courtOfAppeal,
      firstInstanceTribunal: formData.firstInstanceTribunal || undefined,
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
  const previewCaseNumber = generateCaseNumber();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            Nouveau dossier juridique
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Titre et Client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm">Titre du dossier *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                placeholder="Ex: Affaire de divorce Martin vs Dupont"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="client" className="text-sm">Client *</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
                required
                placeholder="Nom du client"
                className="h-9"
              />
            </div>
          </div>

          {/* Numéro de dossier */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="year" className="text-sm">Année *</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                required
                placeholder="2024"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nomenclature" className="text-sm">Nomenclature *</Label>
              <Select value={formData.nomenclatureCode} onValueChange={(value) => handleChange('nomenclatureCode', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Code" />
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
            <div className="space-y-1">
              <Label htmlFor="incrementalNumber" className="text-sm">N° dossier *</Label>
              <Input
                id="incrementalNumber"
                type="number"
                min="1"
                value={formData.incrementalNumber}
                onChange={(e) => handleChange('incrementalNumber', e.target.value)}
                required
                placeholder="001"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Aperçu</Label>
              <div className="h-9 flex items-center px-3 bg-blue-50 border border-blue-200 rounded text-sm font-medium text-blue-800">
                {previewCaseNumber || 'yyyy/code/000'}
              </div>
            </div>
          </div>

          {/* Avocat et Statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="lawyer" className="text-sm">Avocat responsable *</Label>
              <Input
                id="lawyer"
                value={formData.lawyer}
                onChange={(e) => handleChange('lawyer', e.target.value)}
                required
                placeholder="Nom de l'avocat"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="text-sm">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="priority" className="text-sm">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tribunaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="courtOfAppeal" className="text-sm">Cour d'Appel *</Label>
              <Select value={formData.courtOfAppeal} onValueChange={(value) => {
                handleChange('courtOfAppeal', value);
                handleChange('firstInstanceTribunal', '');
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner la cour d'appel" />
                </SelectTrigger>
                <SelectContent>
                  {COURTS_OF_APPEAL.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.arabicName} - {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="firstInstanceTribunal" className="text-sm">Tribunal de 1ère Instance</Label>
              <Select 
                value={formData.firstInstanceTribunal} 
                onValueChange={(value) => handleChange('firstInstanceTribunal', value)}
                disabled={!formData.courtOfAppeal}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sélectionner le tribunal" />
                </SelectTrigger>
                <SelectContent>
                  {formData.courtOfAppeal && getTribunalsByCourtOfAppeal(formData.courtOfAppeal).map((tribunal) => (
                    <SelectItem key={tribunal.id} value={tribunal.id}>
                      {tribunal.arabicName} - {tribunal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tribunal libre et Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="court" className="text-sm">Tribunal (description libre)</Label>
              <Input
                id="court"
                value={formData.court}
                onChange={(e) => handleChange('court', e.target.value)}
                placeholder="Ex: Tribunal de Commerce..."
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nextHearing" className="text-sm">Prochaine audience</Label>
              <Input
                id="nextHearing"
                type="date"
                value={formData.nextHearing}
                onChange={(e) => handleChange('nextHearing', e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description détaillée du dossier..."
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onCancel} size="sm">
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Créer le dossier
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCaseForm;
