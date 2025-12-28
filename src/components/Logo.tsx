import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="https://pub-11134a6be96f479ebe08254c1e1fa2f6.r2.dev/Gen2_logo.png"
        alt="Gen2 Wealth logo"
        width={117}
        height={25}
        priority
      />
    </div>
  );
}
