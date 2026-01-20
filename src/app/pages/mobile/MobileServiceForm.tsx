import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import ServiceFormSelector from '../../components/service-forms/ServiceFormSelector';
import type { ServiceFormType } from '../../components/service-forms';
import { toast } from 'sonner';

export default function MobileServiceForm() {
  const { jobId: urlJobId } = useParams<{ jobId?: string }>();
  const location = useLocation();
  const jobId = urlJobId || location.state?.jobId;
  const navigate = useNavigate();
  const [formCompleted, setFormCompleted] = useState(false);

  const handleFormComplete = (formType: ServiceFormType, data: any) => {
    console.log('Form completed:', formType, data);
    
    // TODO: Save form data to backend
    // TODO: Associate with job
    
    setFormCompleted(true);
    toast.success('Fiche technique enregistrée avec succès!');
    
    // Navigate back to job completion
    setTimeout(() => {
      navigate(`/mobile/job/${jobId}/completion`);
    }, 1500);
  };

  const handleCancel = () => {
    navigate(`/mobile/job/${jobId}/completion`);
  };

  if (formCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Fiche technique enregistrée!
          </h2>
          <p className="text-gray-600">
            Redirection vers la complétion du travail...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Fiche Technique</h1>
            <p className="text-sm text-gray-600">Job #{jobId}</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4">
        <ServiceFormSelector
          jobId={jobId || ''}
          onComplete={handleFormComplete}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}