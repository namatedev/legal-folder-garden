import { Calendar, User, FileText, AlertCircle, Eye, Trash2 } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LegalCase } from '@/types/legalCase';
import { getCourtOfAppealById, getFirstInstanceTribunalById } from '@/config/courts';

interface LegalCaseListViewProps {
  cases: LegalCase[];
  onEdit: (caseId: string) => void;
  onDelete?: (caseId: string) => void;
}

const LegalCaseListView = ({ cases, onEdit, onDelete }: LegalCaseListViewProps) => {
  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="py-2 px-3 text-xs font-medium">Dossier</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Parties</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Avocat</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Cour d'Appel</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Statut</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Priorité</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Prochaine audience</TableHead>
            <TableHead className="py-2 px-3 text-xs font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((legalCase) => (
            <TableRow key={legalCase.id} className="hover:bg-gray-50 h-12">
              <TableCell className="py-2 px-3">
                <div>
                  <div className="font-medium text-gray-900 text-sm leading-tight">{legalCase.title}</div>
                  <div className="text-xs text-gray-500">N° {legalCase.caseNumber}</div>
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-blue-600" />
                  <span className="text-xs">{legalCase.client}</span>
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-blue-600" />
                  <span className="text-xs">{legalCase.lawyer}</span>
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <div className="text-xs text-gray-600">
                  {legalCase.courtOfAppeal && (
                    <div className="text-right" style={{ direction: 'rtl' }}>
                      {getCourtOfAppealById(legalCase.courtOfAppeal)?.arabicName || legalCase.courtOfAppeal}
                    </div>
                  )}
                  {legalCase.firstInstanceTribunal && (
                    <div className="text-gray-500 text-xs mt-1" style={{ direction: 'rtl' }}>
                      {getFirstInstanceTribunalById(legalCase.firstInstanceTribunal)?.arabicName || legalCase.firstInstanceTribunal}
                    </div>
                  )}
                  {!legalCase.courtOfAppeal && !legalCase.firstInstanceTribunal && (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <Badge className={`${getStatusColor(legalCase.status)} text-xs px-2 py-0.5`}>
                  {legalCase.status}
                </Badge>
              </TableCell>
              <TableCell className="py-2 px-3">
                <Badge className={`${getPriorityColor(legalCase.priority)} text-xs px-2 py-0.5`}>
                  {legalCase.priority}
                </Badge>
              </TableCell>
              <TableCell className="py-2 px-3">
                {legalCase.nextHearing ? (
                  <div className="flex items-center gap-1 text-xs">
                    <AlertCircle className="h-3 w-3 text-blue-600" />
                    {new Date(legalCase.nextHearing).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </TableCell>
              <TableCell className="py-2 px-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {new Date(legalCase.createdDate).toLocaleDateString('fr-FR')}
                </div>
              </TableCell>
              <TableCell className="py-2 px-3">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(legalCase.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                  
                  {onDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LegalCaseListView;
