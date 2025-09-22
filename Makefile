up:
	docker compose up -d --build

migrate:
	docker compose exec api npx prisma migrate deploy || true

seed:
	cat scripts/seed.sql | docker compose exec -T db psql -U postgres -d finance

logs:
	docker compose logs -f worker

reconcile-demo:
	curl -s -X GET "http://localhost:3000/reconcile/run" | jq . || true
