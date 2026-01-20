import React from 'react';
import { MapPin, Star, Languages, Clock, DollarSign, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bid, Language } from '../../types/bidding';

interface BidCardProps {
  bid: Bid;
  isWinner?: boolean;
  canAccept?: boolean;
  onAccept?: (bidId: string) => void;
}

const languageLabels: Record<Language, string> = {
  [Language.FRENCH]: 'Français',
  [Language.ENGLISH]: 'English',
  [Language.SPANISH]: 'Español',
};

export function BidCard({ bid, isWinner = false, canAccept = false, onAccept }: BidCardProps) {
  const initials = bid.plumberName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      className={`transition-all ${
        isWinner
          ? 'border-green-500 border-2 bg-green-50'
          : 'border-gray-200 hover:border-primary hover:shadow-md'
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={bid.plumberPhoto || undefined} alt={bid.plumberName} />
              <AvatarFallback className="bg-primary text-white text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">{bid.plumberName}</h3>

              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{bid.plumberRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-1">(234 avis)</span>
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{bid.distanceFromJob.toFixed(1)} km</span>
                </div>

                {bid.eta && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{bid.eta} min</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isWinner && (
            <Badge className="bg-green-600">
              <Check className="h-4 w-4 mr-1" />
              Gagnant
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Montant soumis</p>
            <p className="text-2xl font-bold text-primary flex items-baseline">
              {bid.bidAmount}
              <span className="text-base font-normal ml-1">$ CAD</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Durée estimée</p>
            <p className="text-2xl font-bold text-gray-900 flex items-baseline">
              {bid.estimatedDuration}
              <span className="text-base font-normal ml-1">min</span>
            </p>
          </div>
        </div>

        {bid.selectedTimeSlot && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700 font-medium mb-1">Plage horaire proposée</p>
            <p className="text-sm text-blue-900">
              {new Date(bid.selectedTimeSlot.date).toLocaleDateString('fr-CA')} •{' '}
              {bid.selectedTimeSlot.startTime} - {bid.selectedTimeSlot.endTime}
            </p>
          </div>
        )}

        {bid.message && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Message du plombier</p>
            <p className="text-sm text-gray-700 italic">"{bid.message}"</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {bid.languagesSpoken.map((lang) => (
            <Badge key={lang} variant="outline" className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              {languageLabels[lang]}
            </Badge>
          ))}

          {bid.hasRBQ && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              ✓ RBQ
            </Badge>
          )}

          {bid.hasInsurance && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              ✓ Assuré
            </Badge>
          )}
        </div>

        {canAccept && !isWinner && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => onAccept?.(bid.id)}
          >
            <Check className="h-4 w-4 mr-2" />
            Accepter cette offre
          </Button>
        )}

        {isWinner && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
            <p className="text-sm text-green-800 font-medium">
              ✓ Offre acceptée - Le plombier a été notifié
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3 text-center">
          Soumis le {new Date(bid.submittedAt).toLocaleString('fr-CA')}
        </p>
      </CardContent>
    </Card>
  );
}
