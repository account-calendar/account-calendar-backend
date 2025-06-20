-- Account Calendar Database Schema
-- Created for NestJS Backend

USE account_calendar;

-- User table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    target_expense INT NULL,
    deleted_date DATE NULL,
    created_date DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Major category table
CREATE TABLE major_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NULL COMMENT 'ascii code',
    type TINYINT NOT NULL COMMENT '수입 || 지출',
    created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    updated_date DATE NULL,
    deleted_date DATE NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Middle category table
CREATE TABLE middle_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    major_category_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NULL COMMENT 'ascii code',
    type TINYINT NOT NULL COMMENT '수입 || 지출',
    created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    updated_date DATE NULL,
    deleted_date DATE NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (major_category_id) REFERENCES major_category(id)
);

-- Transaction table
CREATE TABLE transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    middle_category_id INT NULL,
    major_category_id INT NULL,
    price INT NOT NULL,
    type TINYINT NOT NULL COMMENT '수입 || 지출',
    registration_date DATE NOT NULL COMMENT '수입 지출내역 등록일',
    memo VARCHAR(500) NULL,
    created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    updated_date DATE NULL,
    deleted_date DATE NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (middle_category_id) REFERENCES middle_category(id),
    FOREIGN KEY (major_category_id) REFERENCES major_category(id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_deleted_date ON user(deleted_date);
CREATE INDEX idx_major_category_user_id ON major_category(user_id);
CREATE INDEX idx_major_category_deleted_date ON major_category(deleted_date);
CREATE INDEX idx_middle_category_user_id ON middle_category(user_id);
CREATE INDEX idx_middle_category_major_category_id ON middle_category(major_category_id);
CREATE INDEX idx_middle_category_deleted_date ON middle_category(deleted_date);
CREATE INDEX idx_transaction_user_id ON transaction(user_id);
CREATE INDEX idx_transaction_registration_date ON transaction(registration_date);
CREATE INDEX idx_transaction_deleted_date ON transaction(deleted_date); 