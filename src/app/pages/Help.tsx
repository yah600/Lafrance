import { Search, Book, Video, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function Help() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Centre d'aide</h1>
        <p className="text-gray-600 mt-1">Trouvez des réponses à vos questions</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher dans l'aide..."
            className="pl-10 text-lg py-6"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Book className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Guides complets et tutoriels
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir la documentation
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Video className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Vidéos tutoriels</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Apprenez en regardant
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir les vidéos
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat en direct</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Obtenez de l'aide immédiate
            </p>
            <Button variant="outline" size="sm">
              Démarrer le chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Comment créer un nouveau travail?</AccordionTrigger>
              <AccordionContent>
                Pour créer un nouveau travail, cliquez sur le bouton "Nouveau travail" dans le Dashboard ou le Centre de Dispatch.
                Remplissez les informations du client, le type de service, la date et l'heure, puis assignez un technicien ou utilisez
                l'auto-assignation IA.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Comment assigner un technicien à un travail?</AccordionTrigger>
              <AccordionContent>
                Dans le Centre de Dispatch, vous pouvez glisser-déposer les travaux sur les techniciens dans la vue Kanban,
                ou utiliser la fonction d'auto-dispatch IA qui sélectionnera automatiquement le meilleur technicien disponible
                en fonction de la proximité, des compétences et de la charge de travail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Comment suivre la localisation des techniciens?</AccordionTrigger>
              <AccordionContent>
                Allez dans "Carte GPS" dans le menu principal. Vous verrez la position en temps réel de tous vos techniciens actifs,
                ainsi que l'emplacement des travaux planifiés. Cliquez sur un marqueur pour voir plus de détails.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Comment générer une facture?</AccordionTrigger>
              <AccordionContent>
                Les factures peuvent être générées automatiquement à partir d'un travail complété. Allez dans "Factures" puis
                "Nouvelle facture", sélectionnez le travail et les items à facturer. Le système calculera automatiquement
                les taxes (TPS/TVQ) et générera un PDF.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Comment utiliser l'Assistant IA?</AccordionTrigger>
              <AccordionContent>
                Cliquez sur le bouton violet "Assistant IA" en haut à droite ou sur l'icône flottante en bas à droite.
                Vous pouvez poser des questions en langage naturel comme "Qui est disponible cet après-midi?" ou
                "Créer un travail urgent pour Jean Dupont". L'IA vous guidera dans vos tâches.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Comment ajouter un nouveau client?</AccordionTrigger>
              <AccordionContent>
                Allez dans la section "Clients" et cliquez sur "Nouveau client". Remplissez les informations de contact,
                l'adresse et le type de client (résidentiel ou commercial). Vous pouvez aussi créer un client directement
                lors de la création d'un nouveau travail.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Comment exporter les rapports?</AccordionTrigger>
              <AccordionContent>
                Dans la section "Rapports", sélectionnez la période désirée et cliquez sur "Exporter". Vous pouvez
                exporter en format PDF ou Excel. Les rapports incluent les revenus, les travaux complétés, la performance
                des techniciens et la satisfaction client.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>L'app mobile est-elle disponible pour les techniciens?</AccordionTrigger>
              <AccordionContent>
                Oui! Les techniciens peuvent accéder à l'app mobile à /mobile. Ils peuvent voir leurs travaux du jour,
                marquer les travaux comme complétés, naviguer vers les adresses, et communiquer avec le bureau.
                L'authentification se fait par code PIN ou biométrie.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide supplémentaire?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email Support</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  support@plomberie.com
                </p>
                <p className="text-xs text-muted-foreground">
                  Réponse sous 24h
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Téléphone</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  +1 514-555-HELP (4357)
                </p>
                <p className="text-xs text-muted-foreground">
                  Lun-Ven: 9h-17h
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
