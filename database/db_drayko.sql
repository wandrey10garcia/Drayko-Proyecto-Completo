-- =====================================================================
-- Base de datos: db_drayko
-- Proyecto: Drayko - Aplicacion movil de stickers NFC
-- Autor: Wilson Andrey Piragua Garcia
-- =====================================================================

DROP DATABASE IF EXISTS db_drayko;

CREATE SCHEMA db_drayko DEFAULT CHARACTER SET utf8;
USE db_drayko;

-- ---------------------------------------------------------------------
-- Tabla: users  (MOD_USUARIOS)
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  image VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',          -- 'admin' | 'user'
  status VARCHAR(20) DEFAULT 'active',      -- 'active' | 'blocked' (bloqueo del Admin)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabla: stickers  (MOD_STICKERS)
-- ---------------------------------------------------------------------
CREATE TABLE stickers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                      -- propietario del sticker
  name VARCHAR(100) NOT NULL,                 -- nombre visible, ej. "Wi-Fi de casa"
  content_type VARCHAR(20) NOT NULL,          -- 'text' | 'url' | 'contact' | 'wifi'
  content TEXT NOT NULL,                      -- dato grabado/a grabar en el tag NFC
  category VARCHAR(30) DEFAULT 'personal',    -- 'hogar' | 'personal' | 'negocio' | 'evento'
  nfc_uid VARCHAR(100),                       -- identificador fisico del tag (si ya fue escrito)
  status VARCHAR(20) DEFAULT 'active',        -- 'active' | 'inactive'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_stickers_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Datos semilla
-- ---------------------------------------------------------------------

-- Usuario administrador por defecto
-- email: admin@drayko.app | password: Admin1234  (hash bcrypt, 10 rounds)
INSERT INTO users (name, lastname, email, password, phone, image, role) VALUES (
  'Wilson Andrey',
  'Piragua Garcia',
  'admin@drayko.app',
  '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
  '3000000000',
  NULL,
  'admin'
);

-- Usuario normal de ejemplo
-- email: alex@drayko.app | password: Admin1234
INSERT INTO users (name, lastname, email, password, phone, image, role) VALUES (
  'Alex',
  'Rivera',
  'alex@drayko.app',
  '$2b$10$NR8eRuuAB12JoHe81ZYnG.i2/5k/D5TKrxc7Pk74W4rgzADdABM9G',
  '3101234567',
  NULL,
  'user'
);

-- Stickers de ejemplo para el usuario Alex (id = 2)
INSERT INTO stickers (user_id, name, content_type, content, category, status) VALUES
  (2, 'Wi-Fi de casa', 'wifi', '{"ssid":"Drayko_Home_5G","password":"super-secreta-123"}', 'hogar', 'active'),
  (2, 'Mi contacto', 'contact', '{"name":"Alex Rivera","phone":"3101234567","email":"alex@drayko.app"}', 'personal', 'active'),
  (2, 'Carta digital', 'url', 'https://drayko.app/menu/tienda-alex', 'negocio', 'active');
