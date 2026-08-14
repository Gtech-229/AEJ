'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import type {
  CreateFormulairePayload,
  FormulaireEvaluation,
  TypeQuestion,
} from './formulaires-evaluation.dto';
import { PUBLIC_CIBLE_OPTIONS, TYPE_QUESTION_OPTIONS } from './formulaires-evaluation.constants';
import {
  useCreateFormulaireEvaluation,
  useUpdateFormulaireEvaluation,
} from './formulaires-evaluation.hooks';

interface QuestionDraft {
  code: string;
  libelle: string;
  type_question: TypeQuestion;
  options: string[];
  affichage: boolean;
  obligatoire: boolean;
}

interface Draft {
  code: string;
  libelle: string;
  public_cible: string;
  actif: boolean;
  questions: QuestionDraft[];
}

const blankQuestion = (n: number): QuestionDraft => ({
  code: `Q${String(n).padStart(3, '0')}`,
  libelle: '',
  type_question: 'text',
  options: [],
  affichage: true,
  obligatoire: false,
});

function toDraft(source: FormulaireEvaluation | 'new'): Draft {
  if (source === 'new') {
    return { code: '', libelle: '', public_cible: 'promoteur', actif: true, questions: [] };
  }
  return {
    code: source.code,
    libelle: source.libelle,
    public_cible: source.public_cible,
    actif: source.actif,
    questions: [...source.questions]
      .sort((a, b) => a.ordre - b.ordre)
      .map((q) => ({
        code: q.code,
        libelle: q.libelle,
        type_question: q.type_question,
        options: q.options ?? [],
        affichage: q.affichage,
        obligatoire: q.obligatoire,
      })),
  };
}

/** The builder body — keyed by the target formulaire so it re-inits on open. */
function BuilderBody({
  formulaire,
  onClose,
}: {
  formulaire: FormulaireEvaluation | 'new';
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(formulaire));
  const create = useCreateFormulaireEvaluation();
  const update = useUpdateFormulaireEvaluation();
  const isSaving = create.isPending || update.isPending;

  const setQuestion = (i: number, patch: Partial<QuestionDraft>) =>
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)),
    }));

  const addQuestion = () =>
    setDraft((d) => ({ ...d, questions: [...d.questions, blankQuestion(d.questions.length + 1)] }));

  const removeQuestion = (i: number) =>
    setDraft((d) => ({ ...d, questions: d.questions.filter((_, idx) => idx !== i) }));

  const moveQuestion = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.questions.length) return d;
      const next = [...d.questions];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, questions: next };
    });

  const questionValid = (q: QuestionDraft) =>
    !!q.code.trim() &&
    !!q.libelle.trim() &&
    (q.type_question !== 'select' || q.options.some((o) => o.trim()));
  const canSubmit =
    !!draft.code.trim() &&
    !!draft.libelle.trim() &&
    draft.questions.length > 0 &&
    draft.questions.every(questionValid);

  function submit() {
    if (!canSubmit) return;
    const payload: CreateFormulairePayload = {
      code: draft.code.trim(),
      libelle: draft.libelle.trim(),
      public_cible: draft.public_cible,
      actif: draft.actif,
      questions: draft.questions.map((q, i) => ({
        code: q.code.trim(),
        libelle: q.libelle.trim(),
        type_question: q.type_question,
        options: q.type_question === 'select' ? q.options.filter((o) => o.trim()) : null,
        ordre: i + 1,
        affichage: q.affichage,
        obligatoire: q.obligatoire,
      })),
    };
    if (formulaire === 'new') create.mutate(payload, { onSuccess: onClose });
    else update.mutate({ ...payload, id: formulaire.id }, { onSuccess: onClose });
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {formulaire === 'new' ? 'Nouveau formulaire' : `Modifier — ${formulaire.libelle}`}
        </SheetTitle>
        <SheetDescription>
          Définissez le questionnaire et ses questions (type, options, ordre).
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        {/* Formulaire fields */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Code *">
            <Input
              value={draft.code}
              placeholder="ex: EVAL-PROMO-001"
              onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
            />
          </Field>
          <Field label="Public cible *">
            <Select
              value={draft.public_cible}
              onValueChange={(v) => setDraft((d) => ({ ...d, public_cible: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PUBLIC_CIBLE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Libellé *" className="sm:col-span-2">
            <Input
              value={draft.libelle}
              placeholder="ex: Évaluation des promoteurs"
              onChange={(e) => setDraft((d) => ({ ...d, libelle: e.target.value }))}
            />
          </Field>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              checked={draft.actif}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, actif: v }))}
            />
            <Label className="font-normal">Formulaire actif</Label>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Questions ({draft.questions.length})
            </h3>
            <Button size="sm" variant="outline" className="cursor-pointer" onClick={addQuestion}>
              <Plus className="size-4" />
              Ajouter une question
            </Button>
          </div>

          {draft.questions.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Aucune question — ajoutez-en au moins une.
            </p>
          )}

          {draft.questions.map((q, i) => (
            <QuestionCard
              key={i}
              index={i}
              total={draft.questions.length}
              question={q}
              onChange={(patch) => setQuestion(i, patch)}
              onRemove={() => removeQuestion(i)}
              onMove={(dir) => moveQuestion(i, dir)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t px-4 py-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button className="cursor-pointer" disabled={!canSubmit || isSaving} onClick={submit}>
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </>
  );
}

function QuestionCard({
  index,
  total,
  question,
  onChange,
  onRemove,
  onMove,
}: {
  index: number;
  total: number;
  question: QuestionDraft;
  onChange: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <GripVertical className="size-3.5" />
          Question {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 cursor-pointer"
            disabled={index === 0}
            aria-label="Monter"
            onClick={() => onMove(-1)}
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 cursor-pointer"
            disabled={index === total - 1}
            aria-label="Descendre"
            onClick={() => onMove(1)}
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 cursor-pointer text-destructive"
            aria-label="Supprimer"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Input
        value={question.libelle}
        placeholder="Intitulé de la question"
        onChange={(e) => onChange({ libelle: e.target.value })}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Code">
          <Input
            value={question.code}
            placeholder="ex: Q001"
            onChange={(e) => onChange({ code: e.target.value })}
          />
        </Field>
        <Field label="Type">
          <Select
            value={question.type_question}
            onValueChange={(v) => onChange({ type_question: v as TypeQuestion })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_QUESTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {question.type_question === 'select' && (
        <OptionsEditor
          options={question.options}
          onChange={(options) => onChange({ options })}
        />
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch
            checked={question.affichage}
            onCheckedChange={(v) => onChange({ affichage: v })}
          />
          Affichée
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Switch
            checked={question.obligatoire}
            onCheckedChange={(v) => onChange({ obligatoire: v })}
          />
          Obligatoire
        </label>
      </div>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  return (
    <div className="space-y-2 rounded-md bg-muted/40 p-3">
      <Label className="text-xs text-muted-foreground">Choix possibles</Label>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={opt}
            placeholder={`Choix ${i + 1}`}
            onChange={(e) => onChange(options.map((o, idx) => (idx === i ? e.target.value : o)))}
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 cursor-pointer text-destructive"
            aria-label="Retirer"
            onClick={() => onChange(options.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => onChange([...options, ''])}
      >
        <Plus className="size-4" />
        Ajouter un choix
      </Button>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `space-y-1.5 ${className}` : 'space-y-1.5'}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

/** Controlled builder Sheet — open when `formulaire` is non-null. */
export function FormulaireBuilderSheet({
  formulaire,
  onClose,
}: {
  formulaire: FormulaireEvaluation | 'new' | null;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={formulaire !== null}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-2xl">
        {formulaire !== null && (
          <BuilderBody
            key={formulaire === 'new' ? 'new' : formulaire.id}
            formulaire={formulaire}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
