CREATE TABLE transactions (
                              id SERIAL PRIMARY KEY,
                              type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell', 'transfer_in', 'transfer_out')),
                              asset VARCHAR(10) NOT NULL,
                              amount DECIMAL(18, 8) NOT NULL,
                              price_per_unit DECIMAL(18, 2),
                              total DECIMAL(18, 2),
                              fee DECIMAL(18, 2) DEFAULT 0,
                              timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              note TEXT
);
