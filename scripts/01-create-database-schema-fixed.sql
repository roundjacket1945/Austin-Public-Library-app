-- Create database schema for Austin Public Library application

-- Users table for authentication and profile management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    library_card_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    reading_preferences JSONB DEFAULT '{"genres": [], "formats": []}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authors table for normalized author data
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    biography TEXT,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(100),
    website_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Publishers table
CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(100),
    website_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table for categorization
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_genre_id INTEGER REFERENCES genres(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table with support for both physical and digital formats
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    isbn_10 VARCHAR(10),
    isbn_13 VARCHAR(13) UNIQUE,
    publication_year INTEGER,
    publication_date DATE,
    publisher_id INTEGER REFERENCES publishers(id),
    language VARCHAR(50) DEFAULT 'English',
    pages INTEGER,
    description TEXT,
    cover_image_url TEXT,
    thumbnail_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    dewey_decimal VARCHAR(20),
    lc_classification VARCHAR(50),
    series_name VARCHAR(255),
    series_number INTEGER,
    edition VARCHAR(100),
    format_type VARCHAR(20) CHECK (format_type IN ('physical', 'ebook', 'audiobook', 'hybrid')),
    file_size_mb INTEGER,
    duration_minutes INTEGER,
    narrator VARCHAR(255),
    digital_rights JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book authors junction table (many-to-many relationship)
CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'author',
    PRIMARY KEY (book_id, author_id, role)
);

-- Book genres junction table (many-to-many relationship)
CREATE TABLE book_genres (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

-- Library branches
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    hours_of_operation JSONB,
    services JSONB,
    amenities JSONB,
    is_active BOOLEAN DEFAULT true,
    manager_name VARCHAR(255),
    established_date DATE,
    square_footage INTEGER,
    parking_spaces INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book copies at specific branches
CREATE TABLE book_copies (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE,
    copy_number VARCHAR(50),
    barcode VARCHAR(50) UNIQUE,
    condition VARCHAR(20) DEFAULT 'good',
    location VARCHAR(100),
    acquisition_date DATE,
    acquisition_cost DECIMAL(10,2),
    last_inventory_date DATE,
    is_available BOOLEAN DEFAULT true,
    is_reference_only BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Digital book licenses (for ebooks and audiobooks)
CREATE TABLE digital_licenses (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    license_type VARCHAR(50),
    total_checkouts_allowed INTEGER,
    current_checkouts INTEGER DEFAULT 0,
    max_simultaneous_users INTEGER DEFAULT 1,
    license_start_date DATE,
    license_end_date DATE,
    cost DECIMAL(10,2),
    vendor VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book checkouts
CREATE TABLE checkouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    copy_id INTEGER REFERENCES book_copies(id),
    branch_id INTEGER REFERENCES branches(id),
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    renewal_count INTEGER DEFAULT 0,
    max_renewals INTEGER DEFAULT 3,
    is_digital BOOLEAN DEFAULT false,
    checkout_method VARCHAR(20) DEFAULT 'in_person',
    staff_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book holds/reservations
CREATE TABLE holds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id),
    hold_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP,
    notification_date TIMESTAMP,
    pickup_deadline TIMESTAMP,
    position_in_queue INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    hold_type VARCHAR(20) DEFAULT 'physical',
    notification_method VARCHAR(20) DEFAULT 'email',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fines and fees
CREATE TABLE fines (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    checkout_id INTEGER REFERENCES checkouts(id),
    fine_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    assessed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    paid_date TIMESTAMP,
    payment_method VARCHAR(50),
    staff_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'outstanding',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading challenges
CREATE TABLE reading_challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL,
    season VARCHAR(20),
    target_value INTEGER NOT NULL,
    target_unit VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    badge_icon VARCHAR(100),
    badge_color VARCHAR(50),
    reward_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    max_participants INTEGER,
    registration_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User participation in reading challenges
CREATE TABLE user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES reading_challenges(id) ON DELETE CASCADE,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, challenge_id)
);

-- Personal reading goals
CREATE TABLE reading_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL,
    target_value INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading progress tracking
CREATE TABLE reading_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    checkout_id INTEGER REFERENCES checkouts(id),
    pages_read INTEGER DEFAULT 0,
    percentage_complete DECIMAL(5,2) DEFAULT 0.0,
    reading_time_minutes INTEGER DEFAULT 0,
    last_read_date TIMESTAMP,
    reading_sessions JSONB,
    notes TEXT,
    is_finished BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements/badges
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_type VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(100),
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    challenge_id INTEGER REFERENCES reading_challenges(id),
    goal_id INTEGER REFERENCES reading_goals(id),
    metadata JSONB
);

-- Book reviews and ratings
CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    is_spoiler BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    is_verified_reader BOOLEAN DEFAULT false,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT true,
    moderation_notes TEXT
);

-- Events and programs
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    branch_id INTEGER REFERENCES branches(id),
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    age_group VARCHAR(50),
    registration_required BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMP,
    cost DECIMAL(10,2) DEFAULT 0.0,
    instructor_name VARCHAR(255),
    room_location VARCHAR(100),
    materials_needed TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'registered',
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_isbn13 ON books(isbn_13);
CREATE INDEX idx_books_format_type ON books(format_type);
CREATE INDEX idx_books_publication_year ON books(publication_year);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_library_card ON users(library_card_number);
CREATE INDEX idx_checkouts_user_id ON checkouts(user_id);
CREATE INDEX idx_checkouts_book_id ON checkouts(book_id);
CREATE INDEX idx_checkouts_due_date ON checkouts(due_date);
CREATE INDEX idx_checkouts_return_date ON checkouts(return_date);
CREATE INDEX idx_holds_user_id ON holds(user_id);
CREATE INDEX idx_holds_book_id ON holds(book_id);
CREATE INDEX idx_holds_status ON holds(status);
CREATE INDEX idx_book_copies_book_id ON book_copies(book_id);
CREATE INDEX idx_book_copies_branch_id ON book_copies(branch_id);
CREATE INDEX idx_book_copies_barcode ON book_copies(barcode);
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX idx_branches_active ON branches(is_active);
CREATE INDEX idx_fines_user_id ON fines(user_id);
CREATE INDEX idx_fines_status ON fines(status);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_copies_updated_at BEFORE UPDATE ON book_copies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_holds_updated_at BEFORE UPDATE ON holds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_goals_updated_at BEFORE UPDATE ON reading_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
