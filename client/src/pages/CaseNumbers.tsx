
import { Scale, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CaseNumberManager from '@/components/CaseNumberManager';
import { useLocation } from 'wouter';

const CaseNumbers = () => {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Numéros de Dossier</h1>
                <p className="text-sm text-gray-600">Gestion et attribution des numéros</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <CaseNumberManager />
      </div>
    </div>
  );
};

export default CaseNumbers;
