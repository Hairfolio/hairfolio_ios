import ServiceBackend from './ServiceBackend';

export async function getHairfolios() {
  let val = await ServiceBackend.get('hairfolios');
  return val;
}
