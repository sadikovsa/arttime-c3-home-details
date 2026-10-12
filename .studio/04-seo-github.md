# SEO GitHub Pages — C3

## 1. Scope и фактический статус

2026-10-12. Вход: `.studio/06-distribution.md`, DESIGN.md, UX-CONTRACT.md, `.studio/02b-copy.json`, прежний native `.studio/04-seo.md`. Актуальная hosting-спецификация 06-distribution заменяет native-only URL в старом UX/report. GitHub Pages цель: **https://sadikovsa.github.io/arttime-c3-home-details/ — planned, публикация в SEO не проверена**. Native `/workspace/sites` не изменялся; commit/push/publishing/Search Console не выполнялись.

Изменены SEO поля head, robots/sitemap и добавлены responsive derivatives/srcset/sizes плюс lossless compressed font faces для C1/C2. Body редактура, структура, CSS visual rules, JS, motion, исходные img src/модальные JSON и ссылки на оригиналы сохранены в SEO scope. Root отдельно добавил FAQ/product-share/aria/noJS/startup corrections; они сохранены. `icons.css` link/файлы/порядок символических faces сохранены; C2 исходно не имеет icons.css. Подтверждение оригинальных фото и cmap/метрик/осей шрифтов: `../../seo/optimization.json` и `font-validation.json` относительно workspace distribution root.

## 2. Metadata и indexing

| Поле | Значение |
| --- | --- |
| lang | ru |
| title | Art Time — наполнение интерьера и декор дома в Ташкенте |
| description | Завершите интерьер с Art Time: картины, часы, вазы и аксессуары для каждой комнаты. Подбор предметов, выезд и размещение. Ташкент, Тимура Малика, 3А. |
| H1 | Ваш дом. До последней детали. |
| canonical / OG / Twitter / WebPage | https://sadikovsa.github.io/arttime-c3-home-details/ |
| social image | https://sadikovsa.github.io/arttime-c3-home-details/assets/img/social.png (PNG 1200×630) |
| robots meta | noindex,follow |

Все Pages SEO URLs содержат правильный `/arttime-c3-home-details/` prefix; frontend assets остались относительными. Titles/descriptions уникальны между вариантами. Это три альтернативных дизайна одного бизнеса, не три официальных магазина. HomeGoodsStore содержит только подтверждённые Art Time / +998980000048 / Ташкент, Тимура Малика 3А / официальный Instagram, со shared business identity. Нет отзывов/рейтингов/цен/наличия/часов/геоданных/SKU. JSON-LD разобран как JSON; rich-results eligibility не обещана.

`robots.txt` лежит под project prefix и **не управляет robots корня sadikovsa.github.io**; Allow разрешает прочитать HTML noindex, а не индексирует страницу. Никакого Disallow, мешающего прочитать noindex, не добавлено. Sitemap — empty XML inventory: индексируемых страниц нет, URL с noindex не рекламируются. Sitemap не отправлен и не объявлен в robots. Финальный основной production-вариант/index-policy выбираются отдельно.

## 3. Assets, контент и scoped оптимизация

Все 31 исходных изображений декодируются, имеют alt и intrinsic width/height с правильным aspect ratio. У ряда исходных width/height значения масштабированы относительно файла; ratio сохранён, атрибуты не менялись. Social PNG декодирован1200×630; SVG favicon valid XML. Проверены все local HTML src/href/srcset и CSS font URLs, существование и fontTools декодирование TTF/WOFF2. Один H1, 16 catalog articles в initial HTML, уникальные IDs и разрешённые hash anchors. Native details содержит descriptions/характеристики/телефон до JS; runtime noJS проверяет QA. Пустые исходные headings/img в hidden dialogs заполняются runtime и не считаются основной контентной страницей.

Responsive srcset: 320/640px для product thumbnails, дополнительно960px для editorial фото; сохранены исходные full-resolution src и файлы для dialogs/gallery. Размеры/пропорции/видимые тексты не менялись. Новые derivatives quality83 WebP, Lanczos; это уменьшение скачивания, не замена официальных оригиналов. Шрифты: Commissioner уже WOFF2; исходные font faces не менялись.. WOFF2 получен из точных существующих TTF без изменения cmap, hmtx metrics или fvar axes, включая real800 S2. Исходные declarations C1 main.css и C2 golostext.css используют прежние family/style/weight/display с WOFF2 src; дополнительная оптимизационная stylesheet удалена, symbols override остаётся после них.

## 4. Lighthouse: фактические результаты

Lighthouse13.5.0 / HeadlessChrome151, local `http://127.0.0.1:8797/arttime-c3-home-details/dist/`, mobile/desktop simulated throttling. Последовательные отдельные browser jobs. Инструмент `codex_studio/qa-tools/lighthouse.js`, CHROME_NO_SANDBOX=1; proxy restricts traffic to loopback. Raw JSON/HTML/summary сохранены в `work/arttime-github/seo/evidence/arttime-gh-c3-final-startup-summary.json` и соседних файлах. Исходный запуск с EPERM и отдельный C1 server502 не являются замерами сайта; ошибки не скрыты, последующие успешные runs имеют отдельные имена.

| Mode | Perf | A11y | Best | SEO | LCP s | CLS | TBT ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mobile | 87 | 100 | 100 | 66 | 3.76 | 0.00016 | 0 |
| desktop | 99 | 100 | 100 | 66 | 0.97 | 0.00121 | 0 |

До scoped оптимизации: НЕ ИЗМЕРЕНО до оптимизации; финальный запуск есть.

SEO score66 вызван намеренным noindex. TBT — лабораторный показатель, **не INP**. INP/field Core Web Vitals/FPS/physical Safari: **не измерено**. Разницу баллов нельзя приписать одному действию: root startup/aria и image/font changes вошли в финальные runs; повторяемость на реальном hosting/устройствах не доказана. 

## 5. Release checks и доказательства

Final HTML SHA256 `0ad54e5396b498178d9192cbdc1f0c08d634c8db0d91cc86e04a85069bb637d2`, body SHA256 `7671e6f1d87890c90780213ea6b7c5ab3a447227d02999f60759646b0301479e`. Public HTTP200, Pages deployment source/build status, public asset MIME/canonical/robots/schema и социальное preview после deploy: **НЕ ПРОВЕРЕНО в роли SEO**; подтверждает root по фактическому deployment. Локальное техническое SEO готово, ранжирование не обещано. Совместный отчёт/metric evidence: `work/arttime-github/seo/report.md`, `final-validation.json`.

STATUS: SEO_READY
