'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { FormulaireEvaluation, FormulaireQuestion } from './formulaires-evaluation.dto';

/** Renders one question as its input, by `type_question`. Reused by the future filling flow. */
function QuestionField({
  question,
  value,
  onChange,
}: {
  question: FormulaireQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  switch (question.type_question) {
    case 'textarea':
      return <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />;
    case 'number':
      return <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} />;
    case 'date':
      return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
    case 'boolean':
      return (
        <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="oui" id={`${question.code}-oui`} />
            <Label htmlFor={`${question.code}-oui`} className="font-normal">
              Oui
            </Label>
          </div>
          <div className="flex items-center gap-1.5">
            <RadioGroupItem value="non" id={`${question.code}-non`} />
            <Label htmlFor={`${question.code}-non`} className="font-normal">
              Non
            </Label>
          </div>
        </RadioGroup>
      );
    case 'select':
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner…" />
          </SelectTrigger>
          <SelectContent>
            {(question.options ?? []).map((o, i) => (
              <SelectItem key={i} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
  }
}

function PreviewBody({ formulaire }: { formulaire: FormulaireEvaluation }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const questions = [...formulaire.questions]
    .filter((q) => q.affichage)
    .sort((a, b) => a.ordre - b.ordre);

  return (
    <>
      <SheetHeader>
        <SheetTitle>{formulaire.libelle}</SheetTitle>
        <SheetDescription>
          Aperçu du questionnaire — public cible : {formulaire.public_cible}.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Info className="size-4 shrink-0" />
          Aperçu — vous pouvez tester la saisie, mais l&apos;enregistrement des réponses sera
          disponible une fois le stockage côté backend en place.
        </div>

        {questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ce formulaire n&apos;a aucune question affichée.
          </p>
        ) : (
          questions.map((q) => {
            const key = String(q.id ?? q.code);
            return (
              <div key={key} className="space-y-1.5">
                <Label className="text-sm">
                  {q.libelle}
                  {q.obligatoire && <span className="text-destructive"> *</span>}
                </Label>
                <QuestionField
                  question={q}
                  value={answers[key] ?? ''}
                  onChange={(v) => setAnswers((a) => ({ ...a, [key]: v }))}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

/** Read-only preview of a formulaire, rendered as it will appear when filled. */
export function FormulairePreviewSheet({
  formulaire,
  onClose,
}: {
  formulaire: FormulaireEvaluation | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={formulaire !== null}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-xl">
        {formulaire && <PreviewBody key={formulaire.id} formulaire={formulaire} />}
      </SheetContent>
    </Sheet>
  );
}
