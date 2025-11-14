# Migration Guide

This guide helps you understand the changes made and how to work with the improved codebase.

## Breaking Changes

### Environment Variables
**REQUIRED**: You must now have a `.env` file with `URL_FFVB` defined.

Create a `.env` file in the project root:
```env
PORT=8080
NODE_ENV=development
URL_FFVB=https://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php
LOG_LEVEL=info
```

The application will fail to start if `URL_FFVB` is missing or invalid.

### API Validation
All API endpoints now validate query parameters:
- `saison` must be in format `YYYY/YYYY` (e.g., `2024/2025`)
- `codent`, `poule`, and `team` (where required) must not be empty

Invalid requests will return a 400 error with a descriptive message.

### Rate Limiting
API endpoints are now rate-limited:
- General API: 100 requests per 15 minutes per IP
- Scraping endpoints: 20 requests per 15 minutes per IP

Exceeding limits returns a 429 error.

## Code Changes

### Import Changes
If you were importing from these modules, note the function renames:

```typescript
// OLD
import { queryTableTeamsToArray, queryTableCalendarToArray } from "./utils/crawler"

// NEW
import { parseTeamsTable, parseCalendarTable } from "./utils/crawler"
```

### Type Changes
If you were working with calendar data:

```typescript
// OLD
const data: string[][][] = await extractAll(url)

// NEW
import { RawCalendarArray } from "./types"
const data: RawCalendarArray = await extractAll(url)
```

### Logger Changes
The logger now uses winston instead of console:

```typescript
// OLD
console.log("Message")
console.error("Error", error)

// NEW
import logger from "./utils/logger"
logger.info("Message", "functionName")
logger.error(error, "Error message", "functionName")
```

## New Features

### Validation Middleware
You can now use validation middleware in your routes:

```typescript
import { validateFFVBParams } from "./middleware/validation"

router.get("/endpoint", validateFFVBParams, controller.handler)
```

### Error Handling
Use the async handler wrapper for better error handling:

```typescript
import { asyncHandler } from "./middleware/errorHandler"

router.get("/endpoint", asyncHandler(async (req, res) => {
    // Your async code here
    // Errors are automatically caught and handled
}))
```

### Custom Errors
Throw custom errors with status codes:

```typescript
import { AppError } from "./middleware/errorHandler"

throw new AppError("Team not found", 404)
```

## Development Workflow

### Before Committing
```bash
# Format code
pnpm run format

# Check for linting errors
pnpm run lint

# Fix auto-fixable linting errors
pnpm run lint:fix

# Build to ensure no TypeScript errors
pnpm run build
```

### IDE Setup
For the best experience:
1. Install ESLint extension
2. Install Prettier extension
3. Enable "Format on Save" in your IDE
4. Set Prettier as the default formatter

## Testing the Changes

### Start the Development Server
```bash
pnpm run dev
```

The server will now:
- Validate environment variables on startup
- Log structured messages with winston
- Apply rate limiting
- Add security headers
- Validate all incoming requests

### Test API Endpoints

#### Valid Request
```bash
curl "http://localhost:8080/api/getteams?saison=2024/2025&codent=TEST&poule=1"
```

#### Invalid Request (will return 400)
```bash
curl "http://localhost:8080/api/getteams?saison=invalid&codent=TEST&poule=1"
```

#### Rate Limit Test
Make 21 requests to a scraping endpoint within 15 minutes - the 21st will be rate-limited.

## Troubleshooting

### "Missing required environment variables: URL_FFVB"
Create a `.env` file with the required variable.

### "URL_FFVB is not a valid URL"
Ensure your URL_FFVB starts with `http://` or `https://`.

### TypeScript Compilation Errors
Run `pnpm run build:backend` to see detailed error messages.

### ESLint Errors
Run `pnpm run lint` to see all linting errors.
Run `pnpm run lint:fix` to auto-fix many issues.

### Prettier Formatting Issues
Run `pnpm run format` to format all files.

## Rollback

If you need to rollback these changes:
```bash
git checkout <previous-commit-hash>
pnpm install
pnpm run build
```

Note: You'll lose the security improvements, validation, and type safety.

## Questions?

Refer to:
- `IMPROVEMENTS.md` - Detailed list of all improvements
- `README.md` - General project documentation
- Code comments - Inline documentation for complex logic

