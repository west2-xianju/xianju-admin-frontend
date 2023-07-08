export interface adminInfo {
  admin_id?: String;
  username?: String;
  level?: String;
  create_time?: String;
}

export interface UpdateAdminInfo {
  admin_id?: String;
  username?: String;
  level?: String;
  create_time?: String;
}
export interface getAdminListQuery {
  admin_id?: String;
  username?: String;
  level?: String;
  create_time?: String;
  order_by?: String;
  order?: String;
  page?: Number;
  limit?: Number;
}

export interface adminList {
  admins: Array<adminInfo>;
  count: number;
  page: number;
}
