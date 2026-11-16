import { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TextArea } from '../ui/TextArea';
import { simulateHeuristic } from '../../utils/heuristicSimulator';

const presets = [
  {
    title: 'Sin Wi-Fi antes de reunión',
    description: 'No tengo internet y necesito conectarme antes de la reunión con el cliente.',
    icon: '⌁',
  },
  {
    title: 'Cuenta bloqueada en SAP',
    description: 'Mi cuenta está bloqueada y no me deja entrar a SAP.',
    icon: '◈',
  },
  {
    title: 'Monitor no enciende',
    description: 'El monitor no enciende y no puedo trabajar.',
    icon: '▣',
  },
];

export function HeroInteractiveDemo() {
  const [title, setTitle] = useState(presets[0].title);
  const [description, setDescription] = useState(presets[0].description);
  const result = useMemo(() => simulateHeuristic(title, description), [description, title]);

  function selectPreset(preset: (typeof presets)[number]) {
    setTitle(preset.title);
    setDescription(preset.description);
  }

  return (
    <section className="demo-card" aria-label="Simulador de clasificación de tickets">
      <div className="demo-card__topline">
        <span className="demo-live"><span /> Demo interactiva</span>
        <span className="demo-card__caption">Clasificación en tiempo real</span>
      </div>
      <div className="demo-presets" aria-label="Ejemplos de solicitudes">
        {presets.map((preset) => (
          <Button
            variant="chip"
            className={title === preset.title ? 'is-active' : ''}
            key={preset.title}
            type="button"
            aria-pressed={title === preset.title}
            onClick={() => selectPreset(preset)}
          >
            <span aria-hidden="true">{preset.icon}</span>{preset.title}
          </Button>
        ))}
      </div>
      <TextArea
        label="Cuéntanos qué está pasando"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          setTitle('');
        }}
        rows={3}
        placeholder="Describe tu solicitud…"
      />
      <div className="demo-output" aria-live="polite">
        <div className="demo-output__header">
          <div>
            <span className="eyebrow">Resultado sugerido</span>
            <h3>La IA organiza la solicitud</h3>
          </div>
          <span className="status-dot" aria-label="Actualizado en vivo" />
        </div>
        <div className="demo-result-grid">
          <div className="demo-result-cell">
            <span>Categoría</span>
            <strong>{result.categoriaSugerida}</strong>
          </div>
          <div className="demo-result-cell">
            <span>Prioridad</span>
            <strong className={`priority priority--${result.prioridadSugerida.toLowerCase()}`}>{result.prioridadSugerida}</strong>
          </div>
        </div>
        <div className="demo-summary">
          <span>Resumen generado</span>
          <p>{result.resumenGenerado}</p>
        </div>
        <div className="demo-tags" aria-label="Etiquetas sugeridas">
          {result.etiquetas.map((tag) => <Badge variant="brand" key={tag}>{tag}</Badge>)}
        </div>
      </div>
      <p className="demo-card__note">Simulación heurística local · sin enviar información</p>
    </section>
  );
}
