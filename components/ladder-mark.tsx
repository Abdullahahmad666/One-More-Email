/** The ladder, five bars, as a mark. The logo is the product. */
export function LadderMark({ size = 14 }: { size?: number }) {
  const tokens = [
    "--t5-final",
    "--t4-disappointed",
    "--t3-concerned",
    "--t2-gentle",
    "--t1-friendly",
  ];

  return (
    <span aria-hidden className="flex flex-col justify-between gap-[2px]">
      {tokens.map((token, i) => (
        <span
          key={token}
          className="block h-[2px] rounded-full"
          style={{
            width: size - i * 1.5,
            background: `var(${token})`,
            opacity: 0.45 + i * 0.14,
          }}
        />
      ))}
    </span>
  );
}
