export interface IBrandResponse {
  data: IBrandData;
}

export interface IBrandsReponse {
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
