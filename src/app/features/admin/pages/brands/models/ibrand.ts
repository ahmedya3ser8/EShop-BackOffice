export interface IBrandResponse {
  status: string;
  data: IBrandData;
}

export interface IBrandsReponse {
  status: string;
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    totalRecords: number;
    nextPage: number;
  };
  data: IBrandData[];
}

export interface IBrandData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
