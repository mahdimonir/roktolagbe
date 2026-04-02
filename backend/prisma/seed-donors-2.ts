
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, BloodGroup, Role } from "@prisma/client";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("RoktoLagbe123", 12);

  // New Organization Name
  const orgName = "AlleyesOnBD";
  const orgEmail = "alleyesonbd@roktolagbe.com";

  // Upsert Organization User & Profile
  console.log(`Upserting organization manager: ${orgName}`);
  const orgUser = await prisma.user.upsert({
    where: { email: orgEmail },
    update: {
      role: Role.MANAGER,
      isActive: true,
      isVerified: true
    },
    create: {
      email: orgEmail,
      passwordHash,
      role: Role.MANAGER,
      isVerified: true,
      isActive: true,
      managerProfile: {
        create: {
          name: orgName,
          type: "organization",
          district: "Dhaka",
          contactPhone: "01800000000",
          isVerified: true,
        }
      }
    },
    include: { managerProfile: true }
  });

  // Ensure manager profile exists even if user already existed
  let orgManager = orgUser.managerProfile;
  if (!orgManager) {
    orgManager = await prisma.managerProfile.upsert({
      where: { userId: orgUser.id },
      update: { name: orgName, type: "organization", isVerified: true },
      create: {
        userId: orgUser.id,
        name: orgName,
        type: "organization",
        district: "Dhaka",
        contactPhone: "01800000000",
        isVerified: true,
      }
    });
  }

  const orgId = orgManager!.id;

  function normalizePhone(phone: string) {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 11 && clean.startsWith('01')) {
      return `+88${clean}`;
    }
    if (clean.length === 13 && clean.startsWith('8801')) {
      return `+${clean}`;
    }
    return phone.startsWith('+') ? phone : `+${phone}`;
  }
  const donorsList = [
    { name: "Wasif 1", phone: "+8801644715617", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 12" },
    { name: "Nahid", phone: "+8801535762492", bloodGroup: "B_POS", district: "Dhaka", address: "ECB" },
    { name: "Shanta", phone: "+8801627408602", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 2" },
    { name: "Wasif", phone: "+8801686843734", bloodGroup: "AB_POS", district: "Dhaka", address: "Malibagh" },
    { name: "Yeasin", phone: "+8801715174580", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 1" },
    { name: "Ashraful", phone: "+8801793102332", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 12" },
    { name: "Maruf", phone: "+8801957337902", bloodGroup: "B_POS", district: "Dhaka", address: "khilgoan / DOHS" },
    { name: "Fahim", phone: "+8801798054408", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Tanvir", phone: "+8801779801955", bloodGroup: "AB_POS", district: "Dhaka", address: "Mipur 2" },
    { name: "Mutasim Billah", phone: "+8801752514198", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur 11" },
    { name: "Swapnil Fatima", phone: "+8801735206405", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Samia", phone: "+8801992610186", bloodGroup: "O_POS", district: "Dhaka", address: "Motijhil" },
    { name: "Nayeemul Islam", phone: "+8801992015755", bloodGroup: "A_POS", district: "Dhaka", address: "Matikata" },
    { name: "Md Tanzil Hossain", phone: "+8801763333606", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Yousuf Baki", phone: "+8801738353456", bloodGroup: "A_POS", district: "Dhaka", address: "Manikdee" },
    { name: "Maruf Ul Islam", phone: "+8801644420999", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Shahniar Sijam", phone: "+8801621278030", bloodGroup: "O_POS", district: "Dhaka", address: "Kafrul" },
    { name: "Adil kabir", phone: "+8801760393179", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Mashiat Lamisa\n        Kangkhita", phone: "+8801641726354", bloodGroup: "O_POS", district: "Dhaka", address: "Mohammodpur" },
    { name: "Marzia Tabassum", phone: "+8801716222590", bloodGroup: "A_POS", district: "Dhaka", address: "Malibagh" },
    { name: "Elma Rahman", phone: "+8801842999793", bloodGroup: "A_POS", district: "Dhaka", address: "B+" },
    { name: "Shailpika Chakma", phone: "+8801878962105", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Zahid Hasan", phone: "+8801706572462", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 1" },
    { name: "Alvi Ahmed", phone: "+8801771326202", bloodGroup: "O_NEG", district: "Dhaka", address: "" },
    { name: "Asif Anis", phone: "+8801531565760", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Al-amin Islam", phone: "+8801676571894", bloodGroup: "O_POS", district: "Dhaka", address: "House-63,\n        Block-E,Mirpur,Kalshi" },
    { name: "Muhammad Rakibul Islam", phone: "+8801789600010", bloodGroup: "O_NEG", district: "Dhaka", address: "" },
    { name: "Shafquat Sakib", phone: "+8801745426688", bloodGroup: "A_POS", district: "Dhaka", address: "Balughat ECB" },
    { name: "Jannatul naima", phone: "+8801754759918", bloodGroup: "O_NEG", district: "Dhaka", address: "" },
    { name: "Sazzad Ahmed", phone: "+8801685364942", bloodGroup: "A_POS", district: "Dhaka", address: "Gazipur" },
    { name: "Md. Fahim Reza", phone: "+8801521412411", bloodGroup: "B_POS", district: "Dhaka", address: "House no.1331 road 13 avenue 2A, Mirpur DOHS, Dhaka" },
    { name: "Khaled Hasam", phone: "+8801521570153", bloodGroup: "AB_POS", district: "Dhaka", address: "36/1, Hazi villa, Road 10, Garrison, Cantonment" },
    { name: "Fakruddin Ahmed", phone: "+8801684449773", bloodGroup: "B_POS", district: "Dhaka", address: "Mohammadpur" },
    { name: "Nafis Kazi", phone: "+8801715828792", bloodGroup: "A_POS", district: "Dhaka", address: "mohammadpur" },
    { name: "Nanjiba Musa", phone: "+8801628014254", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur, DOHS" },
    { name: "S.M. Farhan", phone: "+8801779211947", bloodGroup: "A_POS", district: "Dhaka", address: "Sayedabad and Mirpur 2" },
    { name: "Imam Hossain", phone: "+880176593304", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 11" },
    { name: "Shama Sarker Mou", phone: "+8801830793933", bloodGroup: "B_POS", district: "Dhaka", address: "Shajadpur,Gulsha-2, House no#87A" },
    { name: "Ragib Mehfuz", phone: "+8801302845511", bloodGroup: "A_POS", district: "Dhaka", address: "Bonosree,\n        rampura House#24, Block-B" },
    { name: "Arafat Hossain Saykot", phone: "+8801611177342", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur DOHS, House#209" },
    { name: "Abdullah Hill Mahmud\n        nayeem", phone: "+8801931487995", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Eftekhar Azam", phone: "+8801798896643", bloodGroup: "O_POS", district: "Dhaka", address: "kazipara, Mirpur" },
    { name: "Sumaya Iminreya", phone: "+8801911923645", bloodGroup: "B_POS", district: "Dhaka", address: "Pollobi, Mirpur-11.5" },
    { name: "Rabiul Islam Rahat", phone: "+8801788077770", bloodGroup: "O_POS", district: "Dhaka", address: "ECB.chottor" },
    { name: "Himel Ahmed", phone: "+8801749768531", bloodGroup: "B_POS", district: "Dhaka", address: "mirpur ,dohs" },
    { name: "Mehedi Hasan Santo", phone: "+8801631991707", bloodGroup: "B_POS", district: "Dhaka", address: "mirpur,dohs" },
    { name: "tazrin rahman", phone: "+8801776063369", bloodGroup: "A_POS", district: "Dhaka", address: "mirpur ,dohs" },
    { name: "MD Fahim Shakil", phone: "+8801521432034", bloodGroup: "O_POS", district: "Dhaka", address: "cantonment, mirpur" },
    { name: "Samiul Rahman Fahim", phone: "+8801630324122", bloodGroup: "B_POS", district: "Dhaka", address: "MIRPUR, dohs" },
    { name: "Apple Mahmud", phone: "+8801793031718", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur,Dohs" },
    { name: "Sumaya Iminreya", phone: "+8801785497731", bloodGroup: "B_POS", district: "Dhaka", address: "Mohammadpur Town Hall" },
    { name: "Saraf Wasima", phone: "+8801761650026", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Nowrin Jahan", phone: "+8801974266023", bloodGroup: "B_POS", district: "Dhaka", address: "Uttara" },
    { name: "Nazmus Shakib", phone: "+8801954844699", bloodGroup: "B_POS", district: "Dhaka", address: "Dhaka Cant." },
    { name: "Mehedi Hasan", phone: "+8801727720858", bloodGroup: "AB_POS", district: "Dhaka", address: "Mirpur 12" },
    { name: "Fairoz Sadia Meem", phone: "+8801968776800", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Siam Saykot", phone: "+8801727500638", bloodGroup: "O_POS", district: "Dhaka", address: "Dhaka Cant." },
    { name: "Anik Hasan", phone: "+8801517054554", bloodGroup: "O_POS", district: "Dhaka", address: "Dhanmondi" },
    { name: "Tanzeem Tanisa", phone: "+8801985984233", bloodGroup: "O_POS", district: "Dhaka", address: "Siddeshowri" },
    { name: "MD. Ehteshamul Haq", phone: "+8801718507879", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 10" },
    { name: "Ashraf", phone: "+8801558958555", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur 10" },
    { name: "Moon", phone: "+8801785607296", bloodGroup: "A_POS", district: "Dhaka", address: "Dhaka Cant." },
    { name: "Apala", phone: "+8801637675460", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur 14" },
    { name: "Tamanna", phone: "+8801799033663", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Khalid Hasan", phone: "+8801709325709", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 12" },
    { name: "Rahat", phone: "+8801758303289", bloodGroup: "O_POS", district: "Dhaka", address: "ECB" },
    { name: "Ratul", phone: "+8801940900137", bloodGroup: "AB_NEG", district: "Dhaka", address: "Nirjhor" },
    { name: "Rimjhim", phone: "+8801754126690", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Dweep", phone: "+8801701037564", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 11" },
    { name: "Haseeb", phone: "+8801521258425", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 14" },
    { name: "Unknown", phone: "+8801648141011", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur Dohs" },
    { name: "Samiul Islam", phone: "+8801515219286", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpu 10" },
    { name: "Md Rafiad Islam", phone: "+8801684810001", bloodGroup: "O_NEG", district: "Dhaka", address: "" },
    { name: "Muid Yasin", phone: "+8801521527972", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur Dohs" },
    { name: "Sazzad Hossain", phone: "+8801757774050", bloodGroup: "O_POS", district: "Dhaka", address: "Dhanmondi" },
    { name: "Raihan Khan", phone: "+8801718403290", bloodGroup: "B_POS", district: "Dhaka", address: "Nakhal para" },
    { name: "Unknown", phone: "+8801768379598", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur Dohs" },
    { name: "Nazmul", phone: "+8801778685804", bloodGroup: "AB_POS", district: "Dhaka", address: "Dhaka Cant." },
    { name: "Nasim mohammad", phone: "+8801788569455", bloodGroup: "B_POS", district: "Dhaka", address: "Ibrahimpur" },
    { name: "Aklas Chamak", phone: "+8801679527973", bloodGroup: "AB_POS", district: "Dhaka", address: "Uttora" },
    { name: "Debanik Chakrabarti", phone: "+8801622097892", bloodGroup: "O_POS", district: "Dhaka", address: "Farmgate" },
    { name: "Zarif Tazwar", phone: "+8801858412782", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "AL Nahian Nomaan", phone: "+8801533216304", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur 1" },
    { name: "Syeda Sarjut Mehreen", phone: "+8801762172314", bloodGroup: "O_POS", district: "Dhaka", address: "Uttara" },
    { name: "Raidah Rehma", phone: "+8801821754021", bloodGroup: "O_POS", district: "Dhaka", address: "Banani" },
    { name: "Mehedi Hasan Zishan", phone: "+8801622064345", bloodGroup: "AB_POS", district: "Dhaka", address: "444/1, Nakhalpara." },
    { name: "Nazia Naoshin", phone: "+8801788707464", bloodGroup: "B_POS", district: "Dhaka", address: "259/1, West Nakhalpara" },
    { name: "Hasib", phone: "+8801521258424", bloodGroup: "B_POS", district: "Dhaka", address: "mirpur 14" },
    { name: "Souman Guha", phone: "+8801795549154", bloodGroup: "B_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "Muid yasin", phone: "+8801521327972", bloodGroup: "A_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "nazmul hossain pappu", phone: "+8801775986219", bloodGroup: "O_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "asaduzzaman shohag", phone: "+8801797354240", bloodGroup: "AB_NEG", district: "Dhaka", address: "mirpur DOHS" },
    { name: "faria marium", phone: "+8801632316622", bloodGroup: "O_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "nuzhat islam", phone: "+8801796553556", bloodGroup: "O_POS", district: "Dhaka", address: "mirpur 11" },
    { name: "akhi akter", phone: "+8801742807771", bloodGroup: "A_POS", district: "Dhaka", address: "purbachal" },
    { name: "fariba nusrat", phone: "+8801712158680", bloodGroup: "AB_POS", district: "Dhaka", address: "Kallayanpur" },
    { name: "farzana haque", phone: "+8801757763821", bloodGroup: "A_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "shanto", phone: "+8801726114776", bloodGroup: "B_POS", district: "Dhaka", address: "mirpur 12" },
    { name: "nazmul", phone: "+8801735040891", bloodGroup: "O_POS", district: "Dhaka", address: "mirpur 12" },
    { name: "tomo", phone: "+8801955587711", bloodGroup: "O_POS", district: "Dhaka", address: "mirpur 12" },
    { name: "ifty", phone: "+8801689147547", bloodGroup: "A_POS", district: "Dhaka", address: "Dhanmondi 27" },
    { name: "Abu yusuf", phone: "+8801517829091", bloodGroup: "A_POS", district: "Dhaka", address: "mirpur DOHS" },
    { name: "kamrul hasan", phone: "+8801718036716", bloodGroup: "B_POS", district: "Dhaka", address: "Savar" },
    { name: "Rakin jaman", phone: "+8801797052333", bloodGroup: "O_POS", district: "Dhaka", address: "Nikunja" },
    { name: "halima", phone: "+8801796615205", bloodGroup: "AB_POS", district: "Dhaka", address: "Uttara" },
    { name: "farhin", phone: "+8801879837657", bloodGroup: "AB_POS", district: "Dhaka", address: "Mirpur" },
    { name: "tarif", phone: "+8801714075566", bloodGroup: "O_POS", district: "Dhaka", address: "Dhanmondi" },
    { name: "Shahid Al Mubin", phone: "+8801770767217", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur" },
    { name: "Sumaya Iminreya", phone: "+8801980234779", bloodGroup: "B_POS", district: "Dhaka", address: "Farmgate" },
    { name: "Sumaya Iminreya", phone: "+8801621335041", bloodGroup: "B_POS", district: "Dhaka", address: "Whole Dhaka" },
    { name: "Zaima Jahan srabony", phone: "+8801776227360", bloodGroup: "B_NEG", district: "Dhaka", address: "Mirpur,Kazipara,\n        Shawrapara" },
    { name: "Mehzabin", phone: "+8801535489896", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur" },
    { name: "Afeea", phone: "+8801989298865", bloodGroup: "B_POS", district: "Dhaka", address: "Dhaka Cantonment and\n        nearby" },
    { name: "Israt Sultana", phone: "+8801521100407", bloodGroup: "O_POS", district: "Dhaka", address: "Dhaka Cantonment" },
    { name: "Tasfia Fairooz\n        Binte Tarique", phone: "+8801911781418", bloodGroup: "AB_POS", district: "Dhaka", address: "Uttara" },
    { name: "Rahul Kumar Nath", phone: "+8801521109038", bloodGroup: "B_POS", district: "Dhaka", address: "Rampura" },
    { name: "Kazi Jannatul\n        Ferdous Nadim", phone: "+8801676033095", bloodGroup: "O_POS", district: "Dhaka", address: "Khilgaon" },
    { name: "Tuhin Shinkh", phone: "+8801868711164", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur-1" },
    { name: "Farhana Yeasmin", phone: "+8801796138009", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Rakib-Al-Olib", phone: "+8801705941432", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 12" },
    { name: "Miyad", phone: "+8801741190566", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 2" },
    { name: "Nishad", phone: "+8801521330361", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur Dohs, Road-13" },
    { name: "Priom Roy", phone: "+8801843870242", bloodGroup: "O_POS", district: "Dhaka", address: "Khilgaon\n        chowdhurypara, matir masjid" },
    { name: "Ehsan", phone: "+8801625465647", bloodGroup: "A_POS", district: "Dhaka", address: "Genda, savar , dhaka" },
    { name: "Mustakim Ibna\n        Qaushar Shochso", phone: "+8801737107271", bloodGroup: "AB_POS", district: "Dhaka", address: "Mirpur DOHS,\n        Avenue-2, Road-15" },
    { name: "MD. Moshabbirul Islam", phone: "+8801533607041", bloodGroup: "B_POS", district: "Dhaka", address: "Barontake" },
    { name: "Smaran", phone: "+8801677477081", bloodGroup: "O_POS", district: "Dhaka", address: "Pallabi,Mirpur,Dhaka" },
    { name: "Md. Arif Jawad Fahim", phone: "+8801553484898", bloodGroup: "A_POS", district: "Dhaka", address: "Adabor" },
    { name: "Rafia Iqbal Mithila", phone: "+8801619121319", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Umme Rubaiya Juthi", phone: "+8801961968277", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Md. Raihan Habib", phone: "+8801819151614", bloodGroup: "A_POS", district: "Dhaka", address: "Extension\n        Pallabi,Mirpur 11.5,Dhaka" },
    { name: "Jahid", phone: "+8801713521174", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Zakir", phone: "+8801721010509", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Sarwar Jahan Prince", phone: "+8801819855040", bloodGroup: "B_NEG", district: "Dhaka", address: "Uttura" },
    { name: "Tanassum Tanzil Suchi", phone: "+8801614000774", bloodGroup: "B_NEG", district: "Dhaka", address: "Uttura, Dhaka" },
    { name: "Rupuka a", phone: "+8801822994925", bloodGroup: "B_NEG", district: "Dhaka", address: "Unknown" },
    { name: "MOhammad Rahul", phone: "+8801671766329", bloodGroup: "B_NEG", district: "Dhaka", address: "Kallyanpur,Dhaka" },
    { name: "Habib Tushar", phone: "+8801723270161", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Sushil Adhikary", phone: "+8801712505596", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Arhman", phone: "+8801683030541", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Aupu Das Gupto", phone: "+8801912849011", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Dipok Ray", phone: "+8801710986199", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Dipok Ray", phone: "+8801911677033", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Ibrahim Khalil", phone: "+8801622840746", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "KAzi Mohi Uddin", phone: "+8801929020403", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Khandhkar Kamrul Hassan", phone: "+8801678007440", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Khandhkar Kamrul Hassan", phone: "+8801911673109", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "M.H.Islam Hamid", phone: "+8801818413272", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Aminul Islam Belal", phone: "+8801197152636", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Hasan Maruf", phone: "+8801554338266", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Hasan Maruf", phone: "+8801979995533", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Madusur Rahman", phone: "+8801670414565", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Omur Faruk", phone: "+8801717616483", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD.Lutufl Alam (Jim)", phone: "+8801704077929", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Saiful Islma Khan", phone: "+8801811454043", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Mohammad\n        Mofassurel Islam (Pavel)", phone: "+8801912810617", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Mohammad\n        Mofassurel Islam (Pavel)", phone: "+8801716124908", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "N.H Ridoy", phone: "+8801683739128", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "N.H Ridoy", phone: "+8801675576936", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "S.M.Hashibul Islam", phone: "+8801712949410", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Sagar", phone: "+8801673603896", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Sagar", phone: "+8801961501410", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Tanvir Hussain", phone: "+8801677681114", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Tofayal Ahmed", phone: "+8801920799928", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD. Shadhin Masud", phone: "+8801747751734", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "RImu SUltana", phone: "+8801680394978", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka, Mirpur" },
    { name: "Fahad", phone: "+8801911462457", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "MD.Ysuuf", phone: "+8801819132727", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Maidul Islam", phone: "+8801815314251", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Mamun", phone: "+8801722069310", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka,Mogbazar\n        Wireless." },
    { name: "Sarwar", phone: "+8801935004660", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Rashed Hassan", phone: "+8801674338400", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Sohel Khan", phone: "+8801675202775", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Madhu Mangal Samaddar", phone: "+8801714935753", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Md. Mokhlessur\n        Rahman Mafuz", phone: "+8801777444056", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Md.Mamun Hossaain Khan", phone: "+8801709655288", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "AKM Beyeid", phone: "+8801712371306", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Minshuk Minn", phone: "+8801796777241", bloodGroup: "B_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Minar", phone: "+8801618400022", bloodGroup: "B_POS", district: "Dhaka", address: "1355 East,\n        Sherwapara, Mirpur, Dhaka" },
    { name: "Rafsan", phone: "+8801971309590", bloodGroup: "B_NEG", district: "Dhaka", address: "354, Diluroad, New\n        Eskaton" },
    { name: "Sumaya Iminreya", phone: "+8801715023947", bloodGroup: "B_POS", district: "Dhaka", address: "New Market\n        City Complex, Dhaka,1205" },
    { name: "Soaib", phone: "+8801778745471", bloodGroup: "B_POS", district: "Dhaka", address: "Kafrul, Dhaka" },
    { name: "Tuhim", phone: "+8801521428803", bloodGroup: "A_POS", district: "Dhaka", address: "Dhanmondi\n        (Jigatola), Dhaka" },
    { name: "Masaba", phone: "+8801922299755", bloodGroup: "O_NEG", district: "Dhaka", address: "" },
    { name: "Dipu", phone: "+8801622206442", bloodGroup: "A_POS", district: "Dhaka", address: "Uttara (6 no.), Dhaka" },
    { name: "Dipu", phone: "+8801788407994", bloodGroup: "A_POS", district: "Dhaka", address: "Uttara (6 no.), Dhaka" },
    { name: "Intisar", phone: "+880193446906", bloodGroup: "A_POS", district: "Dhaka", address: "DOHS Mirpur, Dhaka" },
    { name: "Rafid", phone: "+8801871189273", bloodGroup: "O_POS", district: "Dhaka", address: "Mirpur 13,Dhaka" },
    { name: "Sayed", phone: "+8801521210979", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur 12,Dhaka" },
    { name: "Nowajosh", phone: "+8801701039191", bloodGroup: "A_POS", district: "Dhaka", address: "Maniknagor,\n        Jatrabari, Dhaka" },
    { name: "Apurba", phone: "+8801521435597", bloodGroup: "B_POS", district: "Dhaka", address: "Naranyangonj, Dhaka" },
    { name: "Nahiduzzaman Nisho", phone: "+8801703838138", bloodGroup: "O_POS", district: "Dhaka", address: "Nikunja,\n        khilkhet, Dhaka-1229" },
    { name: "Noboni", phone: "+8801701703732", bloodGroup: "B_POS", district: "Dhaka", address: "Rajendrapur\n        cantonment gazipur" },
    { name: "Nusrat Sharmin\n        Khadiza (Teacher)", phone: "+8801769028508", bloodGroup: "A_POS", district: "Dhaka", address: "Mirpur DOHS" },
    { name: "Jashim", phone: "+8801917842261", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Al Amin", phone: "+8801913909168", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Eng. Tajul Islam", phone: "+8801813936561", bloodGroup: "AB_NEG", district: "Dhaka", address: "Rampura" },
    { name: "Kaimul Islam", phone: "+8801830123617", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Kawsar Mahmud", phone: "+8801926264906", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Bappi", phone: "+8801710347502", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Azizul Islam", phone: "+8801676317357", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Hafizur Rahman", phone: "+8801670411137", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Mutafizur Rahman", phone: "+8801722970383", bloodGroup: "AB_NEG", district: "Dhaka", address: "Banasree" },
    { name: "Shahidul Islam", phone: "+8801918109098", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Wahidul Haque", phone: "+8801716611075", bloodGroup: "AB_NEG", district: "Dhaka", address: "Gazipur" },
    { name: "Mahmudur Rahman", phone: "+8801717014761", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Rifat Hossain", phone: "+8801685332733", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Shameem Anwar Saadat", phone: "+8801711541201", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Tarun Islam", phone: "+8801911212966", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Iqbaal", phone: "+8801552373506", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Ashraful", phone: "+8801711563356", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Tazul Islam", phone: "+8801915969809", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Tanveer", phone: "+8801620759827", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Jishaad Rana", phone: "+8801687767102", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Prosenjeet", phone: "+8801925323616", bloodGroup: "AB_NEG", district: "Dhaka", address: "Khulna" },
    { name: "Sameer Sarkar", phone: "+8801676798898", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Ashraful Islam", phone: "+8801911088640", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Soheel Sonet", phone: "+8801860363686", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Rasel Qureshi", phone: "+8801711484380", bloodGroup: "AB_NEG", district: "Dhaka", address: "Dhaka" },
    { name: "Towhed Rahman", phone: "+8801920910091", bloodGroup: "AB_NEG", district: "Dhaka", address: "Mogbazar, Dhaka" },
    { name: "Riyad", phone: "+8801988843774", bloodGroup: "AB_NEG", district: "Dhaka", address: "Lalbag, Dhaka" },
    { name: "Alif Reza", phone: "+8801744259918", bloodGroup: "AB_NEG", district: "Dhaka", address: "Pabna" },
    { name: "Arman", phone: "+8801839109445", bloodGroup: "AB_NEG", district: "Dhaka", address: "Chittagong" },
    { name: "অসীম ভৌমিক", phone: "+8801712604537", bloodGroup: "AB_NEG", district: "Dhaka", address: "Chittagong" },
    { name: "আজাদ রহমান", phone: "+8801771098615", bloodGroup: "AB_NEG", district: "Dhaka", address: "হবিগঞ্জ" },
    { name: "ফজলুর রহমান", phone: "+8801711194285", bloodGroup: "AB_NEG", district: "Dhaka", address: "Chittagong" },
    { name: "ইমতিয়াজ লিজন", phone: "+8801750024678", bloodGroup: "AB_NEG", district: "Dhaka", address: "Khulna" },
    { name: "কুতুব উদ্দিন চিশতী", phone: "+8801921985060", bloodGroup: "AB_NEG", district: "Dhaka", address: "Bramonbaria" },
    { name: "রাকিব হোসেন", phone: "+8801756845968", bloodGroup: "AB_NEG", district: "Dhaka", address: "লক্ষিপুর" },
    { name: "শহীদ", phone: "+8801712357119", bloodGroup: "AB_NEG", district: "Dhaka", address: "সিলেট" },
    { name: "মাসুম বিল্লাহ", phone: "+8801737066845", bloodGroup: "AB_NEG", district: "Dhaka", address: "গাইবান্ধা" },
    { name: "গোলাম তৌহিদ", phone: "+8801736473685", bloodGroup: "AB_NEG", district: "Dhaka", address: "রাজশাহী" },
    { name: "Shahriar Kabir Alif", phone: "+8801732304468", bloodGroup: "AB_POS", district: "Dhaka", address: "Dhanmondi Road 9/A" },
    { name: "Md. Zobair Rahman", phone: "+8801521430791", bloodGroup: "B_POS", district: "Dhaka", address: "BAF Base\n        BBD, Dhaka Cantt, Dhaka-1206" },
    { name: "Sami-ul Bari", phone: "+8801521326263", bloodGroup: "B_POS", district: "Dhaka", address: "House &#8211; 136, Road &#8211; 2, Block &#8211; A, Mirpur 12, Dhaka-1216" },
    { name: "Md. Shaikhul Islam\n        Shakil", phone: "+8801679275825", bloodGroup: "A_POS", district: "Dhaka", address: "161/3,Zia\n        Colony, Dhaka Cantonment." },
    { name: "S M Afif Hasan", phone: "+8801953205524", bloodGroup: "B_POS", district: "Dhaka", address: "Kafrul, dhaka\n        cantonment" },
    { name: "Nihal Shahria Eid", phone: "+8801646767354", bloodGroup: "O_POS", district: "Dhaka", address: "Akhalia Shurma, Sylhet" },
    { name: "Fahema Khanam Shefa", phone: "+8801623923217", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur-14,Dhaka-1206" },
    { name: "Sadik Ahamed Sami", phone: "+8801720424969", bloodGroup: "O_POS", district: "Dhaka", address: "Uttara" },
    { name: "Rakibul Hasan", phone: "+8801746668451", bloodGroup: "B_POS", district: "Dhaka", address: "Savar, Dhaka" },
    { name: "Nafisa Mosaddek", phone: "+8801312040317", bloodGroup: "O_POS", district: "Dhaka", address: "Dhanmondi, Mohammadpur" },
    { name: "Rukaiya Mustafa", phone: "+8801729098393", bloodGroup: "O_POS", district: "Dhaka", address: "Dhanmondi, Lalmatia" },
    { name: "Rahmee Mustafa", phone: "+8801321124044", bloodGroup: "A_POS", district: "Dhaka", address: "Dhanmondi, Lalmatia" },
    { name: "Ariza Mumtihan", phone: "+8801821444666", bloodGroup: "A_POS", district: "Dhaka", address: "Banani" },
    { name: "NAYIM", phone: "+8801766110039", bloodGroup: "A_NEG", district: "Dhaka", address: "Shaheenbag" },
    { name: "Mostaq Ahmed", phone: "+8801972583865", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur, Dhanmondi, Mohammadpur" },
    { name: "Tasfia tahsin esha", phone: "+8801871448195", bloodGroup: "A_POS", district: "Dhaka", address: "Gulshan, Badda, Banani, Link road, Dhanmondi, Mohakhali" },
    { name: "Fardin Islam", phone: "+8801521211678", bloodGroup: "B_POS", district: "Dhaka", address: "Rampura, Banasree" },
    { name: "Munira", phone: "+8801631363257", bloodGroup: "B_POS", district: "Dhaka", address: "Mirpur" }
  ];

  console.log(`Seeding ${donorsList.length} donors to ${orgName}...`);

  for (const donor of donorsList) {
    try {
      const normalizedPhone = normalizePhone(donor.phone);
      
      // Upsert User
      const user = await prisma.user.upsert({
        where: { phone: normalizedPhone },
        update: {
          email: `${normalizedPhone.replace('+', '')}@roktolagbe.com`,
          isActive: true,
          isVerified: true
        },
        create: {
          email: `${normalizedPhone.replace('+', '')}@roktolagbe.com`,
          phone: normalizedPhone,
          passwordHash,
          role: Role.DONOR,
          isVerified: true,
          isActive: true
        }
      });

      // Infer thana from address for Dhaka donors
      function inferThana(addr: string): string | undefined {
        const a = addr.toLowerCase();
        if (a.includes('mirpur')) return 'Mirpur';
        if (a.includes('dhanmondi')) return 'Dhanmondi';
        if (a.includes('mohammadpur') || a.includes('mohammodpur')) return 'Mohammadpur';
        if (a.includes('uttara')) return 'Uttara';
        if (a.includes('gulshan')) return 'Gulshan';
        if (a.includes('banani')) return 'Gulshan';
        if (a.includes('khilgaon') || a.includes('khilgoan')) return 'Khilgaon';
        if (a.includes('motijheel') || a.includes('motijhil')) return 'Motijheel';
        if (a.includes('rampura') || a.includes('banasree')) return 'Sabujbag';
        if (a.includes('farmgate') || a.includes('tejgaon')) return 'Tejgaon';
        if (a.includes('cantonment') || a.includes('cantt') || a.includes('ecb')) return 'Dhaka Cantt.';
        if (a.includes('savar')) return 'Savar';
        return undefined;
      }

      // Upsert DonorProfile
      const profile = await prisma.donorProfile.upsert({
        where: { userId: user.id },
        update: {
          name: donor.name,
          bloodGroup: donor.bloodGroup as BloodGroup,
          division: 'Dhaka',
          district: donor.district,
          thana: inferThana(donor.address),
          address: donor.address,
          isAvailable: true
        },
        create: {
          userId: user.id,
          name: donor.name,
          bloodGroup: donor.bloodGroup as BloodGroup,
          division: 'Dhaka',
          district: donor.district,
          thana: inferThana(donor.address),
          address: donor.address,
          isAvailable: true,
          totalDonations: Math.floor(Math.random() * 5),
          points: 0
        }
      });

      // Ensure Organization Membership
      await prisma.orgMember.upsert({
        where: {
          managerId_donorId: {
            managerId: orgId,
            donorId: profile.id
          }
        },
        update: {},
        create: {
          managerId: orgId,
          donorId: profile.id
        }
      });

    } catch (e: any) {
      console.error(`Failed to seed donor ${donor.phone}: `, e.message);
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
