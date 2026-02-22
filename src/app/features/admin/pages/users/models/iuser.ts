export interface IUsersResponse {
  status: string;
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    totalRecords: number;
  };
  data: IUser[];
}

export interface IUserResponse {
  status: string;
  data: IUser;
}

export interface IUser {
  active: boolean;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  _id: string;
}
