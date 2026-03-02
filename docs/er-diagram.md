erDiagram
    users {
        bigint id PK
        string name
        string email
        datetime created_at
        datetime updated_at
    }

    aozora_books {
        bigint id PK
        string aozora_code
        string title
        string author
        string aozora_content_url
        string aozora_card_url
        date published_date
        datetime created_at
        datetime updated_at
    }

    bookshelves {
        bigint id PK
        bigint user_id FK "UQ(user_id, aozora_book_id)"
        bigint aozora_book_id FK "UQ(user_id, aozora_book_id)"
        integer status
        datetime completed_at
        integer rating
        text review
        datetime created_at
        datetime updated_at
    }

    users ||--o{ bookshelves : "has many"
    aozora_books ||--o{ bookshelves : "has many"