# Swiss Dental Design Studio — Event Landing

Лендінг події на Цюрихському озері (12.09.2026), зверстаний за макетом Figma.

## 🔗 Подивитися онлайн
- **Німецька версія (DE):** https://blykhadavidrgb-code.github.io/swiss-dental-landing/
- **Англійська версія (EN):** https://blykhadavidrgb-code.github.io/swiss-dental-landing/en/

Сайт публікується через GitHub Pages з гілки `gh-pages`, тому оновлення треба пушити і в неї.

## Структура

- `index.html` — німецька версія (DE)
- `en/index.html` — англійська версія (EN)
- `css/style.css`, `js/main.js` — спільні стилі та скрипт (без фреймворків і збірки)
- `assets/` — зображення та іконки з макета

Відкрити: просто `index.html` у браузері або будь-який статичний хостинг.

## Що треба доробити
- Шрифт HelveticaNeueCyr (комерційний): покласти `HelveticaNeueCyr-{Light,Roman,Medium,Bold}.woff2` у `assets/fonts/`.
- Відео: вказати посилання у `VIDEO_SRC` у `js/main.js`.
- Форма: підключити відправку (місце позначене `TODO` у `js/main.js`).
- Слайдери спікерів: додати фото (`<img class="slider__slide">`).
- Посилання «Referentenprofil / Professional profiles», «Fachvorträge / Lectures», юридичні сторінки — зараз `#`.
- Стиснути зображення перед продакшеном (зараз ~18 MB).
