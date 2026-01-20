import React from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { SubscriptionTier, SUBSCRIPTION_TIERS } from '../../types/subscription';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  currentTier?: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  billingCycle: 'monthly' | 'yearly';
}

const TierIcon = ({ tier }: { tier: SubscriptionTier }) => {
  switch (tier) {
    case SubscriptionTier.BRONZE:
      return <Zap className="h-6 w-6" />;
    case SubscriptionTier.SILVER:
      return <Star className="h-6 w-6" />;
    case SubscriptionTier.GOLD:
      return <Crown className="h-6 w-6" />;
  }
};

export function SubscriptionTierCard({
  tier,
  currentTier,
  onSelect,
  billingCycle,
}: SubscriptionTierCardProps) {
  const config = SUBSCRIPTION_TIERS[tier];
  const isCurrentTier = currentTier === tier;
  const isUpgrade = currentTier && tier > currentTier;
  const isDowngrade = currentTier && tier < currentTier;

  const price = billingCycle === 'monthly' ? config.pricing.monthlyPrice : config.pricing.yearlyPrice;
  const displayPrice = billingCycle === 'monthly' ? price : Math.floor(price / 12);
  const savings = billingCycle === 'yearly' ? config.pricing.monthlyPrice * 12 - config.pricing.yearlyPrice : 0;

  const featureList = [
    config.features.receiveServiceCalls && 'Réception d\'appels de service',
    config.features.automaticBilling && 'Facturation automatique',
    config.features.manualInvoicing && 'Factures manuelles',
    config.features.onlineQuotes && 'Soumissions en ligne',
    config.features.accountingManagement && 'Gestion comptable complète',
    config.features.bankReconciliation && 'Conciliations bancaires automatiques',
    config.features.quarterlyReports && 'Rapports trimestriels',
    config.features.aiAccountant && 'Assistant comptable IA',
    config.features.maxJobsPerMonth !== 'unlimited' && `Maximum ${config.features.maxJobsPerMonth} jobs/mois`,
    config.features.maxJobsPerMonth === 'unlimited' && 'Jobs illimités',
    config.features.prioritySupport && 'Support prioritaire',
    config.features.dedicatedAccountManager && 'Gestionnaire de compte dédié',
  ].filter(Boolean) as string[];

  return (
    <Card
      className={`relative transition-all duration-200 ${
        config.popular ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'
      } ${isCurrentTier ? 'ring-2 ring-primary' : ''}`}
      style={{
        borderTopColor: config.color,
        borderTopWidth: '4px',
      }}
    >
      {config.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Plus populaire
        </Badge>
      )}

      {isCurrentTier && (
        <Badge className="absolute -top-3 right-4 bg-green-600">
          Votre abonnement
        </Badge>
      )}

      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            <TierIcon tier={tier} />
          </div>
        </div>

        <CardTitle className="text-2xl font-bold">{config.name}</CardTitle>
        <CardDescription className="mt-2">{config.description}</CardDescription>

        <div className="mt-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">{displayPrice} $</span>
            <span className="text-muted-foreground">/mois</span>
          </div>
          {billingCycle === 'yearly' && (
            <p className="text-sm text-muted-foreground mt-2">
              Facturé {config.pricing.yearlyPrice} $ / an
            </p>
          )}
          {savings > 0 && (
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
              Économisez {savings} $ / an
            </Badge>
          )}
        </div>

        {config.pricing.trialDays > 0 && !isCurrentTier && (
          <Badge variant="secondary" className="mt-4">
            Essai gratuit de 6 mois
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {featureList.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className="w-full"
          size="lg"
          variant={isCurrentTier ? 'outline' : 'default'}
          disabled={isCurrentTier}
          onClick={() => onSelect(tier)}
          style={
            !isCurrentTier
              ? {
                  backgroundColor: config.color,
                  color: '#fff',
                }
              : undefined
          }
        >
          {isCurrentTier && 'Abonnement actuel'}
          {!isCurrentTier && !currentTier && 'Commencer l\'essai gratuit'}
          {isUpgrade && 'Mettre à niveau'}
          {isDowngrade && 'Rétrograder'}
        </Button>
      </CardFooter>
    </Card>
  );
}
