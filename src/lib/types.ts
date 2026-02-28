
export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Expense = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
};

export const SUPPORTED_CURRENCIES = [
  { label: 'Rupees (Rs)', symbol: 'Rs' },
  { label: 'US Dollar ($)', symbol: '$' },
  { label: 'Euro (€)', symbol: '€' },
  { label: 'Pound (£)', symbol: '£' },
  { label: 'Yuan (CN¥)', symbol: 'CN¥' },
  { label: 'Dinar (Dinar)', symbol: 'Dinar' },
  { label: 'Yen (¥)', symbol: '¥' },
  { label: 'Lira (₺)', symbol: '₺' },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', icon: 'Utensils', color: '#FF6B6B' },
  { id: '2', name: 'Transport', icon: 'Bus', color: '#4DABF7' },
  { id: '3', name: 'Entertainment', icon: 'Film', color: '#9775FA' },
  { id: '4', name: 'Shopping', icon: 'ShoppingBag', color: '#FCC419' },
  { id: '5', name: 'Health', icon: 'HeartPulse', color: '#51CF66' },
  { id: '6', name: 'Utilities', icon: 'Zap', color: '#FF922B' },
  { id: '7', name: 'Miscellaneous', icon: 'LayoutGrid', color: '#868E96' },
];
