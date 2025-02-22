export enum OrderStatus {
  PENDING = 'PENDING', // Order is not yet processed
  IN_PROGRESS = 'IN_PROGRESS', // Order is being prepared
  COMPLETED = 'COMPLETED', // Order is completed and served
  CANCELLED = 'CANCELLED', // Order is cancelled
}
