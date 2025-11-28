export const paymentMethods = [
  {
    id: 1,
    name: "Thanh toán khi nhận hàng",
    code: "cod",
  },

  {
    id: 2,
    name: "Chuyển khoản ngân hàng",
    code: "bank_transfer",
  },
];

export const paymentAccounts = [
  {
    id: 1,
    paymentMethodId: 1,
    accountName: "Nguyễn Đức Vinh",
    accountNumber: "3845632968",
    bankName: "Techcombank",
  },
];
