import Box from "@mui/material/Box";

type TxInfoProps = {
  inProgress: boolean;
  transaction: any;
  receiptInProgress: boolean;
  receipt: unknown;
  error: Error | null;
  receiptError: Error | null;
};
export function TxInfo({
  inProgress,
  transaction,
  receiptInProgress,
  receipt,
  error,
  receiptError,
}: TxInfoProps) {
  return (
    <Box
      sx={{
        overflow: "auto",
      }}
    >
      {inProgress && <div>Transaction pending...</div>}
      {transaction && (
        <div>
          <div>Transaction Hash: {transaction?.hash}</div>
          <div>
            Transaction Receipt:
            {receiptInProgress ? (
              <span>pending...</span>
            ) : (
              <pre>{JSON.stringify(receipt, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {error && <div>Error: {error?.message}</div>}
      {receiptError && <div>Receipt Error: {receiptError?.message}</div>}
    </Box>
  );
}
