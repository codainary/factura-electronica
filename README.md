# Plataforma de Facturación Electrónica & Conciliación Bancaria (IA) — Boilerplate

Stack PyME listo para clonar (Docker Compose):
- API (NestJS) — subida de extractos, disparo de reconciliación, consultas.
- Worker (BullMQ) — pipeline E2E (normalización → candidatos → score → asignación v1 → persistencia → reporte).
- Servicio ML (FastAPI) — embeddings + score combinado.
- Postgres (+ pgvector) — datos + embeddings.
- Redis — colas.
- MinIO — almacenamiento tipo S3.

## Uso rápido
```bash
cp .env.example .env
make up
make migrate
make seed
make reconcile-demo   # corre un demo sin CSV (usa datos mock)
make logs             # mira los logs del worker
```
