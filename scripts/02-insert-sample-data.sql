-- Insert sample data for Austin Public Library application

-- Insert publishers
INSERT INTO publishers (name, address, city, state, country, website_url) VALUES
('Penguin Random House', '1745 Broadway', 'New York', 'NY', 'USA', 'https://www.penguinrandomhouse.com'),
('HarperCollins', '195 Broadway', 'New York', 'NY', 'USA', 'https://www.harpercollins.com'),
('Simon & Schuster', '1230 Avenue of the Americas', 'New York', 'NY', 'USA', 'https://www.simonandschuster.com'),
('Macmillan', '120 Broadway', 'New York', 'NY', 'USA', 'https://us.macmillan.com'),
('Scholastic', '557 Broadway', 'New York', 'NY', 'USA', 'https://www.scholastic.com'),
('Houghton Mifflin Harcourt', '125 High Street', 'Boston', 'MA', 'USA', 'https://www.hmhco.com'),
('Little, Brown and Company', '1290 Avenue of the Americas', 'New York', 'NY', 'USA', 'https://www.littlebrown.com');

-- Insert genres
INSERT INTO genres (name, description) VALUES
('Fiction', 'Literary works of imagination'),
('Non-Fiction', 'Factual and informational works'),
('Mystery', 'Stories involving puzzles, crimes, or unexplained events'),
('Romance', 'Stories focused on love and relationships'),
('Science Fiction', 'Speculative fiction dealing with futuristic concepts'),
('Fantasy', 'Fiction involving magical or supernatural elements'),
('Biography', 'Life stories of real people'),
('History', 'Records and analysis of past events'),
('Self-Help', 'Books designed to help readers improve their lives'),
('Children''s', 'Books written specifically for children'),
('Young Adult', 'Books targeted at teenage readers'),
('Horror', 'Fiction intended to frighten, unsettle, or create suspense'),
('Thriller', 'Fast-paced fiction with constant danger'),
('Comedy', 'Humorous fiction and non-fiction'),
('Drama', 'Serious fiction exploring human emotions'),
('Poetry', 'Literary works in verse'),
('Art', 'Books about visual arts and creativity'),
('Science', 'Books about scientific topics and discoveries'),
('Technology', 'Books about technological developments'),
('Business', 'Books about commerce, economics, and management'),
('Health', 'Books about physical and mental wellness'),
('Travel', 'Books about places and travel experiences'),
('Cooking', 'Recipe books and culinary guides'),
('Sports', 'Books about athletic activities and sports'),
('Music', 'Books about musical arts and musicians');

-- Insert authors
INSERT INTO authors (first_name, last_name, biography, nationality, image_url) VALUES
('Jeff', 'Kinney', 'American author and cartoonist, best known for the Diary of a Wimpy Kid series', 'American', '/placeholder.svg?height=150&width=150&text=Jeff+Kinney'),
('J.K.', 'Rowling', 'British author, best known for the Harry Potter series', 'British', '/placeholder.svg?height=150&width=150&text=J.K.+Rowling'),
('Stephen', 'King', 'American author of horror, supernatural fiction, suspense, and fantasy novels', 'American', '/placeholder.svg?height=150&width=150&text=Stephen+King'),
('Agatha', 'Christie', 'English writer known for her detective novels', 'British', '/placeholder.svg?height=150&width=150&text=Agatha+Christie'),
('Jane', 'Austen', 'English novelist known for her social commentary and wit', 'British', '/placeholder.svg?height=150&width=150&text=Jane+Austen'),
('Mark', 'Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer', 'American', '/placeholder.svg?height=150&width=150&text=Mark+Twain'),
('Maya', 'Angelou', 'American poet, memoirist, and civil rights activist', 'American', '/placeholder.svg?height=150&width=150&text=Maya+Angelou'),
('Toni', 'Morrison', 'American novelist, essayist, book editor, and college professor', 'American', '/placeholder.svg?height=150&width=150&text=Toni+Morrison'),
('Harper', 'Lee', 'American novelist widely known for To Kill a Mockingbird', 'American', '/placeholder.svg?height=150&width=150&text=Harper+Lee'),
('F. Scott', 'Fitzgerald', 'American novelist and short story writer', 'American', '/placeholder.svg?height=150&width=150&text=F.+Scott+Fitzgerald'),
('Ernest', 'Hemingway', 'American novelist, short-story writer, and journalist', 'American', '/placeholder.svg?height=150&width=150&text=Ernest+Hemingway'),
('Gabriel García', 'Márquez', 'Colombian novelist, short-story writer, screenwriter, and journalist', 'Colombian', '/placeholder.svg?height=150&width=150&text=Gabriel+García+Márquez'),
('Margaret', 'Atwood', 'Canadian poet, novelist, literary critic, essayist, and environmental activist', 'Canadian', '/placeholder.svg?height=150&width=150&text=Margaret+Atwood'),
('Haruki', 'Murakami', 'Japanese writer whose work has been translated into 50 languages', 'Japanese', '/placeholder.svg?height=150&width=150&text=Haruki+Murakami'),
('Chimamanda Ngozi', 'Adichie', 'Nigerian writer whose works include novels, short stories and nonfiction', 'Nigerian', '/placeholder.svg?height=150&width=150&text=Chimamanda+Ngozi+Adichie'),
('Octavia', 'Butler', 'American science fiction author and a multiple recipient of the Hugo and Nebula awards', 'American', '/placeholder.svg?height=150&width=150&text=Octavia+Butler'),
('Ray', 'Bradbury', 'American author and screenwriter, best known for Fahrenheit 451', 'American', '/placeholder.svg?height=150&width=150&text=Ray+Bradbury'),
('Isaac', 'Asimov', 'American writer and professor of biochemistry, known for science fiction', 'American', '/placeholder.svg?height=150&width=150&text=Isaac+Asimov'),
('Ursula K.', 'Le Guin', 'American author best known for her works of speculative fiction', 'American', '/placeholder.svg?height=150&width=150&text=Ursula+K.+Le+Guin'),
('Neil', 'Gaiman', 'English author of short fiction, novels, comic books, graphic novels, and films', 'British', '/placeholder.svg?height=150&width=150&text=Neil+Gaiman');

-- Insert Austin Public Library branches
INSERT INTO branches (name, code, address, city, state, zip_code, phone, email, latitude, longitude, hours_of_operation, services, amenities, manager_name, established_date, square_footage, parking_spaces) VALUES
('Central Library', 'CENTRAL', '710 W César Chávez St', 'Austin', 'TX', '78701', '(512) 974-7300', 'central@austinlibrary.org', 30.2672, -97.7431, 
'{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-17:00", "saturday": "10:00-17:00", "sunday": "12:00-18:00"}',
'["Books & Media", "Computers & WiFi", "Meeting Rooms", "Café", "Parking", "Children''s Area", "Teen Zone", "Local History", "Maker Space", "Recording Studio"]',
'["Free WiFi", "Parking Available", "Café", "Accessible", "Rooftop Garden", "Art Gallery"]',
'Maria Rodriguez', '1979-04-15', 198000, 200),

('North Village Branch', 'NORTH', '2505 Steck Ave', 'Austin', 'TX', '78757', '(512) 974-9960', 'northvillage@austinlibrary.org', 30.3672, -97.7431,
'{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-17:00", "saturday": "10:00-17:00", "sunday": "12:00-18:00"}',
'["Books & Media", "Computers & WiFi", "Children''s Programs", "Study Rooms", "Community Meeting Space"]',
'["Free WiFi", "Parking Available", "Accessible", "Large Children''s Area", "Quiet Study Rooms", "Community Garden"]',
'James Thompson', '1985-09-22', 15000, 75),

('Southeast Branch', 'SOUTHEAST', '5803 Nuckols Crossing Rd', 'Austin', 'TX', '78744', '(512) 974-8840', 'southeast@austinlibrary.org', 30.1672, -97.7431,
'{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-17:00", "saturday": "10:00-17:00", "sunday": "12:00-18:00"}',
'["Books & Media", "Computers & WiFi", "Teen Programs", "Community Room", "ESL Classes"]',
'["Free WiFi", "Parking Available", "Accessible", "Bilingual Staff", "Bilingual Collection", "Teen Gaming Area", "Community Kitchen"]',
'Carmen Gonzalez', '1992-03-10', 12000, 60),

('Westbank Branch', 'WESTBANK', '1309 Westbank Dr', 'Austin', 'TX', '78746', '(512) 974-9840', 'westbank@austinlibrary.org', 30.2672, -97.8431,
'{"monday": "10:00-21:00", "tuesday": "10:00-21:00", "wednesday": "10:00-21:00", "thursday": "10:00-21:00", "friday": "10:00-17:00", "saturday": "10:00-17:00", "sunday": "12:00-18:00"}',
'["Books & Media", "Computers & WiFi", "Local History Archive", "Quiet Study Areas", "Senior Programs"]',
'["Free WiFi", "Parking Available", "Accessible", "Local History Collection", "Genealogy Resources", "Silent Study Floor"]',
'Robert Chen', '1988-11-05', 10000, 45);

-- Insert your personal user account
INSERT INTO users (email, password_hash, library_card_number, first_name, last_name, phone, address, city, state, zip_code, date_of_birth, profile_image_url, notification_preferences, reading_preferences) VALUES
('user@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhZ8.vJbqoqXrjexM6B.Iq', '1234567890', 'Alex', 'Johnson', '(512) 555-0123', '123 Main St', 'Austin', 'TX', '78701', '1990-01-15', '/placeholder.svg?height=150&width=150&text=Alex+Johnson', 
'{"email": true, "sms": true, "push": true, "due_date_reminders": true, "hold_notifications": true, "new_arrivals": false}',
'{"genres": ["Science Fiction", "Fantasy", "Mystery", "Technology"], "formats": ["physical", "ebook", "audiobook"], "preferred_authors": ["Neil Gaiman", "Isaac Asimov"]}');

-- Insert sample users for testing
INSERT INTO users (email, password_hash, library_card_number, first_name, last_name, phone, address, city, state, zip_code, date_of_birth, profile_image_url) VALUES
('sarah.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhZ8.vJbqoqXrjexM6B.Iq', 'APL123456789', 'Sarah', 'Johnson', '(512) 555-0124', '456 Oak Ave', 'Austin', 'TX', '78702', '1985-03-22', '/placeholder.svg?height=150&width=150&text=Sarah+Johnson'),
('mike.davis@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhZ8.vJbqoqXrjexM6B.Iq', 'APL987654321', 'Mike', 'Davis', '(512) 555-0125', '789 Pine St', 'Austin', 'TX', '78703', '1992-07-08', '/placeholder.svg?height=150&width=150&text=Mike+Davis'),
('emily.chen@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhZ8.vJbqoqXrjexM6B.Iq', 'APL456789123', 'Emily', 'Chen', '(512) 555-0126', '321 Elm Dr', 'Austin', 'TX', '78704', '1988-11-30', '/placeholder.svg?height=150&width=150&text=Emily+Chen');

-- Insert Diary of a Wimpy Kid series
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('Diary of a Wimpy Kid', '9780810993136', 2007, 5, 'English', 217, 'Greg Heffley finds himself thrust into a new year and a new school where undersize weaklings share the hallways with kids who are taller, meaner, and already shaving.', '/placeholder.svg?height=300&width=200&text=Diary+of+a+Wimpy+Kid', 'physical', 4.2, 15420),
('Diary of a Wimpy Kid: Rodrick Rules', '9780810994737', 2008, 5, 'English', 224, 'Greg Heffley tells about his summer vacation and his attempts to steer clear of trouble when he returns to middle school and tries to keep his older brother Rodrick from telling everyone about Greg''s most humiliating experience of the summer.', '/placeholder.svg?height=300&width=200&text=Rodrick+Rules', 'physical', 4.3, 12890),
('Diary of a Wimpy Kid: The Last Straw', '9780810970687', 2009, 5, 'English', 224, 'Greg Heffley is in big trouble. School property has been damaged, and Greg is the prime suspect. But the crazy thing is, he''s innocent. Or at least sort of.', '/placeholder.svg?height=300&width=200&text=The+Last+Straw', 'physical', 4.1, 11250),
('Diary of a Wimpy Kid: Dog Days', '9780810983915', 2009, 5, 'English', 224, 'It''s summer vacation, the weather''s great, and all the kids are having fun outside. So where''s Greg Heffley? Inside his house, playing video games with the shades drawn.', '/placeholder.svg?height=300&width=200&text=Dog+Days', 'physical', 4.0, 10890),
('Diary of a Wimpy Kid: The Ugly Truth', '9780810984912', 2010, 5, 'English', 224, 'Greg Heffley has always been in a hurry to grow up. But is getting older really all it''s cracked up to be?', '/placeholder.svg?height=300&width=200&text=The+Ugly+Truth', 'physical', 4.2, 9870);

-- Insert classic literature (excluding 1984)
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('To Kill a Mockingbird', '9780061120084', 1960, 2, 'English', 376, 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', '/placeholder.svg?height=300&width=200&text=To+Kill+a+Mockingbird', 'physical', 4.3, 45230),
('Pride and Prejudice', '9780141439518', 1813, 1, 'English', 432, 'When Elizabeth Bennet meets the proud and prejudiced Mr. Darcy, sparks fly. But is it love or hate?', '/placeholder.svg?height=300&width=200&text=Pride+and+Prejudice', 'physical', 4.4, 38920),
('The Great Gatsby', '9780743273565', 1925, 3, 'English', 180, 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', '/placeholder.svg?height=300&width=200&text=The+Great+Gatsby', 'physical', 3.9, 52340),
('The Catcher in the Rye', '9780316769174', 1951, 7, 'English', 277, 'The adventures of Holden Caulfield, a teenager who has been expelled from prep school.', '/placeholder.svg?height=300&width=200&text=The+Catcher+in+the+Rye', 'physical', 3.8, 41230),
('Lord of the Flies', '9780571056866', 1954, 4, 'English', 224, 'A group of English boys stranded on a deserted island struggle to survive.', '/placeholder.svg?height=300&width=200&text=Lord+of+the+Flies', 'physical', 3.7, 35670);

-- Insert contemporary fiction
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('The Seven Moons of Maali Almeida', '9781324090441', 2022, 4, 'English', 416, 'A darkly comic fantasy about a photographer who must solve his own murder from the afterlife.', '/placeholder.svg?height=300&width=200&text=Seven+Moons+of+Maali+Almeida', 'physical', 4.1, 8920),
('Tomorrow, and Tomorrow, and Tomorrow', '9780593321201', 2022, 1, 'English', 416, 'A novel about friendship, art, and the creative process through video game design.', '/placeholder.svg?height=300&width=200&text=Tomorrow+and+Tomorrow', 'ebook', 4.3, 12450),
('The Atlas Six', '9781250784360', 2022, 4, 'English', 464, 'Six young magicians compete for a place in an exclusive society.', '/placeholder.svg?height=300&width=200&text=The+Atlas+Six', 'physical', 3.9, 15670),
('Klara and the Sun', '9780571364879', 2021, 4, 'English', 320, 'A story told from the perspective of an artificial friend observing human nature.', '/placeholder.svg?height=300&width=200&text=Klara+and+the+Sun', 'ebook', 4.0, 18920),
('The Midnight Library', '9780525559481', 2020, 1, 'English', 288, 'A novel about all the choices that go into a life well lived.', '/placeholder.svg?height=300&width=200&text=The+Midnight+Library', 'physical', 4.2, 25340);

-- Insert science fiction
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('Project Hail Mary', '9780593135204', 2021, 1, 'English', 496, 'A lone astronaut must save the earth from disaster in this thrilling space adventure.', '/placeholder.svg?height=300&width=200&text=Project+Hail+Mary', 'audiobook', 4.6, 32450),
('Dune', '9780441172719', 1965, 1, 'English', 688, 'Set on the desert planet Arrakis, this epic tale of politics, religion, and ecology has become a science fiction classic.', '/placeholder.svg?height=300&width=200&text=Dune', 'physical', 4.3, 89230),
('Foundation', '9780553293357', 1951, 1, 'English', 244, 'The first novel in Isaac Asimov''s classic Foundation series about the fall and rise of a galactic empire.', '/placeholder.svg?height=300&width=200&text=Foundation', 'ebook', 4.1, 45670),
('The Left Hand of Darkness', '9780441478125', 1969, 1, 'English', 304, 'A groundbreaking work of science fiction that explores themes of gender and society.', '/placeholder.svg?height=300&width=200&text=Left+Hand+of+Darkness', 'physical', 4.0, 28920),
('Neuromancer', '9780441569595', 1984, 1, 'English', 271, 'The novel that launched the cyberpunk genre and won the Hugo, Nebula, and Philip K. Dick Awards.', '/placeholder.svg?height=300&width=200&text=Neuromancer', 'ebook', 3.9, 34560);

-- Insert mystery novels
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('Murder on the Orient Express', '9780062693662', 1934, 2, 'English', 256, 'Hercule Poirot investigates a murder aboard the famous Orient Express.', '/placeholder.svg?height=300&width=200&text=Murder+on+Orient+Express', 'physical', 4.2, 67890),
('The Girl with the Dragon Tattoo', '9780307949486', 2005, 1, 'English', 590, 'A journalist and a hacker investigate a wealthy family''s dark secrets.', '/placeholder.svg?height=300&width=200&text=Girl+with+Dragon+Tattoo', 'ebook', 4.1, 89230),
('Gone Girl', '9780307588371', 2012, 1, 'English', 419, 'A psychological thriller about a marriage gone terribly wrong.', '/placeholder.svg?height=300&width=200&text=Gone+Girl', 'audiobook', 4.0, 125670),
('The Big Sleep', '9780394758282', 1939, 1, 'English', 231, 'Private detective Philip Marlowe investigates a blackmail case in 1940s Los Angeles.', '/placeholder.svg?height=300&width=200&text=The+Big+Sleep', 'physical', 3.9, 23450),
('In the Woods', '9780143113492', 2007, 1, 'English', 429, 'A detective investigates a child''s murder that echoes a case from his own past.', '/placeholder.svg?height=300&width=200&text=In+the+Woods', 'ebook', 3.8, 34560);

-- Insert non-fiction
INSERT INTO books (title, isbn_13, publication_year, publisher_id, language, pages, description, cover_image_url, format_type, average_rating, rating_count) VALUES
('Atomic Habits', '9780735211292', 2018, 1, 'English', 320, 'An easy & proven way to build good habits & break bad ones.', '/placeholder.svg?height=300&width=200&text=Atomic+Habits', 'physical', 4.4, 78920),
('Sapiens', '9780062316097', 2014, 2, 'English', 443, 'A brief history of humankind from the Stone Age to the present.', '/placeholder.svg?height=300&width=200&text=Sapiens', 'ebook', 4.3, 89230),
('Educated', '9780399590504', 2018, 1, 'English', 334, 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.', '/placeholder.svg?height=300&width=200&text=Educated', 'audiobook', 4.5, 156780),
('Becoming', '9781524763138', 2018, 1, 'English', 448, 'Former First Lady Michelle Obama''s memoir about her life and experiences.', '/placeholder.svg?height=300&width=200&text=Becoming', 'physical', 4.6, 234560),
('The Immortal Life of Henrietta Lacks', '9781400052189', 2010, 1, 'English', 381, 'The story of how cells from a poor black woman became a medical miracle.', '/placeholder.svg?height=300&width=200&text=Henrietta+Lacks', 'ebook', 4.2, 67890);
