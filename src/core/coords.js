export const S = 29.5;
export const FL = 1.5;
export const H = 10;
export const FL1 = FL + H;
export const FL2 = FL + H + H;
export const TH = 16;
export const fx = p => (p - 156) / S;
export const fz = p => (p - 648) / S;
export const fz_inv = z => z * S + 648;
