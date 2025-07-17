
import { Calendar, User, FileText, AlertCircle, Trash2, Eye, Scale, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LegalDossier } from '@/types/dossier';

interface LegalCaseCardProps {
  legalCase: LegalDossier;
  onEdit: (caseId: string) => void;
  onDelete?: (caseId: string) => void;
}

const LegalCaseCard = ({ legalCase, onEdit, onDelete }: LegalCaseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Closed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'On Hold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Construct case number from 2nd instance + 1st instance if exists
  const constructCaseNumber = () => {
    const dossier2 = legalCase.numeroCompletDossier2Instance;
    const dossier1 = legalCase.numeroCompletDossier1Instance;
    
    if (dossier2 && dossier1) {
      return `${dossier2} / ${dossier1}`;
    }
    return dossier2 || legalCase.caseNumber;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
            {legalCase.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(legalCase.priority)}>
              {legalCase.priority}
            </Badge>
            <Badge className={getStatusColor(legalCase.status)}>
              {legalCase.status}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Dossier n° {constructCaseNumber()}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              <strong>Client:</strong> {legalCase.client}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              <strong>Juge rapporteur:</strong> {legalCase.jugeRapporteur || 'Non assigné'}
            </span>
          </div>
        </div>
        
        {/* Court Information */}
        <div className="space-y-2">
          {legalCase.juridiction2Instance && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                <strong>Cour d'Appel:</strong> {legalCase.juridiction2Instance}
              </span>
            </div>
          )}
          {legalCase.juridiction1Instance && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                <strong>Tribunal de 1ère Instance:</strong> {legalCase.juridiction1Instance}
              </span>
            </div>
          )}
        </div>

        {/* Additional Liferay Fields */}
        <div className="grid grid-cols-1 gap-2">
          {legalCase.libEntite && (
            <div className="text-sm text-gray-600">
              <strong>Entité:</strong> {legalCase.libEntite}
            </div>
          )}
          {legalCase.typeRequete && (
            <div className="text-sm text-gray-600">
              <strong>Type requête:</strong> {legalCase.typeRequete}
            </div>
          )}
          {legalCase.libelleDernierJugemen && (
            <div className="text-sm text-gray-600">
              <strong>Libellé dernier jugement:</strong> {legalCase.libelleDernierJugemen}
            </div>
          )}
        </div>
        
        {legalCase.nextHearing && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              <strong>Prochaine audience:</strong> {new Date(legalCase.nextHearing).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-2">
          {legalCase.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Créé le {new Date(legalCase.dateOpened).toLocaleDateString('fr-FR')}
          </div>
          <div>
            Mis à jour le {new Date(legalCase.lastActivity).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(legalCase.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir
          </Button>
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le dossier</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer le dossier "{legalCase.title}" ? 
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(legalCase.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalCaseCard;
