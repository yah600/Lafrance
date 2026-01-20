import React, { useState } from 'react';
import { Star, MessageSquare, Download, ThumbsUp, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plumberName: string;
  jobId: string;
  invoiceId: string;
  onRatingSubmit: (rating: number, comment: string) => void;
}

export function RatingModal({
  open,
  onOpenChange,
  plumberName,
  jobId,
  invoiceId,
  onRatingSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit rating
      await onRatingSubmit(rating, comment);

      // Different messages based on rating
      if (rating === 5) {
        toast.success('Merci! Votre avis sera publié sur Google Reviews', {
          duration: 5000,
          description: 'Vous pouvez maintenant télécharger votre facture.',
        });
      } else if (rating >= 4) {
        toast.success('Merci pour votre évaluation!', {
          description: 'Vous pouvez maintenant télécharger votre facture.',
        });
      } else {
        toast.success('Merci pour votre retour. Nous allons vous contacter sous peu.', {
          description: 'Nous prenons votre satisfaction très au sérieux.',
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la soumission de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex justify-center gap-2 py-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`h-12 w-12 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingMessage = () => {
    const selectedRating = hoveredRating || rating;

    if (selectedRating === 0) return 'Cliquez sur les étoiles pour évaluer';
    if (selectedRating === 1) return 'Très insatisfait';
    if (selectedRating === 2) return 'Insatisfait';
    if (selectedRating === 3) return 'Neutre';
    if (selectedRating === 4) return 'Satisfait';
    if (selectedRating === 5) return 'Très satisfait - Excellent!';
  };

  const getRatingColor = () => {
    const selectedRating = hoveredRating || rating;

    if (selectedRating <= 2) return 'text-red-600';
    if (selectedRating === 3) return 'text-orange-600';
    if (selectedRating === 4) return 'text-blue-600';
    if (selectedRating === 5) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Évaluez votre expérience
          </DialogTitle>
          <DialogDescription className="text-center">
            Votre avis est important pour nous et aide {plumberName} à s'améliorer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Pour télécharger votre facture payée:</p>
                <p>Vous devez obligatoirement évaluer le service reçu.</p>
              </div>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            {renderStars()}
            <p className={`text-center font-semibold text-lg ${getRatingColor()}`}>
              {getRatingMessage()}
            </p>
          </div>

          {/* Google Reviews Badge (5 stars) */}
          {(rating === 5 || hoveredRating === 5) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <ThumbsUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Merci! Votre avis sera publié sur Google Reviews</p>
                  <p>Cela aide d'autres clients à choisir {plumberName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Internal Contact Notice (≤3 stars) */}
          {rating <= 3 && rating > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Nous allons vous contacter</p>
                  <p>Votre satisfaction est notre priorité. Nous prendrons contact avec vous pour comprendre et résoudre tout problème.</p>
                </div>
              </div>
            </div>
          )}

          {/* Comment Section */}
          <div>
            <Label htmlFor="comment" className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4" />
              Commentaire {rating === 5 ? '(optionnel)' : '(recommandé)'}
            </Label>
            <Textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                rating <= 3
                  ? 'Dites-nous ce qui n\'a pas fonctionné...'
                  : rating === 4
                  ? 'Comment pourrions-nous améliorer notre service?'
                  : 'Partagez votre expérience positive...'
              }
              className="resize-none"
            />
            {rating === 5 && comment && (
              <p className="text-xs text-gray-500 mt-1">
                Ce commentaire sera inclus dans la publication Google Reviews
              </p>
            )}
          </div>

          {/* Plumber Info */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
            <p>
              <span className="font-medium">Plombier:</span> {plumberName}
            </p>
            <p className="text-xs text-gray-500 mt-1">Job #{jobId}</p>
          </div>

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? (
              'Envoi en cours...'
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Soumettre mon évaluation
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Votre facture sera disponible immédiatement après la soumission
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
