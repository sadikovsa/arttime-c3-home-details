# S3 — build notes

## 1. Файлы

`dist/index.html`, `dist/assets/css/tokens.css`, `dist/assets/css/main.css`, `dist/assets/js/main.js`, `DESIGN.md`. Ранее подготовленные локальные Commissioner WOFF2, responsive hero WebP и оригинальные фото переиспользованы. Запись ограничена S3. A/B, DecoFlowers, другие C-направления, global studio, Git и `.openai` не изменены.

## 2. Реализация и отличие S3

Начальная компоновка фактически просмотренного утверждённого mockup: горизонтальный ivory header, широкая комната, low-left title, три номерные кнопки, интегрированная оливковая полоса комнат. В отличие от предметных S1/S2, S3 начинает маршрут с пространства. Столовая — начальная сцена; гостиная и холл — самостоятельные истории на оригинальных фото. Полная карточка детали использует официальный оригинал, не hero expansion. Стеклянные вазы представлены отдельно как коллекционная подборка, без ложного соответствия03.

16 предметов в исходном HTML, original photos и native fallback details; фильтры, IME-safe поиск, empty/reset, product dialog и запрос предмета. 5 групп реального наполнения и2 отдельных примера бренда с full-image viewer. Три иллюстрированных сервиса,4 FAQ. Форма готовит editable local draft, копирует или сохраняет TXT с внесёнными правками. Присутствуют реальный phone/Instagram/address/map query; отправка на сервер не имитируется.

## 3. Motion states

Native rAF scene,70vh дополнительного scroll desktop /38vh mobile. 0%=full room scale1;50%=scale1.31/1.14 + отдельная подпись;100%=scale1.62/1.28, выход к предметной полосе. Reversal — чистая функция progress без timers. Pause сохраняет геометрию и позицию; reduced снимает sticky диапазон. NoJS сохраняет последовательный контент и native disclosures. Room preload generation guards: последний выбор владеет callback. Accordion/menu270ms height/opacity, повторный клик реверсирует от текущего размера и прозрачности. Полная карта состояний в DESIGN.md.

Это честное2D-кадрирование и zoom оригинального/постановочного фото;3D-проход сквозь комнату не заявлен. GSAP не установлен. Портретные комнатные фото в широком hero естественно кадрируются; modal/gallery позволяет видеть полный кадр. Обычный desktop hero сохраняет утверждённый общий вид столовой.

## 4. Доступность и скорость

Один h1, semantic sections/nav/address,skip link,visible focus,44px controls,tokenized global scrollbar,local variable font с swap. LCP hero eager/fetchpriority high с640/960/1672 srcset, остальные фото lazy и intrinsic dimensions. Каталог без динамической подгрузки. Native dialog с close/Escape/focus restore; rich detail bounded scroll. NoJS links на оригинальные фото и реальный phone доступны. Scroll geometry вычисляется после fonts/images/details/breakpoint, native position не изменяется. NoJS desktop menu изначально открыт. Аккордеоны анимируются только при JS; reduced мгновенный.

## 5. Проверено

- `node --check dist/assets/js/main.js`: PASS.
- Статический path/anchor scan:0 missing assets,0 missing anchors,0 duplicate IDs.
- Все16 product cards и7 gallery entries присутствуют в initial HTML.
- Утверждённый S3 mockup и hero/оригинальные room photos действительно просмотрены.

НЕ ПРОВЕРЕНО в frontend scope: browser runtime, desktop/mobile screenshots, реальный scroll вперёд/назад, rapid room/accordion reversal, noJS/reduced browser, keyboard/focus/menu, console/404, clipboard/TXT edit/export. Root выполняет QA и SEO; frontend не запускал servers/install/native Sites. FPS, INP и другие сервисные метрики не измерены.

## 6. Передача root / SEO

Сайт buildless: отдавать `dist/` через разрешённый локальный сервер root. Единственная HTML-страница: room-first decor catalog для Ташкента,16 описательных позиций,5 оформлений,2 inspirations,подбор/визит. Сейчас базовые title/description/robots(noindex,follow),canonical/OG/JSON-LD и registration URL остаются за root. Публикация не выполнялась, verified public URL отсутствует. Источники и hero provenance сохраняются в существующих research/.studio inputs. Публичных provenance badges нет по прямому брифу владельца. Нет контентных placeholders.

STATUS: BUILD_READY
