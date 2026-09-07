import { City } from '../types';

export const INDIAN_STATES_WITH_CITIES: Record<string, string[]> = {
  'Andaman and Nicobar Islands': ['Port Blair', 'Havelock Island', 'Diglipur', 'Neil Island'],
  'Andhra Pradesh': ['Visakhapatnam (Vizag)', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Anantapur', 'Kadapa', 'Eluru', 'Vizianagaram', 'Ongole', 'Tenali', 'Proddatur'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Roing', 'Bomdila', 'Tezu'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta'],
  'Bihar': ['Patna', 'Gaya / Bodh Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Bihar Sharif', 'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Motihari', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Bettiah', 'Kishanganj'],
  'Chandigarh': ['Chandigarh', 'Mohali (Tricity)', 'Panchkula (Tricity)'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Dhamtari', 'Mahasamund'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  'Delhi NCR': ['Delhi (Central & South)', 'New Delhi', 'North Delhi', 'East Delhi', 'West Delhi', 'Noida', 'Greater Noida', 'Gurugram (Gurgaon)', 'Faridabad', 'Ghaziabad'],
  'Goa': ['Goa (Panaji, Calangute, Margao)', 'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Calangute', 'Ponda', 'Candolim', 'Porvorim'],
  'Gujarat': ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari', 'Vapi', 'Valsad', 'Bharuch', 'Morbi', 'Bhuj (Kutch)', 'Porbandar', 'Mehsana', 'Surendranagar', 'Godhra', 'Patan', 'Palanpur', 'Veraval', 'Himmatnagar', 'Amreli', 'Botad', 'Dahod', 'Deesa'],
  'Haryana': ['Gurugram (Gurgaon)', 'Faridabad', 'Panipat', 'Karnal', 'Ambala', 'Rohtak', 'Hisar', 'Sonipat', 'Yamunanagar', 'Panchkula', 'Bahadurgarh', 'Kurukshetra', 'Sirsa', 'Bhiwani', 'Rewari', 'Palwal', 'Jind'],
  'Himachal Pradesh': ['Shimla', 'Manali & Kullu', 'Dharamshala', 'Solan', 'Mandi', 'Baddi', 'Palampur', 'Kangra', 'Dalhousie', 'Bilaspur (HP)', 'Hamirpur', 'Nahan', 'Una'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Katra', 'Pahalgam', 'Gulmarg', 'Sopore', 'Kathua', 'Rajouri'],
  'Jharkhand': ['Ranchi', 'Jamshedpur (Tata)', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar (Daltonganj)', 'Chirkunda', 'Phusro'],
  'Karnataka': ['Bengaluru (Bangalore)', 'Mysuru (Mysore)', 'Mangaluru (Mangalore)', 'Hubballi-Dharwad', 'Belagavi (Belgaum)', 'Kalaburagi (Gulbarga)', 'Davanagere', 'Ballari (Bellary)', 'Vijayapura (Bijapur)', 'Shimoga (Shivamogga)', 'Tumakuru (Tumkur)', 'Udupi', 'Hassan', 'Bidar', 'Hospet', 'Gadag', 'Raichur'],
  'Kerala': ['Kochi (Cochin)', 'Thiruvananthapuram (Trivandrum)', 'Kozhikode (Calicut)', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha (Alleppey)', 'Kannur', 'Kottayam', 'Malappuram', 'Manjeri', 'Thalassery', 'Ponnani'],
  'Ladakh': ['Leh & Ladakh', 'Leh', 'Kargil', 'Nubra Valley'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Andrott', 'Minicoy'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli', 'Burhanpur', 'Khandwa', 'Katni', 'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Navi Mumbai', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur', 'Amravati', 'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Nanded', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Panvel', 'Satara', 'Beed', 'Yavatmal'],
  'Manipur': ['Imphal', 'Churachandpur', 'Thoubal', 'Kakching', 'Ukhrul', 'Bishnupur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Cherrapunji (Sohra)', 'Nongpoh', 'Baghmara'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh'],
  'Puducherry': ['Puducherry (Pondicherry)', 'Karaikal', 'Mahe', 'Yanam'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer / Pushkar', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur', 'Pali', 'Sri Ganganagar', 'Jaisalmer', 'Mount Abu', 'Beawar', 'Tonk', 'Hanumangarh', 'Dholpur', 'Sawai Madhopur', 'Churu', 'Chittorgarh'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Ravangla', 'Pelling'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)', 'Salem', 'Tiruppur', 'Erode', 'Tirunelveli', 'Vellore', 'Thoothukudi (Tuticorin)', 'Dindigul', 'Thanjavur', 'Ranipet', 'Kanchipuram', 'Nagercoil', 'Cuddalore', 'Kumbakonam', 'Tiruvannamalai', 'Pudukkottai', 'Hosur', 'Ambur', 'Karaikudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet', 'Miryalaguda', 'Jagtial'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia', 'Khowai', 'Ambassa'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj (Allahabad)', 'Meerut', 'Gorakhpur', 'Noida', 'Greater Noida', 'Ghaziabad', 'Mathura & Vrindavan', 'Ayodhya', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Budaun', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli', 'Orai', 'Sitapur', 'Bahraich'],
  'Uttarakhand': ['Dehradun', 'Haridwar & Rishikesh', 'Roorkee', 'Haldwani', 'Nainital', 'Rudrapur', 'Kashipur', 'Mussoorie', 'Pithoragarh', 'Rishikesh', 'Haridwar', 'Kotdwar', 'Almora'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Darjeeling', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling', 'Alipurduar', 'Purulia']
};

export const ALL_INDIAN_STATES: string[] = Object.keys(INDIAN_STATES_WITH_CITIES).sort();

export const getCitiesByState = (stateName: string): string[] => {
  if (!stateName) return [];
  return INDIAN_STATES_WITH_CITIES[stateName] || [];
};

// Flattened list for the global city modal / map filters
export const ALL_INDIAN_CITIES: City[] = [
  // --- GUJARAT ---
  { id: 'surat', name: 'Surat', state: 'Gujarat', isActive: true, isPopular: true, lat: 21.1702, lng: 72.8311 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', isActive: true, isPopular: true, lat: 23.0225, lng: 72.5714 },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', isActive: true, isPopular: true, lat: 22.3072, lng: 73.1812 },
  { id: 'rajkot', name: 'Rajkot', state: 'Gujarat', isActive: true, isPopular: true, lat: 22.3039, lng: 70.8022 },
  { id: 'bhavnagar', name: 'Bhavnagar', state: 'Gujarat', isActive: true, lat: 21.7645, lng: 72.1519 },
  { id: 'jamnagar', name: 'Jamnagar', state: 'Gujarat', isActive: true, lat: 22.4707, lng: 70.0577 },
  { id: 'gandhinagar', name: 'Gandhinagar', state: 'Gujarat', isActive: true, isPopular: true, lat: 23.2156, lng: 72.6369 },
  { id: 'junagadh', name: 'Junagadh', state: 'Gujarat', isActive: true, lat: 21.5222, lng: 70.4579 },
  { id: 'anand', name: 'Anand', state: 'Gujarat', isActive: true, lat: 22.5645, lng: 72.9289 },
  { id: 'navsari', name: 'Navsari', state: 'Gujarat', isActive: true, lat: 20.9500, lng: 72.9300 },
  { id: 'vapi', name: 'Vapi', state: 'Gujarat', isActive: true, lat: 20.3700, lng: 72.9000 },
  { id: 'valsad', name: 'Valsad', state: 'Gujarat', isActive: true, lat: 20.6100, lng: 72.9300 },
  { id: 'bharuch', name: 'Bharuch', state: 'Gujarat', isActive: true, lat: 21.7051, lng: 72.9959 },
  { id: 'morbi', name: 'Morbi', state: 'Gujarat', isActive: true, lat: 22.8120, lng: 70.8380 },
  { id: 'bhuj', name: 'Bhuj (Kutch)', state: 'Gujarat', isActive: true, lat: 23.2420, lng: 69.6669 },
  { id: 'porbandar', name: 'Porbandar', state: 'Gujarat', isActive: true, lat: 21.6417, lng: 69.6293 },
  { id: 'mehsana', name: 'Mehsana', state: 'Gujarat', isActive: true, lat: 23.5880, lng: 72.3693 },

  // --- MAHARASHTRA ---
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', isActive: true, isPopular: true, lat: 19.0760, lng: 72.8777 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', isActive: true, isPopular: true, lat: 18.5204, lng: 73.8567 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', isActive: true, isPopular: true, lat: 21.1458, lng: 79.0882 },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', isActive: true, isPopular: true, lat: 19.9975, lng: 73.7898 },
  { id: 'thane', name: 'Thane', state: 'Maharashtra', isActive: true, lat: 19.2183, lng: 72.9781 },
  { id: 'navi-mumbai', name: 'Navi Mumbai', state: 'Maharashtra', isActive: true, lat: 19.0330, lng: 73.0297 },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', isActive: true, lat: 19.8762, lng: 75.3433 },
  { id: 'solapur', name: 'Solapur', state: 'Maharashtra', isActive: true, lat: 17.6599, lng: 75.9064 },
  { id: 'kolhapur', name: 'Kolhapur', state: 'Maharashtra', isActive: true, lat: 16.7050, lng: 74.2433 },
  { id: 'amravati', name: 'Amravati', state: 'Maharashtra', isActive: true, lat: 20.9320, lng: 77.7523 },
  { id: 'sangli', name: 'Sangli', state: 'Maharashtra', isActive: true, lat: 16.8524, lng: 74.5815 },
  { id: 'jalgaon', name: 'Jalgaon', state: 'Maharashtra', isActive: true, lat: 21.0077, lng: 75.5626 },
  { id: 'latur', name: 'Latur', state: 'Maharashtra', isActive: true, lat: 18.4088, lng: 76.5604 },

  // --- DELHI NCR ---
  { id: 'delhi', name: 'Delhi (Central & South)', state: 'Delhi NCR', isActive: true, isPopular: true, lat: 28.6139, lng: 77.2090 },
  { id: 'new-delhi', name: 'New Delhi', state: 'Delhi NCR', isActive: true, isPopular: true, lat: 28.6139, lng: 77.2090 },
  { id: 'noida', name: 'Noida', state: 'Delhi NCR', isActive: true, isPopular: true, lat: 28.5355, lng: 77.3910 },
  { id: 'greater-noida', name: 'Greater Noida', state: 'Delhi NCR', isActive: true, lat: 28.4744, lng: 77.5040 },
  { id: 'gurugram', name: 'Gurugram (Gurgaon)', state: 'Delhi NCR', isActive: true, isPopular: true, lat: 28.4595, lng: 77.0266 },
  { id: 'faridabad', name: 'Faridabad', state: 'Delhi NCR', isActive: true, lat: 28.4089, lng: 77.3178 },
  { id: 'ghaziabad', name: 'Ghaziabad', state: 'Delhi NCR', isActive: true, lat: 28.6692, lng: 77.4538 },

  // --- KARNATAKA ---
  { id: 'bangalore', name: 'Bengaluru (Bangalore)', state: 'Karnataka', isActive: true, isPopular: true, lat: 12.9716, lng: 77.5946 },
  { id: 'mysuru', name: 'Mysuru (Mysore)', state: 'Karnataka', isActive: true, isPopular: true, lat: 12.2958, lng: 76.6394 },
  { id: 'mangalore', name: 'Mangaluru (Mangalore)', state: 'Karnataka', isActive: true, lat: 12.9141, lng: 74.8560 },
  { id: 'hubli', name: 'Hubballi-Dharwad', state: 'Karnataka', isActive: true, lat: 15.3647, lng: 75.1240 },
  { id: 'belagavi', name: 'Belagavi (Belgaum)', state: 'Karnataka', isActive: true, lat: 15.8497, lng: 74.4977 },
  { id: 'udupi', name: 'Udupi', state: 'Karnataka', isActive: true, lat: 13.3409, lng: 74.7421 },

  // --- RAJASTHAN ---
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', isActive: true, isPopular: true, lat: 26.9124, lng: 75.7873 },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', isActive: true, isPopular: true, lat: 24.5854, lng: 73.7125 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', isActive: true, isPopular: true, lat: 26.2389, lng: 73.0243 },
  { id: 'kota', name: 'Kota', state: 'Rajasthan', isActive: true, lat: 25.2138, lng: 75.8648 },
  { id: 'bikaner', name: 'Bikaner', state: 'Rajasthan', isActive: true, lat: 28.0229, lng: 73.3119 },
  { id: 'ajmer', name: 'Ajmer / Pushkar', state: 'Rajasthan', isActive: true, lat: 26.4499, lng: 74.6399 },
  { id: 'jaisalmer', name: 'Jaisalmer', state: 'Rajasthan', isActive: true, isPopular: true, lat: 26.9157, lng: 70.9083 },
  { id: 'mount-abu', name: 'Mount Abu', state: 'Rajasthan', isActive: true, lat: 24.5926, lng: 72.7156 },

  // --- TELANGANA & ANDHRA PRADESH ---
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', isActive: true, isPopular: true, lat: 17.3850, lng: 78.4867 },
  { id: 'warangal', name: 'Warangal', state: 'Telangana', isActive: true, lat: 17.9689, lng: 79.5941 },
  { id: 'visakhapatnam', name: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', isActive: true, isPopular: true, lat: 17.6868, lng: 83.2185 },
  { id: 'vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', isActive: true, isPopular: true, lat: 16.5062, lng: 80.6480 },
  { id: 'guntur', name: 'Guntur', state: 'Andhra Pradesh', isActive: true, lat: 16.3067, lng: 80.4365 },
  { id: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh', isActive: true, isPopular: true, lat: 13.6288, lng: 79.4192 },

  // --- TAMIL NADU & PUDUCHERRY ---
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', isActive: true, isPopular: true, lat: 13.0827, lng: 80.2707 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', isActive: true, isPopular: true, lat: 11.0168, lng: 76.9558 },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', isActive: true, lat: 9.9252, lng: 78.1198 },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', isActive: true, lat: 10.7905, lng: 78.7047 },
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu', isActive: true, lat: 11.6643, lng: 78.1460 },
  { id: 'pondicherry', name: 'Puducherry (Pondicherry)', state: 'Puducherry', isActive: true, isPopular: true, lat: 11.9416, lng: 79.8083 },

  // --- WEST BENGAL ---
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', isActive: true, isPopular: true, lat: 22.5726, lng: 88.3639 },
  { id: 'howrah', name: 'Howrah', state: 'West Bengal', isActive: true, lat: 22.5958, lng: 88.2636 },
  { id: 'siliguri', name: 'Siliguri', state: 'West Bengal', isActive: true, lat: 26.7271, lng: 88.3953 },
  { id: 'durgapur', name: 'Durgapur', state: 'West Bengal', isActive: true, lat: 23.5204, lng: 87.3119 },
  { id: 'darjeeling', name: 'Darjeeling', state: 'West Bengal', isActive: true, isPopular: true, lat: 27.0410, lng: 88.2663 },

  // --- UTTAR PRADESH ---
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 26.8467, lng: 80.9462 },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 26.4499, lng: 80.3319 },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 25.3176, lng: 82.9739 },
  { id: 'agra', name: 'Agra', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 27.1767, lng: 78.0081 },
  { id: 'prayagraj', name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', isActive: true, lat: 25.4358, lng: 81.8463 },
  { id: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', isActive: true, lat: 28.9845, lng: 77.7064 },
  { id: 'gorakhpur', name: 'Gorakhpur', state: 'Uttar Pradesh', isActive: true, lat: 26.7606, lng: 83.3732 },
  { id: 'mathura', name: 'Mathura & Vrindavan', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 27.4924, lng: 77.6737 },
  { id: 'ayodhya', name: 'Ayodhya', state: 'Uttar Pradesh', isActive: true, isPopular: true, lat: 26.7922, lng: 82.1998 },
  { id: 'bareilly', name: 'Bareilly', state: 'Uttar Pradesh', isActive: true, lat: 28.3670, lng: 79.4304 },
  { id: 'aligarh', name: 'Aligarh', state: 'Uttar Pradesh', isActive: true, lat: 27.8974, lng: 78.0880 },

  // --- MADHYA PRADESH ---
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', isActive: true, isPopular: true, lat: 22.7196, lng: 75.8577 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', isActive: true, isPopular: true, lat: 23.2599, lng: 77.4126 },
  { id: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', isActive: true, lat: 26.2183, lng: 78.1828 },
  { id: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', isActive: true, lat: 23.1815, lng: 79.9864 },
  { id: 'ujjain', name: 'Ujjain', state: 'Madhya Pradesh', isActive: true, isPopular: true, lat: 23.1765, lng: 75.7885 },

  // --- PUNJAB, HARYANA & CHANDIGARH ---
  { id: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', isActive: true, isPopular: true, lat: 30.7333, lng: 76.7794 },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', isActive: true, isPopular: true, lat: 30.9010, lng: 75.8573 },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', isActive: true, isPopular: true, lat: 31.6340, lng: 74.8723 },
  { id: 'jalandhar', name: 'Jalandhar', state: 'Punjab', isActive: true, lat: 31.3260, lng: 75.5762 },
  { id: 'patiala', name: 'Patiala', state: 'Punjab', isActive: true, lat: 30.3398, lng: 76.3869 },
  { id: 'panipat', name: 'Panipat', state: 'Haryana', isActive: true, lat: 29.3909, lng: 76.9635 },
  { id: 'karnal', name: 'Karnal', state: 'Haryana', isActive: true, lat: 29.6857, lng: 76.9905 },

  // --- KERALA ---
  { id: 'kochi', name: 'Kochi (Cochin)', state: 'Kerala', isActive: true, isPopular: true, lat: 9.9312, lng: 76.2673 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', isActive: true, isPopular: true, lat: 8.5241, lng: 76.9366 },
  { id: 'kozhikode', name: 'Kozhikode (Calicut)', state: 'Kerala', isActive: true, lat: 11.2588, lng: 75.7804 },
  { id: 'thrissur', name: 'Thrissur', state: 'Kerala', isActive: true, lat: 10.5276, lng: 76.2144 },

  // --- GOA ---
  { id: 'goa', name: 'Goa (Panaji, Calangute, Margao)', state: 'Goa', isActive: true, isPopular: true, lat: 15.2993, lng: 74.1240 },

  // --- BIHAR & JHARKHAND ---
  { id: 'patna', name: 'Patna', state: 'Bihar', isActive: true, isPopular: true, lat: 25.5941, lng: 85.1376 },
  { id: 'gaya', name: 'Gaya / Bodh Gaya', state: 'Bihar', isActive: true, lat: 24.7914, lng: 85.0002 },
  { id: 'muzaffarpur', name: 'Muzaffarpur', state: 'Bihar', isActive: true, lat: 26.1209, lng: 85.3647 },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', isActive: true, isPopular: true, lat: 23.3441, lng: 85.3096 },
  { id: 'jamshedpur', name: 'Jamshedpur (Tata)', state: 'Jharkhand', isActive: true, lat: 22.8046, lng: 86.2029 },
  { id: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', isActive: true, lat: 23.7957, lng: 86.4304 },

  // --- ODISHA & CHHATTISGARH ---
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', isActive: true, isPopular: true, lat: 20.2961, lng: 85.8245 },
  { id: 'cuttack', name: 'Cuttack', state: 'Odisha', isActive: true, lat: 20.4625, lng: 85.8828 },
  { id: 'puri', name: 'Puri', state: 'Odisha', isActive: true, isPopular: true, lat: 19.8135, lng: 85.8312 },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', isActive: true, isPopular: true, lat: 21.2514, lng: 81.6296 },
  { id: 'bilaspur', name: 'Bilaspur', state: 'Chhattisgarh', isActive: true, lat: 22.0797, lng: 82.1409 },

  // --- UTTARAKHAND & HIMACHAL PRADESH ---
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', isActive: true, isPopular: true, lat: 30.3165, lng: 78.0322 },
  { id: 'haridwar-rishikesh', name: 'Haridwar & Rishikesh', state: 'Uttarakhand', isActive: true, isPopular: true, lat: 29.9457, lng: 78.1642 },
  { id: 'nainital', name: 'Nainital', state: 'Uttarakhand', isActive: true, lat: 29.3919, lng: 79.4542 },
  { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', isActive: true, lat: 30.4598, lng: 78.0644 },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', isActive: true, isPopular: true, lat: 31.1048, lng: 77.1734 },
  { id: 'manali', name: 'Manali & Kullu', state: 'Himachal Pradesh', isActive: true, isPopular: true, lat: 32.2432, lng: 77.1892 },

  // --- JAMMU & KASHMIR & LADAKH ---
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', isActive: true, isPopular: true, lat: 34.0837, lng: 74.7973 },
  { id: 'jammu', name: 'Jammu', state: 'Jammu & Kashmir', isActive: true, lat: 32.7266, lng: 74.8570 },
  { id: 'leh', name: 'Leh & Ladakh', state: 'Ladakh', isActive: true, isPopular: true, lat: 34.1526, lng: 77.5771 },

  // --- NORTHEAST INDIA ---
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', isActive: true, isPopular: true, lat: 26.1445, lng: 91.7362 },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', isActive: true, lat: 25.5788, lng: 91.8933 },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', isActive: true, lat: 27.3389, lng: 88.6065 },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', isActive: true, lat: 23.8315, lng: 91.2868 },
  { id: 'imphal', name: 'Imphal', state: 'Manipur', isActive: true, lat: 24.8170, lng: 93.9368 },
  { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', isActive: true, lat: 23.7307, lng: 92.7173 },
  { id: 'kohima', name: 'Kohima', state: 'Nagaland', isActive: true, lat: 25.6751, lng: 94.1086 },
  { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', isActive: true, lat: 27.0844, lng: 93.6053 },
];
