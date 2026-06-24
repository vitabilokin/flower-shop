# FlowerShop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.13.

## Дизайн-система Posy — правила верстки

- **Адаптивність обов'язкова для будь-якого нового компонента.** Перевіряй вигляд щонайменше на 3 ширинах: ~375px (мобільний), ~800px (планшет), ~1280px+ (десктоп).
- Для сіток карток використовуй `grid-template-columns: repeat(auto-fit, minmax(<мін-ширина>, 1fr))` замість набору фіксованих `@media`-брейкпоінтів — це адаптується плавно під будь-яку ширину.
- Для розмірів шрифтів і відступів, де доречно, використовуй `clamp()` (як у `--text-4xl`, `.hero__title`, `.not-found__code`).
- **Будь-який блок тексту чи кнопок усередині картки/контейнера повинен мати власний внутрішній `padding`** — не покладайся лише на `gap` грід-контейнера чи padding секції. Інакше на вузьких екранах (single-column) текст і кнопки розтягуються край-в-край без "повітря" (саме ця помилка була виправлена в картках каталогу й топ-букетів — додано обгортки `.card__text` / `.top-card__text` з горизонтальним padding).
- Кнопки в групах (`.hero__actions`, `.card__actions` тощо) мають отримувати `flex-wrap: wrap`, щоб не виходити за межі екрана на вузьких ширинах.
- Перевіряй, що жоден елемент не задає фіксовану ширину в `px` без `max-width: 100%` чи `clamp()` — інакше на малих екранах буде горизонтальний скрол.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
