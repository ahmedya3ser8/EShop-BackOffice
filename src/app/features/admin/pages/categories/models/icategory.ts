export interface ICategoryResponse {
  status: string;
  data: ICategoryData;
}

export interface ICategoriesReponse {
  status: string;
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    totalRecords: number;
    nextPage: number;
  };
  data: ICategoryData[];
}

export interface ICategoryData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
