'use client';

import { useMemo, useState } from 'react';
import { Search, Mail, Phone, ChevronDown, ChevronRight, LifeBuoy } from 'lucide-react';
import { PageHeader } from '@/components/legacy-ui/PageHeader';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FAQ_SECTIONS, type FaqItem, type FaqSection } from './aide.data';

function filterSections(sections: FaqSection[], query: string): FaqSection[] {
  const q = query.trim().toLowerCase();
  if (!q) return sections;

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
      ),
    }))
    .filter((section) => section.items.length > 0);
}

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between gap-3 py-3 text-left">
        <span className="text-sm font-medium text-gray-800">{item.question}</span>
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-gray-400" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-3 pr-7">
        <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AidePage() {
  const [search, setSearch] = useState('');
  const filteredSections = useMemo(() => filterSections(FAQ_SECTIONS, search), [search]);
  const totalResults = filteredSections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-6 py-6 max-w-4xl mx-auto">
      <PageHeader
        title="Besoin d'aide ?"
        subtitle="Questions fréquentes et support pour l'espace Agence"
      />

      {/* Recherche */}
      <div className="mt-6 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une question (ex : stagiaire, budget, rôle...)"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                     focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20 transition-all"
        />
      </div>

      {/* FAQ */}
      <div className="mt-6 space-y-4">
        {filteredSections.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Aucun résultat pour « {search} ». Essayez un autre mot-clé, ou contactez le support ci-dessous.
            </p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{section.title}</h3>
              <div className="divide-y divide-gray-100">
                {section.items.map((item) => (
                  <FaqAccordionItem key={item.question} item={item} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {search && (
        <p className="mt-3 text-xs text-gray-400 text-center">
          {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
        </p>
      )}

      {/* Contact support */}
      <div
        className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ backgroundColor: '#1a7a3c' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <LifeBuoy className="text-white size-5" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Vous ne trouvez pas de réponse ?</p>
            <p className="text-white/70 text-xs mt-0.5">
              Notre équipe support est disponible du lundi au vendredi, 8h–17h.
            </p>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <a
            href="mailto:support@aej.gouv.ci"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <Mail size={14} />
            support@aej.gouv.ci
          </a>
          <a
            href="tel:+2252700000000"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-sm font-semibold text-white border border-white/30 hover:bg-white/20 transition-colors"
          >
            <Phone size={14} />
            +225 27 00 00 00 00
          </a>
        </div>
      </div>
    </div>
  );
}
