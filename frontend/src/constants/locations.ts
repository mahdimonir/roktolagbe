// Bangladesh Location Hierarchy: Division -> District -> Thana[]
// Derived from the Bangladesh Post Office dataset (~1371 entries, deduplicated at Thana level)

export const LOCATIONS: Record<string, Record<string, string[]>> = {
  Dhaka: {
    Dhaka: ["Demra","Dhaka Cantt.","Dhamrai","Dhanmondi","Gulshan","Jatrabari","Joypara","Keraniganj","Khilgaon","Khilkhet","Lalbag","Mirpur","Mohammadpur","Motijheel","Nawabganj","New Market","Palton","Ramna","Sabujbag","Savar","Sutrapur","Tejgaon","Tejgaon Industrial Area","Uttara"],
    Faridpur: ["Alfadanga","Bhanga","Boalmari","Charbhadrasan","Faridpur Sadar","Madukhali","Nagarkanda","Sadarpur","Shriangan"],
    Gazipur: ["Gazipur Sadar","Kaliakaar","Kaliganj","Kapashia","Monnunagar","Sreepur","Sripur"],
    Gopalganj: ["Gopalganj Sadar","Kashiani","Kotalipara","Maksudpur","Tungipara"],
    Jamalpur: ["Dewangonj","Islampur","Jamalpur","Malandah","Mathargonj","Shorishabari"],
    Kishoreganj: ["Bajitpur","Bhairob","Hossenpur","Itna","Karimganj","Katiadi","Kishoreganj Sadar","Kuliarchar","Mithamoin","Nikli","Ostagram","Pakundia","Tarial"],
    Madaripur: ["Barhamganj","Kalkini","Madaripur Sadar","Rajoir"],
    Manikganj: ["Doulatpur","Gheor","Lechhraganj","Manikganj Sadar","Saturia","Shibloya","Singair"],
    Munshiganj: ["Gajaria","Lohajong","Munshiganj Sadar","Sirajdikhan","Srinagar","Tangibari"],
    Mymensingh: ["Bhaluka","Fulbaria","Gaforgaon","Gouripur","Haluaghat","Isshwargonj","Muktagachha","Mymensingh Sadar","Nandail","Phulpur","Trishal"],
    Narayanganj: ["Araihazar","Baidder Bazar","Bandar","Fatullah","Narayanganj Sadar","Rupganj","Siddirganj"],
    Narshingdi: ["Belabo","Monohordi","Narshingdi Sadar","Palash","Raypura","Shibpur"],
    Netrakona: ["Atpara","Barhatta","Dharmapasha","Dhobaura","Kalmakanda","Kendua","Khaliajuri","Madan","Moddhynagar","Mohanganj","Netrakona Sadar","Purbadhola","Susung Durgapur"],
    Rajbari: ["Baliakandi","Pangsha","Rajbari Sadar"],
    Shariatpur: ["Bhedorganj","Damudhya","Gosairhat","Jajira","Naria","Shariatpur Sadar"],
    Sherpur: ["Bakshigonj","Jhinaigati","Nakla","Nalitabari","Sherpur Sadar","Shribardi"],
    Tangail: ["Basail","Bhuapur","Delduar","Ghatail","Gopalpur","Kalihati","Kashkaolia","Madhupur","Mirzapur","Nagarpur","Sakhipur","Tangail Sadar"],
  },
  Chittagong: {
    Bandarban: ["Alikadam","Bandarban Sadar","Naikhong","Roanchhari","Ruma","Thanchi"],
    Brahmanbaria: ["Akhaura","Banchharampur","Brahmanbaria Sadar","Kasba","Nabinagar","Nasirnagar","Sarail"],
    Chandpur: ["Chandpur Sadar","Faridganj","Hajiganj","Hayemchar","Kachua","Matlobganj","Shahrasti"],
    Chittagong: ["Anawara","Boalkhali","Chittagong Sadar","East Joara","Fatikchhari","Hathazari","Jaldi","Lohagara","Mirsharai","Patia","Rangunia","Rouzan","Sandwip","Satkania","Sitakunda"],
    Comilla: ["Barura","Brahmanpara","Burichang","Chandina","Chouddagram","Comilla Sadar","Daudkandi","Davidhar","Homna","Laksam","Langalkot","Muradnagar"],
    "Cox's Bazar": ["Chiringga","Cox's Bazar Sadar","Gorakghat","Kutubdia","Ramu","Teknaf","Ukhia"],
    Feni: ["Chhagalnaia","Dagonbhuia","Feni Sadar","Pashurampur","Sonagazi"],
    Khagrachari: ["Diginala","Khagrachari Sadar","Laxmichhari","Mahalchhari","Manikchhari","Matiranga","Panchhari","Ramghar"],
    Lakshmipur: ["Char Alexgander","Lakshmipur Sadar","Ramganj","Raypur"],
    Noakhali: ["Basurhat","Begumganj","Chatkhil","Hatiya","Noakhali Sadar","Senbag"],
    Rangamati: ["Barakal","Bilaichhari","Jarachhari","Kalampati","Kaptai","Longachh","Marishya","Naniachhar","Rajsthali","Rangamati Sadar"],
  },
  Khulna: {
    Bagerhat: ["Bagerhat Sadar","Chalna Ankorage","Chitalmari","Fakirhat","Kachua","Mollahat","Morelganj","Rampal","Rayenda"],
    Chuadanga: ["Alamdanga","Chuadanga Sadar","Damurhuda","Doulatganj"],
    Jessore: ["Bagharpara","Chaugachha","Jessore Sadar","Jhikargachha","Keshabpur","Monirampur","Noapara","Sarsa"],
    Jhenaidah: ["Harinakundu","Jhenaidah Sadar","Kotchandpur","Maheshpur","Naldanga","Shailakupa"],
    Khulna: ["Alaipur","Batiaghat","Chalna Bazar","Digalia","Khulna Sadar","Madinabad","Paikgachha","Phultala","Sajiara","Terakhada"],
    Kushtia: ["Bheramara","Janipur","Kumarkhali","Kushtia Sadar","Mirpur","Rafayetpur"],
    Magura: ["Arpara","Magura Sadar","Mohammadpur","Shripur"],
    Meherpur: ["Gangni","Meherpur Sadar"],
    Narail: ["Kalia","Laxmipasha","Mohajan","Narail Sadar"],
    Satkhira: ["Ashashuni","Debbhata","Kalaroa","Kaliganj","Nakipur","Satkhira Sadar","Tala"],
  },
  Rajshahi: {
    Bogra: ["Adamdighi","Bogra Sadar","Dhunat","Dupchachia","Gabtoli","Kahalu","Nandigram","Sariakandi","Sherpur","Shibganj","Sonatola"],
    Chapainawabganj: ["Bholahat","Chapainawabganj Sadar","Nachol","Rohanpur","Shibganj"],
    Joypurhat: ["Akkelpur","Joypurhat Sadar","Kalai","Khetlal","Panchbibi"],
    Naogaon: ["Ahsanganj","Badalgachhi","Dhamuirhat","Mahadebpur","Naogaon Sadar","Niamatpur","Nitpur","Patnitala","Prasadpur","Raninagar","Sapahar"],
    Natore: ["Gopalpur","Harua","Hatgurudaspur","Laxman","Natore Sadar","Singra"],
    Pabna: ["Banwarinagar","Bera","Bhangura","Chatmohar","Debottar","Ishwardi","Pabna Sadar","Sathia","Sujanagar"],
    Rajshahi: ["Bagha","Bhabaniganj","Charghat","Durgapur","Godagari","Khokmohonpur","Lalitganj","Poba","Putia","Rajshahi Sadar","Tanor"],
    Sirajganj: ["Belkuchi","Chauhali","Kamarkhanda","Kazipur","Raiganj","Shahjadpur","Sirajganj Sadar","Tarash","Ullapara"],
  },
  Rangpur: {
    Dinajpur: ["Bangla Hili","Biral","Birampur","Birganj","Chirirbandar","Dinajpur Sadar","Khansama","Maharajganj","Nawabganj","Ghoraghat","Parbatipur","Phulbari","Setabganj"],
    Gaibandha: ["Bonarpara","Gaibandha Sadar","Gobindaganj","Palashbari","Phulchhari","Sadullapur","Sundarganj"],
    Kurigram: ["Bhurungamari","Chilmari","Kurigram Sadar","Nageshwari","Rajarhat","Rajibpur","Roumari","Ulipur"],
    Lalmonirhat: ["Aditmari","Hatibandha","Lalmonirhat Sadar","Patgram","Tushbhandar"],
    Nilphamari: ["Dimla","Domar","Jaldhaka","Kishorganj","Nilphamari Sadar","Saidpur"],
    Panchagarh: ["Boda","Debiganj","Panchagarh Sadar","Atwari","Tetulia"],
    Rangpur: ["Badarganj","Gangachara","Kaunia","Mithapukur","Pirgacha","Rangpur Sadar","Taraganj"],
    Thakurgaon: ["Baliadangi","Haripur","Pirganj","Ranisankail","Thakurgaon Sadar"],
  },
  Sylhet: {
    Habiganj: ["Azmiriganj","Bahubal","Baniachong","Chunarughat","Habiganj Sadar","Lakhai","Madhabpur","Nabiganj"],
    Moulvibazar: ["Baralekha","Kamalganj","Kulaura","Moulvibazar Sadar","Rajnagar","Sreemangal"],
    Sunamganj: ["Bishwamvarpur","Chhatak","Derai","Dharampasha","Dowarabazar","Jagannathpur","Jamalganj","Sullah","Sunamganj Sadar","Tahirpur"],
    Sylhet: ["Balaganj","Beanibazar","Bishwanath","Companiganj","Fenchuganj","Goainghat","Jaintiapur","Zakiganj","Kanaighat","Osmani Nagar","Sylhet Sadar"],
  },
  Barisal: {
    Barguna: ["Amtali","Bamna","Barguna Sadar","Betagi","Patharghata"],
    Barisal: ["Agailjhara","Babuganj","Bakerganj","Barishal Sadar","Bujbala","Gaurnadi","Hizla","Mehendiganj","Muladi","Wazirpur"],
    Bhola: ["Bhola Sadar","Borhanuddin","Char Fasson","Daulatkhan","Lalmohan","Manpura","Tazumuddin"],
    Jhalokathi: ["Jhalokathi Sadar","Kathalia","Nalchity","Rajapur"],
    Patuakhali: ["Bauphal","Dashmina","Galachipa","Kalapara","Mirzaganj","Patuakhali Sadar","Rangabali"],
    Pirojpur: ["Bhandaria","Indurkani","Kawkhali","Mathbaria","Nazirpur","Pirojpur Sadar","Nesarabad"],
  },
};

// Helpers ------------------------------------------------------------------

export const getDivisions = (): string[] => Object.keys(LOCATIONS);

export const getDistricts = (division: string): string[] =>
  division ? Object.keys(LOCATIONS[division] ?? {}) : [];

export const getThanas = (division: string, district: string): string[] =>
  division && district ? LOCATIONS[division]?.[district] ?? [] : [];
