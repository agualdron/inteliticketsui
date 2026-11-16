import type { CategoriaTicket, PrioridadTicket } from '../types/ticket.types';

export interface HeuristicDemoResult {
  categoriaSugerida: CategoriaTicket;
  prioridadSugerida: PrioridadTicket;
  resumenGenerado: string;
  etiquetas: string[];
}

const accentMarks = /\p{M}+/gu;
const invalidTagCharacters = /[^a-z0-9-]/g;
const tagSeparators = /[\u0009-\u000d\u0020_]+/g;
const javaWhitespaceAtEnd = /[\u0009-\u000d\u001c-\u0020\u1680\u2000-\u2006\u2008-\u200a\u2028\u2029\u205f\u3000]+$/u;
const javaWhitespaceOnly = /^[\u0009-\u000d\u001c-\u0020\u1680\u2000-\u2006\u2008-\u200a\u2028\u2029\u205f\u3000]*$/u;

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(accentMarks, '');
}

function containsAny(text: string, words: readonly string[]): boolean {
  return words.some((word) => new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(word)}(?:$|[^a-z0-9])`).test(text));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function classifyCategory(text: string): CategoriaTicket {
  if (containsAny(text, [
    'red', 'wifi', 'wi-fi', 'internet', 'conectividad', 'senal', 'conexion', 'desconexion',
    'desconectado', 'sin linea', 'vpn', 'ethernet', 'cable de red', 'router', 'switch',
    'modem', 'ip', 'dns', 'proxy', 'navegar', 'navegacion', 'lento el internet',
    'latencia', 'paquetes', 'intranet', 'red interna',
  ])) return 'CONECTIVIDAD';

  if (containsAny(text, [
    'acceso', 'accesos', 'contrasena', 'clave', 'password', 'pin', 'permiso', 'permisos',
    'autorizacion', 'denegado', 'no me deja entrar', 'iniciar sesion', 'inicio de sesion',
    'login', 'loguear', 'autenticacion', 'usuario bloqueado', 'cuenta bloqueada',
    'desbloquear', 'restablecer', 'recuperar cuenta', 'token', 'mfa', 'doble factor',
    '2fa', 'credenciales', 'rol', 'perfil', 'directorio activo', 'active directory', 'sso',
    'carpeta compartida',
  ])) return 'ACCESOS';

  if (containsAny(text, [
    'pantalla', 'monitor', 'teclado', 'mouse', 'raton', 'impresora', 'escaner', 'equipo',
    'computador', 'computadora', 'pc', 'portatil', 'laptop', 'torre', 'cpu', 'disco duro',
    'ssd', 'memoria ram', 'bateria', 'cargador', 'cable', 'fuente de poder', 'no enciende',
    'no prende', 'apagado', 'se apaga', 'sobrecalienta', 'calienta', 'ruido', 'ventilador',
    'camara', 'webcam', 'microfono', 'audifonos', 'diadema', 'parlantes', 'usb', 'puerto',
    'hdmi', 'docking', 'toner', 'cartucho', 'atasco de papel', 'telefono fijo',
  ])) return 'HARDWARE';

  if (containsAny(text, [
    'aplicacion', 'aplicativo', 'software', 'sistema', 'programa', 'app', 'error', 'fallo',
    'bug', 'excepcion', 'pantallazo', 'pantalla azul', 'bsod', 'se cierra', 'crashea',
    'congelado', 'se congela', 'no responde', 'lento', 'instalar', 'instalacion',
    'desinstalar', 'actualizar', 'actualizacion', 'licencia', 'activacion', 'windows',
    'office', 'excel', 'word', 'powerpoint', 'outlook', 'correo', 'teams', 'zoom',
    'navegador', 'chrome', 'edge', 'erp', 'crm', 'sap', 'base de datos', 'archivo danado',
    'plugin', 'complemento',
  ])) return 'SOFTWARE';

  return 'OTRO';
}

function classifyPriority(text: string): PrioridadTicket {
  if (containsAny(text, [
    'caido', 'caida', 'servicio caido', 'sistema caido', 'servidor caido', 'bloqueado',
    'bloqueo total', 'paralizado', 'detenido', 'no funciona nada', 'sin servicio',
    'fuera de linea', 'offline', 'emergencia', 'critico', 'critica', 'grave', 'severo',
    'toda la empresa', 'toda la oficina', 'todos los usuarios', 'varios usuarios',
    'equipo no enciende', 'no prende', 'pantallazo azul', 'perdida de datos', 'virus',
    'ransomware', 'malware', 'hackeo', 'brecha', 'vulnerabilidad', 'fuga de informacion',
    'produccion detenida', 'facturacion detenida',
  ])) return 'CRITICA';

  if (containsAny(text, [
    'urgente', 'urgencia', 'reunion', 'presentacion', 'cliente', 'entrega', 'fecha limite',
    'deadline', 'hoy mismo', 'en minutos', 'cuanto antes', 'asap', 'prioritario', 'inmediato',
    'inmediata', 'no puedo trabajar', 'impide trabajar', 'me impide', 'sin acceso',
    'cuenta bloqueada', 'no me deja entrar', 'no puedo conectarme', 'sin internet',
    'fallo grave', 'error critico', 'cierre de mes', 'nomina', 'auditoria',
  ])) return 'ALTA';

  if (containsAny(text, [
    'consulta', 'duda', 'pregunta', 'informacion', 'sugerencia', 'mejora', 'cuando puedan',
    'sin afan', 'sin prisa', 'no es urgente', 'baja prioridad', 'capacitacion', 'tutorial',
    'guia', 'manual', 'solicitud de cambio', 'nuevo requerimiento', 'cotizacion',
    'configuracion menor', 'estetico', 'color', 'icono', 'formato', 'preventivo',
    'mantenimiento preventivo',
  ])) return 'BAJA';

  return 'MEDIA';
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase()
    .normalize('NFD')
    .replace(accentMarks, '')
    .replace(tagSeparators, '-')
    .replace(invalidTagCharacters, '')
    .replace(/^-+|-+$/g, '');
}

function tagsFor(text: string, category: CategoriaTicket, priority: PrioridadTicket): string[] {
  const labels = new Set<string>();
  const categoryLabel: Record<CategoriaTicket, string> = {
    CONECTIVIDAD: 'conectividad',
    ACCESOS: 'accesos',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    OTRO: 'soporte',
  };
  labels.add(categoryLabel[category]);
  if (priority === 'CRITICA') labels.add('critico');
  else if (priority === 'ALTA') labels.add('urgente');
  if (containsAny(text, ['reunion'])) labels.add('reunion');
  if (containsAny(text, ['wifi', 'internet', 'red'])) labels.add('red');
  labels.add('analisis-heuristico');

  let result = [...labels];
  if (result.length > 5) result = [...result.slice(0, 4), 'analisis-heuristico'];
  const normalized = new Set<string>();
  for (const label of result) {
    const value = normalizeTag(label);
    if (value.length >= 2 && value.length <= 30) normalized.add(value);
  }
  return [...normalized].slice(0, 5);
}

function combine(title: string, description: string): string {
  const safeTitle = title.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, '');
  const safeDescription = description.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, '');
  if (!safeTitle) return safeDescription;
  if (!safeDescription) return safeTitle;
  return `${safeTitle}. ${safeDescription}`;
}

function summarize(text: string): string {
  if (javaWhitespaceOnly.test(text)) return 'Solicitud de soporte sin descripción suficiente.';
  if (text.length <= 500) return text;
  return `${text.slice(0, 499).replace(javaWhitespaceAtEnd, '')}…`;
}

export function simulateHeuristic(titulo: string, descripcion: string): HeuristicDemoResult {
  const source = combine(titulo, descripcion);
  const normalized = normalize(source);
  const categoriaSugerida = classifyCategory(normalized);
  const prioridadSugerida = classifyPriority(normalized);
  return {
    categoriaSugerida,
    prioridadSugerida,
    resumenGenerado: summarize(source),
    etiquetas: tagsFor(normalized, categoriaSugerida, prioridadSugerida),
  };
}
