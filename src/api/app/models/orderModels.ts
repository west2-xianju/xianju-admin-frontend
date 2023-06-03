export interface OrderInfo {
  order_id?: string;
  from_id: string;
  to_id: string;
  good_id: string;
  state?: String;
  price?: String;
  create_time?: String;
  pay_time?: String;
  complete_time?: String;
}
export interface getOrderListQuery {
  order_id?: string;
  from_id?: string;
  to_id?: string;
  good_id?: string;
  state?: String;
  price?: String;
  create_time?: String;
  pay_time?: String;
  complete_time?: String;
  order_by?: String;
  order?: String;
  page?: Number;
  limit?: Number;
}

export interface OrderList {
  orders: Array<OrderInfo>;
  count: number;
  page: number;
}
