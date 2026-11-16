const steps = [
  { number: '01', title: 'Análisis con Spring AI', detail: 'El modelo interpreta el contexto y propone categoría, prioridad y resumen.', symbol: '✳' },
  { number: '02', title: 'Reintentos y timeout', detail: 'La resiliencia controla los intentos y el tiempo de respuesta del proveedor.', symbol: '↻' },
  { number: '03', title: 'Fallback heurístico', detail: 'Si la IA no está disponible, reglas locales mantienen el flujo de soporte.', symbol: '⌘' },
];

export function ArchitectureFlow() {
  return (
    <section className="section section--soft" id="como-funciona">
      <div className="section-heading">
        <span className="eyebrow">Inteligencia con resiliencia</span>
        <h2>Una experiencia inteligente, incluso cuando la IA no responde</h2>
        <p>La arquitectura combina análisis contextual y reglas deterministas para que la atención continúe.</p>
      </div>
      <div className="architecture-flow">
        {steps.map((step, index) => (
          <article className="flow-step" key={step.number}>
            <div className="flow-step__top"><span className="flow-step__symbol">{step.symbol}</span><span>{step.number}</span></div>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            {index < steps.length - 1 && <span className="flow-step__connector" aria-hidden="true">→</span>}
          </article>
        ))}
      </div>
      <p className="architecture-footnote">La demostración de esta página ejecuta únicamente el fallback heurístico en el navegador.</p>
    </section>
  );
}
