# S3 — Дом в деталях — GitHub release QA

Оглавление: 1. Вердикт/версия; 2. Проверки; 3. Ограничения.

## 1. Вердикт и версия

**PASS WITH NOTES. BLOCKER0, MAJOR0, открытых MINOR0.** Дата2026-10-12. Готовность локального пакета к уже разрешённой публикации; live URL пока planned. QA не менял source и не выполнял commit/deploy.

Approved checkpoint: 174b09b. Проверенный dist working-tree digest: `7e0049a873a1850c43bc5b6cdca9aa56206cc05c0b6d524e4737ddaf6abddf44`.
Алгоритм и общая evidence-карта — `../../qa/release-qa.md`; root привяжет следующий release SHA к этому digest в manifest.

## 2. Проверки scoped контракта

| Проверка | Результат / доказательство |
|---|---|
| Adaptive/network/runtime | PASS: root browser-report.json, fresh320/360/390/768/1280/1440/1920 + noJS390/reduced390; JS/HTTP errors0, hero/footer overflow0. |
| Catalog/search/native motion | PASS: root flow-report.json — catalog16, art2, empty/clear recovery; настоящие wheel forward/reverse states, pause оставляет native scroll. |
| Request/export/channel | PASS: invalid state, product→request, editable TXT equals edited draft; Instagram handoff и storage0. Submit preventsDefault source-reviewed; отдельный POST-network audit не проведён. |
| Share/entry/recovery | PASS: root sharing-report.json — correct ?product=id#catalog entry, invalid ID safe, Escape/focus/URL cleanup. Собственный390: denied clipboard даёт полное selected input, очищает stale q/category, next product resets fallback/status. |
| PracticalFAQ | PASS: собственный rapid3 clicks35ms, native noJS, reduced instant. |
| A11y/fonts | Root axe violations0 desktop; собственные font loads и отдельные focus checks. Не исчерпывающая accessibility certification. |
| SEO | Static/local validation PASS, planned Pages prefix и noindex,follow; внешний deployed URL будет проверять root. |

Собственный mobile390: ui-ready установлен; menu закрыт исходно, Escape и nav закрывают общим270ms механизмом (160→70.44px промежуточно→closed), Escape восстанавливает focus summary. NoJS: request-form hidden, телефон/Instagram и menu/nav visible. CurrentSrc390/1440: два продукта/gallery0→1 и living→hall→dining hero/story/detail соответствуют оригиналу. Dining hero сохраняет room srcset, living/hall снимают его. Final hall/detail screenshots реально открыты. MINOR reduced icon rotation закрыт: open/close/open animations0, transition0s. Loaded Commissioner400–600.

Наблюдение глазами — реально открытые `../../qa/arttime-c3-home-details/` кадры: mobile-hero.png, nojs-footer.png, request-edited.png, final sharing-mobile.png, final-hall.png, final-hall-detail.png. Прочие screenshots не объявляются визуально проверенными этим QA.

Lab Lighthouse: Mobile87/LCP3.76s, Desktop99/0.97s; CLS≈0.00016 mobile. Значения лабораторные, не field CWV. A11y100/BP100/SEO66; SEO66 связан с intentional noindex. TBT0 не является INP. Последний Lighthouse normal-mode выполнен SEO отдельно до scoped reduced/dynamic image fixes; normal hero/font geometry сохранены.

История исправленных MINOR/MAJOR и superseded evidence находится в combined report. На финальной версии не осталось подтверждённых blocker/major/minor defects. Source changes после этих scoped checks требуют новой проверки соответствующего состояния.

## 3. НЕ ПРОВЕРЕНО и почему

Safari, Firefox, реальные телефоны и screen readers, field INP/CWV/FPS, настоящее browser zoom, полный tab-order/a11y-tree и gradient pixel contrast — НЕ ПРОВЕРЕНО доступными инструментами/отдельным исчерпывающим аудитом. Live Pages prefix/assets/canonical/deeplink ещё не проверены: публикация принадлежит root. Отправка сообщений Instagram/звонки не выполнялись; форма готовит local editable текст.

STATUS: QA_PASS_WITH_NOTES
