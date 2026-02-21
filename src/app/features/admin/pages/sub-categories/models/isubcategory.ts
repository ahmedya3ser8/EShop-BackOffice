export interface ISubCategoryResponse {
  status: string;
  data: ISubCategoryData;
}

export interface ISubCategoriesReponse {
  status: string;
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    totalRecords: number;
    nextPage: number;
  };
  data: ISubCategoryData[];
}

export interface ISubCategoryData {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
