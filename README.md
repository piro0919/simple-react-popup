# simple-react-popup

> Headless, compound popup component for React.

[![npm](https://img.shields.io/npm/v/simple-react-popup.svg)](https://www.npmjs.com/package/simple-react-popup)
[![license](https://img.shields.io/npm/l/simple-react-popup.svg)](./LICENSE)

A small, dependency-free popup/modal primitive built with compound components, React Portal, and accessibility defaults (focus management, ESC, scroll lock, `role="dialog"`).

🌐 **Demo:** <https://simple-react-popup.kkweb.io>

## Install

```bash
npm install simple-react-popup
# or
pnpm add simple-react-popup
# or
yarn add simple-react-popup
```

Requires React 18 or 19.

## Usage

```tsx
import { SimpleReactPopup } from "simple-react-popup";

export function Example() {
  return (
    <SimpleReactPopup>
      <SimpleReactPopup.Trigger>
        <button>Open</button>
      </SimpleReactPopup.Trigger>
      <SimpleReactPopup.Content>
        <h2>Hello</h2>
        <p>This is a popup.</p>
        <SimpleReactPopup.Close>
          <button>Close</button>
        </SimpleReactPopup.Close>
      </SimpleReactPopup.Content>
    </SimpleReactPopup>
  );
}
```

### Controlled mode

```tsx
const [open, setOpen] = useState(false);

<SimpleReactPopup open={open} onOpenChange={setOpen}>
  <SimpleReactPopup.Trigger>
    <button>Open</button>
  </SimpleReactPopup.Trigger>
  <SimpleReactPopup.Content>
    <p>Body</p>
  </SimpleReactPopup.Content>
</SimpleReactPopup>;
```

## API

### `<SimpleReactPopup>`

| Prop           | Type                      | Default | Description                         |
| -------------- | ------------------------- | ------- | ----------------------------------- |
| `defaultOpen`  | `boolean`                 | `false` | Initial open state (uncontrolled).  |
| `open`         | `boolean`                 | —       | Controlled open state.              |
| `onOpenChange` | `(open: boolean) => void` | —       | Called whenever open state changes. |

### `<SimpleReactPopup.Trigger>`

Wraps a single React element and toggles open state on click. Adds `aria-haspopup`, `aria-expanded`, and `aria-controls`.

### `<SimpleReactPopup.Content>`

Renders into `document.body` via portal when open.

| Prop                  | Type      | Default | Description                                              |
| --------------------- | --------- | ------- | -------------------------------------------------------- |
| `className`           | `string`  | —       | Class for the dialog box.                                |
| `overlayClassName`    | `string`  | —       | Class for the overlay. Disables default styles when set. |
| `closeOnOverlayClick` | `boolean` | `true`  | Close when the overlay (not content) is clicked.         |
| `closeOnEsc`          | `boolean` | `true`  | Close on Escape key.                                     |
| `lockScroll`          | `boolean` | `true`  | Lock `<body>` scroll while open.                         |

The dialog box exposes `data-state="open" | "closed"` for CSS transitions.

### `<SimpleReactPopup.Close>`

Wraps a single React element and closes the popup on click.

## License

MIT
