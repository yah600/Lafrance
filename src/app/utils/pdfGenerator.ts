import jsPDF from 'jspdf';

export interface DrainReportData {
  jobId: string;
  clientName: string;
  clientAddress: string;
  date: string;
  technicianName: string;
  technicianLicense: string;
  location: string;
  initialSymptom: string;
  methodsUsed: string[];
  causeIdentified: string;
  snakeLength?: string;
  pipeCondition: number;
  recommendations: string;
  nextVisitDate?: string;
  photoBefore?: string;
  photoCause?: string;
  photoAfter?: string;
}

export interface BackwaterValveReportData {
  jobId: string;
  clientName: string;
  clientAddress: string;
  date: string;
  technicianName: string;
  technicianLicense: string;
  interventionType: string;
  valveType: string;
  brand: string;
  model: string;
  diameter: string;
  material: string;
  serialNumber?: string;
  warrantyDate?: string;
  photoAfter?: string;
}

export interface WaterHeaterReportData {
  jobId: string;
  clientName: string;
  clientAddress: string;
  date: string;
  technicianName: string;
  technicianLicense: string;
  interventionType: string;
  heaterType: string;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: string;
  yearManufactured: string;
  anodeCondition?: string;
  sedimentLevel?: string;
  temperatureSetting: string;
  pressureVerified: string;
  tpValveCondition: string;
  leaks: string;
  estimatedLifespan?: string;
  photoLabel?: string;
  photoAfter?: string;
}

export interface SumpPumpReportData {
  jobId: string;
  clientName: string;
  clientAddress: string;
  date: string;
  technicianName: string;
  technicianLicense: string;
  interventionType: string;
  brand: string;
  model: string;
  power: string;
  type: string;
  ageEstimated: string;
  functionalTest: string;
  evacuationTime?: string;
  floatCondition: string;
  checkValve: string;
  batteryBackup: string;
  basinCondition: string;
  photoPuisard?: string;
  photoAfter?: string;
}

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string) {
    // Company Logo Area (placeholder)
    doc.setFillColor(11, 83, 148); // Primary blue
    doc.rect(10, 10, 190, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Plomberie D\'Experts', 15, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Service professionnel de plomberie', 15, 29);
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 105, 50, { align: 'center' });
    
    // Separator line
    doc.setLineWidth(0.5);
    doc.setDrawColor(11, 83, 148);
    doc.line(10, 55, 200, 55);
  }

  private static addFooter(doc: jsPDF, pageNumber: number) {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, pageHeight - 20, 200, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Plomberie D\'Experts | Licence RBQ: 5678-1234-01', 105, pageHeight - 12, { align: 'center' });
    doc.text('Tél: 514-555-EXPERT | info@plomberiedexperts.ca', 105, pageHeight - 8, { align: 'center' });
    doc.text(`Page ${pageNumber}`, 195, pageHeight - 8, { align: 'right' });
  }

  private static addSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFillColor(93, 173, 226); // Light blue
    doc.rect(10, y, 190, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y + 6);
    
    doc.setTextColor(0, 0, 0);
    return y + 10;
  }

  private static addField(doc: jsPDF, label: string, value: string, y: number, indent: number = 15): number {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', indent, y);
    
    doc.setFont('helvetica', 'normal');
    const valueLines = doc.splitTextToSize(value, 120);
    doc.text(valueLines, indent + 50, y);
    
    return y + (valueLines.length * 5) + 2;
  }

  private static addImage(doc: jsPDF, imageData: string, label: string, y: number): number {
    if (!imageData) return y;
    
    try {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(label + ':', 15, y);
      
      // Add image (reduced size to fit page)
      doc.addImage(imageData, 'JPEG', 15, y + 2, 80, 60);
      
      return y + 65;
    } catch (error) {
      console.error('Error adding image:', error);
      return y;
    }
  }

  // RAPPORT D'INTERVENTION - DÉBOUCHAGE
  static generateDrainUnblockingReport(data: DrainReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 60;

    this.addHeader(doc, 'RAPPORT D\'INTERVENTION - DÉBOUCHAGE');

    // Client Information
    yPos = this.addSectionTitle(doc, 'INFORMATIONS CLIENT', yPos);
    yPos = this.addField(doc, 'Client', data.clientName, yPos);
    yPos = this.addField(doc, 'Adresse', data.clientAddress, yPos);
    yPos = this.addField(doc, 'Date', data.date, yPos);
    yPos = this.addField(doc, 'Technicien', `${data.technicianName} - Licence RBQ: ${data.technicianLicense}`, yPos);
    yPos += 5;

    // Problem Identified
    yPos = this.addSectionTitle(doc, 'PROBLÈME IDENTIFIÉ', yPos);
    if (data.photoBefore) {
      yPos = this.addImage(doc, data.photoBefore, 'Photo AVANT', yPos);
    }
    yPos = this.addField(doc, 'Localisation', data.location, yPos);
    yPos = this.addField(doc, 'Symptôme', data.initialSymptom, yPos);
    yPos += 5;

    // Intervention
    yPos = this.addSectionTitle(doc, 'INTERVENTION', yPos);
    yPos = this.addField(doc, 'Méthode(s)', data.methodsUsed.join(', '), yPos);
    if (data.snakeLength) {
      yPos = this.addField(doc, 'Longueur snake', `${data.snakeLength} pieds`, yPos);
    }
    yPos = this.addField(doc, 'Cause trouvée', data.causeIdentified, yPos);
    
    if (data.photoCause) {
      yPos = this.addImage(doc, data.photoCause, 'Photo de la cause', yPos);
    }
    yPos += 5;

    // Results - Check if new page needed
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    yPos = this.addSectionTitle(doc, 'RÉSULTAT', yPos);
    if (data.photoAfter) {
      yPos = this.addImage(doc, data.photoAfter, 'Photo APRÈS', yPos);
    }
    yPos = this.addField(doc, 'État des tuyaux', `${data.pipeCondition}/10`, yPos);
    yPos = this.addField(doc, 'Recommandations', data.recommendations, yPos);
    
    if (data.nextVisitDate) {
      yPos = this.addField(doc, 'Prochaine visite', data.nextVisitDate, yPos);
    }
    yPos += 10;

    // Signature section
    doc.setLineWidth(0.5);
    doc.line(15, yPos + 15, 80, yPos + 15);
    doc.setFontSize(9);
    doc.text('Signature du client', 15, yPos + 20);
    
    // Warranty
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Garantie: 30 jours sur ce débouchage', 15, yPos + 30);

    this.addFooter(doc, 1);

    return doc;
  }

  // CERTIFICAT DE CONFORMITÉ - CLAPET ANTI-RETOUR
  static generateBackwaterValveCertificate(data: BackwaterValveReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 60;

    // Special certificate header
    doc.setLineWidth(2);
    doc.setDrawColor(11, 83, 148);
    doc.rect(10, 10, 190, 260, 'D');
    
    doc.setFillColor(11, 83, 148);
    doc.rect(10, 10, 190, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICAT D\'INSTALLATION', 105, 22, { align: 'center' });
    doc.setFontSize(14);
    doc.text('CLAPET ANTI-RETOUR', 105, 32, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPos = 50;

    // Property Information
    yPos = this.addField(doc, 'PROPRIÉTÉ', data.clientAddress, yPos, 20);
    yPos = this.addField(doc, 'PROPRIÉTAIRE', data.clientName, yPos, 20);
    yPos = this.addField(doc, 'DATE D\'INSTALLATION', data.date, yPos, 20);
    yPos += 10;

    // Equipment Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ÉQUIPEMENT INSTALLÉ', 20, yPos);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;

    yPos = this.addField(doc, 'Type', data.valveType, yPos, 20);
    yPos = this.addField(doc, 'Marque', data.brand, yPos, 20);
    yPos = this.addField(doc, 'Modèle', data.model, yPos, 20);
    yPos = this.addField(doc, 'Diamètre', data.diameter, yPos, 20);
    yPos = this.addField(doc, 'Matériau', data.material, yPos, 20);
    if (data.serialNumber) {
      yPos = this.addField(doc, 'No. Série', data.serialNumber, yPos, 20);
    }
    yPos += 10;

    // Photo
    if (data.photoAfter) {
      yPos = this.addImage(doc, data.photoAfter, 'PHOTO DE L\'INSTALLATION', yPos);
      yPos += 5;
    }

    // Installer Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTALLÉ PAR', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;

    yPos = this.addField(doc, 'Entreprise', 'Plomberie D\'Experts', yPos, 20);
    yPos = this.addField(doc, 'Licence RBQ', data.technicianLicense, yPos, 20);
    yPos = this.addField(doc, 'Technicien', data.technicianName, yPos, 20);
    yPos += 10;

    // Warranty Information
    if (data.warrantyDate) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('GARANTIE', 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;

      yPos = this.addField(doc, 'Main d\'oeuvre', '1 an (jusqu\'au ' + data.warrantyDate + ')', yPos, 20);
      yPos = this.addField(doc, 'Fabricant', '5 ans', yPos, 20);
      yPos += 10;
    }

    // Important notice
    doc.setFillColor(255, 243, 205);
    doc.rect(15, yPos, 180, 20, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Ce document peut être requis par votre assureur.', 105, yPos + 8, { align: 'center' });
    doc.text('Conservez-le précieusement.', 105, yPos + 14, { align: 'center' });

    this.addFooter(doc, 1);

    return doc;
  }

  // FICHE D'ÉQUIPEMENT - CHAUFFE-EAU
  static generateWaterHeaterReport(data: WaterHeaterReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 60;

    this.addHeader(doc, 'FICHE D\'ÉQUIPEMENT - CHAUFFE-EAU');

    // Identification
    yPos = this.addSectionTitle(doc, 'IDENTIFICATION', yPos);
    yPos = this.addField(doc, 'Type', data.heaterType, yPos);
    yPos = this.addField(doc, 'Marque', data.brand, yPos);
    yPos = this.addField(doc, 'Modèle', data.model, yPos);
    yPos = this.addField(doc, 'No. Série', data.serialNumber, yPos);
    yPos = this.addField(doc, 'Capacité', data.capacity, yPos);
    yPos = this.addField(doc, 'Année fabrication', data.yearManufactured, yPos);
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(data.yearManufactured || currentYear.toString());
    yPos = this.addField(doc, 'Âge actuel', `${age} ans`, yPos);
    yPos += 5;

    // Photo
    if (data.photoLabel) {
      yPos = this.addImage(doc, data.photoLabel, 'PHOTO DE L\'ÉQUIPEMENT', yPos);
    }

    // Inspection
    yPos = this.addSectionTitle(doc, `INSPECTION DU ${data.date}`, yPos);
    yPos = this.addField(doc, 'Technicien', data.technicianName, yPos);
    yPos = this.addField(doc, 'Température', data.temperatureSetting + ' °C', yPos);
    yPos = this.addField(doc, 'Pression', data.pressureVerified + ' PSI', yPos);
    yPos = this.addField(doc, 'Valve T&P', data.tpValveCondition, yPos);
    
    if (data.anodeCondition) {
      yPos = this.addField(doc, 'Anode', data.anodeCondition, yPos);
    }
    if (data.sedimentLevel) {
      yPos = this.addField(doc, 'Sédiments', data.sedimentLevel, yPos);
    }
    yPos = this.addField(doc, 'Fuites', data.leaks, yPos);
    yPos += 5;

    // Lifespan
    if (data.estimatedLifespan) {
      yPos = this.addSectionTitle(doc, 'DURÉE DE VIE', yPos);
      yPos = this.addField(doc, 'Durée de vie moyenne', '10-12 ans', yPos);
      yPos = this.addField(doc, 'Estimation restante', data.estimatedLifespan + ' ans', yPos);
      
      // Visual status bar
      const lifespan = parseInt(data.estimatedLifespan);
      const barWidth = 100;
      const fillWidth = Math.min((lifespan / 12) * barWidth, barWidth);
      
      doc.setFillColor(200, 200, 200);
      doc.rect(15, yPos, barWidth, 5, 'F');
      
      if (lifespan > 5) {
        doc.setFillColor(46, 134, 171);
      } else if (lifespan > 3) {
        doc.setFillColor(230, 126, 34);
      } else {
        doc.setFillColor(231, 76, 60);
      }
      doc.rect(15, yPos, fillWidth, 5, 'F');
      
      yPos += 10;
    }

    // Recommendations
    yPos = this.addSectionTitle(doc, 'RECOMMANDATIONS', yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const recommendations = [
      '□ Flush annuel des sédiments',
      '□ Vérifier anode dans 2 ans',
      '□ Prévoir budget remplacement'
    ];
    recommendations.forEach(rec => {
      doc.text(rec, 15, yPos);
      yPos += 6;
    });

    this.addFooter(doc, 1);

    return doc;
  }

  // RAPPORT - POMPE DE PUISARD
  static generateSumpPumpReport(data: SumpPumpReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 60;

    this.addHeader(doc, 'RAPPORT D\'INSPECTION - POMPE DE PUISARD');

    // Client Information
    yPos = this.addSectionTitle(doc, 'INFORMATIONS CLIENT', yPos);
    yPos = this.addField(doc, 'Client', data.clientName, yPos);
    yPos = this.addField(doc, 'Adresse', data.clientAddress, yPos);
    yPos = this.addField(doc, 'Date', data.date, yPos);
    yPos = this.addField(doc, 'Technicien', `${data.technicianName} - Licence RBQ: ${data.technicianLicense}`, yPos);
    yPos += 5;

    // Equipment
    yPos = this.addSectionTitle(doc, 'ÉQUIPEMENT', yPos);
    if (data.photoPuisard) {
      yPos = this.addImage(doc, data.photoPuisard, 'Photo du puisard', yPos);
    }
    yPos = this.addField(doc, 'Marque/Modèle', `${data.brand} ${data.model}`, yPos);
    yPos = this.addField(doc, 'Puissance', data.power, yPos);
    yPos = this.addField(doc, 'Type', data.type, yPos);
    yPos = this.addField(doc, 'Âge estimé', data.ageEstimated, yPos);
    yPos += 5;

    // Test Results
    yPos = this.addSectionTitle(doc, 'RÉSULTATS DU TEST', yPos);
    yPos = this.addField(doc, 'Test fonctionnel', data.functionalTest, yPos);
    
    if (data.evacuationTime) {
      yPos = this.addField(doc, 'Temps d\'évacuation', data.evacuationTime + ' secondes', yPos);
    }
    
    yPos = this.addField(doc, 'Flotteur', data.floatCondition, yPos);
    yPos = this.addField(doc, 'Clapet de retenue', data.checkValve, yPos);
    yPos = this.addField(doc, 'Batterie backup', data.batteryBackup, yPos);
    yPos = this.addField(doc, 'État du bassin', data.basinCondition, yPos);
    yPos += 5;

    // After Photo
    if (data.photoAfter) {
      yPos = this.addImage(doc, data.photoAfter, 'Photo APRÈS intervention', yPos);
    }

    // Recommendations
    yPos += 5;
    yPos = this.addSectionTitle(doc, 'RECOMMANDATIONS', yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const recommendations: string[] = [];
    if (data.batteryBackup === 'Absente') {
      recommendations.push('⚠ Installation d\'un système de batterie backup recommandée');
    }
    if (data.functionalTest === 'Échoué') {
      recommendations.push('⚠ Remplacement de la pompe requis');
    }
    if (data.floatCondition === 'Coincé') {
      recommendations.push('⚠ Remplacement du flotteur requis');
    }
    
    recommendations.push('□ Test semestriel recommandé (printemps et automne)');
    recommendations.push('□ Nettoyage annuel du bassin');
    
    recommendations.forEach(rec => {
      doc.text(rec, 15, yPos);
      yPos += 6;
    });

    this.addFooter(doc, 1);

    return doc;
  }

  // Helper method to download PDF
  static downloadPDF(doc: jsPDF, filename: string) {
    doc.save(filename);
  }

  // Helper method to open PDF in new tab
  static openPDF(doc: jsPDF) {
    window.open(doc.output('bloburl'), '_blank');
  }
}
