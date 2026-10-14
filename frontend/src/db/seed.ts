import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { favorites, listings, requests, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

function pexels(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400`;
}

const E = [8482510, 8469931, 8482520, 8469934, 8469940];
const C = [7061662, 7061659, 6032280, 5997993, 7746916, 36495521, 7174114];
const L = [8089172, 7173666, 7167073, 7587783, 7533848, 7546553, 6636314, 8141964, 18470969];
const K = [8134987, 6933857, 7061429, 6284230, 7005449, 7166942, 7534280];

type SeedListing = {
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  propertyType: string;
  status: string;
  dealType: string;
  price: number;
  city: string;
  district: string;
  address: string;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  landArea: number;
  yearBuilt: number;
  features: string[];
  images: string[];
  featured: number;
  views: number;
  agent: number; // index in agents array
};

const AGENTS = [
  {
    name: "Олена Коваленко",
    email: "agent@domivka.ua",
    phone: "+380 67 214 88 90",
    city: "Київ",
    bio: "Брокер із 9 років досвіду. Спеціалізація: Печерський та Оболонський райони Києва.",
    role: "agent",
    locale: "ua",
  },
  {
    name: "Андрій Мельник",
    email: "buyer@domivka.ua",
    phone: "+380 50 118 42 07",
    city: "Львів",
    bio: "Шукаю будинок для родини біля Львова, бюджет до 15 млн грн.",
    role: "buyer",
    locale: "ua",
  },
  {
    name: "Марина Гриценко",
    email: "marina@domivka.ua",
    phone: "+380 63 902 55 41",
    city: "Одеса",
    bio: "Приморська нерухомість: Одеса, Затока, Карпати.",
    role: "agent",
    locale: "ru",
  },
];

const LISTINGS: SeedListing[] = [
  {
    title: "Трикімнатна квартира з терасою в Печерському районі",
    titleRu: "Трёхкомнатная квартира с террасой в Печерском районе",
    description:
      "Світла квартира в клубному будинку бізнес-класу. Панорамні вікна, тераса 12 м², два санвузли, кухня-вітальня 34 м². Паркомісце в підземному паркінгу входить у вартість. Поруч Маріїнський парк і метро «Печерська».",
    descriptionRu:
      "Светлая квартира в клубном доме бизнес-класса. Панорамные окна, терраса 12 м², два санузла, кухня-гостиная 34 м². Парковочное место в подземном паркинге входит в стоимость. Рядом Мариинский парк и метро «Печерская».",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 8_900_000,
    city: "Київ",
    district: "Печерський",
    address: "вул. Івана Мазепи, 12",
    area: 96,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    floor: 7,
    totalFloors: 12,
    landArea: 0,
    yearBuilt: 2021,
    features: ["balcony", "parking", "elevator", "newBuilding", "security", "metro", "renovated"],
    images: [pexels(L[0]), pexels(K[0]), pexels(L[3]), pexels(K[3])],
    featured: 1,
    views: 412,
    agent: 0,
  },
  {
    title: "Затишна двокімнатна з видом на озеро, Оболонь",
    titleRu: "Уютная двухкомнатная с видом на озеро, Оболонь",
    description:
      "Квартира після якісного ремонту, панорамний вид на Оболонську набережну. Вбудована кухня та техніка залишаються. Розвинена інфраструктура: школа, садочок, супермаркет у будинку.",
    descriptionRu:
      "Квартира после качественного ремонта, панорамный вид на Оболонскую набережную. Встроенная кухня и техника остаются. Развитая инфраструктура: школа, садик, супермаркет в доме.",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 4_300_000,
    city: "Київ",
    district: "Оболонський",
    address: "Оболонський пр., 21",
    area: 58,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    floor: 5,
    totalFloors: 9,
    landArea: 0,
    yearBuilt: 2014,
    features: ["balcony", "elevator", "furniture", "school", "metro", "renovated"],
    images: [pexels(L[4]), pexels(K[1]), pexels(L[8])],
    featured: 1,
    views: 289,
    agent: 0,
  },
  {
    title: "Чотирикімнатна у історичній кам’яниці на Подолі",
    titleRu: "Четырёхкомнатная в исторической камянице на Подоле",
    description:
      "Рідкісна пропозиція: простора квартира з високими стелями (3,4 м) у відреставрованій кам’яниці. Другий світло, окремий вхід, розумний дім. Ідеально для родини, що цінує атмосферу старого Києва.",
    descriptionRu:
      "Редкое предложение: просторная квартира с высокими потолками (3,4 м) в отреставрированной камянице. Второй свет, отдельный вход, умный дом. Идеально для семьи, ценящей атмосферу старого Киева.",
    propertyType: "apartment",
    status: "reserved",
    dealType: "sale",
    price: 12_500_000,
    city: "Київ",
    district: "Подільський",
    address: "вул. Андріївський узвіз, 4",
    area: 124,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    floor: 2,
    totalFloors: 4,
    landArea: 0,
    yearBuilt: 1912,
    features: ["furniture", "security", "renovated", "metro"],
    images: [pexels(L[2]), pexels(L[5]), pexels(K[5])],
    featured: 0,
    views: 356,
    agent: 0,
  },
  {
    title: "Родинний будинок у Конча-Заспі з садом",
    titleRu: "Семейный дом в Конча-Заспе с садом",
    description:
      "Двоповерховий будинок 260 м² на ділянці 12 соток. П’ять спалень, камінна вітальня, опалення тепловим насосом, свердловина. Мангал, плодовий сад, гараж на два авто. До центру 20 хвилин.",
    descriptionRu:
      "Двухэтажный дом 260 м² на участке 12 соток. Пять спален, каминная гостиная, отопление тепловым насосом, скважина. Мангал, плодовый сад, гараж на два авто. До центра 20 минут.",
    propertyType: "house",
    status: "active",
    dealType: "sale",
    price: 32_000_000,
    city: "Конча-Заспа",
    district: "Києво-Святошинський",
    address: "Садова вул., 8",
    area: 260,
    rooms: 7,
    bedrooms: 5,
    bathrooms: 3,
    floor: 2,
    totalFloors: 2,
    landArea: 12,
    yearBuilt: 2018,
    features: ["garden", "garage", "fireplace", "well", "security", "furniture"],
    images: [pexels(E[1]), pexels(C[0]), pexels(L[1]), pexels(K[2])],
    featured: 1,
    views: 578,
    agent: 0,
  },
  {
    title: "Квартира в центрі Львова з видом на Оперний",
    titleRu: "Квартира в центре Львова с видом на Оперный",
    description:
      "Апартаменти 84 м² за два квартали від проспекту Свободи. Історична будівля, капітально відновлені комунікації, нові вікна з подвійним склінням. Підійде і для проживання, і під оренду.",
    descriptionRu:
      "Апартаменты 84 м² в двух кварталах от проспекта Свободы. Историческое здание, капитально восстановленные коммуникации, новые окна с двойным остеклением. Подойдёт и для проживания, и под аренду.",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 6_200_000,
    city: "Львів",
    district: "Галицький",
    address: "вул. Січових Стрільців, 9",
    area: 84,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 3,
    totalFloors: 5,
    landArea: 0,
    yearBuilt: 1908,
    features: ["balcony", "furniture", "renovated"],
    images: [pexels(L[6]), pexels(K[4]), pexels(L[7])],
    featured: 0,
    views: 231,
    agent: 1,
  },
  {
    title: "Цегляний котедж у Франківському районі",
    titleRu: "Кирпичный коттедж во Франковском районе",
    description:
      "Котедж 180 м² з гаражем та ділянкою 6 соток. Автономне опалення, підігрів підлоги у санвузлах, зимовий сад. Тихий двір, сусіди — сім’ї з дітьми.",
    descriptionRu:
      "Коттедж 180 м² с гаражом и участком 6 соток. Автономное отопление, тёплый пол в санузлах, зимний сад. Тихий двор, соседи — семьи с детьми.",
    propertyType: "cottage",
    status: "active",
    dealType: "sale",
    price: 14_800_000,
    city: "Львів",
    district: "Франківський",
    address: "вул. Кульпарківська, 148",
    area: 180,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    floor: 2,
    totalFloors: 2,
    landArea: 6,
    yearBuilt: 2016,
    features: ["garden", "garage", "gas", "furniture", "renovated"],
    images: [pexels(C[1]), pexels(E[3]), pexels(K[6])],
    featured: 0,
    views: 174,
    agent: 1,
  },
  {
    title: "Квартира з видом на море, Приморський район",
    titleRu: "Квартира с видом на море, Приморский район",
    description:
      "Простора трикімнатна квартира за 300 метрів від пляжу «Ланжерон». Вікна на море, тераса з роклером, два паркомісця. Будинок з консьєржем та дитячим майданчиком.",
    descriptionRu:
      "Просторная трёхкомнатная квартира в 300 метрах от пляжа «Ланжерон». Окна на море, терраса с роклером, два парковочных места. Дом с консьержем и детской площадкой.",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 9_100_000,
    city: "Одеса",
    district: "Приморський",
    address: "вул. Французький бульвар, 25",
    area: 110,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    floor: 9,
    totalFloors: 16,
    landArea: 0,
    yearBuilt: 2019,
    features: ["seaView", "balcony", "parking", "elevator", "security", "newBuilding"],
    images: [pexels(L[5]), pexels(K[7]), pexels(L[3])],
    featured: 1,
    views: 498,
    agent: 2,
  },
  {
    title: "Котедж біля Затої з басейном",
    titleRu: "Коттедж у Затоки с бассейном",
    description:
      "Двоповерховий котедж 150 м² на березі лиману. Басейн 6×3, літня кухня, альтанка, автономна електрика (сонячні панелі + генератор). Ідеально для родини на літо та для оренди.",
    descriptionRu:
      "Двухэтажный коттедж 150 м² на берегу лимана. Бассейн 6×3, летняя кухня, беседка, автономная электрика (солнечные панели + генератор). Идеально для семьи на лето и для аренды.",
    propertyType: "cottage",
    status: "active",
    dealType: "sale",
    price: 11_000_000,
    city: "Одеса",
    district: "Затока",
    address: "курортна зона, буд. 44",
    area: 150,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    floor: 2,
    totalFloors: 2,
    landArea: 5,
    yearBuilt: 2020,
    features: ["pool", "garden", "seaView", "furniture", "security"],
    images: [pexels(C[3]), pexels(C[5]), pexels(L[8])],
    featured: 0,
    views: 205,
    agent: 2,
  },
  {
    title: "Двокімнатна в центрі Івано-Франківська",
    titleRu: "Двухкомнатная в центре Ивано-Франковска",
    description:
      "Світла квартира в тихому дворі центру міста. Мебльована кухня, нові комунікації, підвал 6 м². До ратуші 7 хвилин пішки.",
    descriptionRu:
      "Светлая квартира в тихом дворе центра города. Меблированная кухня, новые коммуникации, подвал 6 м². До ратуши 7 минут пешком.",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 2_950_000,
    city: "Івано-Франківськ",
    district: "Центр",
    address: "вул. Грушевського, 17",
    area: 56,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    totalFloors: 4,
    landArea: 0,
    yearBuilt: 1987,
    features: ["furniture", "renovated"],
    images: [pexels(L[8]), pexels(K[2])],
    featured: 0,
    views: 128,
    agent: 1,
  },
  {
    title: "Шале в Буковелі з панорамними вікнами",
    titleRu: "Шале в Буковеле с панорамными окнами",
    description:
      "Дерев’яне шале 220 м² за 900 метрів від підйомника №2. Три спальні з власними санвузлами, сауна, камін, тепла підлога. Готовий бізнес під короткострокову оренду: 68% завантаженості взимку.",
    descriptionRu:
      "Деревянное шале 220 м² в 900 метрах от подъёмника №2. Три спальни с собственными санузлами, сауна, камин, тёплый пол. Готовый бизнес под краткосрочную аренду: 68% загрузки зимой.",
    propertyType: "cottage",
    status: "active",
    dealType: "sale",
    price: 24_500_000,
    city: "Буковель",
    district: "Поляниця",
    address: "садівництво «Ясень», буд. 12",
    area: 220,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 4,
    floor: 2,
    totalFloors: 2,
    landArea: 8,
    yearBuilt: 2022,
    features: ["fireplace", "pool", "parking", "furniture", "newBuilding", "well"],
    images: [pexels(C[2]), pexels(L[1]), pexels(K[5]), pexels(C[6])],
    featured: 1,
    views: 641,
    agent: 2,
  },
  {
    title: "Будинок із подвір’ям у Вінниці",
    titleRu: "Дом с подворьем в Виннице",
    description:
      "Одноповерховий будинок 160 м² з повним ремонтом 2023 року. Дворівневе опалення, рекуператор, кухонний острів. Ділянка 9 соток з автоматичним поливом.",
    descriptionRu:
      "Одноэтажный дом 160 м² с полным ремонтом 2023 года. Двухуровневое отопление, рекуператор, кухонный остров. Участок 9 соток с автоматическим поливом.",
    propertyType: "house",
    status: "sold",
    dealType: "sale",
    price: 7_400_000,
    city: "Вінниця",
    district: "Центральний",
    address: "вул. Київська, 96",
    area: 160,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    floor: 1,
    totalFloors: 1,
    landArea: 9,
    yearBuilt: 2012,
    features: ["garden", "garage", "gas", "renovated", "school"],
    images: [pexels(E[2]), pexels(C[4]), pexels(K[3])],
    featured: 0,
    views: 302,
    agent: 1,
  },
  {
    title: "Трикімнатна в новобудові, Дніпро",
    titleRu: "Трёхкомнатная в новостройке, Днепр",
    description:
      "Квартира 88 м² у ЖК з закритим двором без машин. Чистова обробка, двоскатний дах-тераса на останньому поверсі. Паркомісце за додаткову плату.",
    descriptionRu:
      "Квартира 88 м² в ЖК с закрытым двором без машин. Чистовая отделка, двускатная крыша-терраса на последнем этаже. Парковочное место за дополнительную плату.",
    propertyType: "apartment",
    status: "active",
    dealType: "sale",
    price: 4_950_000,
    city: "Дніпро",
    district: "Шевченківський",
    address: "вул. Січеславська Набережна, 29",
    area: 88,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 11,
    totalFloors: 16,
    landArea: 0,
    yearBuilt: 2023,
    features: ["newBuilding", "elevator", "balcony", "security", "parking"],
    images: [pexels(L[0]), pexels(K[1])],
    featured: 0,
    views: 156,
    agent: 0,
  },
  {
    title: "Котедж з виноградником в Ужгороді",
    titleRu: "Коттедж с виноградником в Ужгороде",
    description:
      "Котедж 130 м² на схилі з видом на замок. Ділянка 7 соток, виноград та горіхи, каптаж. Тихе місце, 10 хвилин до центру.",
    descriptionRu:
      "Коттедж 130 м² на склоне с видом на замок. Участок 7 соток, виноград и орехи, каптаж. Тихое место, 10 минут до центра.",
    propertyType: "cottage",
    status: "active",
    dealType: "sale",
    price: 6_700_000,
    city: "Ужгород",
    district: "Радван",
    address: "вул. Виноградна, 3",
    area: 130,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 1,
    floor: 2,
    totalFloors: 2,
    landArea: 7,
    yearBuilt: 2009,
    features: ["garden", "garage", "gas", "well"],
    images: [pexels(C[6]), pexels(C[1]), pexels(K[4])],
    featured: 0,
    views: 143,
    agent: 2,
  },
  {
    title: "Ділянка 10 соток під забудову, Солом’янський район",
    titleRu: "Участок 10 соток под застройку, Соломенский район",
    description:
      "Рівна ділянка у середмісті, усі комунікації по межі: газ, світло, каналізація, водопровід. Дозвіл на будівництво двоповерхового будинку отримано.",
    descriptionRu:
      "Ровный участок в центре города, все коммуникации по границе: газ, свет, канализация, водопровод. Разрешение на строительство двухэтажного дома получено.",
    propertyType: "land",
    status: "active",
    dealType: "sale",
    price: 3_200_000,
    city: "Київ",
    district: "Солом’янський",
    address: "вул. Володимира Липківського, 44",
    area: 0,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    floor: 0,
    totalFloors: 0,
    landArea: 10,
    yearBuilt: 0,
    features: ["gas", "school", "metro"],
    images: [pexels(E[4]), pexels(C[4])],
    featured: 0,
    views: 87,
    agent: 0,
  },
  {
    title: "Приміщення 210 м² під ресторан у центрі",
    titleRu: "Помещение 210 м² под ресторан в центре",
    description:
      "Перший поверх житлового будинку з окремим входом та вітриною 12 метрів. Потужність 40 кВт, вентиляція, зона літньої тераси. Можлива оренда з викупом.",
    descriptionRu:
      "Первый этаж жилого дома с отдельным входом и витриной 12 метров. Мощность 40 кВт, вентиляция, зона летней террасы. Возможна аренда с выкупом.",
    propertyType: "commercial",
    status: "active",
    dealType: "sale",
    price: 15_000_000,
    city: "Львів",
    district: "Галицький",
    address: "пр. Шевченка, 7",
    area: 210,
    rooms: 6,
    bedrooms: 0,
    bathrooms: 2,
    floor: 1,
    totalFloors: 5,
    landArea: 0,
    yearBuilt: 1998,
    features: ["renovated", "security"],
    images: [pexels(K[6]), pexels(K[3]), pexels(E[0])],
    featured: 0,
    views: 199,
    agent: 2,
  },
];

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  const existing = await db.select({ id: users.id }).from(users).limit(1);
  if (existing.length > 0) return;

  const passwordHash = hashPassword("demo1234");
  const insertedUserIds = await db
    .insert(users)
    .values(AGENTS.map((agent) => ({ ...agent, passwordHash })))
    .$returningId();

  const userIds = insertedUserIds.map((r) => r.id);
  const insertedUsers = await db
    .select({ id: users.id, name: users.name, phone: users.phone })
    .from(users)
    .where(inArray(users.id, userIds));

  const insertedListingIds = await db
    .insert(listings)
    .values(
      LISTINGS.map((item, index) => ({
        userId: insertedUsers[item.agent].id,
        title: item.title,
        titleRu: item.titleRu,
        description: item.description,
        descriptionRu: item.descriptionRu,
        propertyType: item.propertyType,
        status: item.status,
        dealType: item.dealType,
        price: item.price,
        city: item.city,
        district: item.district,
        address: item.address,
        area: item.area,
        rooms: item.rooms,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        floor: item.floor,
        totalFloors: item.totalFloors,
        landArea: item.landArea,
        yearBuilt: item.yearBuilt,
        features: item.features,
        images: item.images,
        contactName: insertedUsers[item.agent].name,
        contactPhone: insertedUsers[item.agent].phone,
        featured: item.featured,
        views: item.views,
        createdAt: new Date(Date.now() - index * 36 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - index * 36 * 60 * 60 * 1000),
      })),
    )
    .$returningId();

  const listingIds = insertedListingIds.map((r) => r.id);
  const insertedListings = await db
    .select({ id: listings.id })
    .from(listings)
    .where(inArray(listings.id, listingIds));

  const buyerId = insertedUsers[1].id;

  await db.insert(favorites).values(
    [insertedListings[3], insertedListings[4], insertedListings[9], insertedListings[6]].map(
      (listing) => ({ userId: buyerId, listingId: listing.id }),
    ),
  );

  await db.insert(requests).values([
    {
      userId: buyerId,
      listingId: insertedListings[3].id,
      clientName: "Андрій Мельник",
      clientPhone: "+380 50 118 42 07",
      clientEmail: "buyer@domivka.ua",
      message:
        "Цікавить будинок у Конча-Заспі. Чи можлива поїздка на перегляд у суботу вранці?",
      budget: 30_000_000,
      preferredCity: "Київ",
      status: "viewing",
      viewingAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      agentNote: "Підтвердили перегляд, готуємо документи щодо права власності.",
    },
    {
      userId: buyerId,
      listingId: insertedListings[4].id,
      clientName: "Андрій Мельник",
      clientPhone: "+380 50 118 42 07",
      clientEmail: "buyer@domivka.ua",
      message: "Чи є можливість торгу? Готовий викупити за 5,8 млн грн.",
      budget: 6_000_000,
      preferredCity: "Львів",
      status: "offer",
      viewingAt: null,
      agentNote: "Власник розглядає пропозицію, відповідь до п’ятниці.",
    },
    {
      userId: buyerId,
      listingId: null,
      clientName: "Андрій Мельник",
      clientPhone: "+380 50 118 42 07",
      clientEmail: "buyer@domivka.ua",
      message: "Шукаю будинок 160–200 м² з ділянкою до 10 соток, бюджет 12–15 млн грн.",
      budget: 15_000_000,
      preferredCity: "Львів",
      status: "new",
      viewingAt: null,
      agentNote: "",
    },
    {
      userId: insertedUsers[0].id,
      listingId: insertedListings[1].id,
      clientName: "Ірина Бондар",
      clientPhone: "+380 93 771 05 63",
      clientEmail: "iryna.bondar@example.com",
      message: "Хочу подивитись квартиру на Оболоні, чи підходить середа ввечері?",
      budget: 4_300_000,
      preferredCity: "Київ",
      status: "contacted",
      viewingAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      agentNote: "Передали ключі, перегляд о 18:30.",
    },
    {
      userId: insertedUsers[0].id,
      listingId: insertedListings[0].id,
      clientName: "Тарас Литвин",
      clientPhone: "+380 66 240 19 88",
      clientEmail: "taras.lytvyn@example.com",
      message: "Отримав іпотечне рішення. Чи актуальна ціна 8,9 млн?",
      budget: 9_000_000,
      preferredCity: "Київ",
      status: "closed",
      viewingAt: null,
      agentNote: "Уклали попередній договір, внесено завдаток 200 000 грн.",
    },
  ]);
}

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error("[seed] failed", error);
    });
  }
  await seedPromise;
}

export async function resetAndSeed(): Promise<void> {
  await db.execute(
    sql`truncate table ${favorites}, ${requests}, ${listings}, ${users} restart identity cascade`,
  );
  seedPromise = null;
  await ensureSeeded();
}
