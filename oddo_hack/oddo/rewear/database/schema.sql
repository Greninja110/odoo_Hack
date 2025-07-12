-- Users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    profile_image VARCHAR(255),
    city VARCHAR(100),
    address VARCHAR(255),
    bio TEXT,
    swap_preference VARCHAR(20) DEFAULT 'both',
    status VARCHAR(20) DEFAULT 'pending',
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    `condition` VARCHAR(20) NOT NULL,
    tags VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT FALSE,
    owner_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_owner (owner_id),
    INDEX idx_featured (is_featured),
    FULLTEXT INDEX idx_search (title, description, tags)
);

-- Item images table
CREATE TABLE IF NOT EXISTS item_images (
    id CHAR(36) PRIMARY KEY,
    item_id CHAR(36) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_item_id (item_id),
    INDEX idx_is_primary (is_primary)
);

-- Swaps table
CREATE TABLE IF NOT EXISTS swaps (
    id CHAR(36) PRIMARY KEY,
    requester_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    requester_item_id CHAR(36) NOT NULL,
    provider_item_id CHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requester_item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_requester (requester_id),
    INDEX idx_provider (provider_id),
    INDEX idx_status (status)
);