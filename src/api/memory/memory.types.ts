/* ---------------- pares ---------------- */
export interface MemoryPairDTO {
  id:     string;
  name:   string;
  imgUrl: string;
}

export interface CreatePairDTO  extends Omit<MemoryPairDTO, 'id'> { id: string; }
export type     UpdatePairDTO  = Partial<Omit<MemoryPairDTO, 'id'>>;

/* ---------------- sets ---------------- */
export interface MemorySetDTO {
  id:    string;
  title: string;
  total: number;              // nº de parejas (lo calcula el backend)
  pairs?: MemoryPairDTO[];    // solo cuando pedimos detalle
}

export interface CreateMemorySetDTO { id: string; title: string; }
export interface UpdateMemorySetDTO { title?: string; }
