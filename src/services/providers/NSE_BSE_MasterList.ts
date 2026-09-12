export interface MasterStockEntry {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  bseCode: string;
  isin: string;
  sector: string;
  industry: string;
  basePrice: number;
  marketCap: number; // Crores
  beta: number;
}

export const NSE_BSE_MASTER_STOCKS: MasterStockEntry[] = [
  // NIFTY 50 & Heavyweights
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited', exchange: 'NSE', bseCode: '500325', isin: 'INE002A01018', sector: 'Energy & Petrochemicals', industry: 'Refineries / Telecom / Retail', basePrice: 2984.50, marketCap: 2018450, beta: 1.05 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Limited', exchange: 'NSE', bseCode: '532540', isin: 'INE467B01029', sector: 'Information Technology', industry: 'IT Services & Consulting', basePrice: 4215.80, marketCap: 1525600, beta: 0.78 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', exchange: 'NSE', bseCode: '500180', isin: 'INE040A01034', sector: 'Financial Services', industry: 'Private Sector Bank', basePrice: 1678.30, marketCap: 1276400, beta: 1.12 },
  { symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', bseCode: '500209', isin: 'INE009A01021', sector: 'Information Technology', industry: 'IT Services & Software', basePrice: 1845.20, marketCap: 768900, beta: 0.92 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', exchange: 'NSE', bseCode: '532174', isin: 'INE090A01021', sector: 'Financial Services', industry: 'Private Sector Bank', basePrice: 1242.60, marketCap: 874500, beta: 1.08 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', exchange: 'NSE', bseCode: '500570', isin: 'INE155A01022', sector: 'Automobile', industry: 'Commercial & Passenger Vehicles / EV', basePrice: 1048.90, marketCap: 387600, beta: 1.34 },
  { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', bseCode: '500875', isin: 'INE154A01025', sector: 'Fast Moving Consumer Goods (FMCG)', industry: 'Diversified FMCG / Hotels / Paper', basePrice: 486.30, marketCap: 607800, beta: 0.65 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', exchange: 'NSE', bseCode: '532454', isin: 'INE397D01024', sector: 'Telecommunication', industry: 'Telecom Services & Digital', basePrice: 1612.40, marketCap: 918700, beta: 0.88 },
  { symbol: 'LT', name: 'Larsen & Toubro Limited', exchange: 'NSE', bseCode: '500510', isin: 'INE018A01030', sector: 'Capital Goods & Infrastructure', industry: 'Heavy Engineering & Construction', basePrice: 3680.00, marketCap: 506200, beta: 1.15 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', bseCode: '500112', isin: 'INE062A01020', sector: 'Financial Services', industry: 'Public Sector Bank', basePrice: 814.20, marketCap: 726800, beta: 1.25 },
  { symbol: 'TITAN', name: 'Titan Company Limited', exchange: 'NSE', bseCode: '500114', isin: 'INE280A01028', sector: 'Consumer Discretionary', industry: 'Gems, Jewellery & Watches', basePrice: 3540.00, marketCap: 314200, beta: 0.95 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Limited', exchange: 'NSE', bseCode: '524715', isin: 'INE044A01036', sector: 'Healthcare & Pharmaceuticals', industry: 'Specialty Pharmaceuticals & Generics', basePrice: 1789.50, marketCap: 429400, beta: 0.58 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', exchange: 'NSE', bseCode: '500034', isin: 'INE296A01024', sector: 'Financial Services', industry: 'Non-Banking Financial Company (NBFC)', basePrice: 7280.00, marketCap: 450400, beta: 1.28 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', exchange: 'NSE', bseCode: '500696', isin: 'INE030A01027', sector: 'FMCG', industry: 'Household & Personal Products', basePrice: 2740.00, marketCap: 643800, beta: 0.62 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', exchange: 'NSE', bseCode: '500247', isin: 'INE237A01028', sector: 'Financial Services', industry: 'Private Sector Bank', basePrice: 1780.00, marketCap: 354000, beta: 1.02 },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', exchange: 'NSE', bseCode: '532215', isin: 'INE238A01034', sector: 'Financial Services', industry: 'Private Sector Bank', basePrice: 1195.00, marketCap: 368900, beta: 1.18 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', exchange: 'NSE', bseCode: '532500', isin: 'INE585B01010', sector: 'Automobile', industry: 'Passenger Cars & Utility Vehicles', basePrice: 12450.00, marketCap: 391200, beta: 0.85 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', exchange: 'NSE', bseCode: '512599', isin: 'INE423A01024', sector: 'Metals & Mining / Energy', industry: 'Trading & Infrastructure Incubation', basePrice: 3025.00, marketCap: 344800, beta: 1.65 },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd', exchange: 'NSE', bseCode: '532921', isin: 'INE742F01042', sector: 'Infrastructure', industry: 'Port Infrastructure & Logistics', basePrice: 1480.00, marketCap: 319700, beta: 1.30 },
  { symbol: 'NTPC', name: 'NTPC Limited', exchange: 'NSE', bseCode: '532555', isin: 'INE733E01010', sector: 'Utilities & Power', industry: 'Thermal & Renewable Power Generation', basePrice: 412.00, marketCap: 399500, beta: 0.95 },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Limited', exchange: 'NSE', bseCode: '532898', isin: 'INE752E01010', sector: 'Utilities & Power', industry: 'Electric Power Transmission', basePrice: 338.50, marketCap: 314800, beta: 0.75 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Limited', exchange: 'NSE', bseCode: '500312', isin: 'INE213A01029', sector: 'Energy & Oil/Gas', industry: 'Oil Exploration & Production', basePrice: 315.40, marketCap: 396800, beta: 1.15 },
  { symbol: 'COALINDIA', name: 'Coal India Limited', exchange: 'NSE', bseCode: '533278', isin: 'INE522F01014', sector: 'Mining & Metals', industry: 'Coal Mining & Distribution', basePrice: 512.00, marketCap: 315400, beta: 1.02 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', exchange: 'NSE', bseCode: '500470', isin: 'INE081A01020', sector: 'Metals & Mining', industry: 'Integrated Steel Production', basePrice: 154.60, marketCap: 193000, beta: 1.42 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Limited', exchange: 'NSE', bseCode: '500228', isin: 'INE019A01038', sector: 'Metals & Mining', industry: 'Steel Manufacturing', basePrice: 945.00, marketCap: 231000, beta: 1.38 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Limited', exchange: 'NSE', bseCode: '532281', isin: 'INE860A01027', sector: 'Information Technology', industry: 'IT Services & Digital Engineering', basePrice: 1760.00, marketCap: 477600, beta: 0.82 },
  { symbol: 'WIPRO', name: 'Wipro Limited', exchange: 'NSE', bseCode: '507685', isin: 'INE075A01022', sector: 'Information Technology', industry: 'IT Consulting & Services', basePrice: 535.00, marketCap: 279500, beta: 0.90 },
  { symbol: 'TECHM', name: 'Tech Mahindra Limited', exchange: 'NSE', bseCode: '532755', isin: 'INE669C01036', sector: 'Information Technology', industry: 'Telecom & Enterprise IT Services', basePrice: 1590.00, marketCap: 155000, beta: 1.05 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', exchange: 'NSE', bseCode: '500820', isin: 'INE021A01026', sector: 'Consumer Discretionary', industry: 'Paints, Coatings & Home Decor', basePrice: 3150.00, marketCap: 302000, beta: 0.72 },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', exchange: 'NSE', bseCode: '532977', isin: 'INE917I01010', sector: 'Automobile', industry: '2-Wheeler & 3-Wheeler Manufacturing', basePrice: 10650.00, marketCap: 298000, beta: 0.88 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Limited', exchange: 'NSE', bseCode: '500182', isin: 'INE158A01026', sector: 'Automobile', industry: 'Motorcycles & Scooters', basePrice: 5480.00, marketCap: 109500, beta: 0.92 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Limited', exchange: 'NSE', bseCode: '505200', isin: 'INE066A01021', sector: 'Automobile', industry: 'Royal Enfield Motorcycles & CVs', basePrice: 4890.00, marketCap: 133800, beta: 0.95 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited', exchange: 'NSE', bseCode: '532538', isin: 'INE481G01011', sector: 'Construction Materials', industry: 'Grey Cement & Ready Mix Concrete', basePrice: 11400.00, marketCap: 329000, beta: 0.98 },
  { symbol: 'GRASIM', name: 'Grasim Industries Limited', exchange: 'NSE', bseCode: '500300', isin: 'INE047A01021', sector: 'Diversified / Chemicals', industry: 'VSF, Chemicals & Paints (Birla Opus)', basePrice: 2680.00, marketCap: 182000, beta: 1.10 },
  { symbol: 'NESTLEIND', name: 'Nestle India Limited', exchange: 'NSE', bseCode: '500790', isin: 'INE239A01016', sector: 'FMCG', industry: 'Packaged Foods & Beverages', basePrice: 2490.00, marketCap: 240000, beta: 0.55 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Limited', exchange: 'NSE', bseCode: '500825', isin: 'INE216A01030', sector: 'FMCG', industry: 'Biscuits, Dairy & Bakery Products', basePrice: 5850.00, marketCap: 140800, beta: 0.60 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Limited', exchange: 'NSE', bseCode: '500800', isin: 'INE192A01025', sector: 'FMCG', industry: 'Tea, Coffee, Salt, Sampann Staples', basePrice: 1180.00, marketCap: 112000, beta: 0.70 },
  { symbol: 'CIPLA', name: 'Cipla Limited', exchange: 'NSE', bseCode: '500087', isin: 'INE059A01026', sector: 'Pharmaceuticals', industry: 'Respiratory & Formulation Generics', basePrice: 1620.00, marketCap: 130800, beta: 0.52 },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited', exchange: 'NSE', bseCode: '500124', isin: 'INE089A01023', sector: 'Pharmaceuticals', industry: 'Global Generics & Biosimilars', basePrice: 6850.00, marketCap: 114200, beta: 0.58 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited', exchange: 'NSE', bseCode: '508869', isin: 'INE437A01024', sector: 'Healthcare', industry: 'Multi-specialty Hospitals & 24/7 Digital', basePrice: 6920.00, marketCap: 99500, beta: 0.85 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Limited', exchange: 'NSE', bseCode: '500440', isin: 'INE038A01020', sector: 'Metals & Mining', industry: 'Aluminium & Copper (Novelis)', basePrice: 685.00, marketCap: 154000, beta: 1.45 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited', exchange: 'NSE', bseCode: '500547', isin: 'INE029A01011', sector: 'Energy', industry: 'Oil Refining & Marketing', basePrice: 345.00, marketCap: 149600, beta: 1.10 },
  
  // Midcap, Smallcap & New-Age Leaders
  { symbol: 'ZOMATO', name: 'Zomato Limited', exchange: 'NSE', bseCode: '543320', isin: 'INE758T01015', sector: 'Consumer Tech', industry: 'Food Delivery & Quick Commerce (Blinkit)', basePrice: 268.50, marketCap: 237000, beta: 1.35 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Limited', exchange: 'NSE', bseCode: '543940', isin: 'INE758E01017', sector: 'Financial Services', industry: 'Digital NBFC, AMC & Payments', basePrice: 345.20, marketCap: 219300, beta: 1.20 },
  { symbol: 'TRENT', name: 'Trent Limited', exchange: 'NSE', bseCode: '500251', isin: 'INE849A01020', sector: 'Consumer Discretionary', industry: 'Retail & Fast Fashion (Zudio / Westside)', basePrice: 7120.00, marketCap: 253100, beta: 1.18 },
  { symbol: 'BEL', name: 'Bharat Electronics Limited', exchange: 'NSE', bseCode: '500049', isin: 'INE263A01024', sector: 'Capital Goods & Aerospace', industry: 'Defense Electronics & Radar Systems', basePrice: 304.50, marketCap: 222600, beta: 1.12 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Limited', exchange: 'NSE', bseCode: '541154', isin: 'INE866R01028', sector: 'Defense & Aerospace', industry: 'Fighter Jets, Helicopters & Engines', basePrice: 4850.00, marketCap: 324300, beta: 1.25 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Limited', exchange: 'NSE', bseCode: '542649', isin: 'INE415G01027', sector: 'Infrastructure', industry: 'Rail Infrastructure & Metro Projects', basePrice: 585.00, marketCap: 121900, beta: 1.55 },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Dev Agency Ltd', exchange: 'NSE', bseCode: '544026', isin: 'INE202E01016', sector: 'Financial Services', industry: 'Green Energy NBFC Financing', basePrice: 242.00, marketCap: 65000, beta: 1.45 },
  { symbol: 'SUZLON', name: 'Suzlon Energy Limited', exchange: 'NSE', bseCode: '532667', isin: 'INE040H01021', sector: 'Energy & Renewables', industry: 'Wind Turbine Generator Systems', basePrice: 82.50, marketCap: 112500, beta: 1.60 },
  { symbol: 'POLYCAB', name: 'Polycab India Limited', exchange: 'NSE', bseCode: '542652', isin: 'INE455K01017', sector: 'Capital Goods', industry: 'Wires, Cables & Fast Moving Electrical Goods', basePrice: 6850.00, marketCap: 102800, beta: 1.05 },
  { symbol: 'DIXON', name: 'Dixon Technologies (India) Limited', exchange: 'NSE', bseCode: '540699', isin: 'INE935N01020', sector: 'Consumer Electronics', industry: 'Electronic Manufacturing Services (EMS)', basePrice: 12850.00, marketCap: 76900, beta: 1.30 },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Limited', exchange: 'NSE', bseCode: '542651', isin: 'INE04I401011', sector: 'Information Technology', industry: 'Automotive Embedded Software & EV Tech', basePrice: 1720.00, marketCap: 47100, beta: 1.22 },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Limited', exchange: 'NSE', bseCode: '500408', isin: 'INE670A01012', sector: 'Information Technology', industry: 'Design & Technology Services for Auto/Media', basePrice: 7850.00, marketCap: 48900, beta: 1.15 },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp Ltd', exchange: 'NSE', bseCode: '542830', isin: 'INE335Y01012', sector: 'Consumer Services', industry: 'Online Rail Ticketing & Catering Monopoly', basePrice: 945.00, marketCap: 75600, beta: 0.95 },
  { symbol: 'CDSL', name: 'Central Depository Services (India) Ltd', exchange: 'NSE', bseCode: '540515', isin: 'INE736A01011', sector: 'Financial Market Infrastructure', industry: 'Securities Depository & Demat Services', basePrice: 1540.00, marketCap: 32200, beta: 1.10 },
  { symbol: 'BSE', name: 'BSE Limited', exchange: 'NSE', bseCode: '540376', isin: 'INE118H01025', sector: 'Financial Market Infrastructure', industry: 'Stock Exchange & Derivatives Platform', basePrice: 2850.00, marketCap: 38600, beta: 1.38 },
  { symbol: 'ANGELONE', name: 'Angel One Limited', exchange: 'NSE', bseCode: '543235', isin: 'INE732I01013', sector: 'Financial Services', industry: 'Fintech Retail Stock Brokerage', basePrice: 2650.00, marketCap: 23800, beta: 1.40 },
  { symbol: 'DMART', name: 'Avenue Supermarts Limited (DMart)', exchange: 'NSE', bseCode: '540376', isin: 'INE192R01011', sector: 'Consumer Discretionary', industry: 'Value Hypermarket Supermarket Chain', basePrice: 4850.00, marketCap: 315600, beta: 0.85 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Limited', exchange: 'NSE', bseCode: '543237', isin: 'INE249Z01012', sector: 'Defense & Shipbuilding', industry: 'Submarines & Naval Warships', basePrice: 4650.00, marketCap: 93800, beta: 1.50 },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Limited', exchange: 'NSE', bseCode: '540679', isin: 'INE704P01017', sector: 'Defense & Shipbuilding', industry: 'Aircraft Carriers & Commercial Vessels', basePrice: 1980.00, marketCap: 52100, beta: 1.55 }
];
