import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createServer } from 'vite';

let vite;
let loginSchema;
let registerSchema;
let simulateHeuristic;

before(async () => {
  vite = await createServer({
    configFile: new URL('../vite.config.ts', import.meta.url).pathname,
    server: { middlewareMode: true },
    appType: 'custom',
  });
  ({ loginSchema, registerSchema } = await vite.ssrLoadModule('/src/features/auth/authSchemas.ts'));
  ({ simulateHeuristic } = await vite.ssrLoadModule('/src/utils/heuristicSimulator.ts'));
});

after(async () => {
  await vite?.close();
});

describe('auth schemas', () => {
  it('validates required fields, email, and backend length boundaries', () => {
    const maxEmail = `${'a'.repeat(138)}@example.com`;
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: '12345678' }).success, true);
    assert.equal(loginSchema.safeParse({ correo: ` ${maxEmail} `, password: '12345678' }).success, true);
    assert.equal(loginSchema.safeParse({ correo: `${'a'.repeat(139)}@example.com`, password: '12345678' }).success, false);
    assert.equal(loginSchema.safeParse({ correo: '', password: '12345678' }).success, false);
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: '        ' }).success, false);
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: '\u2003'.repeat(8) }).success, false);
    assert.equal(loginSchema.safeParse({ correo: 'no-es-correo', password: '12345678' }).success, false);
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: '1234567' }).success, false);
    assert.equal(registerSchema.safeParse({ nombre: 'Ana', correo: 'ana@example.com', password: '12345678' }).success, true);
    assert.equal(registerSchema.safeParse({ nombre: 'Ana', correo: 'ana@example.com', password: '        ' }).success, false);
    assert.equal(registerSchema.safeParse({ nombre: ' ', correo: 'ana@example.com', password: '12345678' }).success, false);
    assert.equal(registerSchema.safeParse({ nombre: 'a'.repeat(101), correo: 'ana@example.com', password: '12345678' }).success, false);
  });

  it('enforces Java string and UTF-8 byte password limits independently', () => {
    const supplementary = '😀😀';
    assert.equal(new TextEncoder().encode(supplementary).length, 8);
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: supplementary }).success, false);
    assert.equal(loginSchema.safeParse({ correo: 'ana@example.com', password: '😀😀😀😀'.repeat(9) }).success, false);
  });
});

describe('heuristic simulator', () => {
  it('matches backend preset classifications and emits normalized labels', () => {
    const wifi = simulateHeuristic('Sin Wi-Fi antes de reunión', 'No tengo internet antes de la reunión.');
    assert.equal(wifi.categoriaSugerida, 'CONECTIVIDAD');
    assert.equal(wifi.prioridadSugerida, 'ALTA');
    assert.ok(wifi.etiquetas.includes('analisis-heuristico'));

    const account = simulateHeuristic('Cuenta bloqueada en SAP', 'No me deja entrar.');
    assert.equal(account.categoriaSugerida, 'ACCESOS');
    assert.equal(account.prioridadSugerida, 'ALTA');

    const blockedUser = simulateHeuristic('Usuario bloqueado', 'No puede ingresar a la aplicación.');
    assert.equal(blockedUser.categoriaSugerida, 'ACCESOS');
    assert.equal(blockedUser.prioridadSugerida, 'CRITICA');

    const monitor = simulateHeuristic('Monitor no enciende', 'El equipo no prende.');
    assert.equal(monitor.categoriaSugerida, 'HARDWARE');
    assert.equal(monitor.prioridadSugerida, 'CRITICA');
  });

  it('uses backend defaults and summary truncation semantics', () => {
    const empty = simulateHeuristic('', '');
    assert.equal(empty.resumenGenerado, 'Solicitud de soporte sin descripción suficiente.');

    const summary = simulateHeuristic('a'.repeat(499), 'b'.repeat(10));
    assert.equal(summary.resumenGenerado.length, 500);
    assert.equal(summary.resumenGenerado.endsWith('…'), true);

    const whitespace = simulateHeuristic('a'.repeat(498) + ' b', 'c'.repeat(5));
    assert.equal(whitespace.resumenGenerado.length, 499);
    assert.equal(whitespace.resumenGenerado.endsWith('…'), true);
    assert.equal(whitespace.resumenGenerado.endsWith(' …'), false);
  });
});
