import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminClaimArbitration } from '../../components/aftersales/AdminClaimArbitration';
import { AfterSalesClaimType } from '../../types/aftersales';

// Mock claim data for arbitration
const mockClaim = {
  id: 'CLAIM-004',
  type: AfterSalesClaimType.WARRANTY,
  clientName: 'Sophie Leblanc',
  plumberName: 'Michel Lacoste',
  description: 'Le robinet installé fuit légèrement. J\'ai remarqué des gouttes d\'eau qui s\'accumulent sous l\'évier.',
  photos: [
    { id: '1', url: '/photo1.jpg' },
    { id: '2', url: '/photo2.jpg' },
  ],
  plumberResponse: {
    action: 'dispute' as const,
    explanation: 'Le robinet a été installé correctement selon les normes. La fuite pourrait être due à une surpression dans le système de plomberie du bâtiment, ce qui n\'est pas de ma responsabilité. J\'ai vérifié tous les raccords et ils sont bien serrés.',
    submittedAt: new Date('2026-01-20T14:30:00'),
  },
  holdAmount: 62.50,
  invoiceAmount: 250.00,
};

export default function AdminClaimArbitrationPage() {
  const navigate = useNavigate();
  const { claimId } = useParams();
  const [claim] = useState(mockClaim);

  const handleResolve = (resolution: any) => {
    console.log('Admin resolution:', resolution);

    // In production: Send to backend API
    // This would:
    // 1. Update claim status to 'resolved'
    // 2. Execute the chosen action (refund, new BET, etc.)
    // 3. Notify both client and plumber
    // 4. Release or redistribute held funds

    // Navigate back after a short delay
    setTimeout(() => {
      navigate('/admin/aftersales');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/aftersales')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux réclamations
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Arbitrage - Réclamation {claim.id}
          </h1>
          <p className="text-gray-600">
            Décision administrative requise
          </p>
        </div>

        {/* Arbitration Component */}
        <AdminClaimArbitration
          claim={claim}
          onResolve={handleResolve}
        />
      </div>
    </div>
  );
}
