INSERT INTO "Invoice" (id, number, "customerId", currency, total, paid, status, "issueDate", "dueDate") VALUES
 (1,'FAC-1001', 101, 'COP', 1200000, 0, 'OPEN', now() - interval '20 day', now() - interval '5 day'),
 (2,'FAC-1002', 101, 'COP', 1000000, 0, 'OPEN', now() - interval '18 day', now() - interval '3 day'),
 (3,'FAC-1003', 202, 'COP', 1300000, 0, 'OPEN', now() - interval '12 day', now() + interval '2 day');
