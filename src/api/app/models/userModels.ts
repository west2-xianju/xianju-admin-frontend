export interface userInfo {
  user_id: String;
  username: String;
  nickname?: String;
  email: String;
  id_number?: String;
  realname?: String;
  register_time?: String;
  blocked: Boolean;
  profile?: String;
}

export interface UpdateUserInfo {
  user_id?: String;
  username?: String;
  nickname?: String;
  email?: String;
  id_number?: String;
  realname?: String;
  register_time?: String;
  blocked?: Boolean;
}
export interface getUserListQuery {
  username?: String;
  nickname?: String;
  user_id?: String;
  email?: String;
  id_number?: String;
  realname?: String;
  order_by?: String;
  order?: String;
  page?: Number;
  limit?: Number;
}

export interface userList {
  users: Array<userInfo>;
  count: number;
  page: number;
}
