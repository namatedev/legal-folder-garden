export interface CourtOfAppeal {
  id: string;
  name: string;
  arabicName: string;
}

export const COURTS_OF_APPEAL: CourtOfAppeal[] = [
  {
    id: 'rabat',
    name: 'Cour d\'Appel de Rabat',
    arabicName: 'محكمة الاستئناف بالرباط'
  },
  {
    id: 'casablanca',
    name: 'Cour d\'Appel de Casablanca',
    arabicName: 'محكمة الاستئناف بالدار البيضاء'
  },
  {
    id: 'kenitra',
    name: 'Cour d\'Appel de Kénitra',
    arabicName: 'محكمة الاستئناف بالقنيطرة'
  },
  {
    id: 'fes',
    name: 'Cour d\'Appel de Fès',
    arabicName: 'محكمة الاستئناف بفاس'
  },
  {
    id: 'meknes',
    name: 'Cour d\'Appel de Meknès',
    arabicName: 'محكمة الاستئناف بمكناس'
  },
  {
    id: 'marrakech',
    name: 'Cour d\'Appel de Marrakech',
    arabicName: 'محكمة الاستئناف بمراكش'
  },
  {
    id: 'agadir',
    name: 'Cour d\'Appel d\'Agadir',
    arabicName: 'محكمة الاستئناف بأكادير'
  },
  {
    id: 'oujda',
    name: 'Cour d\'Appel d\'Oujda',
    arabicName: 'محكمة الاستئناف بوجدة'
  },
  {
    id: 'tetouan',
    name: 'Cour d\'Appel de Tétouan',
    arabicName: 'محكمة الاستئناف بتطوان'
  },
  {
    id: 'laayoune',
    name: 'Cour d\'Appel de Laâyoune',
    arabicName: 'محكمة الاستئناف بالعيون'
  }
];

export interface FirstInstanceTribunal {
  id: string;
  name: string;
  arabicName: string;
  courtOfAppealId: string;
}

export const FIRST_INSTANCE_TRIBUNALS: FirstInstanceTribunal[] = [
  // Rabat Court of Appeal
  {
    id: 'rabat-tgi',
    name: 'Tribunal de Grande Instance de Rabat',
    arabicName: 'المحكمة الابتدائية بالرباط',
    courtOfAppealId: 'rabat'
  },
  {
    id: 'sale-tgi',
    name: 'Tribunal de Grande Instance de Salé',
    arabicName: 'المحكمة الابتدائية بسلا',
    courtOfAppealId: 'rabat'
  },
  {
    id: 'temara-tgi',
    name: 'Tribunal de Grande Instance de Témara',
    arabicName: 'المحكمة الابتدائية بتمارة',
    courtOfAppealId: 'rabat'
  },
  
  // Casablanca Court of Appeal
  {
    id: 'casablanca-tgi',
    name: 'Tribunal de Grande Instance de Casablanca',
    arabicName: 'المحكمة الابتدائية بالدار البيضاء',
    courtOfAppealId: 'casablanca'
  },
  {
    id: 'mohammedia-tgi',
    name: 'Tribunal de Grande Instance de Mohammedia',
    arabicName: 'المحكمة الابتدائية بالمحمدية',
    courtOfAppealId: 'casablanca'
  },
  {
    id: 'settat-tgi',
    name: 'Tribunal de Grande Instance de Settat',
    arabicName: 'المحكمة الابتدائية بسطات',
    courtOfAppealId: 'casablanca'
  },
  
  // Kénitra Court of Appeal
  {
    id: 'kenitra-tgi',
    name: 'Tribunal de Grande Instance de Kénitra',
    arabicName: 'المحكمة الابتدائية بالقنيطرة',
    courtOfAppealId: 'kenitra'
  },
  {
    id: 'sidi-kacem-tgi',
    name: 'Tribunal de Grande Instance de Sidi Kacem',
    arabicName: 'المحكمة الابتدائية بسيدي قاسم',
    courtOfAppealId: 'kenitra'
  },
  
  // Fès Court of Appeal
  {
    id: 'fes-tgi',
    name: 'Tribunal de Grande Instance de Fès',
    arabicName: 'المحكمة الابتدائية بفاس',
    courtOfAppealId: 'fes'
  },
  {
    id: 'taza-tgi',
    name: 'Tribunal de Grande Instance de Taza',
    arabicName: 'المحكمة الابتدائية بتازة',
    courtOfAppealId: 'fes'
  },
  
  // Marrakech Court of Appeal
  {
    id: 'marrakech-tgi',
    name: 'Tribunal de Grande Instance de Marrakech',
    arabicName: 'المحكمة الابتدائية بمراكش',
    courtOfAppealId: 'marrakech'
  },
  {
    id: 'essaouira-tgi',
    name: 'Tribunal de Grande Instance d\'Essaouira',
    arabicName: 'المحكمة الابتدائية بالصويرة',
    courtOfAppealId: 'marrakech'
  }
];

export const getCourtOfAppealById = (id: string): CourtOfAppeal | undefined => {
  return COURTS_OF_APPEAL.find(court => court.id === id);
};

export const getFirstInstanceTribunalById = (id: string): FirstInstanceTribunal | undefined => {
  return FIRST_INSTANCE_TRIBUNALS.find(tribunal => tribunal.id === id);
};

export const getTribunalsByCourtOfAppeal = (courtOfAppealId: string): FirstInstanceTribunal[] => {
  return FIRST_INSTANCE_TRIBUNALS.filter(tribunal => tribunal.courtOfAppealId === courtOfAppealId);
};