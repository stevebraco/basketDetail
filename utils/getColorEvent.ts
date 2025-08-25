export function getColorForEvent(eventType: string) {
  switch (eventType) {
    case "rebond_off":
      return "orange";
    case "rebond_def":
      return "lightblue";
    case "interception":
      return "green";
    case "perte_de_balle":
      return "red";
    default:
      return "purple";
  }
}
