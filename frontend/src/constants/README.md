# Constants

Thư mục này chứa các constants được sử dụng trong toàn bộ ứng dụng.

## Cấu trúc

- `route-paths.ts`: Định nghĩa tất cả các route paths của ứng dụng
- `navigation-links.ts`: Định nghĩa các navigation links cho header và menu

## Sử dụng

### Route Paths

```typescript
import { ROUTE_PATHS, generateRoute } from '../constants/route-paths';

// Sử dụng constant
<Link to={ROUTE_PATHS.FIND_JOBS}>Tìm việc</Link>

// Generate dynamic route
const jobDetailUrl = generateRoute.jobDetail(jobId);
```

### Navigation Links

```typescript
import { PUBLIC_NAVIGATION_LINKS, PROTECTED_NAVIGATION_LINKS } from '../constants/navigation-links';

// Public links - hiển thị cho tất cả người dùng
PUBLIC_NAVIGATION_LINKS.forEach(link => { ... });

// Protected links - chỉ hiển thị khi đã đăng nhập
PROTECTED_NAVIGATION_LINKS.forEach(link => { ... });
```

