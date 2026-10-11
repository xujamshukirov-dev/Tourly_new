// O'zbekiston viloyatlari va tumanlari (FastAPI backend core/hududlar.py bilan 100% mos)

export const REGIONS_AND_DISTRICTS = {
  "Toshkent shahri": [
    "Bektemir", "Chilonzor", "Mirzo Ulug'bek", "Mirobod", "Olmazor",
    "Sergeli", "Shayxontohur", "Uchtepa", "Yakkasaroy", "Yashnobod", "Yunusobod"
  ],
  "Toshkent viloyati": [
    "Angren", "Bekobod", "Bo'ka", "Bo'stonliq", "Chinoz", "Ohangaron",
    "Oqqo'rg'on", "Parkent", "Piskent", "Quyichirchiq", "Yuqorichirchiq",
    "Toshkent tumani", "Yangiyo'l", "Zangiota"
  ],
  "Samarqand": [
    "Samarqand shahri", "Bulung'ur", "Ishtixon", "Jomboy", "Kattaqo'rg'on",
    "Narpay", "Nurobod", "Oqdaryo", "Payariq", "Paxtachi", "Pastdarg'om",
    "Qo'shrabot", "Toyloq", "Urgut"
  ],
  "Buxoro": [
    "Buxoro shahri", "Kogon", "Vobkent", "G'ijduvon", "Jondor", "Qorako'l",
    "Qorovulbozor", "Olot", "Peshku", "Romitan", "Shofirkon"
  ],
  "Xorazm": [
    "Urganch", "Xiva", "Bog'ot", "Gurlan", "Hazorasp", "Xonqa", "Qo'shko'pir",
    "Shovot", "Yangiariq", "Yangibozor"
  ],
  "Andijon": [
    "Andijon shahri", "Asaka", "Baliqchi", "Bo'z", "Buloqboshi", "Izboskan",
    "Jalaquduq", "Xo'jaobod", "Qo'rg'ontepa", "Marhamat", "Oltinko'l", "Paxtaobod",
    "Shahrixon", "Ulug'nor", "Xonobod"
  ],
  "Farg'ona": [
    "Farg'ona shahri", "Marg'ilon", "Qo'qon", "Oltiariq", "Bag'dod", "Beshariq",
    "Buvayda", "Dang'ara", "Furqat", "Qo'shtepa", "Rishton", "So'x", "Toshloq",
    "Uchko'prik", "Uzun", "Yozyovon"
  ],
  "Namangan": [
    "Namangan shahri", "Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Norin",
    "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangiqo'rg'on"
  ],
  "Qashqadaryo": [
    "Qarshi shahri", "Shahrisabz", "Chiroqchi", "Dehqonobod", "G'uzor",
    "Kasbi", "Kitob", "Koson", "Mirishkor", "Muborak", "Nishon", "Qamashi", "Yakkabog'"
  ],
  "Surxondaryo": [
    "Termiz", "Angor", "Bandixon", "Boysun", "Denov", "Jarqo'rg'on",
    "Muzrabot", "Oltinsoy", "Qiziriq", "Qumqo'rg'on", "Sariosiyo", "Sherobod", "Sho'rchi", "Uzun"
  ],
  "Jizzax": [
    "Jizzax shahri", "Arnasoy", "Baxmal", "Do'stlik", "Forish", "G'allaorol",
    "Mirzachul", "Paxtakor", "Yangiobod", "Zafarobod", "Zarbdor", "Zomin"
  ],
  "Sirdaryo": [
    "Guliston", "Boyovut", "Mirzaobod", "Oqoltin", "Sardoba", "Sayxunobod", "Sirdaryo", "Xovos", "Yangiyer"
  ],
  "Navoiy": [
    "Navoiy shahri", "Zarafshon", "Karmana", "Konimex", "Navbahor", "Nurota",
    "Qiziltepa", "Tomdi", "Uchquduq", "Xatirchi"
  ],
  "Qoraqalpog'iston": [
    "Nukus", "Amudaryo", "Beruniy", "Chimboy", "Ellikqal'a", "Kegeyli",
    "Mo'ynoq", "Nukus tumani", "Qanliko'l", "Qorao'zak", "Qo'ng'irot", "Shumanay", "Taxtako'pir", "To'rtko'l", "Xo'jayli"
  ]
};

export const VILOYATLAR_LIST = Object.keys(REGIONS_AND_DISTRICTS);
