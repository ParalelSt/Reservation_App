import { FACILITIES } from '@/lib/constants/facilities';
import { FacilityDetail } from '@/components/facilities/FacilityDetail';

export default function SaunaPage() {
  const facility = FACILITIES.find((f) => f.type === 'sauna')!;
  return <FacilityDetail facility={facility} />;
}
