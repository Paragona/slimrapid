# Styles Definitions

## Header.module.css

```css
/* Header Container */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  justify-content: space-between;
}

.header:hover {
  width: 100%;
}

.header::before {
  /* Additional styles */
}
```

## calendar.css

```css
.react-calendar {
  width: 100%;
  max-width: 100%;
  font-family: inherit;
  line-height: 1.125em;
}

.react-calendar--doubleView {
  width: 700px;
}

.react-calendar--doubleView .react-calendar__viewContainer {
  display: flex;
  margin: -0.5em;
}

.react-calendar--doubleView .react-calendar__viewContainer > * {
  width: 50%;
  margin: 0.5em;
}
```

## globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;

    --muted: 210 40% 96.1%;
  }
}
```
