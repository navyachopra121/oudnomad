import WaxSealMedallion from './WaxSealMedallion';

type Props = { variant?: 'ivory' | 'obsidian' };

/** Room-transition divider with wax-seal medallion */
export default function WaxSealDivider({ variant = 'ivory' }: Props) {
  return (
    <div className={variant === 'obsidian' ? 'bg-champagne-sand/25' : 'bg-ivory'} aria-hidden>
      <WaxSealMedallion surface={variant === 'obsidian' ? 'obsidian' : 'ivory'} />
    </div>
  );
}
