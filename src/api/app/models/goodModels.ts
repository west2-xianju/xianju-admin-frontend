export interface GoodInfo {
  good_id?: string;
  seller_id: string;
  state?: String;
  game: String;
  title: String;
  price: String;
  detail: String;
  publish_time?: String;
}

export interface GoodForm {
  good_id?: string;
  seller_id?: string;
  state?: String;
  game?: String;
  title?: String;
  price?: String;
  detail?: String;
  publish_time?: String;
}

export interface getGoodListQuery {
  good_id?: string;
  seller_id?: string;
  state?: String;
  game?: String;
  title?: String;
  price?: String;
  detail?: String;
  publish_time?: String;
  order_by?: String;
  order?: String;
  page?: Number;
  limit?: Number;
}

export interface GoodList {
  goods: Array<GoodInfo>;
  count: number;
  page: number;
}

// export GoodStateEnum = 'pending' | 'realeased'
