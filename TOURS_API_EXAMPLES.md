# 📚 Tours API - Example Requests & Responses

## Base URL
```
http://localhost:5000/api/tours
```

---

## 1. GET All Tours with Pagination

### Request
```bash
GET /api/tours?page=1&limit=6
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Maldives Beach Paradise",
      "country": "Maldives",
      "category": "Beach",
      "days": 5,
      "price": 1299,
      "oldPrice": 1599,
      "currency": "USD",
      "description": "Experience pristine beaches, crystal clear waters, and luxury resort stays in the beautiful Maldives.",
      "rating": 4.8,
      "reviews": 245,
      "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop",
      "highlights": ["Private beach access", "Snorkeling in coral reefs", "Water sports activities", "Sunset cruise", "Spa treatments"],
      "maxGroupSize": 8,
      "difficulty": "Easy",
      "available": true,
      "createdAt": "2024-11-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Swiss Alps Mountain Trek",
      "country": "Switzerland",
      "category": "Mountain",
      "days": 7,
      "price": 1899,
      "oldPrice": 2299,
      "currency": "USD",
      "description": "Hike through stunning Alpine landscapes with breathtaking views of snow-capped peaks.",
      "rating": 4.9,
      "reviews": 312,
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
      "highlights": ["Guided mountain hiking", "Alpine lodge stays", "Scenic cable car rides", "Local cheese tasting", "Photography opportunities"],
      "maxGroupSize": 12,
      "difficulty": "Hard",
      "available": true,
      "createdAt": "2024-11-05T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalTours": 12,
    "limit": 6
  }
}
```

---

## 2. Search Tours

### Request
```bash
GET /api/tours?search=beach
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "Maldives Beach Paradise",
      "country": "Maldives",
      "category": "Beach",
      "days": 5,
      "price": 1299,
      ...
    },
    {
      "title": "Caribbean Cruise",
      "country": "Caribbean",
      "category": "Beach",
      "days": 7,
      "price": 1699,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 2,
    "limit": 12
  }
}
```

---

## 3. Filter by Category

### Request
```bash
GET /api/tours?category=Adventure
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "Amazon Rainforest Expedition",
      "country": "Peru",
      "category": "Adventure",
      "days": 6,
      "price": 1599,
      "rating": 4.6,
      ...
    },
    {
      "title": "Iceland Glaciers & Geysers",
      "country": "Iceland",
      "category": "Adventure",
      "days": 5,
      "price": 1499,
      "rating": 4.7,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 4,
    "limit": 12
  }
}
```

---

## 4. Price Range Filter

### Request
```bash
GET /api/tours?minPrice=1200&maxPrice=1800
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "Amazon Rainforest Expedition",
      "price": 1599,
      ...
    },
    {
      "title": "Morocco Desert Safari",
      "price": 1199,
      ...
    },
    {
      "title": "Caribbean Cruise",
      "price": 1699,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 3,
    "limit": 12
  }
}
```

---

## 5. Sort by Price (Low to High)

### Request
```bash
GET /api/tours?sortBy=price-low
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "New York Metropolis",
      "price": 799,
      ...
    },
    {
      "title": "Tokyo City Adventure",
      "price": 899,
      ...
    },
    {
      "title": "Paris Romance Escape",
      "price": 899,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 12,
    "limit": 12
  }
}
```

---

## 6. Sort by Rating (Top Rated)

### Request
```bash
GET /api/tours?sortBy=rating
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "Swiss Alps Mountain Trek",
      "rating": 4.9,
      "reviews": 312,
      ...
    },
    {
      "title": "Bali Luxury Retreat",
      "rating": 4.9,
      "reviews": 356,
      ...
    },
    {
      "title": "Patagonia Adventure",
      "rating": 4.9,
      "reviews": 145,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 12,
    "limit": 12
  }
}
```

---

## 7. Combined Filters

### Request
```bash
GET /api/tours?category=Beach&minPrice=1000&maxPrice=1800&sortBy=price-low
```

### Response (200 OK)
```json
{
  "tours": [
    {
      "title": "Maldives Beach Paradise",
      "country": "Maldives",
      "category": "Beach",
      "price": 1299,
      "rating": 4.8,
      ...
    },
    {
      "title": "Caribbean Cruise",
      "country": "Caribbean",
      "category": "Beach",
      "price": 1699,
      "rating": 4.8,
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTours": 2,
    "limit": 12
  }
}
```

---

## 8. Get Tours by Category

### Request
```bash
GET /api/tours/category/Beach
```

### Response (200 OK)
```json
[
  {
    "title": "Maldives Beach Paradise",
    "country": "Maldives",
    "category": "Beach",
    "price": 1299,
    ...
  },
  {
    "title": "Caribbean Cruise",
    "country": "Caribbean",
    "category": "Beach",
    "price": 1699,
    ...
  }
]
```

---

## 9. Get Featured Tours

### Request
```bash
GET /api/tours/featured/all
```

### Response (200 OK)
```json
[
  {
    "title": "Swiss Alps Mountain Trek",
    "rating": 4.9,
    "reviews": 312,
    "price": 1899,
    ...
  },
  {
    "title": "Bali Luxury Retreat",
    "rating": 4.9,
    "reviews": 356,
    "price": 1799,
    ...
  },
  {
    "title": "Patagonia Adventure",
    "rating": 4.9,
    "reviews": 145,
    "price": 1999,
    ...
  },
  {
    "title": "Maldives Beach Paradise",
    "rating": 4.8,
    "reviews": 245,
    "price": 1299,
    ...
  },
  {
    "title": "Egypt Ancient Wonders",
    "rating": 4.8,
    "reviews": 289,
    "price": 999,
    ...
  },
  {
    "title": "Paris Romance Escape",
    "rating": 4.8,
    "reviews": 512,
    "price": 899,
    ...
  }
]
```

---

## 10. Get Tour Details

### Request
```bash
GET /api/tours/details/Maldives%20Beach%20Paradise
```

### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Maldives Beach Paradise",
  "country": "Maldives",
  "category": "Beach",
  "days": 5,
  "price": 1299,
  "oldPrice": 1599,
  "currency": "USD",
  "description": "Experience pristine beaches, crystal clear waters, and luxury resort stays in the beautiful Maldives.",
  "rating": 4.8,
  "reviews": 245,
  "image": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop",
  "highlights": [
    "Private beach access",
    "Snorkeling in coral reefs",
    "Water sports activities",
    "Sunset cruise",
    "Spa treatments"
  ],
  "maxGroupSize": 8,
  "difficulty": "Easy",
  "available": true,
  "createdAt": "2024-11-01T00:00:00.000Z"
}
```

---

## 11. Get Statistics

### Request
```bash
GET /api/tours/stats/all
```

### Response (200 OK)
```json
[
  {
    "_id": "Adventure",
    "count": 4,
    "avgPrice": 1574.5,
    "avgRating": 4.725
  },
  {
    "_id": "Beach",
    "count": 2,
    "avgPrice": 1499,
    "avgRating": 4.8
  },
  {
    "_id": "City",
    "count": 2,
    "avgPrice": 849,
    "avgRating": 4.65
  },
  {
    "_id": "Culture",
    "count": 2,
    "avgPrice": 949,
    "avgRating": 4.8
  },
  {
    "_id": "Luxury",
    "count": 1,
    "avgPrice": 1799,
    "avgRating": 4.9
  },
  {
    "_id": "Mountain",
    "count": 1,
    "avgPrice": 1899,
    "avgRating": 4.9
  }
]
```

---

## 12. Create New Tour (Admin)

### Request
```bash
POST /api/tours
Content-Type: application/json

{
  "title": "Santorini Island Escape",
  "country": "Greece",
  "category": "Beach",
  "days": 5,
  "price": 1400,
  "oldPrice": 1700,
  "currency": "USD",
  "description": "Enjoy the stunning sunsets and white-washed buildings of Santorini.",
  "rating": 4.9,
  "reviews": 189,
  "image": "https://images.unsplash.com/photo-1613395877297-38b6b0db029a?w=500&h=400&fit=crop",
  "highlights": ["Caldera views", "Wine tasting", "Beach clubs", "Local cuisine", "Photography tours"],
  "maxGroupSize": 10,
  "difficulty": "Easy"
}
```

### Response (201 Created)
```json
{
  "message": "Tour created successfully",
  "tour": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Santorini Island Escape",
    "country": "Greece",
    "category": "Beach",
    "days": 5,
    "price": 1400,
    "oldPrice": 1700,
    "currency": "USD",
    "description": "Enjoy the stunning sunsets and white-washed buildings of Santorini.",
    "rating": 4.9,
    "reviews": 189,
    "image": "https://images.unsplash.com/photo-1613395877297-38b6b0db029a?w=500&h=400&fit=crop",
    "highlights": ["Caldera views", "Wine tasting", "Beach clubs", "Local cuisine", "Photography tours"],
    "maxGroupSize": 10,
    "difficulty": "Easy",
    "available": true,
    "createdAt": "2024-12-03T10:30:00.000Z"
  }
}
```

---

## 13. Update Tour

### Request
```bash
PUT /api/tours/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "price": 1199,
  "rating": 4.85,
  "reviews": 260
}
```

### Response (200 OK)
```json
{
  "message": "Tour updated successfully",
  "tour": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Maldives Beach Paradise",
    "country": "Maldives",
    "category": "Beach",
    "days": 5,
    "price": 1199,
    "oldPrice": 1599,
    "rating": 4.85,
    "reviews": 260,
    ...
  }
}
```

---

## 14. Delete Tour

### Request
```bash
DELETE /api/tours/507f1f77bcf86cd799439013
```

### Response (200 OK)
```json
{
  "message": "Tour deleted successfully",
  "tour": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Santorini Island Escape",
    ...
  }
}
```

---

## Error Responses

### 404 - Tour Not Found

### Request
```bash
GET /api/tours/details/NonexistentTour
```

### Response (404 Not Found)
```json
{
  "message": "Tour not found"
}
```

---

### 400 - Missing Required Fields

### Request
```bash
POST /api/tours
Content-Type: application/json

{
  "title": "Incomplete Tour"
}
```

### Response (400 Bad Request)
```json
{
  "message": "Missing required fields",
  "error": "title, country, category, days, price, description are required"
}
```

---

### 500 - Server Error

### Response (500 Internal Server Error)
```json
{
  "message": "Failed to fetch tours",
  "error": "Database connection error"
}
```

---

## cURL Examples

### Get all tours
```bash
curl http://localhost:5000/api/tours
```

### Search for beach tours
```bash
curl "http://localhost:5000/api/tours?search=beach"
```

### Filter by category and price
```bash
curl "http://localhost:5000/api/tours?category=Beach&minPrice=1000&maxPrice=1800"
```

### Sort by price (low to high)
```bash
curl "http://localhost:5000/api/tours?sortBy=price-low"
```

### Get featured tours
```bash
curl http://localhost:5000/api/tours/featured/all
```

### Get statistics
```bash
curl http://localhost:5000/api/tours/stats/all
```

### Create a tour
```bash
curl -X POST http://localhost:5000/api/tours \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Tour",
    "country": "Country",
    "category": "Beach",
    "days": 5,
    "price": 1000,
    "description": "Tour description"
  }'
```

### Update a tour
```bash
curl -X PUT http://localhost:5000/api/tours/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 900,
    "rating": 4.9
  }'
```

### Delete a tour
```bash
curl -X DELETE http://localhost:5000/api/tours/507f1f77bcf86cd799439011
```

---

## Notes

- All prices are in USD
- Ratings are on a scale of 0-5
- All sample tours are marked as available
- Images are from Unsplash CDN
- Responses follow RESTful conventions
- Pagination defaults: page=1, limit=12
- Timestamps are in ISO 8601 format
