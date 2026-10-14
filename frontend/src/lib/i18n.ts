export const locales = ["ua", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ua";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export const localeHtmlLang: Record<Locale, string> = { ua: "uk", ru: "ru" };

export const intlLocale: Record<Locale, string> = { ua: "uk-UA", ru: "ru-UA" };

type Entry = { ua: string; ru: string };

export const dict = {
  "brand.name": { ua: "Salo", ru: "Salo" },
  "brand.tagline": { ua: "Продаж нерухомості без зайвих слів", ru: "Продажа недвижимости без лишних слов" },

  "nav.home": { ua: "Головна", ru: "Главная" },
  "nav.catalog": { ua: "Каталог", ru: "Каталог" },
  "nav.houses": { ua: "Будинки", ru: "Дома" },
  "nav.apartments": { ua: "Квартири", ru: "Квартиры" },
  "nav.favorites": { ua: "Обране", ru: "Избранное" },
  "nav.dashboard": { ua: "Кабінет", ru: "Кабинет" },
  "nav.login": { ua: "Увійти", ru: "Войти" },
  "nav.register": { ua: "Реєстрація", ru: "Регистрация" },
  "nav.logout": { ua: "Вийти", ru: "Выйти" },
  "nav.menu": { ua: "Меню", ru: "Меню" },

  "side.overview": { ua: "Огляд", ru: "Обзор" },
  "side.myListings": { ua: "Мої оголошення", ru: "Мои объявления" },
  "side.requests": { ua: "Заявки", ru: "Заявки" },
  "side.favorites": { ua: "Обране", ru: "Избранное" },
  "side.settings": { ua: "Налаштування", ru: "Настройки" },
  "side.publicSite": { ua: "На сайт", ru: "На сайт" },

  "action.search": { ua: "Знайти", ru: "Найти" },
  "action.filters": { ua: "Фільтри", ru: "Фильтры" },
  "action.reset": { ua: "Скинути", ru: "Сбросить" },
  "action.apply": { ua: "Застосувати", ru: "Применить" },
  "action.save": { ua: "Зберегти", ru: "Сохранить" },
  "action.saving": { ua: "Зберігаємо…", ru: "Сохраняем…" },
  "action.cancel": { ua: "Скасувати", ru: "Отмена" },
  "action.delete": { ua: "Видалити", ru: "Удалить" },
  "action.edit": { ua: "Редагувати", ru: "Редактировать" },
  "action.create": { ua: "Створити", ru: "Создать" },
  "action.add": { ua: "Додати", ru: "Добавить" },
  "action.details": { ua: "Деталі", ru: "Подробнее" },
  "action.viewAll": { ua: "Переглянути всі", ru: "Смотреть все" },
  "action.back": { ua: "Назад", ru: "Назад" },
  "action.call": { ua: "Зателефонувати", ru: "Позвонить" },
  "action.sendRequest": { ua: "Надіслати заявку", ru: "Отправить заявку" },
  "action.sending": { ua: "Надсилаємо…", ru: "Отправляем…" },
  "action.requestViewing": { ua: "Записатись на перегляд", ru: "Записаться на просмотр" },
  "action.bookTour": { ua: "Забронювати перегляд", ru: "Забронировать просмотр" },
  "action.addToFavorites": { ua: "Додати в обране", ru: "В избранное" },
  "action.inFavorites": { ua: "В обраному", ru: "В избранном" },
  "action.copy": { ua: "Копіювати", ru: "Копировать" },
  "action.loading": { ua: "Завантаження…", ru: "Загрузка…" },

  "field.city": { ua: "Місто", ru: "Город" },
  "field.anyCity": { ua: "Будь-яке місто", ru: "Любой город" },
  "field.district": { ua: "Район", ru: "Район" },
  "field.price": { ua: "Ціна", ru: "Цена" },
  "field.priceFrom": { ua: "Ціна від", ru: "Цена от" },
  "field.priceTo": { ua: "Ціна до", ru: "Цена до" },
  "field.rooms": { ua: "Кімнати", ru: "Комнаты" },
  "field.anyRooms": { ua: "Будь-яка кількість", ru: "Любое количество" },
  "field.propertyType": { ua: "Тип нерухомості", ru: "Тип недвижимости" },
  "field.anyType": { ua: "Усі типи", ru: "Все типы" },
  "field.status": { ua: "Статус", ru: "Статус" },
  "field.dealType": { ua: "Тип угоди", ru: "Тип сделки" },
  "field.sort": { ua: "Сортування", ru: "Сортировка" },
  "field.area": { ua: "Площа", ru: "Площадь" },
  "field.landArea": { ua: "Площа ділянки", ru: "Площадь участка" },
  "field.bedrooms": { ua: "Спальні", ru: "Спальни" },
  "field.bathrooms": { ua: "Санвузли", ru: "Санузлы" },
  "field.floor": { ua: "Поверх", ru: "Этаж" },
  "field.totalFloors": { ua: "Поверхів у будинку", ru: "Этажей в доме" },
  "field.yearBuilt": { ua: "Рік побудови", ru: "Год постройки" },
  "field.address": { ua: "Адреса", ru: "Адрес" },
  "field.features": { ua: "Зручності", ru: "Удобства" },
  "field.images": { ua: "Фото (посилання через кому)", ru: "Фото (ссылки через запятую)" },
  "field.title": { ua: "Заголовок (UA)", ru: "Заголовок (UA)" },
  "field.titleRu": { ua: "Заголовок (RU)", ru: "Заголовок (RU)" },
  "field.description": { ua: "Опис (UA)", ru: "Описание (UA)" },
  "field.descriptionRu": { ua: "Опис (RU)", ru: "Описание (RU)" },
  "field.contactName": { ua: "Контактна особа", ru: "Контактное лицо" },
  "field.contactPhone": { ua: "Телефон", ru: "Телефон" },
  "field.name": { ua: "Ім'я", ru: "Имя" },
  "field.email": { ua: "Email", ru: "Email" },
  "field.password": { ua: "Пароль", ru: "Пароль" },
  "field.phone": { ua: "Телефон", ru: "Телефон" },
  "field.role": { ua: "Роль", ru: "Роль" },
  "field.language": { ua: "Мова", ru: "Язык" },
  "field.budget": { ua: "Бюджет", ru: "Бюджет" },
  "field.message": { ua: "Повідомлення", ru: "Сообщение" },
  "field.viewingDate": { ua: "Дата перегляду", ru: "Дата просмотра" },
  "field.agentNote": { ua: "Нотатка менеджера", ru: "Заметка менеджера" },
  "field.preferredCity": { ua: "Бажане місто", ru: "Желаемый город" },
  "field.featured": { ua: "У топі на головній", ru: "В топе на главной" },
  "field.optional": { ua: "необов'язково", ru: "необязательно" },

  "sort.newest": { ua: "Найновіші", ru: "Новые" },
  "sort.priceAsc": { ua: "Дешевші спочатку", ru: "Сначала дешевле" },
  "sort.priceDesc": { ua: "Дорожчі спочатку", ru: "Сначала дороже" },
  "sort.areaDesc": { ua: "За площею", ru: "По площади" },

  "type.apartment": { ua: "Квартира", ru: "Квартира" },
  "type.house": { ua: "Будинок", ru: "Дом" },
  "type.cottage": { ua: "Котедж", ru: "Коттедж" },
  "type.land": { ua: "Ділянка", ru: "Участок" },
  "type.commercial": { ua: "Комерція", ru: "Коммерция" },

  "status.active": { ua: "У продажу", ru: "В продаже" },
  "status.reserved": { ua: "Заброньовано", ru: "Забронировано" },
  "status.sold": { ua: "Продано", ru: "Продано" },
  "status.draft": { ua: "Чернетка", ru: "Черновик" },

  "deal.sale": { ua: "Продаж", ru: "Продажа" },
  "deal.rent": { ua: "Оренда", ru: "Аренда" },

  "reqStatus.new": { ua: "Нова", ru: "Новая" },
  "reqStatus.contacted": { ua: "Зв’язались", ru: "Связались" },
  "reqStatus.viewing": { ua: "Перегляд", ru: "Просмотр" },
  "reqStatus.offer": { ua: "Пропозиція", ru: "Предложение" },
  "reqStatus.closed": { ua: "Закрита", ru: "Закрыта" },

  "role.buyer": { ua: "Покупець", ru: "Покупатель" },
  "role.agent": { ua: "Агент / власник", ru: "Агент / собственник" },

  "hero.badge": { ua: "1 240+ перевірених об’єктів", ru: "1 240+ проверенных объектов" },
  "hero.title": { ua: "Сама одеська дошка оголошень", ru: "Cамая одесская доска объявлений" },
  "hero.subtitle": {
    ua: "Обирайте серед будинків, котеджів та квартир у найкращих районах Одеси. Чесні фото, реальні ціни, супровід угоди до ключів.",
    ru: "Выбирайте среди домов, коттеджей и квартир в лучших районах Одессы. Честные фото, реальные цены, сопровождение сделки до ключей.",
  },
  "hero.cta": { ua: "Дивитись каталог", ru: "Смотреть каталог" },
  "hero.cta2": { ua: "Продати об’єкт", ru: "Продать объект" },
  "hero.stat1": { ua: "об’єктів у продажу", ru: "объектов в продаже" },
  "hero.stat2": { ua: "середній час продажу", ru: "средний срок продажи" },
  "hero.stat3": { ua: "клієнтів повертаються", ru: "клиентов возвращаются" },

  "home.featured": { ua: "Вибір редакції", ru: "Выбор редакции" },
  "home.featuredSub": { ua: "Об’єкти, які найчастіше обирають покупці цього тижня", ru: "Объекты, которые чаще всего выбирают покупатели на этой неделе" },
  "home.new": { ua: "Нові надходження", ru: "Новые поступления" },
  "home.newSub": { ua: "Щойно додані в каталог", ru: "Только что добавлены в каталог" },
  "home.howTitle": { ua: "Як це працює", ru: "Как это работает" },
  "home.how1t": { ua: "Знайдіть свій район", ru: "Найдите свой район" },
  "home.how1d": { ua: "Фільтри за містом, ціною, площею та кількістю кімнат.", ru: "Фильтры по городу, цене, площади и количеству комнат." },
  "home.how2t": { ua: "Запишіться на перегляд", ru: "Запишитесь на просмотр" },
  "home.how2d": { ua: "Заявка за 30 секунд — менеджер підтвердить час.", ru: "Заявка за 30 секунд — менеджер подтвердит время." },
  "home.how3t": { ua: "Отримайте ключі", ru: "Получите ключи" },
  "home.how3d": { ua: "Перевірка документів, торг і супровід угоди під ключ.", ru: "Проверка документов, торг и сопровождение сделки под ключ." },
  "home.trust": { ua: "Чому нам довіряють", ru: "Почему нам доверяют" },
  "home.trust1t": { ua: "Перевірені документи", ru: "Проверенные документы" },
  "home.trust1d": { ua: "Кожен об’єкт проходить юридичну перевірку перед публікацією.", ru: "Каждый объект проходит юридическую проверку перед публикацией." },
  "home.trust2t": { ua: "Чесні ціни", ru: "Честные цены" },
  "home.trust2d": { ua: "Жодних прихованих комісій — ціна в оголошенні фінальна.", ru: "Никаких скрытых комиссий — цена в объявлении финальная." },
  "home.trust3t": { ua: "Підтримка рідною мовою", ru: "Поддержка на родном языке" },
  "home.trust3d": { ua: "Інтерфейс і дзвінки українською або російською — як вам зручно.", ru: "Интерфейс и звонки на украинском или русском — как вам удобно." },
  "home.ctaTitle": { ua: "Готові до покупки?", ru: "Готовы к покупке?" },
  "home.ctaText": {
    ua: "Створіть кабінет, зберігайте обрані будинки й отримуйте нові пропозиції першими.",
    ru: "Создайте кабинет, сохраняйте избранные дома и получайте новые предложения первыми.",
  },

  "catalog.title": { ua: "Каталог нерухомості", ru: "Каталог недвижимости" },
  "catalog.found": { ua: "знайдено об’єктів", ru: "найдено объектов" },
  "catalog.emptyTitle": { ua: "Нічого не знайшли", ru: "Ничего не нашли" },
  "catalog.emptyText": {
    ua: "Спробуйте змінити фільтри або скинути їх, щоб побачити всі об’єкти.",
    ru: "Попробуйте изменить фильтры или сбросить их, чтобы увидеть все объекты.",
  },

  "listing.details": { ua: "Про об’єкт", ru: "Об объекте" },
  "listing.perMonth": { ua: "/міс", ru: "/мес" },
  "listing.views": { ua: "переглядів", ru: "просмотров" },
  "listing.published": { ua: "Опубліковано", ru: "Опубликовано" },
  "listing.agent": { ua: "Відповідальний менеджер", ru: "Ответственный менеджер" },
  "listing.notFound": { ua: "Оголошення не знайдено", ru: "Объявление не найдено" },
  "listing.similar": { ua: "Схожі об’єкти", ru: "Похожие объекты" },
  "listing.squareMeter": { ua: "за м²", ru: "за м²" },

  "auth.loginTitle": { ua: "Вхід у кабінет", ru: "Вход в кабинет" },
  "auth.loginSub": { ua: "Керуйте оголошеннями, заявками та обраними об’єктами.", ru: "Управляйте объявлениями, заявками и избранными объектами." },
  "auth.registerTitle": { ua: "Створити кабінет", ru: "Создать кабинет" },
  "auth.registerSub": { ua: "Безкоштовно. Займе менш ніж хвилину.", ru: "Бесплатно. Займёт менее минуты." },
  "auth.noAccount": { ua: "Немає акаунта?", ru: "Нет аккаунта?" },
  "auth.hasAccount": { ua: "Вже є акаунт?", ru: "Уже есть аккаунт?" },
  "auth.demoTitle": { ua: "Демо-доступ", ru: "Демо-доступ" },
  "auth.demoHint": { ua: "Натисніть, щоб заповнити форму", ru: "Нажмите, чтобы заполнить форму" },
  "auth.errorCreds": { ua: "Невірний email або пароль", ru: "Неверный email или пароль" },
  "auth.errorTaken": { ua: "Такий email вже зареєстровано", ru: "Такой email уже зарегистрирован" },
  "auth.errorRequired": { ua: "Заповніть обов’язкові поля", ru: "Заполните обязательные поля" },
  "auth.errorGeneric": { ua: "Щось пішло не так. Спробуйте ще раз.", ru: "Что-то пошло не так. Попробуйте снова." },

  "dash.title": { ua: "Кабінет", ru: "Кабинет" },
  "dash.welcome": { ua: "Вітаємо", ru: "Приветствуем" },
  "dash.statListings": { ua: "Оголошень", ru: "Объявлений" },
  "dash.statActive": { ua: "У продажу", ru: "В продаже" },
  "dash.statViews": { ua: "Переглядів", ru: "Просмотров" },
  "dash.statRequests": { ua: "Нові заявки", ru: "Новые заявки" },
  "dash.statFavorites": { ua: "В обраному", ru: "В избранном" },
  "dash.statSold": { ua: "Продано", ru: "Продано" },
  "dash.statAvg": { ua: "Середня ціна", ru: "Средняя цена" },
  "dash.recentListings": { ua: "Останні оголошення", ru: "Последние объявления" },
  "dash.recentRequests": { ua: "Останні заявки", ru: "Последние заявки" },
  "dash.pipeline": { ua: "Воронка заявок", ru: "Воронка заявок" },
  "dash.activity": { ua: "Активність", ru: "Активность" },
  "dash.quick": { ua: "Швидкі дії", ru: "Быстрые действия" },
  "dash.quickNew": { ua: "Додати об’єкт", ru: "Добавить объект" },
  "dash.quickCatalog": { ua: "Мої оголошення", ru: "Мои объявления" },
  "dash.quickRequests": { ua: "Робота із заявками", ru: "Работа с заявками" },

  "listings.title": { ua: "Мої оголошення", ru: "Мои объявления" },
  "listings.sub": { ua: "Створюйте, редагуйте та знімайте з публікації об’єкти.", ru: "Создавайте, редактируйте и снимайте с публикации объекты." },
  "listings.new": { ua: "Нове оголошення", ru: "Новое объявление" },
  "listings.edit": { ua: "Редагувати оголошення", ru: "Редактировать объявление" },
  "listings.emptyTitle": { ua: "Поки що немає оголошень", ru: "Пока нет объявлений" },
  "listings.emptyText": {
    ua: "Додайте перший об’єкт — він одразу з’явиться в каталозі для покупців.",
    ru: "Добавьте первый объект — он сразу появится в каталоге для покупателей.",
  },
  "listings.deleted": { ua: "Оголошення видалено", ru: "Объявление удалено" },
  "listings.deleteConfirm": { ua: "Видалити це оголошення?", ru: "Удалить это объявление?" },
  "listings.views": { ua: "перегляди", ru: "просмотры" },

  "requests.title": { ua: "Заявки покупців", ru: "Заявки покупателей" },
  "requests.sub": { ua: "Ведіть переговори та фіксуйте статус кожної заявки.", ru: "Ведите переговоры и фиксируйте статус каждой заявки." },
  "requests.new": { ua: "Нова заявка", ru: "Новая заявка" },
  "requests.emptyTitle": { ua: "Заявок ще немає", ru: "Заявок пока нет" },
  "requests.emptyText": {
    ua: "Як тільки покупець зацікавиться об’єктом, заявка з’явиться тут.",
    ru: "Как только покупатель заинтересуется объектом, заявка появится здесь.",
  },
  "requests.deleteConfirm": { ua: "Видалити заявку?", ru: "Удалить заявку?" },
  "requests.fromListing": { ua: "За об’єктом", ru: "По объекту" },
  "requests.general": { ua: "Загальна консультація", ru: "Общая консультация" },

  "favorites.title": { ua: "Обрані об’єкти", ru: "Избранные объекты" },
  "favorites.sub": { ua: "Порівнюйте варіанти та повертайтесь до них у будь-який момент.", ru: "Сравнивайте варианты и возвращайтесь к ним в любой момент." },
  "favorites.emptyTitle": { ua: "Обране порожнє", ru: "Избранное пусто" },
  "favorites.emptyText": {
    ua: "Натискайте на серденько в каталозі, щоб зберегти будинок тут.",
    ru: "Нажимайте на сердечко в каталоге, чтобы сохранить дом здесь.",
  },
  "favorites.removed": { ua: "Видалено з обраного", ru: "Удалено из избранного" },

  "settings.title": { ua: "Налаштування профілю", ru: "Настройки профиля" },
  "settings.sub": { ua: "Оновіть контактні дані та мову інтерфейсу.", ru: "Обновите контактные данные и язык интерфейса." },
  "settings.saved": { ua: "Профіль оновлено", ru: "Профиль обновлён" },

  "form.basic": { ua: "Основне", ru: "Основное" },
  "form.location": { ua: "Локація", ru: "Локация" },
  "form.params": { ua: "Параметри", ru: "Параметры" },
  "form.contacts": { ua: "Контакти", ru: "Контакты" },
  "form.sameForRu": { ua: "Заповнити RU як UA", ru: "Заполнить RU как UA" },

  "inquiry.title": { ua: "Залишити заявку", ru: "Оставить заявку" },
  "inquiry.sub": { ua: "Менеджер зателефонує протягом 15 хвилин.", ru: "Менеджер позвонит в течение 15 минут." },
  "inquiry.success": { ua: "Дякуємо! Заявку надіслано.", ru: "Спасибо! Заявка отправлена." },
  "inquiry.savedTo": { ua: "Заявку збережено в кабінеті", ru: "Заявка сохранена в кабинете" },

  "misc.m2": { ua: "м²", ru: "м²" },
  "misc.sotka": { ua: "сот.", ru: "сот." },
  "misc.results": { ua: "результатів", ru: "результатов" },
  "misc.notSpecified": { ua: "не вказано", ru: "не указано" },
  "misc.yes": { ua: "Так", ru: "Да" },
  "misc.no": { ua: "Ні", ru: "Нет" },
  "misc.close": { ua: "Закрити", ru: "Закрыть" },
  "misc.error": { ua: "Помилка", ru: "Ошибка" },
  "misc.about": { ua: "Про нас", ru: "О нас" },
  "footer.rights": { ua: "Усі права захищено", ru: "Все права защищены" },
  "footer.help": { ua: "Потрібна допомога з вибором?", ru: "Нужна помощь с выбором?" },
  "footer.helpText": {
    ua: "Наші брокери підберуть 5 варіантів під ваш бюджет безкоштовно.",
    ru: "Наши брокеры подберут 5 вариантов под ваш бюджет бесплатно.",
  },
} as Record<string, Entry>;

export type DictKey = keyof typeof dict;

export function t(locale: Locale, key: DictKey): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale] || entry.ua;
}

export function createTranslator(locale: Locale) {
  return (key: DictKey) => t(locale, key);
}

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactPrice(amount: number, locale: Locale): string {
  const suffix = locale === "ua" ? " грн" : " грн";
  if (amount >= 1_000_000) {
    const value = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `${value} млн${suffix}`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1000)} тис${suffix}`;
  }
  return `${amount}${suffix}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: Date | string | null, locale: Locale): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: Date | string | null, locale: Locale): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function pluralArea(area: number, locale: Locale): string {
  return `${formatNumber(Math.round(area), locale)} ${t(locale, "misc.m2")}`;
}
