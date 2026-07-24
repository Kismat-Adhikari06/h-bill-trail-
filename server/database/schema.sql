--h- bill demo database schema 

DROP TABLE IF EXISTS bill_items;
DROP TABLE IF EXISTS bills;

--bill table
CREATE TABLE bills (
    id              SERIAL PRIMARY KEY,
    table_number    VARCHAR(10) NOT NULL,
    customer_name   VARCHAR(100),
    restaurant_name VARCHAR(150) DEFAULT 'H-Bill Restaurant',
    status          VARCHAR(20) DEFAULT 'open',
    subtotal        DECIMAL(10, 2) DEFAULT 0.00,
    vat_rate        DECIMAL(5, 2) DEFAULT 5.00,
    vat_amount      DECIMAL(10, 2) DEFAULT 0.00,
    total_amount    DECIMAL(10, 2) DEFAULT 0.00,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);


-- bill item tables
CREATE TABLE bill_items (
    id              SERIAL PRIMARY KEY,
    bill_id         INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    item_name       VARCHAR(150) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    unit_price      DECIMAL(10, 2) NOT NULL,
    total_price     DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);
