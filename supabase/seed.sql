-- ============================================================
-- seed.sql — Example data for development
-- ============================================================

-- Services
INSERT INTO services (name, slug, description, duration_minutes, price_cents, active, order_index) VALUES
  ('Fisioterapia General', 'fisioterapia-general', 'Sesion completa de fisioterapia con evaluacion y tratamiento personalizado.', 60, 4500, true, 1),
  ('Masaje Deportivo',     'masaje-deportivo',     'Masaje enfocado en recuperacion muscular y prevencion de lesiones deportivas.', 45, 3500, true, 2),
  ('Rehabilitacion',       'rehabilitacion',       'Programa de rehabilitacion post-quirurgica o post-lesion con seguimiento.', 90, 6000, true, 3);

-- Team members (reference service IDs via subquery)
INSERT INTO team_members (name, role, bio, active, order_index, services) VALUES
  (
    'Carlos Martinez',
    'Fisioterapeuta Senior',
    'Mas de 10 anos de experiencia en fisioterapia deportiva y rehabilitacion.',
    true, 1,
    ARRAY(SELECT id FROM services WHERE slug IN ('fisioterapia-general','masaje-deportivo','rehabilitacion'))
  ),
  (
    'Laura Garcia',
    'Fisioterapeuta',
    'Especialista en masaje deportivo y terapia manual.',
    true, 2,
    ARRAY(SELECT id FROM services WHERE slug IN ('fisioterapia-general','masaje-deportivo'))
  );

-- Schedule: Mon(1)-Fri(5) 9-20, Sat(6) 9-14, Sun(0) closed
INSERT INTO schedule (day_of_week, open_time, close_time, is_closed) VALUES
  (0, NULL,    NULL,    true),   -- Domingo
  (1, '09:00', '20:00', false),  -- Lunes
  (2, '09:00', '20:00', false),  -- Martes
  (3, '09:00', '20:00', false),  -- Miercoles
  (4, '09:00', '20:00', false),  -- Jueves
  (5, '09:00', '20:00', false),  -- Viernes
  (6, '09:00', '14:00', false);  -- Sabado

-- Customers (for reviews)
INSERT INTO customers (id, name, phone, email) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Ana Lopez',    '+34600111222', 'ana@example.com'),
  ('a0000000-0000-0000-0000-000000000002', 'Pedro Ruiz',   '+34600333444', 'pedro@example.com'),
  ('a0000000-0000-0000-0000-000000000003', 'Maria Sanchez','+34600555666', 'maria@example.com');

-- Reservations (needed for reviews FK)
INSERT INTO reservations (id, customer_id, service_id, date, start_time, end_time, status, price_cents, payment_status, source) VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    (SELECT id FROM services WHERE slug = 'fisioterapia-general'),
    '2026-03-25', '10:00', '11:00', 'completed', 4500, 'paid', 'web'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    (SELECT id FROM services WHERE slug = 'masaje-deportivo'),
    '2026-03-26', '11:00', '11:45', 'completed', 3500, 'paid', 'whatsapp'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    (SELECT id FROM services WHERE slug = 'rehabilitacion'),
    '2026-03-27', '09:00', '10:30', 'completed', 6000, 'paid', 'phone'
  );

-- Published reviews
INSERT INTO reviews (customer_id, reservation_id, rating, comment, published) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, 'Excelente trato y profesionalidad. Me senti mucho mejor despues de la sesion.', true),
  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 4, 'Muy buen masaje deportivo. Repetiria sin duda.', true),
  ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 5, 'La rehabilitacion fue clave en mi recuperacion. Muy recomendable.', true);
