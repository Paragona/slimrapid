# App Structure

## src/
### app/
- layout.tsx
- page.tsx
- (auth)/
- calculator/
  - layout.tsx
  - page.tsx
- dashboard/
  - page.tsx
- profile/
  - page.tsx
- lib/
  - zod-types.ts
- types/
  - zod-schema.ts

### auth/
- AuthContext.tsx

### components/
- app-sidebar.tsx
- Features.tsx
- Footer.tsx
- Header.tsx
- Hero.tsx
- HowItWorks.tsx
- MapboxComponent.tsx
- MapComponent.tsx
- nav-main.tsx
- nav-projects.tsx
- nav-secondary.tsx
- nav-user.tsx
- Sidebar.tsx
- Testimonials.tsx
- calculator/
  - CalculatorForm.tsx
  - CostBreakdown.tsx
  - MoveDetailsSection.tsx
  - RouteMap.tsx
- ui/
  - address-input.tsx
  - avatar.tsx
  - breadcrumb.tsx
  - button.tsx
  - calendar.tsx
  - card.tsx
  - collapsible.tsx
  - dropdown-menu.tsx
  - input.tsx
  - label.tsx
  - select.tsx
  - separator.tsx
  - sheet.tsx
  - sidebar.tsx
  - skeleton.tsx
  - tooltip.tsx

### config/
- config.ts
- index.ts
- navigation.ts
- site.ts
- styles.ts
- theme.ts

### hooks/
- use-mobile.tsx

### lib/
- api.ts
- constants.ts
- jwt.ts
- mongodb.ts
- query.ts
- utils.ts
- validation.ts
- zod-types.ts

### services/
- calculator/
  - calculator.service.ts
  - cost.service.ts
  - route.service.ts

### styles/
- calendar.css
- favicon.ico
- globals.css
- Header.module.css

### types/
- types.md
- All types are documented in types.md
- auth.ts
- calculator.ts
- config.ts
- index.ts
- mapbox.ts
- navigation.ts
- styles.ts
- zod-schema.ts

## public/
- file.svg
- globe.svg
- index.html
- moving-truck.svg
- next.svg
- vercel.svg
- window.svg

## functions/
- .eslintrc.js
- .gitignore
- package-lock.json
- package.json
- tsconfig.dev.json
- tsconfig.json
- src/
  - index.ts

## dataconnect/
- dataconnect.yaml
- connector/
  - connector.yaml
  - mutations.gql
  - queries.gql
- schema/
  - schema.gql
- dataconnect-generated/
  - js/
    - default-connector/
      - index.cjs.js
      - index.d.ts
      - package.json
      - esm/
        - index.esm.js
        - package.json

## styles_src.md
- All styles are documented in styles_src.md
