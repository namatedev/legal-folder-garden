
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LegalCase, CaseStatus, CasePriority } from '@/types/legalCase';
import { NOMENCLATURES } from '@/config/nomenclature';
import { COURTS_OF_APPEAL, getTribunalsByCourtOfAppeal } from '@/config/courts';

interface AddCaseFormProps {
  onAddCase: (caseData: Omit<LegalCase, 'id'>) => void;
  onCancel: () => void;
  existingCases: LegalCase[];
}

const formSchema = z.object({
  title: z.string().min(1, 'Le titre du dossier est obligatoire'),
  client: z.string().min(1, 'Le nom du client est obligatoire'),
  year: z.string().min(4, 'L\'année est obligatoire').max(4, 'L\'année doit avoir 4 chiffres'),
  nomenclatureCode: z.string().min(1, 'La nomenclature est obligatoire'),
  incrementalNumber: z.string().min(1, 'Le numéro de dossier est obligatoire'),
  status: z.enum(['En cours', 'En attente', 'Terminé', 'Annulé']),
  priority: z.enum(['High', 'Medium', 'Low']),
  description: z.string().optional(),
  lawyer: z.string().min(1, 'L\'avocat responsable est obligatoire'),
  court: z.string().optional(),
  courtOfAppeal: z.string().min(1, 'La cour d\'appel est obligatoire'),
  firstInstanceTribunal: z.string().optional(),
  nextHearing: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const AddCaseForm = ({ onAddCase, onCancel, existingCases }: AddCaseFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      client: '',
      year: new Date().getFullYear().toString(),
      nomenclatureCode: '',
      incrementalNumber: '',
      status: 'En cours',
      priority: 'Medium',
      description: '',
      lawyer: '',
      court: '',
      courtOfAppeal: '',
      firstInstanceTribunal: '',
      nextHearing: ''
    }
  });

  const generateCaseNumber = (year: string, nomenclatureCode: string, incrementalNumber: string) => {
    if (year && nomenclatureCode && incrementalNumber) {
      return `${year}/${nomenclatureCode}/${incrementalNumber}`;
    }
    return '';
  };

  const onSubmit = (data: FormData) => {
    const caseNumber = generateCaseNumber(data.year, data.nomenclatureCode, data.incrementalNumber);

    // Vérifier si le numéro de dossier existe déjà
    const existingCase = existingCases.find(c => c.caseNumber === caseNumber);
    if (existingCase) {
      form.setError('incrementalNumber', {
        type: 'manual',
        message: 'Ce numéro de dossier existe déjà. Veuillez choisir un autre numéro.'
      });
      return;
    }

    const newCase: Omit<LegalCase, 'id'> = {
      title: data.title,
      client: data.client,
      caseNumber: caseNumber,
      status: data.status,
      priority: data.priority,
      description: data.description || '',
      lawyer: data.lawyer,
      court: data.court || undefined,
      courtOfAppeal: data.courtOfAppeal,
      firstInstanceTribunal: data.firstInstanceTribunal || undefined,
      nextHearing: data.nextHearing || undefined,
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      caseType: 'Civil',
      assignedAttorney: data.lawyer,
      dateOpened: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      documentCount: 0
    };

    onAddCase(newCase);
  };

  const watchedValues = form.watch(['year', 'nomenclatureCode', 'incrementalNumber']);
  const previewCaseNumber = generateCaseNumber(watchedValues[0], watchedValues[1], watchedValues[2]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3">
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Titre et Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Titre du dossier *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Affaire de divorce Martin vs Dupont"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Client *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nom du client"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Numéro de dossier */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Année *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="2000"
                        max="2100"
                        placeholder="2024"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomenclatureCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nomenclature *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NOMENCLATURES.map((nomenclature) => (
                          <SelectItem key={nomenclature.code} value={nomenclature.code}>
                            {nomenclature.code} - {nomenclature.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incrementalNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">N° dossier *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        placeholder="1"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-1">
                <Label className="text-sm">Aperçu</Label>
                <div className="h-8 flex items-center px-3 bg-blue-50 border border-blue-200 rounded text-sm font-medium text-blue-800">
                  {previewCaseNumber || 'yyyy/code/1'}
                </div>
              </div>
            </div>

            {/* Avocat et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="lawyer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Avocat responsable *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nom de l'avocat"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">Haute</SelectItem>
                        <SelectItem value="Medium">Moyenne</SelectItem>
                        <SelectItem value="Low">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tribunaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="courtOfAppeal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Cour d'Appel *</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('firstInstanceTribunal', '');
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Sélectionner la cour d'appel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COURTS_OF_APPEAL.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            {court.arabicName} - {court.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstInstanceTribunal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Tribunal de 1ère Instance</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!form.watch('courtOfAppeal')}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Sélectionner le tribunal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {form.watch('courtOfAppeal') && getTribunalsByCourtOfAppeal(form.watch('courtOfAppeal')).map((tribunal) => (
                          <SelectItem key={tribunal.id} value={tribunal.id}>
                            {tribunal.arabicName} - {tribunal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tribunal libre et Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="court"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Tribunal (description libre)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Tribunal de Commerce..."
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextHearing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Prochaine audience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="h-8"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description détaillée du dossier..."
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddCaseForm;
