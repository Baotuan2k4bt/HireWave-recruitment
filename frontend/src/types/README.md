# Types

Thư mục này chứa các type definitions và interfaces được sử dụng trong ứng dụng.

## Cấu trúc

- `navigation.types.ts`: Types và interfaces cho navigation và routing

## Sử dụng

```typescript
import { AccountType, NavigationLink } from '../types/navigation.types';

const userRole: AccountType = 'APPLICANT';
const link: NavigationLink = {
    name: 'Find Jobs',
    url: '/find-jobs',
    roles: ['APPLICANT'],
    isPublic: false,
};
```

