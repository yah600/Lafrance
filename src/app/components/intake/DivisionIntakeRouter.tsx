/**
 * Division-Specific Service Intake Router
 * Routes to appropriate intake form based on division
 * Implements update.md Section 3.1 - Division-Specific Intake Fields
 */

import { DivisionType } from '../../types/user';
import PlomberieIntakeForm from './PlomberieIntakeForm';
import ToituresIntakeForm from './ToituresIntakeForm';
import IsolationIntakeForm from './IsolationIntakeForm';
import ConteneursIntakeForm from './ConteneursIntakeForm';
import GouttiereIntakeForm from './GouttiereIntakeForm';
import PatioIntakeForm from './PatioIntakeForm';
import MaisonCashIntakeForm from './MaisonCashIntakeForm';
import ConstructionIntakeForm from './ConstructionIntakeForm';

interface DivisionIntakeRouterProps {
  division: DivisionType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function DivisionIntakeRouter({ division, onSubmit, onCancel }: DivisionIntakeRouterProps) {
  switch (division) {
    case 'plomberie':
      return <PlomberieIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'construction':
      return <ConstructionIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'toitures':
      return <ToituresIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'isolation':
      return <IsolationIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'conteneurs':
      return <ConteneursIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'gutters':
      return <GouttiereIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'decks':
      return <PatioIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    case 'real-estate':
      return <MaisonCashIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
    default:
      return <PlomberieIntakeForm onSubmit={onSubmit} onCancel={onCancel} />;
  }
}
