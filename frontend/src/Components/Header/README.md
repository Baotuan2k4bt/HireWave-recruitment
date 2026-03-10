# Header Component - TopCV Style

Header mới được thiết kế theo phong cách TopCV, hiện đại và chuyên nghiệp.

## Cấu trúc

- `HeaderNew.tsx` - Component Header chính
- `DropdownMenu.tsx` - Component dropdown menu
- `ProfileMenuNew.tsx` - Component menu profile khi đã đăng nhập
- `header-menu.config.ts` - Config menu items (trong constants)

## Tính năng

### Desktop
- Header cố định trên cùng (fixed top)
- Menu chính ở giữa với dropdown
- Logo bên trái
- Auth buttons / Profile menu bên phải
- Hover effects mượt mà
- Active state rõ ràng

### Mobile
- Hamburger menu
- Responsive design
- Menu items hiển thị dạng list

## Cấu hình Menu

Menu được cấu hình trong `constants/header-menu.config.ts`:

```typescript
{
    label: 'Việc làm',
    items: [
        {
            label: 'Tìm việc làm',
            path: '/find-jobs',
            icon: IconSearch,
        },
        {
            label: 'Việc đã lưu',
            path: '/saved-jobs',
            requiresAuth: true,
            roles: ['APPLICANT', 'ADMIN'],
        },
        // ...
    ],
}
```

## Logic xử lý

- **Public routes**: Hiển thị cho tất cả người dùng
- **Protected routes**: 
  - Nếu `requiresAuth: true` và chưa đăng nhập → redirect đến `/login`
  - Nếu có `roles` → chỉ hiển thị cho user có role phù hợp

## Styling

- Sử dụng TailwindCSS
- Màu chính: `oceanTeal-500` (xanh teal)
- Màu text: `deepSlate-700` (xám đậm)
- Shadow nhẹ cho dropdown
- Border radius: `rounded-lg`
- Transition: `duration-200`

## Sử dụng

Header đã được tích hợp vào `AppRoutes.tsx`. Để sử dụng:

```tsx
import HeaderNew from '../Components/Header/HeaderNew';

// Trong component
<HeaderNew />
```

## Responsive Breakpoints

- `lg:` - Desktop (>= 1024px): Hiển thị full menu
- Mobile (< 1024px): Hiển thị hamburger menu

