USE realestate;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(512) NOT NULL,
    phone VARCHAR(50),
    role ENUM('agent', 'buyer') NOT NULL,
    city VARCHAR(100),
    bio TEXT,
    locale VARCHAR(10) DEFAULT 'ua',
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS listings (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_ru VARCHAR(500),
    description TEXT,
    description_ru TEXT,
    property_type ENUM('apartment', 'house', 'commercial', 'land') NOT NULL,
    status ENUM('active', 'reserved', 'sold', 'draft') NOT NULL DEFAULT 'active',
    deal_type ENUM('sale', 'rent') NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address VARCHAR(500),
    area INT,
    rooms INT,
    bedrooms INT,
    bathrooms INT,
    floor INT,
    total_floors INT,
    land_area INT,
    year_built INT,
    features TEXT,
    images TEXT,
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY,
    user_id INT NOT NULL,
    listing_id INT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    message TEXT,
    budget DECIMAL(15,2),
    preferred_city VARCHAR(100),
    status ENUM('new', 'contacted', 'viewing', 'offer', 'closed', 'cancelled') NOT NULL DEFAULT 'new',
    viewing_at DATETIME NULL,
    agent_note TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, listing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;