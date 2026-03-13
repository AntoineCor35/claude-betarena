# Mobile Layer Rules

> Copy this file to your `src/` or `mobile/` directory. Claude merges it automatically with the root CLAUDE.md when working in this directory.

## React Native Rules

- Always use `StyleSheet.create()` — never inline styles except for dynamic values.
- Use `React.memo()` for list item components and any component rendered in a FlatList.
- Never use `useEffect` for derived state — compute it directly.
- Use `useCallback` for functions passed as props to child components.
- Prefer `FlatList` over `ScrollView` + `.map()` for lists of any length.

## Component Structure

Every component file follows this order:
1. Imports
2. Type definitions (Props interface)
3. Component function
4. Styles (`StyleSheet.create()`)

## Navigation

- All route names are defined in `src/navigation/routes.ts` — never use magic strings.
- Screen components receive typed navigation props: `NativeStackScreenProps<RootStackParamList, 'ScreenName'>`.
- Deep links must be registered in the navigation config.

## API Calls

- All API calls go through `src/services/` — never call fetch/axios directly from components.
- Use React Query hooks for data fetching — `useQuery` for reads, `useMutation` for writes.
- Handle loading, error, and empty states in every screen that fetches data.

## Platform-Specific Code

- Use `Platform.select()` or `.ios.tsx` / `.android.tsx` suffixes for platform differences.
- Never assume a specific platform in shared code.
- Test on both iOS and Android before marking a phase as complete.
