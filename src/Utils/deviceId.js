export function getDeviceId() {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();   //  unique per PC
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}
