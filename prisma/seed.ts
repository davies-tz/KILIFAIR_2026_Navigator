import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getBoothCoordinate, getBoothHall, getBoothPolygon } from "../lib/expoLayout";

const prisma = new PrismaClient();

type RawExhibitor = { company: string; country: string; website: string; stand: string };

const rawExhibitors: RawExhibitor[] = [
  {
    "company": "361 Degrees Adventure",
    "country": "Tanzania",
    "website": "www.361degrees.co.tz",
    "stand": "J10"
  },
  {
    "company": "7 floor media | DAR LIFE",
    "country": "Tanzania",
    "website": "www.issuu.com/darlife",
    "stand": "T24"
  },
  {
    "company": "A&K Sanctuary",
    "country": "Tanzania",
    "website": "www.aksanctuary.com",
    "stand": "T47"
  },
  {
    "company": "ACES",
    "country": "Tanzania",
    "website": "www.aces.tz",
    "stand": "FS56"
  },
  {
    "company": "Abc Bicycle Company ltd",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "X30"
  },
  {
    "company": "Abode Arusha",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z32"
  },
  {
    "company": "Acacia Collections",
    "country": "Tanzania",
    "website": "www.acaciacollections.com",
    "stand": "T17"
  },
  {
    "company": "Acacia Farm Lodge Ltd (Tanzania)",
    "country": "Tanzania",
    "website": "www.karatuacacialodge.com",
    "stand": "T23"
  },
  {
    "company": "Access Bank Tanzania",
    "country": "Tanzania",
    "website": "www.accessbankplc.com",
    "stand": "Q24"
  },
  {
    "company": "Adelphi Nairobi",
    "country": "Kenya",
    "website": "www.adelphi.co.ke",
    "stand": "Z45"
  },
  {
    "company": "Africa Amini Life",
    "country": "Tanzania",
    "website": "www.africaamiNILife.com",
    "stand": "U32"
  },
  {
    "company": "Africa Lighting Centre Ltd",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U55"
  },
  {
    "company": "African View Lodges & Tented Camps",
    "country": "Tanzania",
    "website": "www.african-view.com",
    "stand": "L14"
  },
  {
    "company": "AfriCraft",
    "country": "Tanzania",
    "website": "www.africraft.co.tz",
    "stand": "Z31"
  },
  {
    "company": "Afromaxx Tours",
    "country": "Tanzania",
    "website": "www.afromaxx.co.tz",
    "stand": "N12"
  },
  {
    "company": "Air Tanzania",
    "country": "Tanzania",
    "website": "www.airtanzania.co.tz",
    "stand": "UR2"
  },
  {
    "company": "Ajiva Decor",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z77/79"
  },
  {
    "company": "Akwaaba African Travel Market",
    "country": "Nigeria",
    "website": "www.akwaabatravelmarket.com",
    "stand": "F52"
  },
  {
    "company": "Al Mansour Isuzu",
    "country": "Tanzania",
    "website": "www.mactanzania.com",
    "stand": "A50"
  },
  {
    "company": "ALAF Limited",
    "country": "Tanzania",
    "website": "www.alaf.co.tz",
    "stand": "U62"
  },
  {
    "company": "Alaïa by Hello Capitano",
    "country": "zanzibar",
    "website": "www.anandabeachhotel.com",
    "stand": "T33"
  },
  {
    "company": "All Day in Africa",
    "country": "Tanzania",
    "website": "www.alldayinafrica.com",
    "stand": "R4"
  },
  {
    "company": "All Season Bureau de change",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U61"
  },
  {
    "company": "Allanblackia safaris Ltd",
    "country": "Uganda",
    "website": "www.allanblackiasafaris.com",
    "stand": "L35"
  },
  {
    "company": "Amani Collection",
    "country": "Tanzania",
    "website": "www.amanicollections.com",
    "stand": "N30"
  },
  {
    "company": "Amref Flying Doctors",
    "country": "Tanzania",
    "website": "www.flydoc.org",
    "stand": "O6"
  },
  {
    "company": "Andes Deli House of Cheese",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS5"
  },
  {
    "company": "Anga Luxe Travels",
    "country": "Tanzania",
    "website": "www.angaluxetravels.com",
    "stand": "P24"
  },
  {
    "company": "Ang’ata Camps & Safari",
    "country": "Tanzania",
    "website": "www.angatacamps.com",
    "stand": "A16"
  },
  {
    "company": "Anna Fresh Juice",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS83"
  },
  {
    "company": "Ardhi Africa",
    "country": "Tanzania",
    "website": "www.ardhi.africa",
    "stand": "T31"
  },
  {
    "company": "Arusha Cocktails",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS21"
  },
  {
    "company": "Arusha Medivac - Air Ambulance",
    "country": "Tanzania",
    "website": "www.arushamedivac.org",
    "stand": "K3"
  },
  {
    "company": "As Salaam Air (Z) Co Ltd",
    "country": "Tanzania",
    "website": "www.assalaamair.co.tz",
    "stand": "B12"
  },
  {
    "company": "Asante Home & Safaris",
    "country": "Tanzania",
    "website": "www.asantehomesafaris.com",
    "stand": "L24"
  },
  {
    "company": "Ashnil Hotels & Surana Luxury Collection",
    "country": "Kenya",
    "website": "www.suranaluxury.com",
    "stand": "T11"
  },
  {
    "company": "Asilia African Craft",
    "country": "Tanzania",
    "website": "www.asiliaafricancraft.co.tz",
    "stand": "Z72"
  },
  {
    "company": "Asilia Limited",
    "country": "Tanzania",
    "website": "www.asilialeathercraft.com",
    "stand": "Z7"
  },
  {
    "company": "Asilia Lodges and Camps",
    "country": "Tanzania",
    "website": "www.asiliaafrica.com",
    "stand": "T30"
  },
  {
    "company": "Atupele Cottages - Mikumi",
    "country": "Tanzania",
    "website": "www.campatupele.com",
    "stand": "L3"
  },
  {
    "company": "Auric Air Services",
    "country": "Tanzania",
    "website": "www.auricair.com",
    "stand": "V1"
  },
  {
    "company": "Awali Serengeti Camp",
    "country": "Tanzania",
    "website": "www.awali.co.tz",
    "stand": "R12"
  },
  {
    "company": "Aya Sophia Viillas",
    "country": "Tanzania",
    "website": "www.ayasophiahotel.co.tz",
    "stand": "S10"
  },
  {
    "company": "Bank of Tanzania",
    "country": "Tanzania",
    "website": "www.bot.go.tz",
    "stand": "L20"
  },
  {
    "company": "Baobab Lodges & Camps",
    "country": "Tanzania",
    "website": "www.baobablodges.com",
    "stand": "A35"
  },
  {
    "company": "Beach & Safari Holidays",
    "country": "Tanzania",
    "website": "www.paradise-wilderness.com",
    "stand": "J14"
  },
  {
    "company": "BEVCO Distribution",
    "country": "Tanzania",
    "website": "www.bevco.com",
    "stand": "FS27"
  },
  {
    "company": "Bio Food Products",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS6"
  },
  {
    "company": "BLINK",
    "country": "Tanzania",
    "website": "www.blink.co.tz",
    "stand": "A18"
  },
  {
    "company": "Blue Ocean Resort",
    "country": "Tanzania",
    "website": "www.blueoceanhotels.com",
    "stand": "E2"
  },
  {
    "company": "Bluebay Hotels Zanzibar",
    "country": "Tanzania",
    "website": "www.bluebayhotelszanzibar.com",
    "stand": "T15"
  },
  {
    "company": "Bolt Tanzania",
    "country": "Tanzania",
    "website": "www.bolt.eu/en-tz",
    "stand": "Parking"
  },
  {
    "company": "Bonite Bottlers Ltd (CocaCola)",
    "country": "Tanzania",
    "website": "www.bbl.co.tz",
    "stand": "FS85"
  },
  {
    "company": "Browns Tanzania Limited",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS6"
  },
  {
    "company": "Buildmart Limited",
    "country": "Tanzania",
    "website": "www.buildmart.co.tz",
    "stand": "V20&V22"
  },
  {
    "company": "Bulk Distributors Ltd",
    "country": "Tanzania",
    "website": "www.bulktz.com",
    "stand": "OUT3"
  },
  {
    "company": "Burger 53",
    "country": "Tanzania",
    "website": "www.takeaway.burger53.com",
    "stand": "FS9"
  },
  {
    "company": "Bushland Camps and lodges",
    "country": "Tanzania",
    "website": "www.bushlandcamps.com",
    "stand": "F10"
  },
  {
    "company": "CAC",
    "country": "Tanzania",
    "website": "www.cac.ac.tz",
    "stand": "FS63"
  },
  {
    "company": "Café Tulia",
    "country": "Tanzania",
    "website": "www.tuliahotelgroup.com",
    "stand": "FS74"
  },
  {
    "company": "Candy Mills",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z35"
  },
  {
    "company": "Car & General Trading Ltd",
    "country": "Tanzania",
    "website": "www.cargen.com/tz",
    "stand": "U63"
  },
  {
    "company": "CAWM, Mweka",
    "country": "Tanzania",
    "website": "www.mwekawildlife.ac.tz",
    "stand": "H19"
  },
  {
    "company": "CETAWICO",
    "country": "Tanzania",
    "website": "www.cetawico.com",
    "stand": "FS11"
  },
  {
    "company": "Chef Carlito Kitchen",
    "country": "Tanzania",
    "website": "www.eventmasterstz.co.tz",
    "stand": "FS43"
  },
  {
    "company": "Chromagen Solar Water Heaters",
    "country": "Tanzania",
    "website": "www.energygold.co.tz",
    "stand": "W1"
  },
  {
    "company": "Ciao Gelati",
    "country": "Tanzania",
    "website": "www.ciaogelati.com",
    "stand": "FS1"
  },
  {
    "company": "Cinnabar Green",
    "country": "Kenya",
    "website": "www.cinnabargreen.com",
    "stand": "Z22"
  },
  {
    "company": "Classic View Collection",
    "country": "Tanzania",
    "website": "www.classicviewcollection.com",
    "stand": "L4"
  },
  {
    "company": "Clouds Media Group",
    "country": "Tanzania",
    "website": "www.cloudsmedia.co.tz",
    "stand": "F18"
  },
  {
    "company": "CMC Automobiles Ltd",
    "country": "Tanzania",
    "website": "www.cmcineosgrenadier.com",
    "stand": "A4"
  },
  {
    "company": "Coastal Air",
    "country": "Tanzania",
    "website": "www.coastal.co.tz",
    "stand": "C12"
  },
  {
    "company": "Compact Energies Ltd",
    "country": "Tanzania",
    "website": "www.compact-energies.co.tz",
    "stand": "U45"
  },
  {
    "company": "Conserve Safari",
    "country": "Tanzania",
    "website": "www.conservesafari.com",
    "stand": "U34"
  },
  {
    "company": "CRDB Bank PLC",
    "country": "Tanzania",
    "website": "www.crdbbank.co.tz",
    "stand": "U2"
  },
  {
    "company": "Creative dhow furniture",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Y14"
  },
  {
    "company": "Creative Signs",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "W17"
  },
  {
    "company": "Cterra Saadani Luxury Tents",
    "country": "Tanzania",
    "website": "www.cterra.co.tz",
    "stand": "G14s"
  },
  {
    "company": "Curious Tours Africa",
    "country": "Uganda",
    "website": "www.curioustoursafrica.com",
    "stand": "L35"
  },
  {
    "company": "Data Village Technologies",
    "country": "Tanzania",
    "website": "www.datavillage.co.tz",
    "stand": "W4"
  },
  {
    "company": "Davis and Shirtliff (t) ltd",
    "country": "Tanzania",
    "website": "www.dayliff.com",
    "stand": "U54"
  },
  {
    "company": "Day Safaris Adventures Limited",
    "country": "Kenya",
    "website": "www.daysafarisadventures.com",
    "stand": "F42"
  },
  {
    "company": "Danny 4kids Entertainment",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U70"
  },
  {
    "company": "Dido’s Wear Company Ltd",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "V26"
  },
  {
    "company": "Divine Technologies",
    "country": "Tanzania",
    "website": "www.divinetechnologies.co.tz",
    "stand": "W2"
  },
  {
    "company": "Dolly Escape Farm & River Camp",
    "country": "Tanzania",
    "website": "www.dollyescape.com",
    "stand": "O2"
  },
  {
    "company": "Dorothy Flowers",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z13"
  },
  {
    "company": "Dove Serengeti Luxury Camp",
    "country": "Tanzania",
    "website": "www.kontiki.africa",
    "stand": "D30"
  },
  {
    "company": "DPO Pay by Network",
    "country": "Kenya",
    "website": "www.dpogroup.com",
    "stand": "U19"
  },
  {
    "company": "DPools Tanzania Ltd",
    "country": "Tanzania",
    "website": "www.dpoolztz.com",
    "stand": "X26"
  },
  {
    "company": "Dungu@Lilac Tanzania",
    "country": "Tanzania",
    "website": "www.lilactanzania.com",
    "stand": "FS34,32&31"
  },
  {
    "company": "Dunia - Sustainable Design",
    "country": "Tanzania",
    "website": "www.duniadesigns.org",
    "stand": "S22"
  },
  {
    "company": "East African Wild Life Society",
    "country": "Kenya",
    "website": "www.eawildlife.org",
    "stand": "L22"
  },
  {
    "company": "Eat Me",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS23"
  },
  {
    "company": "Eco Arica Expédition ltd",
    "country": "Tanzania",
    "website": "www.higeartz.com",
    "stand": "U15"
  },
  {
    "company": "EFTA",
    "country": "Tanzania",
    "website": "www.efta.co.tz",
    "stand": "N26"
  },
  {
    "company": "Eileen`S Trees Inn",
    "country": "Tanzania",
    "website": "www.eileentstrees.com",
    "stand": "B4"
  },
  {
    "company": "Elewana Collection",
    "country": "Kenya",
    "website": "www.elewana.com",
    "stand": "T34"
  },
  {
    "company": "Embalakai Authentic Camps",
    "country": "Tanzania",
    "website": "www.embalakaicamps.com",
    "stand": "V9"
  },
  {
    "company": "Emburara Safaris & Lodges",
    "country": "Uganda",
    "website": "www.emburarasafaris.com",
    "stand": "L35"
  },
  {
    "company": "Emerald Bay",
    "country": "Tanzania",
    "website": "www.emeraldbay.co.tz",
    "stand": "Q1"
  },
  {
    "company": "Emwani Coffee",
    "country": "Tanzania",
    "website": "www.emwanicoffee.co.tz",
    "stand": "FS44"
  },
  {
    "company": "Escape Luxury Lodges",
    "country": "Tanzania",
    "website": "www.escapeluxurylodge.com",
    "stand": "Q22"
  },
  {
    "company": "Exclusive Uganda Safaris",
    "country": "Uganda",
    "website": "www.exclusiveugandasafaris.com",
    "stand": "L35"
  },
  {
    "company": "Exim Bank",
    "country": "Tanzania",
    "website": "www.eximbank.co.tz",
    "stand": "W18"
  },
  {
    "company": "Fisherman Tours & Travel Ltd",
    "country": "Tanzania",
    "website": "www.fishermantours.com",
    "stand": "G14"
  },
  {
    "company": "FLIGHTLINK",
    "country": "Tanzania",
    "website": "www.flightlink.co.tz",
    "stand": "P12"
  },
  {
    "company": "Flying Doctors Society of Africa",
    "country": "Tanzania",
    "website": "www.flyingdoctorsafrica.org",
    "stand": "G2"
  },
  {
    "company": "FlyJb Global Limited",
    "country": "Ghana",
    "website": "www.flyjbglobal.com",
    "stand": "F48s"
  },
  {
    "company": "Forest Hill Hotel",
    "country": "Tanzania",
    "website": "www.foresthill.co.tz",
    "stand": "U18"
  },
  {
    "company": "Franccorp East Africa LTD",
    "country": "Tanzania",
    "website": "www.mawellastore.co.tz",
    "stand": "FS64/65"
  },
  {
    "company": "Friends Forever",
    "country": "Zimbabwe",
    "website": "NIL",
    "stand": "Z81"
  },
  {
    "company": "Fumba Town Zanzibar",
    "country": "Tanzania",
    "website": "www.cps.africa",
    "stand": "Q10"
  },
  {
    "company": "Fun Retreat Resort",
    "country": "Tanzania",
    "website": "www.funretreat.com",
    "stand": "T1"
  },
  {
    "company": "Gadgetronix",
    "country": "Tanzania",
    "website": "www.gadgetronix.net",
    "stand": "B15"
  },
  {
    "company": "Gardaworld Security",
    "country": "Tanzania",
    "website": "www.garda.com",
    "stand": "U20"
  },
  {
    "company": "Gama Gorilla",
    "country": "Rwanda",
    "website": "www.gamatour.agency",
    "stand": "F50"
  },
  {
    "company": "GEC - Narudi Tented Camp",
    "country": "Tanzania",
    "website": "www.greatexplorationcamps.com",
    "stand": "G1"
  },
  {
    "company": "German Bratwurst Limited",
    "country": "Tanzania",
    "website": "www.bora-gbl.co.tz",
    "stand": "FS67"
  },
  {
    "company": "Gilmans Outdoor Store",
    "country": "Tanzania",
    "website": "www.gilmansoutdoor.com",
    "stand": "A30"
  },
  {
    "company": "Girbau Africa",
    "country": "Spain",
    "website": "www.girbau.com",
    "stand": "D15"
  },
  {
    "company": "Glenmorangie Single Malt",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS72"
  },
  {
    "company": "Glimpse of Africa Camp",
    "country": "Tanzania",
    "website": "www.glimpsecamp.com",
    "stand": "Q4"
  },
  {
    "company": "Glynnova Designs",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z42"
  },
  {
    "company": "Gofan Safaris Travel Africa",
    "country": "Kenya",
    "website": "www.gofansafaris.com",
    "stand": "F33"
  },
  {
    "company": "Go Places",
    "country": "Kenya",
    "website": "www.goplacesdigital.com",
    "stand": "T24"
  },
  {
    "company": "Gorilla Oclock",
    "country": "Kenya",
    "website": "www.gorillaoclock.com",
    "stand": "F49"
  },
  {
    "company": "Governors’ Camp Collection",
    "country": "Kenya",
    "website": "www.governorscamp.com",
    "stand": "Q25"
  },
  {
    "company": "Great Exploration Camps Ltd",
    "country": "Tanzania",
    "website": "www.greatexplorationcamps.com",
    "stand": "G1"
  },
  {
    "company": "Great Lakes Collections",
    "country": "Tanzania",
    "website": "www.thegreatlakescollection.com",
    "stand": "E6"
  },
  {
    "company": "Greenlink Regen Limited",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "X14"
  },
  {
    "company": "Grumeti Air",
    "country": "Tanzania",
    "website": "www.grumetiair.com",
    "stand": "P10"
  },
  {
    "company": "Habari WiFi",
    "country": "Tanzania",
    "website": "www.habari.co.tz",
    "stand": "W11"
  },
  {
    "company": "Habitus Tours",
    "country": "Tanzania",
    "website": "www.habitus.co.tz",
    "stand": "F28"
  },
  {
    "company": "Hakuna Majiwe Beach Resort",
    "country": "Tanzania",
    "website": "www.hakunamajiwe.com",
    "stand": "G14s"
  },
  {
    "company": "Hanspaul Automechs Ltd.",
    "country": "Tanzania",
    "website": "www.hanspaul.co.tz",
    "stand": "A1, U1, U4 & U11"
  },
  {
    "company": "Haradali Home",
    "country": "Tanzania",
    "website": "www.haradalihome.com",
    "stand": "V6"
  },
  {
    "company": "Harlos Containers",
    "country": "Tanzania",
    "website": "www.harloscontainers.com",
    "stand": "W5"
  },
  {
    "company": "Healing Earth Tanzania",
    "country": "Tanzania",
    "website": "www.healingearthglobal.com",
    "stand": "X22"
  },
  {
    "company": "Hellen Jewelry",
    "country": "Tanzania",
    "website": "www.shaidijewelry.com",
    "stand": "Z15"
  },
  {
    "company": "Hi Gear Tent Limited",
    "country": "Tanzania",
    "website": "www.higeartz.com",
    "stand": "U15"
  },
  {
    "company": "HISENSE",
    "country": "Tanzania",
    "website": "www.mars.co.tz",
    "stand": "Y12"
  },
  {
    "company": "Holiday Vacations and Safaris Ltd",
    "country": "Zanzibar",
    "website": "www.holidayvacations.travel",
    "stand": "K6"
  },
  {
    "company": "Honeyguide Tarangire Camp",
    "country": "Tanzania",
    "website": "www.honeyguidecamp.com",
    "stand": "T46"
  },
  {
    "company": "Hot Dogs & Salads",
    "country": "Tanzania",
    "website": "www.arushahotdogs.com",
    "stand": "FS15"
  },
  {
    "company": "House Of Canvas Ltd",
    "country": "Tanzania",
    "website": "www.houseofcanvas.net",
    "stand": "D20"
  },
  {
    "company": "House of Gems Tanzania",
    "country": "Tanzania",
    "website": "www.gemstone.co.tz",
    "stand": "T40"
  },
  {
    "company": "Hychem Hygiene Solutions",
    "country": "Tanzania",
    "website": "www.hychemgroup.com",
    "stand": "X23"
  },
  {
    "company": "Iberostar Selection Zanzibar",
    "country": "Tanzania",
    "website": "www.iberostar.com",
    "stand": "S28"
  },
  {
    "company": "Ifakara Kikoi Maker Group",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z16"
  },
  {
    "company": "Iko Matata Arts",
    "country": "Kenya",
    "website": "www.ikomatata.co.ke",
    "stand": "Z57"
  },
  {
    "company": "Ilora Retreats",
    "country": "Kenya",
    "website": "www.ilora-retreats.com",
    "stand": "F41"
  },
  {
    "company": "Imaging Smart",
    "country": "Tanzania",
    "website": "www.imagingsmart.com",
    "stand": "W8"
  },
  {
    "company": "Immigration Tanzania",
    "country": "Tanzania",
    "website": "www.immigration.go.tz",
    "stand": "L25"
  },
  {
    "company": "Inaya Zanzibar Limited",
    "country": "Tanzania",
    "website": "www.inayazanzibar.com",
    "stand": "V34"
  },
  {
    "company": "INEO Hospitality Equip",
    "country": "China",
    "website": "www.cnineo.com",
    "stand": "X12"
  },
  {
    "company": "Insight Safari Holidays Ltd",
    "country": "Uganda",
    "website": "www.insightsafariholidays.com",
    "stand": "L35"
  },
  {
    "company": "International Travel Agency",
    "country": "Rwanda",
    "website": "www.Itatravelhub.com",
    "stand": "F50"
  },
  {
    "company": "Itika Wilderness Camps",
    "country": "Tanzania",
    "website": "www.itikacamps.com",
    "stand": "O10"
  },
  {
    "company": "Jacaranda Heritage Camps",
    "country": "Tanzania",
    "website": "www.mgungaportfolio.com",
    "stand": "K10"
  },
  {
    "company": "Janelle’s Pantry",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z61"
  },
  {
    "company": "Johari Tanzanian Gin",
    "country": "Tanzania",
    "website": "www.joharigin.com",
    "stand": "FS78"
  },
  {
    "company": "Jokenia Designs",
    "country": "Kenya",
    "website": "NIL",
    "stand": "Z30"
  },
  {
    "company": "Josera",
    "country": "Tanzania",
    "website": "www.josera.com",
    "stand": "Z41"
  },
  {
    "company": "Joygiver Kitchen",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS50"
  },
  {
    "company": "Jua by Agar",
    "country": "Kenya",
    "website": "www.juabyagar.com",
    "stand": "X6"
  },
  {
    "company": "Jumanji Africa Safaris",
    "country": "Uganda",
    "website": "www.jumanjiafricasafaris.com",
    "stand": "L47"
  },
  {
    "company": "Jupe Collection Limited",
    "country": "Tanzania",
    "website": "www.jupecollection.com",
    "stand": "U24"
  },
  {
    "company": "JW Seagon",
    "country": "Tanzania",
    "website": "www.jwseagon.com",
    "stand": "P22"
  },
  {
    "company": "Kadoo Bureau De Change",
    "country": "Tanzania",
    "website": "www.kadoobdc.co.tz",
    "stand": "U56"
  },
  {
    "company": "Kaka’s Barbecue",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS38"
  },
  {
    "company": "Kananga International Camps",
    "country": "Tanzania",
    "website": "www.kanangainternational.com",
    "stand": "R10"
  },
  {
    "company": "Kapok Collective",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z67"
  },
  {
    "company": "Kappa Senses & Anaya Zanzibar",
    "country": "Tanzania",
    "website": "www.kappasenses.com",
    "stand": "N6"
  },
  {
    "company": "Karama Lodge",
    "country": "Tanzania",
    "website": "www.karama-lodge.com",
    "stand": "S26"
  },
  {
    "company": "Karibu Camps & Lodges",
    "country": "Tanzania",
    "website": "www.karibucamps.com",
    "stand": "D15"
  },
  {
    "company": "Kaynela Farms Limited",
    "country": "Uganda",
    "website": "www.kaynelafarmsltd.com",
    "stand": "L43"
  },
  {
    "company": "KEBEBE Ltd",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS7"
  },
  {
    "company": "Kendwa Rocks Beach Hotel",
    "country": "Tanzania",
    "website": "www.kendwarocks.com",
    "stand": "T27"
  },
  {
    "company": "Kenzan Tented Camps",
    "country": "Tanzania",
    "website": "www.kenzanluxurycamp.com",
    "stand": "D4"
  },
  {
    "company": "Khans Barberque",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS46"
  },
  {
    "company": "Kikwetu Talents",
    "country": "Kenya",
    "website": "NIL",
    "stand": "Z34"
  },
  {
    "company": "Kili Villa",
    "country": "Tanzania",
    "website": "www.kilivilla.com",
    "stand": "T20&T51"
  },
  {
    "company": "Kilimanjaro Fresh",
    "country": "Tanzania",
    "website": "www.kilimanjarofresh.co.tz",
    "stand": "FS16"
  },
  {
    "company": "Kilimanjaro Premium Meat",
    "country": "Tanzania",
    "website": "www.eliyafood.co.tz",
    "stand": "FS42"
  },
  {
    "company": "Kilimanjaro Responsible Trekking Org.",
    "country": "Tanzania",
    "website": "www.kiliporters.org",
    "stand": "O4"
  },
  {
    "company": "Kinara Furniture",
    "country": "Tanzania",
    "website": "www.Kinaraweb.com",
    "stand": "X7"
  },
  {
    "company": "Kingfisher Beach Resort",
    "country": "Tanzania",
    "website": "www.resortkingfisher.com",
    "stand": "R25"
  },
  {
    "company": "Kirimu Camps",
    "country": "Tanzania",
    "website": "www.kirimucamps.com",
    "stand": "R14"
  },
  {
    "company": "Kisasa Designs",
    "country": "Tanzania",
    "website": "www.kisasadesigns.com",
    "stand": "B35"
  },
  {
    "company": "Kisiwa Hotels & Resorts Ltd",
    "country": "Tanzania",
    "website": "www.kisiwahotelszanzibar.com",
    "stand": "T37"
  },
  {
    "company": "Kitamu Coffee",
    "country": "Tanzania",
    "website": "www.kitamuafrica.com",
    "stand": "FS13/FS12"
  },
  {
    "company": "Kitchen Spot",
    "country": "Tanzania",
    "website": "www.kitchenspot.co.tz",
    "stand": "A8"
  },
  {
    "company": "Kudu Lodge & Lilac Tanzania",
    "country": "Tanzania",
    "website": "www.kudulodge.com",
    "stand": "R30"
  },
  {
    "company": "Kumbukumbu Luxury Tented Camp",
    "country": "Tanzania",
    "website": "www.lodgetanzania.com",
    "stand": "B9"
  },
  {
    "company": "Kuona Serengeti",
    "country": "Tanzania",
    "website": "www.kuonaserengeti.com",
    "stand": "T18"
  },
  {
    "company": "Kuoom Serengeti Lodge",
    "country": "Tanzania",
    "website": "www.kuoomserengeti.com",
    "stand": "J2"
  },
  {
    "company": "Kutana Lodge",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "M6"
  },
  {
    "company": "Laba Laba",
    "country": "Tanzania",
    "website": "www.labalaba.com",
    "stand": "U26"
  },
  {
    "company": "Lake Duluti & Luwela camp",
    "country": "Tanzania",
    "website": "www.lakedulutilodge.com",
    "stand": "C6"
  },
  {
    "company": "Land & Marine Publications",
    "country": "Tanzania",
    "website": "www.landmarine.com",
    "stand": "B8"
  },
  {
    "company": "Land of Nature Camps & Lodges",
    "country": "Tanzania",
    "website": "www.carnivoressafaris.co.tz",
    "stand": "UR16"
  },
  {
    "company": "Lavicato",
    "country": "Tanzania",
    "website": "www.lavicato.co.tz",
    "stand": "FS45"
  },
  {
    "company": "Legendary Expeditions",
    "country": "Tanzania",
    "website": "www.legendaryexpeditions.co.tz",
    "stand": "O30"
  },
  {
    "company": "Lemala Camps and Lodges",
    "country": "Tanzania",
    "website": "www.lemalacamps.com",
    "stand": "C9"
  },
  {
    "company": "Lengai Lodge & Kutana Lodge",
    "country": "Tanzania",
    "website": "www.lengaisafarilodge.com",
    "stand": "M6"
  },
  {
    "company": "Leo Leo Serengeti Luxury Camp",
    "country": "Tanzania",
    "website": "www.leoleocamps.com",
    "stand": "R20"
  },
  {
    "company": "LGT Logistics Limited",
    "country": "Tanzania",
    "website": "www.lgtlogisticstz.com",
    "stand": "X10"
  },
  {
    "company": "Links Travel Agency",
    "country": "Rwanda",
    "website": "www.linksvoyage.com",
    "stand": "F50"
  },
  {
    "company": "Little Kreationz",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z38"
  },
  {
    "company": "LUX* Marijani Zanzibar",
    "country": "Tanzania",
    "website": "www.luxresorts.com",
    "stand": "T57"
  },
  {
    "company": "Ma’a Salama Boutique Resort",
    "country": "Tanzania",
    "website": "www.maasalama.com",
    "stand": "G14s"
  },
  {
    "company": "Maasai Eco Boma Lodge",
    "country": "Tanzania",
    "website": "www.maasaiecoboma.com",
    "stand": "L10"
  },
  {
    "company": "Mabata Makali - Gruma",
    "country": "Tanzania",
    "website": "www.mabatamakali.co.tz",
    "stand": "U25"
  },
  {
    "company": "Mada Collection",
    "country": "Tanzania",
    "website": "www.madahotels.com",
    "stand": "P14"
  },
  {
    "company": "Magoroto Forest Estate",
    "country": "Tanzania",
    "website": "www.magoroto.com",
    "stand": "R26"
  },
  {
    "company": "Majira Serengeti",
    "country": "Tanzania",
    "website": "www.majiracamps.com",
    "stand": "D6"
  },
  {
    "company": "Majoritymart Suppliers Limited",
    "country": "Tanzania",
    "website": "www.majoritysuppliers.com",
    "stand": "Z9"
  },
  {
    "company": "Makao Collective",
    "country": "Tanzania",
    "website": "www.makao.co.tz",
    "stand": "W30"
  },
  {
    "company": "Makazi Mema Interior",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z54"
  },
  {
    "company": "Mambo Freshy East Africa",
    "country": "Uganda",
    "website": "www.mambofreshy.com",
    "stand": "Z1"
  },
  {
    "company": "Manjis",
    "country": "Tanzania",
    "website": "www.manjis.com",
    "stand": "A6"
  },
  {
    "company": "Mantana African Safaris",
    "country": "Uganda",
    "website": "www.kimbla-mantana.com",
    "stand": "L35"
  },
  {
    "company": "MANUCATO",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z74"
  },
  {
    "company": "Manya Luxury Camps",
    "country": "Tanzania",
    "website": "www.manyaluxurycamps.com",
    "stand": "L30"
  },
  {
    "company": "Mapito Safari Camp",
    "country": "Tanzania",
    "website": "www.Marriott.com",
    "stand": "O28"
  },
  {
    "company": "Marangu Forex Bureau Limited",
    "country": "Tanzania",
    "website": "www.mfb.co.tz",
    "stand": "V40"
  },
  {
    "company": "Marangu Hotel",
    "country": "Tanzania",
    "website": "www.maranguhotel.com",
    "stand": "V12"
  },
  {
    "company": "Marasa Africa’s Silverback Lodge",
    "country": "Uganda",
    "website": "www.marasa.net",
    "stand": "T39"
  },
  {
    "company": "Masailand Safari & Lodge",
    "country": "Tanzania",
    "website": "www.masailandsafari.com",
    "stand": "U14"
  },
  {
    "company": "Matemwe Attitude",
    "country": "Tanzania",
    "website": "www.hotels-attitude.com",
    "stand": "G14"
  },
  {
    "company": "Materuni Village Experience",
    "country": "Tanzania",
    "website": "www.materuni.com",
    "stand": "F31"
  },
  {
    "company": "Mawe Lodges",
    "country": "Tanzania",
    "website": "www.mawelodges.com",
    "stand": "B20"
  },
  {
    "company": "MB Homes",
    "country": "Tanzania",
    "website": "www.mbhomes.tz",
    "stand": "H16"
  },
  {
    "company": "Mberesero Lodges & Tented Camps",
    "country": "Tanzania",
    "website": "www.mberesero.com",
    "stand": "J1"
  },
  {
    "company": "Media Works",
    "country": "Tanzania",
    "website": "www.mediaworksglobal.co.tz",
    "stand": "W20"
  },
  {
    "company": "Mega Fm",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "T24"
  },
  {
    "company": "MEGATENTS",
    "country": "Tanzania",
    "website": "www.megatents.co.tz",
    "stand": "A20"
  },
  {
    "company": "Melba Candles",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z83"
  },
  {
    "company": "Memories Of Serengeti",
    "country": "Tanzania",
    "website": "www.mediaworksglobal.co.tz",
    "stand": "Z86"
  },
  {
    "company": "Meraki Tanzania",
    "country": "Tanzania",
    "website": "www.meraki.co.tz",
    "stand": "Z52"
  },
  {
    "company": "Mercy Bazaar",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z6"
  },
  {
    "company": "MeremetaGlow/Little Kreationz",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z38"
  },
  {
    "company": "Merit Concept",
    "country": "Tanzania",
    "website": "www.meritconcept.com",
    "stand": "T24"
  },
  {
    "company": "Migada Adv Ltd",
    "country": "Tanzania",
    "website": "www.migadadventures.com",
    "stand": "F6"
  },
  {
    "company": "Miracle Air",
    "country": "Tanzania",
    "website": "www.miracleair.tz",
    "stand": "T2"
  },
  {
    "company": "Miracle Experience",
    "country": "Tanzania",
    "website": "www.miracleexperience.co.tz",
    "stand": "A12/T2"
  },
  {
    "company": "Mkuki na Nyota Publishers",
    "country": "Tanzania",
    "website": "www.mkukinanyota.com",
    "stand": "V25"
  },
  {
    "company": "Mobila Tours and Safaris Limited",
    "country": "Tanzania",
    "website": "www.mobilasafaris.com",
    "stand": "R22"
  },
  {
    "company": "Moivaro Lodges & Tented Camps",
    "country": "Tanzania",
    "website": "www.moivaro.com",
    "stand": "M12"
  },
  {
    "company": "Moonbow Lodge",
    "country": "Tanzania",
    "website": "www.moonbowlodge.com",
    "stand": "L6"
  },
  {
    "company": "Morona View Lodge",
    "country": "Tanzania",
    "website": "www.moronaviewlodge.com",
    "stand": "J4"
  },
  {
    "company": "Mount Meru Hotel",
    "country": "Tanzania",
    "website": "www.mountmeruhotel.co.tz",
    "stand": "T44"
  },
  {
    "company": "Mount Royal Villa Hotel",
    "country": "Tanzania",
    "website": "www.mountroyalvilla.com",
    "stand": "P4"
  },
  {
    "company": "Mowankuru Safari Limited",
    "country": "Tanzania",
    "website": "www.mowankurusafari.com",
    "stand": "N8"
  },
  {
    "company": "Moyo Medicare Clinic",
    "country": "Tanzania",
    "website": "www.mmc.co.tz",
    "stand": "FS40/Z14"
  },
  {
    "company": "Moyo Tented Camp",
    "country": "Tanzania",
    "website": "www.moyotentedcamp.com",
    "stand": "R6"
  },
  {
    "company": "Mozeti Tours and Safaris Ltd",
    "country": "Tanzania",
    "website": "www.mozetitours.com",
    "stand": "K12"
  },
  {
    "company": "MTours",
    "country": "Tanzania",
    "website": "www.mtours.com",
    "stand": "Q6"
  },
  {
    "company": "Musyoka curios and art work",
    "country": "Kenya",
    "website": "NIL",
    "stand": "Z40"
  },
  {
    "company": "Mvuli Hotels and Lodges",
    "country": "Tanzania",
    "website": "www.mvulihotels.co.tz",
    "stand": "L12"
  },
  {
    "company": "MYSOL",
    "country": "Tanzania",
    "website": "www.igniteaccess.com",
    "stand": "W6"
  },
  {
    "company": "Nabaki Afrika Limited",
    "country": "Tanzania",
    "website": "www.nabaki.co.tz",
    "stand": "W14"
  },
  {
    "company": "Naisula Camps Serengeti",
    "country": "Tanzania",
    "website": "www.naisulacamps.com",
    "stand": "L28"
  },
  {
    "company": "NAS Tyre Services Ltd",
    "country": "Tanzania",
    "website": "www.nastyres.co.tz",
    "stand": "X1"
  },
  {
    "company": "Nasikia Camps",
    "country": "Tanzania",
    "website": "www.nasikiacamps.com",
    "stand": "F1"
  },
  {
    "company": "National Bank of Commerce Ltd",
    "country": "Tanzania",
    "website": "www.nbc.co.tz",
    "stand": "U16"
  },
  {
    "company": "National Museum of Tanzania",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "H19"
  },
  {
    "company": "Neema Crafts",
    "country": "Tanzania",
    "website": "www.neemacrafts.com",
    "stand": "Z3"
  },
  {
    "company": "Neema International",
    "country": "Tanzania",
    "website": "www.neemainternational.org",
    "stand": "Z87"
  },
  {
    "company": "Neptune Hotels",
    "country": "Tanzania",
    "website": "www.neptunehotels.com",
    "stand": "U33"
  },
  {
    "company": "New Safari Hotel",
    "country": "Tanzania",
    "website": "www.newsafarihotel.com",
    "stand": "J5"
  },
  {
    "company": "Ngorongoro Conservation Area",
    "country": "Tanzania",
    "website": "www.ncaa.go.tz",
    "stand": "H19"
  },
  {
    "company": "Nice Adventure Safaris",
    "country": "Tanzania",
    "website": "www.niceadventure.co.tz",
    "stand": "M4"
  },
  {
    "company": "Nita Food Products",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z58"
  },
  {
    "company": "Nje Bush Camp",
    "country": "Tanzania",
    "website": "www.njebushcamp.com",
    "stand": "L2"
  },
  {
    "company": "Northern Tanzania Beekeeping Co.Ltd",
    "country": "Tanzania",
    "website": "www.tanzaniabeekeeping.com",
    "stand": "Z12"
  },
  {
    "company": "Nova Cafe",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U28"
  },
  {
    "company": "Novacom Systems Limited",
    "country": "Kenya",
    "website": "www.novacom.co.ke",
    "stand": "Y3"
  },
  {
    "company": "Nuru’s Restaurant&Bakery",
    "country": "Tanzania",
    "website": "www.kilidovetours.com",
    "stand": "FS14"
  },
  {
    "company": "Nyabogati Camp and Emerald Bay",
    "country": "Tanzania",
    "website": "www.ebony-safaris.com",
    "stand": "Q1"
  },
  {
    "company": "Nyama Bora Laini Safi Salama",
    "country": "Tanzania",
    "website": "www.nyamabora.co.tz",
    "stand": "FS20"
  },
  {
    "company": "Nyikani Camps & Lodges",
    "country": "Tanzania",
    "website": "www.nyikani.com",
    "stand": "T5"
  },
  {
    "company": "Nyota Luxury Camps",
    "country": "Tanzania",
    "website": "www.nyotaluxurycamps.com",
    "stand": "R8"
  },
  {
    "company": "Nyssa Balloon Safaris",
    "country": "Tanzania",
    "website": "www.nyssaballoonsafaris.com",
    "stand": "G16"
  },
  {
    "company": "Nyumbani Collections Ltd",
    "country": "Tanzania",
    "website": "www.nyumbani-collection.com",
    "stand": "J6"
  },
  {
    "company": "Ocean Paradise Resort - Zanzibar",
    "country": "Tanzania",
    "website": "www.oceanparadisezanzibar.com",
    "stand": "T52"
  },
  {
    "company": "Octagon Lodge",
    "country": "Tanzania",
    "website": "www.octagonlodge.com",
    "stand": "J12"
  },
  {
    "company": "Okota - Waste to Value",
    "country": "Tanzania",
    "website": "www.okota.co",
    "stand": "W27"
  },
  {
    "company": "Oldarpoi Wageni Camps Ltd",
    "country": "Kenya",
    "website": "www.oldarpoimaracamp.co.ke",
    "stand": "F37"
  },
  {
    "company": "Olerai Wilderness Collection",
    "country": "Tanzania",
    "website": "www.shadowsofafrica.com",
    "stand": "O25"
  },
  {
    "company": "Olmorojo Camp and Lodges Ltd",
    "country": "Tanzania",
    "website": "www.olmorijocamp.com",
    "stand": "F30"
  },
  {
    "company": "Olpopongi Maasai Cultural Village",
    "country": "Tanzania",
    "website": "www.maasai-village.com",
    "stand": "C1"
  },
  {
    "company": "Omdera safaris & Resorts ltd",
    "country": "Tanzania",
    "website": "www.omderasafari.com",
    "stand": "P25"
  },
  {
    "company": "Onomo Hotel Dar es Salaam",
    "country": "Tanzania",
    "website": "www.onomohotel.com",
    "stand": "T45"
  },
  {
    "company": "Original Maasai Lodge",
    "country": "Tanzania",
    "website": "www.africaaminilife.com",
    "stand": "U32"
  },
  {
    "company": "Osiligi-lai Masai Lodge",
    "country": "Tanzania",
    "website": "www.Maasailodge.com",
    "stand": "D8"
  },
  {
    "company": "Osinon Camps and Lodges",
    "country": "Tanzania",
    "website": "www.osinoncampsandlodges.com",
    "stand": "N10"
  },
  {
    "company": "Pamoja Africa",
    "country": "Tanzania",
    "website": "www.pamojaafricatz.com",
    "stand": "D1"
  },
  {
    "company": "Pamoja Glass Blowing Art & Design",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z66"
  },
  {
    "company": "Park Hyatt Zanzibar",
    "country": "Tanzania",
    "website": "www.hyatt.com",
    "stand": "S12"
  },
  {
    "company": "Pearl Aromatherapy Clinic",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z85"
  },
  {
    "company": "Pemba Paradise Beach Resort",
    "country": "Tanzania",
    "website": "www.pembaparadise.com",
    "stand": "S3"
  },
  {
    "company": "Pembeni Africa Ltd",
    "country": "Tanzania",
    "website": "www.pembeniafrica.com",
    "stand": "S25"
  },
  {
    "company": "Pendeza Halisi Design",
    "country": "Tanzania",
    "website": "www.pendezahalisidesign.com",
    "stand": "Z46"
  },
  {
    "company": "Photons Energy Ltd",
    "country": "Tanzania",
    "website": "www.photonsenergy.com",
    "stand": "Y1"
  },
  {
    "company": "Planet Lodges and Lairs Camp",
    "country": "Tanzania",
    "website": "www.planet-lodges.com",
    "stand": "F7"
  },
  {
    "company": "Planhotel Hospitality Group",
    "country": "Tanzania",
    "website": "www.planhotel.com",
    "stand": "T50"
  },
  {
    "company": "Pocket of Paradise Travel",
    "country": "Kenya",
    "website": "www.pocketofparadisesafari.com",
    "stand": "F44"
  },
  {
    "company": "Porini Lodges and Camps",
    "country": "Tanzania",
    "website": "www.poriNILodges.com",
    "stand": "F3"
  },
  {
    "company": "Poripori Lodges & Camps",
    "country": "Tanzania",
    "website": "www.poriporilodgescamps.com",
    "stand": "N4"
  },
  {
    "company": "Precision Air Plc",
    "country": "Tanzania",
    "website": "www.precisionairtz.com",
    "stand": "N20"
  },
  {
    "company": "Premium Supplies Ltd.",
    "country": "Tanzania",
    "website": "www.megamart.co.tz",
    "stand": "X20"
  },
  {
    "company": "Prestige Rock Ghana Limited",
    "country": "Ghana",
    "website": "www.prestigerocktravels.com",
    "stand": "F48s"
  },
  {
    "company": "PrideInn Hotels",
    "country": "Kenya",
    "website": "www.prideinn.co.ke",
    "stand": "F46"
  },
  {
    "company": "Primate Journeys Africa Ltd",
    "country": "Uganda",
    "website": "www.primatejourneys.com",
    "stand": "L41"
  },
  {
    "company": "Primate Safaris",
    "country": "Rwanda",
    "website": "www.primatesafaris.info",
    "stand": "F50s"
  },
  {
    "company": "Pro Flight (Tanzania) Limited",
    "country": "Tanzania",
    "website": "www.proflight.co.tz",
    "stand": "L2"
  },
  {
    "company": "Pure Africa Tours",
    "country": "Rwanda",
    "website": "www.pureafricatours.com",
    "stand": "F50s"
  },
  {
    "company": "Pure Camps TZ ltd",
    "country": "Tanzania",
    "website": "www.purecamps.co.tz",
    "stand": "F4"
  },
  {
    "company": "RAFIKI Luxury Camps",
    "country": "Tanzania",
    "website": "www.rafikicamps.com",
    "stand": "U40"
  },
  {
    "company": "Radio 5",
    "country": "Tanzania",
    "website": "www.radio5fm.co.tz",
    "stand": "T24"
  },
  {
    "company": "Raissa Travels",
    "country": "Tanzania",
    "website": "www.raissatravels.com",
    "stand": "S4"
  },
  {
    "company": "Rajinder Motors",
    "country": "Tanzania",
    "website": "www.rsaafrica.com",
    "stand": "A25"
  },
  {
    "company": "Randilen Plains",
    "country": "Tanzania",
    "website": "www.randilenplains.com",
    "stand": "P6"
  },
  {
    "company": "Red ‘n White",
    "country": "Tanzania",
    "website": "www.rednwhite.info",
    "stand": "FS76/T58"
  },
  {
    "company": "REFIXIT",
    "country": "Tanzania",
    "website": "www.refixit.co.tz",
    "stand": "Z39"
  },
  {
    "company": "Regional Air Services Ltd",
    "country": "Tanzania",
    "website": "www.regionaltanzania.com",
    "stand": "H4"
  },
  {
    "company": "Rescue.co",
    "country": "Kenya",
    "website": "www.rescue.co",
    "stand": "F35"
  },
  {
    "company": "Rhino Max",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "G3"
  },
  {
    "company": "Rock Blocks Investment",
    "country": "Tanzania",
    "website": "www.rockblocks.co.tz",
    "stand": "OUT2"
  },
  {
    "company": "Royal Mara Safari Lodge",
    "country": "Kenya",
    "website": "www.royalmara.com",
    "stand": "F47"
  },
  {
    "company": "Royal (Rhe Safety)",
    "country": "Tanzania",
    "website": "www.royalsafety.co.tz",
    "stand": "X2"
  },
  {
    "company": "Rushtrek Traveling",
    "country": "Tanzania",
    "website": "www.travel.rushtrektours.com",
    "stand": "V4"
  },
  {
    "company": "RTTA",
    "country": "Rwanda",
    "website": "www.rtta.rw",
    "stand": "F50"
  },
  {
    "company": "Rwanda Eco Company & Safaris",
    "country": "Rwanda",
    "website": "www.rwandaecocompany.com",
    "stand": "F45"
  },
  {
    "company": "Rwandair Co.Ltd",
    "country": "Tanzania",
    "website": "www.rwandair.com",
    "stand": "E4"
  },
  {
    "company": "Saadani Safari Lodge",
    "country": "Tanzania",
    "website": "www.saadanisafarilodges.com",
    "stand": "F30"
  },
  {
    "company": "Sabrahm Safaris Ltd",
    "country": "Tanzania",
    "website": "www.sabrahmsafaris.com",
    "stand": "V3"
  },
  {
    "company": "Safari Gateway Ltd",
    "country": "Tanzania",
    "website": "www.safarigateway.co.tz",
    "stand": "F11"
  },
  {
    "company": "Safari Haven",
    "country": "Tanzania",
    "website": "www.safarisolestours.com",
    "stand": "A60/A70"
  },
  {
    "company": "Safari-Lens",
    "country": "Tanzania",
    "website": "www.safari-lens.com",
    "stand": "A40"
  },
  {
    "company": "Safarilink Aviation Ltd",
    "country": "Kenya",
    "website": "www.flysafarilink.com",
    "stand": "K2"
  },
  {
    "company": "Safety Sam Limited",
    "country": "Tanzania",
    "website": "www.safetysamltd.co.tz",
    "stand": "V28"
  },
  {
    "company": "Saheel’s Barbecue",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS36"
  },
  {
    "company": "Salinero Hotels",
    "country": "Tanzania",
    "website": "www.salinerohotels.com",
    "stand": "T54"
  },
  {
    "company": "Sameer Parts Limited",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U60"
  },
  {
    "company": "Samstrong Furniture",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U42"
  },
  {
    "company": "Sanaa Tamu Furniture & Designs",
    "country": "Tanzania",
    "website": "www.sanaatamu.co.tz",
    "stand": "U46/U50"
  },
  {
    "company": "Sanka Design",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z75"
  },
  {
    "company": "Saruni Basecamp",
    "country": "Kenya",
    "website": "www.sarunibasecamp.com",
    "stand": "F40"
  },
  {
    "company": "SBH Hotels Zanzibar",
    "country": "Tanzania",
    "website": "www.sbhfue.com",
    "stand": "S8"
  },
  {
    "company": "Sea Cliff Hotel",
    "country": "Tanzania",
    "website": "www.hotelseacliff.com",
    "stand": "T29"
  },
  {
    "company": "Sea Cliff Resort",
    "country": "Tanzania",
    "website": "www.seacliffzanzibar.com",
    "stand": "T29"
  },
  {
    "company": "Senjaro Pay",
    "country": "Tanzania",
    "website": "www.senjaropay.com",
    "stand": "M10"
  },
  {
    "company": "Serangati Tourism",
    "country": "Dubai",
    "website": "www.serangatigroup.com",
    "stand": "F38"
  },
  {
    "company": "Serena Hotels",
    "country": "Tanzania",
    "website": "www.serenahotels.com",
    "stand": "W16"
  },
  {
    "company": "Serengeti Ark Safari Lodge",
    "country": "Tanzania",
    "website": "www.ark-tz.com/home",
    "stand": "P8"
  },
  {
    "company": "Serengeti Balloon Safaris",
    "country": "Tanzania",
    "website": "www.balloonsafaris.com",
    "stand": "F14"
  },
  {
    "company": "Serengeti House Of Nature",
    "country": "Tanzania",
    "website": "www.sumbiextramilessafari.com",
    "stand": "D2"
  },
  {
    "company": "Serengeti Little Paradise",
    "country": "Tanzania",
    "website": "www.serengetilittleparadise.com",
    "stand": "F5"
  },
  {
    "company": "Serengeti Luxury Retreat",
    "country": "Tanzania",
    "website": "www.serengetiluxuryretreat.com",
    "stand": "T41"
  },
  {
    "company": "Serengeti Sound Of Nature",
    "country": "Tanzania",
    "website": "www.serengetisoundofnature.com",
    "stand": "L1"
  },
  {
    "company": "Service Hub",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "V36"
  },
  {
    "company": "Shakir Arusha",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z48"
  },
  {
    "company": "Shalom Safaris Rwanda",
    "country": "Rwanda",
    "website": "www.shalomsafarisrwanda.com",
    "stand": "F43"
  },
  {
    "company": "Shine Balloon Safaris",
    "country": "Tanzania",
    "website": "www.shineballoons.com",
    "stand": "P28"
  },
  {
    "company": "Sidai Camps and Lodges",
    "country": "Tanzania",
    "website": "www.sidaicampsandlodges.com",
    "stand": "R24"
  },
  {
    "company": "Sidai Designs",
    "country": "Tanzania",
    "website": "www.sidaidesigns.com",
    "stand": "W28"
  },
  {
    "company": "Simba Portfolio Lodges",
    "country": "Tanzania",
    "website": "www.simbaportfolio.com",
    "stand": "N1"
  },
  {
    "company": "Simbavati Lodge Collection",
    "country": "Tanzania",
    "website": "www.simbavati.com",
    "stand": "T36"
  },
  {
    "company": "Sirimon Cheese",
    "country": "Kenya",
    "website": "www.sirimoncheese.co.ke",
    "stand": "FS2"
  },
  {
    "company": "Siringit Collection Tanzania",
    "country": "Tanzania",
    "website": "www.siringit.co.tz",
    "stand": "V7"
  },
  {
    "company": "Sisini Collections",
    "country": "Tanzania",
    "website": "www.envilodges.com",
    "stand": "L8"
  },
  {
    "company": "SkyRuby Fuel Delivery System",
    "country": "Tanzania",
    "website": "www.skyrubygroup.com",
    "stand": "W10"
  },
  {
    "company": "Skyward Airlines",
    "country": "Tanzania",
    "website": "www.skywardairlines.co.ke",
    "stand": "P26"
  },
  {
    "company": "Smart Outfitters Ltd.",
    "country": "Tanzania",
    "website": "www.smartoutfitters.co.tz",
    "stand": "D14"
  },
  {
    "company": "Sona Tours",
    "country": "Kenya",
    "website": "www.sonatours.co.ke",
    "stand": "F25"
  },
  {
    "company": "Soraya Tours & Travel",
    "country": "Tanzania",
    "website": "www.sorayaexperience.com",
    "stand": "F26"
  },
  {
    "company": "Starworld Lodge",
    "country": "Tanzania",
    "website": "www.starworldlodge.co.tz",
    "stand": "C4"
  },
  {
    "company": "Summit Lodge",
    "country": "Tanzania",
    "website": "www.summitlodge.co.tz",
    "stand": "O8"
  },
  {
    "company": "Summit Retreat B&B",
    "country": "Tanzania",
    "website": "www.summitretreat.co.tz",
    "stand": "B6"
  },
  {
    "company": "Sun Tours And travel Zanzibar",
    "country": "Tanzania",
    "website": "www.suntoursznz.com",
    "stand": "F8"
  },
  {
    "company": "Sunkist Investments Ltd",
    "country": "Tanzania",
    "website": "www.sunkistinvestment.com",
    "stand": "V30"
  },
  {
    "company": "Swahili Touch Natural Life",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z20"
  },
  {
    "company": "Switch Makonda Wallputty",
    "country": "Tanzania",
    "website": "www.thechoiceone.net",
    "stand": "FS70"
  },
  {
    "company": "TAASA Lodges & Camps",
    "country": "Tanzania",
    "website": "www.taasa.com",
    "stand": "K8"
  },
  {
    "company": "Taifa Gas",
    "country": "Tanzania",
    "website": "www.taifagas.co.tz",
    "stand": "U52"
  },
  {
    "company": "Tan Management",
    "country": "Tanzania",
    "website": "www.jwseagon.com",
    "stand": "P22"
  },
  {
    "company": "TANAPA",
    "country": "Tanzania",
    "website": "www.tanzaniaparks.go.tz",
    "stand": "OUT5/H19"
  },
  {
    "company": "Tanga Beach Resort & Spa",
    "country": "Tanzania",
    "website": "www.tangabeachresort.com",
    "stand": "U14"
  },
  {
    "company": "Tanganyika Arms Ltd",
    "country": "Tanzania",
    "website": "www.tanganyikaarms.co.tz",
    "stand": "W13"
  },
  {
    "company": "Tanzania Airports Authority (TAA)",
    "country": "Tanzania",
    "website": "www.kilimanjaroairport.go.tz",
    "stand": "B5"
  },
  {
    "company": "Tanzania Breweries Limited",
    "country": "Tanzania",
    "website": "www.tanzaniabreweries.co.tz",
    "stand": "FS53"
  },
  {
    "company": "Tanzania Bush Camps",
    "country": "Tanzania",
    "website": "www.tanzaniabushcamps.com",
    "stand": "S1"
  },
  {
    "company": "Tanzania Investment Centre",
    "country": "Tanzania",
    "website": "www.tic.go.tz",
    "stand": "N2"
  },
  {
    "company": "Tanzania Local Tour Operators-TLTO",
    "country": "Tanzania",
    "website": "www.tlto.org",
    "stand": "R1"
  },
  {
    "company": "Tanzania Revenue Authority - TRA",
    "country": "Tanzania",
    "website": "www.tra.go.tz",
    "stand": "F16"
  },
  {
    "company": "Tanzania Tourist Board - TTB",
    "country": "Tanzania",
    "website": "www.tanzaniatourism.go.tz",
    "stand": "H19"
  },
  {
    "company": "Tanzania Wildlife Authority - TAWA",
    "country": "Tanzania",
    "website": "www.tawa.go.tz",
    "stand": "H19"
  },
  {
    "company": "Tanzania Wild Camp",
    "country": "Tanzania",
    "website": "www.tanzaniawildcamps.com",
    "stand": "UR13"
  },
  {
    "company": "Tarangire Greenland Retreat",
    "country": "Tanzania",
    "website": "www.tarangiregreenland.co.tz",
    "stand": "H2"
  },
  {
    "company": "Tarangire Safari Lodge",
    "country": "Tanzania",
    "website": "www.tarangiresafarilodge.com",
    "stand": "U23"
  },
  {
    "company": "Tata Africa Holding (T) Ltd",
    "country": "Tanzania",
    "website": "www.tatainternational.com",
    "stand": "UR8"
  },
  {
    "company": "TATO",
    "country": "Tanzania",
    "website": "www.tatotz.org",
    "stand": "G5"
  },
  {
    "company": "TAWIRI",
    "country": "Tanzania",
    "website": "www.tawiri.or.tz",
    "stand": "H19"
  },
  {
    "company": "Tausi Camps & Lodges",
    "country": "Tanzania",
    "website": "www.tausilodges.com",
    "stand": "V5"
  },
  {
    "company": "Techno Drillers Limited",
    "country": "Tanzania",
    "website": "www.technodrillers.co.tz",
    "stand": "U37"
  },
  {
    "company": "Tende Arts",
    "country": "Zimbabwe",
    "website": "NIL",
    "stand": "Z17"
  },
  {
    "company": "TGD Enterprises",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "X24"
  },
  {
    "company": "TGN Company Limited",
    "country": "Tanzania",
    "website": "www.tgn.co.tz",
    "stand": "X4"
  },
  {
    "company": "The Aiyana Resort & Spa",
    "country": "Tanzania",
    "website": "www.theaiyana.com",
    "stand": "T8"
  },
  {
    "company": "The Forward Group",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z70"
  },
  {
    "company": "The Maridadi Hotel",
    "country": "Tanzania",
    "website": "www.themaridadihotel.com",
    "stand": "F24"
  },
  {
    "company": "The Naturals Beauty Co.",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z21"
  },
  {
    "company": "The Okaseni Lodge",
    "country": "Tanzania",
    "website": "www.okasenilodge.com",
    "stand": "F6"
  },
  {
    "company": "The Orangi Collection",
    "country": "Tanzania",
    "website": "www.thesavannahcollection.com",
    "stand": "M1"
  },
  {
    "company": "The Original Coffee Van",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS82"
  },
  {
    "company": "The Soul Paje",
    "country": "Tanzania",
    "website": "www.toc.co.tz",
    "stand": "V8"
  },
  {
    "company": "The Z Group of Comapnies",
    "country": "Tanzania",
    "website": "www.thezhotel.com",
    "stand": "T10&T14"
  },
  {
    "company": "Tile & Style",
    "country": "Tanzania",
    "website": "www.tilenstyle.co.tz",
    "stand": "Y7"
  },
  {
    "company": "Timeless Morogoro",
    "country": "Tanzania",
    "website": "www.whistlingwoods.co.tz",
    "stand": "V2"
  },
  {
    "company": "TNS Hospitality",
    "country": "Tanzania",
    "website": "www.tnshospitality.co.tz",
    "stand": "T32"
  },
  {
    "company": "TOA Hotel & Spa",
    "country": "Tanzania",
    "website": "www.toazanzibar.com",
    "stand": "T25"
  },
  {
    "company": "Tonga Textiles",
    "country": "Zimbabwe",
    "website": "www.tongatextiles.com",
    "stand": "Z24"
  },
  {
    "company": "Top Kitchen",
    "country": "Tanzania",
    "website": "www.spanishtiles.co.tz",
    "stand": "U15"
  },
  {
    "company": "Tour Operators Union of Ghana",
    "country": "Ghana",
    "website": "www.touroperatorsgh.org",
    "stand": "F48"
  },
  {
    "company": "Tourism School",
    "country": "Tanzania",
    "website": "www.africaamini.edu",
    "stand": "FS29"
  },
  {
    "company": "Tourist & Diplomatic Police",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "L26"
  },
  {
    "company": "Tourplan East Africa",
    "country": "Kenya",
    "website": "www.tourplan.com",
    "stand": "F32"
  },
  {
    "company": "Travelzone Ltd",
    "country": "Ghana",
    "website": "NIL",
    "stand": "F48s"
  },
  {
    "company": "TSM Electric (Smart Lighting)",
    "country": "Tanzania",
    "website": "www.tsmelectric.com",
    "stand": "W7"
  },
  {
    "company": "Tukaone Camps",
    "country": "Tanzania",
    "website": "www.tukaonecamps.com",
    "stand": "N25"
  },
  {
    "company": "Tulia Zanzibar Resort",
    "country": "Tanzania",
    "website": "www.tuliazanzibar.com",
    "stand": "T49"
  },
  {
    "company": "Tuna & Co",
    "country": "Tanzania",
    "website": "www.tuna.co.tz",
    "stand": "FS18"
  },
  {
    "company": "Turaco Collection",
    "country": "Tanzania",
    "website": "www.deltahotelsmarriott.com",
    "stand": "U36"
  },
  {
    "company": "Twiga Brewery",
    "country": "Tanzania",
    "website": "www.twigabrewery.com",
    "stand": "FS80"
  },
  {
    "company": "Uganda - The Pearl of Africa",
    "country": "Uganda",
    "website": "www.gorilla-tracking-ugand.com",
    "stand": "L35"
  },
  {
    "company": "Ujumbe Ink Ltd",
    "country": "Tanzania",
    "website": "www.ujumbeink.com",
    "stand": "B14"
  },
  {
    "company": "Ujuzi Afrika",
    "country": "Tanzania",
    "website": "www.ujuziafrika.com",
    "stand": "Z48"
  },
  {
    "company": "Unifab Africa",
    "country": "Tanzania",
    "website": "www.unifabafrica.com",
    "stand": "U66"
  },
  {
    "company": "Urban by Cityblue Dar / LHG",
    "country": "Tanzania",
    "website": "www.citybluehotels.com",
    "stand": "T7"
  },
  {
    "company": "Utengule",
    "country": "Tanzania",
    "website": "www.utengule.com",
    "stand": "V13"
  },
  {
    "company": "UVI Foundation for Education",
    "country": "Tanzania",
    "website": "www.uvifoundation.com",
    "stand": "Z44"
  },
  {
    "company": "Uzuri Safaris",
    "country": "Tanzania",
    "website": "www.uzurisafarisltd.com",
    "stand": "S6"
  },
  {
    "company": "Velora Amenities",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "W12"
  },
  {
    "company": "VIA Aviation Ltd",
    "country": "Tanzania",
    "website": "www.viaaviation.com",
    "stand": "A7"
  },
  {
    "company": "Villa Kiva Boutique Hotel",
    "country": "Tanzania",
    "website": "www.villakiva.com",
    "stand": "Q12"
  },
  {
    "company": "Vintage Spaces by Divine",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "Z64"
  },
  {
    "company": "VISA",
    "country": "Tanzania",
    "website": "www.visa.com",
    "stand": "F21"
  },
  {
    "company": "Wander Lux Safaris",
    "country": "Rwanda",
    "website": "www.wanderluxsafaris.com",
    "stand": "F50s"
  },
  {
    "company": "Waridi Eyewear",
    "country": "Kenya",
    "website": "www.waridieyewear.co.ke",
    "stand": "Z18"
  },
  {
    "company": "Wayo Africa",
    "country": "Kenya",
    "website": "www.wayoafrica.com",
    "stand": "Q26"
  },
  {
    "company": "Wellworth Collection",
    "country": "Tanzania",
    "website": "www.wellworthcollection.co.tz",
    "stand": "T4"
  },
  {
    "company": "WeTravel",
    "country": "USA",
    "website": "www.wetravel.com",
    "stand": "V24"
  },
  {
    "company": "Whisper Tanzania",
    "country": "Tanzania",
    "website": "www.thewhisper-serengeti.com",
    "stand": "U22"
  },
  {
    "company": "White Sands Resort & Conference Centre",
    "country": "Tanzania",
    "website": "www.hotelwhitesands.com",
    "stand": "T29"
  },
  {
    "company": "Wild Frontiers Tanzania",
    "country": "Tanzania",
    "website": "www.wildfrontiers.com",
    "stand": "M2"
  },
  {
    "company": "Wilderness Collection – Craters Edge",
    "country": "Tanzania",
    "website": "www.thewildernesscollection.com",
    "stand": "V14"
  },
  {
    "company": "Wilderness Destinations",
    "country": "Kenya",
    "website": "www.wildernessdestinations.com",
    "stand": "Q28"
  },
  {
    "company": "Wilderness Rwanda",
    "country": "Rwanda",
    "website": "www.wildernessdestinations.com",
    "stand": "F50"
  },
  {
    "company": "Wild Oasis Camp Serengeti",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "U17"
  },
  {
    "company": "Wildlux Serengeti Camp",
    "country": "Tanzania",
    "website": "www.wildluxserengeticamp.com",
    "stand": "Q3"
  },
  {
    "company": "Wood Art Empire",
    "country": "Tanzania",
    "website": "www.woodartempire.com",
    "stand": "Z68"
  },
  {
    "company": "World Travelling Company",
    "country": "Tanzania",
    "website": "www.world-travelling.com",
    "stand": "F9"
  },
  {
    "company": "Yanolja Cloud Solution",
    "country": "Tanzania",
    "website": "www.yanoljacloudsolution.com",
    "stand": "W3"
  },
  {
    "company": "Yarazzak Restaurant",
    "country": "Tanzania",
    "website": "NIL",
    "stand": "FS35"
  },
  {
    "company": "YAS Tanzania",
    "country": "Tanzania",
    "website": "www.yas.co.tz",
    "stand": "F20"
  },
  {
    "company": "ZAFS Tours",
    "country": "Tanzania",
    "website": "www.zafstours.com",
    "stand": "A30"
  },
  {
    "company": "Zanzibar Airport Authority",
    "country": "Tanzania",
    "website": "www.zaa.go.tz",
    "stand": "G14"
  },
  {
    "company": "Zanzibar Boutique Hotels",
    "country": "Tanzania",
    "website": "www.zanzibarboutiquehotels.com",
    "stand": "J3"
  },
  {
    "company": "Zanzibar Car Hire Ltd",
    "country": "Tanzania",
    "website": "www.zanzibarcarhire.com",
    "stand": "G14"
  },
  {
    "company": "Zanzibar Commission for Tourism",
    "country": "Tanzania",
    "website": "www.zanzibartourism.go.tz",
    "stand": "G14"
  },
  {
    "company": "Zanzibar Exotic Tours Safaris",
    "country": "Tanzania",
    "website": "www.zanzibarexotictours.com",
    "stand": "G14s"
  },
  {
    "company": "Zanzibar Insurance Corporati",
    "country": "Tanzania",
    "website": "www.zic.co.tz",
    "stand": "G14"
  },
  {
    "company": "Zara TZ Adventure",
    "country": "Tanzania",
    "website": "www.zaratours.com",
    "stand": "UR13"
  },
  {
    "company": "ZATI",
    "country": "Tanzania",
    "website": "www.zati.or.tz",
    "stand": "G14"
  },
  {
    "company": "ZEDLAB",
    "country": "Tanzania",
    "website": "www.zedlab.co.tz",
    "stand": "U28"
  },
  {
    "company": "ZATO",
    "country": "Tanzania",
    "website": "www.zato.or.tz",
    "stand": "G14"
  },
  {
    "company": "Zen Water",
    "country": "Tanzania",
    "website": "www.kisimawater.com",
    "stand": "Z90"
  },
  {
    "company": "ZOLA",
    "country": "Tanzania",
    "website": "www.zolaintelligence.com",
    "stand": "Y5"
  },
  {
    "company": "ZRA",
    "country": "Tanzania",
    "website": "www.zanrevenue.org",
    "stand": "G14"
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "exhibitor";
}

function normalizeWebsite(value: string) {
  const cleaned = value.trim();
  if (!cleaned || cleaned.toUpperCase() === "NIL") return null;
  if (cleaned.includes("@") && !cleaned.startsWith("http")) return null;
  return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
}

function categoryFor(item: RawExhibitor) {
  const name = item.company.toLowerCase();
  const stand = item.stand.toUpperCase();
  if (stand.startsWith("FS") || /food|juice|coffee|burger|deli|kitchen|brewery|beverage|coca|gelati|restaurant|café|cafe/.test(name)) return "food-beverage";
  if (/air|aviation|airport|flight|flying|coastal|auric/.test(name)) return "airlines-transport";
  if (/bank|visa|pay|finance|revenue|insurance|bureau/.test(name)) return "finance-payments";
  if (/tech|data|cloud|digital|software|solution|blink|zola|we travel|wetravel|tourplan/.test(name)) return "travel-technology";
  if (/board|tourism|tanapa|tawa|tato|zati|authority|commission|eac|government|ministry|association|union/.test(name)) return "destination-boards";
  if (stand.startsWith("Z") || /craft|arts|decor|textile|wear|beauty|furniture|wood|collection/.test(name)) return "arts-craft";
  if (/hotel|resort|lodge|lodges|camp|camps|collection|retreat|villa|cottages|serengeti|zanzibar|manyara|tarangire|ngorongoro/.test(name)) return "lodges-camps";
  if (/safari|tour|travel|adventure|expedition|operator/.test(name)) return "safari-operators";
  if (/vehicle|car|isuzu|auto|motors|tyre|4x4|drillers|solar|lighting|tiles|water|gas|electric|supplier|buildmart|dayliff/.test(name) || /^[UVWXY]/.test(stand)) return "industry-suppliers";
  return "safari-operators";
}

const categories = [
  ["Safari Operators", "safari-operators"],
  ["Lodges & Camps", "lodges-camps"],
  ["Destination Boards", "destination-boards"],
  ["Airlines & Transport", "airlines-transport"],
  ["Travel Technology", "travel-technology"],
  ["Food & Beverage", "food-beverage"],
  ["Finance & Payments", "finance-payments"],
  ["Industry Suppliers", "industry-suppliers"],
  ["Arts & Craft", "arts-craft"]
] as const;


function humanBriefFor(item: RawExhibitor) {
  const category = categoryFor(item);
  const location = item.country && item.country.toUpperCase() !== "NIL" ? item.country : "the tourism market";
  const websiteNote = normalizeWebsite(item.website) ? "Website details are available in the app for quick follow-up after visiting the booth." : "The app keeps the stand easy to find even where public web details are limited.";
  const profileMap: Record<string, string> = {
    "safari-operators": `${item.company} is a travel and safari exhibitor from ${location}, positioned for visitors looking for guided trips, destination planning, and trade conversations. Visit stand ${item.stand} to explore safari packages, local expertise, and partnership opportunities. ${websiteNote}`,
    "lodges-camps": `${item.company} represents the accommodation and safari hospitality side of ${location}, ideal for visitors comparing lodges, camps, retreats, and premium stays. Stand ${item.stand} is a useful stop for room products, guest experience discussions, and travel trade networking. ${websiteNote}`,
    "destination-boards": `${item.company} appears as a destination, association, or institutional exhibitor from ${location}. Visit stand ${item.stand} for official tourism information, market guidance, and connections that support regional travel planning. ${websiteNote}`,
    "airlines-transport": `${item.company} supports movement across the travel journey, from flights and transfers to transport logistics. Stand ${item.stand} helps visitors connect itineraries, routes, and mobility services around the expo and beyond. ${websiteNote}`,
    "travel-technology": `${item.company} brings a digital tourism angle to KARIBU-KILIFAIR, useful for operators interested in booking tools, visibility, data, automation, and smarter travel operations. Find them at stand ${item.stand}. ${websiteNote}`,
    "food-beverage": `${item.company} is part of the expo hospitality layer, giving visitors a practical food, drink, or refreshment stop during the fair. Stand ${item.stand} is mapped for quick access when moving across the grounds. ${websiteNote}`,
    "finance-payments": `${item.company} supports tourism business operations through payments, banking, finance, insurance, or compliance services. Visit stand ${item.stand} for business support relevant to exhibitors and travel trade visitors. ${websiteNote}`,
    "industry-suppliers": `${item.company} serves the tourism supply chain with equipment, vehicles, infrastructure, energy, materials, or B2B services. Stand ${item.stand} is relevant for operators improving field operations and guest delivery. ${websiteNote}`,
    "arts-craft": `${item.company} adds culture, retail, design, or craft value to the expo experience. Stand ${item.stand} is ideal for visitors looking for locally inspired products, creative suppliers, and cultural goods. ${websiteNote}`
  };
  return profileMap[category] ?? profileMap["safari-operators"];
}

function servicesFor(item: RawExhibitor) {
  const category = categoryFor(item);
  const serviceMap: Record<string, string[]> = {
    "safari-operators": ["Safari packages", "Tour planning", "Travel trade meetings"],
    "lodges-camps": ["Accommodation", "Luxury stays", "Safari hospitality"],
    "destination-boards": ["Destination information", "Trade support", "Tourism promotion"],
    "airlines-transport": ["Flights", "Transfers", "Travel logistics"],
    "travel-technology": ["Travel software", "Digital booking", "Tourism data"],
    "food-beverage": ["Food stalls", "Beverages", "Expo catering"],
    "finance-payments": ["Payments", "Banking", "Business support"],
    "industry-suppliers": ["Tourism supplies", "Equipment", "B2B services"],
    "arts-craft": ["Craft products", "Retail", "Cultural goods"]
  };
  return serviceMap[category] ?? serviceMap["safari-operators"];
}

async function main() {
  const adminPassword = await bcrypt.hash("Kilifair2026!", 12);

  await prisma.boothView.deleteMany();
  await prisma.searchLog.deleteMany();
  await prisma.boothImage.deleteMany();
  await prisma.booth.deleteMany();
  await prisma.exhibitor.deleteMany();

  await prisma.user.upsert({
    where: { email: "admin@kilifair.local" },
    update: { passwordHash: adminPassword },
    create: {
      name: "KILIFAIR Admin",
      email: "admin@kilifair.local",
      passwordHash: adminPassword
    }
  });

  const savedCategories = await Promise.all(
    categories.map(([name, slug]) =>
      prisma.category.upsert({
        where: { slug },
        update: { name },
        create: { name, slug }
      })
    )
  );

  const bySlug = Object.fromEntries(
  savedCategories.map((category: { id: string; slug: string }) => [
    category.slug,
    category
  ])
);

  for (const [index, item] of rawExhibitors.entries()) {
    const categorySlug = categoryFor(item);
    const [latitude, longitude] = getBoothCoordinate(item.stand);
    const website = normalizeWebsite(item.website);
    const slug = `${slugify(item.company)}-${slugify(item.stand)}-${index + 1}`;

    const exhibitor = await prisma.exhibitor.create({
      data: {
        companyName: item.company,
        slug,
        description: humanBriefFor(item),
        services: servicesFor(item),
        contactName: null,
        email: null,
        phone: null,
        website,
        categoryId: bySlug[categorySlug].id,
        booth: {
          create: {
            boothNumber: item.stand,
            hall: getBoothHall(item.stand),
            latitude,
            longitude,
            polygon: getBoothPolygon(item.stand) as object
          }
        },
        images: {
          create: {
            url: `/images/${slug}.jpg`,
            alt: `${item.company} booth placeholder`
          }
        }
      }
    });

    if (index < 40) {
      await prisma.boothView.create({ data: { exhibitorId: exhibitor.id } });
    }
  }

  await prisma.searchLog.createMany({
    data: [
      { query: "T30" },
      { query: "Asilia" },
      { query: "Tanzania Tourist Board" },
      { query: "food" },
      { query: "safari" },
      { query: "Zanzibar" },
      { query: "Auric Air" }
    ]
  });

  console.log(`Seeded ${rawExhibitors.length} official KILIFAIR exhibitors.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
