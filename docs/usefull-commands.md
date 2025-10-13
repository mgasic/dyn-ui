🧪 Vitest команде (без script-a)

# Watch mode за Avatar (препоручено за развој)
pnpm exec vitest --watch src/components/DynAvatar

# Једнократно покретање Avatar тестова
pnpm exec vitest --run src/components/DynAvatar

# Specific фајл
pnpm exec vitest --watch src/components/DynAvatar/DynAvatar.test.tsx

# Са coverage-om
pnpm exec vitest --coverage src/components/DynAvatar

# Са UI interface-om (отвара browser)
pnpm exec vitest --ui src/components/DynAvatar

# Verbose output (детаљни резултати)
pnpm exec vitest --reporter=verbose src/components/DynAvatar



📚 Storybook команде
Покретање Storybook-a:


# Стандардно покретање (све stories)
pnpm run storybook
# или
pnpm exec storybook dev

# Покретање на другом порту
pnpm exec storybook dev -p 6007

# Покретање без браузера
pnpm exec storybook dev --no-open

# Покрени само failing тестове да видим тачну грешку
pnpm exec vitest --run src/components/DynAvatar/DynAvatar.test.tsx --reporter=verbose


Навигација у браузеру (након покретања):
text
# DynAvatar stories директно
http://localhost:6006/?path=/docs/components-dynavatar--docs

# Specific story
http://localhost:6006/?path=/story/components-dynavatar--default
http://localhost:6006/?path=/story/components-dynavatar--sizes
http://localhost:6006/?path=/story/components-dynavatar--interactive-avatars
Build и static генерисање:
bash
# Build Storybook за production
pnpm exec storybook build

# Build у custom директоријум
pnpm exec storybook build -o storybook-static

# Serve built storybook
pnpm exec http-server storybook-static
Корисне development опције:
bash
# Са debug mode-om
pnpm exec storybook dev --debug-webpack

# Са quiet mode-om (мање логова)
pnpm exec storybook dev --quiet

# Force rebuild cache-a
pnpm exec storybook dev --no-manager-cache

# Са host за remote приступ
pnpm exec storybook dev --host 0.0.0.0



