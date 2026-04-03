## Usage

To use the `Hero` component in your Next.js app (App Router), import it into `src/app/page.tsx` and include it as a JSX element.

Example (in `src/app/page.tsx`):

```
import Hero from '@/components/Hero'

export default function Page() {
  return (
    <main>
      <Hero />
      {/* other content */}
    </main>
  )
}
```

Notes

- The component uses Tailwind CSS classes. Ensure Tailwind is configured in the project.
- Replace the `img` `src` in `Hero.tsx` with a local image path (e.g., `/images/hero.jpg` in `public/`) for production.
- You can tweak spacing, font sizes, and colors in the component to better match the design.
