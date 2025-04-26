# @cohostvip/cohost-react

React bindings for the [Cohost API](https://cohost.vip), built on top of [`@cohostvip/cohost-node`](https://www.npmjs.com/package/@cohostvip/cohost-node).

Use this package to easily connect your React or Next.js app to Cohost's event and order APIs using a provider/hook pattern.

---

## 📦 Installation

```bash
pnpm add @cohostvip/cohost-react
```

Or with npm:

```bash
npm install @cohostvip/cohost-react
```

---

## 🚀 Usage

Wrap your app (or part of it) in the `CohostProvider` and use the `useCohost()` hook to access the API client.

### Example

```tsx
// app.tsx or layout.tsx
import { CohostProvider } from '@cohostvip/cohost-react';

export function App() {
  return (
    <CohostProvider token="your-api-token">
      <MyComponent />
    </CohostProvider>
  );
}
```

```tsx
// inside your component
import { useCohost } from '@cohostvip/cohost-react';

function MyComponent() {
  const cohost = useCohost();

  useEffect(() => {
    cohost.events.list().then(console.log);
  }, []);

  return <div>Loaded events</div>;
}
```

---

## 🔐 Auth

Pass your API `token` to the `CohostProvider`. This token is required for all authenticated requests.  
You can optionally pass:

- `baseUrl` — override the default API URL (e.g. for staging)
- `debug` — enable console debugging of API requests

---

## 📘 API Reference

This wrapper gives you access to the full Cohost API as defined in [`@cohostvip/cohost-node`](https://www.npmjs.com/package/@cohostvip/cohost-node).  
See its documentation for available methods like:

- `client.events.list()`
- `client.orders.fetch(orderId, userId)`
- etc.

---

## ✅ Requirements

- React 18 or 19
- Next.js 14 or 15

---

## 🗒️ Changelog
See the latest changes [here](./CHANGELOG.md).

---

## 🚧 Roadmap
Planned features and improvements are tracked [here](./ROADMAP.md).

---

## 🛠️ Support

If you're building something custom or need help integrating, reach out at [cohost.vip](https://cohost.vip) or open an issue.

