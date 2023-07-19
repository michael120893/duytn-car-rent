export enum OrderStatus {
  Renting = 1,
  Returned = 2,
}

export enum PaymenMethod {
  Cash = 1,
  CreditCard = 2,
  DebitCard = 3,
  Paypal = 4,
  MobileWallets = 5,
}

export enum PaymentStatus {
  Pending = 1,
  Paid = 2,
  Failed = 3,
}

export enum Coupon {
  Percentage = 1,
  FixedAmount = 2,
}
