-- ============================================================
-- 003_functions.sql — Triggers & utility functions
-- ============================================================

-- ============================================================
-- 1. Auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_whatsapp_conversations_updated_at
  BEFORE UPDATE ON whatsapp_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. get_available_slots
--    Returns available start times for a given date + service.
--    Checks: schedule, exceptions, existing reservations,
--    and service duration to ensure the slot fits.
-- ============================================================

CREATE OR REPLACE FUNCTION get_available_slots(
  p_date       date,
  p_service_id uuid
)
RETURNS TABLE(slot_time time) AS $$
DECLARE
  v_day_of_week   int;
  v_open          time;
  v_close         time;
  v_is_closed     boolean;
  v_duration      interval;
  v_slot          time;
  v_slot_end      time;
  v_slot_interval interval := interval '30 minutes'; -- slot granularity
BEGIN
  -- Get service duration
  SELECT (s.duration_minutes || ' minutes')::interval
    INTO v_duration
    FROM services s
   WHERE s.id = p_service_id AND s.active = true;

  IF v_duration IS NULL THEN
    RETURN; -- service not found or inactive
  END IF;

  -- Check for schedule exception on this date
  SELECT se.is_closed, se.open_time, se.close_time
    INTO v_is_closed, v_open, v_close
    FROM schedule_exceptions se
   WHERE se.date = p_date;

  IF FOUND THEN
    IF v_is_closed THEN
      RETURN; -- closed on this date
    END IF;
    -- Use exception hours (already in v_open / v_close)
  ELSE
    -- Use regular schedule
    v_day_of_week := EXTRACT(DOW FROM p_date)::int;

    SELECT sch.is_closed, sch.open_time, sch.close_time
      INTO v_is_closed, v_open, v_close
      FROM schedule sch
     WHERE sch.day_of_week = v_day_of_week;

    IF NOT FOUND OR v_is_closed THEN
      RETURN; -- no schedule or closed
    END IF;
  END IF;

  -- Generate slots from open to close, checking each one
  v_slot := v_open;

  WHILE v_slot + v_duration <= v_close LOOP
    v_slot_end := v_slot + v_duration;

    -- Check for overlapping reservations
    IF NOT EXISTS (
      SELECT 1
        FROM reservations r
       WHERE r.date = p_date
         AND r.status NOT IN ('cancelled')
         AND r.start_time < v_slot_end
         AND r.end_time   > v_slot
    ) THEN
      slot_time := v_slot;
      RETURN NEXT;
    END IF;

    v_slot := v_slot + v_slot_interval;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql STABLE;
