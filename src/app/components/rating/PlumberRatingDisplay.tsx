import React from 'react';
import { Star, TrendingUp, TrendingDown, Award, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface PlumberRatingStats {
  overallRating: number;
  totalReviews: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
  googleReviewsPosted: number;
  recentTrend: 'up' | 'down' | 'stable';
  last30DaysRating: number;
}

interface PlumberRatingDisplayProps {
  stats: PlumberRatingStats;
  showDetailed?: boolean;
}

export function PlumberRatingDisplay({ stats, showDetailed = true }: PlumberRatingDisplayProps) {
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
    }[size];

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingLabel = (rating: number): string => {
    if (rating >= 4.8) return 'Exceptionnel';
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Très bon';
    if (rating >= 3.5) return 'Bon';
    if (rating >= 3.0) return 'Acceptable';
    return 'À améliorer';
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const ratingDistribution = [
    { stars: 5, count: stats.fiveStars, color: 'bg-green-600' },
    { stars: 4, count: stats.fourStars, color: 'bg-blue-600' },
    { stars: 3, count: stats.threeStars, color: 'bg-yellow-600' },
    { stars: 2, count: stats.twoStars, color: 'bg-orange-600' },
    { stars: 1, count: stats.oneStar, color: 'bg-red-600' },
  ];

  const getPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              Votre cote de satisfaction
            </CardTitle>
            <CardDescription>Basée sur {stats.totalReviews} évaluations</CardDescription>
          </div>

          {stats.recentTrend === 'up' && (
            <Badge className="bg-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              En hausse
            </Badge>
          )}
          {stats.recentTrend === 'down' && (
            <Badge variant="destructive">
              <TrendingDown className="h-3 w-3 mr-1" />
              En baisse
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className={`text-6xl font-bold ${getRatingColor(stats.overallRating)}`}>
              {stats.overallRating.toFixed(1)}
            </span>
            <div className="text-left">
              {renderStars(stats.overallRating, 'lg')}
              <p className={`text-sm font-medium mt-1 ${getRatingColor(stats.overallRating)}`}>
                {getRatingLabel(stats.overallRating)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{stats.totalReviews} avis</span>
            </div>

            {stats.googleReviewsPosted > 0 && (
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-blue-600" />
                <span>{stats.googleReviewsPosted} sur Google</span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Breakdown */}
        {showDetailed && stats.totalReviews > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Répartition des notes</h4>

            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>

                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${getPercentage(item.count)}%` }}
                    />
                  </div>
                </div>

                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Performance */}
        {showDetailed && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Performance (30 derniers jours)
              </span>
              <span className={`text-lg font-bold ${getRatingColor(stats.last30DaysRating)}`}>
                {stats.last30DaysRating.toFixed(1)} / 5.0
              </span>
            </div>

            <Progress
              value={(stats.last30DaysRating / 5) * 100}
              className="h-2"
            />

            {stats.last30DaysRating > stats.overallRating && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Vous vous améliorez! Continuez comme ça!
              </p>
            )}

            {stats.last30DaysRating < stats.overallRating && (
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Performance en baisse récemment. Revoyez vos derniers jobs.
              </p>
            )}
          </div>
        )}

        {/* Google Reviews Notice */}
        {stats.googleReviewsPosted > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">{stats.googleReviewsPosted} avis 5 étoiles</span>{' '}
              ont été automatiquement publiés sur Google Reviews
            </p>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Note de confidentialité:</p>
          <p>
            Les clients ne peuvent pas voir votre cote avant de vous engager. Votre note moyenne
            est visible uniquement par vous et l'équipe interne.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
