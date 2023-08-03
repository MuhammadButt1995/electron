import { Check, AlertTriangle, XCircle } from 'lucide-react';

import { FminfoRating, CardClasses } from '@/components/fminfo/ui/info-card';
import { Badge } from '@/components/ui/badge';

type InfoCardBadgeProps = {
  rating: FminfoRating;
  cardClasses: CardClasses;
  children: React.ReactNode;
};

const InfoCardBadge = ({
  rating,
  children,
  cardClasses,
}: InfoCardBadgeProps) => {
  const badgeIconMapping = {
    ok: <Check className={`w-4 h-4 ${cardClasses.foreground}`} />,
    warn: <AlertTriangle className={`w-4 h-4 ${cardClasses.foreground}`} />,
    error: <XCircle className={`w-4 h-4 ${cardClasses.foreground}`} />,
  };

  return (
    <Badge
      className={`${cardClasses.background} shadow-sm rounded-xl`}
      variant='outline'
    >
      <div className='flex items-center justify-around py-1 space-x-2'>
        <div>{badgeIconMapping[rating]}</div>
        <p className={`${cardClasses.foreground}`}>{children}</p>
      </div>
    </Badge>
  );
};

export default InfoCardBadge;
