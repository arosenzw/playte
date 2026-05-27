-- CreateEnum
CREATE TYPE session_status AS ENUM ('lobby', 'ranking', 'results', 'archived');

-- ─── restaurants ──────────────────────────────────────────────────────────────

CREATE TABLE restaurants (
  id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  address_line      VARCHAR(255),
  city              VARCHAR(100),
  state             VARCHAR(100),
  country           VARCHAR(100),
  lat               NUMERIC(9,6),
  lng               NUMERIC(9,6),
  external_place_id VARCHAR(500),
  cuisine_type      VARCHAR(100),
  is_manual_entry   BOOLEAN     NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT restaurants_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_restaurants_place_id
  ON restaurants (external_place_id)
  WHERE external_place_id IS NOT NULL;

-- ─── users ────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id             UUID         NOT NULL DEFAULT gen_random_uuid(),
  email          VARCHAR(255) NOT NULL,
  password_hash  TEXT,
  display_name   VARCHAR(50)  NOT NULL,
  avatar_url     TEXT,
  email_verified BOOLEAN      NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ,

  CONSTRAINT users_pkey        PRIMARY KEY (id),
  CONSTRAINT users_email_key   UNIQUE (email)
);

-- ─── oauth_accounts ───────────────────────────────────────────────────────────

CREATE TABLE oauth_accounts (
  id               UUID        NOT NULL DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL,
  provider         VARCHAR(50) NOT NULL,
  provider_uid     VARCHAR(255) NOT NULL,
  access_token     TEXT,
  refresh_token    TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT oauth_accounts_pkey              PRIMARY KEY (id),
  CONSTRAINT oauth_accounts_user_id_fkey      FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT idx_oauth_provider_uid           UNIQUE (provider, provider_uid)
);

-- ─── sessions ─────────────────────────────────────────────────────────────────
-- host_player_id FK added after session_players is created (circular reference)

CREATE TABLE sessions (
  id                  UUID           NOT NULL DEFAULT gen_random_uuid(),
  join_code           VARCHAR(10)    NOT NULL,
  restaurant_id       UUID           NOT NULL,
  host_user_id        UUID,
  host_player_id      UUID,
  status              session_status NOT NULL DEFAULT 'lobby',
  max_players         SMALLINT       NOT NULL DEFAULT 20,
  max_dishes          SMALLINT       NOT NULL DEFAULT 20,
  ranking_started_at  TIMESTAMPTZ,
  results_revealed_at TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ    NOT NULL DEFAULT now() + interval '24 hours',
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT sessions_pkey              PRIMARY KEY (id),
  CONSTRAINT sessions_join_code_key     UNIQUE (join_code),
  CONSTRAINT sessions_restaurant_fkey   FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
  CONSTRAINT sessions_host_user_fkey    FOREIGN KEY (host_user_id) REFERENCES users (id)
);

CREATE INDEX idx_sessions_join_code
  ON sessions (join_code);

CREATE INDEX idx_sessions_restaurant
  ON sessions (restaurant_id);

CREATE INDEX idx_sessions_status_expires
  ON sessions (status, expires_at);

CREATE INDEX idx_sessions_host_user
  ON sessions (host_user_id)
  WHERE host_user_id IS NOT NULL;

-- ─── session_players ──────────────────────────────────────────────────────────

CREATE TABLE session_players (
  id           UUID        NOT NULL DEFAULT gen_random_uuid(),
  session_id   UUID        NOT NULL,
  user_id      UUID,
  guest_token  VARCHAR(64),
  display_name VARCHAR(50) NOT NULL,
  is_host      BOOLEAN     NOT NULL DEFAULT false,
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,

  CONSTRAINT session_players_pkey            PRIMARY KEY (id),
  CONSTRAINT session_players_session_fkey    FOREIGN KEY (session_id) REFERENCES sessions (id),
  CONSTRAINT session_players_user_fkey       FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Partial unique indexes: one registered user per session, one guest token per session
CREATE UNIQUE INDEX uq_sp_session_user
  ON session_players (session_id, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX uq_sp_session_guest
  ON session_players (session_id, guest_token)
  WHERE guest_token IS NOT NULL;

CREATE INDEX idx_sp_session
  ON session_players (session_id);

CREATE INDEX idx_sp_user
  ON session_players (user_id)
  WHERE user_id IS NOT NULL;

CREATE INDEX idx_sp_guest_token
  ON session_players (session_id, guest_token)
  WHERE guest_token IS NOT NULL;

CREATE INDEX idx_sp_submitted
  ON session_players (session_id, submitted_at);

-- ─── Add host_player_id FK now that session_players exists ────────────────────

ALTER TABLE sessions
  ADD CONSTRAINT sessions_host_player_fkey
  FOREIGN KEY (host_player_id) REFERENCES session_players (id);

-- ─── dishes ───────────────────────────────────────────────────────────────────

CREATE TABLE dishes (
  id            UUID         NOT NULL DEFAULT gen_random_uuid(),
  session_id    UUID         NOT NULL,
  restaurant_id UUID         NOT NULL,
  name          VARCHAR(150) NOT NULL,
  sort_order    SMALLINT     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,

  CONSTRAINT dishes_pkey           PRIMARY KEY (id),
  CONSTRAINT dishes_session_fkey   FOREIGN KEY (session_id) REFERENCES sessions (id),
  CONSTRAINT dishes_restaurant_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);

CREATE INDEX idx_dishes_session
  ON dishes (session_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_dishes_restaurant
  ON dishes (restaurant_id);

-- ─── rankings ─────────────────────────────────────────────────────────────────

CREATE TABLE rankings (
  id                UUID     NOT NULL DEFAULT gen_random_uuid(),
  session_player_id UUID     NOT NULL,
  dish_id           UUID     NOT NULL,
  session_id        UUID     NOT NULL,
  restaurant_id     UUID     NOT NULL,
  rank_position     SMALLINT NOT NULL,
  submitted_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT rankings_pkey               PRIMARY KEY (id),
  CONSTRAINT rankings_rank_position_check CHECK (rank_position >= 1),
  CONSTRAINT rankings_session_player_fkey FOREIGN KEY (session_player_id) REFERENCES session_players (id),
  CONSTRAINT rankings_dish_fkey          FOREIGN KEY (dish_id) REFERENCES dishes (id),
  CONSTRAINT rankings_session_fkey       FOREIGN KEY (session_id) REFERENCES sessions (id),
  CONSTRAINT rankings_restaurant_fkey    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id),
  CONSTRAINT uq_ranking_player_dish      UNIQUE (session_player_id, dish_id)
);

-- Partial unique index from ERD: one rank_position per player per session (only enforced on submitted rows)
CREATE UNIQUE INDEX uq_ranking_player_position
  ON rankings (session_player_id, rank_position)
  WHERE submitted_at IS NOT NULL;

CREATE INDEX idx_rankings_session
  ON rankings (session_id);

CREATE INDEX idx_rankings_player
  ON rankings (session_player_id);

CREATE INDEX idx_rankings_restaurant_dish
  ON rankings (restaurant_id, dish_id);

-- ─── session_insights ─────────────────────────────────────────────────────────

CREATE TABLE session_insights (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid(),
  session_id          UUID        NOT NULL,
  most_loved_dish_id  UUID,
  nacho_type_dish_id  UUID,
  hot_cold_dish_id    UUID,
  dish_avg_ranks      JSONB       NOT NULL DEFAULT '{}',
  dish_rank_variance  JSONB       NOT NULL DEFAULT '{}',
  player_correlations JSONB       NOT NULL DEFAULT '{}',
  player_best_buds    JSONB       NOT NULL DEFAULT '{}',
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT session_insights_pkey              PRIMARY KEY (id),
  CONSTRAINT session_insights_session_key       UNIQUE (session_id),
  CONSTRAINT session_insights_session_fkey      FOREIGN KEY (session_id) REFERENCES sessions (id),
  CONSTRAINT session_insights_most_loved_fkey   FOREIGN KEY (most_loved_dish_id) REFERENCES dishes (id),
  CONSTRAINT session_insights_nacho_type_fkey   FOREIGN KEY (nacho_type_dish_id) REFERENCES dishes (id),
  CONSTRAINT session_insights_hot_cold_fkey     FOREIGN KEY (hot_cold_dish_id) REFERENCES dishes (id)
);

CREATE UNIQUE INDEX idx_insights_session
  ON session_insights (session_id);

-- ─── user_session_links ───────────────────────────────────────────────────────

CREATE TABLE user_session_links (
  id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL,
  session_player_id UUID        NOT NULL,
  session_id        UUID        NOT NULL,
  linked_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT user_session_links_pkey               PRIMARY KEY (id),
  CONSTRAINT user_session_links_player_key         UNIQUE (session_player_id),
  CONSTRAINT user_session_links_user_fkey          FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT user_session_links_player_fkey        FOREIGN KEY (session_player_id) REFERENCES session_players (id),
  CONSTRAINT user_session_links_session_fkey       FOREIGN KEY (session_id) REFERENCES sessions (id)
);

CREATE INDEX idx_usl_user
  ON user_session_links (user_id);
