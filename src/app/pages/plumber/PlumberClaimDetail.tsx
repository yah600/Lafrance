import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlumberClaimResponse } from '../../components/aftersales/PlumberClaimResponse';
import { AfterSalesPriority, AfterSalesClaimType } from '../../types/aftersales';
import { toast } from 'sonner';

// Mock claim data
const mockClaim = {
  id: 'CLAIM-001',
  invoiceId: 'INV-2026-001',
  jobId: 'JOB-456',
  type: AfterSalesClaimType.WARRANTY,
  priority: AfterSalesPriority.URGENT,
  description: 'La fuite est revenue après 2 jours. L\'eau coule encore sous l\'évier.',
  photos: [
    { id: '1', url: '/photo1.jpg' },
    { id: '2', url: '/photo2.jpg' },
  ],
  createdAt: new Date('2026-01-22T10:30:00'),
  status: 'pending',
  holdAmount: 71.86,
  clientName: 'Jean Tremblay',
  address: '1234 Rue Principale, Montréal, QC H1A 1A1',
};

export default function PlumberClaimDetail() {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const [claim, setClaim] = useState(mockClaim);

  const handleAccept = (response: string, appointmentDate?: Date) => {
    console.log('Claim accepted:', { response, appointmentDate });

    // Update claim status
    setClaim((prev) => ({
      ...prev,
      status: 'accepted',
      plumberResponse: {
        action: 'accept',
        explanation: response,
        appointmentDate,
        submittedAt: new Date(),
      },
    }));

    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/plumber/aftersales');
    }, 2000);

    // In production: Send to backend API
  };

  const handleDispute = (response: string) => {
    console.log('Claim disputed:', { response });

    // Update claim status
    setClaim((prev) => ({
      ...prev,
      status: 'disputed',
      plumberResponse: {
        action: 'dispute',
        explanation: response,
        submittedAt: new Date(),
      },
    }));

    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/plumber/aftersales');
    }, 2000);

    // In production: Send to backend API
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/plumber/aftersales')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux réclamations
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réclamation {claim.id}
          </h1>
          <p className="text-gray-600">{claim.clientName}</p>
        </div>

        {/* Claim Response Component */}
        <PlumberClaimResponse
          claim={claim}
          onAccept={handleAccept}
          onDispute={handleDispute}
        />
      </div>
    </div>
  );
}
