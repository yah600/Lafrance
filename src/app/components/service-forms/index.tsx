export { default as DrainUnblockingForm } from './DrainUnclockingForm';
export { default as BackwaterValveForm } from './BackwaterValveForm';
export { default as WaterHeaterForm } from './WaterHeaterForm';
export { default as SumpPumpForm } from './SumpPumpForm';

export type ServiceFormType = 'drain-unblocking' | 'backwater-valve' | 'water-heater' | 'sump-pump';

export interface ServiceFormData {
  jobId: string;
  serviceType: ServiceFormType;
  formData: any;
  completedAt: string;
  technicianId: string;
}
