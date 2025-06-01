export enum TableStatus {
  Available = 'available',
  Occupied = 'occupied',
  Reserved = 'reserved', // optional, if you plan to support reservations
  Closed = 'closed'       // optional, for finalized tables
}
