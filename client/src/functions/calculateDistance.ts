export function calculateDistance(props: any, round: (num: number) => number) {
  return (lat1: number, long1: number) => {
    let lat2 = props.location.lat;
    let long2 = props.location.long;
    let R = 6371e3; // metres
    let φ1 = (lat1 * Math.PI) / 180;
    let φ2 = (lat2 * Math.PI) / 180;
    let Δφ = ((lat2 - lat1) * Math.PI) / 180;
    let Δλ = ((long2 - long1) * Math.PI) / 180;
    let a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    d = d / 1609.344; // meters to miles
    d = round(d);
    return d;
  };
}