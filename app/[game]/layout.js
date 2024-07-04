import "../globals.css";

// TODO: 暫時先這樣、測試的game room id，但到時候可能需要是流水號 (由首頁產出)
export async function generateStaticParams() {

  const params = [{ game: 'test' }];

  return params;
}

export default function RootLayout({
  children,
}) {
  return (
    <div>
      {children}
    </div>
  );
}
