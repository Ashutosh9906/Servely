```mermaid
erDiagram

    USERS {
        INT user_id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password
        VARCHAR phone
        BOOLEAN is_verified
        TIMESTAMP created_at
    }

    OTP_VERIFICATION {
        INT otp_id PK
        INT user_id FK
        VARCHAR otp_code
        DATETIME expiry_time
        BOOLEAN is_used
    }

    PREMIUM_MEMBERSHIP {
        INT membership_id PK
        INT user_id FK
        DATE start_date
        DATE end_date
        ENUM plan_type
    }

    MENU {
        INT item_id PK
        VARCHAR item_name
        TEXT description
        DECIMAL price
        VARCHAR category
        BOOLEAN is_available
    }

    ORDERS {
        INT order_id PK
        INT user_id FK
        ENUM order_type
        ENUM order_status
        DECIMAL total_amount
        DECIMAL discount_applied
        DECIMAL final_amount
        BOOLEAN is_active
        TIMESTAMP created_at
    }

    ORDER_ITEMS {
        INT order_item_id PK
        INT order_id FK
        INT item_id FK
        INT quantity
        DECIMAL price
    }

    PAYMENTS {
        INT payment_id PK
        INT order_id FK
        ENUM payment_method
        ENUM payment_status
        DECIMAL amount
        TIMESTAMP paid_at
    }

    DRIVERS {
        INT driver_id PK
        VARCHAR name
        VARCHAR phone
        VARCHAR vehicle_number
        BOOLEAN is_available
    }

    DELIVERY {
        INT delivery_id PK
        INT order_id FK
        INT driver_id FK
        ENUM delivery_status
        TIMESTAMP assigned_at
    }

    ADDRESS {
        INT address_id PK
        INT user_id FK
        TEXT address_line
        VARCHAR city
        VARCHAR pincode
    }

    %% RELATIONSHIPS

    USERS ||--o{ ORDERS : places
    USERS ||--o{ OTP_VERIFICATION : verifies
    USERS ||--|| PREMIUM_MEMBERSHIP : has
    USERS ||--o{ ADDRESS : owns

    ORDERS ||--o{ ORDER_ITEMS : contains
    MENU ||--o{ ORDER_ITEMS : included_in

    ORDERS ||--|| PAYMENTS : paid_by
    ORDERS ||--|| DELIVERY : assigned

    DRIVERS ||--o{ DELIVERY : delivers
```