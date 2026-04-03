
export type BloodGroup = 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG';

export const canDonate = (donorGroup: string, recipientGroup: string): boolean => {
  const donor = donorGroup as BloodGroup;
  const recipient = recipientGroup as BloodGroup;

  const matrix: Record<BloodGroup, BloodGroup[]> = {
    O_NEG: ['O_POS', 'O_NEG', 'A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG'],
    O_POS: ['O_POS', 'A_POS', 'B_POS', 'AB_POS'],
    A_NEG: ['A_POS', 'A_NEG', 'AB_POS', 'AB_NEG'],
    A_POS: ['A_POS', 'AB_POS'],
    B_NEG: ['B_POS', 'B_NEG', 'AB_POS', 'AB_NEG'],
    B_POS: ['B_POS', 'AB_POS'],
    AB_NEG: ['AB_POS', 'AB_NEG'],
    AB_POS: ['AB_POS'],
  };

  return matrix[donor]?.includes(recipient) || false;
};

export const getCompatibleDonors = (recipientGroup: string): BloodGroup[] => {
  const groups: BloodGroup[] = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
  return groups.filter(donor => canDonate(donor, recipientGroup));
};
