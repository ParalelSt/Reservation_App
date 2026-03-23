import { FACILITIES } from '@/lib/constants/facilities';
import { FacilityDetail } from '@/components/facilities/FacilityDetail';

export default function GymPage() {
  const facility = FACILITIES.find((f) => f.type === 'gym')!;
  return <FacilityDetail facility={facility} />;
}
