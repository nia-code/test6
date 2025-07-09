### Backend Design

- Built with Express.js and file-based storage using JSON.
- `/api/items` handles basic CRUD:
  - GET with pagination and search
  - POST with full input validation
- `/api/stats` provides cached stats (total items and average price) using `fs.watch`.

### Trade-offs

- Used in-memory caching for `/stats` instead of recalculating each request.
- File-based storage was chosen for simplicity — would replace with a real DB in production.
- `getCookie()` included to simulate external token interaction — but not essential to core logic.
- Used Jest + Supertest for backend tests with realistic assertions and failure checks.

### Improvements (if given more time)

- Add DELETE/PUT to `/items/:id`
- Add more robust validation (e.g., Joi or zod)
- Refactor error handling into centralized middleware
- Make writes concurrency-safe or migrate to lowdb/SQLite

## Frontend Design

The frontend is a React SPA built using:

- React Router for routing
- Context API for global state (items, total count, loading)
- `react-window` for efficient rendering of item lists
- `react-loading-skeleton` for graceful loading UX
- Vanilla CSS for responsive and accessible styling
- RTL and Jest for component testing

### Key Features

- `Items` page: Lists paginated items with real-time search and virtualized rendering.
- `Upload` page: Form to submit new product (name, category, price) with validation and feedback.
- `ItemDetail`: Shows product detail with a skeleton loader.
- Full CRUD (read + create) experience integrated with backend.
- Component-level and integration tests ensure reliability.

### Trade-offs & Considerations

- Kept form state local instead of global (simpler for small forms).
- Chose built-in fetch + useCallback instead of libraries like SWR or React Query to reduce dependency overhead.
- Form validation is basic — could use libraries like `yup` or `react-hook-form` in future.
- Did not implement update/delete to keep scope focused.

### Improvements with More Time

- Add more tests (form validation, error messages).
- Convert styles to CSS modules or Tailwind.
- Add 404 or error fallback UI for detail pages.
- Improve accessibility (ARIA roles, focus states).
- Debounce the search input.
