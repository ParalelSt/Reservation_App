import { FACILITIES } from '@/lib/constants/facilities';
import { FacilityDetail } from '@/components/facilities/FacilityDetail';

export default function StudioPage() {
  const facility = FACILITIES.find((f) => f.type === 'studio')!;
  return <FacilityDetail facility={facility} />;
}
