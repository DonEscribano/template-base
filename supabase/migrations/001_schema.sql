-- ============================================================
-- 001_schema.sql — Core tables for template-base
-- ============================================================

-- 1. Services
CREATE TABLE services (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text        NOT NULL,
  slug            text        UNIQUE NOT NULL,
  description     text,
  duration_minutes int        NOT NULL,
  price_cents     int         NOT NULL,
  active          boolean     DEFAULT true,
  order_index     int         DEFAULT 0,
  image_url       text,
  created_at      timestamptz DEFAULT now()
);

-- 2. Team members
CREATE TABLE team_members (
  id          uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text     NOT NULL,
  role        text     NOT NULL,
  bio         text,
  photo_url   text,
  active      boolean  DEFAULT true,
  order_index int      DEFAULT 0,
  services    uuid[]   DEFAULT '{}'
);

-- 3. Weekly schedule
CREATE TABLE schedule (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week int     NOT NULL UNIQUE CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time   time,
  close_time  time,
  is_closed   boolean DEFAULT false
);

-- 4. Schedule exceptions (holidays, special hours)
CREATE TABLE schedule_exceptions (
  id        uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  date      date    NOT NULL UNIQUE,
  is_closed boolean DEFAULT true,
  open_time time,
  close_time time,
  note      text
);

-- 5. Customers
CREATE TABLE customers (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text        NOT NULL,
  email          text,
  phone          text        NOT NULL UNIQUE,
  whatsapp_opt_in boolean    DEFAULT false,
  notes          text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- 6. Reservations
CREATE TABLE reservations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid        REFERENCES customers(id) ON DELETE SET NULL,
  service_id          uuid        NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  team_member_id      uuid        REFERENCES team_members(id) ON DELETE SET NULL,
  date                date        NOT NULL,
  start_time          time        NOT NULL,
  end_time            time        NOT NULL,
  status              text        NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending','confirmed','completed','cancelled','no_show')),
  notes               text,
  price_cents         int         NOT NULL,
  payment_status      text        DEFAULT 'pending'
                                  CHECK (payment_status IN ('pending','paid','refunded')),
  confirmation_sent_at timestamptz,
  reminder_sent_at    timestamptz,
  source              text        DEFAULT 'web'
                                  CHECK (source IN ('web','whatsapp','admin','phone')),
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- 7. Reviews
CREATE TABLE reviews (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    uuid        REFERENCES customers(id) ON DELETE SET NULL,
  reservation_id uuid        REFERENCES reservations(id) ON DELETE SET NULL,
  rating         int         NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment        text,
  published      boolean     DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

-- 8. WhatsApp conversations (state machine)
CREATE TABLE whatsapp_conversations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           text        NOT NULL UNIQUE,
  state           text        NOT NULL DEFAULT 'idle',
  context         jsonb       DEFAULT '{}',
  last_message_at timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- 9. Blog / Posts
CREATE TABLE posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  slug         text        UNIQUE NOT NULL,
  excerpt      text,
  content      text,
  cover_url    text,
  published    boolean     DEFAULT false,
  published_at timestamptz,
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_reservations_date        ON reservations(date);
CREATE INDEX idx_reservations_customer_id ON reservations(customer_id);
CREATE INDEX idx_reservations_status      ON reservations(status);
CREATE INDEX idx_services_active          ON services(active);
CREATE INDEX idx_posts_published          ON posts(published);
