
export interface ExcelRow {
  cccd: string;
  so_tien: number;
}

export interface ImportError {
  cccd: string;
  reason: string;
}

export interface CreateFeeAssignmentInput {
  householdId: number;
  feeId: number;
  amountDue: number;
  dueDate: Date;
}

