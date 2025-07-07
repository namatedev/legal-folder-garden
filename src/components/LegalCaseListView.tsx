
import { Calendar, User, FileText, AlertCircle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LegalCase } from '@/types/legalCase';

interface LegalCaseListViewProps {
  cases: LegalCase[];
  onEdit: (caseId: string) => void;
}

const LegalCaseListView = ({ cases, onEdit }: LegalCaseListViewProps) => {
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
          <TableRow>
            <TableHead>Dossier</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Avocat</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Prochaine audience</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((legalCase) => (
            <TableRow key={legalCase.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <div className="font-semibold text-gray-900">{legalCase.title}</div>
                  <div className="text-sm text-gray-600">N° {legalCase.caseNumber}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{legalCase.client}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{legalCase.lawyer}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(legalCase.status)}>
                  {legalCase.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(legalCase.priority)}>
                  {legalCase.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {legalCase.nextHearing ? (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    {new Date(legalCase.nextHearing).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {new Date(legalCase.createdDate).toLocaleDateString('fr-FR')}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(legalCase.id)}
                  className="h-8"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LegalCaseListView;
