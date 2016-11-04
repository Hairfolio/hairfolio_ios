import ServiceBackend from './ServiceBackend.js'

export async function getHairfolios() {
  let val = await ServiceBackend.get('hairfolios');
  console.log('res hairfolio', val);
  return val;
}
